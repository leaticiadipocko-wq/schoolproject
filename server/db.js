import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '..', 'data', 'siarm.db')

import fs from 'fs'
fs.mkdirSync(path.dirname(dbPath), { recursive: true })

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    uid TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    avatar TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    password_hash TEXT,
    student_id TEXT,
    program TEXT,
    specialty TEXT,
    level INTEGER,
    department TEXT,
    title TEXT,
    courses TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS user_credentials (
    uid TEXT PRIMARY KEY REFERENCES users(uid) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_uid TEXT,
    actor_name TEXT,
    action TEXT NOT NULL,
    target TEXT,
    details TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

const seedUsers = [
  { uid: 'stu-001', email: 'student@iuget.cm', name: 'Chituh Innocentia', role: 'student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Innocentia', student_id: 'IUGET/2023/SWE/0142', program: 'Bachelor of Technology — Software Engineering', specialty: 'SWE', level: 3 },
  { uid: 'lec-001', email: 'lecturer@iuget.cm', name: 'Mr Nkoma Ngouloure', role: 'lecturer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nkoma', department: 'Computer Science', courses: JSON.stringify(['CS501', 'CS503']) },
  { uid: 'sta-001', email: 'staff@iuget.cm', name: 'Mrs. Linda Foncha', role: 'staff', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda', department: 'Registrar' },
  { uid: 'adm-001', email: 'admin@iuget.cm', name: 'Prof. James Murdza', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', title: 'Vice-Chancellor' },
]

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (uid, email, name, role, avatar, student_id, program, specialty, level, department, title, courses)
  VALUES (@uid, @email, @name, @role, @avatar, @student_id, @program, @specialty, @level, @department, @title, @courses)
`)

const insertCred = db.prepare(`
  INSERT OR IGNORE INTO user_credentials (uid, email, password_hash)
  VALUES (@uid, @email, @password_hash)
`)

for (const u of seedUsers) {
  insertUser.run({
    uid: u.uid,
    email: u.email,
    name: u.name,
    role: u.role,
    avatar: u.avatar || null,
    student_id: u.student_id || null,
    program: u.program || null,
    specialty: u.specialty || null,
    level: u.level || null,
    department: u.department || null,
    title: u.title || null,
    courses: u.courses || null,
  })
  insertCred.run({
    uid: u.uid,
    email: u.email,
    password_hash: 'password',
  })
}

export function getAllUsers() {
  return db.prepare('SELECT * FROM users ORDER BY created_at DESC').all()
}

export function getUserByUid(uid) {
  return db.prepare('SELECT * FROM users WHERE uid = ?').get(uid)
}

export function getUserByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email)
}

export function authenticateUser(email, password) {
  const cred = db.prepare('SELECT * FROM user_credentials WHERE email = ? AND password_hash = ?').get(email, password)
  if (!cred) return null
  return getUserByUid(cred.uid)
}

export function createUser({ email, name, role, password, avatar, ...rest }) {
  const uid = `usr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
  const avatarUrl = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`

  db.prepare(`
    INSERT INTO users (uid, email, name, role, avatar, student_id, program, specialty, level, department, title, courses)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    uid, email, name, role, avatarUrl,
    rest.student_id || null, rest.program || null, rest.specialty || null,
    rest.level || null, rest.department || null, rest.title || null,
    rest.courses ? JSON.stringify(rest.courses) : null
  )

  if (password) {
    db.prepare('INSERT INTO user_credentials (uid, email, password_hash) VALUES (?, ?, ?)').run(uid, email, password)
  }

  return getUserByUid(uid)
}

export function upsertUser({ uid, email, name, role, password, avatar, ...rest }) {
  const existing = uid ? getUserByUid(uid) : getUserByEmail(email)

  if (existing) {
    db.prepare(`
      UPDATE users SET
        email = COALESCE(?, email),
        name = COALESCE(?, name),
        role = COALESCE(?, role),
        avatar = COALESCE(?, avatar),
        student_id = COALESCE(?, student_id),
        program = COALESCE(?, program),
        specialty = COALESCE(?, specialty),
        level = COALESCE(?, level),
        department = COALESCE(?, department),
        title = COALESCE(?, title),
        courses = COALESCE(?, courses),
        updated_at = datetime('now')
      WHERE uid = ?
    `).run(
      email || null, name || null, role || null, avatar || null,
      rest.student_id || null, rest.program || null, rest.specialty || null,
      rest.level || null, rest.department || null, rest.title || null,
      rest.courses ? JSON.stringify(rest.courses) : null,
      existing.uid
    )

    if (password) {
      db.prepare(`
        INSERT INTO user_credentials (uid, email, password_hash)
        VALUES (?, ?, ?)
        ON CONFLICT(uid) DO UPDATE SET password_hash = excluded.password_hash, email = excluded.email
      `).run(existing.uid, email || existing.email, password)
    }

    return getUserByUid(existing.uid)
  }

  return createUser({ email, name, role, password, avatar, ...rest })
}

export function updateUser(uid, patch) {
  const existing = getUserByUid(uid)
  if (!existing) return null

  const fields = []
  const values = []

  for (const [key, val] of Object.entries(patch)) {
    if (key === 'password') continue
    if (key === 'courses' && Array.isArray(val)) {
      fields.push(`${key} = ?`)
      values.push(JSON.stringify(val))
    } else {
      fields.push(`${key} = ?`)
      values.push(val)
    }
  }

  if (fields.length > 0) {
    fields.push("updated_at = datetime('now')")
    values.push(uid)
    db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE uid = ?`).run(...values)
  }

  if (patch.password) {
    db.prepare(`
      INSERT INTO user_credentials (uid, email, password_hash)
      VALUES (?, ?, ?)
      ON CONFLICT(uid) DO UPDATE SET password_hash = excluded.password_hash
    `).run(uid, existing.email, patch.password)
  }

  return getUserByUid(uid)
}

export function deleteUser(uid) {
  db.prepare('DELETE FROM users WHERE uid = ?').run(uid)
}

export function logAudit({ actor_uid, actor_name, action, target, details }) {
  db.prepare('INSERT INTO audit_log (actor_uid, actor_name, action, target, details) VALUES (?, ?, ?, ?, ?)').run(
    actor_uid || null, actor_name || null, action, target || null, details || null
  )
}

export function getAuditLog(limit = 100) {
  return db.prepare('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ?').all(limit)
}

export default db
