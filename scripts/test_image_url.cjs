const https = require('https');

https.get('https://aami672.github.io/wedding-invitation/images/gallery/moment_1.jpg', (res) => {
  console.log('Status code for moment_1.jpg:', res.statusCode);
  console.log('Content-length:', res.headers['content-length']);
}).on('error', e => console.error(e));
