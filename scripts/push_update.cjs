const { execSync } = require('child_process');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/GITHUB_PAT\s*=\s*(.*)/);
if (!match) {
  console.error('No PAT found in .env.local');
  process.exit(1);
}
const token = match[1].trim();

try {
  console.log('Staging files...');
  execSync('git add package.json public/ scripts/ src/ vite.config.js', { stdio: 'inherit' });
  
  console.log('Committing changes...');
  execSync('git commit -m "Auto-hydrate published invitations from localStorage & sync preeti-and-ashish.html on build"', { stdio: 'inherit' });
  
  console.log('Setting remote with PAT...');
  execSync(`git remote set-url origin "https://oauth2:${token}@github.com/aami672/wedding-invitation.git"`, { stdio: 'inherit' });
  
  console.log('Pushing to main...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('Resetting remote URL cleanly...');
  execSync('git remote set-url origin "https://github.com/aami672/wedding-invitation.git"', { stdio: 'inherit' });
  
  console.log('Done!');
} catch (e) {
  console.error('Error during git push:', e.message);
  execSync('git remote set-url origin "https://github.com/aami672/wedding-invitation.git"', { stdio: 'inherit' });
  process.exit(1);
}
