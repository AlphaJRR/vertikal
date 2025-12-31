#!/usr/bin/env node
/**
 * Convert og-preview.svg to og-preview.png (1200x630)
 * Requires: npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../public/assets/og-preview.svg');
const pngPath = path.join(__dirname, '../public/assets/og-preview.png');

if (!fs.existsSync(svgPath)) {
  console.error('❌ SVG file not found:', svgPath);
  process.exit(1);
}

sharp(svgPath)
  .resize(1200, 630, {
    fit: 'contain',
    background: { r: 5, g: 5, b: 5, alpha: 1 }
  })
  .png()
  .toFile(pngPath)
  .then(() => {
    console.log('✅ OG image created:', pngPath);
    console.log('   Dimensions: 1200x630px');
    console.log('   Format: PNG');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Verify image looks correct');
    console.log('   2. Test with Facebook Debugger:');
    console.log('      https://developers.facebook.com/tools/debug/');
  })
  .catch((err) => {
    console.error('❌ Error converting image:', err.message);
    console.log('');
    console.log('💡 Alternative: Use online converter:');
    console.log('   https://cloudconvert.com/svg-to-png');
    process.exit(1);
  });

