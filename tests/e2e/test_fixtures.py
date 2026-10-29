"""
Manekshaw.Vision E2E Test Suite - Shared Test Fixtures and Utilities
Provides standardized mock data, XML generators, API mocks, and environment harnesses.
"""

import os
import json
import hashlib
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, timedelta

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
CONFIG_DIR = os.path.join(BASE_DIR, 'config')
SOURCES_FILE = os.path.join(CONFIG_DIR, 'sources.json')
GAZETTEER_FILE = os.path.join(CONFIG_DIR, 'gazetteer.json')
SCHEMA_FILE = os.path.join(BASE_DIR, 'supabase', 'migrations', '001_intel_schema.sql')
SCRIPTS_DIR = os.path.join(BASE_DIR, 'scripts')
INGEST_SCRIPT = os.path.join(SCRIPTS_DIR, 'ingest.py')
COMPONENTS_DIR = os.path.join(BASE_DIR, 'src', 'components')
API_FEED_FILE = os.path.join(BASE_DIR, 'api', 'feed.ts')
API_STREAMS_FILE = os.path.join(BASE_DIR, 'api', 'streams.ts')
WORKFLOW_FILE = os.path.join(BASE_DIR, '.github', 'workflows', 'ingest-intel.yml')

# Baseline reference hashes for src/components/* (F16 Zero UI Mutation Guardrail)
EXPECTED_COMPONENT_HASHES: Dict[str, str] = {
    'AlertTicker.tsx': '4c7acce4f2c5',
    'AuthModal.tsx': '416f61e038ee',
    'AuthPage.tsx': '43975d1e3bd3',
    'CommandPalette.tsx': '520b26fa6769',
    'CountryBriefModal.tsx': 'aab92d5a23ea',
    'Header.tsx': '5c18b72c7db1',
    'InspectorDrawer.tsx': '46e0a5ef2344',
    'IntelWorkspaceDrawer.tsx': 'd03b76bb69cd',
    'IntelligenceDrawer.tsx': '2ecf1e71d9d0',
    'LandingPage.tsx': '081441c71556',
    'LayerDock.tsx': 'd3cf2a31c219',
    'MapComponent.tsx': 'a79fec807d41',
    'RightIntelligencePanel.tsx': 'd87b2ee0aaac',
    'UserNav.tsx': 'f5db394a1392',
    'WorkspaceTabBar.tsx': 'e8555016dcb1',
}

def get_file_sha256(filepath: str) -> str:
    """Computes SHA-256 hash of a file."""
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def generate_sample_rss(items: List[Dict[str, str]], channel_title: str = "Defense Wire") -> bytes:
    """Generates valid RSS 2.0 XML bytes for testing feed ingestion."""
    items_xml = []
    for it in items:
        pub_date = it.get('pubDate', datetime.now(timezone.utc).strftime('%a, %d %b %Y %H:%M:%S GMT'))
        items_xml.append(f"""
        <item>
            <title><![CDATA[{it.get('title', 'Breaking Defense Dispatch')}]]></title>
            <link>{it.get('link', 'https://defense.example.com/art-01')}</link>
            <description><![CDATA[{it.get('description', 'Operational alert description')}]]></description>
            <pubDate>{pub_date}</pubDate>
            <guid>{it.get('guid', it.get('link', ''))}</guid>
        </item>
        """)
    xml_str = f"""<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
        <channel>
            <title>{channel_title}</title>
            <link>https://defense.example.com</link>
            <description>OSINT Feed</description>
            {''.join(items_xml)}
        </channel>
    </rss>
    """
    return xml_str.strip().encode('utf-8')

def generate_sample_atom(entries: List[Dict[str, str]], feed_title: str = "Atom OSINT") -> bytes:
    """Generates valid Atom 1.0 XML bytes for testing feed ingestion."""
    entries_xml = []
    for e in entries:
        updated = e.get('updated', datetime.now(timezone.utc).isoformat())
        entries_xml.append(f"""
        <entry>
            <title>{e.get('title', 'Atom Operational Update')}</title>
            <link href="{e.get('link', 'https://osint.example.org/entry-01')}"/>
            <id>{e.get('id', e.get('link', 'tag:example.org,2026:1'))}</id>
            <updated>{updated}</updated>
            <summary>{e.get('summary', 'Atom summary description text')}</summary>
        </entry>
        """)
    xml_str = f"""<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
        <title>{feed_title}</title>
        <link href="https://osint.example.org"/>
        <updated>{datetime.now(timezone.utc).isoformat()}</updated>
        <id>tag:example.org,2026:feed</id>
        {''.join(entries_xml)}
    </feed>
    """
    return xml_str.strip().encode('utf-8')

class MockHTTPResponse:
    """Mock object simulating urllib.request.urlopen response."""
    def __init__(self, data: bytes, status: int = 200, url: str = "https://example.com"):
        self.data = data
        self.status = status
        self._url = url

    def read(self) -> bytes:
        return self.data

    def geturl(self) -> str:
        return self._url

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass
