/**
 * CyberVigil - Web & Mobile Build Pipeline
 * Packages all client-side assets into the 'www' directory for Capacitor Android/iOS builds
 */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const OUT_DIR = path.join(ROOT_DIR, 'www');

console.log('🚀 Building CyberVigil Mobile & Web Distribution into /www ...');

// Ensure clean output directory
if (fs.existsSync(OUT_DIR)) {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUT_DIR, { recursive: true });

// Items to copy to www
const ITEMS_TO_COPY = [
  'index.html',
  'manifest.json',
  'css',
  'js',
  'assets'
];

ITEMS_TO_COPY.forEach(item => {
  const src = path.join(ROOT_DIR, item);
  const dest = path.join(OUT_DIR, item);

  if (fs.existsSync(src)) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      fs.cpSync(src, dest, { recursive: true });
      console.log(`  ✓ Copied directory: ${item}/`);
    } else {
      fs.copyFileSync(src, dest);
      console.log(`  ✓ Copied file: ${item}`);
    }
  } else {
    console.warn(`  ⚠ Optional item not found: ${item}`);
  }
});

console.log('✅ Mobile & Web distribution package built successfully at ./www');
