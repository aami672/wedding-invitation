const https = require('https');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/GITHUB_PAT\s*=\s*(.+)/);
const pat = match[1].trim();

const options = {
  hostname: 'api.github.com',
  path: '/repos/aami672/wedding-invitation/actions/jobs/129723637774/logs',
  method: 'GET',
  headers: {
    'User-Agent': 'NodeJS',
    'Authorization': `Bearer ${pat}`,
    'Accept': 'application/vnd.github.v3+json'
  }
};

const req = https.request(options, (res) => {
  if (res.statusCode === 302 || res.statusCode === 301) {
    https.get(res.headers.location, (logRes) => {
      let body = '';
      logRes.on('data', chunk => body += chunk);
      logRes.on('end', () => {
        const lines = body.split('\n');
        console.log('Lines -100 to -40 of job log:');
        console.log(lines.slice(-100, -40).join('\n'));
      });
    });
  }
});
req.end();
