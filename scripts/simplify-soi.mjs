import fs from 'fs';
import path from 'path';

const inputPath = 'C:\\Users\\Anant Jain\\.gemini\\antigravity\\scratch\\worldmonitor-clone\\src\\data\\india-soi.json';
const outputPath = 'C:\\Users\\Anant Jain\\.gemini\\antigravity\\scratch\\worldmonitor-clone\\src\\data\\indiaOfficialBoundary.ts';

// Ramer-Douglas-Peucker simplification algorithm
function getSqDist(p1, p2) {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  return dx * dx + dy * dy;
}

function getSqSegDist(p, p1, p2) {
  let x = p1[0], y = p1[1];
  let dx = p2[0] - x, dy = p2[1] - y;

  if (dx !== 0 || dy !== 0) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = p2[0];
      y = p2[1];
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }

  dx = p[0] - x;
  dy = p[1] - y;
  return dx * dx + dy * dy;
}

function simplifyRadialDist(points, sqTolerance) {
  let prevPoint = points[0];
  const newPoints = [prevPoint];
  let point;

  for (let i = 1, len = points.length; i < len; i++) {
    point = points[i];
    if (getSqDist(point, prevPoint) > sqTolerance) {
      newPoints.push(point);
      prevPoint = point;
    }
  }

  if (prevPoint !== point) newPoints.push(point);
  return newPoints;
}

function simplifyDPStep(points, first, last, sqTolerance, simplified) {
  let maxSqDist = sqTolerance;
  let index = 0;

  for (let i = first + 1; i < last; i++) {
    const sqDist = getSqSegDist(points[i], points[first], points[last]);
    if (sqDist > maxSqDist) {
      index = i;
      maxSqDist = sqDist;
    }
  }

  if (maxSqDist > sqTolerance) {
    if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
    simplified.push(points[index]);
    if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
  }
}

function simplifyRDP(points, sqTolerance) {
  const last = points.length - 1;
  const simplified = [points[0]];
  simplifyDPStep(points, 0, last, sqTolerance, simplified);
  simplified.push(points[last]);
  return simplified;
}

function simplify(points, tolerance = 0.01) {
  if (points.length <= 2) return points;
  const sqTolerance = tolerance * tolerance;
  const radial = simplifyRadialDist(points, sqTolerance);
  return simplifyRDP(radial, sqTolerance);
}

const raw = fs.readFileSync(inputPath, 'utf-8');
const geojson = JSON.parse(raw);

const feature = geojson.features[0];
const geomType = feature.geometry.type;

let totalOriginalPoints = 0;
let totalSimplifiedPoints = 0;

// Simplify coordinates with ~0.008 deg tolerance (~800m precision, ideal for national boundary)
const tolerance = 0.008;

let newCoordinates;
if (geomType === 'Polygon') {
  newCoordinates = feature.geometry.coordinates.map(ring => {
    totalOriginalPoints += ring.length;
    const sim = simplify(ring, tolerance);
    totalSimplifiedPoints += sim.length;
    return sim;
  });
} else if (geomType === 'MultiPolygon') {
  newCoordinates = feature.geometry.coordinates.map(polygon => {
    return polygon.map(ring => {
      totalOriginalPoints += ring.length;
      const sim = simplify(ring, tolerance);
      totalSimplifiedPoints += sim.length;
      return sim;
    });
  });
}

const simplifiedGeoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'India',
        officialName: 'Republic of India',
        source: 'Survey of India (Official Boundary)',
        note: 'Includes Jammu & Kashmir, Ladakh (including PoK & Aksai Chin) as integral sovereign territory of India.'
      },
      geometry: {
        type: geomType,
        coordinates: newCoordinates
      }
    }
  ]
};

const outputContent = `// Official Sovereign Boundary of the Republic of India as published by Survey of India (SOI)
// Encompassing Jammu & Kashmir and Ladakh (including PoK, Gilgit-Baltistan and Aksai Chin)

export const INDIA_OFFICIAL_BOUNDARY: GeoJSON.FeatureCollection = ${JSON.stringify(simplifiedGeoJson, null, 2)};
`;

fs.writeFileSync(outputPath, outputContent, 'utf-8');

console.log(`Original points: ${totalOriginalPoints} -> Simplified points: ${totalSimplifiedPoints}`);
console.log(`Output written to ${outputPath}`);
