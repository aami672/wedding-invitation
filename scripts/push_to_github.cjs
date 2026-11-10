const { execSync } = require('child_process');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/GITHUB_PAT\s*=\s*(.+)/);
if (!match) {
  console.error('GITHUB_PAT not found in .env.local');
  process.exit(1);
}

const pat = match[1].trim();
const repoUrl = `https://${pat}@github.com/aami672/wedding-invitation.git`;

try {
  console.log('Pushing to origin main...');
  const out = execSync(`git push "${repoUrl}" main`, { stdio: 'pipe' }).toString();
  console.log('Push output:', out);
  console.log('Successfully pushed to GitHub origin main!');
} catch (err) {
  console.error('Push failed:', err.message);
  if (err.stderr) console.error('Stderr:', err.stderr.toString());
  process.exit(1);
}
