import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const titleMatch = html.match(/<title>(.*?)<\/title>/);
const descMatch = html.match(/<meta name="description" content="(.*?)"/);
const canonicalMatch = html.match(/<link rel="canonical" href="(.*?)"/);

const title = titleMatch ? titleMatch[1] : '';
const desc = descMatch ? descMatch[1] : '';
const canonical = canonicalMatch ? canonicalMatch[1] : '';

console.log('=== METADATA VERIFICATION ===');
console.log('Title:', title);
console.log('Title length:', title.length, 'chars (target 50-60)');
if (title.length < 50 || title.length > 60) {
  console.error('FAIL: Title length out of range');
} else {
  console.log('PASS: Title length valid');
}

console.log('\nDescription:', desc);
console.log('Description length:', desc.length, 'chars (target 120-160)');
if (desc.length < 120 || desc.length > 160) {
  console.error('FAIL: Description length out of range');
} else {
  console.log('PASS: Description length valid');
}

console.log('\nCanonical:', canonical);
if (canonical !== 'https://www.manvis.tech/') {
  console.error('FAIL: Canonical URL mismatch');
} else {
  console.log('PASS: Canonical URL verified');
}

// Check JSON-LD validity
const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (jsonLdMatch) {
  try {
    const parsed = JSON.parse(jsonLdMatch[1]);
    console.log('\nPASS: JSON-LD parses successfully as valid JSON');
    console.log('Entities in @graph:', parsed['@graph'].map(e => e['@type']).join(', '));
  } catch (e) {
    console.error('FAIL: JSON-LD parse error:', e.message);
  }
} else {
  console.error('FAIL: JSON-LD script not found');
}
