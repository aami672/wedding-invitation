const fs = require('fs');
const path = require('path');

const ldbDir = path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'User Data', 'Default', 'Local Storage', 'leveldb');
const files = fs.readdirSync(ldbDir).filter(f => f.endsWith('.ldb'));

files.forEach(f => {
  const p = path.join(ldbDir, f);
  const buf = fs.readFileSync(p);
  const str = buf.toString('latin1');
  const idx = str.indexOf('wishlys_free_saved_data');
  if (idx !== -1) {
    console.log(`Found wishlys_free_saved_data in ${f} at offset ${idx}`);
    // Find the JSON block
    const jsonStart = str.indexOf('{', idx);
    if (jsonStart !== -1) {
      // Find where "gallery" is
      const galIdx = str.indexOf('"gallery"', jsonStart);
      if (galIdx !== -1 && galIdx - jsonStart < 5000) {
        console.log(`Found "gallery" in ${f} near offset ${galIdx}!`);
      }
    }
  }
});
