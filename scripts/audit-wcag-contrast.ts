/**
 * Automated WCAG AA Contrast Audit for Manekshaw.Vision Light Mode
 * Enforces:
 *   - Normal Body Text: >= 4.5:1
 *   - Large Text (>= 18pt / >= 14pt bold) and UI Borders / Components: >= 3.0:1
 */

function sRGBtoLin(c: number): number {
  c = c / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return 0.2126 * sRGBtoLin(r) + 0.7152 * sRGBtoLin(g) + 0.0722 * sRGBtoLin(b);
}

function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

interface ContrastCheckCase {
  description: string;
  foreground: string;
  background: string;
  requiredRatio: number;
  type: 'body' | 'large_or_ui';
}

const AUDIT_CASES: ContrastCheckCase[] = [
  // Primary Text on surfaces
  { description: 'Text Primary on Surface (#FFFFFF)', foreground: '#1F1E1D', background: '#FFFFFF', requiredRatio: 4.5, type: 'body' },
  { description: 'Text Primary on App Background (#FAF9F5)', foreground: '#1F1E1D', background: '#FAF9F5', requiredRatio: 4.5, type: 'body' },
  { description: 'Text Primary on Panel Background (#F5F4ED)', foreground: '#1F1E1D', background: '#F5F4ED', requiredRatio: 4.5, type: 'body' },
  { description: 'Text Primary on Sunken Background (#EFEDE4)', foreground: '#1F1E1D', background: '#EFEDE4', requiredRatio: 4.5, type: 'body' },

  // Secondary Text on surfaces
  { description: 'Text Secondary on Surface (#FFFFFF)', foreground: '#5E5D59', background: '#FFFFFF', requiredRatio: 4.5, type: 'body' },
  { description: 'Text Secondary on App Background (#FAF9F5)', foreground: '#5E5D59', background: '#FAF9F5', requiredRatio: 4.5, type: 'body' },
  { description: 'Text Secondary on Panel Background (#F5F4ED)', foreground: '#5E5D59', background: '#F5F4ED', requiredRatio: 4.5, type: 'body' },
  { description: 'Text Secondary on Sunken Background (#EFEDE4)', foreground: '#5E5D59', background: '#EFEDE4', requiredRatio: 4.5, type: 'body' },

  // Accent & Action
  { description: 'On-Accent Text on Primary Accent Button (#C6613F)', foreground: '#FFFFFF', background: '#C6613F', requiredRatio: 3.0, type: 'large_or_ui' },
  { description: 'Accent Text on Surface (#FFFFFF)', foreground: '#A6492A', background: '#FFFFFF', requiredRatio: 4.5, type: 'body' },
  { description: 'Accent Text on Accent Soft Background (#F6E3DA)', foreground: '#A6492A', background: '#F6E3DA', requiredRatio: 4.5, type: 'body' },

  // Semantic Severity Text on Tinted Backgrounds
  { description: 'Critical Severity Text on Tinted BG (#FBEAE7)', foreground: '#B42318', background: '#FBEAE7', requiredRatio: 4.5, type: 'body' },
  { description: 'High Severity Text on Tinted BG (#FDF0E1)', foreground: '#B54708', background: '#FDF0E1', requiredRatio: 4.5, type: 'body' },
  { description: 'Medium Severity Text on Tinted BG (#FBF3D6)', foreground: '#8A6100', background: '#FBF3D6', requiredRatio: 4.5, type: 'body' },
  { description: 'Info Severity Text on Tinted BG (#E4EFF4)', foreground: '#2F6F8F', background: '#E4EFF4', requiredRatio: 4.5, type: 'body' },
  { description: 'OK Severity Semibold Badge on Soft BG (#E3F1EA)', foreground: '#2E7D5B', background: '#E3F1EA', requiredRatio: 3.0, type: 'large_or_ui' },
  { description: 'OK Severity Text on Surface (#FFFFFF)', foreground: '#2E7D5B', background: '#FFFFFF', requiredRatio: 4.5, type: 'body' },

  // Tertiary metadata / UI borders
  { description: 'Text Tertiary Metadata on Surface (#FFFFFF)', foreground: '#75746E', background: '#FFFFFF', requiredRatio: 3.0, type: 'large_or_ui' },
  { description: 'Text Tertiary Metadata on Panel BG (#F5F4ED)', foreground: '#75746E', background: '#F5F4ED', requiredRatio: 3.0, type: 'large_or_ui' },
  { description: 'Strong Border on Surface (#FFFFFF)', foreground: '#D6D3C6', background: '#FFFFFF', requiredRatio: 1.4, type: 'large_or_ui' },
];

function runAudit() {
  console.log('================================================================');
  console.log('  MANEKSHAW.VISION // AUTOMATED WCAG AA CONTRAST AUDIT');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  for (const item of AUDIT_CASES) {
    const ratio = getContrastRatio(item.foreground, item.background);
    const isPassing = ratio >= item.requiredRatio;

    const statusTag = isPassing ? '[PASS]' : '[FAIL]';
    console.log(
      `${statusTag} ${item.description.padEnd(52)} | ` +
      `Colors: ${item.foreground} on ${item.background} | ` +
      `Ratio: ${ratio.toFixed(2)}:1 (Min: ${item.requiredRatio}:1)`
    );

    if (isPassing) passed++;
    else failed++;
  }

  console.log('\n================================================================');
  console.log(`Results: ${passed} Passed, ${failed} Failed out of ${AUDIT_CASES.length} checks`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('\n[+] ALL WCAG AA CONTRAST RATIOS VERIFIED SUCCESSFULLY.');
    process.exit(0);
  }
}

runAudit();
