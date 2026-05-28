import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const sharp = require('sharp')

const dir = path.resolve(process.cwd(), 'deliverables/diagrams')
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.svg'))

for (const f of files) {
  const svg = fs.readFileSync(path.join(dir, f))
  const out = path.join(dir, f.replace('.svg', '.png'))
  await sharp(svg, { density: 144 }).resize({ width: 1600 }).png().toFile(out)
  console.log(`✓ ${path.basename(out)}`)
}
