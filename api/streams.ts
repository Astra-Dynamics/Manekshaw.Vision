import { createHash } from 'crypto';

export interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
  body?: any;
}

export interface VercelResponse {
  status(code: number): VercelResponse;
  json(body: any): VercelResponse;
  setHeader(name: string, value: string | number | readonly string[]): VercelResponse;
  end(chunk?: any): VercelResponse;
}

export interface VideoStreamItem {
  id: string;
  title: string;
  channel: string;
  channelId: string;
  uploadsPlaylistId: string;
  category: string;
  region: string;
  regionGroup: string;
  countryCode: string;
  isLive: boolean;
  isSpecialAnalyst?: boolean;
  tags: string[];
  youtubeId: string;
  externalUrl: string;
  description: string;
  monogram: string;
  streamUrl?: string;
  checkedAt?: string;
}

// 100% Self-Contained Baseline 24/7 Live News & Special Analysts
const BASELINE_STREAMS: VideoStreamItem[] = [
  // India 24/7 Live News
  {
    id: 'dd_india',
    title: 'DD India 24/7 Live',
    channel: 'DD India',
    channelId: 'UCGDQNvybfDDeGTf4GtigXaw',
    uploadsPlaylistId: 'UUGDQNvybfDDeGTf4GtigXaw',
    category: '24/7 LIVE NEWS',
    region: 'India / S. Asia',
    regionGroup: 'INDIA',
    countryCode: 'IN',
    isLive: true,
    tags: ['Public Broadcaster', 'National Security', 'India'],
    youtubeId: '0cK3B6X6q50',
    externalUrl: 'https://www.youtube.com/@DDIndia',
    description: 'India public service broadcaster providing authoritative government statements and defense dispatches.',
    monogram: 'DDI'
  },
  {
    id: 'wion_live',
    title: 'WION: World Is One News Live',
    channel: 'WION',
    channelId: 'UC_gUM8rL-Lzy6Z832PDOzsA',
    uploadsPlaylistId: 'UU_gUM8rL-Lzy6Z832PDOzsA',
    category: '24/7 LIVE NEWS',
    region: 'India / S. Asia',
    regionGroup: 'INDIA',
    countryCode: 'IN',
    isLive: true,
    tags: ['Indo-Pacific', 'Defense Analysis', 'Global Flashpoints'],
    youtubeId: 'w_Ma8oQLmSM',
    externalUrl: 'https://www.youtube.com/@WION',
    description: 'International English news network focusing on global geopolitics and Indo-Pacific maritime security.',
    monogram: 'WION'
  },
  {
    id: 'ndtv_live',
    title: 'NDTV 24x7 Live',
    channel: 'NDTV 24x7',
    channelId: 'UCZFMm1mMw0F81Z37aaEzTUA',
    uploadsPlaylistId: 'UUZFMm1mMw0F81Z37aaEzTUA',
    category: '24/7 LIVE NEWS',
    region: 'India / S. Asia',
    regionGroup: 'INDIA',
    countryCode: 'IN',
    isLive: true,
    tags: ['National Security', 'South Asia', 'Breaking News'],
    youtubeId: '3mYg1q0j1rU',
    externalUrl: 'https://www.youtube.com/@ndtv',
    description: 'Indian English news network delivering live coverage of national security and regional diplomacy.',
    monogram: 'NDTV'
  },
  {
    id: 'india_today_live',
    title: 'India Today Live',
    channel: 'India Today',
    channelId: 'UCYPvAwZP8pZhSMW8qs7cVCw',
    uploadsPlaylistId: 'UUYPvAwZP8pZhSMW8qs7cVCw',
    category: '24/7 LIVE NEWS',
    region: 'India / S. Asia',
    regionGroup: 'INDIA',
    countryCode: 'IN',
    isLive: true,
    tags: ['Defense News', 'Border Security', 'India'],
    youtubeId: 'sKWWqV8mG40',
    externalUrl: 'https://www.youtube.com/@indiatoday',
    description: 'Frontline defense reporting, military procurement analysis, and South Asian strategic affairs.',
    monogram: 'ITD'
  },
  {
    id: 'aaj_tak_live',
    title: 'Aaj Tak Live',
    channel: 'Aaj Tak',
    channelId: 'UCt4t-jeY85JegMlZ-E5UWtA',
    uploadsPlaylistId: 'UUt4t-jeY85JegMlZ-E5UWtA',
    category: '24/7 LIVE NEWS',
    region: 'India / S. Asia',
    regionGroup: 'INDIA',
    countryCode: 'IN',
    isLive: true,
    tags: ['National Security', 'Hindi News', 'Breaking'],
    youtubeId: 'Nq2wYlWFucg',
    externalUrl: 'https://www.youtube.com/@aajtak',
    description: 'Premier Indian news broadcaster delivering 24/7 breaking national defense and political coverage.',
    monogram: 'ATK'
  },
  {
    id: 'sansad_tv_live',
    title: 'Sansad TV Live (Parliament of India)',
    channel: 'Sansad TV',
    channelId: 'UCv01OP4p0c1XnB3fG7B1P-w',
    uploadsPlaylistId: 'UUv01OP4p0c1XnB3fG7B1P-w',
    category: '24/7 LIVE NEWS',
    region: 'India / S. Asia',
    regionGroup: 'INDIA',
    countryCode: 'IN',
    isLive: true,
    tags: ['Parliament of India', 'Lok Sabha', 'Rajya Sabha'],
    youtubeId: '7T_2K1pX6pE',
    externalUrl: 'https://www.youtube.com/@SansadTV',
    description: 'Official broadcast of parliamentary proceedings, defense committee hearings, and legislative affairs.',
    monogram: 'STV'
  },
  {
    id: 'firstpost_live',
    title: 'Firstpost Live (Vantage)',
    channel: 'Firstpost',
    channelId: 'UCz8QaiQxApLq8sLNcszYyJw',
    uploadsPlaylistId: 'UUz8QaiQxApLq8sLNcszYyJw',
    category: '24/7 LIVE NEWS',
    region: 'India / S. Asia',
    regionGroup: 'INDIA',
    countryCode: 'IN',
    isLive: true,
    tags: ['Vantage', 'Palki Sharma', 'Geopolitics', 'Global South'],
    youtubeId: 'H9bS51o1q3g',
    externalUrl: 'https://www.youtube.com/@Firstpost',
    description: 'Global geopolitical analysis and strategic affairs from an Indian and Global South perspective.',
    monogram: 'FP'
  },

  // Global 24/7 Live News
  {
    id: 'aljazeera_live',
    title: 'Al Jazeera English Live',
    channel: 'Al Jazeera English',
    channelId: 'UC6ZFN9Tx6xh-skXCuRHCDpQ',
    uploadsPlaylistId: 'UU6ZFN9Tx6xh-skXCuRHCDpQ',
    category: '24/7 LIVE NEWS',
    region: 'Middle East',
    regionGroup: 'MIDDLE_EAST',
    countryCode: 'QA',
    isLive: true,
    tags: ['Middle East', 'Global News', 'Conflict Coverage'],
    youtubeId: 'gCNeDWCI0vo',
    externalUrl: 'https://www.youtube.com/@aljazeeraenglish',
    description: 'Continuous 24/7 live news coverage with extensive field reporting across the Middle East and Africa.',
    monogram: 'AJE'
  },
  {
    id: 'dw_live',
    title: 'Deutsche Welle News Live',
    channel: 'DW News',
    channelId: 'UCknLrEdhRCp1HK5ECQ9nkJw',
    uploadsPlaylistId: 'UUknLrEdhRCp1HK5ECQ9nkJw',
    category: '24/7 LIVE NEWS',
    region: 'Europe / UK',
    regionGroup: 'EUROPE',
    countryCode: 'DE',
    isLive: true,
    tags: ['Europe', 'NATO', 'International Politics'],
    youtubeId: 'Lu_mU817iF4',
    externalUrl: 'https://www.youtube.com/@dwnews',
    description: 'German international broadcaster covering European geopolitics, Ukraine conflict, and NATO affairs.',
    monogram: 'DWN'
  },
  {
    id: 'france24_live',
    title: 'France 24 English Live',
    channel: 'France 24 English',
    channelId: 'UCQfwfsi5VrQ8yKZ-UWmAEFg',
    uploadsPlaylistId: 'UUQfwfsi5VrQ8yKZ-UWmAEFg',
    category: '24/7 LIVE NEWS',
    region: 'Europe / UK',
    regionGroup: 'EUROPE',
    countryCode: 'FR',
    isLive: true,
    tags: ['France', 'European Union', 'Africa Diplomacy'],
    youtubeId: 'h3MuIUNCCzI',
    externalUrl: 'https://www.youtube.com/@France24_en',
    description: 'International news television network offering a European perspective on world events.',
    monogram: 'F24'
  },
  {
    id: 'skynews_live',
    title: 'Sky News UK Live',
    channel: 'Sky News',
    channelId: 'UCoMdktPbSTixAyNGwb-UYkQ',
    uploadsPlaylistId: 'UUoMdktPbSTixAyNGwb-UYkQ',
    category: '24/7 LIVE NEWS',
    region: 'Europe / UK',
    regionGroup: 'EUROPE',
    countryCode: 'GB',
    isLive: true,
    tags: ['United Kingdom', 'Breaking News', 'Europe'],
    youtubeId: '9Auq9mYxFEE',
    externalUrl: 'https://www.youtube.com/@SkyNews',
    description: '24-hour British television news channel reporting on UK security, European defense, and global politics.',
    monogram: 'SKY'
  },
  {
    id: 'cna_live',
    title: 'CNA 24/7 Live (Singapore)',
    channel: 'CNA',
    channelId: 'UC83jt4dlz1Gjl58fzQ5KKGg',
    uploadsPlaylistId: 'UU83jt4dlz1Gjl58fzQ5KKGg',
    category: '24/7 LIVE NEWS',
    region: 'East Asia / Indo-Pacific',
    regionGroup: 'EAST_ASIA',
    countryCode: 'SG',
    isLive: true,
    tags: ['Southeast Asia', 'Indo-Pacific', 'ASEAN'],
    youtubeId: 'XWq5kBlakcQ',
    externalUrl: 'https://www.youtube.com/@channelnewsasia',
    description: 'Comprehensive coverage of Asian geopolitical flashpoints, trade corridors, and ASEAN diplomacy.',
    monogram: 'CNA'
  },
  {
    id: 'nhk_world_live',
    title: 'NHK World-Japan Live',
    channel: 'NHK World-Japan',
    channelId: 'UCvdHQUPn9pnngnLBN_NqPNA',
    uploadsPlaylistId: 'UUvdHQUPn9pnngnLBN_NqPNA',
    category: '24/7 LIVE NEWS',
    region: 'East Asia / Indo-Pacific',
    regionGroup: 'EAST_ASIA',
    countryCode: 'JP',
    isLive: true,
    tags: ['Japan', 'East Asia', 'Pacific Security'],
    youtubeId: 'f0lYkdA-Gtw',
    externalUrl: 'https://www.youtube.com/@NHKWORLDJAPAN',
    description: 'International service of Japan public broadcaster reporting on East Asian security and diplomacy.',
    monogram: 'NHK'
  },
  {
    id: 'euronews_live',
    title: 'Euronews English Live',
    channel: 'Euronews',
    channelId: 'UCSrZ3UV4jH3vfZWVfirpfGA',
    uploadsPlaylistId: 'UUSrZ3UV4jH3vfZWVfirpfGA',
    category: '24/7 LIVE NEWS',
    region: 'Europe / UK',
    regionGroup: 'EUROPE',
    countryCode: 'EU',
    isLive: true,
    tags: ['European Union', 'NATO', 'Pan-European'],
    youtubeId: 'pykpO5kQJ98',
    externalUrl: 'https://www.youtube.com/@euronews',
    description: 'Pan-European television news network covering EU governance, security policy, and continental affairs.',
    monogram: 'EUR'
  },
  {
    id: 'nasa_iss_live',
    title: 'NASA Live: Earth & Space Views',
    channel: 'NASA',
    channelId: 'UCLA_DiR1FfKNvjuUpBHmylQ',
    uploadsPlaylistId: 'UULA_DiR1FfKNvjuUpBHmylQ',
    category: '24/7 LIVE NEWS',
    region: 'Global Wire',
    regionGroup: 'ALL',
    countryCode: 'GLOBAL',
    isLive: true,
    tags: ['NASA', 'Space', 'ISS Views', 'Earth Observation'],
    youtubeId: '21X5lGlDOfg',
    externalUrl: 'https://www.youtube.com/@NASA',
    description: 'Live continuous space exploration telemetry, International Space Station Earth views, and mission launches.',
    monogram: 'NASA'
  },

  // Special Analysts Baseline
  {
    id: 'perun',
    title: 'Perun Defense Economics',
    channel: 'Perun',
    channelId: 'UCC3ehuUksTyQ7bbjGntmx3Q',
    uploadsPlaylistId: 'UUC3ehuUksTyQ7bbjGntmx3Q',
    category: '★ SPECIAL ANALYSTS',
    region: 'Global Wire',
    regionGroup: 'ANALYSTS',
    countryCode: 'AU',
    isSpecialAnalyst: true,
    isLive: false,
    tags: ['Defense Economics', 'Logistics', 'Procurement'],
    youtubeId: 'Hc2Wx-agDr0',
    externalUrl: 'https://www.youtube.com/@PerunAU',
    description: 'Deep-dive defense economics, military logistics, and force-structure procurement modeling.',
    monogram: 'PRN'
  },
  {
    id: 'caspian_report',
    title: 'CaspianReport (Shirvan)',
    channel: 'CaspianReport',
    channelId: 'UCnZjF-jc2h8I1fKAce1vFog',
    uploadsPlaylistId: 'UUnZjF-jc2h8I1fKAce1vFog',
    category: '★ SPECIAL ANALYSTS',
    region: 'Global Wire',
    regionGroup: 'ANALYSTS',
    countryCode: 'GLOBAL',
    isSpecialAnalyst: true,
    isLive: false,
    tags: ['Geopolitics', 'Grand Strategy', 'Maritime Corridors'],
    youtubeId: 'ckEywpMl82c',
    externalUrl: 'https://www.youtube.com/@CaspianReport',
    description: 'Objective historical and geopolitical strategic briefings across Eurasia and global maritime chokepoints.',
    monogram: 'CAS'
  }
];

function computeETag(payload: unknown): string {
  const content = JSON.stringify(payload);
  const hash = createHash('sha1').update(content).digest('hex').slice(0, 16);
  return `W/"${hash}"`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & Edge Caching Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, If-None-Match');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://fahbbsdgurtwmfjhtxkh.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

    let streams: VideoStreamItem[] = [...BASELINE_STREAMS];

    if (supabaseKey) {
      try {
        const resp = await fetch(`${supabaseUrl}/rest/v1/youtube_streams?order=checked_at.desc&limit=100`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Accept: 'application/json'
          }
        });
        if (resp.ok) {
          const raw = await resp.json();
          if (Array.isArray(raw) && raw.length > 0) {
            const dbMap = new Map<string, any>();
            raw.forEach((r: any) => {
              if (r.channel_id) dbMap.set(r.channel_id, r);
              if (r.id) dbMap.set(r.id, r);
            });

            streams = BASELINE_STREAMS.map((item) => {
              const live = dbMap.get(item.channelId) || dbMap.get(item.id);
              if (!live) return item;
              return {
                ...item,
                isLive: Boolean(live.is_live),
                youtubeId: live.youtube_id || live.video_id || item.youtubeId,
                streamUrl: live.external_url || item.streamUrl,
                checkedAt: live.checked_at
              };
            });
          }
        }
      } catch (dbErr) {
        console.warn('[API/streams] Supabase query notice:', dbErr);
      }
    }

    const etag = computeETag(
      streams.map((s) => ({
        id: s.id,
        ch: s.channelId,
        live: s.isLive,
        yt: s.youtubeId
      }))
    );

    res.setHeader('ETag', etag);

    const ifNoneMatch = req.headers?.['if-none-match'];
    if (ifNoneMatch && (ifNoneMatch === etag || String(ifNoneMatch).includes(etag))) {
      return res.status(304).end();
    }

    return res.status(200).json({
      status: 'ok',
      success: true,
      count: streams.length,
      timestamp: new Date().toISOString(),
      streams
    });
  } catch (err: any) {
    // 100% Crash-Proof Guarantee
    console.error('[API/streams] Handler caught error:', err);
    return res.status(200).json({
      status: 'ok',
      success: false,
      error: err?.message || 'Serverless function fallback',
      count: BASELINE_STREAMS.length,
      timestamp: new Date().toISOString(),
      streams: BASELINE_STREAMS
    });
  }
}
