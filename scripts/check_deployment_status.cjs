const https = require('https');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/GITHUB_PAT\s*=\s*(.+)/);
const pat = match[1].trim();

const options = {
  hostname: 'api.github.com',
  path: '/repos/aami672/wedding-invitation/deployments/7677458953/statuses',
  method: 'GET',
  headers: {
    'User-Agent': 'NodeJS',
    'Authorization': `Bearer ${pat}`,
    'Accept': 'application/vnd.github.v3+json'
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log('Statuses:', JSON.stringify(data, null, 2));
    } catch(e) {
      console.error(e);
    }
  });
});
req.end();
