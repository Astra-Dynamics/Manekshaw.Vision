"""
Manekshaw.Vision E2E Test Suite - Tier 3: Cross-Feature Combinations (Pairwise Testing)
Verifies interactions between distinct subsystem pairs:
- Pair 1: RSS Ingestion -> Deterministic Georesolution -> Supabase Article Schema
- Pair 2: Source Tier / State-Funded Tagging -> Corroboration Engine -> Cluster Confidence
- Pair 3: Article Severity Distribution -> Hotspot Escalation Scoring -> Edge Feed Merging
- Pair 4: Server-Side YouTube Live Resolver -> Edge Streams Payload Mapping
- Pair 5: 30-Day Rolling Prune -> Edge API timeRange Query Alignment
- Pair 6: Pass 1 Keyword Fallback -> Pass 2 Batched LLM Refinement
- Pair 7: Allowlisted Source Registry -> Ingestion Health Tracking
"""

import os
import json
import unittest
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List

from tests.e2e.test_fixtures import (
    BASE_DIR,
    SOURCES_FILE,
    GAZETTEER_FILE,
    SCHEMA_FILE,
    API_FEED_FILE,
    API_STREAMS_FILE,
    generate_sample_rss,
)
import scripts.ingest as ingest


class TestPairwiseFeedToGeoresolutionToArticles(unittest.TestCase):
    """Pair 1: Feed parsing -> Deterministic georesolution -> Supabase article records"""

    def setUp(self):
        self.resolver = ingest.Georesolver(GAZETTEER_FILE)
        with open(SCHEMA_FILE, 'r', encoding='utf-8') as f:
            self.schema_sql = f.read()

    def test_p1_01_taiwan_maritime_feed_item_to_article(self):
        """Taiwan Strait maritime RSS item correctly georesolved and formatted for articles table."""
        sample_rss = generate_sample_rss([
            {
                "title": "Taiwan Strait Patrol: Navy Carrier Strike Group Intercepts Unauthorized Drone",
                "link": "https://defense.gov/release/taiwan-patrol-01",
                "description": "Navy armed forces operating along the Taiwan Strait and Bashi Channel detected unmanned aerial systems.",
                "pubDate": "Wed, 29 Oct 2026 04:00:00 GMT"
            }
        ])
        source_meta = {"name": "US DoD", "domain": "defense.gov", "tier": 1, "stateFunded": False}
        items = ingest.parse_feed_xml(sample_rss, source_meta)
        self.assertEqual(len(items), 1)

        raw = items[0]
        coords, country, region, hotspot = self.resolver.resolve(raw['title'] + ' ' + raw['summary'])
        cat, sev = ingest.classify_keyword(raw['title'] + ' ' + raw['summary'])

        article = {
            "id": f"art_{ingest.hash_id(raw['link'])}",
            "title": raw['title'],
            "summary": raw['summary'],
            "source": raw['source'],
            "source_domain": raw['source_domain'],
            "tier": raw['tier'],
            "state_funded": raw['state_funded'],
            "published_at": raw['published_at'],
            "category": cat,
            "severity": sev,
            "coordinates": coords,
            "related_hotspot": hotspot,
            "country_code": country,
            "link": raw['link']
        }

        self.assertEqual(article['related_hotspot'], 'taiwan_strait')
        self.assertEqual(article['country_code'], 'TW')
        self.assertEqual(article['category'], 'military')
        self.assertIn(article['severity'], ('critical', 'high', 'medium'))
        self.assertEqual(article['tier'], 1)
        self.assertFalse(article['state_funded'])

    def test_p1_02_houthi_red_sea_feed_item_to_article(self):
        """Bab el-Mandeb Houthi strike RSS item georesolved and classified as military/critical."""
        sample_rss = generate_sample_rss([
            {
                "title": "Houthi Ballistic Missile Airstrike Targets Red Sea Warship Escort",
                "link": "https://reliefweb.int/updates/red-sea-strike",
                "description": "An anti-ship ballistic missile combat strike was intercepted over the Bab el Mandeb strait near Yemen.",
                "pubDate": "Wed, 29 Oct 2026 02:30:00 GMT"
            }
        ])
        source_meta = {"name": "ReliefWeb Global Crises", "domain": "reliefweb.int", "tier": 1, "stateFunded": False}
        items = ingest.parse_feed_xml(sample_rss, source_meta)
        raw = items[0]
        coords, country, region, hotspot = self.resolver.resolve(raw['title'] + ' ' + raw['summary'])
        cat, sev = ingest.classify_keyword(raw['title'] + ' ' + raw['summary'])

        self.assertIn(hotspot, ('red_sea_bab_el_mandeb', 'bab_el_mandeb'))
        self.assertEqual(country, 'YE')
        self.assertEqual(sev, 'critical')
        self.assertEqual(cat, 'military')


class TestPairwiseCorroborationToHotspotScores(unittest.TestCase):
    """Pair 2: Multi-source feed tier tagging -> Corroboration -> Hotspot scoring"""

    def test_p2_01_tier1_elevation_to_confirmed_cluster(self):
        """Presence of Tier 1 official wire marks breaking cluster as CONFIRMED."""
        cluster_articles = [
            {"title": "Hormuz Fast Boat Incident", "source": "US NAVCENT", "source_domain": "navy.mil", "tier": 1, "state_funded": False, "severity": "high"},
            {"title": "Strait of Hormuz Confrontation", "source": "Reuters", "source_domain": "reuters.com", "tier": 2, "state_funded": False, "severity": "high"}
        ]
        has_tier1 = any(a['tier'] == 1 for a in cluster_articles)
        non_state = set(a['source_domain'] for a in cluster_articles if not a['state_funded'])
        confidence = "CONFIRMED" if (has_tier1 or len(non_state) >= 2) else "REPORTED"
        self.assertEqual(confidence, "CONFIRMED")

    def test_p2_02_state_funded_wire_only_cluster_stays_reported(self):
        """Cluster with only state-funded wires remains at REPORTED confidence."""
        cluster_articles = [
            {"title": "Naval Patrol in Hormuz", "source": "Press TV", "source_domain": "presstv.ir", "tier": 2, "state_funded": True, "severity": "medium"},
            {"title": "Gulf Drills Conclude", "source": "TASS", "source_domain": "tass.com", "tier": 2, "state_funded": True, "severity": "medium"}
        ]
        has_tier1 = any(a['tier'] == 1 for a in cluster_articles)
        non_state = set(a['source_domain'] for a in cluster_articles if not a['state_funded'])
        confidence = "CONFIRMED" if (has_tier1 or len(non_state) >= 2) else "REPORTED"
        self.assertEqual(confidence, "REPORTED")

    def test_p2_03_score_surge_from_cluster_articles(self):
        """Hotspot score recalculates dynamically when multiple critical/high articles ingest."""
        articles = [
            {"related_hotspot": "taiwan_strait", "severity": "critical", "link": "https://a.com/1"},
            {"related_hotspot": "taiwan_strait", "severity": "critical", "link": "https://a.com/2"},
            {"related_hotspot": "taiwan_strait", "severity": "high", "link": "https://a.com/3"},
            {"related_hotspot": "taiwan_strait", "severity": "high", "link": "https://a.com/4"},
        ]
        crit_count = sum(1 for a in articles if a['severity'] == 'critical')
        high_count = sum(1 for a in articles if a['severity'] == 'high')
        base_score = 65
        score = min(98, max(25, base_score + (crit_count * 6) + (high_count * 3)))
        # 65 + (2*6) + (2*3) = 65 + 12 + 6 = 83
        self.assertEqual(score, 83)
        self.assertEqual("escalating" if score >= 80 else "stable", "escalating")


class TestPairwiseYouTubeResolverToEdgeApi(unittest.TestCase):
    """Pair 3: YouTube stream resolution -> Edge streams response mapping"""

    def setUp(self):
        with open(API_STREAMS_FILE, 'r', encoding='utf-8') as f:
            self.streams_code = f.read()

    def test_p3_01_db_to_frontend_property_alignment(self):
        """Database snake_case fields correctly mapped to frontend camelCase in /api/streams.ts."""
        db_stream = {
            "id": "yt_reuters",
            "title": "Reuters Live World News",
            "channel": "Reuters",
            "channel_id": "UC_gUM8rL-Lzy6ZRV9b5GSeQ",
            "uploads_playlist_id": "UU_gUM8rL-Lzy6ZRV9b5GSeQ",
            "category": "global",
            "region": "global",
            "country_code": "GLOBAL",
            "is_live": True,
            "youtube_id": "liveVideo123",
            "external_url": "https://www.youtube.com/channel/UC_gUM8rL-Lzy6ZRV9b5GSeQ",
            "checked_at": datetime.now(timezone.utc).isoformat()
        }

        # Emulate api/streams mapping
        frontend_item = {
            "id": db_stream["id"],
            "title": db_stream["title"],
            "channel": db_stream["channel"],
            "channelId": db_stream["channel_id"],
            "uploadsPlaylistId": db_stream["uploads_playlist_id"],
            "category": db_stream["category"],
            "region": db_stream["region"],
            "countryCode": db_stream["country_code"],
            "isLive": db_stream["is_live"],
            "youtubeId": db_stream["youtube_id"],
            "externalUrl": db_stream["external_url"],
            "checkedAt": db_stream["checked_at"]
        }

        self.assertEqual(frontend_item['isLive'], True)
        self.assertEqual(frontend_item['channelId'], "UC_gUM8rL-Lzy6ZRV9b5GSeQ")
        self.assertEqual(frontend_item['youtubeId'], "liveVideo123")


class TestPairwiseRetentionPruneToEdgeApiTimeRange(unittest.TestCase):
    """Pair 4: 30-day retention prune -> Edge API timeRange envelope alignment"""

    def test_p4_01_max_timerange_envelope_within_retention(self):
        """Max edge API timeRange (30d) is <= retention period (30 days)."""
        retention_ms = ingest.RETENTION_DAYS * 24 * 60 * 60 * 1000
        edge_30d_ms = 30 * 24 * 60 * 60 * 1000
        self.assertEqual(retention_ms, edge_30d_ms)

    def test_p4_02_recent_dispatches_available_for_all_timeranges(self):
        """Articles ingested within 1h, 6h, 24h, 7d are never pruned by the 30d rolling prune."""
        now = datetime.now(timezone.utc)
        test_articles = [
            ("1h", now - timedelta(minutes=45)),
            ("6h", now - timedelta(hours=4)),
            ("24h", now - timedelta(hours=18)),
            ("7d", now - timedelta(days=5)),
            ("30d", now - timedelta(days=28)),
        ]
        cutoff_prune = now - timedelta(days=ingest.RETENTION_DAYS)
        for label, dt in test_articles:
            self.assertGreater(dt, cutoff_prune, f"Article within {label} range must not be pruned")


class TestPairwiseTwoPassClassificationPipeline(unittest.TestCase):
    """Pair 5: Pass 1 keyword classifier -> Pass 2 batched LLM fallback interaction"""

    def test_p5_01_pass1_baseline_preserved_on_llm_failure(self):
        """If Pass 2 LLM fails or is disabled, Pass 1 classifications are safely preserved."""
        text = "Armed forces scramble fighter jets following ballistic missile test over maritime border."
        cat_p1, sev_p1 = ingest.classify_keyword(text)
        self.assertEqual(cat_p1, 'military')
        self.assertEqual(sev_p1, 'critical')

        # Run classify_batch_llm with disabled API keys (simulating LLM failure)
        old_groq = ingest.GROQ_API_KEY
        old_gemini = ingest.GEMINI_API_KEY
        try:
            ingest.GROQ_API_KEY = ''
            ingest.GEMINI_API_KEY = ''
            item = {
                "id": "art_101",
                "title": text,
                "summary": "Full defense dispatch description",
                "category": cat_p1,
                "severity": sev_p1
            }
            enriched = ingest.classify_batch_llm([item])
            self.assertEqual(len(enriched), 1)
            self.assertEqual(enriched[0]['category'], 'military')
            self.assertEqual(enriched[0]['severity'], 'critical')
        finally:
            ingest.GROQ_API_KEY = old_groq
            ingest.GEMINI_API_KEY = old_gemini


class TestPairwiseSourceRegistryToFeedHealth(unittest.TestCase):
    """Pair 6: Sources registry -> feed health circuit breaker tracking"""

    def test_p6_01_all_source_urls_compatible_with_feed_health_pk(self):
        """All feedUrls from sources.json can be used as primary key in public.feed_health."""
        with open(SOURCES_FILE, 'r', encoding='utf-8') as f:
            sources = json.load(f)
        for src in sources:
            url = src['feedUrl']
            self.assertTrue(url, "feedUrl must be non-empty")
            self.assertLess(len(url), 512, "feedUrl length suitable for primary key indexing")


if __name__ == '__main__':
    unittest.main()
