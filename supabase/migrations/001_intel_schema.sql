-- ====================================================================
-- Manekshaw.Vision - Sovereign Situational Awareness & Defense OSINT
-- Migration: 001_intel_schema.sql
-- Description: Core schema for headless intel ingestion, clusters,
--              hotspot escalation scores, and verified live streams.
-- Retention Policy: 30-Day Rolling Prune Window (<100MB Total DB Target)
-- ====================================================================

-- 1. Dispatches & Articles Table (1:1 with IntelNewsItem)
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  source TEXT NOT NULL,
  source_domain TEXT,
  tier SMALLINT NOT NULL DEFAULT 2 CHECK (tier IN (1, 2, 3)),
  state_funded BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  category TEXT NOT NULL DEFAULT 'geopolitical' CHECK (category IN ('military', 'geopolitical', 'cyber', 'natural', 'economic')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  coordinates JSONB NOT NULL DEFAULT '[86.35, 25.06]'::jsonb,
  related_hotspot TEXT,
  country_code TEXT DEFAULT 'GLOBAL',
  link TEXT NOT NULL,
  cluster_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_severity ON public.articles (severity);
CREATE INDEX IF NOT EXISTS idx_articles_related_hotspot ON public.articles (related_hotspot);

-- 2. Corroborated Intel Clusters (1:1 with Breaking Live Marquee Dispatches)
CREATE TABLE IF NOT EXISTS public.clusters (
  id TEXT PRIMARY KEY,
  headline TEXT NOT NULL,
  summary TEXT,
  confidence TEXT NOT NULL DEFAULT 'REPORTED' CHECK (confidence IN ('CONFIRMED', 'REPORTED')),
  category TEXT NOT NULL DEFAULT 'geopolitical' CHECK (category IN ('military', 'geopolitical', 'cyber', 'natural', 'economic')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  coordinates JSONB NOT NULL DEFAULT '[86.35, 25.06]'::jsonb,
  related_hotspot TEXT,
  country_code TEXT DEFAULT 'GLOBAL',
  sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  article_count INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_clusters_last_updated ON public.clusters (last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_clusters_severity ON public.clusters (severity);

-- 3. Dynamic Hotspot Escalation Scores & Conflict Zones
CREATE TABLE IF NOT EXISTS public.hotspot_scores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  escalation_score INTEGER NOT NULL DEFAULT 50 CHECK (escalation_score BETWEEN 0 AND 100),
  escalation_trend TEXT NOT NULL DEFAULT 'stable' CHECK (escalation_trend IN ('escalating', 'stable', 'de-escalating')),
  escalation_delta TEXT DEFAULT '— 0.0',
  region TEXT,
  country_code TEXT,
  telemetry JSONB DEFAULT '{}'::jsonb,
  description TEXT,
  why_it_matters TEXT,
  contributing_links JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Server-Side Verified YouTube Live Streams & Uploads
CREATE TABLE IF NOT EXISTS public.youtube_streams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  channel TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  uploads_playlist_id TEXT,
  category TEXT,
  region TEXT,
  country_code TEXT,
  is_live BOOLEAN NOT NULL DEFAULT false,
  youtube_id TEXT NOT NULL,
  external_url TEXT,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_youtube_streams_is_live ON public.youtube_streams (is_live);

-- 5. Ingestion Health & Circuit Breaker Tracking
CREATE TABLE IF NOT EXISTS public.feed_health (
  feed_url TEXT PRIMARY KEY,
  etag TEXT,
  last_modified TEXT,
  consecutive_failures INTEGER NOT NULL DEFAULT 0,
  last_status INTEGER NOT NULL DEFAULT 200,
  last_error TEXT,
  last_item_count INTEGER NOT NULL DEFAULT 0,
  cooldown_until TIMESTAMPTZ,
  last_checked TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. LLM Token & Request Quota Governance
CREATE TABLE IF NOT EXISTS public.llm_usage (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  provider TEXT NOT NULL CHECK (provider IN ('groq', 'gemini')),
  model TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  token_count INTEGER NOT NULL DEFAULT 0,
  last_called TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (date, provider, model)
);

-- 7. Row Level Security (RLS) - Public Read-Only / Service Role Write
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotspot_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.llm_usage ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active data tables
CREATE POLICY "Public read articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Public read clusters" ON public.clusters FOR SELECT USING (true);
CREATE POLICY "Public read hotspot_scores" ON public.hotspot_scores FOR SELECT USING (true);
CREATE POLICY "Public read youtube_streams" ON public.youtube_streams FOR SELECT USING (true);

-- Service role full access for headless ingestion worker
CREATE POLICY "Service role full access articles" ON public.articles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access clusters" ON public.clusters FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access hotspot_scores" ON public.hotspot_scores FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access youtube_streams" ON public.youtube_streams FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access feed_health" ON public.feed_health FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access llm_usage" ON public.llm_usage FOR ALL USING (auth.role() = 'service_role');

-- 8. 30-Day Automated Rolling Prune Stored Procedure
CREATE OR REPLACE FUNCTION public.prune_old_intel()
RETURNS TABLE (pruned_articles INTEGER, pruned_clusters INTEGER) AS $$
DECLARE
  v_articles_count INTEGER;
  v_clusters_count INTEGER;
BEGIN
  -- Strict 30-day retention to power the 30d filter without exceeding free storage
  DELETE FROM public.articles
  WHERE published_at < (NOW() - INTERVAL '30 days');
  GET DIAGNOSTICS v_articles_count = ROW_COUNT;

  DELETE FROM public.clusters
  WHERE last_updated < (NOW() - INTERVAL '30 days');
  GET DIAGNOSTICS v_clusters_count = ROW_COUNT;

  RETURN QUERY SELECT v_articles_count, v_clusters_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
