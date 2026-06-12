#!/usr/bin/env node
/**
 * import-iuget.mjs — Bulk-load IUGET data into Firestore.
 *
 * Usage:
 *   node scripts/import-iuget.mjs <command> <path-to-file>
 *
 * Commands:
 *   students     — import students       (CSV or JSON)
 *   lecturers    — import lecturers      (CSV or JSON)
 *   courses      — import course catalog (CSV or JSON)
 *   timetable    — import timetable rows (CSV or JSON)
 *   fees         — import fee structure  (JSON)
 *   announce     — import announcements  (JSON)
 *   all          — process a directory of files named <collection>.csv|.json
 *
 * Examples:
 *   node scripts/import-iuget.mjs students iuget/students.csv
 *   node scripts/import-iuget.mjs all iuget/
 *
 * Configuration:
 *   This script reads Firebase credentials from .env.local (same variables
 *   the SIARM front-end uses: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID
 *   etc.). If credentials are absent it runs in DRY-RUN mode and only
 *   prints what *would* be written — useful for verifying CSV schemas
 *   before going live.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/* ─── env loading ─────────────────────────────────────────── */
function loadEnv() {
  const file = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(file)) return {}
  const env = {}
  for (const line of fs.readFileSync(file, 'utf-8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/)
    if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
  }
  return env
}
const env = loadEnv()
const DRY = !env.VITE_FIREBASE_PROJECT_ID || env.VITE_DEMO_MODE === 'true'

/* ─── tiny CSV parser ─────────────────────────────────────── */
function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (!lines.length) return []
  const header = parseRow(lines[0])
  return lines.slice(1).map((line) => {
    const cells = parseRow(line)
    return header.reduce((acc, h, i) => { acc[h.trim()] = (cells[i] ?? '').trim(); return acc }, {})
  })
}
function parseRow(line) {
  const out = []
  let cur = '', inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"' && line[i + 1] === '"') { cur += '"'; i++ }
    else if (c === '"') inQuotes = !inQuotes
    else if (c === ',' && !inQuotes) { out.push(cur); cur = '' }
    else cur += c
  }
  out.push(cur)
  return out
}

/* ─── reader ──────────────────────────────────────────────── */
function readRecords(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`✗ File not found: ${filePath}`); process.exit(2)
  }
  const ext = path.extname(filePath).toLowerCase()
  const text = fs.readFileSync(filePath, 'utf-8')
  if (ext === '.json') return JSON.parse(text)
  if (ext === '.csv')  return parseCsv(text)
  console.error(`✗ Unsupported file type: ${ext}. Use .csv or .json.`); process.exit(2)
}

/* ─── schema normalisation ────────────────────────────────── */
const NORMALISERS = {
  students: (r) => ({
    uid:       r.uid || r.matricule || r.id,
    matricule: r.matricule || r.uid,
    name:      r.name || `${r.firstName || ''} ${r.lastName || ''}`.trim(),
    email:     (r.email || '').toLowerCase(),
    specialty: r.specialty || 'SWE',
    level:     Number(r.level || 3),
    phone:     r.phone || null,
    enrolledOn: r.enrolledOn || new Date().toISOString().slice(0, 10),
    role:      'student',
  }),
  lecturers: (r) => ({
    uid:        r.uid || r.id || `lec-${(r.email || '').split('@')[0]}`,
    name:       r.name || `${r.firstName || ''} ${r.lastName || ''}`.trim(),
    email:      (r.email || '').toLowerCase(),
    department: r.department || r.dept || 'Computer Science',
    courses:    (r.courses || '').split(/[,;|]/).map((c) => c.trim()).filter(Boolean),
    role:       'lecturer',
  }),
  courses: (r) => ({
    code:      r.code,
    name:      r.name,
    credits:   Number(r.credits || 3),
    lecturer:  r.lecturer || null,
    track:     r.track || 'bachelor-evening',
    specialty: r.specialty || null,
  }),
  timetable: (r) => ({
    day:       r.day,
    time:      r.time,
    course:    r.course,
    room:      r.room,
    specialty: r.specialty,
    lecturer:  r.lecturer,
    track:     r.track || 'bachelor-evening',
  }),
  fees: (r) => ({
    tuition:      Number(r.tuition      || 450000),
    registration: Number(r.registration || 25000),
    examFee:      Number(r.examFee      || 15000),
    libraryFee:   Number(r.libraryFee   ||  8000),
    studentUnion: Number(r.studentUnion ||  2000),
    currency:     r.currency || 'FCFA',
    academicYear: r.academicYear || '2026/2027',
  }),
  announce: (r) => ({
    title:     r.title,
    body:      r.body,
    author:    r.author    || 'Registrar',
    pinned:    Boolean(r.pinned),
    createdAt: r.createdAt || new Date().toISOString(),
  }),
}

const COLLECTION = {
  students: 'users',
  lecturers: 'users',
  courses: 'courses',
  timetable: 'timetable',
  fees: 'fees',
  announce: 'announcements',
}

/* ─── Firestore writer (lazy import) ──────────────────────── */
async function getDb() {
  if (DRY) return null
  const { initializeApp } = await import('firebase/app')
  const { getFirestore, writeBatch, doc, collection, addDoc } = await import('firebase/firestore')
  const app = initializeApp({
    apiKey:     env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:  env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  })
  return { db: getFirestore(app), writeBatch, doc, collection, addDoc }
}

async function writeRecords(kind, records) {
  const normalise = NORMALISERS[kind]
  const collectionName = COLLECTION[kind]
  if (!normalise || !collectionName) {
    console.error(`✗ Unknown command: ${kind}`); process.exit(2)
  }
  const normalised = records.map(normalise)

  if (DRY) {
    console.log(`\n🟡 DRY-RUN — would write ${normalised.length} record(s) to "${collectionName}"`)
    console.log('First 2 normalised records:')
    console.log(JSON.stringify(normalised.slice(0, 2), null, 2))
    return
  }

  const fb = await getDb()
  const { db, writeBatch, doc, collection, addDoc } = fb
  let batch = writeBatch(db); let count = 0
  for (const rec of normalised) {
    const id = rec.uid || rec.code || rec.matricule
    if (id) batch.set(doc(collection(db, collectionName), id), rec)
    else    await addDoc(collection(db, collectionName), rec)
    count++
    if (count % 400 === 0) { await batch.commit(); batch = writeBatch(db) }
  }
  await batch.commit()
  console.log(`✓ Wrote ${count} record(s) to ${collectionName}`)
}

/* ─── entry ───────────────────────────────────────────────── */
const [, , cmd, target] = process.argv
if (!cmd || !target) {
  console.log(`Usage: node scripts/import-iuget.mjs <command> <file-or-dir>

Commands: students | lecturers | courses | timetable | fees | announce | all

Currently in ${DRY ? 'DRY-RUN' : 'LIVE'} mode${DRY ? ' (set VITE_FIREBASE_PROJECT_ID in .env.local to write to Firestore)' : ''}`)
  process.exit(1)
}

async function main() {
  if (cmd === 'all') {
    const dir = path.resolve(target)
    for (const kind of Object.keys(COLLECTION)) {
      for (const ext of ['.csv', '.json']) {
        const fp = path.join(dir, kind + ext)
        if (fs.existsSync(fp)) {
          console.log(`\n→ Importing ${kind} from ${fp}`)
          await writeRecords(kind, readRecords(fp))
        }
      }
    }
  } else {
    await writeRecords(cmd, readRecords(path.resolve(target)))
  }
  console.log('\n✓ Done.')
}

main().catch((e) => { console.error(e); process.exit(1) })
