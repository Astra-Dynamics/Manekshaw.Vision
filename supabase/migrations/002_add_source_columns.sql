-- ====================================================================
-- Manekshaw.Vision – Migration 002: Add source_url & source_name
-- Run once in Supabase Dashboard → SQL Editor → New query → Run
-- ====================================================================

-- 1. Add columns (idempotent – safe to re-run)
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS source_url  TEXT,
  ADD COLUMN IF NOT EXISTS source_name TEXT;

-- Back-fill source_url from the existing link column for rows that have
-- a non-Google-News link already stored.
UPDATE public.articles
  SET source_url = link
WHERE source_url IS NULL
  AND link IS NOT NULL
  AND link NOT LIKE 'https://news.google.com%'
  AND link NOT LIKE '%/search?q=%'
  AND link NOT LIKE '%/search?hl=%';

-- Back-fill source_name from source_domain or source.
UPDATE public.articles
  SET source_name = COALESCE(source_domain, source)
WHERE source_name IS NULL;

-- 2. Purge rows whose stored link is a Google News or search URL
--    (Run this once after adding the columns so the bad rows are gone.)
DELETE FROM public.articles
WHERE link  LIKE 'https://news.google.com%'
   OR link  LIKE '%/search?q=%'
   OR link  LIKE '%/search?hl=%'
   OR url   LIKE 'https://news.google.com%'
   OR url   LIKE '%/search?q=%';

-- Optionally check how many rows remain after the purge:
-- SELECT COUNT(*) FROM public.articles;

-- 3. Ensure RLS is enabled and policies are in place
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Drop and re-create to be safe (idempotent pattern)
DROP POLICY IF EXISTS articles_select_anon    ON public.articles;
DROP POLICY IF EXISTS articles_insert_service ON public.articles;
DROP POLICY IF EXISTS articles_update_service ON public.articles;
DROP POLICY IF EXISTS articles_delete_service ON public.articles;

CREATE POLICY articles_select_anon    ON public.articles FOR SELECT USING (true);
CREATE POLICY articles_insert_service ON public.articles FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY articles_update_service ON public.articles FOR UPDATE USING  (auth.role() = 'service_role');
CREATE POLICY articles_delete_service ON public.articles FOR DELETE USING  (auth.role() = 'service_role');
