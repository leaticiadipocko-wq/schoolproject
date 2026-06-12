// Generates SVG diagrams for the SIARM bachelor project documentation.
// Each diagram is a complete, self-contained SVG written into deliverables/diagrams/.
import fs from 'fs'
import path from 'path'

const OUT = path.resolve(process.cwd(), 'deliverables/diagrams')
fs.mkdirSync(OUT, { recursive: true })

// Shared styles
const STYLES = `
<style>
  .bg { fill: #ffffff; }
  text { font-family: 'Inter', system-ui, sans-serif; }
  .title { font-size: 22px; font-weight: 700; fill: #0f172a; }
  .subtitle { font-size: 12px; fill: #64748b; }
  .box { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; rx: 10; ry: 10; }
  .box-brand { fill: #eff4ff; stroke: #1e3aa0; stroke-width: 2; rx: 10; ry: 10; }
  .box-accent { fill: #fef2f2; stroke: #e63946; stroke-width: 2; rx: 10; ry: 10; }
  .box-ink { fill: #1e3aa0; stroke: #172250; rx: 10; ry: 10; }
  .label { font-size: 13px; font-weight: 600; fill: #1e293b; text-anchor: middle; }
  .label-white { font-size: 13px; font-weight: 600; fill: #ffffff; text-anchor: middle; }
  .label-sm { font-size: 11px; fill: #64748b; text-anchor: middle; }
  .label-sm-white { font-size: 11px; fill: #c7d2fe; text-anchor: middle; }
  .arrow { stroke: #475569; stroke-width: 1.8; fill: none; marker-end: url(#arrow); }
  .arrow-brand { stroke: #1e3aa0; stroke-width: 2; fill: none; marker-end: url(#arrow-brand); }
  .arrow-red { stroke: #e63946; stroke-width: 1.8; fill: none; marker-end: url(#arrow-red); stroke-dasharray: 5,3; }
  .group-label { font-size: 11px; font-weight: 700; fill: #1e3aa0; text-anchor: start; letter-spacing: 1px; }
  .group-box { fill: rgba(30,58,160,0.04); stroke: #1e3aa0; stroke-width: 1; stroke-dasharray: 4,3; rx: 14; ry: 14; }
  .er-attr { font-size: 11px; fill: #334155; }
  .er-key { font-size: 11px; font-weight: 700; fill: #1e3aa0; }
</style>
<defs>
  <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#475569"/></marker>
  <marker id="arrow-brand" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#1e3aa0"/></marker>
  <marker id="arrow-red" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#e63946"/></marker>
</defs>
`

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function box(x, y, w, h, label, sublabel = '', cls = 'box') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${cls}"/>
    <text x="${x + w/2}" y="${y + h/2 - (sublabel ? 6 : -4)}" class="${cls === 'box-ink' ? 'label-white' : 'label'}">${esc(label)}</text>
    ${sublabel ? `<text x="${x + w/2}" y="${y + h/2 + 12}" class="${cls === 'box-ink' ? 'label-sm-white' : 'label-sm'}">${esc(sublabel)}</text>` : ''}`
}

function svgWrapper(w, h, title, subtitle, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
${STYLES}
<rect class="bg" width="${w}" height="${h}"/>
<text x="40" y="38" class="title">${title}</text>
<text x="40" y="58" class="subtitle">${subtitle}</text>
${content}
</svg>`
}

// =====================================================
// 1. System Architecture Diagram (3-tier)
// =====================================================
function architectureDiagram() {
  const W = 1100, H = 720
  let c = ''
  // Group: Presentation
  c += `<rect x="60" y="100" width="980" height="160" class="group-box"/>
  <text x="80" y="125" class="group-label">PRESENTATION LAYER · CLIENT</text>`
  c += box(100, 140, 200, 90, 'React 18 SPA', 'Components + Hooks', 'box-brand')
  c += box(330, 140, 200, 90, 'React Router v6', 'Role-guarded routes', 'box-brand')
  c += box(560, 140, 200, 90, 'Tailwind CSS', 'IUGET Design System', 'box-brand')
  c += box(790, 140, 220, 90, 'Recharts + jsPDF', 'Charts + PDF generation', 'box-brand')

  // Group: Logic
  c += `<rect x="60" y="290" width="980" height="160" class="group-box"/>
  <text x="80" y="315" class="group-label">APPLICATION LOGIC LAYER · CONTEXT</text>`
  c += box(100, 330, 220, 90, 'AuthContext', 'Authentication state', 'box-brand')
  c += box(350, 330, 220, 90, 'DataContext', 'CRUD + persistence', 'box-brand')
  c += box(600, 330, 200, 90, 'Role-Based Guard', 'ProtectedRoute', 'box-brand')
  c += box(830, 330, 180, 90, 'AI Chatbot Logic', 'Rules + Claude API', 'box-brand')

  // Group: Data
  c += `<rect x="60" y="480" width="980" height="170" class="group-box"/>
  <text x="80" y="505" class="group-label">DATA AND SERVICES LAYER · BACKEND</text>`
  c += box(100, 520, 200, 100, 'Firebase Auth', 'Email/password JWT', 'box-ink')
  c += box(330, 520, 200, 100, 'Cloud Firestore', 'NoSQL document DB', 'box-ink')
  c += box(560, 520, 200, 100, 'Firebase Storage', 'PDF & file blobs', 'box-ink')
  c += box(790, 520, 220, 100, 'Anthropic Claude API', 'AI enquiry assistant', 'box-accent')

  // Arrows
  const arrow = (x1, y1, x2, y2, cls = 'arrow') => `<path class="${cls}" d="M${x1},${y1} L${x2},${y2}"/>`
  c += arrow(200, 230, 200, 330)
  c += arrow(430, 230, 430, 330)
  c += arrow(660, 230, 660, 330)
  c += arrow(900, 230, 900, 330)
  c += arrow(200, 420, 200, 520)
  c += arrow(460, 420, 460, 520, 'arrow-brand')
  c += arrow(700, 420, 700, 520)
  c += arrow(900, 420, 900, 520, 'arrow-red')

  return svgWrapper(W, H, 'SIARM — 3-Tier System Architecture',
    'React + Firebase + Anthropic stack with role-based access control', c)
}

// =====================================================
// 2. Entity-Relationship Diagram (ERD)
// =====================================================
function erdDiagram() {
  const W = 1100, H = 760
  let c = ''

  const entity = (x, y, name, attrs) => {
    const h = 30 + attrs.length * 20 + 14
    const w = 220
    let body = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" ry="8" fill="#ffffff" stroke="#1e3aa0" stroke-width="2"/>
      <rect x="${x}" y="${y}" width="${w}" height="30" rx="8" ry="8" fill="#1e3aa0"/>
      <text x="${x + w/2}" y="${y + 20}" class="label-white">${name}</text>`
    attrs.forEach((a, i) => {
      const ay = y + 50 + i * 20
      const cls = a.startsWith('PK') || a.startsWith('FK') ? 'er-key' : 'er-attr'
      body += `<text x="${x + 12}" y="${ay}" class="${cls}">${esc(a)}</text>`
    })
    return { body, w, h, x, y, cx: x + w/2, cy: y + h/2 }
  }

  // Entities
  const users = entity(60, 100, 'User',
    ['PK uid : string', 'email : string', 'name : string', 'role : enum', 'avatar : url', 'createdAt : timestamp'])
  const students = entity(60, 360, 'Student',
    ['PK studentId : string', 'FK uid → User', 'program : string', 'level : int', 'cgpa : float'])
  const lecturers = entity(60, 580, 'Lecturer',
    ['PK lecturerId : string', 'FK uid → User', 'department : string', 'title : string'])

  const courses = entity(420, 100, 'Course',
    ['PK code : string', 'name : string', 'credits : int', 'level : int', 'FK lecturerId → Lecturer'])
  const enrollment = entity(420, 320, 'Enrollment',
    ['PK id : string', 'FK studentId → Student', 'FK courseCode → Course', 'semester : string', 'status : enum'])
  const attendance = entity(420, 520, 'Attendance',
    ['PK id : string', 'FK enrollmentId → Enrollment', 'date : date', 'present : bool', 'markedBy : Lecturer'])

  const results = entity(780, 100, 'Result',
    ['PK id : string', 'FK enrollmentId → Enrollment', 'ca : int (0-30)', 'exam : int (0-70)', 'total : int', 'grade : string', 'gpa : float'])
  const announcements = entity(780, 340, 'Announcement',
    ['PK id : string', 'title : string', 'body : text', 'audience : enum', 'pinned : bool', 'FK authorUid → User', 'createdAt : ts'])
  const timetable = entity(780, 580, 'TimetableSlot',
    ['PK id : string', 'FK courseCode → Course', 'day : enum', 'time : string', 'room : string'])

  c += users.body + students.body + lecturers.body
  c += courses.body + enrollment.body + attendance.body
  c += results.body + announcements.body + timetable.body

  // Relations (with cardinality labels)
  const line = (x1, y1, x2, y2, label) => {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
    return `<path d="M${x1},${y1} L${x2},${y2}" stroke="#475569" stroke-width="1.5" fill="none"/>
      <text x="${mx}" y="${my - 4}" font-size="10" fill="#1e3aa0" font-weight="700" text-anchor="middle">${label}</text>`
  }
  c += line(280, users.y + users.h/2, 280, students.y, '1 : 1')
  c += line(170, students.y + students.h, 170, lecturers.y, '')
  c += line(280, students.y + students.h/2, 420, enrollment.y + 60, '1 : N')
  c += line(280, courses.y + courses.h - 30, 220, students.y + 30, '') // visual link
  c += line(530, courses.y + courses.h, 530, enrollment.y, '1 : N')
  c += line(530, enrollment.y + enrollment.h, 530, attendance.y, '1 : N')
  c += line(640, enrollment.y + 50, 780, results.y + 60, '1 : 1')
  c += line(640, lecturers.y + 30, 780, announcements.y + announcements.h, 'M : N')
  c += line(640, courses.y + courses.h - 30, 780, timetable.y + 50, '1 : N')

  return svgWrapper(W, H, 'SIARM — Entity Relationship Diagram',
    '9 core entities · enforced via Firestore document references and security rules', c)
}

// =====================================================
// 3. Use Case Diagram
// =====================================================
function useCaseDiagram() {
  const W = 1100, H = 760
  let c = ''
  // System boundary
  c += `<rect x="280" y="80" width="540" height="640" fill="rgba(30,58,160,0.04)" stroke="#1e3aa0" stroke-width="2" stroke-dasharray="6,4" rx="20" ry="20"/>
  <text x="550" y="110" class="label" font-size="14">SIARM System Boundary</text>`

  // Actors (stick figures simplified to circles + label)
  const actor = (x, y, label) => `
    <circle cx="${x}" cy="${y}" r="14" fill="none" stroke="#1e3aa0" stroke-width="2"/>
    <path d="M${x},${y + 14} L${x},${y + 40} M${x - 14},${y + 22} L${x + 14},${y + 22} M${x},${y + 40} L${x - 12},${y + 60} M${x},${y + 40} L${x + 12},${y + 60}" stroke="#1e3aa0" stroke-width="2" fill="none"/>
    <text x="${x}" y="${y + 78}" class="label">${label}</text>`

  c += actor(80, 200, 'Student')
  c += actor(80, 380, 'Lecturer')
  c += actor(1020, 280, 'Staff')
  c += actor(1020, 460, 'Admin')

  // Use cases (ellipses)
  const uc = (x, y, label, cls = 'box-brand') => `
    <ellipse cx="${x}" cy="${y}" rx="100" ry="22" fill="${cls === 'box-brand' ? '#eff4ff' : '#fef2f2'}" stroke="${cls === 'box-brand' ? '#1e3aa0' : '#e63946'}" stroke-width="1.5"/>
    <text x="${x}" y="${y + 4}" class="label" font-size="12">${label}</text>`

  c += uc(420, 150, 'Login / Register')
  c += uc(420, 210, 'View Timetable')
  c += uc(420, 270, 'View Results')
  c += uc(420, 330, 'View Attendance')
  c += uc(680, 150, 'Read Announcements')
  c += uc(680, 210, 'Ask AI Chatbot', 'box-accent')
  c += uc(680, 270, 'Enroll in Course')
  c += uc(680, 330, 'Download Transcript')

  c += uc(420, 410, 'Mark Attendance')
  c += uc(420, 470, 'Enter Grades')
  c += uc(680, 410, 'Manage Class')
  c += uc(680, 470, 'Publish Announcement')

  c += uc(420, 540, 'Manage Users')
  c += uc(420, 600, 'Build Timetable')
  c += uc(680, 540, 'View AI Analytics', 'box-accent')
  c += uc(680, 600, 'Predict Enrollment', 'box-accent')
  c += uc(550, 660, 'Configure Institution Settings')

  // Actor-to-usecase connections (key ones only)
  const link = (x1, y1, x2, y2) => `<path d="M${x1},${y1} L${x2},${y2}" stroke="#64748b" stroke-width="1.3" fill="none"/>`
  c += link(100, 210, 320, 210)
  c += link(100, 230, 320, 270)
  c += link(100, 250, 320, 330)
  c += link(100, 270, 580, 210)
  c += link(100, 290, 580, 270)
  c += link(100, 310, 580, 330)
  c += link(100, 200, 320, 150)
  // Lecturer
  c += link(100, 390, 320, 410)
  c += link(100, 410, 320, 470)
  c += link(100, 430, 580, 410)
  c += link(100, 450, 580, 470)
  c += link(100, 380, 320, 150)
  // Staff
  c += link(1000, 290, 780, 470)
  c += link(1000, 310, 780, 540)
  c += link(1000, 280, 520, 540)
  // Admin
  c += link(1000, 470, 780, 540)
  c += link(1000, 490, 780, 600)
  c += link(1000, 460, 520, 600)
  c += link(1000, 450, 650, 660)

  return svgWrapper(W, H, 'SIARM — Use Case Diagram',
    'Four actors and 17 use cases grouped by SIARM module boundaries', c)
}

// =====================================================
// 4. Sequence Diagram — Student Login Flow
// =====================================================
function sequenceDiagram() {
  const W = 1100, H = 700
  let c = ''
  // Lifelines
  const lanes = [
    { x: 130, label: 'Student' },
    { x: 330, label: 'Login Page' },
    { x: 530, label: 'AuthContext' },
    { x: 730, label: 'Firebase Auth' },
    { x: 930, label: 'Firestore' },
  ]
  lanes.forEach((l) => {
    c += `<rect x="${l.x - 70}" y="100" width="140" height="40" fill="#1e3aa0" rx="6"/>
      <text x="${l.x}" y="125" class="label-white">${l.label}</text>
      <line x1="${l.x}" y1="140" x2="${l.x}" y2="640" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3"/>`
  })

  const msg = (from, to, y, text, dashed = false) => {
    const fromX = lanes[from].x, toX = lanes[to].x
    const dash = dashed ? 'stroke-dasharray="5,3"' : ''
    return `<path d="M${fromX},${y} L${toX},${y}" stroke="${dashed ? '#94a3b8' : '#1e3aa0'}" stroke-width="1.8" fill="none" marker-end="url(#arrow${dashed ? '' : '-brand'})" ${dash}/>
      <text x="${(fromX + toX)/2}" y="${y - 6}" font-size="11" fill="#1e293b" text-anchor="middle" font-weight="600">${text}</text>`
  }

  const activation = (lane, y1, y2) => `<rect x="${lanes[lane].x - 6}" y="${y1}" width="12" height="${y2 - y1}" fill="#1e3aa0" opacity="0.2"/>`

  c += activation(1, 180, 600)
  c += activation(2, 220, 580)
  c += activation(3, 280, 460)
  c += activation(4, 380, 540)

  c += msg(0, 1, 180, '1. Enter email + password')
  c += msg(1, 2, 220, '2. login(email, password)')
  c += msg(2, 3, 280, '3. signInWithEmailAndPassword()')
  c += msg(3, 2, 340, '4. JWT credentials', true)
  c += msg(2, 4, 380, '5. getDoc(users/uid)')
  c += msg(4, 2, 440, '6. user profile + role', true)
  c += msg(2, 1, 480, '7. user object', true)
  c += msg(1, 0, 540, '8. Redirect to /role-home', true)
  c += msg(1, 0, 600, '9. Render dashboard', true)

  return svgWrapper(W, H, 'SIARM — Sequence Diagram (Login Flow)',
    'Student authenticates → AuthContext checks Firebase → Firestore loads profile → Routed to dashboard', c)
}

// =====================================================
// 5. Component Diagram
// =====================================================
function componentDiagram() {
  const W = 1100, H = 720
  let c = ''

  const comp = (x, y, w, h, name, sub) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ffffff" stroke="#1e3aa0" stroke-width="1.5" rx="6"/>
    <rect x="${x - 6}" y="${y + 14}" width="14" height="8" fill="#ffffff" stroke="#1e3aa0" stroke-width="1.5"/>
    <rect x="${x - 6}" y="${y + 32}" width="14" height="8" fill="#ffffff" stroke="#1e3aa0" stroke-width="1.5"/>
    <text x="${x + w/2}" y="${y + h/2 - 4}" class="label">${name}</text>
    <text x="${x + w/2}" y="${y + h/2 + 12}" class="label-sm">${sub}</text>`

  // Pages
  c += `<text x="80" y="115" class="group-label">PAGES (22)</text>`
  c += comp(80, 130, 180, 60, 'Landing', 'Public marketing')
  c += comp(80, 210, 180, 60, 'Login', 'Auth + role chips')
  c += comp(80, 290, 180, 60, 'Register', 'Sign up + role pick')
  c += comp(80, 370, 180, 60, 'Student/*', '9 pages')
  c += comp(80, 450, 180, 60, 'Lecturer/*', '4 pages')
  c += comp(80, 530, 180, 60, 'Admin/*', '7 pages')

  // Layout components
  c += `<text x="320" y="115" class="group-label">LAYOUT</text>`
  c += comp(320, 130, 180, 60, 'DashboardLayout', 'Outlet wrapper')
  c += comp(320, 210, 180, 60, 'Sidebar', 'Role-aware nav')
  c += comp(320, 290, 180, 60, 'Navbar', 'Search + notif')
  c += comp(320, 370, 180, 60, 'Logo', 'IUGET branding')
  c += comp(320, 450, 180, 60, 'ProtectedRoute', 'RBAC guard')

  // UI
  c += `<text x="560" y="115" class="group-label">UI ATOMS</text>`
  c += comp(560, 130, 180, 60, 'StatCard', 'KPI display')
  c += comp(560, 210, 180, 60, 'PageHeader', 'Title + actions')
  c += comp(560, 290, 180, 60, 'EmptyState', 'Zero data')
  c += comp(560, 370, 180, 60, 'Toast', 'Notifications')

  // Context
  c += `<text x="800" y="115" class="group-label">CONTEXT</text>`
  c += comp(800, 130, 200, 80, 'AuthContext', 'login/register/logout')
  c += comp(800, 230, 200, 80, 'DataContext', 'CRUD + persistence')

  // Libs
  c += `<text x="800" y="345" class="group-label">LIBRARIES</text>`
  c += comp(800, 360, 200, 50, 'roles.js', 'Hierarchy helpers')
  c += comp(800, 420, 200, 50, 'firebase.js', 'SDK init')
  c += comp(800, 480, 200, 50, 'navItems.js', 'Sidebar config')
  c += comp(800, 540, 200, 50, 'mockData.js', 'Demo dataset')

  // Connections
  const link = (x1, y1, x2, y2) => `<path d="M${x1},${y1} L${x2},${y2}" stroke="#94a3b8" stroke-width="1.2" fill="none" stroke-dasharray="4,3"/>`
  c += link(260, 405, 320, 160) // pages → layout
  c += link(260, 405, 800, 270) // pages → context
  c += link(500, 270, 560, 250) // layout → ui
  c += link(500, 320, 800, 170) // layout → context

  return svgWrapper(W, H, 'SIARM — Component Diagram',
    'React component composition across pages, layout, UI atoms, contexts, and libraries', c)
}

// =====================================================
// 6. Data Flow Diagram (DFD level 1)
// =====================================================
function dataFlowDiagram() {
  const W = 1100, H = 700
  let c = ''

  // External entities
  const ext = (x, y, w, h, label) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#1e3aa0" rx="8"/>
    <text x="${x + w/2}" y="${y + h/2 + 4}" class="label-white">${label}</text>`

  // Processes (circles)
  const proc = (x, y, label, num) => `
    <circle cx="${x}" cy="${y}" r="56" fill="#eff4ff" stroke="#1e3aa0" stroke-width="2"/>
    <text x="${x}" y="${y - 5}" class="label-sm">${num}</text>
    <text x="${x}" y="${y + 12}" class="label" font-size="12">${label}</text>`

  // Data stores (open rectangles)
  const store = (x, y, w, label, id) => `
    <line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="#1e3aa0" stroke-width="2"/>
    <line x1="${x}" y1="${y + 40}" x2="${x + w}" y2="${y + 40}" stroke="#1e3aa0" stroke-width="2"/>
    <text x="${x + 10}" y="${y + 17}" class="label-sm" text-anchor="start">${id}</text>
    <text x="${x + 10}" y="${y + 32}" class="label" text-anchor="start" font-size="12">${label}</text>`

  // External
  c += ext(40, 150, 120, 50, 'Student')
  c += ext(40, 280, 120, 50, 'Lecturer')
  c += ext(40, 410, 120, 50, 'Admin')
  c += ext(940, 150, 120, 50, 'AI / Claude')
  c += ext(940, 280, 120, 50, 'Email')

  // Processes
  c += proc(280, 175, 'Auth', '1.0')
  c += proc(280, 305, 'Attend.', '2.0')
  c += proc(280, 435, 'Manage', '3.0')
  c += proc(550, 175, 'Results', '4.0')
  c += proc(550, 305, 'Announce', '5.0')
  c += proc(550, 435, 'Analytics', '6.0')
  c += proc(810, 305, 'Chatbot', '7.0')

  // Data stores
  c += store(700, 580, 180, 'D1  Users', 'D1')
  c += store(900, 580, 180, 'D2  Courses', 'D2')
  c += store(500, 580, 180, 'D3  Attendance', 'D3')
  c += store(300, 580, 180, 'D4  Results', 'D4')
  c += store(100, 580, 180, 'D5  Announcements', 'D5')

  const flow = (x1, y1, x2, y2, label = '') => `
    <path d="M${x1},${y1} L${x2},${y2}" stroke="#475569" stroke-width="1.5" fill="none" marker-end="url(#arrow)"/>
    ${label ? `<text x="${(x1+x2)/2}" y="${(y1+y2)/2 - 4}" font-size="10" fill="#1e3aa0" font-weight="600" text-anchor="middle">${label}</text>` : ''}`

  // External to process
  c += flow(160, 175, 224, 175, 'credentials')
  c += flow(160, 305, 224, 305, 'roll-call')
  c += flow(160, 435, 224, 435, 'admin ops')
  c += flow(940, 175, 866, 305, 'AI reply')
  c += flow(550, 270, 940, 200, 'enquiry')

  // Process to store
  c += flow(280, 230, 280, 580, '')
  c += flow(280, 360, 380, 580, '')
  c += flow(550, 230, 550, 580, '')
  c += flow(550, 360, 600, 580, '')
  c += flow(550, 490, 700, 580, '')

  return svgWrapper(W, H, 'SIARM — Data Flow Diagram (Level 1)',
    'Seven processes, five data stores, and five external entities', c)
}

// =====================================================
// 7. Deployment Diagram
// =====================================================
function deploymentDiagram() {
  const W = 1100, H = 600
  let c = ''
  const node = (x, y, w, h, label, sub, color = '#1e3aa0') => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${color}" stroke-width="2" rx="10"/>
    <rect x="${x + 8}" y="${y + 8}" width="${w - 16}" height="22" fill="${color}" rx="4"/>
    <text x="${x + w/2}" y="${y + 24}" class="label-white" font-size="11">${label}</text>
    <text x="${x + w/2}" y="${y + h - 12}" class="label-sm">${sub}</text>`
  const ic = (x, y, w, h, label, sub) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#eff4ff" stroke="#1e3aa0" rx="6"/>
    <text x="${x + w/2}" y="${y + h/2 - 4}" class="label" font-size="11">${label}</text>
    <text x="${x + w/2}" y="${y + h/2 + 12}" class="label-sm">${sub}</text>`

  c += node(40, 110, 280, 320, '« device »   User Browser', 'Chrome / Firefox / Mobile', '#1e3aa0')
  c += ic(60, 160, 240, 60, 'React 18 SPA', 'Tailwind UI')
  c += ic(60, 240, 240, 60, 'Service Worker', 'Offline caching')
  c += ic(60, 320, 240, 60, 'localStorage', 'Demo data + theme')

  c += node(390, 110, 320, 320, '« cloud »   Vercel / Netlify CDN', 'Edge-deployed static assets', '#1e3aa0')
  c += ic(410, 160, 280, 60, 'Static SIARM Bundle', 'HTML + CSS + JS (~1.6 MB)')
  c += ic(410, 240, 280, 60, 'Public Assets', 'IUGET logo, fonts, icons')

  c += node(770, 110, 290, 320, '« cloud »   Firebase + Anthropic', 'Backend-as-a-service', '#e63946')
  c += ic(790, 160, 250, 50, 'Firebase Auth', 'JWT + email/password')
  c += ic(790, 230, 250, 50, 'Cloud Firestore', 'Multi-region NoSQL DB')
  c += ic(790, 300, 250, 50, 'Firebase Storage', 'PDF + media blobs')
  c += ic(790, 370, 250, 40, 'Claude AI API', 'sk-ant-*')

  const link = (x1, y1, x2, y2, label) => `
    <path d="M${x1},${y1} L${x2},${y2}" stroke="#1e3aa0" stroke-width="1.8" fill="none"/>
    <text x="${(x1+x2)/2}" y="${(y1+y2)/2 - 6}" font-size="10" fill="#1e3aa0" text-anchor="middle" font-weight="600">${label}</text>`
  c += link(320, 270, 390, 270, 'HTTPS')
  c += link(710, 200, 770, 200, 'WSS / REST')
  c += link(710, 280, 770, 280, 'HTTPS / SDK')

  return svgWrapper(W, H, 'SIARM — Deployment Diagram',
    'Three deployment nodes: client browser, static CDN, and managed BaaS', c)
}

// =====================================================
// Write all
// =====================================================
const diagrams = {
  '01-architecture.svg':  architectureDiagram(),
  '02-erd.svg':           erdDiagram(),
  '03-use-case.svg':      useCaseDiagram(),
  '04-sequence-login.svg': sequenceDiagram(),
  '05-component.svg':     componentDiagram(),
  '06-data-flow.svg':     dataFlowDiagram(),
  '07-deployment.svg':    deploymentDiagram(),
}

for (const [name, content] of Object.entries(diagrams)) {
  fs.writeFileSync(path.join(OUT, name), content)
  console.log(`✓ ${name}`)
}

console.log(`\nAll diagrams written to ${OUT}`)
