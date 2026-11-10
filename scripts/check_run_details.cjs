const https = require('https');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/GITHUB_PAT\s*=\s*(.+)/);
const pat = match[1].trim();

const options = {
  hostname: 'api.github.com',
  path: '/repos/aami672/wedding-invitation/actions/runs/42786800769/jobs',
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
      (data.jobs || []).forEach(j => {
        console.log(`Job: ${j.name} | Status: ${j.status} | Conclusion: ${j.conclusion}`);
        (j.steps || []).forEach(s => {
          console.log(`  Step: ${s.name} -> ${s.status} (${s.conclusion || 'running'}) [started: ${s.started_at}, completed: ${s.completed_at}]`);
        });
      });
    } catch(e) {
      console.error(e);
    }
  });
});
req.end();
