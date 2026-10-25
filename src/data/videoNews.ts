export interface VideoNewsItem {
  id: string;
  title: string;
  channel: string;
  timeAgo: string;
  duration: string;
  thumbnail: string;
  youtubeUrl: string;
  category: string;
  isLive?: boolean;
  description: string;
}

export const STRATEGIC_VIDEO_DISPATCHES: VideoNewsItem[] = [
  {
    id: 'wion_gravitas_live',
    title: 'WION Gravitas: Global Defense & Strategic Geopolitics Live',
    channel: 'WION',
    timeAgo: 'STREAMING NOW',
    duration: 'LIVE',
    isLive: true,
    thumbnail: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/@WION/live',
    category: 'GEOPOLITICS',
    description: 'Real-time strategic analysis of South Asian security, Middle East missile exchanges, and Indo-Pacific naval movements.'
  },
  {
    id: 'dd_india_world_today',
    title: 'DD India: World Today & Strategic Defense Watch',
    channel: 'DD India',
    timeAgo: '15m ago',
    duration: '24:18',
    thumbnail: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/@DDIndia/live',
    category: 'NATIONAL SECURITY',
    description: 'Indian Ministry of External Affairs briefings, border infrastructure developments, and multinational military drills.'
  },
  {
    id: 'reuters_world_dispatch',
    title: 'Reuters Live: Global Defense & Conflict Frontlines',
    channel: 'Reuters',
    timeAgo: 'LIVE',
    duration: 'LIVE',
    isLive: true,
    thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/@Reuters/live',
    category: 'BREAKING NEWS',
    description: 'Direct video coverage from Eastern European combat zones, diplomatic summits, and global security councils.'
  },
  {
    id: 'france24_geopolitics',
    title: 'France 24 English: Geopolitics & Middle East Escalation',
    channel: 'France 24',
    timeAgo: '42m ago',
    duration: '18:50',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/watch?v=h3MuIUNCCzI',
    category: 'MIDDLE EAST',
    description: 'Strait of Hormuz tanker movements, Red Sea naval strikes, and UN Security Council emergency sessions.'
  },
  {
    id: 'bloomberg_defense_economics',
    title: 'Bloomberg: Global Sanctions & Defense Supply Chains',
    channel: 'Bloomberg',
    timeAgo: '1h ago',
    duration: '31:12',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/@markets/live',
    category: 'GEO-ECONOMICS',
    description: 'Strategic critical minerals, semiconductor export bans, military expenditure budgets, and oil tanker flows.'
  },
  {
    id: 'aljazeera_live_stream',
    title: 'Al Jazeera English: Live Strategic News Coverage',
    channel: 'Al Jazeera English',
    timeAgo: 'LIVE',
    duration: 'LIVE',
    isLive: true,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/watch?v=gCNeDWCI0vo',
    category: 'CRISIS CORRIDOR',
    description: 'On-the-ground reporting from the Levant, Persian Gulf, Horn of Africa, and regional humanitarian operations.'
  }
];
