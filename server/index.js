import express from 'express'
import cors from 'cors'
import {
  getAllUsers, getUserByUid, getUserByEmail, authenticateUser,
  createUser, upsertUser, updateUser, deleteUser,
  logAudit, getAuditLog,
} from './db.js'

const app = express()
const PORT = process.env.API_PORT || 3001

app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Auth: login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const user = authenticateUser(email, password)
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })

    logAudit({ actor_uid: user.uid, actor_name: user.name, action: 'user.login', target: user.email })

    const { password_hash, ...safe } = user
    res.json(safe)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Auth: register
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, name, role } = req.body
    if (!email || !password || !name) return res.status(400).json({ error: 'Name, email and password required' })

    const existing = getUserByEmail(email)
    if (existing) return res.status(409).json({ error: 'Email already in use' })

    const user = createUser({ email, name, role: role || 'student', password })
    logAudit({ actor_uid: user.uid, actor_name: user.name, action: 'user.register', target: user.email })

    const { password_hash, ...safe } = user
    res.status(201).json(safe)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Sync user on login — upsert to DB, returns full profile
app.post('/api/users/sync', (req, res) => {
  try {
    const { uid, email, name, role, password, avatar, ...rest } = req.body
    if (!email || !name) return res.status(400).json({ error: 'Email and name required' })

    const user = upsertUser({ uid, email, name, role, password, avatar, ...rest })
    logAudit({ actor_uid: user.uid, actor_name: user.name, action: 'user.sync', target: user.email })

    const { password_hash, ...safe } = user
    res.json(safe)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get all users
app.get('/api/users', (_req, res) => {
  try {
    const users = getAllUsers().map(({ password_hash, ...u }) => u)
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get user by uid
app.get('/api/users/:uid', (req, res) => {
  try {
    const user = getUserByUid(req.params.uid)
    if (!user) return res.status(404).json({ error: 'User not found' })
    const { password_hash, ...safe } = user
    res.json(safe)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create user
app.post('/api/users', (req, res) => {
  try {
    const { email, name, role, password, ...rest } = req.body
    if (!email || !name) return res.status(400).json({ error: 'Email and name required' })

    const existing = getUserByEmail(email)
    if (existing) return res.status(409).json({ error: 'Email already in use' })

    const user = createUser({ email, name, role: role || 'student', password, ...rest })
    logAudit({ actor_uid: user.uid, actor_name: 'System', action: 'user.create', target: user.email })

    const { password_hash, ...safe } = user
    res.status(201).json(safe)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update user
app.patch('/api/users/:uid', (req, res) => {
  try {
    const user = updateUser(req.params.uid, req.body)
    if (!user) return res.status(404).json({ error: 'User not found' })

    logAudit({ actor_uid: user.uid, actor_name: 'System', action: 'user.update', target: user.email })

    const { password_hash, ...safe } = user
    res.json(safe)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete user
app.delete('/api/users/:uid', (req, res) => {
  try {
    const user = getUserByUid(req.params.uid)
    if (!user) return res.status(404).json({ error: 'User not found' })

    deleteUser(req.params.uid)
    logAudit({ actor_uid: req.params.uid, actor_name: 'System', action: 'user.delete', target: user.email })

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Audit log
app.get('/api/audit', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100
    res.json(getAuditLog(limit))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SIARM API server running on http://0.0.0.0:${PORT}`)
})
