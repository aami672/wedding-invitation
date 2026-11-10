const https = require('https');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/GITHUB_PAT\s*=\s*(.+)/);
const pat = match[1].trim();

const options = {
  hostname: 'api.github.com',
  path: '/repos/aami672/wedding-invitation/deployments',
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
      (data || []).slice(0, 3).forEach(d => {
        console.log(`Deployment id: ${d.id} | Env: ${d.environment} | Created: ${d.created_at} | Task: ${d.task}`);
      });
    } catch(e) {
      console.error(e);
    }
  });
});
req.end();
