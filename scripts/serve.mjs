// Static file server for the built SIARM app + deliverables download.
import http from 'http'
import fs from 'fs'
import path from 'path'

const PORT = process.env.PORT || 4173
const ROOT = path.resolve(process.cwd())
const DIST = path.join(ROOT, 'dist')
const DELIVERABLES = path.join(ROOT, 'deliverables')

// Shared application store: a single JSON document that every connected device
// reads and writes through /api/store. This is what makes SIARM a real online
// system (shared data across all devices) rather than per-browser localStorage.
const DATA_DIR = path.join(ROOT, 'data')
const STORE_FILE = path.join(DATA_DIR, 'store.json')
const MAX_BODY = 8 * 1024 * 1024 // 8 MB cap on the store payload

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico':  'image/x-icon',
  '.zip':  'application/zip',
  '.pdf':  'application/pdf',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.md':   'text/markdown; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8',
}

function send(res, code, body, headers = {}) {
  res.writeHead(code, headers); res.end(body)
}

function serveFile(res, fp, attachment = false) {
  if (!fs.existsSync(fp)) return send(res, 404, 'Not found')
  const ext = path.extname(fp).toLowerCase()
  const headers = {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Access-Control-Allow-Origin': '*',
  }
  if (attachment) headers['Content-Disposition'] = `attachment; filename="${path.basename(fp)}"`
  res.writeHead(200, headers)
  fs.createReadStream(fp).pipe(res)
}

function downloadsPage() {
  const files = (fs.existsSync(DELIVERABLES) ? fs.readdirSync(DELIVERABLES) : [])
    .filter((f) => fs.statSync(path.join(DELIVERABLES, f)).isFile())
    .sort()
  const list = files.map((f) => {
    const stat = fs.statSync(path.join(DELIVERABLES, f))
    const size = (stat.size / 1024 / 1024).toFixed(2)
    const ext = path.extname(f).toLowerCase()
    const icon = ext === '.zip' ? '📦' : ext === '.pptx' ? '📊' : ext === '.docx' ? '📝' : ext === '.pdf' ? '📄' : ext === '.md' ? '📖' : '📁'
    return `<li>${icon} <a href="/downloads/${encodeURIComponent(f)}" download>${f}</a> <span class="muted">(${size} MB)</span></li>`
  }).join('')
  return `<!doctype html>
<html><head><meta charset="utf-8"/><title>SIARM Deliverables</title>
<link rel="icon" href="/favicon.svg"/>
<style>
  body { font-family: -apple-system, system-ui, sans-serif; max-width: 760px; margin: 60px auto; padding: 20px; line-height: 1.6; color: #1e293b; background: #f8fafc }
  h1 { font-size: 32px; letter-spacing: -0.02em } a { color: #1e3aa0 }
  .card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px -2px rgba(15,23,42,.05); margin-bottom: 16px }
  .muted { color: #94a3b8; font-size: 13px } ul { padding-left: 0; list-style: none } li { margin: 10px 0; padding: 10px 14px; background: #f1f5f9; border-radius: 10px }
  .btn { display: inline-block; background: #1e3aa0; color: white; padding: 12px 22px; border-radius: 10px; text-decoration: none; font-weight: 600; margin-top: 8px }
  .btn:hover { background: #1e3478 }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 16px }
  .pill { display: inline-block; background: #dbe6fe; color: #1e3aa0; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600 }
</style></head>
<body>
  <span class="pill">SIARM · Bachelor project</span>
  <h1>📦 Deliverables</h1>
  <p>Smart Institution Academic Resource Management · IUGET Bonaberi · By James Murdza</p>

  <div class="card">
    <h2>🚀 Live application</h2>
    <p>The full SIARM platform is running on this server. Use it to demonstrate during your defense.</p>
    <a class="btn" href="/">Open SIARM App →</a>
    <div class="muted" style="margin-top: 8px">Demo login: <code>student@iuget.cm</code> / <code>password</code></div>
  </div>

  <div class="card">
    <h2>⬇️ Get everything in one file</h2>
    <p>The complete package — report, slides, speech notes, all markdown docs, every diagram, and the source &amp; production builds — bundled into a single zip.</p>
    <a class="btn" href="/downloads/SIARM-Complete-Package.zip" download>Download Complete Package (.zip) →</a>
  </div>

  <div class="card">
    <h2>📁 Or download files individually</h2>
    <ul>${list}</ul>
  </div>
</body></html>`
}

const server = http.createServer((req, res) => {
  try {
    let url = decodeURIComponent(req.url.split('?')[0])

    // ── Shared application store API ───────────────────────────────
    if (url === '/api/store') {
      // CORS / preflight so the app works from any device/origin.
      const cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
      if (req.method === 'OPTIONS') return send(res, 204, '', cors)

      if (req.method === 'GET') {
        if (!fs.existsSync(STORE_FILE)) return send(res, 204, '', cors)
        const body = fs.readFileSync(STORE_FILE)
        return send(res, 200, body, { ...cors, 'Content-Type': 'application/json' })
      }

      if (req.method === 'PUT') {
        let size = 0
        const chunks = []
        req.on('data', (c) => {
          size += c.length
          if (size > MAX_BODY) { req.destroy(); }
          else chunks.push(c)
        })
        req.on('end', () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf8')
            JSON.parse(raw) // validate
            fs.mkdirSync(DATA_DIR, { recursive: true })
            fs.writeFileSync(STORE_FILE, raw)
            send(res, 200, JSON.stringify({ ok: true }), { ...cors, 'Content-Type': 'application/json' })
          } catch {
            send(res, 400, JSON.stringify({ ok: false, error: 'invalid JSON' }), { ...cors, 'Content-Type': 'application/json' })
          }
        })
        return
      }
      return send(res, 405, 'Method not allowed', cors)
    }

    // Deliverables index page
    if (url === '/deliverables' || url === '/deliverables/') {
      return send(res, 200, downloadsPage(), { 'Content-Type': 'text/html; charset=utf-8' })
    }

    // Download a single deliverable
    if (url.startsWith('/downloads/')) {
      const name = url.replace('/downloads/', '')
      const fp = path.join(DELIVERABLES, name)
      if (!fp.startsWith(DELIVERABLES)) return send(res, 403, 'Forbidden')
      return serveFile(res, fp, true)
    }

    // Otherwise: serve from dist (SPA)
    let rel = url === '/' ? 'index.html' : url.slice(1)
    const fp = path.join(DIST, rel)
    if (fs.existsSync(fp) && fs.statSync(fp).isFile()) return serveFile(res, fp)
    return serveFile(res, path.join(DIST, 'index.html'))
  } catch (err) {
    return send(res, 500, 'Error: ' + err.message)
  }
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`SIARM server listening on http://0.0.0.0:${PORT}`)
  console.log(`  App:          http://0.0.0.0:${PORT}/`)
  console.log(`  Deliverables: http://0.0.0.0:${PORT}/deliverables`)
})
