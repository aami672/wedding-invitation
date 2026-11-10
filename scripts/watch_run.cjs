const https = require('https');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/GITHUB_PAT\s*=\s*(.+)/);
const pat = match[1].trim();

function check() {
  const options = {
    hostname: 'api.github.com',
    path: '/repos/aami672/wedding-invitation/actions/runs/42790021379',
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
        const run = JSON.parse(body);
        console.log(`Run status: ${run.status} | conclusion: ${run.conclusion}`);
        if (run.status === 'completed') {
          console.log(`DONE! Final conclusion: ${run.conclusion}`);
          process.exit(run.conclusion === 'success' ? 0 : 1);
        } else {
          setTimeout(check, 8000);
        }
      } catch(e) {
        console.error(e);
        process.exit(1);
      }
    });
  });
  req.end();
}

check();
