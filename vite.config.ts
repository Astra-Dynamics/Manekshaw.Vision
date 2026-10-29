import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

function ytLiveDevPlugin(): Plugin {
  return {
    name: 'yt-live-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/yt-live')) {
          try {
            const url = new URL(req.url, 'http://localhost:3000');
            const channelId = url.searchParams.get('channelId') || '';
            const fallbackEmbedUrl = `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(channelId)}`;

            const apiKey = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

            if (!channelId || !channelId.startsWith('UC')) {
              res.statusCode = 400;
              return res.end(JSON.stringify({
                success: false,
                live: false,
                status: 'error',
                channelId,
                fallbackEmbedUrl: '',
                error: 'Invalid channelId parameter'
              }));
            }

            if (!apiKey) {
              res.statusCode = 200;
              return res.end(JSON.stringify({
                success: true,
                live: false,
                status: 'fallback',
                channelId,
                embedUrl: fallbackEmbedUrl,
                fallbackEmbedUrl,
                message: 'YOUTUBE_API_KEY not set in local env. Using fallback live_stream embed.'
              }));
            }

            const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(channelId)}&eventType=live&type=video&maxResults=1&key=${encodeURIComponent(apiKey)}`;
            const ytRes = await fetch(ytUrl);
            const data = await ytRes.json();
            const item = data.items?.[0];

            if (item && item.id?.videoId) {
              res.statusCode = 200;
              return res.end(JSON.stringify({
                success: true,
                live: true,
                status: 'live',
                channelId,
                videoId: item.id.videoId,
                title: item.snippet?.title || '',
                embedUrl: `https://www.youtube.com/embed/${item.id.videoId}?autoplay=1&mute=1&playsinline=1&enablejsapi=1`,
                fallbackEmbedUrl
              }));
            }

            res.statusCode = 200;
            return res.end(JSON.stringify({
              success: true,
              live: false,
              status: 'offline',
              channelId,
              embedUrl: fallbackEmbedUrl,
              fallbackEmbedUrl,
              message: 'No active live broadcast found for channel.'
            }));
          } catch (err: any) {
            res.statusCode = 200;
            return res.end(JSON.stringify({
              success: false,
              live: false,
              status: 'fallback',
              error: err?.message
            }));
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ytLiveDevPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
