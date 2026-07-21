import http from 'http';
import crypto from 'crypto';
import { URL } from 'url';
import { readFileSync, existsSync } from 'fs';

const PORT = 8000;
const SELF = `http://localhost:${PORT}`;
const DATA_PATH = process.argv[2] || './mock-data.json';

const users = new Map(); // email → user
const tokens = new Map(); // refresh_token → email
const sessions = new Map(); // access_token → email
const chatConversations = new Map();
const chatMessages = {};

const mockUsers = [
  { id:1, uid:'stu-001', email:'student@iuget.cm', password:'password', role:'student', name:'Chituh Innocentia',   avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Innocentia' },
  { id:2, uid:'lec-001', email:'lecturer@iuget.cm', password:'password', role:'lecturer', name:'Dr. Nkengafac Mfortaw', avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Mfortaw' },
  { id:3, uid:'stf-001', email:'staff@iuget.cm',    password:'password', role:'staff',   name:'Veronica Munteng',      avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Munteng' },
  { id:4, uid:'adm-001', email:'admin@iuget.cm',    password:'password', role:'admin',   name:'Prof. Fonkem',          avatar:'https://api.dicebear.com/7.x/avataaars/svg?seed=Fonkem' },
];

const avatarUrl = (s) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(s)}`;

mockUsers.forEach(d => {
  const passwordHash = crypto.createHash('sha256').update(d.password).digest('hex');
  const user = {
    id: d.id, uuid: crypto.randomUUID(), email: d.email,
    password_hash: passwordHash,
    full_name: d.name, role: d.role,
    avatar_url: avatarUrl(d.name),
    phone: d.role === 'student' ? '670000001' : d.role === 'lecturer' ? '670000002' : d.role === 'staff' ? '670000003' : '670000000',
    status: 'active',
    created_at: '2025-09-01T08:00:00.000Z', last_login_at: null,
  };
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
  { id:1, studentId:'IUGET/2024/SWE/0001', studentName:'John Doe',   course:'Mathematics',        semester:'Semester 1', ca:28, exam:65, total:93, grade:'A' },
  { id:2, studentId:'IUGET/2024/SWE/0001', studentName:'John Doe',   course:'Physics',            semester:'Semester 1', ca:25, exam:58, total:83, grade:'A' },
  { id:3, studentId:'IUGET/2024/SWE/0001', studentName:'John Doe',   course:'Programming',        semester:'Semester 1', ca:30, exam:70, total:100,grade:'A' },
  { id:4, studentId:'IUGET/2024/SWE/0001', studentName:'John Doe',   course:'Database Systems',   semester:'Semester 2', ca:27, exam:62, total:89, grade:'A' },
  { id:5, studentId:'IUGET/2024/SWE/0001', studentName:'John Doe',   course:'Web Development',    semester:'Semester 2', ca:26, exam:55, total:81, grade:'A' },
  { id:6, studentId:'IUGET/2024/SWE/0001', studentName:'John Doe',   course:'Software Engineering',semester:'Semester 2', ca:24, exam:50, total:74, grade:'B+' },
  { id:7, studentId:'IUGET/2024/SWE/0002', studentName:'Jane Smith', course:'Mathematics',        semester:'Semester 1', ca:22, exam:45, total:67, grade:'B' },
  { id:8, studentId:'IUGET/2024/SWE/0002', studentName:'Jane Smith', course:'Physics',            semester:'Semester 1', ca:20, exam:40, total:60, grade:'B' },
  { id:9, studentId:'IUGET/2024/SWE/0002', studentName:'Jane Smith', course:'Programming',        semester:'Semester 1', ca:28, exam:60, total:88, grade:'A' },
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

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, SELF);
    const path = url.pathname.replace('/api', '');
    const segments = path.split('/').filter(Boolean);

    // ── Auth ──────────────────────────────────────────────────
    if (segments[0] === 'auth') {
      const action = segments[1];

      // REGISTER
      if (req.method === 'POST' && action === 'register') {
        const body = await parseBody(req);
        const { email, password, full_name, role, phone } = body;

        if (!email || !password || !full_name || !role)
          return sendJson(res, 400, { success:false, message:'Missing required fields' });
        if (password.length < 8)
          return sendJson(res, 400, { success:false, message:'Password must be at least 8 characters' });

        const ne = email.toLowerCase().trim();
        if (users.has(ne))
          return sendJson(res, 409, { success:false, message:'Email already in use' });

        const id = users.size + 1;
        const uuid = crypto.randomUUID();
        const pwHash = crypto.createHash('sha256').update(password).digest('hex');
        const avUrl = avatarUrl(full_name);
        const user = { id, uuid, email:ne, password_hash:pwHash, full_name, role, avatar_url:avUrl, phone:phone||null, status:'pending', created_at:new Date().toISOString() };

        if (role === 'student') {
          user.registration_number = `REG/${new Date().getFullYear()}/${String(id).padStart(5,'0')}`;
          user.matricule = `IUGET/${new Date().getFullYear()}/SWE/${String(id).padStart(4,'0')}`;
          user.programme_id = 1; user.level = 1; user.specialty = 'SWE';
          user.studentId = user.matricule; user.program = 'Software Engineering';
        }

        users.set(ne, user);
        const token = generateToken(user);
        const refresh_token = generateRefreshToken();
        tokens.set(refresh_token, ne);

        return sendJson(res, 201, {
          success:true, message:'Registration successful. Account pending approval.',
          data: { token, refresh_token, user: {
            id:user.id, uuid:user.uuid, email:user.email,
            name:user.full_name, full_name:user.full_name,
            role:user.role, avatar:user.avatar_url, avatar_url:user.avatar_url,
            status:user.status, profile:user
          } }
        });
      }

      // LOGIN
      if (req.method === 'POST' && action === 'login') {
        const body = await parseBody(req);
        const { email, password } = body;
        if (!email || !password)
          return sendJson(res, 400, { success:false, message:'Missing required fields: email, password' });

        const user = users.get(email.toLowerCase().trim());
        if (!user)
          return sendJson(res, 401, { success:false, message:'Invalid email or password' });

        const pwHash = crypto.createHash('sha256').update(password).digest('hex');
        if (user.password_hash !== pwHash)
          return sendJson(res, 401, { success:false, message:'Invalid email or password' });

        user.last_login_at = new Date().toISOString();
        const token = generateToken(user);
        const refresh_token = generateRefreshToken();
        tokens.set(refresh_token, user.email);

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
        return sendJson(res, 200, { success:true, message:'Password changed successfully' });
      }

      return sendJson(res, 404, { success:false, message:`Auth endpoint not found: ${action}` });
    }

    // ── Users ─────────────────────────────────────────────────
    if (segments[0] === 'users') {
      const userData = verifyToken(req.headers.authorization);
      if (!userData) return sendJson(res, 401, { success:false, message:'Authentication required' });

      const user = users.get(userData.email);
      if (!user || !['admin','staff'].includes(user.role))
        return sendJson(res, 403, { success:false, message:'Insufficient permissions' });

      const id = segments[1];

      // GET /users
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
        const newId = users.size + 1;
        const pwHash = crypto.createHash('sha256').update(body.password||'password').digest('hex');
        const nUser = {
          id:newId, uuid:crypto.randomUUID(),
          email:body.email, password_hash:pwHash,
          full_name:body.name||body.full_name,
          role:body.role||'student', avatar_url:avatarUrl(body.name||'User'),
          phone:body.phone||null, status:'active', created_at:new Date().toISOString()
        };
        users.set(nUser.email, nUser);
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
        return sendJson(res, 200, { success:true, message:'User updated', data:found });
      }

      // DELETE /users/{id}
      if (req.method === 'DELETE' && id) {
        const found = Array.from(users.entries()).find(([_,u]) => String(u.id) === id || u.uuid === id);
        if (!found) return sendJson(res, 404, { success:false, message:'User not found' });
        users.delete(found[0]);
        return sendJson(res, 200, { success:true, message:'User deleted' });
      }

      // POST /users/{id}/password
      if (req.method === 'POST' && id && segments[2] === 'password') {
        const found = Array.from(users.values()).find(u => String(u.id) === id || u.uuid === id);
        if (!found) return sendJson(res, 404, { success:false, message:'User not found' });
        const body = await parseBody(req);
        found.password_hash = crypto.createHash('sha256').update(body.new_password||'password').digest('hex');
        users.set(found.email, found);
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
        return sendJson(res, 200, { success:true, data:[] });

      // GET /students/{id}/results
      if (req.method === 'GET' && sub === 'results')
        return sendJson(res, 200, { success:true, data:RESULTS });

      // GET /students/{id}/transcript
      if (req.method === 'GET' && sub === 'transcript')
        return sendJson(res, 200, { success:true, data:RESULTS });

      // GET /students/{id}/fees
      if (req.method === 'GET' && sub === 'fees')
        return sendJson(res, 200, { success:true, data:{ total:500000, paid:300000, balance:200000, sessions:[{session:'2025/2026', tuition:500000, paid:300000, balance:200000}] } });

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
      const { MOCK_LIBRARY_BOOKS, MOCK_BORROWINGS } = await import('../src/lib/mockData.js');
      return sendJson(res, 200, { success:true, data: { books: MOCK_LIBRARY_BOOKS, borrowings: MOCK_BORROWINGS } });
    }

    // ── Complaints ────────────────────────────────────────────
    if (segments[0] === 'complaints') {
      const { MOCK_COMPLAINTS } = await import('../src/lib/mockData.js');
      return sendJson(res, 200, { success:true, data: MOCK_COMPLAINTS });
    }

    // ── Alumni ────────────────────────────────────────────────
    if (segments[0] === 'alumni') {
      const { MOCK_ALUMNI } = await import('../src/lib/mockData.js');
      return sendJson(res, 200, { success:true, data: MOCK_ALUMNI });
    }

    // ── Events ────────────────────────────────────────────────
    if (segments[0] === 'events') {
      const { MOCK_EVENTS } = await import('../src/lib/mockData.js');
      return sendJson(res, 200, { success:true, data: MOCK_EVENTS });
    }

    // ── Exam Seating ──────────────────────────────────────────
    if (segments[0] === 'exam-seating') {
      const { MOCK_EXAM_SEATING } = await import('../src/lib/mockData.js');
      return sendJson(res, 200, { success:true, data: MOCK_EXAM_SEATING });
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
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Mock API running on http://0.0.0.0:${PORT}`);
  const endpoints = [
    'POST /auth/register', 'POST /auth/login', 'POST /auth/refresh',
    'POST /auth/logout', 'GET /auth/me',
    'POST /auth/forgot-password', 'POST /auth/reset-password', 'POST /auth/change-password',
    'GET /users', 'GET/POST /users/{id}', 'PUT/DELETE /users/{id}',
    'GET/POST /announcements', 'POST /announcements/{id}/pin', 'DELETE /announcements/{id}',
    'GET/POST /timetable', 'DELETE /timetable/{day}/{time}',
    'GET /results', 'GET /students/{id}[/timetable|attendance|results|transcript|fees|available-courses]',
    'POST /students/{id}/register',
    'GET /lecturer/courses', 'GET /lecturer/attendance/records',
    'POST /lecturer/attendance', 'POST /lecturer/grades', 'POST /lecturer/publish-grades',
    'POST /courses/enroll', 'POST /courses/unenroll',
    'POST /lessons', 'DELETE /lessons/{id}',
    'POST /assignments', 'POST /submissions', 'POST /submissions/{id}/grade',
    'POST /discussions', 'POST /discussions/{id}/reply',
    'GET /library/books', 'GET/POST /complaints', 'GET /alumni', 'GET /events', 'GET /exam-seating',
    'GET /health',
  ];
  endpoints.forEach(e => console.log(`  ${e}`));
});
