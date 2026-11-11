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
      server.middlewares.use('/api/save-client', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            try {
              const { slug: reqSlug, data } = JSON.parse(body);
              const safeSlug = String(reqSlug || 'client').replace(/[^a-zA-Z0-9._-]/g, '-');
              const clientsDir = path.resolve(__dirname, 'src/data/clients');
              if (!fs.existsSync(clientsDir)) fs.mkdirSync(clientsDir, { recursive: true });
              fs.writeFileSync(path.join(clientsDir, `${safeSlug}.json`), JSON.stringify(data, null, 2), 'utf8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, slug: safeSlug }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });

      server.middlewares.use('/api/clients', (req, res) => {
        if (req.method === 'GET') {
          try {
            const clientsDir = path.resolve(__dirname, 'src/data/clients');
            const reqUrl = new URL(req.url || '/', 'http://localhost');
            const slugParam = reqUrl.searchParams.get('slug');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            if (slugParam) {
              const safeSlug = slugParam.replace(/[^a-zA-Z0-9._-]/g, '-');
              const filePath = path.join(clientsDir, `${safeSlug}.json`);
              if (!fs.existsSync(filePath)) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Not found' }));
                return;
              }
              const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
              res.end(JSON.stringify({ client: { slug: safeSlug, data } }));
              return;
            }
            const clients = [];
            if (fs.existsSync(clientsDir)) {
              for (const file of fs.readdirSync(clientsDir)) {
                if (!file.endsWith('.json')) continue;
                const slug = file.replace(/\.json$/i, '');
                try {
                  const data = JSON.parse(fs.readFileSync(path.join(clientsDir, file), 'utf8'));
                  clients.push({ slug, bride: data?.hosts?.bride, groom: data?.hosts?.groom, date: data?.hosts?.date, city: data?.hosts?.city, template: data?.template, palette: data?.palette });
                } catch {
                  // skip malformed client file
                }
              }
            }
            res.end(JSON.stringify({ clients }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        } else {
          res.statusCode = 405;
          res.end();
        }
      });

      server.middlewares.use('/api/save-published', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            try {
              const { filename, content, data, slug: reqSlug } = JSON.parse(body);
              const safeFilename = path.basename(String(filename || 'invitation.html'));
              const safeSlug = String(reqSlug || safeFilename.replace(/\.html$/i, '') || 'invitation').replace(/[^a-zA-Z0-9._-]/g, '-');
              const isDefaultDemo = safeSlug === 'preeti-and-ashish';
              const pubDir = path.resolve(__dirname, 'public/published');
              if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

              // 1. Write only this client's standalone HTML page
              fs.writeFileSync(path.join(pubDir, safeFilename), content, 'utf8');
              if (safeSlug && `${safeSlug}.html` !== safeFilename) {
                fs.writeFileSync(path.join(pubDir, `${safeSlug}.html`), content, 'utf8');
              }

              const clientsDir = path.resolve(__dirname, 'src/data/clients');
              if (!fs.existsSync(clientsDir)) fs.mkdirSync(clientsDir, { recursive: true });
              if (data) {
                fs.writeFileSync(path.join(clientsDir, `${safeSlug}.json`), JSON.stringify(data, null, 2), 'utf8');
              }

              // 2. Keep default demo & index aliases synchronized ONLY for preeti-and-ashish so other clients never overwrite it
              const rootPubHtml = content.replaceAll('../images/', './images/').replaceAll('../audio/', './audio/');
              if (isDefaultDemo) {
                fs.writeFileSync(path.join(pubDir, 'index.html'), content, 'utf8');
                fs.writeFileSync(path.join(pubDir, 'preeti-and-ashish.html'), content, 'utf8');
                fs.writeFileSync(path.resolve(__dirname, 'public/preeti-and-ashish.html'), rootPubHtml, 'utf8');
                if (data) {
                  fs.writeFileSync(path.resolve(__dirname, 'src/data/published_invitation.json'), JSON.stringify(data, null, 2), 'utf8');
                }
              }

              // 3. Also copy into dist if dist folder exists
              const distDir = path.resolve(__dirname, 'dist/published');
              if (fs.existsSync(path.resolve(__dirname, 'dist'))) {
                if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
                fs.writeFileSync(path.join(distDir, safeFilename), content, 'utf8');
                if (safeSlug && `${safeSlug}.html` !== safeFilename) {
                  fs.writeFileSync(path.join(distDir, `${safeSlug}.html`), content, 'utf8');
                }
                if (isDefaultDemo) {
                  fs.writeFileSync(path.join(distDir, 'index.html'), content, 'utf8');
                  fs.writeFileSync(path.join(distDir, 'preeti-and-ashish.html'), content, 'utf8');
                  fs.writeFileSync(path.resolve(__dirname, 'dist/preeti-and-ashish.html'), rootPubHtml, 'utf8');
                }
              }

              // 4. Auto-commit & push new client invitation to GitHub if token configured
              const token = getGitHubToken();
              let pushed = false;
              let pushMessage = 'Saved locally (no GitHub push token configured in .env.local).';
              if (token) {
                const { execFile } = await import('node:child_process');
                const { promisify } = await import('node:util');
                const execFileAsync = promisify(execFile);
                const runGit = (args) => execFileAsync('git', args, { cwd: __dirname });
                const gitPaths = [
                  `public/published/${safeSlug}.html`,
                  ...(data ? [`src/data/clients/${safeSlug}.json`] : []),
                  ...(isDefaultDemo ? ['public/published/index.html', 'public/preeti-and-ashish.html', 'src/data/published_invitation.json'] : []),
                ];
                try {
                  await runGit(['add', ...gitPaths]);
                  const { stdout: staged } = await runGit(['status', '--porcelain', ...gitPaths]);
                  if (staged.trim()) {
                    await runGit(['commit', '-m', `Publish live client invitation: ${safeSlug}.html`]);
                  }
                  await runGit(['remote', 'set-url', 'origin', `https://oauth2:${token}@github.com/aami672/wedding-invitation.git`]);
                  await runGit(['push', 'origin', 'HEAD:refs/heads/main']);
                  pushed = true;
                  pushMessage = 'Pushed standalone HTML to GitHub; live link updates in ~1 min.';
                  console.log('Successfully published and pushed to GitHub:', safeFilename);
                } catch (err) {
                  pushMessage = `Saved locally, but GitHub push failed: ${err.message}`;
                  console.log('Auto-push notice:', err.message);
                } finally {
                  try {
                    await runGit(['remote', 'set-url', 'origin', 'https://github.com/aami672/wedding-invitation.git']);
                  } catch {
                    // ignore cleanup error
                  }
                }
              }

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, pushed, pushMessage, path: `/published/${safeFilename}` }));
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
    occasionSubpathPlugin(),
  ],
});

const OCCASION_ROUTE_ENTRIES = [
  ['engagement', 'engagement-invitation'],
  ['birthday', 'birthday-invitation'],
  ['housewarming', 'housewarming-invitation'],
  ['house-party', 'house-party-invitation'],
  ['baby-shower', 'baby-shower-invitation'],
  ['annaprashan', 'annaprashan-invitation'],
  ['holy-communion', 'holy-communion-invitation'],
];

function occasionSubpathPlugin() {
  return {
    name: 'occasion-subpath-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const urlObj = new URL(req.url || '/', 'http://localhost');
          const pathname = urlObj.pathname;
          const match = OCCASION_ROUTE_ENTRIES.find(
            ([, slug]) => pathname === `/${slug}` || pathname === `/${slug}/`
          );
          if (!match) return next();

          const [occId, slug] = match;
          if (pathname === `/${slug}`) {
            res.statusCode = 302;
            res.setHeader('Location', `/${slug}/${urlObj.search || ''}`);
            res.end();
            return;
          }

          const indexPath = path.resolve(__dirname, 'index.html');
          let html = fs.readFileSync(indexPath, 'utf8');
          const bootScript = `<script>window.__PAIGAAM_OCCASION__=${JSON.stringify(occId)};window.__PAIGAAM_ASSET_PREFIX__="../";</script>`;
          html = html.replace('</head>', `  ${bootScript}\n  </head>`);
          html = await server.transformIndexHtml('/', html);
          html = html.replace(/(src|href)="\.\/([^"]*)"/g, '$1="/$2"');

          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          res.end(html);
        } catch (err) {
          next(err);
        }
      });
    },
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const distIndex = path.join(distDir, 'index.html');
      if (!fs.existsSync(distIndex)) return;

      const baseHtml = fs.readFileSync(distIndex, 'utf8');
      for (const [occId, slug] of OCCASION_ROUTE_ENTRIES) {
        const subDir = path.join(distDir, slug);
        fs.mkdirSync(subDir, { recursive: true });
        const bootScript = `<script>window.__PAIGAAM_OCCASION__=${JSON.stringify(occId)};window.__PAIGAAM_ASSET_PREFIX__="../";</script>`;
        const subHtml = baseHtml
          .replace('</head>', `  ${bootScript}\n  </head>`)
          .replace(/(src|href)="\.\/assets\//g, '$1="../assets/')
          .replace(/(src|href)="\.\/images\//g, '$1="../images/')
          .replace(/(src|href)="\.\/audio\//g, '$1="../audio/');
        fs.writeFileSync(path.join(subDir, 'index.html'), subHtml, 'utf8');
      }
    }
  };
}
