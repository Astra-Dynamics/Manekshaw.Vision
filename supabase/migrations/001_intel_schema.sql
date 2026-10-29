-- ====================================================================
-- Manekshaw.Vision - Sovereign Situational Awareness & Defense OSINT
-- Migration: 001_intel_schema.sql
-- Description: Core schema for headless intel ingestion, clusters,
--              hotspot escalation scores, verified live streams,
--              feed health circuit breakers, and LLM quota governance.
-- Retention Policy: 30-Day Rolling Prune Window (<100MB Total DB Target)
-- Free-Tier Ceiling: <20% Supabase Free Tier (500MB max limit)
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. Dispatches & Articles Table (1:1 with IntelNewsItem)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  source TEXT NOT NULL,
  source_name TEXT,
  source_domain TEXT,
  tier SMALLINT NOT NULL DEFAULT 2 CHECK (tier IN (1, 2, 3)),
  source_tier SMALLINT CHECK (source_tier IN (1, 2, 3)),
  state_funded BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  category TEXT NOT NULL DEFAULT 'geopolitical' CHECK (category IN ('military', 'geopolitical', 'cyber', 'natural', 'economic')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  coordinates JSONB NOT NULL DEFAULT '[86.35, 25.06]'::jsonb,
  related_hotspot TEXT,
  country_code TEXT DEFAULT 'GLOBAL',
  link TEXT NOT NULL,
  url TEXT,
  cluster_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  ingested_at TIMESTAMPTZ DEFAULT now()
);

-- Primary query and retention indexes for articles
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_severity ON public.articles (severity);
CREATE INDEX IF NOT EXISTS idx_articles_related_hotspot ON public.articles (related_hotspot);
CREATE INDEX IF NOT EXISTS idx_articles_country_code ON public.articles (country_code);
CREATE INDEX IF NOT EXISTS idx_articles_tier ON public.articles (tier);
CREATE INDEX IF NOT EXISTS idx_articles_link ON public.articles (link);
CREATE INDEX IF NOT EXISTS idx_articles_category_published ON public.articles (category, published_at DESC);

-- --------------------------------------------------------------------
-- 2. Corroborated Intel Clusters (1:1 with Breaking Live Marquee Dispatches)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clusters (
  id TEXT PRIMARY KEY,
  cluster_id TEXT,
  headline TEXT NOT NULL,
  title TEXT,
  summary TEXT,
  confidence TEXT NOT NULL DEFAULT 'REPORTED' CHECK (confidence IN ('CONFIRMED', 'REPORTED')),
  category TEXT NOT NULL DEFAULT 'geopolitical' CHECK (category IN ('military', 'geopolitical', 'cyber', 'natural', 'economic')),
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  coordinates JSONB NOT NULL DEFAULT '[86.35, 25.06]'::jsonb,
  related_hotspot TEXT,
  related_hotspots TEXT[],
  country_code TEXT DEFAULT 'GLOBAL',
  sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  source_count INTEGER DEFAULT 1,
  highest_tier SMALLINT DEFAULT 2,
  article_ids TEXT[],
  categories TEXT[],
  escalation_score INTEGER DEFAULT 50,
  first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  first_seen_at TIMESTAMPTZ DEFAULT now(),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_updated_at TIMESTAMPTZ DEFAULT now(),
  article_count INTEGER NOT NULL DEFAULT 1
);

-- Primary query and prune indexes for clusters
CREATE INDEX IF NOT EXISTS idx_clusters_last_updated ON public.clusters (last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_clusters_severity ON public.clusters (severity);
CREATE INDEX IF NOT EXISTS idx_clusters_category ON public.clusters (category);
CREATE INDEX IF NOT EXISTS idx_clusters_confidence ON public.clusters (confidence);
CREATE INDEX IF NOT EXISTS idx_clusters_related_hotspot ON public.clusters (related_hotspot);

-- --------------------------------------------------------------------
-- 3. Dynamic Hotspot Escalation Scores & Conflict Zones
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hotspot_scores (
  id TEXT PRIMARY KEY,
  hotspot_id TEXT,
  name TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  escalation_score INTEGER NOT NULL DEFAULT 50 CHECK (escalation_score BETWEEN 0 AND 100),
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  escalation_trend TEXT NOT NULL DEFAULT 'stable' CHECK (escalation_trend IN ('escalating', 'stable', 'de-escalating')),
  escalation_delta TEXT DEFAULT '— 0.0',
  delta INTEGER,
  region TEXT,
  country_code TEXT,
  telemetry JSONB DEFAULT '{}'::jsonb,
  description TEXT,
  why_it_matters TEXT,
  contributing_links JSONB DEFAULT '[]'::jsonb,
  article_count INTEGER DEFAULT 0,
  top_category TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_updated_at TIMESTAMPTZ DEFAULT now()
);

-- Query and sorting indexes for hotspot scores
CREATE INDEX IF NOT EXISTS idx_hotspot_scores_updated_at ON public.hotspot_scores (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_hotspot_scores_escalation_score ON public.hotspot_scores (escalation_score DESC);
CREATE INDEX IF NOT EXISTS idx_hotspot_scores_region ON public.hotspot_scores (region);

-- --------------------------------------------------------------------
-- 4. Server-Side Verified YouTube Live Streams & Uploads
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.youtube_streams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  channel TEXT NOT NULL,
  channel_name TEXT,
  channel_id TEXT NOT NULL,
  uploads_playlist_id TEXT,
  category TEXT,
  region TEXT,
  country_code TEXT,
  is_live BOOLEAN NOT NULL DEFAULT false,
  status TEXT,
  youtube_id TEXT NOT NULL,
  video_id TEXT,
  external_url TEXT,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_checked_at TIMESTAMPTZ DEFAULT now()
);

-- Fast lookup indexes for streams
CREATE INDEX IF NOT EXISTS idx_youtube_streams_is_live ON public.youtube_streams (is_live);
CREATE INDEX IF NOT EXISTS idx_youtube_streams_checked_at ON public.youtube_streams (checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_youtube_streams_channel_id ON public.youtube_streams (channel_id);

-- --------------------------------------------------------------------
-- 5. Ingestion Health & Circuit Breaker Tracking
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feed_health (
  feed_url TEXT PRIMARY KEY,
  domain TEXT,
  etag TEXT,
  last_modified TEXT,
  consecutive_failures INTEGER NOT NULL DEFAULT 0 CHECK (consecutive_failures >= 0),
  last_status INTEGER NOT NULL DEFAULT 200,
  status INTEGER,
  last_error TEXT,
  error_message TEXT,
  last_item_count INTEGER NOT NULL DEFAULT 0,
  articles_fetched INTEGER DEFAULT 0,
  cooldown_until TIMESTAMPTZ,
  last_checked TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_fetch_at TIMESTAMPTZ DEFAULT now()
);

-- Health and monitoring indexes
CREATE INDEX IF NOT EXISTS idx_feed_health_last_checked ON public.feed_health (last_checked DESC);
CREATE INDEX IF NOT EXISTS idx_feed_health_consecutive_failures ON public.feed_health (consecutive_failures);

-- --------------------------------------------------------------------
-- 6. LLM Token & Request Quota Governance
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.llm_usage (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  provider TEXT NOT NULL CHECK (provider IN ('groq', 'gemini')),
  model TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  token_count INTEGER NOT NULL DEFAULT 0 CHECK (token_count >= 0),
  prompt_tokens INTEGER DEFAULT 0 CHECK (prompt_tokens >= 0),
  completion_tokens INTEGER DEFAULT 0 CHECK (completion_tokens >= 0),
  cost_estimate NUMERIC(10, 6) DEFAULT 0.0,
  last_called TIMESTAMPTZ NOT NULL DEFAULT now(),
  timestamp TIMESTAMPTZ DEFAULT now(),
  UNIQUE (date, provider, model)
);

-- Quota and governance indexes
CREATE INDEX IF NOT EXISTS idx_llm_usage_date ON public.llm_usage (date DESC);
CREATE INDEX IF NOT EXISTS idx_llm_usage_provider ON public.llm_usage (provider);

-- --------------------------------------------------------------------
-- 7. Row Level Security (RLS) - Public Read-Only / Service Role Write
-- --------------------------------------------------------------------
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotspot_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.llm_usage ENABLE ROW LEVEL SECURITY;

-- 7.1 Public read access to all 6 tables (read-only for anonymous/public visitors)
DROP POLICY IF EXISTS "Public read articles" ON public.articles;
CREATE POLICY "Public read articles" ON public.articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read clusters" ON public.clusters;
CREATE POLICY "Public read clusters" ON public.clusters FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read hotspot_scores" ON public.hotspot_scores;
CREATE POLICY "Public read hotspot_scores" ON public.hotspot_scores FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read youtube_streams" ON public.youtube_streams;
CREATE POLICY "Public read youtube_streams" ON public.youtube_streams FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read feed_health" ON public.feed_health;
CREATE POLICY "Public read feed_health" ON public.feed_health FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read llm_usage" ON public.llm_usage;
CREATE POLICY "Public read llm_usage" ON public.llm_usage FOR SELECT USING (true);

-- 7.2 Service role full access for headless ingestion worker and backend
DROP POLICY IF EXISTS "Service role full access articles" ON public.articles;
CREATE POLICY "Service role full access articles" ON public.articles
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access clusters" ON public.clusters;
CREATE POLICY "Service role full access clusters" ON public.clusters
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access hotspot_scores" ON public.hotspot_scores;
CREATE POLICY "Service role full access hotspot_scores" ON public.hotspot_scores
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access youtube_streams" ON public.youtube_streams;
CREATE POLICY "Service role full access youtube_streams" ON public.youtube_streams
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access feed_health" ON public.feed_health;
CREATE POLICY "Service role full access feed_health" ON public.feed_health
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access llm_usage" ON public.llm_usage;
CREATE POLICY "Service role full access llm_usage" ON public.llm_usage
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 7.3 Schema permissions for public and backend roles
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- --------------------------------------------------------------------
-- 8. 30-Day Automated Rolling Prune Stored Procedure
-- --------------------------------------------------------------------
-- Default zero-argument procedure fulfilling strict 30-day retention contract
CREATE OR REPLACE FUNCTION public.prune_old_intel()
RETURNS TABLE (pruned_articles INTEGER, pruned_clusters INTEGER) AS $$
DECLARE
  v_articles_count INTEGER;
  v_clusters_count INTEGER;
BEGIN
  -- Strict 30-day retention to power the 30d filter while keeping storage <100MB (<20% free tier limit)
  DELETE FROM public.articles
  WHERE published_at < (NOW() - INTERVAL '30 days');
  GET DIAGNOSTICS v_articles_count = ROW_COUNT;

  DELETE FROM public.clusters
  WHERE last_updated < (NOW() - INTERVAL '30 days');
  GET DIAGNOSTICS v_clusters_count = ROW_COUNT;

  RETURN QUERY SELECT v_articles_count, v_clusters_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Parameterized overload for flexible retention window testing
CREATE OR REPLACE FUNCTION public.prune_old_intel(retention_days INTEGER)
RETURNS TABLE (pruned_articles INTEGER, pruned_clusters INTEGER) AS $$
DECLARE
  v_articles_count INTEGER;
  v_clusters_count INTEGER;
  v_cutoff TIMESTAMPTZ;
BEGIN
  v_cutoff := NOW() - (retention_days * INTERVAL '1 day');

  DELETE FROM public.articles
  WHERE published_at < v_cutoff;
  GET DIAGNOSTICS v_articles_count = ROW_COUNT;

  DELETE FROM public.clusters
  WHERE last_updated < v_cutoff;
  GET DIAGNOSTICS v_clusters_count = ROW_COUNT;

  RETURN QUERY SELECT v_articles_count, v_clusters_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.prune_old_intel() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.prune_old_intel(INTEGER) TO authenticated, service_role;
