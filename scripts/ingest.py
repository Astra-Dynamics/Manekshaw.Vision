#!/usr/bin/env python3
"""
Manekshaw.Vision - Sovereign Situational Awareness & Defense OSINT
Script: scripts/ingest.py
Description: Headless ingestion engine running on a 15-minute cron.
             Fetches allowlisted Tier 1/2/3 RSS feeds, dedupes,
             runs 2-pass classification (keyword + Groq/Gemini LLM),
             resolves live YouTube stream IDs and UU playlists server-side,
             clusters breaking stories with dynamic escalation scores,
             and upserts strictly to Supabase with 30-day retention.
"""

import os
import sys
import json
import re
import time
import base64
import hashlib
import urllib.request
import urllib.parse
import urllib.error
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional, Tuple

# Try optional imports
try:
    import feedparser  # type: ignore
    HAS_FEEDPARSER = True
except ImportError:
    HAS_FEEDPARSER = False

try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
    load_dotenv('.env.local')
except ImportError:
    pass

# ====================================================================
# Configuration & Constants
# ====================================================================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INGEST_SCRIPT = os.path.abspath(__file__)
SOURCES_FILE = os.path.join(BASE_DIR, 'config', 'sources.json')
GAZETTEER_FILE = os.path.join(BASE_DIR, 'config', 'gazetteer.json')
VIDEO_CATALOGUE_FILE = os.path.join(BASE_DIR, 'src', 'data', 'videoCatalogue.ts')

SUPABASE_URL = os.environ.get('SUPABASE_URL') or os.environ.get('VITE_SUPABASE_URL') or 'https://fahbbsdgurtwmfjhtxkh.supabase.co'
SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY') or os.environ.get('VITE_SUPABASE_ANON_KEY') or ''
SUPABASE_KEY = SUPABASE_SERVICE_ROLE_KEY or os.environ.get('SUPABASE_KEY') or SUPABASE_ANON_KEY or ''

GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')

RETENTION_DAYS = 30
USER_AGENT = 'ManekshawVision-OSINT-Ingest/1.0 (+https://manvis.tech; contact@manvis.tech)'

# Global in-memory telemetry buffers for Supabase persistence
FEED_HEALTH_TELEMETRY: List[Dict[str, Any]] = []
LLM_USAGE_TELEMETRY: List[Dict[str, Any]] = []

# ====================================================================
# Helper Utilities
# ====================================================================
def is_service_role_key(key: str) -> bool:
    """Inspects Supabase JWT token payload to verify if role is 'service_role'."""
    if not key:
        return False
    # If explicitly set as SUPABASE_SERVICE_ROLE_KEY in environment
    if os.environ.get('SUPABASE_SERVICE_ROLE_KEY') and key == os.environ.get('SUPABASE_SERVICE_ROLE_KEY'):
        return True
    parts = key.split('.')
    if len(parts) == 3:
        try:
            padded = parts[1] + '=' * (-len(parts[1]) % 4)
            payload_bytes = base64.urlsafe_b64decode(padded)
            payload = json.loads(payload_bytes.decode('utf-8'))
            return payload.get('role') == 'service_role'
        except Exception:
            pass
    return False

def clean_url(url: str) -> str:
    """Strips tracking query parameters (utm_*, fbclid, etc.) from canonical links."""
    parsed = urllib.parse.urlparse(url)
    query_params = urllib.parse.parse_qsl(parsed.query)
    clean_params = [
        (k, v) for k, v in query_params 
        if not k.startswith('utm_') and k not in ('fbclid', 'gclid', 'ref', 'source')
    ]
    new_query = urllib.parse.urlencode(clean_params)
    return urllib.parse.urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, new_query, ''))

# Domains known to be Google News wrappers / search pages – always reject these
_BAD_URL_HOSTS = {
    'news.google.com', 'www.news.google.com',
}
_BAD_URL_PATTERNS = ['/search?q=', '/search?hl=', 'news.google.com/rss/', 'news.google.com/articles/']

def is_valid_article_url(url: str) -> bool:
    """
    Returns True only if url is a real article URL:
    - Has http/https scheme
    - Not a Google News wrapper or search page
    - Has a non-empty path (not just '/')
    """
    if not url:
        return False
    try:
        p = urllib.parse.urlparse(url)
        if p.scheme not in ('http', 'https'):
            return False
        if p.netloc.lower() in _BAD_URL_HOSTS:
            return False
        for bad in _BAD_URL_PATTERNS:
            if bad in url:
                return False
        # Reject bare homepages (path is empty or just '/')
        if not p.path or p.path == '/':
            return False
        return True
    except Exception:
        return False

def resolve_article_url(raw_link: str) -> tuple:
    """
    Follows up to one redirect to get the canonical article URL.
    Returns (canonical_url_or_None, publisher_domain).
    Uses a short 4s timeout; never blocks the whole run on a slow host.
    """
    if not raw_link:
        return None, ''
    # If already a clean direct URL – no need to follow redirects
    if is_valid_article_url(raw_link) and 'news.google.com' not in raw_link:
        parsed = urllib.parse.urlparse(raw_link)
        domain = parsed.netloc.lower().lstrip('www.')
        return clean_url(raw_link), domain
    # Google News / other redirect – follow HEAD to get the real URL
    try:
        req = urllib.request.Request(
            raw_link,
            method='HEAD',
            headers={'User-Agent': USER_AGENT}
        )
        with urllib.request.urlopen(req, timeout=4) as resp:
            final = resp.geturl()
    except Exception:
        # HEAD failed – try GET with a very small buffer
        try:
            req = urllib.request.Request(raw_link, headers={'User-Agent': USER_AGENT})
            with urllib.request.urlopen(req, timeout=4) as resp:
                final = resp.geturl()
        except Exception:
            return None, ''
    final = clean_url(final)
    if not is_valid_article_url(final):
        return None, ''
    domain = urllib.parse.urlparse(final).netloc.lower().lstrip('www.')
    return final, domain

def clean_html_text(raw_html: str) -> str:
    """Removes HTML tags, strips script and style blocks with contents, and normalizes whitespace."""
    if not raw_html:
        return ''
    # Strip script and style blocks including inner contents to prevent script/style leakage
    text = re.sub(r'<script\b[^>]*>.*?</script>', ' ', raw_html, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<style\b[^>]*>.*?</style>', ' ', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'&[a-zA-Z]+;', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def hash_id(value: str) -> str:
    return hashlib.sha256(value.encode('utf-8')).hexdigest()[:16]

def parse_iso_time(date_str: str) -> str:
    """Parses various date formats into an ISO-8601 UTC string."""
    now_iso = datetime.now(timezone.utc).isoformat()
    if not date_str:
        return now_iso
    formats = [
        '%a, %d %b %Y %H:%M:%S %z',
        '%a, %d %b %Y %H:%M:%S GMT',
        '%Y-%m-%dT%H:%M:%S%z',
        '%Y-%m-%dT%H:%M:%SZ',
        '%Y-%m-%d %H:%M:%S'
    ]
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str.strip(), fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt.astimezone(timezone.utc).isoformat()
        except Exception:
            continue
    return now_iso

def get_uploads_playlist_id(channel_id: str) -> str:
    """Derives YouTube uploads playlist ID (UU...) from channel ID (UC...)."""
    if channel_id and channel_id.startswith('UC'):
        return 'UU' + channel_id[2:]
    return channel_id

# ====================================================================
# Gazetteer & Geo-Resolution
# ====================================================================
class Georesolver:
    def __init__(self, gazetteer_path: str):
        self.entities = []
        self.hotspots = {}
        if os.path.exists(gazetteer_path):
            try:
                with open(gazetteer_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.entities = data.get('entities', [])
                    self.hotspots = data.get('hotspots', {})
            except Exception as e:
                print(f"[WARN] Failed to load gazetteer: {e}")

    def resolve(self, text: str) -> Tuple[List[float], str, str, Optional[str]]:
        """Returns ([lon, lat], countryCode, region, relatedHotspot)"""
        if not text or not text.strip():
            return ([86.35, 25.06], 'GLOBAL', 'global', None)

        lower = text.lower()
        
        # 1. Match configured entity clusters with word boundaries
        for ent in self.entities:
            for kw in ent.get('keywords', []):
                if re.search(r'\b' + re.escape(kw) + r'\b', lower):
                    coords = ent.get('coords') or ent.get('coordinates', [86.35, 25.06])
                    country = ent.get('countryCode') or ent.get('country', 'GLOBAL')
                    region = ent.get('region') or ent.get('theater', 'global')
                    return (coords, country, region, ent.get('hotspot'))

        # 2. Match hotspot aliases if not matched in entities
        for hid, hinfo in self.hotspots.items():
            for alias in hinfo.get('aliases', []):
                if re.search(r'\b' + re.escape(alias) + r'\b', lower):
                    coords = hinfo.get('coords') or hinfo.get('coordinates', [86.35, 25.06])
                    country = hinfo.get('countryCode') or hinfo.get('country', 'GLOBAL')
                    region = hinfo.get('region') or hinfo.get('theater', 'global')
                    return (coords, country, region, hid)

        # Default fallback: Sovereign India SOI Default
        return ([86.35, 25.06], 'GLOBAL', 'global', None)

# ====================================================================
# Pass 1: Local Deterministic Keyword Classifier
# ====================================================================
def classify_keyword(text: str) -> Tuple[str, str]:
    """Returns (category, severity)"""
    lower = text.lower()
    
    # Severity
    critical_terms = [
        'nuclear', 'ballistic missile', 'hypersonic', 'airstrike', 'intercepted',
        'mass casualty', 'invasion', 'sunk', 'killed in strike'
    ]
    high_terms = [
        'drone strike', 'missile', 'artillery', 'warship', 'destroyer', 'adiz',
        'air defense', 'sanctions', 'sabotage', 'gps jamming', 'clash'
    ]
    medium_terms = [
        'patrol', 'exercise', 'deployment', 'summit', 'briefing', 'naval drills',
        'warning', 'advisory'
    ]
    
    severity = 'low'
    if any(t in lower for t in critical_terms):
        severity = 'critical'
    elif any(t in lower for t in high_terms):
        severity = 'high'
    elif any(t in lower for t in medium_terms):
        severity = 'medium'

    # Category
    category = 'geopolitical'
    if any(t in lower for t in ['cyber', 'ransomware', 'cisa', 'malware', 'firewall', 'cable cut', 'spoofing', 'ddos', 'zero-day']):
        category = 'cyber'
    elif any(t in lower for t in ['earthquake', 'tsunami', 'volcano', 'wildfire', 'hurricane', 'cyclone', 'typhoon', 'seismic']):
        category = 'natural'
    elif any(t in lower for t in ['oil', 'crude', 'tanker', 'opec', 'trade', 'tariff', 'sanctions', 'lng', 'freight', 'semiconductor']):
        category = 'economic'
    elif any(t in lower for t in ['army', 'navy', 'air force', 'missile', 'strike', 'combat', 'warhead', 'pla', 'idf', 'nato', 'centcom', 'armed forces', 'artillery', 'warship', 'destroyer']):
        category = 'military'

    return (category, severity)

# ====================================================================
# Pass 2: Batched LLM Classifier (Groq Primary -> Gemini Failover)
# ====================================================================
def classify_batch_llm(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Refines summaries, category, and severity using Groq / Gemini with strict temperature: 0."""
    if not items or (not GROQ_API_KEY and not GEMINI_API_KEY):
        return items

    # Sort items by Pass 1 severity (critical > high > medium > low) before slicing [:15]
    sev_rank = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
    sorted_items = sorted(items, key=lambda it: sev_rank.get(it.get('severity', 'low'), 3))

    # Prepare minimal payload for LLM grounding (by ID only)
    prompt_items = [
        {"id": it["id"], "title": it["title"], "summary": it["summary"][:200]}
        for it in sorted_items[:15]  # batch size capped at 15 items
    ]

    system_prompt = (
        "You are an OSINT Intelligence Analyst. Given the input list of defense and geopolitical headlines, "
        "output a JSON array of objects with fields: "
        "'id' (matching input id), 'summary' (concise factual summary under 240 chars), "
        "'category' ('military'|'geopolitical'|'cyber'|'natural'|'economic'), "
        "'severity' ('critical'|'high'|'medium'|'low'). "
        "Strict rules: Never invent facts. Output ONLY valid JSON array with no markdown formatting."
    )

    user_content = json.dumps(prompt_items)
    now_iso = datetime.now(timezone.utc).isoformat()
    today_date = datetime.now(timezone.utc).strftime('%Y-%m-%d')

    # 1. Try Groq (Llama-3.3-70b Primary)
    if GROQ_API_KEY:
        try:
            req_data = json.dumps({
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                "temperature": 0.0
            }).encode('utf-8')

            req = urllib.request.Request(
                "https://api.groq.com/openai/v1/chat/completions",
                data=req_data,
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json",
                    "User-Agent": USER_AGENT
                }
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                res_json = json.loads(resp.read().decode('utf-8'))
                raw_ans = res_json['choices'][0]['message']['content']

                # Telemetry capture
                usage = res_json.get('usage', {})
                prompt_tok = usage.get('prompt_tokens', len(user_content) // 4)
                comp_tok = usage.get('completion_tokens', 150)
                tot_tok = usage.get('total_tokens', prompt_tok + comp_tok)
                LLM_USAGE_TELEMETRY.append({
                    "date": today_date,
                    "provider": "groq",
                    "model": "llama-3.3-70b-versatile",
                    "request_count": 1,
                    "token_count": tot_tok,
                    "prompt_tokens": prompt_tok,
                    "completion_tokens": comp_tok,
                    "cost_estimate": 0.0,
                    "last_called": now_iso,
                    "timestamp": now_iso
                })

                # Parse JSON array response
                match = re.search(r'\[.*\]', raw_ans, re.DOTALL)
                if match:
                    classifications = json.loads(match.group(0))
                    lookup = {c["id"]: c for c in classifications if "id" in c}
                    for it in items:
                        if it["id"] in lookup:
                            ref = lookup[it["id"]]
                            if ref.get("summary"):
                                it["summary"] = ref["summary"][:280]
                            if ref.get("category"):
                                it["category"] = ref["category"]
                            if ref.get("severity"):
                                it["severity"] = ref["severity"]
                    return items
        except Exception as e:
            print(f"[WARN] Groq LLM pass failed, testing Gemini failover: {e}")

    # 2. Try Gemini 1.5 Flash Failover
    if GEMINI_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
            gemini_payload = json.dumps({
                "contents": [{
                    "parts": [{"text": f"{system_prompt}\n\nInput Headlines:\n{user_content}"}]
                }],
                "generationConfig": {"temperature": 0.0}
            }).encode('utf-8')

            req = urllib.request.Request(
                url,
                data=gemini_payload,
                headers={"Content-Type": "application/json", "User-Agent": USER_AGENT}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                res_json = json.loads(resp.read().decode('utf-8'))
                raw_ans = res_json['candidates'][0]['content']['parts'][0]['text']

                # Telemetry capture
                usage_meta = res_json.get('usageMetadata', {})
                prompt_tok = usage_meta.get('promptTokenCount', len(user_content) // 4)
                comp_tok = usage_meta.get('candidatesTokenCount', 150)
                tot_tok = usage_meta.get('totalTokenCount', prompt_tok + comp_tok)
                LLM_USAGE_TELEMETRY.append({
                    "date": today_date,
                    "provider": "gemini",
                    "model": "gemini-1.5-flash",
                    "request_count": 1,
                    "token_count": tot_tok,
                    "prompt_tokens": prompt_tok,
                    "completion_tokens": comp_tok,
                    "cost_estimate": 0.0,
                    "last_called": now_iso,
                    "timestamp": now_iso
                })

                match = re.search(r'\[.*\]', raw_ans, re.DOTALL)
                if match:
                    classifications = json.loads(match.group(0))
                    lookup = {c["id"]: c for c in classifications if "id" in c}
                    for it in items:
                        if it["id"] in lookup:
                            ref = lookup[it["id"]]
                            if ref.get("summary"):
                                it["summary"] = ref["summary"][:280]
                            if ref.get("category"):
                                it["category"] = ref["category"]
                            if ref.get("severity"):
                                it["severity"] = ref["severity"]
                    return items
        except Exception as e:
            print(f"[WARN] Gemini failover pass failed: {e}")

    return items

# ====================================================================
# XML / RSS Parser (Robust Standard Library + Fallback)
# ====================================================================
def parse_feed_xml(xml_content: bytes, source_meta: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Parses standard RSS 2.0 and Atom feeds directly using XML ElementTree."""
    items = []
    if not xml_content:
        return items

    try:
        root = ET.fromstring(xml_content)
        raw_items = root.findall('.//item')
        if not raw_items:
            raw_items = root.findall('.//{http://www.w3.org/2005/Atom}entry')
        if not raw_items:
            raw_items = root.findall('.//entry')

        for elem in raw_items:
            # Title
            t_node = elem.find('title')
            if t_node is None:
                t_node = elem.find('{http://www.w3.org/2005/Atom}title')
            title = clean_html_text(t_node.text) if (t_node is not None and t_node.text) else ''
            if not title or len(title) < 8:
                continue

            # Link
            link = ''
            l_node = elem.find('link')
            if l_node is None:
                l_node = elem.find('{http://www.w3.org/2005/Atom}link')
            if l_node is not None:
                link = l_node.attrib.get('href') or l_node.text or ''
            link = clean_url(link.strip())
            if not link:
                continue

            # Validate article URL: strictly reject Google News wrappers, search pages, or empty paths
            if not is_valid_article_url(link):
                continue

            # Description / Summary
            d_node = elem.find('description')
            if d_node is None:
                d_node = elem.find('summary')
            if d_node is None:
                d_node = elem.find('{http://www.w3.org/2005/Atom}summary')
            desc = clean_html_text(d_node.text) if (d_node is not None and d_node.text) else ''
            if not desc:
                desc = title

            # Published Date
            p_node = elem.find('pubDate')
            if p_node is None:
                p_node = elem.find('published')
            if p_node is None:
                p_node = elem.find('updated')
            if p_node is None:
                p_node = elem.find('{http://www.w3.org/2005/Atom}updated')
            pub_str = p_node.text if (p_node is not None and p_node.text) else ''
            published_at = parse_iso_time(pub_str)

            items.append({
                "title": title,
                "summary": desc[:280],
                "link": link,
                "source_url": link,
                "source_name": source_meta.get("name", "OSINT Wire"),
                "published_at": published_at,
                "source": source_meta.get("name", "OSINT Wire"),
                "source_domain": source_meta.get("domain", ""),
                "tier": source_meta.get("tier", 2),
                "state_funded": source_meta.get("stateFunded", False)
            })
    except Exception:
        pass
    return items

# ====================================================================
# External Real-Time Telemetry Sensors (NASA, NOAA, USGS, ADSB.lol)
# ====================================================================
def fetch_external_telemetry_sensors(georesolver) -> List[Dict[str, Any]]:
    """
    Fetches real-time sensor summaries for USGS, NASA EONET v3, NOAA/NWS, and adsb.lol.
    Caches them into articles to prevent browser-side timeouts and CORS failures.
    """
    sensor_articles = []
    now_iso = datetime.now(timezone.utc).isoformat()

    # 1. USGS Earthquakes M4.5+
    try:
        req = urllib.request.Request(
            "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson",
            headers={"User-Agent": USER_AGENT, "Accept": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for f in data.get('features', [])[:12]:
                props = f.get('properties', {})
                geom = f.get('geometry', {})
                coords = geom.get('coordinates', [0, 0, 0])
                mag = float(props.get('mag', 4.5))
                place = props.get('place', 'Seismic Zone')
                lon, lat = coords[0], coords[1]
                title = f"USGS NEIC: M{mag:.1f} Earthquake Detected — {place}"
                summary = f"Automatic seismic telemetry recorded by USGS National Earthquake Information Center. Hypocenter registered at {coords[2]:.1f} km depth."
                sev = "critical" if mag >= 6.0 else ("high" if mag >= 5.0 else "medium")
                t_epoch = props.get('time', time.time() * 1000) / 1000
                pub_iso = datetime.fromtimestamp(t_epoch, tz=timezone.utc).isoformat()

                sensor_articles.append({
                    "id": f"art_usgs_{props.get('code', hash_id(place))[:12]}",
                    "title": title,
                    "summary": summary,
                    "source": "USGS NEIC Global Seismic Network",
                    "source_name": "USGS NEIC",
                    "source_domain": "earthquake.usgs.gov",
                    "tier": 1,
                    "state_funded": False,
                    "published_at": pub_iso,
                    "category": "natural",
                    "severity": sev,
                    "coordinates": [lon, lat],
                    "related_hotspot": None,
                    "country_code": "GLOBAL",
                    "region": "global",
                    "link": props.get('url', 'https://earthquake.usgs.gov'),
                    "cluster_id": None
                })
    except Exception as e:
        print(f"[WARN] USGS sensor fetch notice: {e}")

    # 2. NASA EONET v3 Natural Events
    try:
        req = urllib.request.Request(
            "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=15",
            headers={"User-Agent": USER_AGENT, "Accept": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for ev in data.get('events', []):
                title = ev.get('title', 'NASA Earth Observation Event')
                cats = ev.get('categories', [])
                cat_title = cats[0].get('title', 'Natural Event') if cats else 'Natural Event'
                geoms = ev.get('geometry', [])
                coords = [86.35, 25.06]
                if geoms:
                    c = geoms[-1].get('coordinates', [86.35, 25.06])
                    if isinstance(c, list) and len(c) >= 2 and isinstance(c[0], (int, float)):
                        coords = [c[0], c[1]]
                sensor_articles.append({
                    "id": f"art_eonet_{ev.get('id', hash_id(title))[:12]}",
                    "title": f"NASA EONET: {cat_title} — {title}",
                    "summary": f"NASA Earth Observatory Natural Event Tracker (EONET v3) recorded active environmental anomaly and planetary telemetry.",
                    "source": "NASA Earth Observatory (EONET v3)",
                    "source_name": "NASA EONET",
                    "source_domain": "eonet.gsfc.nasa.gov",
                    "tier": 1,
                    "state_funded": False,
                    "published_at": geoms[-1].get('date', now_iso) if geoms else now_iso,
                    "category": "natural",
                    "severity": "medium",
                    "coordinates": coords,
                    "related_hotspot": None,
                    "country_code": "GLOBAL",
                    "region": "global",
                    "link": ev.get('link', 'https://eonet.gsfc.nasa.gov'),
                    "cluster_id": None
                })
    except Exception as e:
        print(f"[WARN] NASA EONET sensor fetch notice: {e}")

    # 3. NOAA/NWS Weather Alerts
    try:
        req = urllib.request.Request(
            "https://api.weather.gov/alerts/active?status=actual&severity=Extreme&limit=10",
            headers={"User-Agent": "ManekshawVision/1.0 (contact@manvis.tech)", "Accept": "application/geo+json"}
        )
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            for f in data.get('features', []):
                p = f.get('properties', {})
                headline = p.get('headline') or p.get('event', 'Severe Weather Warning')
                desc = (p.get('description') or '')[:200]
                geom = f.get('geometry')
                coords = [-98.57, 39.82]
                if geom and geom.get('coordinates'):
                    c = geom.get('coordinates')
                    if isinstance(c, list) and len(c) > 0:
                        while isinstance(c[0], list):
                            c = c[0]
                        if len(c) >= 2 and isinstance(c[0], (int, float)):
                            coords = [c[0], c[1]]
                sensor_articles.append({
                    "id": f"art_nws_{p.get('id', hash_id(headline))[:12]}",
                    "title": f"NOAA/NWS Alert: {headline}",
                    "summary": desc or "National Weather Service issued severe atmospheric warning bulletin.",
                    "source": "NOAA / National Weather Service",
                    "source_name": "NOAA NWS",
                    "source_domain": "weather.gov",
                    "tier": 1,
                    "state_funded": False,
                    "published_at": p.get('sent', now_iso),
                    "category": "natural",
                    "severity": "high" if p.get('severity') == 'Extreme' else "medium",
                    "coordinates": coords,
                    "related_hotspot": None,
                    "country_code": "US",
                    "region": "Americas",
                    "link": "https://www.weather.gov",
                    "cluster_id": None
                })
    except Exception as e:
        print(f"[WARN] NOAA Weather sensor fetch notice: {e}")

    # 4. adsb.lol Military Aircraft Telemetry
    try:
        req = urllib.request.Request(
            "https://api.adsb.lol/v2/mil",
            headers={"User-Agent": USER_AGENT, "Accept": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            ac_list = data.get('ac', [])
            total_mil = len(ac_list)
            if total_mil > 0:
                sensor_articles.append({
                    "id": f"art_adsb_{int(time.time() // 900)}",
                    "title": f"ADSB Military Telemetry: {total_mil} Active Military Aircraft Airborne in Global Theaters",
                    "summary": f"Real-time ADS-B transponder telemetry recorded {total_mil} airborne military assets including airborne tankers, ISR reconnaissance platforms, and tactical transports.",
                    "source": "adsb.lol Open Transponder Network",
                    "source_name": "ADSB.lol",
                    "source_domain": "adsb.lol",
                    "tier": 2,
                    "state_funded": False,
                    "published_at": now_iso,
                    "category": "military",
                    "severity": "high" if total_mil > 300 else "medium",
                    "coordinates": [86.35, 25.06],
                    "related_hotspot": None,
                    "country_code": "GLOBAL",
                    "region": "global",
                    "link": "https://adsb.lol",
                    "cluster_id": None
                })
    except Exception as e:
        print(f"[WARN] adsb.lol sensor fetch notice: {e}")

    return sensor_articles

# ====================================================================
# YouTube Live Resolver (Parallel Server-Side Live Inspection)
# ====================================================================
TARGET_247_CHANNELS = [
    # India 24/7 Live Broadcasters
    {"id": "dd_india", "title": "DD India 24/7 Live", "channel": "DD India", "channel_id": "UCGDQNvybfDDeGTf4GtigXaw", "uploads_id": "UUGDQNvybfDDeGTf4GtigXaw", "category": "24/7 LIVE NEWS", "region": "India / S. Asia", "country": "IN"},
    {"id": "wion", "title": "WION: World Is One News", "channel": "WION", "channel_id": "UC_gUM8rL-Lzy6Z832PDOzsA", "uploads_id": "UU_gUM8rL-Lzy6Z832PDOzsA", "category": "24/7 LIVE NEWS", "region": "India / S. Asia", "country": "IN"},
    {"id": "ndtv_india", "title": "NDTV 24x7", "channel": "NDTV 24x7", "channel_id": "UCZFMm1mMw0F81Z37aaEzTUA", "uploads_id": "UUZFMm1mMw0F81Z37aaEzTUA", "category": "24/7 LIVE NEWS", "region": "India / S. Asia", "country": "IN"},
    {"id": "india_today", "title": "India Today Live", "channel": "India Today", "channel_id": "UCYPvAwZP8pZhSMW8qs7cVCw", "uploads_id": "UUYPvAwZP8pZhSMW8qs7cVCw", "category": "24/7 LIVE NEWS", "region": "India / S. Asia", "country": "IN"},
    {"id": "aaj_tak", "title": "Aaj Tak Live", "channel": "Aaj Tak", "channel_id": "UCt4t-jeY85JegMlZ-E5UWtA", "uploads_id": "UUt4t-jeY85JegMlZ-E5UWtA", "category": "24/7 LIVE NEWS", "region": "India / S. Asia", "country": "IN"},
    {"id": "sansad_tv", "title": "Sansad TV (Parliament of India)", "channel": "Sansad TV", "channel_id": "UCv01OP4p0c1XnB3fG7B1P-w", "uploads_id": "UUv01OP4p0c1XnB3fG7B1P-w", "category": "24/7 LIVE NEWS", "region": "India / S. Asia", "country": "IN"},
    {"id": "firstpost_vantage", "title": "Firstpost (Vantage)", "channel": "Firstpost", "channel_id": "UCz8QaiQxApLq8sLNcszYyJw", "uploads_id": "UUz8QaiQxApLq8sLNcszYyJw", "category": "24/7 LIVE NEWS", "region": "India / S. Asia", "country": "IN"},

    # Global 24/7 Live Broadcasters
    {"id": "aljazeera_en", "title": "Al Jazeera English Live", "channel": "Al Jazeera English", "channel_id": "UC6ZFN9Tx6xh-skXCuRHCDpQ", "uploads_id": "UU6ZFN9Tx6xh-skXCuRHCDpQ", "category": "24/7 LIVE NEWS", "region": "Middle East", "country": "QA"},
    {"id": "dw_news", "title": "DW News Live", "channel": "DW News", "channel_id": "UCknLrEdhRCp1HK5ECQ9nkJw", "uploads_id": "UUknLrEdhRCp1HK5ECQ9nkJw", "category": "24/7 LIVE NEWS", "region": "Europe / UK", "country": "DE"},
    {"id": "france24_en", "title": "France 24 English", "channel": "France 24 English", "channel_id": "UCQfwfsi5VrQ8yKZ-UWmAEFg", "uploads_id": "UUQfwfsi5VrQ8yKZ-UWmAEFg", "category": "24/7 LIVE NEWS", "region": "Europe / UK", "country": "FR"},
    {"id": "sky_news", "title": "Sky News Live", "channel": "Sky News", "channel_id": "UCoMdktPbSTixAyNGwb-UYkQ", "uploads_id": "UUoMdktPbSTixAyNGwb-UYkQ", "category": "24/7 LIVE NEWS", "region": "Europe / UK", "country": "GB"},
    {"id": "cna_live", "title": "CNA 24/7 Live", "channel": "CNA", "channel_id": "UC83jt4dlz1Gjl58fzQ5KKGg", "uploads_id": "UU83jt4dlz1Gjl58fzQ5KKGg", "category": "24/7 LIVE NEWS", "region": "East Asia / Indo-Pacific", "country": "SG"},
    {"id": "nhk_world", "title": "NHK World-Japan Live", "channel": "NHK World-Japan", "channel_id": "UCvdHQUPn9pnngnLBN_NqPNA", "uploads_id": "UUvdHQUPn9pnngnLBN_NqPNA", "category": "24/7 LIVE NEWS", "region": "East Asia / Indo-Pacific", "country": "JP"},
    {"id": "euronews_en", "title": "Euronews English Live", "channel": "Euronews English", "channel_id": "UCSrZ3UV4jOidv8ppoVuvW9Q", "uploads_id": "UUSrZ3UV4jOidv8ppoVuvW9Q", "category": "24/7 LIVE NEWS", "region": "Europe / UK", "country": "EU"},
    {"id": "nasa_live", "title": "NASA Live & ISS Telemetry", "channel": "NASA", "channel_id": "UCLA_DiR1FfKNvjuUpBHmylQ", "uploads_id": "UULA_DiR1FfKNvjuUpBHmylQ", "category": "24/7 LIVE NEWS", "region": "Global Wire", "country": "GLOBAL"},

    # Special Analysts
    {"id": "perun", "title": "Perun Defense Economics", "channel": "Perun", "channel_id": "UCC3ehuUksTyQ7bbjGntmx3Q", "uploads_id": "UUC3ehuUksTyQ7bbjGntmx3Q", "category": "★ SPECIAL ANALYSTS", "region": "Global Wire", "country": "AU"},
    {"id": "caspian_report", "title": "CaspianReport (Shirvan)", "channel": "CaspianReport", "channel_id": "UCnZjF-jc2h8I1fKAce1vFog", "uploads_id": "UUnZjF-jc2h8I1fKAce1vFog", "category": "★ SPECIAL ANALYSTS", "region": "Global Wire", "country": "GLOBAL"}
]

def check_single_channel_live(item: Dict[str, Any], now_iso: str) -> Dict[str, Any]:
    cid = item["id"]
    channel_id = item["channel_id"]
    uploads_id = item.get("uploads_id") or get_uploads_playlist_id(channel_id)
    active_live_id = None
    is_live = False

    live_url = f"https://www.youtube.com/channel/{channel_id}/live"
    try:
        req = urllib.request.Request(
            live_url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            final_url = resp.geturl()
            v_match = re.search(r'watch\?v=([a-zA-Z0-9_-]{11})', final_url)
            if v_match:
                active_live_id = v_match.group(1)
                is_live = True
            else:
                html_body = resp.read().decode('utf-8', errors='ignore')
                canonical_match = re.search(r'link rel="canonical" href="https://www\.youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})"', html_body)
                if canonical_match:
                    active_live_id = canonical_match.group(1)
                    is_live = True
                elif '"isLive":true' in html_body or '"isLiveNow":true' in html_body:
                    body_v = re.search(r'"videoId":"([a-zA-Z0-9_-]{11})"', html_body)
                    if body_v:
                        active_live_id = body_v.group(1)
                        is_live = True
    except Exception:
        pass

    fallback_yt_id = active_live_id if (is_live and active_live_id) else "videoseries"

    return {
        "id": cid,
        "title": item["title"],
        "channel": item["channel"],
        "channel_name": item["channel"],
        "channel_id": channel_id,
        "uploads_playlist_id": uploads_id,
        "category": item["category"],
        "region": item["region"],
        "country_code": item["country"],
        "is_live": is_live,
        "status": "live" if is_live else "offline",
        "youtube_id": fallback_yt_id,
        "video_id": fallback_yt_id,
        "external_url": f"https://www.youtube.com/channel/{channel_id}",
        "checked_at": now_iso,
        "last_checked_at": now_iso
    }

def resolve_youtube_streams() -> List[Dict[str, Any]]:
    """Resolves active live stream video IDs in parallel across 24/7 channels and analysts."""
    now_iso = datetime.now(timezone.utc).isoformat()
    verified_streams = []

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(check_single_channel_live, ch, now_iso) for ch in TARGET_247_CHANNELS]
        for fut in as_completed(futures):
            try:
                res = fut.result()
                if res:
                    verified_streams.append(res)
            except Exception as e:
                print(f"[WARN] Channel resolver error: {e}")

    return verified_streams

# ====================================================================
# Supabase REST Client
# ====================================================================
def upsert_supabase(table: str, records: List[Dict[str, Any]], on_conflict: Optional[str] = None) -> bool:
    """Upserts records into Supabase via REST API with merge-duplicates preference."""
    if not SUPABASE_KEY or not records:
        return False

    url = f"{SUPABASE_URL}/rest/v1/{table}"
    if on_conflict:
        url += f"?on_conflict={urllib.parse.quote(on_conflict)}"

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    try:
        data = json.dumps(records).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=12) as resp:
            return resp.status in (200, 201)
    except urllib.error.HTTPError as e:
        err_msg = ""
        try:
            err_msg = e.read().decode('utf-8', errors='ignore')
        except Exception:
            pass
        if e.code == 401:
            print(f"[WARN] Supabase HTTP 401 on {table}: {err_msg}")
        else:
            print(f"[WARN] Supabase HTTP {e.code} on {table}: {err_msg}")
        return False
    except Exception as e:
        print(f"[WARN] Supabase error on {table}: {e}")
        return False

def prune_supabase_records() -> None:
    """Prunes articles and clusters older than 30 days via RPC stored procedure or REST API."""
    if not SUPABASE_KEY:
        return

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }

    # 1. Attempt calling the prune_old_intel stored procedure first
    rpc_success = False
    try:
        rpc_url = f"{SUPABASE_URL}/rest/v1/rpc/prune_old_intel"
        rpc_payload = json.dumps({"retention_days": RETENTION_DAYS}).encode('utf-8')
        req = urllib.request.Request(rpc_url, data=rpc_payload, headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=8) as resp:
            if resp.status in (200, 204):
                rpc_success = True
                print("[DB] Automated 30-day prune executed via stored procedure prune_old_intel().")
    except Exception:
        pass

    if rpc_success:
        return

    # 2. Fallback: REST DELETE queries with URL-safe 'Z' timestamp formatting (no +00:00 space decode bug)
    cutoff_iso = (datetime.now(timezone.utc) - timedelta(days=RETENTION_DAYS)).strftime('%Y-%m-%dT%H:%M:%SZ')
    encoded_cutoff = urllib.parse.quote(cutoff_iso)

    try:
        # Delete old articles
        url_art = f"{SUPABASE_URL}/rest/v1/articles?published_at=lt.{encoded_cutoff}"
        req_art = urllib.request.Request(url_art, headers=headers, method='DELETE')
        urllib.request.urlopen(req_art, timeout=8)

        # Delete old clusters
        url_cls = f"{SUPABASE_URL}/rest/v1/clusters?last_updated=lt.{encoded_cutoff}"
        req_cls = urllib.request.Request(url_cls, headers=headers, method='DELETE')
        urllib.request.urlopen(req_cls, timeout=8)
        print(f"[DB] Automated 30-day prune executed via REST API (cutoff: {cutoff_iso}).")
    except Exception as e:
        print(f"[INFO] Prune notice: {e}")

# ====================================================================
# Main Execution Pipeline
# ====================================================================
def run_pipeline():
    start_time = time.time()
    now_iso = datetime.now(timezone.utc).isoformat()
    print("=" * 70)
    print("MANEKSHAW.VISION // HEADLESS OSINT INGESTION PIPELINE")
    print(f"Timestamp: {now_iso}")
    print("=" * 70)

    georesolver = Georesolver(GAZETTEER_FILE)

    # 1. Load Sources
    sources = []
    if os.path.exists(SOURCES_FILE):
        with open(SOURCES_FILE, 'r', encoding='utf-8') as f:
            sources = json.load(f)
    print(f"Loaded {len(sources)} verified sources from registry.")

    all_articles: List[Dict[str, Any]] = []
    seen_urls = set()
    seen_titles = []

    # Reset telemetry buffers for current execution
    global FEED_HEALTH_TELEMETRY, LLM_USAGE_TELEMETRY
    FEED_HEALTH_TELEMETRY = []
    LLM_USAGE_TELEMETRY = []

    # 2. Fetch Active Feeds
    active_sources = [s for s in sources if s.get('active', True)]
    # Process up to 12 diverse feeds per 15-minute run to respect free-tier execution limits
    for src in active_sources[:12]:
        feed_url = src.get('feedUrl')
        if not feed_url:
            continue

        status_code = 0
        etag_header = None
        last_mod_header = None
        item_count = 0
        error_msg = None

        try:
            req = urllib.request.Request(
                feed_url,
                headers={"User-Agent": USER_AGENT, "Accept": "application/rss+xml, application/xml, text/xml"}
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                status_code = resp.status
                etag_header = resp.headers.get('ETag')
                last_mod_header = resp.headers.get('Last-Modified')
                xml_data = resp.read()
                items = parse_feed_xml(xml_data, src)
                item_count = len(items)

                for it in items:
                    norm_url = it['link']
                    if norm_url in seen_urls:
                        continue
                    # Check title similarity (>80% word overlap)
                    t_lower = it['title'].lower()
                    if any(len(set(t_lower.split()) & set(st.split())) / max(len(t_lower.split()), 1) > 0.8 for st in seen_titles):
                        continue

                    seen_urls.add(norm_url)
                    seen_titles.append(t_lower)

                    combined_text = it['title'] + ' ' + it['summary']
                    coords, country, region, hotspot = georesolver.resolve(combined_text)
                    cat, sev = classify_keyword(combined_text)

                    art_id = f"art_{hash_id(norm_url)}"
                    all_articles.append({
                        "id": art_id,
                        "title": it['title'],
                        "summary": it['summary'],
                        "source": it['source'],
                        "source_name": it.get('source_name', it['source']),
                        "source_url": norm_url,
                        "source_domain": it['source_domain'],
                        "tier": it['tier'],
                        "source_tier": it['tier'],
                        "state_funded": it['state_funded'],
                        "published_at": it['published_at'],
                        "category": cat,
                        "severity": sev,
                        "coordinates": coords,
                        "related_hotspot": hotspot,
                        "country_code": country,
                        "link": norm_url,
                        "url": norm_url,
                        "created_at": now_iso,
                        "ingested_at": now_iso
                    })
        except urllib.error.HTTPError as e:
            status_code = e.code
            error_msg = f"HTTP {e.code}"
        except Exception as e:
            status_code = 500
            error_msg = str(e)[:100]

        FEED_HEALTH_TELEMETRY.append({
            "feed_url": feed_url,
            "domain": src.get("domain", ""),
            "etag": etag_header,
            "last_modified": last_mod_header,
            "consecutive_failures": 0 if (200 <= status_code < 400) else 1,
            "last_status": status_code if status_code else 200,
            "status": status_code if status_code else 200,
            "last_error": error_msg,
            "error_message": error_msg,
            "last_item_count": item_count,
            "articles_fetched": item_count,
            "last_checked": now_iso,
            "last_fetch_at": now_iso
        })

    print(f"Fetched & deduped {len(all_articles)} fresh intelligence articles.")

    # 2.5 Ingest External Real-Time Telemetry Sensors (NASA, NOAA, USGS, ADSB.lol)
    sensor_articles = fetch_external_telemetry_sensors(georesolver)
    if sensor_articles:
        all_articles.extend(sensor_articles)
        print(f"Ingested {len(sensor_articles)} real-time sensor events from USGS, NASA EONET, NOAA NWS, and adsb.lol.")

    # 3. Pass 2: Batched LLM Classification (Groq / Gemini)
    if all_articles:
        # Sort all_articles by Pass 1 severity (critical > high > medium > low) before slicing [:15]
        sev_rank = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
        all_articles.sort(key=lambda a: sev_rank.get(a.get('severity', 'low'), 3))
        all_articles = classify_batch_llm(all_articles)

    # 4. Synthesize Corroborated Clusters (Breaking Marquee Dispatches)
    clusters: List[Dict[str, Any]] = []
    hotspot_buckets: Dict[str, List[Dict[str, Any]]] = {}
    for art in all_articles:
        hs = art.get('related_hotspot') or art.get('country_code', 'GLOBAL')
        hotspot_buckets.setdefault(hs, []).append(art)

    for hs_key, arts in hotspot_buckets.items():
        if not arts:
            continue
        lead = arts[0]
        # Corroboration logic: CONFIRMED if >=1 Tier-1 or >=2 independent non-state sources
        has_tier1 = any(a.get('tier') == 1 for a in arts)
        non_state_sources = set(a.get('source_domain') for a in arts if not a.get('state_funded'))
        confidence = "CONFIRMED" if (has_tier1 or len(non_state_sources) >= 2) else "REPORTED"

        cluster_id = f"cls_{hash_id(hs_key + lead['title'])[:12]}"
        crit_count = sum(1 for a in arts if a.get('severity') == 'critical')
        high_count = sum(1 for a in arts if a.get('severity') == 'high')
        cluster_esc_score = min(98, max(25, 50 + (crit_count * 8) + (high_count * 4)))

        clusters.append({
            "id": cluster_id,
            "cluster_id": cluster_id,
            "headline": lead['title'],
            "title": lead['title'],
            "summary": lead['summary'],
            "confidence": confidence,
            "category": lead['category'],
            "severity": lead['severity'],
            "coordinates": lead['coordinates'],
            "related_hotspot": lead.get('related_hotspot'),
            "related_hotspots": [lead.get('related_hotspot')] if lead.get('related_hotspot') else [],
            "country_code": lead.get('country_code', 'GLOBAL'),
            "sources": list(set(a['source'] for a in arts))[:5],
            "source_count": len(set(a['source'] for a in arts)),
            "highest_tier": min(a.get('tier', 2) for a in arts),
            "article_ids": [a['id'] for a in arts],
            "categories": list(set(a['category'] for a in arts)),
            "escalation_score": cluster_esc_score,
            "first_seen": lead['published_at'],
            "first_seen_at": lead['published_at'],
            "last_updated": now_iso,
            "last_updated_at": now_iso,
            "article_count": len(arts)
        })

    print(f"Synthesized {len(clusters)} corroborated intelligence clusters.")

    # 5. Dynamic Hotspot Escalation Scores & Deltas
    hotspot_scores = []
    if os.path.exists(GAZETTEER_FILE):
        try:
            with open(GAZETTEER_FILE, 'r', encoding='utf-8') as f:
                gaz = json.load(f)
                for hid, hdata in gaz.get('hotspots', {}).items():
                    matched_arts = [a for a in all_articles if a.get('related_hotspot') == hid]
                    crit_count = sum(1 for a in matched_arts if a.get('severity') == 'critical')
                    high_count = sum(1 for a in matched_arts if a.get('severity') == 'high')

                    base_score = 65
                    score = min(98, max(25, base_score + (crit_count * 6) + (high_count * 3)))
                    delta = f"▲ +{len(matched_arts) * 0.8:.1f}" if matched_arts else "— 0.0"
                    delta_int = int(round(len(matched_arts) * 0.8)) if matched_arts else 0
                    trend = "escalating" if score >= 80 else ("stable" if score >= 50 else "de-escalating")

                    coords = hdata.get("coordinates") or hdata.get("coords", [86.35, 25.06])
                    country = hdata.get("countryCode") or hdata.get("country", "GLOBAL")
                    region = hdata.get("region") or hdata.get("theater", "global")

                    top_cat = "military"
                    if matched_arts:
                        cat_counts = {}
                        for a in matched_arts:
                            cat_counts[a['category']] = cat_counts.get(a['category'], 0) + 1
                        top_cat = max(cat_counts, key=cat_counts.get)

                    hotspot_scores.append({
                        "id": hid,
                        "hotspot_id": hid,
                        "name": hdata.get("name", hid),
                        "coordinates": coords,
                        "escalation_score": score,
                        "score": score,
                        "escalation_trend": trend,
                        "escalation_delta": delta,
                        "delta": delta_int,
                        "region": region,
                        "country_code": country,
                        "telemetry": {
                            "activeReports": len(matched_arts),
                            "criticalAlerts": crit_count,
                            "sensorIntegrity": "NOMINAL"
                        },
                        "description": f"Real-time monitoring across {hdata.get('name', hid)}.",
                        "why_it_matters": "Strategic global defense, chokepoint security, or border integrity.",
                        "contributing_links": [a['link'] for a in matched_arts[:4]],
                        "article_count": len(matched_arts),
                        "top_category": top_cat,
                        "updated_at": now_iso,
                        "last_updated_at": now_iso
                    })
        except Exception as e:
            print(f"[WARN] Hotspot scoring error: {e}")

    # 6. Resolve YouTube Live Streams Server-Side
    streams = resolve_youtube_streams()
    print(f"Resolved {len(streams)} YouTube live and playlist streams.")

    # 7. Persist Strictly to Supabase (ZERO REPO DATA COMMITS)
    is_service_role = is_service_role_key(SUPABASE_KEY)

    if SUPABASE_KEY and is_service_role:
        print("[DB] Upserting records into Supabase...")
        if all_articles:
            upsert_supabase('articles', all_articles)
        if clusters:
            upsert_supabase('clusters', clusters)
        if hotspot_scores:
            upsert_supabase('hotspot_scores', hotspot_scores)
        if streams:
            upsert_supabase('youtube_streams', streams)
        if FEED_HEALTH_TELEMETRY:
            upsert_supabase('feed_health', FEED_HEALTH_TELEMETRY)
        if LLM_USAGE_TELEMETRY:
            upsert_supabase('llm_usage', LLM_USAGE_TELEMETRY, on_conflict='date,provider,model')
        prune_supabase_records()
        print("[DB] Supabase synchronization complete.")
    elif SUPABASE_KEY:
        print("[INFO] Service Role Key not set (read-only anon key detected); skipping database upsert in read-only environment.")
    else:
        print("[INFO] SUPABASE_SERVICE_ROLE_KEY not present; skipping remote DB upsert. Local execution succeeded.")

    duration = time.time() - start_time
    print(f"Pipeline finished successfully in {duration:.2f} seconds.")
    print("=" * 70)

    # Return sample summary for verification
    return {
        "articles_count": len(all_articles),
        "clusters_count": len(clusters),
        "hotspots_count": len(hotspot_scores),
        "streams_count": len(streams),
        "feed_health_count": len(FEED_HEALTH_TELEMETRY),
        "llm_usage_count": len(LLM_USAGE_TELEMETRY),
        "sample_article": all_articles[0] if all_articles else None,
        "sample_cluster": clusters[0] if clusters else None,
        "sample_stream": streams[0] if streams else None
    }

if __name__ == '__main__':
    run_pipeline()
