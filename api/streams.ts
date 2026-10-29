import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://fahbbsdgurtwmfjhtxkh.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  let streams: any[] = [];

  if (supabaseKey) {
    try {
      const resp = await fetch(`${supabaseUrl}/rest/v1/youtube_streams?order=checked_at.desc`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Accept: 'application/json'
        }
      });
      if (resp.ok) {
        streams = await resp.json();
      }
    } catch (e) {
      console.warn('[API/streams] Supabase streams fetch error:', e);
    }
  }

  return res.status(200).json({
    success: true,
    count: streams.length,
    timestamp: new Date().toISOString(),
    streams: streams.map((s) => ({
      id: s.id,
      title: s.title,
      channel: s.channel,
      channelId: s.channel_id,
      uploadsPlaylistId: s.uploads_playlist_id,
      category: s.category,
      region: s.region,
      countryCode: s.country_code,
      isLive: s.is_live,
      youtubeId: s.youtube_id,
      externalUrl: s.external_url,
      checkedAt: s.checked_at
    }))
  });
}
