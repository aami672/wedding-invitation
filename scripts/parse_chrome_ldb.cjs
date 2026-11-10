const fs = require('fs');
const path = require('path');

const ldbPath = path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'User Data', 'Default', 'Local Storage', 'leveldb', '002322.ldb');
const buf = fs.readFileSync(ldbPath);

// Search for key
const keyBuf = Buffer.from('wishlys_free_saved_data');
const idx = buf.indexOf(keyBuf);
console.log('Key found at byte offset:', idx);

if (idx !== -1) {
  // Leveldb value starts after some metadata. Look for '{' in UTF-16LE: 0x7B, 0x00
  let jsonStart = -1;
  for (let i = idx + keyBuf.length; i < idx + keyBuf.length + 50; i++) {
    if (buf[i] === 0x7B && buf[i+1] === 0x00) {
      jsonStart = i;
      break;
    }
  }
  console.log('jsonStart at:', jsonStart);
  if (jsonStart !== -1) {
    // Read UTF-16LE slice
    const slice = buf.slice(jsonStart, Math.min(buf.length, jsonStart + 5000000));
    const str = slice.toString('utf16le');
    console.log('Decoded length:', str.length);
    // Find matching closing brace
    let depth = 0;
    let endIdx = -1;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '{') depth++;
      else if (str[i] === '}') {
        depth--;
        if (depth === 0) {
          endIdx = i + 1;
          break;
        }
      }
    }
    console.log('endIdx:', endIdx);
    if (endIdx !== -1) {
      const jsonStr = str.substring(0, endIdx);
      try {
        const obj = JSON.parse(jsonStr);
        console.log('Parsed successfully! Keys:', Object.keys(obj));
        if (obj.photos) {
          console.log('Bride photo len:', obj.photos.bride ? obj.photos.bride.length : 0);
          console.log('Groom photo len:', obj.photos.groom ? obj.photos.groom.length : 0);
        }
        if (obj.gallery) {
          console.log('Gallery count:', obj.gallery.length);
          obj.gallery.forEach((g, i) => {
            console.log(`Gallery ${i+1}: caption="${g.caption || g.title}", urlLen=${(g.url || g.img || '').length}`);
          });
        }
      } catch (err) {
        console.log('JSON parse error:', err.message);
      }
    }
  }
}
