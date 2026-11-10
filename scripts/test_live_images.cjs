const https = require('https');

const urls = [
  'https://aami672.github.io/wedding-invitation/images/gallery/moment_1.jpg',
  'https://aami672.github.io/wedding-invitation/images/gallery/moment_6.jpg',
  'https://aami672.github.io/wedding-invitation/images/gallery/moment_12.jpg',
  'https://aami672.github.io/wedding-invitation/images/ashish_groom.jpg',
  'https://aami672.github.io/wedding-invitation/images/preeti_bride.jpg'
];

urls.forEach(u => {
  https.get(u, res => {
    console.log(u.split('/').slice(-2).join('/'), '-> Status:', res.statusCode, 'Length:', res.headers['content-length']);
  });
});
