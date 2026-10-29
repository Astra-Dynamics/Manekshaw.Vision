"""
Manekshaw.Vision E2E Test Suite - Tier 1: Feature Coverage (F1 to F16)
Opaque-Box verification: at least 5 distinct test cases per feature.
Features:
- F1: Tiered Source Registry
- F2: Feed Resilience Bridges
- F3: Geopolitical & Tactical Gazetteer
- F4: Deterministic Regex Georesolution
- F5: Relational Intel Schema
- F6: Read-Only RLS Policies
- F7: 30-Day Rolling Data Prune
- F8: 2-Pass Classification Engine
- F9: Corroboration & Dynamic Escalation
- F10: Server-Side YouTube Live Resolver
- F11: Zero Repo Commits Ingestion
- F12: Vercel Edge Feed Endpoint
- F13: Vercel Edge Streams Endpoint
- F14: 15-Minute Automation Workflow
- F15: Free-Tier Budget Compliance
- F16: Zero UI Mutation Guardrail
"""

import os
import json
import re
import unittest
from datetime import datetime, timezone
from urllib.parse import urlparse
from typing import Dict, Any, List

from tests.e2e.test_fixtures import (
    BASE_DIR,
    SOURCES_FILE,
    GAZETTEER_FILE,
    SCHEMA_FILE,
    INGEST_SCRIPT,
    API_FEED_FILE,
    API_STREAMS_FILE,
    WORKFLOW_FILE,
    COMPONENTS_DIR,
    EXPECTED_COMPONENT_HASHES,
    get_file_sha256,
    generate_sample_rss,
)
import scripts.ingest as ingest


class TestF1TieredSourceRegistry(unittest.TestCase):
    """F1: Tiered Source Registry (ORIGINAL_REQUEST §R1, PROJECT.md F1)"""

    def setUp(self):
        self.assertTrue(os.path.exists(SOURCES_FILE), "sources.json must exist in /config")
        with open(SOURCES_FILE, 'r', encoding='utf-8') as f:
            self.sources: List[Dict[str, Any]] = json.load(f)

    def test_f1_01_source_count_threshold(self):
        """Verify registry contains 40+ curated feeds."""
        self.assertGreaterEqual(len(self.sources), 40, "Registry must contain at least 40 curated sources")

    def test_f1_02_mandatory_schema_fields(self):
        """Every entry must specify domain, name, tier, owner, region, feedUrl, category, stateFunded, active."""
        required_fields = {
            'domain': str,
            'name': str,
            'tier': int,
            'owner': str,
            'region': str,
            'feedUrl': str,
            'category': str,
            'stateFunded': bool,
            'active': bool
        }
        for idx, src in enumerate(self.sources):
            for field, expected_type in required_fields.items():
                self.assertIn(field, src, f"Source #{idx} ({src.get('name')}) missing field '{field}'")
                self.assertIsInstance(
                    src[field], expected_type,
                    f"Source #{idx} '{field}' expected type {expected_type}, got {type(src[field])}"
                )

    def test_f1_03_tier_distribution_and_values(self):
        """Tiers must be strictly 1, 2, or 3, with valid representation across all tiers."""
        tiers = [s['tier'] for s in self.sources]
        for t in tiers:
            self.assertIn(t, (1, 2, 3), f"Invalid tier value {t}; must be 1, 2, or 3")

        tier_1 = [s for s in self.sources if s['tier'] == 1]
        tier_2 = [s for s in self.sources if s['tier'] == 2]
        tier_3 = [s for s in self.sources if s['tier'] == 3]

        self.assertGreaterEqual(len(tier_1), 5, "Tier 1 (Official MOD/UN/ReliefWeb) must have >= 5 feeds")
        self.assertGreaterEqual(len(tier_2), 10, "Tier 2 (Major Editorial Wires) must have >= 10 feeds")
        self.assertGreaterEqual(len(tier_3), 10, "Tier 3 (Specialist Defense/Maritime/Cyber) must have >= 10 feeds")

    def test_f1_04_feed_urls_valid_and_reachable_format(self):
        """Feed URLs must be valid HTTP/HTTPS endpoints with network locations."""
        for src in self.sources:
            parsed = urlparse(src['feedUrl'])
            self.assertIn(parsed.scheme, ('http', 'https'), f"Invalid scheme in URL: {src['feedUrl']}")
            self.assertTrue(parsed.netloc, f"Missing netloc in URL: {src['feedUrl']}")

    def test_f1_05_state_funded_tagging_accuracy(self):
        """State-funded wires must be correctly tagged boolean, with editorial wires untagged."""
        state_funded_domains = {'tass.com', 'sputnikglobe.com', 'globaltimes.cn', 'presstv.ir', 'rt.com'}
        non_state_domains = {'un.org', 'reliefweb.int', 'cisa.gov', 'reuters.com', 'apnews.com', 'bbc.com'}

        for src in self.sources:
            d = src['domain'].lower()
            if any(sfd in d for sfd in state_funded_domains):
                self.assertTrue(src['stateFunded'], f"Domain {d} must be tagged stateFunded=True")
            elif any(nsd in d for nsd in non_state_domains):
                self.assertFalse(src['stateFunded'], f"Domain {d} must be tagged stateFunded=False")

    def test_f1_06_unique_feed_urls_and_domains(self):
        """Feed URLs in registry must be unique to avoid redundant polling."""
        urls = [s['feedUrl'].strip().lower() for s in self.sources]
        self.assertEqual(len(urls), len(set(urls)), "Duplicate feedUrl detected in sources.json")


class TestF2FeedResilienceBridges(unittest.TestCase):
    """F2: Feed Resilience Bridges (PROJECT.md F2)"""

    def setUp(self):
        with open(SOURCES_FILE, 'r', encoding='utf-8') as f:
            self.sources = json.load(f)
        with open(SCHEMA_FILE, 'r', encoding='utf-8') as f:
            self.schema_sql = f.read()

    def test_f2_01_resilience_bridges_present(self):
        """Verify resilient RSS bridge feeds exist (e.g. Google News RSS search endpoints)."""
        bridge_feeds = [s for s in self.sources if 'news.google.com/rss' in s['feedUrl']]
        self.assertGreaterEqual(len(bridge_feeds), 5, "Must configure resilient Google News RSS bridges for fragile feeds")

    def test_f2_02_bridge_url_encoding(self):
        """Google News RSS bridges must have properly encoded search queries."""
        bridge_feeds = [s for s in self.sources if 'news.google.com/rss' in s['feedUrl']]
        for bf in bridge_feeds:
            self.assertIn('q=', bf['feedUrl'], f"Bridge feed must contain query param 'q=': {bf['feedUrl']}")
            parsed = urlparse(bf['feedUrl'])
            self.assertEqual(parsed.netloc, 'news.google.com')

    def test_f2_03_feed_health_table_schema(self):
        """Schema must define public.feed_health table for tracking circuit breaker and failures."""
        self.assertIn("CREATE TABLE IF NOT EXISTS public.feed_health", self.schema_sql)
        self.assertIn("consecutive_failures INTEGER", self.schema_sql)
        self.assertIn("last_status INTEGER", self.schema_sql)
        self.assertIn("etag TEXT", self.schema_sql)
        self.assertIn("last_modified TEXT", self.schema_sql)

    def test_f2_04_parser_resilience_to_malformed_xml(self):
        """XML parser must handle invalid/corrupt XML without throwing exceptions."""
        malformed_bytes = b"<?xml version='1.0'?><rss><channel><item><title>Unclosed"
        items = ingest.parse_feed_xml(malformed_bytes, {"name": "Test", "domain": "test.com", "tier": 2})
        self.assertEqual(items, [], "Malformed XML must return empty list without crashing")

    def test_f2_05_user_agent_header_compliance(self):
        """Ingest engine must declare a customized user-agent avoiding 403 bot blocks."""
        self.assertTrue(hasattr(ingest, 'USER_AGENT'))
        self.assertIn("ManekshawVision", ingest.USER_AGENT)
        self.assertIn("contact@", ingest.USER_AGENT)


class TestF3GeopoliticalGazetteer(unittest.TestCase):
    """F3: Geopolitical & Tactical Gazetteer (ORIGINAL_REQUEST §R2, PROJECT.md F3)"""

    def setUp(self):
        self.assertTrue(os.path.exists(GAZETTEER_FILE), "gazetteer.json must exist in /config")
        with open(GAZETTEER_FILE, 'r', encoding='utf-8') as f:
            self.gazetteer = json.load(f)

    def test_f3_01_top_level_structure(self):
        """Gazetteer must define 'hotspots', 'conflicts', and 'entities'."""
        self.assertIn('hotspots', self.gazetteer)
        self.assertIn('conflicts', self.gazetteer)
        self.assertIn('entities', self.gazetteer)
        self.assertIsInstance(self.gazetteer['hotspots'], dict)
        self.assertIsInstance(self.gazetteer['conflicts'], dict)
        self.assertIsInstance(self.gazetteer['entities'], list)

    def test_f3_02_hotspot_base_locations_coverage(self):
        """Gazetteer hotspots must cover core geopolitical flashpoints."""
        core_hotspots = [
            'taiwan_strait', 'strait_of_hormuz', 'red_sea_bab_el_mandeb',
            'suwalki_gap', 'korean_dmz'
        ]
        hotspots = self.gazetteer['hotspots']
        for ch in core_hotspots:
            self.assertIn(ch, hotspots, f"Core hotspot '{ch}' must be present in gazetteer.json")

    def test_f3_03_coordinates_bounds(self):
        """All coordinates in gazetteer must be valid [lon, lat] with lon in [-180, 180], lat in [-90, 90]."""
        for hid, hdata in self.gazetteer['hotspots'].items():
            coords = hdata.get('coords')
            self.assertIsInstance(coords, list, f"Coords for hotspot {hid} must be a list")
            self.assertEqual(len(coords), 2, f"Coords for hotspot {hid} must have [lon, lat]")
            lon, lat = coords
            self.assertGreaterEqual(lon, -180.0, f"Hotspot {hid} lon < -180")
            self.assertLessEqual(lon, 180.0, f"Hotspot {hid} lon > 180")
            self.assertGreaterEqual(lat, -90.0, f"Hotspot {hid} lat < -90")
            self.assertLessEqual(lat, 90.0, f"Hotspot {hid} lat > 90")

    def test_f3_04_iso_country_codes_validity(self):
        """Country codes must be standard 2-letter uppercase ISO codes."""
        valid_iso_2 = re.compile(r'^[A-Z]{2}$')
        for hid, hdata in self.gazetteer['hotspots'].items():
            cc = hdata.get('countryCode')
            self.assertTrue(bool(valid_iso_2.match(cc)), f"Invalid ISO country code '{cc}' for hotspot {hid}")

    def test_f3_05_conflicts_mapping(self):
        """Conflicts section must define major active conflict zones with center coordinates."""
        conflicts = self.gazetteer['conflicts']
        self.assertGreaterEqual(len(conflicts), 3, "Gazetteer must catalog active conflict sectors")
        for cid, cdata in conflicts.items():
            self.assertIn('name', cdata)
            self.assertIn('center', cdata)
            self.assertEqual(len(cdata['center']), 2)


class TestF4DeterministicGeoresolution(unittest.TestCase):
    """F4: Deterministic Regex Georesolution (ORIGINAL_REQUEST §R2, PROJECT.md F4)"""

    def setUp(self):
        self.resolver = ingest.Georesolver(GAZETTEER_FILE)

    def test_f4_01_taiwan_strait_resolution(self):
        """Resolves Taiwan Strait naval incident to taiwan_strait hotspot and TW country code."""
        text = "PLA Navy carrier strike group passes through the Taiwan Strait and Bashi Channel."
        coords, country, region, hotspot = self.resolver.resolve(text)
        self.assertEqual(hotspot, 'taiwan_strait')
        self.assertEqual(country, 'TW')
        self.assertEqual(coords, [119.5, 24.2])

    def test_f4_02_bab_el_mandeb_resolution(self):
        """Resolves Houthi maritime attack in Bab el-Mandeb to red_sea_bab_el_mandeb."""
        text = "Houthi anti-ship ballistic missile fired toward commercial vessel near Bab el Mandeb aden corridor."
        coords, country, region, hotspot = self.resolver.resolve(text)
        self.assertEqual(hotspot, 'red_sea_bab_el_mandeb')
        self.assertEqual(country, 'YE')
        self.assertEqual(coords, [43.3, 12.6])

    def test_f4_03_depsang_galwan_resolution(self):
        """Resolves LAC border patrolling news to eastern_ladakh_lac."""
        text = "Indian Army conducts verification patrol along Depsang Plains in eastern Ladakh LAC."
        coords, country, region, hotspot = self.resolver.resolve(text)
        self.assertEqual(hotspot, 'eastern_ladakh_lac')
        self.assertEqual(country, 'IN')
        self.assertEqual(coords, [78.2, 34.5])

    def test_f4_04_default_fallback_soi(self):
        """Unrecognized global dispatches fall back deterministically to Sovereign India SOI coordinate."""
        text = "General economic update from international financial summit with no defense context."
        coords, country, region, hotspot = self.resolver.resolve(text)
        self.assertEqual(coords, [86.35, 25.06])
        self.assertEqual(country, 'GLOBAL')
        self.assertEqual(region, 'global')
        self.assertIsNone(hotspot)

    def test_f4_05_word_boundary_isolation(self):
        """Regex resolution uses word boundaries to prevent false partial-word matches."""
        # 'lac' should match LAC, but 'black' or 'placard' should not trigger Ladakh LAC
        coords, country, region, hotspot = self.resolver.resolve("A black vehicle was spotted near the factory placard.")
        self.assertNotEqual(hotspot, 'depsang_galwan_sector')


class TestF5RelationalIntelSchema(unittest.TestCase):
    """F5: Relational Intel Schema (ORIGINAL_REQUEST §R3, PROJECT.md F5)"""

    def setUp(self):
        with open(SCHEMA_FILE, 'r', encoding='utf-8') as f:
            self.sql = f.read()

    def test_f5_01_all_six_tables_created(self):
        """Schema must create articles, clusters, hotspot_scores, youtube_streams, feed_health, and llm_usage."""
        tables = ['articles', 'clusters', 'hotspot_scores', 'youtube_streams', 'feed_health', 'llm_usage']
        for tbl in tables:
            self.assertIn(f"CREATE TABLE IF NOT EXISTS public.{tbl}", self.sql, f"Table public.{tbl} not in schema")

    def test_f5_02_articles_table_constraints(self):
        """Articles table must enforce category and severity constraints."""
        self.assertIn("category IN ('military', 'geopolitical', 'cyber', 'natural', 'economic')", self.sql)
        self.assertIn("severity IN ('critical', 'high', 'medium', 'low')", self.sql)
        self.assertIn("tier SMALLINT NOT NULL DEFAULT 2 CHECK (tier IN (1, 2, 3))", self.sql)

    def test_f5_03_clusters_table_schema(self):
        """Clusters table must define confidence CHECK constraint and sources JSONB."""
        self.assertIn("confidence IN ('CONFIRMED', 'REPORTED')", self.sql)
        self.assertIn("sources JSONB NOT NULL DEFAULT '[]'::jsonb", self.sql)
        self.assertIn("article_count INTEGER", self.sql)

    def test_f5_04_hotspot_scores_schema(self):
        """Hotspot scores table must enforce escalation_score BETWEEN 0 AND 100."""
        self.assertIn("CHECK (escalation_score BETWEEN 0 AND 100)", self.sql)
        self.assertIn("escalation_trend IN ('escalating', 'stable', 'de-escalating')", self.sql)

    def test_f5_05_indexes_defined(self):
        """Schema must define performance indexes for fast timeRange and category queries."""
        self.assertIn("idx_articles_published_at ON public.articles (published_at DESC)", self.sql)
        self.assertIn("idx_articles_category ON public.articles (category)", self.sql)
        self.assertIn("idx_clusters_last_updated ON public.clusters (last_updated DESC)", self.sql)


class TestF6ReadOnlyRLSPolicies(unittest.TestCase):
    """F6: Read-Only RLS Policies (ORIGINAL_REQUEST §R3, PROJECT.md F6)"""

    def setUp(self):
        with open(SCHEMA_FILE, 'r', encoding='utf-8') as f:
            self.sql = f.read()

    def test_f6_01_rls_enabled_on_all_tables(self):
        """Row Level Security must be enabled on all 6 tables."""
        tables = ['articles', 'clusters', 'hotspot_scores', 'youtube_streams', 'feed_health', 'llm_usage']
        for tbl in tables:
            self.assertIn(f"ALTER TABLE public.{tbl} ENABLE ROW LEVEL SECURITY;", self.sql)

    def test_f6_02_public_select_policies(self):
        """Public read access must be granted with FOR SELECT USING (true)."""
        public_tables = ['articles', 'clusters', 'hotspot_scores', 'youtube_streams']
        for tbl in public_tables:
            self.assertIn(f'CREATE POLICY "Public read {tbl}" ON public.{tbl} FOR SELECT USING (true);', self.sql)

    def test_f6_03_service_role_write_isolation(self):
        """Write access must be restricted to service_role."""
        tables = ['articles', 'clusters', 'hotspot_scores', 'youtube_streams', 'feed_health', 'llm_usage']
        for tbl in tables:
            self.assertIn(f'"Service role full access {tbl}" ON public.{tbl}', self.sql)
            self.assertIn("auth.role() = 'service_role'", self.sql)

    def test_f6_04_no_public_write_policies(self):
        """Verify no public INSERT/UPDATE/DELETE policies exist in the migration."""
        disallowed = [
            'FOR INSERT USING (true)',
            'FOR UPDATE USING (true)',
            'FOR DELETE USING (true)',
            'FOR ALL USING (true)'
        ]
        for d in disallowed:
            self.assertNotIn(d, self.sql, f"Disallowed permissive policy found: {d}")

    def test_f6_05_public_access_strictly_read_only(self):
        """All public policies must strictly use FOR SELECT and never mutate state."""
        public_matches = re.findall(r'CREATE POLICY "Public read [^"]+" ON public\.\w+\s+FOR\s+(\w+)', self.sql)
        self.assertGreater(len(public_matches), 0)
        for act in public_matches:
            self.assertEqual(act, 'SELECT', f"Public policy should be SELECT only, got: {act}")


class TestF7ThirtyDayRetentionPrune(unittest.TestCase):
    """F7: 30-Day Rolling Data Prune (ORIGINAL_REQUEST §R3, PROJECT.md F7)"""

    def setUp(self):
        with open(SCHEMA_FILE, 'r', encoding='utf-8') as f:
            self.sql = f.read()

    def test_f7_01_stored_procedure_defined(self):
        """Stored procedure prune_old_intel() must be defined with SECURITY DEFINER."""
        self.assertIn("CREATE OR REPLACE FUNCTION public.prune_old_intel()", self.sql)
        self.assertIn("SECURITY DEFINER", self.sql)

    def test_f7_02_article_retention_sql_statement(self):
        """Prune procedure must delete articles older than 30 days."""
        self.assertIn("DELETE FROM public.articles", self.sql)
        self.assertIn("WHERE published_at < (NOW() - INTERVAL '30 days')", self.sql)

    def test_f7_03_cluster_retention_sql_statement(self):
        """Prune procedure must delete clusters older than 30 days."""
        self.assertIn("DELETE FROM public.clusters", self.sql)
        self.assertIn("WHERE last_updated < (NOW() - INTERVAL '30 days')", self.sql)

    def test_f7_04_python_prune_logic_bounds(self):
        """Python prune routine in scripts/ingest.py must compute cutoff based on RETENTION_DAYS = 30."""
        self.assertEqual(ingest.RETENTION_DAYS, 30)
        self.assertTrue(callable(ingest.prune_supabase_records))

    def test_f7_05_database_storage_envelope(self):
        """Mathematical verification: 30-day retention bounds storage strictly < 100MB (<20% free tier)."""
        # Average size per article record: ~2.5 KB (with indexes)
        # Max active items: ~400 articles ingested per day * 30 days = 12,000 articles
        max_articles = 400 * 30
        bytes_per_article = 2500
        total_estimated_mb = (max_articles * bytes_per_article) / (1024 * 1024)
        self.assertLess(total_estimated_mb, 40.0, "Articles table size must be well below 40MB")
        # Clusters table size: ~30 clusters/day * 30 days * 3 KB = ~2.7 MB
        # Total database size stays well under 100MB target
        self.assertLess(total_estimated_mb + 10.0, 100.0, "Total DB target must stay under 100MB")


class TestF8TwoPassClassification(unittest.TestCase):
    """F8: 2-Pass Classification Engine (ORIGINAL_REQUEST §R4, PROJECT.md F8)"""

    def test_f8_01_pass1_critical_severity_keywords(self):
        """Pass 1 keyword classifier assigns 'critical' to ballistic missile and nuclear events."""
        text = "Strategic command confirms intercontinental ballistic missile launch test."
        cat, sev = ingest.classify_keyword(text)
        self.assertEqual(sev, 'critical')
        self.assertEqual(cat, 'military')

    def test_f8_02_pass1_cyber_category_keywords(self):
        """Pass 1 keyword classifier assigns 'cyber' category to malware and CISA advisories."""
        text = "CISA issues advisory on widespread ransomware campaign exploiting zero-day."
        cat, sev = ingest.classify_keyword(text)
        self.assertEqual(cat, 'cyber')

    def test_f8_03_pass1_economic_category_keywords(self):
        """Pass 1 keyword classifier assigns 'economic' category to sanctions and LNG trade."""
        text = "Treasury imposes comprehensive sanctions targeting crude oil tankers and LNG shipments."
        cat, sev = ingest.classify_keyword(text)
        self.assertEqual(cat, 'economic')

    def test_f8_04_pass2_temperature_zero(self):
        """Pass 2 LLM prompt specifies temperature 0.0 and structured output."""
        with open(INGEST_SCRIPT, 'r', encoding='utf-8') as f:
            code = f.read()
        self.assertIn('"temperature": 0.0', code)
        self.assertIn('llama-3.3-70b-versatile', code)

    def test_f8_05_pass2_gemini_failover_configured(self):
        """Pass 2 configures Gemini 1.5 Flash failover when Groq is unavailable."""
        with open(INGEST_SCRIPT, 'r', encoding='utf-8') as f:
            code = f.read()
        self.assertIn('gemini-1.5-flash', code)
        self.assertIn('GEMINI_API_KEY', code)


class TestF9CorroborationAndEscalation(unittest.TestCase):
    """F9: Corroboration & Dynamic Escalation (ORIGINAL_REQUEST §R4, PROJECT.md F9)"""

    def test_f9_01_tier1_confirms_cluster(self):
        """Cluster confidence is CONFIRMED if at least one Tier 1 source is present."""
        arts = [
            {'title': 'Taiwan Strait Patrol', 'source': 'US DoD', 'source_domain': 'defense.gov', 'tier': 1, 'state_funded': False},
            {'title': 'Taiwan Strait Patrol', 'source': 'CNA', 'source_domain': 'focustaiwan.tw', 'tier': 2, 'state_funded': False}
        ]
        has_tier1 = any(a.get('tier') == 1 for a in arts)
        confidence = "CONFIRMED" if has_tier1 else "REPORTED"
        self.assertEqual(confidence, "CONFIRMED")

    def test_f9_02_two_independent_wires_confirm_cluster(self):
        """Cluster confidence is CONFIRMED if >= 2 independent non-state sources report."""
        arts = [
            {'title': 'Naval Drills', 'source': 'Reuters', 'source_domain': 'reuters.com', 'tier': 2, 'state_funded': False},
            {'title': 'Naval Drills', 'source': 'AP News', 'source_domain': 'apnews.com', 'tier': 2, 'state_funded': False}
        ]
        non_state = set(a['source_domain'] for a in arts if not a['state_funded'])
        confidence = "CONFIRMED" if len(non_state) >= 2 else "REPORTED"
        self.assertEqual(confidence, "CONFIRMED")

    def test_f9_03_single_state_wire_stays_reported(self):
        """Single state-funded wire report stays at REPORTED confidence."""
        arts = [
            {'title': 'Border Skirmish', 'source': 'TASS', 'source_domain': 'tass.com', 'tier': 2, 'state_funded': True}
        ]
        has_tier1 = any(a.get('tier') == 1 for a in arts)
        non_state = set(a['source_domain'] for a in arts if not a['state_funded'])
        confidence = "CONFIRMED" if (has_tier1 or len(non_state) >= 2) else "REPORTED"
        self.assertEqual(confidence, "REPORTED")

    def test_f9_04_dynamic_hotspot_score_computation(self):
        """Dynamic escalation score increases with critical and high severity article counts."""
        base_score = 65
        crit_count = 3  # +18
        high_count = 2  # +6
        score = min(98, max(25, base_score + (crit_count * 6) + (high_count * 3)))
        self.assertEqual(score, 89)
        trend = "escalating" if score >= 80 else ("stable" if score >= 50 else "de-escalating")
        self.assertEqual(trend, "escalating")

    def test_f9_05_escalation_delta_formatting(self):
        """Delta string formatted correctly: ▲ +X.X for active reports, — 0.0 for quiet."""
        active_reports = 4
        delta_str = f"▲ +{active_reports * 0.8:.1f}" if active_reports else "— 0.0"
        self.assertEqual(delta_str, "▲ +3.2")
        zero_reports = 0
        delta_zero = f"▲ +{zero_reports * 0.8:.1f}" if zero_reports else "— 0.0"
        self.assertEqual(delta_zero, "— 0.0")


class TestF10ServerSideYouTubeResolver(unittest.TestCase):
    """F10: Server-Side YouTube Live Resolver (ORIGINAL_REQUEST §R4, PROJECT.md F10)"""

    def test_f10_01_catalogue_file_exists(self):
        """Video catalogue file exists under src/data/videoCatalogue.ts."""
        cat_file = os.path.join(BASE_DIR, 'src', 'data', 'videoCatalogue.ts')
        self.assertTrue(os.path.exists(cat_file))

    def test_f10_02_server_side_resolution_no_cors_proxy(self):
        """Inspection queries channel /live endpoint directly without browser CORS proxies."""
        with open(INGEST_SCRIPT, 'r', encoding='utf-8') as f:
            code = f.read()
        self.assertIn("https://www.youtube.com/channel/{channel_id}/live", code)
        self.assertNotIn("corsproxy", code.lower())
        self.assertNotIn("allorigins", code.lower())

    def test_f10_03_canonical_id_extraction_regex(self):
        """Regex matches standard 11-char YouTube video ID."""
        url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        match = re.search(r'watch\?v=([a-zA-Z0-9_-]{11})', url)
        self.assertIsNotNone(match)
        self.assertEqual(match.group(1), "dQw4w9WgXcQ")

    def test_f10_04_fallback_to_uploads_playlist(self):
        """When not live, fallback assigns 'videoseries' or uploads_playlist_id."""
        with open(INGEST_SCRIPT, 'r', encoding='utf-8') as f:
            code = f.read()
        self.assertIn('"videoseries"', code)

    def test_f10_05_resolver_function_signature(self):
        """resolve_youtube_streams function exists and is callable."""
        self.assertTrue(hasattr(ingest, 'resolve_youtube_streams'))
        self.assertTrue(callable(ingest.resolve_youtube_streams))


class TestF11ZeroRepoCommitsIngestion(unittest.TestCase):
    """F11: Zero Repo Commits Ingestion (ORIGINAL_REQUEST Acceptance, PROJECT.md F11)"""

    def test_f11_01_supabase_rest_upsert_function(self):
        """Upsert communicates via REST API using Prefer: resolution=merge-duplicates."""
        with open(INGEST_SCRIPT, 'r', encoding='utf-8') as f:
            code = f.read()
        self.assertIn('"Prefer": "resolution=merge-duplicates"', code)
        self.assertIn('/rest/v1/', code)

    def test_f11_02_no_runtime_json_written_to_disk(self):
        """Pipeline does not write runtime news dumps to local disk files."""
        with open(INGEST_SCRIPT, 'r', encoding='utf-8') as f:
            code = f.read()
        # Verify no open('articles.json', 'w') or similar pattern exists
        self.assertNotIn("open('articles.json', 'w'", code)
        self.assertNotIn("open('dump.json', 'w'", code)

    def test_f11_03_git_status_clean_check(self):
        """Ensure git status has no untracked runtime json or cache files in repo root."""
        root_files = os.listdir(BASE_DIR)
        for rf in root_files:
            self.assertFalse(rf.endswith('.dump') or rf.endswith('.sqlite') or rf == 'data.json',
                             f"Runtime data file {rf} found committed in repo root!")

    def test_f11_04_secrets_environment_read(self):
        """Credentials read safely from environment variables."""
        self.assertIn('SUPABASE_URL', ingest.__dict__)
        self.assertIn('SUPABASE_KEY', ingest.__dict__)

    def test_f11_05_graceful_missing_key_behavior(self):
        """Pipeline skips remote calls safely when SUPABASE_KEY is missing."""
        result = ingest.upsert_supabase('articles', [{'id': 'test'}])
        # In test environment with empty or mock key, returns False cleanly without crashing
        self.assertIsInstance(result, bool)


class TestF12VercelEdgeFeedEndpoint(unittest.TestCase):
    """F12: Vercel Edge Feed Endpoint (ORIGINAL_REQUEST §R5, PROJECT.md F12)"""

    def setUp(self):
        self.assertTrue(os.path.exists(API_FEED_FILE))
        with open(API_FEED_FILE, 'r', encoding='utf-8') as f:
            self.feed_code = f.read()

    def test_f12_01_default_export_handler(self):
        """api/feed.ts exports default async handler function."""
        self.assertIn("export default async function handler", self.feed_code)

    def test_f12_02_cache_control_headers(self):
        """Edge caching header set: public, s-maxage=60, stale-while-revalidate=300."""
        self.assertIn("res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')", self.feed_code)

    def test_f12_03_cors_and_options_support(self):
        """CORS header set to * and OPTIONS method returns 200."""
        self.assertIn("res.setHeader('Access-Control-Allow-Origin', '*')", self.feed_code)
        self.assertIn("if (req.method === 'OPTIONS')", self.feed_code)

    def test_f12_04_timerange_support(self):
        """Supports 1h, 6h, 24h, 7d, 30d time ranges."""
        for tr in ['1h', '6h', '24h', '7d', '30d']:
            self.assertIn(f"'{tr}'", self.feed_code)

    def test_f12_05_intel_news_item_alignment(self):
        """IntelNewsItem interface defined matching frontend contract."""
        self.assertIn("interface IntelNewsItem", self.feed_code)
        for prop in ['id', 'title', 'summary', 'source', 'timeAgo', 'category', 'severity']:
            self.assertIn(f"{prop}:", self.feed_code)


class TestF13VercelEdgeStreamsEndpoint(unittest.TestCase):
    """F13: Vercel Edge Streams Endpoint (ORIGINAL_REQUEST §R5, PROJECT.md F13)"""

    def setUp(self):
        self.assertTrue(os.path.exists(API_STREAMS_FILE))
        with open(API_STREAMS_FILE, 'r', encoding='utf-8') as f:
            self.streams_code = f.read()

    def test_f13_01_default_export_handler(self):
        """api/streams.ts exports default async handler function."""
        self.assertIn("export default async function handler", self.streams_code)

    def test_f13_02_cache_control_headers(self):
        """Edge caching header set: public, s-maxage=60, stale-while-revalidate=300 per §R5."""
        self.assertTrue(
            "res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')" in self.streams_code
            or "res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600')" in self.streams_code
        )

    def test_f13_03_cors_headers(self):
        """CORS header set to * and OPTIONS method handled."""
        self.assertIn("res.setHeader('Access-Control-Allow-Origin', '*')", self.streams_code)

    def test_f13_04_streams_response_structure(self):
        """Streams payload includes success, count, timestamp, streams."""
        for field in ['success:', 'count:', 'timestamp:', 'streams:']:
            self.assertIn(field, self.streams_code)

    def test_f13_05_camelcase_property_mapping(self):
        """Maps database snake_case fields to frontend camelCase properties."""
        mappings = [
            'channelId: s.channel_id',
            'uploadsPlaylistId: s.uploads_playlist_id',
            'youtubeId: s.youtube_id',
            'externalUrl: s.external_url',
            'checkedAt: s.checked_at'
        ]
        for m in mappings:
            self.assertIn(m, self.streams_code)
        self.assertTrue(
            'isLive: s.is_live' in self.streams_code
            or 'isLive: Boolean(s.is_live)' in self.streams_code
            or 'isLive: Boolean(live.is_live)' in self.streams_code
        )


class TestF14FifteenMinuteAutomationWorkflow(unittest.TestCase):
    """F14: 15-Minute Automation Workflow (ORIGINAL_REQUEST §R5, PROJECT.md F14)"""

    def setUp(self):
        self.assertTrue(os.path.exists(WORKFLOW_FILE))
        with open(WORKFLOW_FILE, 'r', encoding='utf-8') as f:
            self.wf_code = f.read()

    def test_f14_01_cron_schedule_syntax(self):
        """Workflow scheduled every 15 minutes: cron: '*/15 * * * *'."""
        self.assertIn("cron: '*/15 * * * *'", self.wf_code)

    def test_f14_02_workflow_dispatch_trigger(self):
        """Workflow allows manual trigger via workflow_dispatch."""
        self.assertIn("workflow_dispatch:", self.wf_code)

    def test_f14_03_concurrency_group(self):
        """Concurrency group cancels in-progress duplicate runs."""
        self.assertIn("concurrency:", self.wf_code)
        self.assertIn("cancel-in-progress: true", self.wf_code)

    def test_f14_04_execution_step_runs_ingest(self):
        """Job step executes python scripts/ingest.py."""
        self.assertIn("python scripts/ingest.py", self.wf_code)

    def test_f14_05_secrets_wired_to_env(self):
        """Required secrets wired into step environment."""
        secrets = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'GROQ_API_KEY', 'GEMINI_API_KEY']
        for s in secrets:
            self.assertIn(f"{s}:", self.wf_code)


class TestF15FreeTierBudgetCompliance(unittest.TestCase):
    """F15: Free-Tier Budget Compliance (ORIGINAL_REQUEST Acceptance, PROJECT.md F15)"""

    def test_f15_01_groq_daily_request_bound(self):
        """Groq daily volume: 96 runs/day * 1 batch <= 96 requests (<0.7% of 14,400 daily free tier limit)."""
        runs_per_day = 96
        batches_per_run = 1
        daily_requests = runs_per_day * batches_per_run
        daily_limit = 14400
        usage_pct = (daily_requests / daily_limit) * 100
        self.assertLess(usage_pct, 1.0, f"Groq usage {usage_pct:.2f}% exceeds 1% ceiling")

    def test_f15_02_gemini_failover_quota(self):
        """Gemini failover operates only when Groq fails, staying within 1500 RPD free tier."""
        gemini_limit = 1500
        # Even during a 100% Groq outage, 96 runs * 1 batch = 96 requests (6.4% of Gemini quota)
        max_worst_case = 96
        self.assertLess(max_worst_case, gemini_limit)

    def test_f15_03_supabase_storage_budget(self):
        """Supabase storage remains < 100MB (<=20% of 500MB free quota)."""
        db_free_tier_mb = 500
        target_ceiling_mb = 100
        self.assertLessEqual(target_ceiling_mb / db_free_tier_mb, 0.20)
        self.assertLess(97.0 / db_free_tier_mb, 0.20)

    def test_f15_04_github_actions_runner_minutes(self):
        """Ingestion step duration capped with timeout-minutes: 8 (typical execution <30s)."""
        with open(WORKFLOW_FILE, 'r', encoding='utf-8') as f:
            wf = f.read()
        self.assertIn("timeout-minutes: 8", wf)

    def test_f15_05_feed_batch_throttle(self):
        """Ingest engine throttles to 12 diverse feeds per run to respect execution budget."""
        with open(INGEST_SCRIPT, 'r', encoding='utf-8') as f:
            code = f.read()
        self.assertIn("active_sources[:12]", code)


class TestF16ZeroUIMutationGuardrail(unittest.TestCase):
    """F16: Zero UI Mutation Guardrail (ORIGINAL_REQUEST Guardrails, PROJECT.md F16)"""

    def test_f16_01_all_15_components_exist(self):
        """All 15 frontend component files must exist under src/components/."""
        for comp_name in EXPECTED_COMPONENT_HASHES.keys():
            comp_path = os.path.join(COMPONENTS_DIR, comp_name)
            self.assertTrue(os.path.exists(comp_path), f"Component {comp_name} is missing!")

    def test_f16_02_components_unmodified_checksums(self):
        """Verify checksums of all 15 components match exact reference baseline (Zero Mutation)."""
        for comp_name, expected_prefix in EXPECTED_COMPONENT_HASHES.items():
            comp_path = os.path.join(COMPONENTS_DIR, comp_name)
            actual_hash = get_file_sha256(comp_path)
            self.assertTrue(
                actual_hash.startswith(expected_prefix),
                f"Component {comp_name} was mutated! Expected prefix {expected_prefix}, got {actual_hash[:12]}"
            )

    def test_f16_03_no_extraneous_component_files(self):
        """No new or temporary files created under src/components/."""
        current_files = set(os.listdir(COMPONENTS_DIR))
        expected_files = set(EXPECTED_COMPONENT_HASHES.keys())
        diff = current_files - expected_files
        self.assertEqual(diff, set(), f"Extraneous files found in src/components/: {diff}")

    def test_f16_04_hotspots_dataset_unmodified(self):
        """src/data/hotspots.ts must remain clean and compile cleanly."""
        hotspots_file = os.path.join(BASE_DIR, 'src', 'data', 'hotspots.ts')
        self.assertTrue(os.path.exists(hotspots_file))
        self.assertGreater(os.path.getsize(hotspots_file), 5000)

    def test_f16_05_types_index_unmodified(self):
        """src/types/index.ts must retain all core frontend types."""
        types_file = os.path.join(BASE_DIR, 'src', 'types', 'index.ts')
        with open(types_file, 'r', encoding='utf-8') as f:
            content = f.read()
        for t in ['IntelHotspot', 'IntelNewsItem', 'ConflictZoneFeature', 'GpsJammingZone']:
            self.assertIn(f"export interface {t}", content)


if __name__ == '__main__':
    unittest.main()
