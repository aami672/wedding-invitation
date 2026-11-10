const https = require('https');

https.get('https://aami672.github.io/wedding-invitation/published/preeti-and-ashish.html', (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers['content-length'], res.headers['last-modified'], res.headers['etag']);
  let len = 0;
  res.on('data', chunk => len += chunk.length);
  res.on('end', () => console.log('Downloaded length:', len));
}).on('error', e => console.error(e));
