import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getGitHubToken() {
  let token = process.env.GITHUB_PAT || process.env.GH_TOKEN;
  if (!token) {
    const envFile = path.resolve(__dirname, '.env.local');
    if (fs.existsSync(envFile)) {
      const match = fs.readFileSync(envFile, 'utf8').match(/GITHUB_PAT\s*=\s*([^\r\n]+)/);
      if (match) token = match[1].trim();
    }
  }
  return token;
}

function savePublishedPlugin() {
  return {
    name: 'save-published-api',
    configureServer(server) {
      server.middlewares.use('/api/save-published', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            try {
              const { filename, content, data, slug: reqSlug } = JSON.parse(body);
              const slug = reqSlug || filename.replace('.html', '');
              const pubDir = path.resolve(__dirname, 'public/published');
              if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

              // 1. Write the client-specific file
              fs.writeFileSync(path.join(pubDir, filename), content, 'utf8');
              if (slug && `${slug}.html` !== filename) {
                fs.writeFileSync(path.join(pubDir, `${slug}.html`), content, 'utf8');
              }
              // 2. Write to published/index.html
              fs.writeFileSync(path.join(pubDir, 'index.html'), content, 'utf8');
              // 3. Always update published/preeti-and-ashish.html so demo/direct link reflects changes
              fs.writeFileSync(path.join(pubDir, 'preeti-and-ashish.html'), content, 'utf8');

              // 4. Update root preeti-and-ashish.html with adapted asset paths
              const rootPubHtml = content.replaceAll('../images/', './images/').replaceAll('../audio/', './audio/');
              fs.writeFileSync(path.resolve(__dirname, 'public/preeti-and-ashish.html'), rootPubHtml, 'utf8');

              // 5. Save published raw data JSON for builds
              if (data) {
                const dataDir = path.resolve(__dirname, 'src/data');
                if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
                fs.writeFileSync(path.join(dataDir, 'published_invitation.json'), JSON.stringify(data, null, 2), 'utf8');
              }

              // 6. Also copy into dist if dist folder exists
              const distDir = path.resolve(__dirname, 'dist/published');
              if (fs.existsSync(path.resolve(__dirname, 'dist'))) {
                if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
                fs.writeFileSync(path.join(distDir, filename), content, 'utf8');
                fs.writeFileSync(path.join(distDir, 'index.html'), content, 'utf8');
                fs.writeFileSync(path.join(distDir, 'preeti-and-ashish.html'), content, 'utf8');
                fs.writeFileSync(path.resolve(__dirname, 'dist/preeti-and-ashish.html'), rootPubHtml, 'utf8');
              }

              // 7. Auto-commit & push new client invitation to GitHub if token configured
              const token = getGitHubToken();
              if (token) {
                const { exec } = await import('node:child_process');
                const cmd = `git add public/published public/preeti-and-ashish.html src/data/published_invitation.json dist; git commit -m "Publish live client invitation: ${filename}"; git remote set-url origin "https://oauth2:${token}@github.com/aami672/wedding-invitation.git"; git push origin main; git remote set-url origin "https://github.com/aami672/wedding-invitation.git"`;
                exec(cmd, { cwd: __dirname }, (err) => {
                  if (err) console.log('Auto-push notice:', err.message);
                  else console.log('Successfully published and pushed to GitHub:', filename);
                });
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, path: `/published/${filename}` }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 404;
          res.end();
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    savePublishedPlugin(),
  ],
})
