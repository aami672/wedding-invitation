const https = require('https');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/GITHUB_PAT\s*=\s*(.+)/);
const pat = match[1].trim();

const options = {
  hostname: 'api.github.com',
  path: '/repos/aami672/wedding-invitation/actions/runs?per_page=3',
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
      const runs = (data.workflow_runs || []).map(r => ({
        id: r.id,
        name: r.name,
        status: r.status,
        conclusion: r.conclusion,
        head_commit: r.head_commit?.message?.split('\n')[0],
        html_url: r.html_url
      }));
      console.log('Recent Workflow Runs:', JSON.stringify(runs, null, 2));
    } catch(e) {
      console.error('Error parsing response:', e);
    }
  });
});

req.on('error', (e) => console.error('Req error:', e));
req.end();
