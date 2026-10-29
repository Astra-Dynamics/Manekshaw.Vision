import fs from 'fs';
import path from 'path';

// Load videoCatalogue
const catalogPath = path.resolve('src/data/videoCatalogue.ts');
const catalogContent = fs.readFileSync(catalogPath, 'utf8');

const regex = /"id":\s*"([^"]+)"[\s\S]*?"title":\s*"([^"]+)"[\s\S]*?"channelId":\s*"([^"]+)"/g;
let m;
const channels = [];
while ((m = regex.exec(catalogContent)) !== null) {
  channels.push({
    id: m[1],
    catalogueTitle: m[2],
    channelId: m[3]
  });
}

console.log(`=======================================================`);
console.log(` MANEKSHAW.VISION // YOUTUBE CHANNEL REGISTRY VALIDATION`);
console.log(` Total channels in catalogue: ${channels.length}`);
console.log(`=======================================================`);

// 1. Structural format check (24 chars starting with UC)
const formatErrors = [];
for (const ch of channels) {
  if (!ch.channelId.startsWith('UC') || ch.channelId.length !== 24) {
    formatErrors.push({
      id: ch.id,
      title: ch.catalogueTitle,
      channelId: ch.channelId,
      length: ch.channelId.length,
      issue: !ch.channelId.startsWith('UC') ? 'Does not start with UC' : `Length is ${ch.channelId.length} (expected 24)`
    });
  }
}

if (formatErrors.length > 0) {
  console.log(`[FORMAT ERRORS DETECTED] (${formatErrors.length}):`);
  console.table(formatErrors);
} else {
  console.log(`[PASS] All ${channels.length} channel IDs structurally match: 24 characters starting with 'UC'.`);
}

// 2. Validate against YouTube Data API v3 (or fallback to public RSS endpoint if no key)
const apiKey = process.env.YOUTUBE_API_KEY;

async function validateWithAPI(apiKey) {
  console.log(`\nValidating channels with YouTube Data API v3 (batches of up to 50)...`);
  const batchSize = 50;
  const verified = [];
  const missing = [];
  const titleMismatches = [];

  for (let i = 0; i < channels.length; i += batchSize) {
    const batch = channels.slice(i, i + batchSize);
    const ids = batch.map(c => c.channelId).join(',');
    const url = `https://www.googleapis.com/youtube/v3/channels?part=id,snippet&id=${ids}&maxResults=50&key=${apiKey}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error(`API Error in batch ${i / batchSize + 1}:`, err?.error?.message || res.statusText);
        continue;
      }
      const data = await res.json();
      const returnedMap = new Map();
      for (const item of (data.items || [])) {
        returnedMap.set(item.id, item.snippet.title);
      }

      for (const ch of batch) {
        if (!returnedMap.has(ch.channelId)) {
          missing.push(ch);
        } else {
          const apiTitle = returnedMap.get(ch.channelId);
          verified.push({ ...ch, apiTitle });
          if (!ch.catalogueTitle.toLowerCase().includes(apiTitle.toLowerCase()) &&
              !apiTitle.toLowerCase().includes(ch.catalogueTitle.toLowerCase())) {
            titleMismatches.push({
              id: ch.id,
              channelId: ch.channelId,
              catalogueTitle: ch.catalogueTitle,
              apiTitle
            });
          }
        }
      }
    } catch (e) {
      console.error('Fetch error:', e.message);
    }
  }

  console.log(`\nAPI Results:`);
  console.log(`- Verified by API: ${verified.length} / ${channels.length}`);
  console.log(`- Missing / Not Found: ${missing.length}`);
  console.log(`- Title Mismatches: ${titleMismatches.length}`);
  if (missing.length > 0) {
    console.log('\nChannels Not Found by API:');
    console.table(missing);
  }
  if (titleMismatches.length > 0) {
    console.log('\nChannels with Title Variances:');
    console.table(titleMismatches);
  }
}

async function validateWithRSS() {
  console.log(`\n[NOTICE] YOUTUBE_API_KEY not found in environment.`);
  console.log(`Validating live channel responsiveness and exact titles via YouTube RSS endpoint...`);

  let validCount = 0;
  const invalid = [];
  const titleVariances = [];

  for (const ch of channels) {
    try {
      const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${ch.channelId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (res.ok) {
        const text = await res.text();
        const titleMatch = text.match(/<title>([^<]+)<\/title>/);
        const resolvedTitle = titleMatch ? titleMatch[1] : 'Unknown';
        validCount++;
        // Check for major title discrepancies
        const cleanCat = ch.catalogueTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanRes = resolvedTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!cleanCat.includes(cleanRes) && !cleanRes.includes(cleanCat)) {
          titleVariances.push({
            id: ch.id,
            channelId: ch.channelId,
            catalogueTitle: ch.catalogueTitle,
            resolvedTitle
          });
        }
      } else {
        invalid.push({ ...ch, status: res.status });
      }
    } catch (e) {
      invalid.push({ ...ch, error: e.message });
    }
  }

  console.log(`- Valid Live Channels: ${validCount} / ${channels.length}`);
  console.log(`- Unreachable Channels: ${invalid.length}`);
  console.log(`- Title Variances: ${titleVariances.length}`);

  if (invalid.length > 0) {
    console.log('\nUnreachable Channel IDs:');
    console.table(invalid);
  }
  if (titleVariances.length > 0) {
    console.log('\nTitle Variances:');
    console.table(titleVariances.slice(0, 15));
  }
}

if (apiKey) {
  validateWithAPI(apiKey);
} else {
  validateWithRSS();
}
