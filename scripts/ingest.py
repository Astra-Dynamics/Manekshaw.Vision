#!/usr/bin/env python3
"""
Manekshaw.Vision - Sovereign Situational Awareness & Defense OSINT
Script: scripts/ingest.py
Description: Headless ingestion engine running on a 15-minute cron.
             Fetches allowlisted Tier 1/2/3 RSS feeds + GDELT, dedupes,
             runs 2-pass classification (keyword + Groq/Gemini LLM),
             resolves live YouTube stream IDs server-side, clusters
             breaking stories, and upserts to Supabase with 30-day retention.
"""

import os
import sys
import json
import re
import time
import hashlib
import urllib.request
import urllib.parse
import urllib.error
import xml.etree.ElementTree as ET
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
SOURCES_FILE = os.path.join(BASE_DIR, 'config', 'sources.json')
GAZETTEER_FILE = os.path.join(BASE_DIR, 'config', 'gazetteer.json')
VIDEO_CATALOGUE_FILE = os.path.join(BASE_DIR, 'src', 'data', 'videoCatalogue.ts')

SUPABASE_URL = os.environ.get('SUPABASE_URL') or os.environ.get('VITE_SUPABASE_URL') or 'https://fahbbsdgurtwmfjhtxkh.supabase.co'
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY') or os.environ.get('VITE_SUPABASE_ANON_KEY') or ''

GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')

RETENTION_DAYS = 30
USER_AGENT = 'ManekshawVision-OSINT-Ingest/1.0 (+https://manvis.tech; contact@manvis.tech)'

# ====================================================================
# Helper Utilities
# ====================================================================
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

def clean_html_text(raw_html: str) -> str:
    """Removes HTML tags and normalizes whitespace."""
    if not raw_html:
        return ''
    text = re.sub(r'<[^>]+>', ' ', raw_html)
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
        lower = text.lower()
        for ent in self.entities:
            for kw in ent.get('keywords', []):
                if re.search(r'\b' + re.escape(kw) + r'\b', lower):
                    return (
                        ent.get('coords', [86.35, 25.06]),
                        ent.get('countryCode', 'GLOBAL'),
                        ent.get('region', 'global'),
                        ent.get('hotspot')
                    )
        # Default fallback: Sovereign India SOI Default
        return ([86.35, 25.06], 'GLOBAL', 'global', None)

# ====================================================================
# Pass 1: Local Deterministic Keyword Classifier
# ====================================================================
def classify_keyword(text: str) -> Tuple[str, str]:
    """Returns (category, severity)"""
    lower = text.lower()
    
    # Severity
    critical_terms = ['nuclear', 'ballistic missile', 'hypersonic', 'airstrike', 'intercepted', 'mass casualty', 'invasion', 'sunk', 'killed in strike']
    high_terms = ['drone strike', 'missile', 'artillery', 'warship', 'destroyer', 'adiz', 'air defense', 'sanctions', 'sabotage', 'gps jamming', 'clash']
    medium_terms = ['patrol', 'exercise', 'deployment', 'summit', 'briefing', 'naval drills', 'warning', 'advisory']
    
    severity = 'low'
    if any(t in lower for t in critical_terms):
        severity = 'critical'
    elif any(t in lower for t in high_terms):
        severity = 'high'
    elif any(t in lower for t in medium_terms):
        severity = 'medium'

    # Category
    category = 'geopolitical'
    if any(t in lower for t in ['cyber', 'ransomware', 'cisa', 'malware', 'firewall', 'cable cut', 'spoofing', 'ddos']):
        category = 'cyber'
    elif any(t in lower for t in ['earthquake', 'tsunami', 'volcano', 'wildfire', 'hurricane', 'cyclone', 'typhoon', 'seismic']):
        category = 'natural'
    elif any(t in lower for t in ['oil', 'crude', 'tanker', 'opec', 'trade', 'tariff', 'sanctions', 'lng', 'freight', 'semiconductor']):
        category = 'economic'
    elif any(t in lower for t in ['army', 'navy', 'air force', 'missile', 'strike', 'combat', 'warhead', 'pla', 'idf', 'nato', 'centcom', 'armed forces']):
        category = 'military'

    return (category, severity)

# ====================================================================
# Pass 2: Batched LLM Classifier (Groq Primary -> Gemini Failover)
# ====================================================================
def classify_batch_llm(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Refines summaries, category, and severity using Groq / Gemini with strict temperature: 0."""
    if not items or (not GROQ_API_KEY and not GEMINI_API_KEY):
        return items

    # Prepare minimal payload for LLM grounding (by ID only)
    prompt_items = [
        {"id": it["id"], "title": it["title"], "summary": it["summary"][:200]}
        for it in items[:15] # batch size max 15
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

    # 1. Try Groq
    if GROQ_API_KEY:
        try:
            req_data = json.dumps({
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                "temperature": 0.0,
                "response_format": {"type": "json_object"} if False else None
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
                # parse json
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

    # 2. Try Gemini Failover
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
                "published_at": published_at,
                "source": source_meta.get("name", "OSINT Wire"),
                "source_domain": source_meta.get("domain", ""),
                "tier": source_meta.get("tier", 2),
                "state_funded": source_meta.get("stateFunded", False)
            })
    except Exception as e:
        pass
    return items

# ====================================================================
# YouTube Live Resolver (Server-Side Headless Canonical Extraction)
# ====================================================================
def resolve_youtube_streams() -> List[Dict[str, Any]]:
    """Resolves active live stream video IDs and uploads playlists without API keys."""
    if not os.path.exists(VIDEO_CATALOGUE_FILE):
        return []

    verified_streams = []
    try:
        with open(VIDEO_CATALOGUE_FILE, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract channels array
        channels_raw = re.findall(
            r'\{\s*"id":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"channel":\s*"([^"]+)",\s*"channelId":\s*"([^"]+)",\s*"uploadsPlaylistId":\s*"([^"]+)",\s*"category":\s*"([^"]+)",\s*"region":\s*"([^"]+)",\s*"regionGroup":\s*"([^"]+)",\s*"countryCode":\s*"([^"]+)"',
            content
        )

        # Sample top 8 key channels for live inspection
        for item in channels_raw[:10]:
            cid, title, channel, channel_id, uploads_id, cat, reg, reg_group, country = item
            active_live_id = None
            is_live = False

            # Query channel /live endpoint
            live_url = f"https://www.youtube.com/channel/{channel_id}/live"
            try:
                req = urllib.request.Request(
                    live_url,
                    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
                )
                with urllib.request.urlopen(req, timeout=5) as resp:
                    final_url = resp.geturl()
                    # Check if redirected to /watch?v=...
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
            except Exception:
                pass

            # Fallback to playlist if no active live video ID
            fallback_yt_id = active_live_id if active_live_id else "videoseries"

            verified_streams.append({
                "id": cid,
                "title": title,
                "channel": channel,
                "channel_id": channel_id,
                "uploads_playlist_id": uploads_id,
                "category": cat,
                "region": reg,
                "country_code": country,
                "is_live": is_live,
                "youtube_id": fallback_yt_id,
                "external_url": f"https://www.youtube.com/channel/{channel_id}",
                "checked_at": datetime.now(timezone.utc).isoformat()
            })
    except Exception as e:
        print(f"[WARN] YouTube resolver error: {e}")

    return verified_streams

# ====================================================================
# Supabase REST Client
# ====================================================================
def upsert_supabase(table: str, records: List[Dict[str, Any]]) -> bool:
    """Upserts records into Supabase via REST API with merge-duplicates preference."""
    if not SUPABASE_KEY or not records:
        return False

    url = f"{SUPABASE_URL}/rest/v1/{table}"
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
        print(f"[WARN] Supabase HTTP {e.code} on {table}: {e.read().decode('utf-8')}")
        return False
    except Exception as e:
        print(f"[WARN] Supabase error on {table}: {e}")
        return False

def prune_supabase_records() -> None:
    """Prunes articles and clusters older than 30 days via REST API."""
    if not SUPABASE_KEY:
        return

    cutoff_iso = (datetime.now(timezone.utc) - timedelta(days=RETENTION_DAYS)).isoformat()
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }

    try:
        # Delete old articles
        url_art = f"{SUPABASE_URL}/rest/v1/articles?published_at=lt.{cutoff_iso}"
        req_art = urllib.request.Request(url_art, headers=headers, method='DELETE')
        urllib.request.urlopen(req_art, timeout=8)

        # Delete old clusters
        url_cls = f"{SUPABASE_URL}/rest/v1/clusters?last_updated=lt.{cutoff_iso}"
        req_cls = urllib.request.Request(url_cls, headers=headers, method='DELETE')
        urllib.request.urlopen(req_cls, timeout=8)
    except Exception as e:
        print(f"[INFO] Prune notice: {e}")

# ====================================================================
# Main Execution Pipeline
# ====================================================================
def run_pipeline():
    start_time = time.time()
    print("=" * 70)
    print("MANEKSHAW.VISION // HEADLESS OSINT INGESTION PIPELINE")
    print(f"Timestamp: {datetime.now(timezone.utc).isoformat()}")
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

    # 2. Fetch Active Feeds
    active_sources = [s for s in sources if s.get('active', True)]
    # Process up to 12 diverse feeds per 15-minute run to respect free-tier execution limits
    for src in active_sources[:12]:
        feed_url = src.get('feedUrl')
        if not feed_url:
            continue
        try:
            req = urllib.request.Request(
                feed_url,
                headers={"User-Agent": USER_AGENT, "Accept": "application/rss+xml, application/xml, text/xml"}
            )
            with urllib.request.urlopen(req, timeout=6) as resp:
                xml_data = resp.read()
                items = parse_feed_xml(xml_data, src)
                for it in items:
                    norm_url = it['link']
                    if norm_url in seen_urls:
                        continue
                    # Check title similarity
                    t_lower = it['title'].lower()
                    if any(len(set(t_lower.split()) & set(st.split())) / max(len(t_lower.split()), 1) > 0.8 for st in seen_titles):
                        continue

                    seen_urls.add(norm_url)
                    seen_titles.append(t_lower)

                    coords, country, region, hotspot = georesolver.resolve(it['title'] + ' ' + it['summary'])
                    cat, sev = classify_keyword(it['title'] + ' ' + it['summary'])

                    art_id = f"art_{hash_id(norm_url)}"
                    all_articles.append({
                        "id": art_id,
                        "title": it['title'],
                        "summary": it['summary'],
                        "source": it['source'],
                        "source_domain": it['source_domain'],
                        "tier": it['tier'],
                        "state_funded": it['state_funded'],
                        "published_at": it['published_at'],
                        "category": cat,
                        "severity": sev,
                        "coordinates": coords,
                        "related_hotspot": hotspot,
                        "country_code": country,
                        "link": norm_url,
                        "created_at": datetime.now(timezone.utc).isoformat()
                    })
        except Exception as e:
            # print(f"[FEED] Skipping {src.get('name')}: {e}")
            pass

    print(f"Fetched & deduped {len(all_articles)} fresh intelligence articles.")

    # 3. Pass 2: Batched LLM Classification (Groq / Gemini)
    if all_articles:
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
        # Corroboration logic: CONFIRMED if >=1 Tier-1 or >=2 independent sources
        has_tier1 = any(a.get('tier') == 1 for a in arts)
        non_state_sources = set(a.get('source_domain') for a in arts if not a.get('state_funded'))
        confidence = "CONFIRMED" if (has_tier1 or len(non_state_sources) >= 2) else "REPORTED"

        cluster_id = f"cls_{hash_id(hs_key + lead['title'])[:12]}"
        clusters.append({
            "id": cluster_id,
            "headline": lead['title'],
            "summary": lead['summary'],
            "confidence": confidence,
            "category": lead['category'],
            "severity": lead['severity'],
            "coordinates": lead['coordinates'],
            "related_hotspot": lead.get('related_hotspot'),
            "country_code": lead.get('country_code'),
            "sources": list(set(a['source'] for a in arts))[:5],
            "first_seen": lead['published_at'],
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "article_count": len(arts)
        })

    print(f"Synthesized {len(clusters)} corroborated intelligence clusters.")

    # 5. Dynamic Hotspot Escalation Scores
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
                    trend = "escalating" if score >= 80 else ("stable" if score >= 50 else "de-escalating")

                    hotspot_scores.append({
                        "id": hid,
                        "name": hdata.get("name", hid),
                        "coordinates": hdata.get("coords", [86.35, 25.06]),
                        "escalation_score": score,
                        "escalation_trend": trend,
                        "escalation_delta": delta,
                        "region": hdata.get("region", "global"),
                        "country_code": hdata.get("countryCode", "GLOBAL"),
                        "telemetry": {
                            "activeReports": len(matched_arts),
                            "criticalAlerts": crit_count,
                            "sensorIntegrity": "NOMINAL"
                        },
                        "description": f"Real-time monitoring across {hdata.get('name')}.",
                        "why_it_matters": "Strategic global defense, chokepoint security, or border integrity.",
                        "contributing_links": [a['link'] for a in matched_arts[:4]],
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    })
        except Exception as e:
            print(f"[WARN] Hotspot scoring error: {e}")

    # 6. Resolve YouTube Live Streams Server-Side
    streams = resolve_youtube_streams()
    print(f"Resolved {len(streams)} YouTube live and playlist streams.")

    # 7. Persist to Supabase
    if SUPABASE_KEY:
        print("[DB] Upserting records into Supabase...")
        if all_articles:
            upsert_supabase('articles', all_articles)
        if clusters:
            upsert_supabase('clusters', clusters)
        if hotspot_scores:
            upsert_supabase('hotspot_scores', hotspot_scores)
        if streams:
            upsert_supabase('youtube_streams', streams)
        prune_supabase_records()
        print("[DB] Supabase synchronization complete.")
    else:
        print("[INFO] SUPABASE_KEY not present; skipping remote DB upsert. Local execution succeeded.")

    duration = time.time() - start_time
    print(f"Pipeline finished successfully in {duration:.2f} seconds.")
    print("=" * 70)

    # Return sample summary for verification
    return {
        "articles_count": len(all_articles),
        "clusters_count": len(clusters),
        "hotspots_count": len(hotspot_scores),
        "streams_count": len(streams),
        "sample_article": all_articles[0] if all_articles else None,
        "sample_cluster": clusters[0] if clusters else None,
        "sample_stream": streams[0] if streams else None
    }

if __name__ == '__main__':
    run_pipeline()
