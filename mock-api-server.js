import http from 'http';
import { URL } from 'url';
import crypto from 'crypto';

const PORT = 8000;

const users = new Map();
const students = new Map();
const lecturers = new Map();

function generateToken(user) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    user_id: user.id,
    email: user.email,
    role: user.role,
    name: user.full_name,
    exp: Date.now() + 3600000
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
}

function sendResponse(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
  });
  res.end(JSON.stringify(data));
}

function handleAuthRegister(req, res, body) {
  const { email, password, full_name, role, phone } = body;
  
  if (!email || !password || !full_name || !role) {
    return sendResponse(res, 400, { success: false, message: 'Missing required fields' });
  }
  
  if (users.has(email.toLowerCase())) {
    return sendResponse(res, 409, { success: false, message: 'Email already in use' });
  }
  
  if (password.length < 8) {
    return sendResponse(res, 400, { success: false, message: 'Password must be at least 8 characters' });
  }
  
  const user = {
    id: Date.now(),
    uuid: crypto.randomUUID(),
    email: email.toLowerCase(),
    password_hash: 'hashed_' + password,
    full_name,
    role,
    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(full_name)}`,
    phone: phone || null,
    status: 'active',
    last_login_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
  
  users.set(email.toLowerCase(), user);
  
  if (role === 'student') {
    const studentId = `REG/${new Date().getFullYear()}/${String(students.size + 1).padStart(5, '0')}`;
    const matricule = `IUGET/${new Date().getFullYear()}/SWE/${String(students.size + 1).padStart(4, '0')}`;
    students.set(user.id, {
      id: students.size + 1,
      user_id: user.id,
      registration_number: studentId,
      matricule,
      programme_id: 1,
      academic_year_id: 1,
      specialty: 'SWE',
      level: 1,
      enrollment_date: new Date().toISOString().split('T')[0],
      guardian_name: null,
      guardian_phone: null,
      guardian_email: null,
      guardian_address: null,
    });
    user.studentId = studentId;
    user.matricule = matricule;
    user.program = 'Bachelor in Software Engineering';
    user.level = 1;
    user.specialty = 'SWE';
  }
  
  const token = generateToken(user);
  
  sendResponse(res, 201, {
    success: true,
    message: 'Registration successful. Account pending approval.',
    data: {
      token,
      user: {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar_url: user.avatar_url,
        phone: user.phone,
        status: user.status,
        last_login_at: user.last_login_at,
        studentId: user.studentId,
        matricule: user.matricule,
        program: user.program,
        level: user.level,
        specialty: user.specialty,
      }
    }
  });
}

function handleAuthLogin(req, res, body) {
  const { email, password } = body;
  
  if (!email || !password) {
    return sendResponse(res, 400, { success: false, message: 'Missing required fields' });
  }
  
  const user = users.get(email.toLowerCase());
  
  if (!user || user.password_hash !== 'hashed_' + password) {
    return sendResponse(res, 401, { success: false, message: 'Invalid email or password' });
  }
  
  const token = generateToken(user);
  
  sendResponse(res, 200, {
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar_url: user.avatar_url,
        phone: user.phone,
        status: user.status,
        last_login_at: new Date().toISOString(),
        studentId: user.studentId,
        matricule: user.matricule,
        program: user.program,
        level: user.level,
        specialty: user.specialty,
      }
    }
  });
}

function handleAuthMe(req, res) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return sendResponse(res, 401, { success: false, message: 'Authentication required' });
  }
  
  const token = auth.slice(7);
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const user = Array.from(users.values()).find(u => u.id === payload.user_id);
    
    if (!user) {
      return sendResponse(res, 401, { success: false, message: 'User not found' });
    }
    
    sendResponse(res, 200, {
      success: true,
      data: {
        user: {
          id: user.id,
          uuid: user.uuid,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          avatar_url: user.avatar_url,
          phone: user.phone,
          status: user.status,
          last_login_at: user.last_login_at,
          studentId: user.studentId,
          matricule: user.matricule,
          program: user.program,
          level: user.level,
          specialty: user.specialty,
        }
      }
    });
  } catch {
    sendResponse(res, 401, { success: false, message: 'Invalid token' });
  }
}

function handleAuthLogout(req, res) {
  sendResponse(res, 200, { success: true, message: 'Logged out successfully' });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return sendResponse(res, 204, null);
  }
  
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname.replace('/api', '');
  
  console.log(`${req.method} ${path}`);
  
  const body = await parseBody(req);
  
  if (path === '/auth/register' && req.method === 'POST') {
    return handleAuthRegister(req, res, body);
  }
  
  if (path === '/auth/login' && req.method === 'POST') {
    return handleAuthLogin(req, res, body);
  }
  
  if (path === '/auth/me' && req.method === 'GET') {
    return handleAuthMe(req, res);
  }
  
  if (path === '/auth/logout' && req.method === 'POST') {
    return handleAuthLogout(req, res);
  }
  
  if (path === '/auth/forgot-password' && req.method === 'POST') {
    return sendResponse(res, 200, { success: true, message: 'If the email exists, a reset link has been sent' });
  }
  
  if (path === '/auth/reset-password' && req.method === 'POST') {
    return sendResponse(res, 200, { success: true, message: 'Password reset successful' });
  }
  
  if (path === '/auth/change-password' && req.method === 'POST') {
    return sendResponse(res, 200, { success: true, message: 'Password changed successfully' });
  }
  
  if (path === '/auth/refresh' && req.method === 'POST') {
    return sendResponse(res, 200, { success: true, data: { access_token: 'new-mock-token', refresh_token: 'new-mock-refresh' } });
  }
  
  // Student endpoints
  if (path.startsWith('/students/') && req.method === 'GET') {
    return sendResponse(res, 200, { success: true, data: {} });
  }
  
  // Announcements
  if (path === '/announcements' && req.method === 'GET') {
    return sendResponse(res, 200, { success: true, data: [] });
  }
  
  // Timetable
  if (path === '/timetable' && req.method === 'GET') {
    return sendResponse(res, 200, { success: true, data: [] });
  }
  
  // Courses
  if (path === '/courses/enroll' && req.method === 'POST') {
    return sendResponse(res, 200, { success: true, message: 'Enrolled successfully' });
  }
  
  if (path === '/courses/unenroll' && req.method === 'POST') {
    return sendResponse(res, 200, { success: true, message: 'Unenrolled successfully' });
  }
  
  // Default response for unimplemented endpoints
  sendResponse(res, 200, { success: true, data: [] });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock API server running on http://0.0.0.0:${PORT}`);
  console.log(`API base: http://localhost:${PORT}/api`);
});