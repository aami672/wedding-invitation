const { execSync } = require('child_process');
const fs = require('fs');

let token = process.env.GITHUB_PAT || process.env.GH_TOKEN;
if (!token && fs.existsSync('.env.local')) {
  const content = fs.readFileSync('.env.local', 'utf8');
  const match = content.match(/GITHUB_PAT=([^\r\n]+)/);
  if (match) token = match[1].trim();
}

if (!token) {
  console.error('No token found');
  process.exit(1);
}

execSync('git add -A', { stdio: 'inherit' });
execSync('git commit -m "Add typography and font customization suites with custom font pickers"', { stdio: 'inherit' });
execSync(`git remote set-url origin https://oauth2:${token}@github.com/aami672/wedding-invitation.git`);
execSync('git push origin main', { stdio: 'inherit' });
execSync('git remote set-url origin https://github.com/aami672/wedding-invitation.git');
console.log('Push complete!');
