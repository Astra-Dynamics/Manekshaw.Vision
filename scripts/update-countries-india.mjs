import fs from 'fs';
import { INDIA_OFFICIAL_BOUNDARY } from '../src/data/indiaOfficialBoundary.ts';

const countriesPath = 'C:\\Users\\Anant Jain\\.gemini\\antigravity\\scratch\\worldmonitor-clone\\public\\data\\countries.geojson';
const countries = JSON.parse(fs.readFileSync(countriesPath, 'utf-8'));

const indiaIndex = countries.features.findIndex(f => f.properties['ISO3166-1-Alpha-2'] === 'IN');
if (indiaIndex !== -1) {
  const soiGeom = INDIA_OFFICIAL_BOUNDARY.features[0].geometry;
  countries.features[indiaIndex].geometry = soiGeom;
  console.log('Successfully replaced India geometry with official Survey of India boundary (including J&K and Aksai Chin).');
} else {
  console.error('India feature not found in countries.geojson');
}

fs.writeFileSync(countriesPath, JSON.stringify(countries));
console.log('Saved updated countries.geojson');
