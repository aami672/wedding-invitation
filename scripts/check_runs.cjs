const https = require('https');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const pat = env.match(/GITHUB_PAT\s*=\s*(.+)/)[1].trim();

const options = {
  hostname: 'api.github.com',
  path: '/repos/aami672/wedding-invitation/actions/runs?per_page=5',
  method: 'GET',
  headers: {
    'User-Agent': 'NodeJS',
    'Authorization': 'token ' + pat,
    'Accept': 'application/vnd.github.v3+json'
  }
};

https.get(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const data = JSON.parse(body);
    data.workflow_runs.forEach(r => {
      console.log(r.id + ': ' + r.status + '/' + r.conclusion + ' - ' + r.head_sha.slice(0,7) + ' - ' + (r.head_commit ? r.head_commit.message : ''));
    });
  });
});
