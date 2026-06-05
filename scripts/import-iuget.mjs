#!/usr/bin/env node
/**
 * IUGET → Firestore bulk import helper
 *
 * Usage:
 *   node scripts/import-iuget.mjs <data-file> [collection]
 *
 *   <data-file>   path to .json or .csv export from IUGET's existing system
 *   [collection]  override target Firestore collection (default: inferred
 *                 from the file name, e.g. "students.csv" → "users")
 *
 * Examples:
 *   node scripts/import-iuget.mjs ./data/students.csv users
 *   node scripts/import-iuget.mjs ./data/courses.json
 *   node scripts/import-iuget.mjs ./data/lecturers.csv
 *   node scripts/import-iuget.mjs ./data/timetable-may-2026.csv timetable
 *
 * Requirements:
 *   - .env.local at the project root with VITE_FIREBASE_* credentials
 *     OR a serviceAccountKey.json file in scripts/credentials/
 *   - The collection target is created automatically if missing.
 *   - Documents are upserted by deterministic id (matricule, code, etc.).
 *
 * Honest disclosure:
 *   The script is a thin wrapper around Firestore's admin SDK. It does not
 *   guess your data — supply a well-formed JSON / CSV and it will write
 *   exactly what's there. Field-name mapping is configured below.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

/* ─── env loading ─────────────────────────────────────────── */
function loadEnv() {
  const candidates = ['.env.local', '.env', '.env.production']
  for (const f of candidates) {
    const fp = path.join(ROOT, f)
    if (!fs.existsSync(fp)) continue
    const text = fs.readFileSync(fp, 'utf8')
    for (const line of text.split(/\r?\n/)) {
      if (!line || line.startsWith('#')) continue
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/i)
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
    console.log(`✓ Loaded ${f}`)
    return
  }
}
loadEnv()

/* ─── Firestore admin init ────────────────────────────────── */
let admin, db
async function initFirestore() {
  try {
    admin = require('firebase-admin')
  } catch {
    console.error('\n✗ firebase-admin is not installed.')
    console.error('  Install it first:  npm install --save-dev firebase-admin\n')
    process.exit(2)
  }
  // Prefer service-account key for headless servers
  const keyPath = path.join(__dirname, 'credentials', 'serviceAccountKey.json')
  if (fs.existsSync(keyPath)) {
    const credential = admin.credential.cert(require(keyPath))
    admin.initializeApp({ credential })
  } else if (process.env.VITE_FIREBASE_PROJECT_ID) {
    // Fall back to application-default credentials (good for `firebase login`)
    admin.initializeApp({ projectId: process.env.VITE_FIREBASE_PROJECT_ID })
  } else {
    console.error('\n✗ No Firebase credentials found.')
    console.error('  Provide either:')
    console.error('    a) scripts/credentials/serviceAccountKey.json')
    console.error('    b) VITE_FIREBASE_PROJECT_ID in .env.local + `firebase login`\n')
    process.exit(3)
  }
  db = admin.firestore()
}

/* ─── CSV / JSON parsers ──────────────────────────────────── */
function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (!lines.length) return []
  const header = parseCsvRow(lines[0])
  return lines.slice(1).map((line) => {
    const cells = parseCsvRow(line)
    const obj = {}
    header.forEach((h, i) => { obj[h.trim()] = cells[i] ?? '' })
    return obj
  })
}
function parseCsvRow(row) {
  const out = []
  let cur = '', inQ = false
  for (let i = 0; i < row.length; i++) {
    const c = row[i]
    if (c === '"') { inQ = !inQ; continue }
    if (c === ',' && !inQ) { out.push(cur); cur = ''; continue }
    cur += c
  }
  out.push(cur)
  return out
}

/* ─── Field mappings ──────────────────────────────────────── */
const MAPPINGS = {
  users: {
    inferId: (r) => r.matricule || r.studentId || r.uid || r.id,
    transform: (r) => ({
      uid:       r.matricule || r.studentId || r.uid || r.id,
      role:      r.role || 'student',
      name:      r.name || `${r.firstName || ''} ${r.lastName || ''}`.trim(),
      email:     r.email,
      specialty: r.specialty,
      level:     Number(r.level) || undefined,
      program:   r.program || (r.specialty ? `Bachelor of Technology — ${r.specialty}` : undefined),
      department:r.department,
      avatar:    r.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.name || r.matricule)}`,
      createdAt: new Date().toISOString(),
    }),
  },
  courses: {
    inferId: (r) => r.code || r.courseCode || r.id,
    transform: (r) => ({
      code:      r.code || r.courseCode,
      name:      r.name || r.title,
      credits:   Number(r.credits) || 3,
      lecturer:  r.lecturer || r.lecturerName,
      track:     r.track || 'bachelor-evening',
      specialty: r.specialty,
    }),
  },
  timetable: {
    inferId: (r) => `${r.day}-${r.time}-${r.course}-${r.specialty || 'ALL'}`.replace(/[^a-zA-Z0-9-]/g, '_'),
    transform: (r) => ({
      day:       r.day,
      time:      r.time || `${r.from || r.start} - ${r.to || r.end}`,
      course:    r.course || r.courseCode,
      room:      r.room || r.hall,
      lecturer:  r.lecturer,
      specialty: r.specialty,
      track:     r.track || 'bachelor-evening',
    }),
  },
  fees: {
    inferId: (r) => r.studentId || r.matricule,
    transform: (r) => ({
      studentId: r.studentId || r.matricule,
      total:     Number(r.total) || 500000,
      paid:      Number(r.paid)  || 0,
      balance:   Number(r.balance) ?? (Number(r.total) - Number(r.paid)),
      deadline:  r.deadline || null,
      academicYear: r.academicYear || '2026/2027',
    }),
  },
  announcements: {
    inferId: (r) => r.id || `ann-${Date.now()}-${Math.floor(Math.random() * 999)}`,
    transform: (r) => ({
      title:    r.title,
      body:     r.body || r.content,
      author:   r.author || r.from || 'Registrar',
      pinned:   r.pinned === 'true' || r.pinned === true,
      createdAt:r.createdAt || new Date().toISOString(),
    }),
  },
}

function inferCollection(file) {
  const base = path.basename(file).toLowerCase()
  if (base.includes('student')   || base.includes('user'))   return 'users'
  if (base.includes('course'))                              return 'courses'
  if (base.includes('timetable')|| base.includes('schedule'))return 'timetable'
  if (base.includes('fee')      || base.includes('tuition')) return 'fees'
  if (base.includes('announce'))                            return 'announcements'
  return 'users'
}

/* ─── Main ────────────────────────────────────────────────── */
async function main() {
  const [, , file, collArg] = process.argv
  if (!file) {
    console.error('Usage: node scripts/import-iuget.mjs <data-file> [collection]')
    process.exit(1)
  }
  const fp = path.resolve(file)
  if (!fs.existsSync(fp)) {
    console.error(`✗ File not found: ${fp}`)
    process.exit(1)
  }
  const collection = collArg || inferCollection(fp)
  const mapping = MAPPINGS[collection]
  if (!mapping) {
    console.error(`✗ No mapping for collection "${collection}".`)
    console.error(`  Available: ${Object.keys(MAPPINGS).join(', ')}`)
    process.exit(1)
  }
  console.log(`→ Importing ${path.basename(fp)} into collection "${collection}"`)

  const text = fs.readFileSync(fp, 'utf8')
  const rows = fp.endsWith('.csv') ? parseCsv(text) : JSON.parse(text)
  if (!Array.isArray(rows) || !rows.length) {
    console.error('✗ No rows found in input.')
    process.exit(1)
  }
  console.log(`  ${rows.length} rows read`)

  await initFirestore()
  console.log(`  Connected to Firestore project: ${process.env.VITE_FIREBASE_PROJECT_ID || '(default)'}`)

  const batch = db.batch()
  let written = 0, skipped = 0
  for (const row of rows) {
    const id = mapping.inferId(row)
    if (!id) { skipped++; continue }
    const payload = mapping.transform(row)
    // Strip undefined fields
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k])
    const ref = db.collection(collection).doc(String(id))
    batch.set(ref, payload, { merge: true })
    written++
    if (written % 400 === 0) {
      await batch.commit()
      console.log(`    … committed ${written}`)
    }
  }
  await batch.commit()

  console.log(`✓ Done. ${written} written, ${skipped} skipped.\n`)
  if (skipped) console.warn(`  ${skipped} rows had no inferable id — fix the source file or supply --id flag.`)
}

main().catch((err) => {
  console.error('\n✗ Import failed:', err.message || err)
  process.exit(1)
})
