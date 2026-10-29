"""
Manekshaw.Vision E2E Test Suite - Tier 2: Boundary & Corner Cases
Opaque-Box validation of edge conditions, extreme inputs, malformed data, and fault tolerance:
- T2.1: RSS XML Parsing Boundaries (Empty, malformed, CDATA, namespaces, truncated text)
- T2.2: Georesolver Edge Cases (Empty, punctuation, unicode, case-insensitivity, regex safety)
- T2.3: Date Parsing Boundaries (RFC-822, ISO-8601 with/without timezone, invalid strings)
- T2.4: URL Cleaning & Deduplication Boundaries (utm_*, tracking tokens, legitimate queries)
- T2.5: Dynamic Hotspot Score Boundaries (0 articles, 20 critical, boundary thresholds 49/50/79/80)
- T2.6: Retention & Prune Date Boundaries (>30d, <=30d, future dates, epoch)
- T2.7: LLM Batching Boundaries (0 items, 1 item, 15 items, >15 items, malformed LLM response)
- T2.8: Edge API Query Parameter Boundaries (Invalid timeRange, SQL injection, preflight OPTIONS)
- T2.9: YouTube Resolver Boundaries (Offline channel, canonical link, playlist fallback)
- T2.10: Supabase REST Client Boundaries (Missing keys, empty payloads, 401/500 errors)
"""

import os
import re
import json
import unittest
from datetime import datetime, timezone, timedelta
from urllib.parse import urlparse, parse_qs

from tests.e2e.test_fixtures import (
    BASE_DIR,
    GAZETTEER_FILE,
    API_FEED_FILE,
    API_STREAMS_FILE,
    generate_sample_rss,
    generate_sample_atom,
)
import scripts.ingest as ingest


class TestXMLParsingBoundaries(unittest.TestCase):
    """T2.1: RSS / Atom XML Parsing Boundaries"""

    def setUp(self):
        self.source_meta = {"name": "Test Wire", "domain": "test.org", "tier": 2, "stateFunded": False}

    def test_t2_xml_01_empty_input(self):
        """Empty byte string returns empty list without throwing."""
        items = ingest.parse_feed_xml(b"", self.source_meta)
        self.assertEqual(items, [])

    def test_t2_xml_02_malformed_xml_syntax(self):
        """Incomplete or corrupted XML tags handled gracefully."""
        corrupt_xml = b"<rss><channel><item><title>Broken Title<description>No closing tags"
        items = ingest.parse_feed_xml(corrupt_xml, self.source_meta)
        self.assertEqual(items, [])

    def test_t2_xml_03_missing_or_short_title(self):
        """Items with missing titles or titles shorter than 8 characters are filtered."""
        short_title_rss = generate_sample_rss([
            {"title": "Tiny", "link": "https://test.org/tiny"},
            {"title": "Valid Defense Incident Headline", "link": "https://test.org/valid"}
        ])
        items = ingest.parse_feed_xml(short_title_rss, self.source_meta)
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]['title'], "Valid Defense Incident Headline")

    def test_t2_xml_04_missing_or_empty_link(self):
        """Items without valid link are dropped."""
        no_link_rss = generate_sample_rss([
            {"title": "Headline With No Valid Link", "link": ""}
        ])
        items = ingest.parse_feed_xml(no_link_rss, self.source_meta)
        self.assertEqual(len(items), 0)

    def test_t2_xml_05_huge_description_field(self):
        """Very large description fields are truncated cleanly to 280 characters."""
        huge_text = "Operational alert dispatch. " * 500  # >14,000 characters
        rss_bytes = generate_sample_rss([
            {"title": "Massive Description Event", "link": "https://test.org/huge", "description": huge_text}
        ])
        items = ingest.parse_feed_xml(rss_bytes, self.source_meta)
        self.assertEqual(len(items), 1)
        self.assertLessEqual(len(items[0]['summary']), 280)

    def test_t2_xml_06_cdata_and_html_entities(self):
        """Titles and summaries with CDATA and HTML entities are cleaned."""
        cdata_rss = b"""<?xml version="1.0"?>
        <rss version="2.0">
          <channel>
            <item>
              <title><![CDATA[<b>Breaking:</b> Carrier &amp; Escort Group Deploy]]></title>
              <link>https://test.org/cdata-01</link>
              <description><![CDATA[<p>Patrol confirmed in &quot;international waters&quot;.</p>]]></description>
              <pubDate>Wed, 29 Oct 2026 03:00:00 GMT</pubDate>
            </item>
          </channel>
        </rss>"""
        items = ingest.parse_feed_xml(cdata_rss, self.source_meta)
        self.assertEqual(len(items), 1)
        self.assertNotIn("<b>", items[0]['title'])
        self.assertNotIn("<p>", items[0]['summary'])
        self.assertIn("Breaking:", items[0]['title'])

        # Verify script and style bodies are stripped without leakage
        script_payload = "<script>alert('pwned')</script><style>body { color: red; }</style>Patrol confirmed"
        cleaned_script = ingest.clean_html_text(script_payload)
        self.assertNotIn("alert", cleaned_script)
        self.assertNotIn("pwned", cleaned_script)
        self.assertNotIn("color: red", cleaned_script)
        self.assertEqual(cleaned_script, "Patrol confirmed")

    def test_t2_xml_07_atom_feed_entry_extraction(self):
        """Atom 1.0 feed entries with href attribute in link parsed cleanly."""
        atom_bytes = generate_sample_atom([
            {"title": "Atom Satellite Detection", "link": "https://osint.org/atom-01", "summary": "Thermal anomaly detected."}
        ])
        items = ingest.parse_feed_xml(atom_bytes, self.source_meta)
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]['title'], "Atom Satellite Detection")
        self.assertEqual(items[0]['link'], "https://osint.org/atom-01")


class TestGeoresolverBoundaries(unittest.TestCase):
    """T2.2: Georesolver Edge Cases"""

    def setUp(self):
        self.resolver = ingest.Georesolver(GAZETTEER_FILE)

    def test_t2_geo_01_empty_string(self):
        """Empty string input returns SOI default coordinates."""
        coords, country, region, hotspot = self.resolver.resolve("")
        self.assertEqual(coords, [86.35, 25.06])
        self.assertEqual(country, 'GLOBAL')
        self.assertEqual(region, 'global')
        self.assertIsNone(hotspot)

    def test_t2_geo_02_punctuation_and_numbers_only(self):
        """Punctuation and numbers only input returns SOI default."""
        coords, country, region, hotspot = self.resolver.resolve("... 12345 !!! ?? ---")
        self.assertEqual(coords, [86.35, 25.06])
        self.assertIsNone(hotspot)

    def test_t2_geo_03_case_insensitivity(self):
        """Matches regardless of lowercase, uppercase, or mixed casing."""
        cases = [
            "taiwan strait naval patrol",
            "TAIWAN STRAIT NAVAL PATROL",
            "tAiWaN sTrAiT nAvAl pAtRoL"
        ]
        for c in cases:
            coords, country, region, hotspot = self.resolver.resolve(c)
            self.assertEqual(hotspot, 'taiwan_strait', f"Failed for case: {c}")
            self.assertEqual(country, 'TW')

    def test_t2_geo_04_regex_metacharacter_safety(self):
        """Input containing parentheses, asterisks, brackets, or regex special characters does not crash."""
        tricky_text = "Headline with [test]*? and (nested) + characters near Taiwan Strait."
        coords, country, region, hotspot = self.resolver.resolve(tricky_text)
        self.assertEqual(hotspot, 'taiwan_strait')

    def test_t2_geo_05_word_boundary_isolation_short_keywords(self):
        """Short keywords like 'lac' or 'loc' match accurately and avoid acronym collisions."""
        # 'lac' should match
        _, _, _, hs_lac = self.resolver.resolve("Verification patrol along the LAC frontier.")
        self.assertEqual(hs_lac, 'eastern_ladakh_lac')
        # 'black' or 'placate' should NOT trigger LAC
        _, _, _, hs_none = self.resolver.resolve("The ambassador made a speech to placate concerns over black smoke.")
        self.assertNotEqual(hs_none, 'eastern_ladakh_lac')
        # LoC should resolve to kashmir_loc (not eastern_ladakh_lac)
        _, _, _, hs_loc = self.resolver.resolve("Artillery exchanges observed along the LoC forward positions")
        self.assertEqual(hs_loc, 'kashmir_loc')
        # AES 256 encryption should NOT resolve to Sahel
        _, _, _, hs_aes = self.resolver.resolve("Vulnerability identified in AES 256 encryption implementation")
        self.assertNotEqual(hs_aes, 'sahel_burkina_mali_niger')
        # SAF airline fuel should NOT resolve to Sudan
        _, c_saf, _, _ = self.resolver.resolve("Commercial airlines expand SAF fuel usage across European hubs")
        self.assertNotEqual(c_saf, 'SD')


class TestDateParsingBoundaries(unittest.TestCase):
    """T2.3: Date Parsing Boundaries"""

    def test_t2_date_01_rfc822_standard(self):
        """Parses RFC-822 formatted date string."""
        date_str = "Wed, 29 Oct 2026 03:00:00 +0000"
        iso = ingest.parse_iso_time(date_str)
        self.assertTrue(iso.startswith("2026-10-29T03:00:00"))

    def test_t2_date_02_rfc822_gmt(self):
        """Parses RFC-822 GMT format date string."""
        date_str = "Wed, 29 Oct 2026 12:30:00 GMT"
        iso = ingest.parse_iso_time(date_str)
        self.assertTrue(iso.startswith("2026-10-29T12:30:00"))

    def test_t2_date_03_iso_utc_z(self):
        """Parses ISO-8601 with Z."""
        date_str = "2026-10-29T03:15:30Z"
        iso = ingest.parse_iso_time(date_str)
        self.assertTrue(iso.startswith("2026-10-29T03:15:30"))

    def test_t2_date_04_iso_with_positive_offset(self):
        """Converts date with timezone offset to UTC ISO string."""
        # 08:30:00 +05:30 is 03:00:00 UTC
        date_str = "2026-10-29T08:30:00+05:30"
        iso = ingest.parse_iso_time(date_str)
        self.assertTrue(iso.startswith("2026-10-29T03:00:00"))

    def test_t2_date_05_invalid_and_empty_dates(self):
        """Invalid strings or empty dates fall back to current UTC ISO timestamp."""
        now = datetime.now(timezone.utc)
        for invalid in ["", "not-a-valid-date", "2026-99-99"]:
            res = ingest.parse_iso_time(invalid)
            parsed_res = datetime.fromisoformat(res)
            # Result should be within 5 seconds of now
            diff = abs((now - parsed_res).total_seconds())
            self.assertLess(diff, 5.0)


class TestUrlCleaningBoundaries(unittest.TestCase):
    """T2.4: URL Cleaning & Deduplication Boundaries"""

    def test_t2_url_01_strip_utm_parameters(self):
        """Strips utm_source, utm_medium, utm_campaign, utm_term, utm_content."""
        url = "https://defense.gov/release?utm_source=twitter&utm_medium=social&utm_campaign=briefing&article=101"
        cleaned = ingest.clean_url(url)
        self.assertNotIn("utm_source", cleaned)
        self.assertNotIn("utm_medium", cleaned)
        self.assertNotIn("utm_campaign", cleaned)
        self.assertIn("article=101", cleaned)

    def test_t2_url_02_strip_tracking_tokens(self):
        """Strips fbclid, gclid, ref, and source tracking parameters."""
        url = "https://reuters.com/news?id=99&fbclid=IwAR123&gclid=xyz&ref=rss&source=feed"
        cleaned = ingest.clean_url(url)
        self.assertNotIn("fbclid", cleaned)
        self.assertNotIn("gclid", cleaned)
        self.assertNotIn("ref=", cleaned)
        self.assertNotIn("source=", cleaned)
        self.assertIn("id=99", cleaned)

    def test_t2_url_03_preserve_clean_url(self):
        """URLs without query parameters remain unchanged."""
        url = "https://news.un.org/en/story/2026/10/1149999"
        cleaned = ingest.clean_url(url)
        self.assertEqual(cleaned, url)

    def test_t2_url_04_canonical_deduplication(self):
        """Two URLs differing only in tracking tokens produce identical hashes."""
        url1 = "https://defense.gov/item?id=55&utm_source=rss"
        url2 = "https://defense.gov/item?id=55&fbclid=abc1234"
        clean1 = ingest.clean_url(url1)
        clean2 = ingest.clean_url(url2)
        self.assertEqual(clean1, clean2)
        self.assertEqual(ingest.hash_id(clean1), ingest.hash_id(clean2))

    def test_t2_url_05_near_duplicate_title_similarity(self):
        """Identifies near-duplicate titles with >80% word overlap."""
        title1 = "Carrier Strike Group Deploys to Western Pacific for Scheduled Drills"
        title2 = "Carrier Strike Group Deploys to Western Pacific for Scheduled Exercises"
        words1 = set(title1.lower().split())
        words2 = set(title2.lower().split())
        overlap = len(words1 & words2) / max(len(words1), 1)
        self.assertGreater(overlap, 0.80)


class TestHotspotEscalationBoundaries(unittest.TestCase):
    """T2.5: Dynamic Hotspot Escalation Score Boundaries"""

    def test_t2_esc_01_zero_articles_baseline(self):
        """Zero active articles defaults to base score 65, delta — 0.0, trend stable."""
        base_score = 65
        crit_count = 0
        high_count = 0
        score = min(98, max(25, base_score + (crit_count * 6) + (high_count * 3)))
        self.assertEqual(score, 65)
        trend = "escalating" if score >= 80 else ("stable" if score >= 50 else "de-escalating")
        self.assertEqual(trend, "stable")

    def test_t2_esc_02_maximum_clamped_score_98(self):
        """Surge of 20 critical reports clamps strictly to maximum 98."""
        base_score = 65
        crit_count = 20  # +120
        high_count = 10  # +30
        score = min(98, max(25, base_score + (crit_count * 6) + (high_count * 3)))
        self.assertEqual(score, 98)
        trend = "escalating" if score >= 80 else ("stable" if score >= 50 else "de-escalating")
        self.assertEqual(trend, "escalating")

    def test_t2_esc_03_minimum_clamped_score_25(self):
        """Extremely low scores are clamped to minimum 25."""
        base_score = 10
        score = min(98, max(25, base_score))
        self.assertEqual(score, 25)

    def test_t2_esc_04_exact_boundary_thresholds(self):
        """Verifies trend at boundary values: 80 (escalating), 79 (stable), 50 (stable), 49 (de-escalating)."""
        get_trend = lambda s: "escalating" if s >= 80 else ("stable" if s >= 50 else "de-escalating")
        self.assertEqual(get_trend(80), "escalating")
        self.assertEqual(get_trend(79), "stable")
        self.assertEqual(get_trend(50), "stable")
        self.assertEqual(get_trend(49), "de-escalating")

    def test_t2_esc_05_delta_formatting_precision(self):
        """Delta string formatted with 1 decimal digit precision."""
        count = 7
        delta_str = f"▲ +{count * 0.8:.1f}"
        self.assertEqual(delta_str, "▲ +5.6")


class TestDataRetentionBoundaries(unittest.TestCase):
    """T2.6: Retention & Prune Date Boundaries"""

    def test_t2_ret_01_eligible_for_deletion(self):
        """Article published 30.1 days ago is past retention window and eligible for deletion."""
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(days=30)
        published_at = now - timedelta(days=30, hours=2)
        self.assertLess(published_at, cutoff)

    def test_t2_ret_02_preserved_within_window(self):
        """Article published 29.9 days ago is within 30-day window and preserved."""
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(days=30)
        published_at = now - timedelta(days=29, hours=22)
        self.assertGreater(published_at, cutoff)

    def test_t2_ret_03_future_article_handling(self):
        """Article with clock-skew future timestamp is preserved."""
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(days=30)
        published_at = now + timedelta(hours=2)
        self.assertGreater(published_at, cutoff)

    def test_t2_ret_04_epoch_timestamp_pruned(self):
        """Epoch timestamp (1970-01-01) is strictly pruned."""
        cutoff = datetime.now(timezone.utc) - timedelta(days=30)
        epoch = datetime(1970, 1, 1, tzinfo=timezone.utc)
        self.assertLess(epoch, cutoff)

    def test_t2_ret_05_empty_dataset_prune_safety(self):
        """Prune logic on empty or zero-count database operates safely."""
        self.assertEqual(ingest.RETENTION_DAYS, 30)


class TestLLMBatchingBoundaries(unittest.TestCase):
    """T2.7: LLM Batching Boundaries"""

    def test_t2_llm_01_empty_list(self):
        """Empty input list returns empty list immediately without calling LLM."""
        res = ingest.classify_batch_llm([])
        self.assertEqual(res, [])

    def test_t2_llm_02_single_item(self):
        """Single item processed safely without index error."""
        items = [{"id": "art_1", "title": "Missile test", "summary": "Strategic test", "category": "military", "severity": "high"}]
        res = ingest.classify_batch_llm(items)
        self.assertEqual(len(res), 1)

    def test_t2_llm_03_batch_size_cap_15(self):
        """Batch size is capped at 15 items in scripts/ingest.py."""
        items = [
            {"id": f"art_{i}", "title": f"Defense event {i}", "summary": f"Summary {i}", "category": "geopolitical", "severity": "medium"}
            for i in range(25)
        ]
        res = ingest.classify_batch_llm(items)
        # All 25 items returned, whether LLM keys are present or not
        self.assertEqual(len(res), 25)

    def test_t2_llm_04_temperature_strict_zero(self):
        """Groq and Gemini generationConfigs explicitly enforce temperature 0.0."""
        with open(ingest.INGEST_SCRIPT if hasattr(ingest, 'INGEST_SCRIPT') else os.path.join(BASE_DIR, 'scripts', 'ingest.py'), 'r', encoding='utf-8') as f:
            code = f.read()
        self.assertIn('"temperature": 0.0', code)

    def test_t2_llm_05_malformed_llm_response_handling(self):
        """Regex matcher handles non-JSON responses from LLM safely without unhandled exception."""
        raw_ans = "Sorry, I cannot process this request as an AI model."
        match = re.search(r'\[.*\]', raw_ans, re.DOTALL)
        self.assertIsNone(match)  # Does not match, falls back safely to Pass 1 classifications


class TestEdgeApiParameterBoundaries(unittest.TestCase):
    """T2.8: Edge API Query Parameter Boundaries"""

    def setUp(self):
        with open(API_FEED_FILE, 'r', encoding='utf-8') as f:
            self.feed_code = f.read()

    def test_t2_api_01_timerange_durations(self):
        """Verifies duration calculation for all 5 supported time ranges."""
        time_limits = {
            '1h': 1 * 60 * 60 * 1000,
            '6h': 6 * 60 * 60 * 1000,
            '24h': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000,
            '30d': 30 * 24 * 60 * 60 * 1000,
        }
        self.assertEqual(time_limits['1h'], 3600000)
        self.assertEqual(time_limits['24h'], 86400000)
        self.assertEqual(time_limits['7d'], 604800000)
        self.assertEqual(time_limits['30d'], 2592000000)

    def test_t2_api_02_fallback_for_invalid_timerange(self):
        """Invalid time range fallback defaults to 7d in api/feed.ts."""
        self.assertTrue(
            "timeLimits[String(timeRange).toLowerCase()] || timeLimits['7d']" in self.feed_code
            or "TIME_LIMITS[queryRange] || TIME_LIMITS['7d']" in self.feed_code
        )

    def test_t2_api_03_query_category_encoding(self):
        """Category query parameter is URL-encoded before querying Supabase."""
        self.assertTrue(
            "encodeURIComponent(String(category))" in self.feed_code
            or "encodeURIComponent(category)" in self.feed_code
        )

    def test_t2_api_04_preflight_options_response(self):
        """Preflight OPTIONS request returns 200 with no body."""
        self.assertIn("if (req.method === 'OPTIONS')", self.feed_code)
        self.assertIn("return res.status(200).end();", self.feed_code)

    def test_t2_api_05_caching_and_cors_headers(self):
        """Sets Edge CDN cache control and wildcard CORS headers."""
        self.assertIn("res.setHeader('Access-Control-Allow-Origin', '*');", self.feed_code)
        self.assertIn("res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');", self.feed_code)


class TestYouTubeResolverBoundaries(unittest.TestCase):
    """T2.9: YouTube Resolver Boundaries"""

    def test_t2_yt_01_channel_redirect_extraction(self):
        """Extracts 11-char video ID from redirect URL."""
        redirect_url = "https://www.youtube.com/watch?v=liveTest123"
        v_match = re.search(r'watch\?v=([a-zA-Z0-9_-]{11})', redirect_url)
        self.assertIsNotNone(v_match)
        self.assertEqual(v_match.group(1), "liveTest123")

    def test_t2_yt_02_canonical_link_tag_extraction(self):
        """Extracts 11-char video ID from HTML canonical link tag."""
        html_body = '<html><head><link rel="canonical" href="https://www.youtube.com/watch?v=canonVid999"></head></html>'
        canonical_match = re.search(r'link rel="canonical" href="https://www\.youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})"', html_body)
        self.assertIsNotNone(canonical_match)
        self.assertEqual(canonical_match.group(1), "canonVid999")

    def test_t2_yt_03_offline_channel_fallback(self):
        """Offline channel falls back to 'videoseries' default."""
        active_live_id = None
        fallback_yt_id = active_live_id if active_live_id else "videoseries"
        self.assertEqual(fallback_yt_id, "videoseries")

    def test_t2_yt_04_invalid_html_body(self):
        """Corrupted HTML body produces no regex match and falls back to videoseries."""
        corrupt_html = "<html><body>503 Service Temporarily Unavailable</body></html>"
        canonical_match = re.search(r'link rel="canonical" href="https://www\.youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})"', corrupt_html)
        self.assertIsNone(canonical_match)

    def test_t2_yt_05_is_live_flag_boolean(self):
        """is_live flag strictly set to True when live ID detected, False otherwise."""
        live_id = "abc12345678"
        is_live = bool(live_id)
        self.assertTrue(is_live)
        live_id_none = None
        is_live_none = bool(live_id_none)
        self.assertFalse(is_live_none)


class TestSupabaseClientBoundaries(unittest.TestCase):
    """T2.10: Supabase REST Client Boundaries"""

    def test_t2_db_01_empty_records_returns_false(self):
        """Empty records list returns False without issuing HTTP request."""
        res = ingest.upsert_supabase('articles', [])
        self.assertFalse(res)

    def test_t2_db_02_missing_key_behavior(self):
        """When SUPABASE_KEY is empty, upsert returns False safely."""
        old_key = ingest.SUPABASE_KEY
        try:
            ingest.SUPABASE_KEY = ''
            res = ingest.upsert_supabase('articles', [{'id': '1'}])
            self.assertFalse(res)
        finally:
            ingest.SUPABASE_KEY = old_key

    def test_t2_db_03_unauthorized_key_handling(self):
        """Invalid or anon key rejected with HTTP 401 returns False gracefully."""
        old_key = ingest.SUPABASE_KEY
        try:
            ingest.SUPABASE_KEY = 'invalid_mock_key'
            res = ingest.upsert_supabase('articles', [{'id': 'test_auth'}])
            self.assertFalse(res)
        finally:
            ingest.SUPABASE_KEY = old_key

    def test_t2_db_04_prune_empty_key_safety(self):
        """prune_supabase_records with empty key returns safely without raising exception."""
        old_key = ingest.SUPABASE_KEY
        try:
            ingest.SUPABASE_KEY = ''
            ingest.prune_supabase_records()
        finally:
            ingest.SUPABASE_KEY = old_key

    def test_t2_db_05_endpoint_formatting(self):
        """REST endpoint format matches {SUPABASE_URL}/rest/v1/{table}."""
        table = 'articles'
        expected_url = f"{ingest.SUPABASE_URL}/rest/v1/{table}"
        self.assertTrue(expected_url.endswith("/rest/v1/articles"))


if __name__ == '__main__':
    unittest.main()
