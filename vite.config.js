import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
              const { filename, content } = JSON.parse(body);
              const dir = path.resolve(__dirname, 'public/published');
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
              fs.writeFileSync(path.join(dir, filename), content, 'utf8');

              // Also copy into dist/published if dist folder exists
              const distDir = path.resolve(__dirname, 'dist/published');
              if (fs.existsSync(path.resolve(__dirname, 'dist'))) {
                if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
                fs.writeFileSync(path.join(distDir, filename), content, 'utf8');
              }

              // Auto-commit & push new client invitation to GitHub if token configured
              const token = process.env.GITHUB_PAT || process.env.GH_TOKEN;
              if (token) {
                const { exec } = await import('node:child_process');
                const cmd = `git add public/published dist/published; git commit -m "Publish live client invitation: ${filename}"; git remote set-url origin "https://oauth2:${token}@github.com/aami672/wedding-invitation.git"; git push origin main; git remote set-url origin "https://github.com/aami672/wedding-invitation.git"`;
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
