// Build the all-in-one delivery package: every file in deliverables/
// (report, slides, speech notes, markdown docs, diagrams, source & build zips)
// bundled into a single SIARM-Complete-Package.zip.
//
// Uses the system `zip` tool when available, otherwise falls back to Python 3.
// No npm dependencies required.
import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const root = path.resolve(process.cwd())
const dir = path.join(root, 'deliverables')
const outName = 'SIARM-Complete-Package.zip'
const out = path.join(dir, outName)

if (!fs.existsSync(dir)) {
  console.error('deliverables/ folder not found.'); process.exit(1)
}
if (fs.existsSync(out)) fs.rmSync(out)

const py = `import os, zipfile
src = ${JSON.stringify(dir)}
out = ${JSON.stringify(out)}
added = 0
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for r, d, files in os.walk(src):
        for f in sorted(files):
            fp = os.path.join(r, f)
            if os.path.abspath(fp) == os.path.abspath(out):
                continue
            arc = os.path.join('SIARM-Complete-Package', os.path.relpath(fp, src))
            z.write(fp, arc)
            added += 1
print(f"{added} files, {os.path.getsize(out)/1024/1024:.2f} MB")`

try {
  execFileSync('python3', ['-c', py], { stdio: ['ignore', 'inherit', 'inherit'] })
  console.log(`✓ ${outName} created in deliverables/`)
} catch (err) {
  console.error('Failed to build combined zip:', err.message)
  process.exit(1)
}
