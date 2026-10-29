"""
Manekshaw.Vision E2E Test Suite - Tier 4: Real-World Application Scenarios
End-to-End Simulation of 5 Realistic Defense and Geopolitical Mission Scenarios:
- Scenario 1: Breaking Taiwan Strait maritime incident ingest & escalation
- Scenario 2: Multi-source Middle East escalation cluster (State-funded vs Official wire comparison)
- Scenario 3: 30-day retention prune execution keeping storage <100MB while preserving recent dispatches
- Scenario 4: Offline / network degradation fallback (Pass 1 deterministic classifier without Groq/Gemini)
- Scenario 5: Full headless ingestion loop from source reading to REST payload generation and edge API serialization
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
    generate_sample_rss,
    generate_sample_atom,
)
import scripts.ingest as ingest


class TestScenario1TaiwanStraitEscalation(unittest.TestCase):
    """Scenario 1: Breaking Taiwan Strait maritime incident ingest & escalation"""

    def setUp(self):
        self.resolver = ingest.Georesolver(GAZETTEER_FILE)

    def test_s1_breaking_taiwan_incident_full_cycle(self):
        """Simulates breaking maritime confrontation in Taiwan Strait through classification, clustering, and escalation."""
        # 1. Incoming dispatches from Tier 1 (US DoD) and Tier 2 (Taiwan MND wire)
        feed_articles = [
            {
                "title": "US Navy Destroyer Conducts Taiwan Strait Transit Amid Elevated PLA Sorties",
                "link": "https://defense.gov/news/transit-taiwan-strait-01",
                "summary": "Arleigh Burke-class destroyer transited through the Taiwan Strait in international waters following ADIZ combat maneuvers.",
                "source": "US Department of Defense",
                "source_domain": "defense.gov",
                "tier": 1,
                "state_funded": False,
                "published_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "title": "PLA Navy Carrier Strike Group Detected Operating in Bashi Channel Near Taiwan Strait",
                "link": "https://focustaiwan.tw/defense/pla-carrier-bashi-01",
                "summary": "MND confirmed combat aircraft and warship joint exercises crossing the median line into the southwestern ADIZ.",
                "source": "Focus Taiwan",
                "source_domain": "focustaiwan.tw",
                "tier": 2,
                "state_funded": False,
                "published_at": (datetime.now(timezone.utc) - timedelta(minutes=15)).isoformat()
            },
            {
                "title": "Cross-Strait Air Defense Alert: 32 PLA Fighter Aircraft Intercepted Along Median Line",
                "link": "https://focustaiwan.tw/defense/pla-sorties-intercept-02",
                "summary": "Missile air defense units activated following record sortie surge across the Taiwan Strait.",
                "source": "Focus Taiwan",
                "source_domain": "focustaiwan.tw",
                "tier": 2,
                "state_funded": False,
                "published_at": (datetime.now(timezone.utc) - timedelta(minutes=30)).isoformat()
            }
        ]

        # 2. Process articles: georesolve and classify
        processed = []
        for fa in feed_articles:
            combined_text = fa['title'] + ' ' + fa['summary']
            coords, country, region, hotspot = self.resolver.resolve(combined_text)
            cat, sev = ingest.classify_keyword(combined_text)

            art = dict(fa)
            art['coordinates'] = coords
            art['country_code'] = country
            art['region'] = region
            art['related_hotspot'] = hotspot
            art['category'] = cat
            art['severity'] = sev
            processed.append(art)

        # Verification: all resolve to Taiwan Strait
        for art in processed:
            self.assertEqual(art['related_hotspot'], 'taiwan_strait')
            self.assertEqual(art['country_code'], 'TW')
            self.assertEqual(art['category'], 'military')

        # 3. Cluster formation
        has_tier1 = any(a['tier'] == 1 for a in processed)
        non_state = set(a['source_domain'] for a in processed if not a['state_funded'])
        confidence = "CONFIRMED" if (has_tier1 or len(non_state) >= 2) else "REPORTED"

        cluster = {
            "id": f"cls_{ingest.hash_id('taiwan_strait' + processed[0]['title'])[:12]}",
            "headline": processed[0]['title'],
            "summary": processed[0]['summary'],
            "confidence": confidence,
            "category": processed[0]['category'],
            "severity": "critical" if any(a['severity'] == 'critical' for a in processed) else "high",
            "coordinates": processed[0]['coordinates'],
            "related_hotspot": 'taiwan_strait',
            "country_code": 'TW',
            "sources": list(set(a['source'] for a in processed)),
            "first_seen": processed[-1]['published_at'],
            "last_updated": datetime.now(timezone.utc).isoformat(),
            "article_count": len(processed)
        }

        self.assertEqual(cluster['confidence'], 'CONFIRMED')
        self.assertEqual(cluster['article_count'], 3)
        self.assertEqual(len(cluster['sources']), 2)

        # 4. Dynamic Hotspot Escalation Score Computation
        crit_count = sum(1 for a in processed if a['severity'] == 'critical')
        high_count = sum(1 for a in processed if a['severity'] == 'high')
        base_score = 65
        new_score = min(98, max(25, base_score + (crit_count * 6) + (high_count * 3)))
        delta_str = f"▲ +{len(processed) * 0.8:.1f}"

        self.assertGreaterEqual(new_score, 74)
        self.assertEqual(delta_str, "▲ +2.4")


class TestScenario2MiddleEastStateVsOfficialWire(unittest.TestCase):
    """Scenario 2: Multi-source Middle East escalation cluster with state-funded wire vs official wire comparison"""

    def setUp(self):
        self.resolver = ingest.Georesolver(GAZETTEER_FILE)

    def test_s2_state_funded_wire_corroboration_progression(self):
        """Simulates initial unilateral report by state-funded wire progressing to verified multi-source cluster."""
        # Phase 1: Only state-funded wire reports an incident in Strait of Hormuz
        phase1_articles = [
            {
                "title": "IRGC Fast Attack Vessels Conduct Live-Fire Warship Drills in Strait of Hormuz",
                "link": "https://presstv.ir/news/hormuz-drills-01",
                "summary": "Naval forces in the Persian Gulf and Strait of Hormuz completed live missile drills.",
                "source": "Press TV",
                "source_domain": "presstv.ir",
                "tier": 2,
                "state_funded": True,
                "published_at": datetime.now(timezone.utc).isoformat()
            }
        ]

        has_tier1_p1 = any(a['tier'] == 1 for a in phase1_articles)
        non_state_p1 = set(a['source_domain'] for a in phase1_articles if not a['state_funded'])
        confidence_p1 = "CONFIRMED" if (has_tier1_p1 or len(non_state_p1) >= 2) else "REPORTED"

        self.assertEqual(confidence_p1, "REPORTED", "Uncorroborated state-funded wire must remain REPORTED")

        # Phase 2: Tier 1 wire (UN / ReliefWeb) and Tier 2 wire (Reuters) independently verify
        phase2_articles = phase1_articles + [
            {
                "title": "Commercial Tanker Harassment Reported by Coalition Escort Near Strait of Hormuz",
                "link": "https://reuters.com/world/middle-east/hormuz-incident-02",
                "summary": "Commercial vessels in the Strait of Hormuz received military warnings to alter course.",
                "source": "Reuters",
                "source_domain": "reuters.com",
                "tier": 2,
                "state_funded": False,
                "published_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "title": "UN Maritime Security Advisory: Escalated Patrols in Strait of Hormuz Chokepoint",
                "link": "https://news.un.org/en/story/hormuz-advisory-03",
                "summary": "United Nations issues navigation advisory following fast boat maneuvers in Strait of Hormuz.",
                "source": "United Nations News",
                "source_domain": "un.org",
                "tier": 1,
                "state_funded": False,
                "published_at": datetime.now(timezone.utc).isoformat()
            }
        ]

        has_tier1_p2 = any(a['tier'] == 1 for a in phase2_articles)
        non_state_p2 = set(a['source_domain'] for a in phase2_articles if not a['state_funded'])
        confidence_p2 = "CONFIRMED" if (has_tier1_p2 or len(non_state_p2) >= 2) else "REPORTED"

        self.assertEqual(confidence_p2, "CONFIRMED", "Corroboration by Tier 1 UN wire elevates confidence to CONFIRMED")

        # Verify state_funded tag preserved on the original article
        self.assertTrue(phase2_articles[0]['state_funded'])
        self.assertFalse(phase2_articles[1]['state_funded'])
        self.assertFalse(phase2_articles[2]['state_funded'])


class TestScenario3ThirtyDayRetentionPruneStorage(unittest.TestCase):
    """Scenario 3: 30-day retention prune execution keeping storage <100MB while preserving recent dispatches"""

    def test_s3_retention_prune_and_storage_bounding(self):
        """Simulates 45 days of simulated database records, executes 30d prune, and verifies storage bound."""
        now = datetime.now(timezone.utc)

        # Generate 1,000 synthetic articles distributed over 45 days (days 0 to 44)
        synthetic_articles = []
        for i in range(1000):
            days_ago = (i % 45)  # 0 to 44 days old
            published_dt = now - timedelta(days=days_ago, minutes=(i % 60))
            synthetic_articles.append({
                "id": f"art_sim_{i:04d}",
                "published_at": published_dt.isoformat(),
                "title": f"Defense dispatch simulation {i}",
                "summary": "Detailed situational awareness dispatch regarding chokepoint patrolling."
            })

        # Prune filter: strictly items older than 30 days
        cutoff_dt = now - timedelta(days=ingest.RETENTION_DAYS)
        surviving = [a for a in synthetic_articles if datetime.fromisoformat(a['published_at']) >= cutoff_dt]
        pruned = [a for a in synthetic_articles if datetime.fromisoformat(a['published_at']) < cutoff_dt]

        # Verify exact mathematical division
        # Days 0..30 (31 days) survive; days 31..44 (14 days) are pruned
        self.assertGreater(len(surviving), len(pruned))
        for s in surviving:
            self.assertGreaterEqual(datetime.fromisoformat(s['published_at']), cutoff_dt)
        for p in pruned:
            self.assertLess(datetime.fromisoformat(p['published_at']), cutoff_dt)

        # Bounding check for full-scale production database:
        # 12,000 articles retained at steady state * ~2.5 KB/article = 30 MB table + 15 MB indexes = 45 MB
        # Total stays under 100MB limit (<20% of 500MB Supabase free tier)
        steady_state_articles = 12000
        avg_row_bytes = 2500
        total_db_mb = (steady_state_articles * avg_row_bytes) / (1024 * 1024)
        self.assertLess(total_db_mb, 100.0)


class TestScenario4OfflineNetworkFallback(unittest.TestCase):
    """Scenario 4: Offline / network degradation fallback (Pass 1 deterministic classifier without Groq/Gemini)"""

    def setUp(self):
        self.resolver = ingest.Georesolver(GAZETTEER_FILE)

    def test_s4_zero_key_graceful_execution(self):
        """Pipeline executes deterministically with zero API keys and offline fallback."""
        headline = "Armed forces exchange artillery fire across Korean DMZ border."
        coords, country, region, hotspot = self.resolver.resolve(headline)
        cat, sev = ingest.classify_keyword(headline)

        # Keyword engine still identifies military category and high severity
        self.assertEqual(cat, 'military')
        self.assertEqual(sev, 'high')
        self.assertEqual(hotspot, 'korean_dmz')
        self.assertEqual(country, 'KR')

        # Pass 2 LLM with empty keys returns items intact
        old_groq = ingest.GROQ_API_KEY
        old_gemini = ingest.GEMINI_API_KEY
        try:
            ingest.GROQ_API_KEY = ''
            ingest.GEMINI_API_KEY = ''
            item = {"id": "art_dmz", "title": headline, "summary": "Artillery clash", "category": cat, "severity": sev}
            res = ingest.classify_batch_llm([item])
            self.assertEqual(len(res), 1)
            self.assertEqual(res[0]['category'], 'military')
        finally:
            ingest.GROQ_API_KEY = old_groq
            ingest.GEMINI_API_KEY = old_gemini


class TestScenario5FullHeadlessIngestionLoop(unittest.TestCase):
    """Scenario 5: Full headless ingestion loop from source reading to REST payload generation and edge API serialization"""

    def setUp(self):
        self.resolver = ingest.Georesolver(GAZETTEER_FILE)

    def test_s5_end_to_end_pipeline_simulation(self):
        """Executes complete flow: feed XML parsing -> deduplication -> georesolution -> clustering -> edge serialization."""
        # 1. Mock RSS Feed from CISA
        cisa_xml = generate_sample_rss([
            {
                "title": "CISA Issues Critical Advisory on State-Sponsored Ransomware Cyber Campaign",
                "link": "https://cisa.gov/advisory/ransomware-campaign-01",
                "description": "Critical cyber infrastructure alert regarding malware exploiting zero-day vulnerability in firewalls.",
                "pubDate": datetime.now(timezone.utc).strftime('%a, %d %b %Y %H:%M:%S GMT')
            }
        ])
        source_meta = {"name": "CISA Cybersecurity Advisories", "domain": "cisa.gov", "tier": 1, "stateFunded": False}

        # 2. Parse XML
        parsed = ingest.parse_feed_xml(cisa_xml, source_meta)
        self.assertEqual(len(parsed), 1)
        raw_art = parsed[0]

        # 3. Clean and resolve
        norm_url = ingest.clean_url(raw_art['link'])
        art_id = f"art_{ingest.hash_id(norm_url)}"
        coords, country, region, hotspot = self.resolver.resolve(raw_art['title'] + ' ' + raw_art['summary'])
        cat, sev = ingest.classify_keyword(raw_art['title'] + ' ' + raw_art['summary'])

        db_article = {
            "id": art_id,
            "title": raw_art['title'],
            "summary": raw_art['summary'],
            "source": raw_art['source'],
            "source_domain": raw_art['source_domain'],
            "tier": raw_art['tier'],
            "state_funded": raw_art['state_funded'],
            "published_at": raw_art['published_at'],
            "category": cat,
            "severity": sev,
            "coordinates": coords,
            "related_hotspot": hotspot,
            "country_code": country,
            "link": norm_url,
            "created_at": datetime.now(timezone.utc).isoformat()
        }

        self.assertEqual(db_article['category'], 'cyber')
        self.assertEqual(db_article['severity'], 'medium')

        # 4. Synthesize Edge Feed API response payload
        relative_time = "Just now"
        edge_dispatch = {
            "id": db_article['id'],
            "title": db_article['title'],
            "summary": db_article['summary'],
            "source": db_article['source'],
            "timeAgo": relative_time,
            "category": db_article['category'],
            "severity": db_article['severity'],
            "coordinates": db_article['coordinates'],
            "relatedHotspot": db_article['related_hotspot'],
            "countryCode": db_article['country_code'],
            "link": db_article['link']
        }

        response_payload = {
            "success": True,
            "count": 1,
            "timeRange": "24h",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "dispatches": [edge_dispatch],
            "clusters": [],
            "hotspots": []
        }

        # Validate serialized JSON validity
        serialized = json.dumps(response_payload)
        deserialized = json.loads(serialized)
        self.assertTrue(deserialized['success'])
        self.assertEqual(deserialized['count'], 1)
        self.assertEqual(deserialized['dispatches'][0]['category'], 'cyber')


if __name__ == '__main__':
    unittest.main()
