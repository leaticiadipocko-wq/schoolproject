import http from 'http';
import crypto from 'crypto';
import path from 'path';
import { URL } from 'url';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { initializeTransaction, verifyTransaction, generateReference, handleWebhook, getPublicKey } from './paystack-service.mjs'

const PORT = 8000;
const SELF = `http://localhost:${PORT}`;
const DATA_DIR = path.resolve(process.cwd(), 'database');
const DATA_PATH = process.argv[2] || path.join(DATA_DIR, 'mock-data.json');

const users = new Map(); // email → user
const tokens = new Map(); // refresh_token → email
const sessions = new Map(); // access_token → email
const chatConversations = new Map();
const chatMessages = {};

function avatarUrl(s) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(s)}`;
}

function makeUser(d, password) {
  const passwordHash = crypto.createHash('sha256').update(password || 'password').digest('hex');
  return {
    id: d.id, uuid: d.uuid || crypto.randomUUID(), email: d.email,
    password_hash: d.password_hash || passwordHash,
    full_name: d.full_name || d.name || d.full_name, role: d.role || 'student',
    avatar_url: d.avatar_url || avatarUrl(d.full_name || d.name || d.email),
    phone: d.phone || null,
    status: d.status || 'active',
    created_at: d.created_at || new Date().toISOString(),
    last_login_at: d.last_login_at || null,
    registration_number: d.registration_number || null,
    matricule: d.matricule || null,
    studentId: d.studentId || null,
    programme_id: d.programme_id || null,
    level: d.level || null,
    specialty: d.specialty || null,
    program: d.program || null,
  };
}

// ── Persistence ──────────────────────────────────────────────
function saveData() {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    const data = {
      users: Array.from(users.values()),
      _savedAt: new Date().toISOString(),
    };
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save data:', err.message);
  }
}

let _nextId = 5; // track next available ID

function loadData() {
  if (!existsSync(DATA_PATH)) return false;
  try {
    const raw = readFileSync(DATA_PATH, 'utf-8');
    const data = JSON.parse(raw);
    if (data.users && Array.isArray(data.users)) {
      data.users.forEach(u => {
        const user = makeUser(u, null);
        user.password_hash = u.password_hash || crypto.createHash('sha256').update('password').digest('hex');
        users.set(user.email, user);
        if (user.id >= _nextId) _nextId = user.id + 1;
      });
      console.log(`Loaded ${data.users.length} users from ${DATA_PATH}`);
      return true;
    }
  } catch (err) {
    console.error('Failed to load data, using defaults:', err.message);
  }
  return false;
}

const mockUsers = [
  { id:1, uid:'stu-001', email:'student@iuget.cm', password:'password', role:'student', name:'Chituh Innocentia',   avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Innocentia' },
  { id:2, uid:'lec-001', email:'lecturer@iuget.cm', password:'password', role:'lecturer', name:'Dr. Nkengafac Mfortaw', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Mfortaw' },
  { id:3, uid:'stf-001', email:'staff@iuget.cm',    password:'password', role:'staff',   name:'Veronica Munteng',      avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Munteng' },
  { id:4, uid:'adm-001', email:'admin@iuget.cm',    password:'password', role:'admin',   name:'Prof. Fonkem',          avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Fonkem' },
];

// Load persisted data first; fall back to seed users
if (!loadData()) {
  mockUsers.forEach(d => {
    const user = makeUser({
      id: d.id, uuid: crypto.randomUUID(), email: d.email,
      full_name: d.name, role: d.role,
      avatar_url: avatarUrl(d.name),
      phone: d.role === 'student' ? '670000001' : d.role === 'lecturer' ? '670000002' : d.role === 'staff' ? '670000003' : '670000000',
      status: 'active',
      created_at: '2025-09-01T08:00:00.000Z',
    }, d.password);
    if (d.role === 'student') {
      user.registration_number = 'REG/2025/00001';
      user.matricule = 'IUGET/2025/SWE/0142';
      user.programme_id = 1;
      user.level = 3;
      user.specialty = 'SWE';
      user.studentId = 'IUGET/2025/SWE/0142';
      user.program = 'Software Engineering';
    }
    users.set(d.email, user);
  });
  saveData();
}

function generateToken(user, exp) {
  const header = Buffer.from(JSON.stringify({ alg:'HS256', typ:'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    user_id: user.id, uuid: user.uuid,
    email: user.email, role: user.role,
    name: user.full_name,
    exp: exp || Math.floor(Date.now() / 1000) + 315360000,
  })).toString('base64url');
  const sig = crypto.createHmac('sha256', 'siarm-jwt-secret-key-2025').update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${sig}`;
}

function generateRefreshToken() {
  return crypto.randomBytes(32).toString('hex');
}

function verifyToken(authHeader) {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  const token = parts[1];
  const segs = token.split('.');
  if (segs.length !== 3) return null;
  try {
    return JSON.parse(Buffer.from(segs[1], 'base64url').toString());
  } catch { return null; }
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(body);
}

function parseBody(req) {
  return new Promise(resolve => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } catch { resolve({}); }
    });
  });
}

// ── Static data sets ──────────────────────────────────────────
const ANNOUNCEMENTS = [
  { id:1, title:'Welcome to SIARM', body:'Welcome to the new academic year! Ready for an amazing session?', author:'Admin', createdAt:new Date().toISOString(), pinned:true },
  { id:2, title:'Exam Schedule Published', body:'Final exams start next week. Check your timetable.', author:'Registrar', createdAt:new Date(Date.now()-864e5).toISOString(), pinned:false },
];

const TIMETABLE = [
  { id:1, day:'Monday', time:'08:00-10:00', course:'Mathematics',     room:'A101', lecturer:'Dr. Smith',   specialty:'SWE' },
  { id:2, day:'Monday', time:'10:30-12:30', course:'Physics',         room:'B202', lecturer:'Dr. Johnson', specialty:'SWE' },
  { id:3, day:'Tuesday', time:'08:00-10:00', course:'Programming',     room:'C303', lecturer:'Prof. Williams', specialty:'SWE' },
  { id:4, day:'Wednesday', time:'14:00-16:00', course:'Database Systems', room:'D404', lecturer:'Dr. Brown', specialty:'SWE' },
  { id:5, day:'Thursday', time:'10:30-12:30', course:'Web Development', room:'E505', lecturer:'Dr. Davis', specialty:'SWE' },
  { id:6, day:'Friday', time:'08:00-10:00', course:'Software Engineering', room:'F606', lecturer:'Dr. Wilson', specialty:'SWE' },
];

const RESULTS = [
  { id:1, studentId:'IUGET/2025/SWE/0142', studentName:'Chituh Innocentia', course:'Mathematics',        semester:'Semester 1', ca:28, exam:65, total:93, grade:'A' },
  { id:2, studentId:'IUGET/2025/SWE/0142', studentName:'Chituh Innocentia', course:'Physics',            semester:'Semester 1', ca:25, exam:58, total:83, grade:'A' },
  { id:3, studentId:'IUGET/2025/SWE/0142', studentName:'Chituh Innocentia', course:'Programming',        semester:'Semester 1', ca:30, exam:65, total:95, grade:'A' },
  { id:4, studentId:'IUGET/2025/SWE/0142', studentName:'Chituh Innocentia', course:'Database Systems',   semester:'Semester 2', ca:27, exam:62, total:89, grade:'A' },
  { id:5, studentId:'IUGET/2025/SWE/0142', studentName:'Chituh Innocentia', course:'Web Development',    semester:'Semester 2', ca:26, exam:55, total:81, grade:'A' },
  { id:6, studentId:'IUGET/2025/SWE/0142', studentName:'Chituh Innocentia', course:'Software Engineering',semester:'Semester 2', ca:24, exam:50, total:74, grade:'B+' },
  { id:7, studentId:'IUGET/2025/SWE/0142', studentName:'Chituh Innocentia', course:'Compiler Design',     semester:'Semester 2', ca:22, exam:45, total:67, grade:'B' },
  { id:8, studentId:'IUGET/2025/SWE/0142', studentName:'Chituh Innocentia', course:'Research Methodology', semester:'Semester 2', ca:29, exam:60, total:89, grade:'A' },
  { id:9, studentId:'IUGET/2026/SWE/0011', studentName:'Result Check Student', course:'Mathematics',      semester:'Semester 1', ca:25, exam:60, total:85, grade:'A' },
  { id:10, studentId:'IUGET/2026/SWE/0011', studentName:'Result Check Student', course:'Physics',         semester:'Semester 1', ca:28, exam:55, total:83, grade:'A' },
  { id:11, studentId:'IUGET/2026/SWE/0011', studentName:'Result Check Student', course:'Programming',     semester:'Semester 1', ca:30, exam:50, total:80, grade:'A' },
  { id:12, studentId:'IUGET/2026/SWE/0011', studentName:'Result Check Student', course:'Database Systems',semester:'Semester 2', ca:22, exam:48, total:70, grade:'B+' },
  { id:13, studentId:'IUGET/2026/SWE/0011', studentName:'Result Check Student', course:'Web Development', semester:'Semester 2', ca:25, exam:45, total:70, grade:'B+' },
  { id:14, studentId:'IUGET/2026/SWE/0011', studentName:'Result Check Student', course:'Software Engineering', semester:'Semester 2', ca:20, exam:40, total:60, grade:'B' },
];

const COURSES = [
  { id:1, code:'MATH101', name:'Mathematics',        credits:4, lecturer:'Dr. Smith',   specialty:'SWE', semester:'Semester 1' },
  { id:2, code:'PHY101',  name:'Physics',            credits:4, lecturer:'Dr. Johnson', specialty:'SWE', semester:'Semester 1' },
  { id:3, code:'CS101',   name:'Programming',        credits:5, lecturer:'Prof. Williams', specialty:'SWE', semester:'Semester 1' },
  { id:4, code:'DB101',   name:'Database Systems',   credits:4, lecturer:'Dr. Brown',   specialty:'SWE', semester:'Semester 2' },
  { id:5, code:'WEB101',  name:'Web Development',    credits:4, lecturer:'Dr. Davis',   specialty:'SWE', semester:'Semester 2' },
  { id:6, code:'SE101',   name:'Software Engineering', credits:5, lecturer:'Dr. Wilson', specialty:'SWE', semester:'Semester 2' },
];

const STUDENT_USERS = [
  { id:'IUGET/2025/SWE/0142', name:'Chituh Innocentia', email:'student@iuget.cm', level:3, specialty:'SWE', program:'Software Engineering' },
  { id:'IUGET/2025/SWE/0001', name:'Jane Smith', email:'jane@iuget.cm', level:3, specialty:'SWE', program:'Software Engineering' },
];

export async function handleApiRequest(req, res) {
  try {
    const url = new URL(req.url, SELF);
    const path = url.pathname.replace('/api', '');
    const segments = path.split('/').filter(Boolean);

    // ── Auth ──────────────────────────────────────────────────
    if (segments[0] === 'auth') {
      const action = segments[1];

      // REGISTER — accept any credentials
      if (req.method === 'POST' && action === 'register') {
        const body = await parseBody(req);
        const { email, password, full_name, name, role } = body;
        const ne = (email || 'user@iuget.cm').toLowerCase().trim();
        const fullName = full_name || name || ne.split('@')[0];
        const userRole = role || 'student';

        const id = _nextId++;
        const uuid = crypto.randomUUID();
        const pwHash = crypto.createHash('sha256').update(password || 'password').digest('hex');
        const avUrl = avatarUrl(fullName);
        const user = { id, uuid, email:ne, password_hash:pwHash, full_name:fullName, role:userRole, avatar_url:avUrl, phone:null, status:'active', created_at:new Date().toISOString() };

        if (userRole === 'student') {
          user.registration_number = `REG/${new Date().getFullYear()}/${String(id).padStart(5,'0')}`;
          user.matricule = `IUGET/${new Date().getFullYear()}/SWE/${String(id).padStart(4,'0')}`;
          user.programme_id = 1; user.level = 1; user.specialty = 'SWE';
          user.studentId = user.matricule; user.program = 'Software Engineering';
        }

        if (!users.has(ne)) { users.set(ne, user); saveData(); }
        const existing = users.get(ne);
        const token = generateToken(existing);
        const refresh_token = generateRefreshToken();
        tokens.set(refresh_token, ne);

        return sendJson(res, 201, {
          success:true, message:'Registration successful.',
          data: { token, refresh_token, user: {
            id:existing.id, uuid:existing.uuid, email:existing.email,
            name:existing.full_name, full_name:existing.full_name,
            role:existing.role, avatar:existing.avatar_url, avatar_url:existing.avatar_url,
            status:existing.status, profile:existing
          } }
        });
      }

      // LOGIN — auto-create user if not found, accept any password
      if (req.method === 'POST' && action === 'login') {
        const body = await parseBody(req);
        const { email, password } = body;
        const ne = (email || 'user@iuget.cm').toLowerCase().trim();

        if (!users.has(ne)) {
          const id = _nextId++;
          const uuid = crypto.randomUUID();
          const pwHash = crypto.createHash('sha256').update(password || 'password').digest('hex');
          const avUrl = avatarUrl(ne.split('@')[0]);
          const newUser = { id, uuid, email:ne, password_hash:pwHash, full_name:ne.split('@')[0], role:'student', avatar_url:avUrl, phone:null, status:'active', created_at:new Date().toISOString(), last_login_at:new Date().toISOString() };
          newUser.registration_number = `REG/${new Date().getFullYear()}/${String(id).padStart(5,'0')}`;
          newUser.matricule = `IUGET/${new Date().getFullYear()}/SWE/${String(id).padStart(4,'0')}`;
          newUser.studentId = newUser.matricule; newUser.program = 'Software Engineering';
          users.set(ne, newUser);
          saveData();
        }

        const user = users.get(ne);
        user.last_login_at = new Date().toISOString();
        const token = generateToken(user);
        const refresh_token = generateRefreshToken();
        tokens.set(refresh_token, ne);

        return sendJson(res, 200, {
          success:true, message:'Login successful',
          data: { token, refresh_token, remember_me:false, user: {
            id:user.id, uuid:user.uuid, email:user.email,
            name:user.full_name, full_name:user.full_name,
            role:user.role, avatar:user.avatar_url, avatar_url:user.avatar_url,
            phone:user.phone, status:user.status,
            last_login_at:user.last_login_at, profile:user
          } }
        });
      }

      // REFRESH
      if (req.method === 'POST' && action === 'refresh') {
        const body = await parseBody(req);
        const { refresh_token } = body;
        if (!refresh_token || !tokens.has(refresh_token))
          return sendJson(res, 401, { success:false, message:'Invalid refresh token' });

        const userEmail = tokens.get(refresh_token);
        const user = users.get(userEmail);
        if (!user)
          return sendJson(res, 404, { success:false, message:'User not found' });

        const newToken = generateToken(user);
        return sendJson(res, 200, { success:true, access_token:newToken, refresh_token });
      }

      // LOGOUT
      if (req.method === 'POST' && action === 'logout') {
        const body = await parseBody(req);
        const { refresh_token } = body;
        if (refresh_token) tokens.delete(refresh_token);
        return sendJson(res, 200, { success:true, message:'Logged out successfully' });
      }

      // ME
      if (req.method === 'GET' && action === 'me') {
        const userData = verifyToken(req.headers.authorization);
        if (!userData)
          return sendJson(res, 401, { success:false, message:'Authentication required' });

        const user = users.get(userData.email);
        if (!user)
          return sendJson(res, 404, { success:false, message:'User not found' });

        return sendJson(res, 200, {
          success:true, data:{ user:{ ...user, name:user.full_name, avatar:user.avatar_url, profile:user } }
        });
      }

      // FORGOT PASSWORD
      if (req.method === 'POST' && action === 'forgot-password') {
        const body = await parseBody(req);
        const { email } = body;
        if (!email)
          return sendJson(res, 400, { success:false, message:'Email is required' });
        return sendJson(res, 200, { success:true, message:'Password reset link sent to your email' });
      }

      // RESET PASSWORD
      if (req.method === 'POST' && action === 'reset-password') {
        const body = await parseBody(req);
        const { token, password, password_confirm } = body;
        if (!token || !password || !password_confirm)
          return sendJson(res, 400, { success:false, message:'Missing required fields' });
        if (password !== password_confirm)
          return sendJson(res, 400, { success:false, message:'Passwords do not match' });
        return sendJson(res, 200, { success:true, message:'Password reset successfully' });
      }

      // CHANGE PASSWORD
      if (req.method === 'POST' && action === 'change-password') {
        const userData = verifyToken(req.headers.authorization);
        if (!userData) return sendJson(res, 401, { success:false, message:'Authentication required' });

        const body = await parseBody(req);
        const { current_password, new_password } = body;
        const user = users.get(userData.email);
        if (!user) return sendJson(res, 404, { success:false, message:'User not found' });

        const curHash = crypto.createHash('sha256').update(current_password).digest('hex');
        if (user.password_hash !== curHash)
          return sendJson(res, 401, { success:false, message:'Current password is incorrect' });
        if (new_password.length < 8)
          return sendJson(res, 400, { success:false, message:'Password must be at least 8 characters' });

        user.password_hash = crypto.createHash('sha256').update(new_password).digest('hex');
        users.set(userData.email, user);
        saveData();
        return sendJson(res, 200, { success:true, message:'Password changed successfully' });
      }

      return sendJson(res, 404, { success:false, message:`Auth endpoint not found: ${action}` });
    }

    // ── Users ─────────────────────────────────────────────────
    if (segments[0] === 'users') {
      const userData = verifyToken(req.headers.authorization);
      if (!userData) return sendJson(res, 401, { success:false, message:'Authentication required' });

      const id = segments[1];

      // GET /users — any authenticated user can list (for chat cross-role communication)
      if (req.method === 'GET' && !id) {
        const list = Array.from(users.values()).map(u => ({
          id:u.id, uuid:u.uuid, email:u.email,
          name:u.full_name, full_name:u.full_name,
          role:u.role, avatar:u.avatar_url, avatar_url:u.avatar_url,
          phone:u.phone, status:u.status, created_at:u.created_at
        }));
        return sendJson(res, 200, { success:true, data:list });
      }

      // GET /users/{id}
      if (req.method === 'GET' && id) {
        const found = Array.from(users.values()).find(u => String(u.id) === id || u.uuid === id);
        if (!found) return sendJson(res, 404, { success:false, message:'User not found' });
        return sendJson(res, 200, { success:true, data:{ ...found, name:found.full_name, avatar:found.avatar_url } });
      }

      // POST /users
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newId = _nextId++;
        const pwHash = crypto.createHash('sha256').update(body.password||'password').digest('hex');
        const nUser = {
          id:newId, uuid:crypto.randomUUID(),
          email:body.email, password_hash:pwHash,
          full_name:body.name||body.full_name,
          role:body.role||'student', avatar_url:avatarUrl(body.name||'User'),
          phone:body.phone||null, status:'active', created_at:new Date().toISOString()
        };
        users.set(nUser.email, nUser);
        saveData();
        return sendJson(res, 201, { success:true, message:'User created', data:nUser });
      }

      // PUT /users/{id}
      if (req.method === 'PUT' && id) {
        const found = Array.from(users.values()).find(u => String(u.id) === id || u.uuid === id);
        if (!found) return sendJson(res, 404, { success:false, message:'User not found' });
        const body = await parseBody(req);
        Object.assign(found, body);
        if (body.name) found.full_name = body.name;
        if (body.avatar) found.avatar_url = body.avatar;
        users.set(found.email, found);
        saveData();
        return sendJson(res, 200, { success:true, message:'User updated', data:found });
      }

      // DELETE /users/{id}
      if (req.method === 'DELETE' && id) {
        const found = Array.from(users.entries()).find(([_,u]) => String(u.id) === id || u.uuid === id);
        if (!found) return sendJson(res, 404, { success:false, message:'User not found' });
        users.delete(found[0]);
        saveData();
        return sendJson(res, 200, { success:true, message:'User deleted' });
      }

      // POST /users/{id}/password
      if (req.method === 'POST' && id && segments[2] === 'password') {
        const found = Array.from(users.values()).find(u => String(u.id) === id || u.uuid === id);
        if (!found) return sendJson(res, 404, { success:false, message:'User not found' });
        const body = await parseBody(req);
        found.password_hash = crypto.createHash('sha256').update(body.new_password||'password').digest('hex');
        users.set(found.email, found);
        saveData();
        return sendJson(res, 200, { success:true, message:'Password updated' });
      }

      return sendJson(res, 404, { success:false, message:'Users endpoint not found' });
    }

    // ── Announcements ─────────────────────────────────────────
    if (segments[0] === 'announcements') {
      const id = segments[1];

      if (req.method === 'GET' && !id)
        return sendJson(res, 200, { success:true, data:ANNOUNCEMENTS });

      if (req.method === 'POST' && !id) {
        const body = await parseBody(req);
        const a = { id:ANNOUNCEMENTS.length+1, title:body.title, body:body.body, author:'Admin', createdAt:new Date().toISOString(), pinned:false };
        ANNOUNCEMENTS.unshift(a);
        return sendJson(res, 201, { success:true, message:'Announcement created', data:a });
      }

      if (req.method === 'POST' && id && segments[2] === 'pin') {
        const a = ANNOUNCEMENTS.find(x => String(x.id) === id);
        if (!a) return sendJson(res, 404, { success:false, message:'Not found' });
        a.pinned = !a.pinned;
        return sendJson(res, 200, { success:true, data:a });
      }

      if (req.method === 'DELETE' && id) {
        const idx = ANNOUNCEMENTS.findIndex(x => String(x.id) === id);
        if (idx === -1) return sendJson(res, 404, { success:false, message:'Not found' });
        ANNOUNCEMENTS.splice(idx, 1);
        return sendJson(res, 200, { success:true, message:'Deleted' });
      }

      return sendJson(res, 404, { success:false, message:'Announcements endpoint not found' });
    }

    // ── Timetable ─────────────────────────────────────────────
    if (segments[0] === 'timetable') {
      const day = segments[1], time = segments[2];

      if (req.method === 'GET' && !day)
        return sendJson(res, 200, { success:true, data:TIMETABLE });

      if (req.method === 'POST' && !day) {
        const body = await parseBody(req);
        const t = { id:TIMETABLE.length+1, day:body.day, time:body.time, course:body.course, room:body.room, lecturer:body.lecturer, specialty:body.specialty||'SWE' };
        TIMETABLE.push(t);
        return sendJson(res, 201, { success:true, data:t });
      }

      if (req.method === 'DELETE' && day && time) {
        const idx = TIMETABLE.findIndex(t => t.day === day && t.time === time);
        if (idx === -1) return sendJson(res, 404, { success:false, message:'Not found' });
        TIMETABLE.splice(idx, 1);
        return sendJson(res, 200, { success:true, message:'Deleted' });
      }

      return sendJson(res, 404, { success:false, message:'Timetable endpoint not found' });
    }

    // ── Results ───────────────────────────────────────────────
    if (segments[0] === 'results') {
      if (req.method === 'GET')
        return sendJson(res, 200, { success:true, data:RESULTS });
      return sendJson(res, 404, { success:false, message:'Results endpoint not found' });
    }

    // ── Students ──────────────────────────────────────────────
    if (segments[0] === 'students') {
      const studentId = segments[1];
      const sub = segments[2];

      if (!studentId)
        return sendJson(res, 400, { success:false, message:'Student ID required' });

      const student = STUDENT_USERS.find(s => s.id === studentId) || STUDENT_USERS[0];

      // GET /students/{id}
      if (req.method === 'GET' && !sub)
        return sendJson(res, 200, { success:true, data:student });

      // GET /students/{id}/timetable
      if (req.method === 'GET' && sub === 'timetable')
        return sendJson(res, 200, { success:true, data:TIMETABLE });

      // GET /students/{id}/attendance
      if (req.method === 'GET' && sub === 'attendance')
        return sendJson(res, 200, { success:true, data:{ records:[
          { course_id:'MATH101', course:'Mathematics', period:'Semester 1', attended:22, total:24, percent:92 },
          { course_id:'PHY101', course:'Physics', period:'Semester 1', attended:20, total:24, percent:83 },
          { course_id:'CS101', course:'Programming', period:'Semester 1', attended:23, total:24, percent:96 },
          { course_id:'DB101', course:'Database Systems', period:'Semester 2', attended:18, total:20, percent:90 },
          { course_id:'WEB101', course:'Web Development', period:'Semester 2', attended:19, total:20, percent:95 },
          { course_id:'SE101', course:'Software Engineering', period:'Semester 2', attended:17, total:20, percent:85 },
        ]} });

      // GET /students/{id}/results
      if (req.method === 'GET' && sub === 'results')
        return sendJson(res, 200, { success:true, data:{ results:RESULTS } });

      // GET /students/{id}/transcript
      if (req.method === 'GET' && sub === 'transcript')
        return sendJson(res, 200, { success:true, data:{ results:RESULTS } });

      // GET /students/{id}/fees
      if (req.method === 'GET' && sub === 'fees')
        return sendJson(res, 200, { success:true, data:{ fees:{ total:500000, paid:350000, balance:150000, currency:'FCFA', academicYear:'2025 / 2026' }, payments:[
          { id:'pay-1', date:'2025-10-15T10:30:00Z', amount:200000, method:'MTN Mobile Money', methodId:'momo', phone:'670000001', reference:'PAYSTACK-REF-001', status:'success' },
          { id:'pay-2', date:'2026-01-20T14:15:00Z', amount:150000, method:'Orange Money', methodId:'om', phone:'670000001', reference:'PAYSTACK-REF-002', status:'success' },
        ] } });

      // POST /students/{id}/register
      if (req.method === 'POST' && sub === 'register')
        return sendJson(res, 200, { success:true, message:'Registration successful' });

      // GET /students/{id}/available-courses
      if (req.method === 'GET' && sub === 'available-courses')
        return sendJson(res, 200, { success:true, data:COURSES });

      return sendJson(res, 404, { success:false, message:'Student endpoint not found' });
    }

    // ── Lecturer ──────────────────────────────────────────────
    if (segments[0] === 'lecturer') {
      const sub = segments[1];

      // GET /lecturer/courses
      if (req.method === 'GET' && sub === 'courses')
        return sendJson(res, 200, { success:true, data:COURSES });

      // GET /lecturer/attendance/records
      if (req.method === 'GET' && sub === 'attendance' && segments[2] === 'records')
        return sendJson(res, 200, { success:true, data:[] });

      // POST /lecturer/attendance
      if (req.method === 'POST' && sub === 'attendance') {
        const body = await parseBody(req);
        return sendJson(res, 200, { success:true, message:`Attendance saved for ${body.course_id||'course'}` });
      }

      // POST /lecturer/grades
      if (req.method === 'POST' && sub === 'grades') {
        const body = await parseBody(req);
        return sendJson(res, 200, { success:true, message:`Grades saved for ${body.course_id||'course'}` });
      }

      // POST /lecturer/publish-grades
      if (req.method === 'POST' && sub === 'publish-grades')
        return sendJson(res, 200, { success:true, message:'Grades published' });

      return sendJson(res, 404, { success:false, message:'Lecturer endpoint not found' });
    }

    // ── Courses ───────────────────────────────────────────────
    if (segments[0] === 'courses') {
      if (req.method === 'POST' && segments[1] === 'enroll') {
        const body = await parseBody(req);
        return sendJson(res, 200, { success:true, message:`Enrolled in ${(body.course_ids||[]).length} course(s)` });
      }
      if (req.method === 'POST' && segments[1] === 'unenroll') {
        const body = await parseBody(req);
        return sendJson(res, 200, { success:true, message:`Unenrolled from ${(body.course_ids||[]).length} course(s)` });
      }
      return sendJson(res, 200, { success:true, data:COURSES });
    }

    // ── Lessons ───────────────────────────────────────────────
    if (segments[0] === 'lessons') {
      if (req.method === 'POST' && !segments[1]) {
        const body = await parseBody(req);
        return sendJson(res, 201, { success:true, message:'Lesson published', data:{ id:Date.now(), ...body } });
      }
      if (req.method === 'DELETE' && segments[1])
        return sendJson(res, 200, { success:true, message:'Lesson deleted' });
      return sendJson(res, 404, { success:false, message:'Lessons endpoint not found' });
    }

    // ── Assignments ───────────────────────────────────────────
    if (segments[0] === 'assignments') {
      if (req.method === 'POST')
        return sendJson(res, 201, { success:true, message:'Assignment created' });
      return sendJson(res, 200, { success:true, data:[] });
    }

    // ── Submissions ───────────────────────────────────────────
    if (segments[0] === 'submissions') {
      if (req.method === 'POST' && !segments[1]) {
        const body = await parseBody(req);
        return sendJson(res, 201, { success:true, message:'Assignment submitted', data:{ id:Date.now(), ...body } });
      }
      if (req.method === 'POST' && segments[2] === 'grade') {
        const body = await parseBody(req);
        return sendJson(res, 200, { success:true, message:`Graded: ${body.grade||0}` });
      }
      return sendJson(res, 200, { success:true, data:[] });
    }

    // ── Discussions ───────────────────────────────────────────
    if (segments[0] === 'discussions') {
      if (req.method === 'POST' && !segments[1])
        return sendJson(res, 201, { success:true, message:'Discussion posted' });
      if (req.method === 'POST' && segments[2] === 'reply')
        return sendJson(res, 200, { success:true, message:'Reply posted' });
      return sendJson(res, 200, { success:true, data:[] });
    }

    // ── Chat ──────────────────────────────────────────────────
    if (segments[0] === 'chats') {
      if (req.method === 'GET' && !segments[1]) {
        const list = Array.from(chatConversations.values()).map(c => ({
          ...c,
          lastMessage: chatMessages[c.id]?.length ? chatMessages[c.id][chatMessages[c.id].length - 1] : null,
          messageCount: (chatMessages[c.id] || []).length,
        }));
        return sendJson(res, 200, { success:true, data:list });
      }
      if (req.method === 'POST' && !segments[1]) {
        const body = await parseBody(req);
        const convId = `chat-${Date.now()}`;
        const conv = { id:convId, type:body.type||'direct', name:body.name||'', participants:body.participants||[], unread:0, updatedAt:new Date().toISOString() };
        chatConversations.set(convId, conv);
        chatMessages[convId] = [];
        return sendJson(res, 201, { success:true, data:conv });
      }
      if (req.method === 'GET' && segments[1]) {
        const msgs = chatMessages[segments[1]] || [];
        return sendJson(res, 200, { success:true, data:msgs });
      }
      if (req.method === 'POST' && segments[1] && segments[2] === 'messages') {
        const body = await parseBody(req);
        if (!chatMessages[segments[1]]) chatMessages[segments[1]] = [];
        const msg = { id:`chatmsg-${Date.now()}`, conversationId:segments[1], sender:body.sender, text:body.text, timestamp:new Date().toISOString(), read:false };
        chatMessages[segments[1]].push(msg);
        if (chatConversations.has(segments[1])) {
          const c = chatConversations.get(segments[1]);
          c.lastMessage = { text:body.text, timestamp:msg.timestamp, sender:body.sender?.name };
          c.updatedAt = msg.timestamp;
        }
        return sendJson(res, 201, { success:true, data:msg });
      }
      return sendJson(res, 404, { success:false, message:'Chat endpoint not found' });
    }

    // ── Chatbot ───────────────────────────────────────────────
    if (path === '/chatbot') {
      const body = await parseBody(req);
      const msg = (body?.message || '').toLowerCase().trim();
      const name = body?.userName || 'User';

      const responses = [
        { keywords:['hello','hi','hey','greetings'], reply:`Hello ${name}! 👋 How can I help you with your academic needs today?` },
        { keywords:['fee','payment','pay','finance','bursary','tuition'], reply:`To check your fees and make payments, please visit the **Fees & Payments** section under your profile. You can pay via mobile money, bank transfer, or at the bursary office.` },
        { keywords:['result','grade','score','exam','mark'], reply:`Your results are available in the **Results** section. If you notice any discrepancy, please contact your lecturer or the academic registrar within 14 days of publication.` },
        { keywords:['timetable','schedule','class','course','lecture'], reply:`Your class timetable is available in the **Timetable** section. All times are in WAT (West African Time). Please arrive 5 minutes before your scheduled class.` },
        { keywords:['register','registration','enroll','course'], reply:`Course registration is done at the beginning of each semester through the **Course Registration** portal. You need to clear your fees before registration.` },
        { keywords:['transcript','certificate','diploma'], reply:`Transcript requests are processed by the Academic Registrar's office. Processing takes 3-5 business days. You can track your request status in the portal.` },
        { keywords:['library','book','resource','research'], reply:`The University Library is open Monday-Friday 8:00 AM - 8:00 PM and Saturday 9:00 AM - 3:00 PM. You can also access the e-library through the portal.` },
        { keywords:['hostel','accommodation','dormitory','housing'], reply:`For accommodation inquiries, please contact the Student Affairs Office. Applications for on-campus housing open at the start of each academic year.` },
        { keywords:['password','reset','forgot','login'], reply:`If you forgot your password, click **Forgot Password** on the login page. A reset link will be sent to your registered email address.` },
        { keywords:['deadline','due','submission','submit','assignment'], reply:`Assignment deadlines are set by your lecturer and displayed in the **Assignments** section. Late submissions may incur a penalty of 5% per day.` },
        { keywords:['contact','support','helpdesk','help','assist'], reply:`You can reach the IT Helpdesk at helpdesk@iuget.cm or visit room B105 during working hours. For academic issues, contact your faculty's administrative officer.` },
        { keywords:['holiday','break','vacation','calendar'], reply:`The academic calendar is available in the **Calendar** section. Key dates include: Mid-Semester Break (Week 7), End-of-Semester Exams (Week 16-17), and Holidays as announced.` },
      ];

      let reply = `I'm sorry ${name}, I couldn't understand your question. Please try asking about **fees, results, timetable, registration, assignments, library, hostel, contact, or deadlines**.`;
      for (const r of responses) {
        if (r.keywords.some(k => msg.includes(k))) {
          reply = r.reply;
          break;
        }
      }

      return sendJson(res, 200, {
        success:true,
        data:{
          reply,
          timestamp: new Date().toISOString(),
          intent: msg.includes('fee') ? 'fee' : msg.includes('result') ? 'result' : 'general'
        }
      });
    }

    // ── Library ───────────────────────────────────────────────
    if (segments[0] === 'library' && segments[1] === 'books') {
      return sendJson(res, 200, { success:true, data: { books: [
        { id:'bk-1', title:'Compilers: Principles, Techniques, and Tools', author:'Aho, Lam, Sethi, Ullman', isbn:'978-0321548463', total:5, available:3, category:'Computer Science' },
        { id:'bk-2', title:'Introduction to Algorithms', author:'Cormen, Leiserson, Rivest, Stein', isbn:'978-0262033848', total:3, available:1, category:'Computer Science' },
        { id:'bk-3', title:'Database System Concepts', author:'Silberschatz, Korth, Sudarshan', isbn:'978-0078022159', total:4, available:2, category:'Database' },
      ], borrowings: [
        { id:'br-1', bookId:'bk-1', userId:'stu-001', userName:'Chituh Innocentia', borrowDate:'2026-05-01', dueDate:'2026-05-22', returned:false },
      ] } });
    }

    // ── Complaints ────────────────────────────────────────────
    if (segments[0] === 'complaints') {
      return sendJson(res, 200, { success:true, data: [
        { id:'cp-1', userId:'stu-001', userName:'Chituh Innocentia', category:'Academic', subject:'Grade discrepancy', description:'My CA score for Mathematics appears lower than expected.', status:'open', priority:'high', createdAt:new Date(Date.now()-172800000).toISOString(), updatedAt:new Date(Date.now()-172800000).toISOString() },
      ] });
    }

    // ── Alumni ────────────────────────────────────────────────
    if (segments[0] === 'alumni') {
      return sendJson(res, 200, { success:true, data: [] });
    }

    // ── Events ────────────────────────────────────────────────
    if (segments[0] === 'events') {
      return sendJson(res, 200, { success:true, data: [
        { id:'ev-1', title:'End of Semester Exams', date:'2026-06-15', description:'Final examinations for Semester 2 begin.', type:'academic' },
        { id:'ev-2', title:'Project Defense', date:'2026-07-10', description:'Level 3 student project presentations.', type:'academic' },
        { id:'ev-3', title:'Graduation Ceremony', date:'2026-08-20', description:'Graduation ceremony for the 2025/2026 academic year.', type:'social' },
      ] });
    }

    // ── Exam Seating ──────────────────────────────────────────
    if (segments[0] === 'exam-seating') {
      return sendJson(res, 200, { success:true, data: {
        'MAT101': { venue:'Hall A', date:'2026-06-15', time:'08:00 - 11:00', seat:'A-042' },
        'PHY101': { venue:'Hall B', date:'2026-06-17', time:'08:00 - 11:00', seat:'B-018' },
      } });
    }

    // ── Payments (Paystack integration) ───────────────────────
    if (segments[0] === 'payments') {
      // GET /payments/key — public key for frontend (no auth required)
      if (req.method === 'GET' && segments[1] === 'key') {
        return sendJson(res, 200, { success:true, data: { publicKey: getPublicKey() } });
      }

      const userData = verifyToken(req.headers.authorization);
      if (!userData) return sendJson(res, 401, { success:false, message:'Authentication required' });

      // POST /payments/initialize — create a Paystack transaction
      if (req.method === 'POST' && segments[1] === 'initialize') {
        const body = JSON.parse(req.body || '{}');
        const user = users.get(userData.email);
        if (!user) return sendJson(res, 404, { success:false, message:'User not found' });

        const channels = [];
        if (body.method === 'momo') {
          channels.push('mobile_money');
          body.mobile_money = { provider: 'mtn' };
        } else if (body.method === 'om') {
          channels.push('mobile_money');
          body.mobile_money = { provider: 'orange' };
        } else if (body.method === 'visa') {
          channels.push('card');
        } else {
          channels.push('bank_transfer');
        }

        const reference = generateReference();
        let result;
        try {
          result = await initializeTransaction({
            amount: body.amount,
            email: user.email,
            currency: 'XAF',
            channels,
            mobile_money: body.mobile_money,
            metadata: {
              userId: user.uuid,
              studentId: user.studentId || user.registration_number,
              method: body.method,
              methodName: body.methodName,
            },
          });
        } catch (err) {
          return sendJson(res, 502, { success:false, message:'Payment gateway error' });
        }

        return sendJson(res, 200, {
          success: true,
          data: {
            authorization_url: result.data.authorization_url,
            access_code: result.data.access_code,
            reference: result.data.reference || reference,
            publicKey: getPublicKey(),
          },
        });
      }

      // POST /payments/verify — verify a transaction
      if (req.method === 'POST' && segments[1] === 'verify') {
        const body = JSON.parse(req.body || '{}');
        const result = await verifyTransaction(body.reference);
        return sendJson(res, 200, {
          success: true,
          data: {
            status: result.data.status,
            reference: result.data.reference,
            amount: result.data.amount,
            channel: result.data.channel,
            paidAt: result.data.paid_at,
          },
        });
      }

      // POST /payments/webhook — Paystack webhook handler
      if (req.method === 'POST' && segments[1] === 'webhook') {
        const body = JSON.parse(req.body || '{}');
        const event = req.headers['x-paystack-event'] || body.event;
        const webhookResult = await handleWebhook(event, body.data);
        if (webhookResult.success) {
          console.log(`[Paystack Webhook] Payment confirmed: ${webhookResult.reference} (${webhookResult.amount} XAF via ${webhookResult.channel})`);
        }
        return sendJson(res, 200, { success: true });
      }

      // GET /payments/callback — redirect after Paystack checkout
      if (req.method === 'GET' && segments[1] === 'callback') {
        const ref = url.searchParams.get('reference') || '';
        const status = url.searchParams.get('status') || 'success';
        return sendJson(res, 200, {
          success: status === 'success',
          message: status === 'success' ? 'Payment completed' : 'Payment cancelled',
          data: { reference: ref, status },
        });
      }

      return sendJson(res, 404, { success:false, message:'Payments endpoint not found' });
    }

    // ── Health check ──────────────────────────────────────────
    if (path === '/health')
      return sendJson(res, 200, { success:true, status:'ok', uptime:process.uptime() });

    // ── 404 fallback ─────────────────────────────────────────
    sendJson(res, 404, { success:false, message:`Endpoint not found: ${req.method} ${path}` });
  } catch (err) {
    console.error('SERVER ERROR:', err);
    sendJson(res, 500, { success:false, message:'Internal server error' });
  }
}

// Allow running standalone: node scripts/mock-api.mjs
const isMain = process.argv[1] && (
  process.argv[1].endsWith('mock-api.mjs') || process.argv[1].endsWith('mock-api')
);
if (isMain) {
  const server = http.createServer(handleApiRequest);
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Mock API running on http://0.0.0.0:${PORT}`);
  });
}
