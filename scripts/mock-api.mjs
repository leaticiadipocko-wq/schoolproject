// Mock API Server for SIARM Demo Mode
// Handles auth endpoints when PHP backend is not available

import http from 'http';
import { URL } from 'url';
import crypto from 'crypto';

const PORT = 8000;

// In-memory user store
const users = new Map();
const tokens = new Map();

function generateToken(user) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    user_id: user.id,
    uuid: user.uuid,
    email: user.email,
    role: user.role,
    name: user.full_name,
    exp: Math.floor(Date.now() / 1000) + 3600
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', 'siarm-jwt-secret-key-2025').update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

function generateRefreshToken() {
  return crypto.randomBytes(32).toString('hex');
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

function sendJson(res, status, data) {
  res.writeHead(status, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true'
  });
  res.end(JSON.stringify(data));
}

function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  try {
    const [, payload] = token.split('.');
    return JSON.parse(Buffer.from(payload, 'base64url').toString());
  } catch {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {});
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname.replace('/api', '');
  const segments = path.split('/').filter(Boolean);
  
  console.log(`${new Date().toISOString()} ${req.method} ${path}`);

  // Auth endpoints
  if (segments[0] === 'auth') {
    const action = segments[1];
    
    // POST /api/auth/register
    if (req.method === 'POST' && action === 'register') {
      const body = await parseBody(req);
      const { email, password, full_name, role, phone } = body;
      
      if (!email || !password || !full_name || !role) {
        return sendJson(res, 400, { success: false, message: 'Missing required fields' });
      }
      
      if (password.length < 8) {
        return sendJson(res, 400, { success: false, message: 'Password must be at least 8 characters' });
      }
      
      const normalizedEmail = email.toLowerCase().trim();
      if (users.has(normalizedEmail)) {
        return sendJson(res, 409, { success: false, message: 'Email already in use' });
      }
      
      const id = users.size + 1;
      const uuid = crypto.randomUUID();
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex'); // Demo only
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(full_name)}`;
      
      const user = {
        id,
        uuid,
        email: normalizedEmail,
        password_hash: passwordHash,
        full_name,
        role,
        avatar_url: avatarUrl,
        phone: phone || null,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      users.set(normalizedEmail, user);
      
      // Create role-specific record
      if (role === 'student') {
        const regNumber = `REG/${new Date().getFullYear()}/${String(users.size).padStart(5, '0')}`;
        const matricule = `IUGET/${new Date().getFullYear()}/SWE/${String(users.size).padStart(4, '0')}`;
        user.registration_number = regNumber;
        user.matricule = matricule;
        user.programme_id = 1;
        user.level = 1;
        user.specialty = 'SWE';
        user.studentId = matricule;
        user.program = 'Software Engineering';
      }
      
      const token = generateToken(user);
      const refresh_token = generateRefreshToken();
      tokens.set(refresh_token, { userId: id, email: normalizedEmail, expires: Date.now() + 30 * 24 * 60 * 60 * 1000 });
      
      return sendJson(res, 201, {
        success: true,
        message: 'Registration successful. Account pending approval.',
        data: {
          token,
          refresh_token,
          user: {
            id: user.id,
            uuid: user.uuid,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            avatar_url: user.avatar_url,
            status: user.status,
            profile: user
          }
        }
      });
    }
    
    // POST /api/auth/login
    if (req.method === 'POST' && action === 'login') {
      const body = await parseBody(req);
      const { email, password } = body;
      
      if (!email || !password) {
        return sendJson(res, 400, { success: false, message: 'Missing required fields: email, password' });
      }
      
      const normalizedEmail = email.toLowerCase().trim();
      const user = users.get(normalizedEmail);
      
      if (!user) {
        return sendJson(res, 401, { success: false, message: 'Invalid email or password' });
      }
      
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
      if (user.password_hash !== passwordHash) {
        return sendJson(res, 401, { success: false, message: 'Invalid email or password' });
      }
      
      user.status = 'active';
      user.last_login_at = new Date().toISOString();
      users.set(normalizedEmail, user);
      
      const token = generateToken(user);
      const refresh_token = generateRefreshToken();
      tokens.set(refresh_token, { userId: user.id, email: normalizedEmail, expires: Date.now() + 30 * 24 * 60 * 60 * 1000 });
      
      return sendJson(res, 200, {
        success: true,
        message: 'Login successful',
        data: {
          token,
          refresh_token,
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
            profile: user
          }
        }
      });
    }
    
    // POST /api/auth/logout
    if (req.method === 'POST' && action === 'logout') {
      return sendJson(res, 200, { success: true, message: 'Logged out successfully' });
    }
    
    // GET /api/auth/me
    if (req.method === 'GET' && action === 'me') {
      const userData = verifyToken(req.headers.authorization);
      if (!userData) {
        return sendJson(res, 401, { success: false, message: 'Authentication required' });
      }
      
      const user = users.get(userData.email);
      if (!user) {
        return sendJson(res, 404, { success: false, message: 'User not found' });
      }
      
      return sendJson(res, 200, {
        success: true,
        data: {
          user: {
            ...user,
            profile: user
          }
        }
      });
    }
    
    // POST /api/auth/forgot-password
    if (req.method === 'POST' && action === 'forgot-password') {
      const body = await parseBody(req);
      const { email } = body;
      
      if (!email) {
        return sendJson(res, 400, { success: false, message: 'Email is required' });
      }
      
      // Always return success to prevent email enumeration
      return sendJson(res, 200, { 
        success: true, 
        message: 'If the email exists, a reset link has been sent' 
      });
    }
    
    // POST /api/auth/reset-password
    if (req.method === 'POST' && action === 'reset-password') {
      const body = await parseBody(req);
      const { token, password, password_confirm } = body;
      
      if (!token || !password || !password_confirm) {
        return sendJson(res, 400, { success: false, message: 'Missing required fields' });
      }
      
      if (password !== password_confirm) {
        return sendJson(res, 400, { success: false, message: 'Passwords do not match' });
      }
      
      if (password.length < 8) {
        return sendJson(res, 400, { success: false, message: 'Password must be at least 8 characters' });
      }
      
      return sendJson(res, 200, { success: true, message: 'Password reset successful' });
    }
    
    // POST /api/auth/change-password
    if (req.method === 'POST' && action === 'change-password') {
      const userData = verifyToken(req.headers.authorization);
      if (!userData) {
        return sendJson(res, 401, { success: false, message: 'Authentication required' });
      }
      
      const body = await parseBody(req);
      const { current_password, new_password } = body;
      
      const user = users.get(userData.email);
      if (!user) {
        return sendJson(res, 404, { success: false, message: 'User not found' });
      }
      
      const currentHash = crypto.createHash('sha256').update(current_password).digest('hex');
      if (user.password_hash !== currentHash) {
        return sendJson(res, 401, { success: false, message: 'Current password is incorrect' });
      }
      
      if (new_password.length < 8) {
        return sendJson(res, 400, { success: false, message: 'Password must be at least 8 characters' });
      }
      
      user.password_hash = crypto.createHash('sha256').update(new_password).digest('hex');
      users.set(userData.email, user);
      
      return sendJson(res, 200, { success: true, message: 'Password changed successfully' });
    }
  }
  
  // Users endpoints
  if (segments[0] === 'users') {
    const userData = verifyToken(req.headers.authorization);
    if (!userData) {
      return sendJson(res, 401, { success: false, message: 'Authentication required' });
    }
    
    // Only admin/staff can access user management
    const user = users.get(userData.email);
    if (!user || !['admin', 'staff'].includes(user.role)) {
      return sendJson(res, 403, { success: false, message: 'Insufficient permissions' });
    }
    
    // GET /api/users
    if (req.method === 'GET' && !segments[1]) {
      const userList = Array.from(users.values()).map(u => ({
        id: u.id,
        uuid: u.uuid,
        email: u.email,
        full_name: u.full_name,
        role: u.role,
        avatar_url: u.avatar_url,
        phone: u.phone,
        status: u.status,
        created_at: u.created_at
      }));
      return sendJson(res, 200, { success: true, data: userList });
    }
  }
  
  // Announcements endpoint
  if (segments[0] === 'announcements') {
    const announcements = [
      { id: 1, title: 'Welcome to SIARM', body: 'Welcome to the new academic year!', author: 'Admin', createdAt: new Date().toISOString(), pinned: true },
      { id: 2, title: 'Exam Schedule', body: 'Final exams start next week.', author: 'Registrar', createdAt: new Date(Date.now() - 86400000).toISOString(), pinned: false },
    ];
    
    if (req.method === 'GET') {
      return sendJson(res, 200, { success: true, data: announcements });
    }
  }
  
  // Timetable endpoint
  if (segments[0] === 'timetable') {
    const timetable = [
      { id: 1, day: 'Monday', time: '08:00 - 10:00', course: 'Mathematics', room: 'A101', lecturer: 'Dr. Smith', specialty: 'SWE' },
      { id: 2, day: 'Monday', time: '10:30 - 12:30', course: 'Physics', room: 'B202', lecturer: 'Dr. Johnson', specialty: 'SWE' },
      { id: 3, day: 'Tuesday', time: '08:00 - 10:00', course: 'Programming', room: 'C303', lecturer: 'Prof. Williams', specialty: 'SWE' },
      { id: 4, day: 'Wednesday', time: '14:00 - 16:00', course: 'Database Systems', room: 'D404', lecturer: 'Dr. Brown', specialty: 'SWE' },
      { id: 5, day: 'Thursday', time: '10:30 - 12:30', course: 'Web Development', room: 'E505', lecturer: 'Dr. Davis', specialty: 'SWE' },
      { id: 6, day: 'Friday', time: '08:00 - 10:00', course: 'Software Engineering', room: 'F606', lecturer: 'Dr. Wilson', specialty: 'SWE' },
    ];
    return sendJson(res, 200, { success: true, data: timetable });
  }
  
  // Default 404
  sendJson(res, 404, { success: false, message: `Endpoint not found: ${req.method} ${path}` });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock API server running on http://0.0.0.0:${PORT}`);
  console.log(`Endpoints available:`);
  console.log(`  POST /api/auth/register`);
  console.log(`  POST /api/auth/login`);
  console.log(`  POST /api/auth/logout`);
  console.log(`  GET  /api/auth/me`);
  console.log(`  POST /api/auth/forgot-password`);
  console.log(`  POST /api/auth/reset-password`);
  console.log(`  POST /api/auth/change-password`);
  console.log(`  GET  /api/users`);
  console.log(`  GET  /api/announcements`);
  console.log(`  GET  /api/timetable`);
});