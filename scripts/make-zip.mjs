// Build zips for delivery: source code, production build, and combined package.
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const archiver = require('archiver')
import fs from 'fs'
import path from 'path'

const root = path.resolve(process.cwd())
const outDir = path.join(root, 'deliverables')
fs.mkdirSync(outDir, { recursive: true })

function makeZip(name, addEntries) {
  return new Promise((resolve, reject) => {
    const file = path.join(outDir, name)
    const output = fs.createWriteStream(file)
    const archive = archiver('zip', { zlib: { level: 9 } })
    output.on('close', () => resolve({ file, bytes: archive.pointer() }))
    archive.on('error', reject)
    archive.pipe(output)
    addEntries(archive)
    archive.finalize()
  })
}

const EXCLUDE = new Set([
  'node_modules', '.git', 'dist', 'deliverables',
  '.vscode', '.env', '.env.local', 'prompt.md',
])

function addDir(archive, dir, baseInZip) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    if (EXCLUDE.has(e.name)) continue
    const fp = path.join(dir, e.name)
    const zipPath = path.posix.join(baseInZip, e.name)
    if (e.isDirectory()) addDir(archive, fp, zipPath)
    else archive.file(fp, { name: zipPath })
  }
}

const main = async () => {
  console.log('Building source-code zip…')
  const src = await makeZip('SIARM-source-code.zip', (archive) => addDir(archive, root, 'SIARM'))
  console.log(`  ✓ ${path.basename(src.file)}  (${(src.bytes / 1024 / 1024).toFixed(2)} MB)`)

  console.log('Building production-build zip…')
  const prod = await makeZip('SIARM-production-build.zip', (archive) => {
    archive.directory(path.join(root, 'dist'), 'SIARM-build')
  })
  console.log(`  ✓ ${path.basename(prod.file)}  (${(prod.bytes / 1024 / 1024).toFixed(2)} MB)`)

  console.log('Done.')
}

main().catch((err) => { console.error(err); process.exit(1) })
