// Generates the SIARM defence PowerPoint.
// 22 slides covering cover, problem, objectives, methodology, design,
// implementation, demo, testing, conclusion, future work, Q&A.
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pptxgen = require('pptxgenjs')

const DIAGRAM_DIR = path.resolve(process.cwd(), 'deliverables/diagrams')
const BRAND_DIR   = path.resolve(process.cwd(), 'public/brand')
const OUT_FILE    = path.resolve(process.cwd(), 'deliverables/SIARM-Defense.pptx')

const NAVY = '1E3AA0'
const RED  = 'E63946'
const GRAY = '64748B'
const INK  = '1E293B'
const BG   = 'F8FAFC'
const LIGHT = 'EFF4FF'

const pres = new pptxgen()
pres.author = 'James Murdza'
pres.company = 'IUGET Bonaberi'
pres.title = 'SIARM — Smart Institution Academic Resource Management'
pres.layout = 'LAYOUT_WIDE'   // 13.33 x 7.5 inches

// ===== Master slide / branding =====
pres.defineSlideMaster({
  title: 'SIARM_MASTER',
  background: { color: BG },
  objects: [
    // Footer band
    { rect: { x: 0, y: 7.1, w: 13.33, h: 0.4, fill: { color: NAVY } } },
    { text: { text: 'SIARM · Smart Institution Academic Resource Management',
              options: { x: 0.4, y: 7.13, w: 8, h: 0.34, fontSize: 10, color: 'FFFFFF', fontFace: 'Calibri' } } },
    { text: { text: 'IUGET Bonaberi · 2026',
              options: { x: 8.5, y: 7.13, w: 4.5, h: 0.34, fontSize: 10, color: 'FFFFFF', fontFace: 'Calibri', align: 'right' } } },
    // Top accent bar
    { rect: { x: 0, y: 0, w: 13.33, h: 0.15, fill: { color: RED } } },
  ],
  slideNumber: { x: 12.7, y: 7.15, w: 0.5, h: 0.3, fontSize: 10, color: 'FFFFFF', fontFace: 'Calibri', align: 'right' },
})

// ===== Helpers =====
function title(slide, text, sub = '') {
  slide.addText(text, {
    x: 0.5, y: 0.4, w: 12.3, h: 0.7,
    fontSize: 32, bold: true, color: NAVY, fontFace: 'Calibri',
  })
  if (sub) {
    slide.addText(sub, {
      x: 0.5, y: 1.05, w: 12.3, h: 0.4,
      fontSize: 16, color: RED, italic: true, fontFace: 'Calibri',
    })
  }
}

function bullets(slide, items, opts = {}) {
  const {
    x = 0.6, y = 1.7, w = 12.1, h = 5.2, fontSize = 18, color = INK,
  } = opts
  slide.addText(
    items.map((t) => ({ text: t, options: { bullet: { type: 'bullet' }, breakLine: true } })),
    { x, y, w, h, fontSize, color, fontFace: 'Calibri', valign: 'top', paraSpaceAfter: 8 }
  )
}

function image(slide, filename, x, y, w, h) {
  const fp = path.join(DIAGRAM_DIR, filename)
  if (!fs.existsSync(fp)) return
  slide.addImage({ path: fp, x, y, w, h })
}

function shape(slide, x, y, w, h, fill, text, fontSize = 14, color = 'FFFFFF') {
  slide.addShape('roundRect', {
    x, y, w, h, fill: { color: fill }, line: { type: 'none' }, rectRadius: 0.1,
  })
  slide.addText(text, {
    x, y, w, h, fontSize, color, bold: true, align: 'center', valign: 'middle', fontFace: 'Calibri',
  })
}

// ===== Slide 1: Cover =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  s.background = { color: NAVY }
  // Override master visuals for cover
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: NAVY }, line: { type: 'none' } })
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.15, fill: { color: RED }, line: { type: 'none' } })

  if (fs.existsSync(path.join(BRAND_DIR, 'iuget-logo-white.png'))) {
    s.addImage({ path: path.join(BRAND_DIR, 'iuget-logo-white.png'), x: 0.5, y: 0.4, w: 1.4, h: 1.4 })
  }
  s.addText('IUGET BONABERI', { x: 2.1, y: 0.6, w: 9, h: 0.5, fontSize: 16, color: 'FFFFFF', bold: true, fontFace: 'Calibri', charSpacing: 4 })
  s.addText('« Bien choisir c\'est déjà réussir »', { x: 2.1, y: 1.0, w: 9, h: 0.4, fontSize: 14, color: 'C7D2FE', italic: true, fontFace: 'Calibri' })

  s.addText('SIARM', { x: 0.5, y: 2.6, w: 12.3, h: 1.6, fontSize: 96, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })
  s.addText('Smart Institution Academic Resource Management', { x: 0.5, y: 4.0, w: 12.3, h: 0.6, fontSize: 26, color: 'C7D2FE', align: 'center', fontFace: 'Calibri' })
  s.addText('A unified AI-augmented platform for private universities', { x: 0.5, y: 4.6, w: 12.3, h: 0.4, fontSize: 16, italic: true, color: 'A5B4FC', align: 'center', fontFace: 'Calibri' })

  s.addText('Bachelor Defense — Department of Software Engineering', { x: 0.5, y: 5.6, w: 12.3, h: 0.4, fontSize: 14, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })
  s.addText('Presented by James Murdza  ·  Level-3 SWE  ·  Academic Year 2025–2026', { x: 0.5, y: 6.0, w: 12.3, h: 0.4, fontSize: 14, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })
}

// ===== Slide 2: Agenda =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'Agenda', 'What we will cover in the next 25 minutes')
  bullets(s, [
    '1.   Problem context — why IUGET needs a unified academic OS',
    '2.   Objectives — six concrete deliverables',
    '3.   Methodology — agile, design-science approach',
    '4.   System analysis & design — actors, use cases, ERD, architecture',
    '5.   Implementation — React + Firebase + Anthropic stack',
    '6.   Live demo — walk-through of all 15 modules',
    '7.   Testing & validation — 18 functional test cases',
    '8.   Results, limitations, future work',
    '9.   Q&A',
  ], { fontSize: 20, y: 1.8 })
}

// ===== Slide 3: Problem =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'The Problem', 'Six recurring pains in private universities')
  // Two-column problem cards
  const items = [
    ['Fragmented systems', 'Attendance, grades, fees, timetables live in different tools'],
    ['Manual processes', 'Paper roll-call, hand-written grade sheets, printed transcripts'],
    ['Limited insight', 'Leadership has no real-time view of retention or risk'],
    ['Connectivity constraints', 'Students operate in low-bandwidth environments'],
    ['No personalisation', 'Generic course advice regardless of academic history'],
    ['No 24/7 support', 'Enquiries only answered during office hours'],
  ]
  items.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2)
    const x = 0.6 + col * 6.2, y = 1.8 + row * 1.7
    shape(s, x, y, 5.9, 0.5, NAVY, it[0], 14, 'FFFFFF')
    s.addText(it[1], { x, y: y + 0.55, w: 5.9, h: 0.9, fontSize: 14, color: INK, fontFace: 'Calibri', valign: 'top' })
  })
}

// ===== Slide 4: Objectives =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'Objectives', 'One general goal, six specific deliverables')
  s.addText('General Objective', { x: 0.6, y: 1.5, w: 12, h: 0.4, fontSize: 18, bold: true, color: RED, fontFace: 'Calibri' })
  s.addText('Design, build, and validate a unified AI-augmented academic platform — SIARM — tailored for private universities in Cameroon, using IUGET Bonabéri as the reference institution.',
    { x: 0.6, y: 1.95, w: 12, h: 0.7, fontSize: 16, color: INK, italic: true, fontFace: 'Calibri' })
  s.addText('Specific Objectives', { x: 0.6, y: 2.8, w: 12, h: 0.4, fontSize: 18, bold: true, color: RED, fontFace: 'Calibri' })
  bullets(s, [
    'Implement hierarchical role-based access control (4 roles)',
    'Develop the academic core: attendance, timetable, results, announcements, transcripts',
    'Integrate AI features: chatbot, recommendations, predictive enrolment, decision support',
    'Build an offline-capable announcement portal',
    'Deliver a real-time analytics dashboard for leadership',
    'Demonstrate end-to-end with IUGET branding and PDF exports',
  ], { y: 3.2, fontSize: 16 })
}

// ===== Slide 5: Methodology =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'Methodology', 'Design-science research + 4-sprint agile delivery')

  const sprints = [
    { n: 'Sprint 1', t: 'Foundation', d: 'Scaffold, design system, RBAC, routing', color: NAVY },
    { n: 'Sprint 2', t: 'Academic core', d: 'Attendance, timetable, results, announcements', color: '2451E6' },
    { n: 'Sprint 3', t: 'Intelligence', d: 'AI chatbot, analytics, transcript, recommendations', color: RED },
    { n: 'Sprint 4', t: 'Polish', d: 'Branding, docs, defence prep', color: '0891B2' },
  ]
  sprints.forEach((sp, i) => {
    const x = 0.5 + i * 3.15
    shape(s, x, 2.0, 2.9, 0.5, sp.color, sp.n, 14, 'FFFFFF')
    s.addText(sp.t, { x, y: 2.6, w: 2.9, h: 0.5, fontSize: 18, bold: true, color: NAVY, align: 'center', fontFace: 'Calibri' })
    s.addText(sp.d, { x, y: 3.2, w: 2.9, h: 0.8, fontSize: 12, color: INK, align: 'center', fontFace: 'Calibri', valign: 'top' })
  })

  s.addText('Evaluation criteria', { x: 0.6, y: 4.3, w: 12, h: 0.4, fontSize: 18, bold: true, color: RED, fontFace: 'Calibri' })
  bullets(s, [
    'Functional completeness — all 19 modules navigable',
    'Role enforcement — each role sees only its permitted views',
    'Persistence — CRUD survives a page reload',
    'Performance — first contentful paint < 2s on 4G',
    'Defensibility — every architectural choice is justified',
  ], { y: 4.7, fontSize: 14 })
}

// ===== Slide 6: Use Cases =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'Use Case Diagram', '4 actors · 17 use cases · hierarchical permissions')
  image(s, '03-use-case.png', 0.7, 1.55, 11.9, 5.3)
}

// ===== Slide 7: Architecture =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'System Architecture', '3-tier · React → Context → Firebase + Claude')
  image(s, '01-architecture.png', 0.6, 1.55, 12.1, 5.3)
}

// ===== Slide 8: ERD =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'Data Model — Entity Relationship Diagram', '9 entities · enforced via app code + Firestore rules')
  image(s, '02-erd.png', 0.6, 1.55, 12.1, 5.3)
}

// ===== Slide 9: Component =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'Component Diagram', '50 source files organised by responsibility')
  image(s, '05-component.png', 0.6, 1.55, 12.1, 5.3)
}

// ===== Slide 10: Sequence =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'Sequence Diagram — Login Flow', 'How authentication crosses 5 collaborating components')
  image(s, '04-sequence-login.png', 0.6, 1.55, 12.1, 5.3)
}

// ===== Slide 11: Data Flow =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'Data Flow Diagram (Level 1)', '7 processes · 5 data stores · 5 external entities')
  image(s, '06-data-flow.png', 0.6, 1.55, 12.1, 5.3)
}

// ===== Slide 12: Deployment =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'Deployment Topology', '3 nodes: browser · CDN · Firebase + Anthropic')
  image(s, '07-deployment.png', 0.6, 1.55, 12.1, 5.3)
}

// ===== Slide 13: Tech Stack =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'Technology Stack', 'Every choice justified, every dependency necessary')

  const stack = [
    ['Frontend',  'React 18 + Vite 5',        'Component model + fastest dev loop'],
    ['Styling',   'Tailwind CSS 3 + IUGET theme', 'Utility-first with custom brand tokens'],
    ['Routing',   'React Router 6',           'Nested routes with role guards'],
    ['State',     'React Context API',        'Sufficient scale, no Redux overhead'],
    ['Backend',   'Firebase (Auth + Firestore + Storage)', 'Zero-ops BaaS, Spark tier'],
    ['AI',        'Anthropic Claude SDK',     'Best safety + reasoning quality'],
    ['Charts',    'Recharts',                 'Declarative, React-native'],
    ['PDF',       'jsPDF + html2canvas',      'Client-side, no server needed'],
    ['Animation', 'Framer Motion',            'Smooth, accessible motion'],
    ['Icons',     'Lucide React',             '~1500 SVG icons, tree-shaken'],
  ]
  stack.forEach((row, i) => {
    const y = 1.7 + i * 0.45
    s.addText(row[0], { x: 0.6, y, w: 1.7, h: 0.4, fontSize: 13, bold: true, color: NAVY, fontFace: 'Calibri' })
    s.addText(row[1], { x: 2.3, y, w: 4.5, h: 0.4, fontSize: 13, color: INK, bold: true, fontFace: 'Calibri' })
    s.addText(row[2], { x: 6.8, y, w: 5.9, h: 0.4, fontSize: 12, color: GRAY, fontFace: 'Calibri', italic: true })
  })
}

// ===== Slide 14: Modules Implemented =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, '19 Modules Delivered', 'Every workflow you asked for, working end-to-end')

  const modules = [
    'Role-based authentication (4 roles)',
    'Attendance tracking + CSV export',
    '3-specialty IUGET timetable (SWE/CNSM/BST)',
    'Results & printable grade sheet',
    'Offline announcements portal',
    'AI chatbot (Claude-ready)',
    'Course recommendations (AI match)',
    'Mobile learning hub',
    'Transcript PDF generation',
    'Real-time analytics dashboard',
    'Predictive enrolment system',
    'Decision support & AI insights',
    'Automated fee recovery analytics',
    'User management (CRUD)',
    'Institution settings',
    'Tuition payment (MoMo, OM, Visa, Bank)',
    'Student ID card generator',
    'PWA / Offline / Installable',
    'Command palette (Cmd+K)',
  ]
  modules.forEach((m, i) => {
    const col = i % 3, row = Math.floor(i / 3)
    const x = 0.6 + col * 4.2, y = 1.8 + row * 0.95
    s.addShape('roundRect', { x, y, w: 4.0, h: 0.75, fill: { color: LIGHT }, line: { color: NAVY, width: 1 }, rectRadius: 0.08 })
    s.addText(`${i + 1}`, { x: x + 0.1, y: y + 0.1, w: 0.6, h: 0.55, fontSize: 18, bold: true, color: RED, fontFace: 'Calibri', align: 'center' })
    s.addText(m, { x: x + 0.7, y: y + 0.05, w: 3.2, h: 0.65, fontSize: 12, color: INK, fontFace: 'Calibri', valign: 'middle' })
  })
}

// ===== Slide 15: IUGET Design System =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'IUGET Design System', 'A platform that feels institutional, not generic')

  // Colour swatches
  const swatches = [
    { color: NAVY, name: 'IUGET Navy',   hex: '#1E3AA0', usage: 'Primary actions, headers' },
    { color: RED,  name: 'IUGET Red',    hex: '#E63946', usage: 'Accents, highlights' },
    { color: '9CA3AF', name: 'IUGET Gray', hex: '#9CA3AF', usage: 'Borders, dividers' },
    { color: 'F8FAFC', name: 'Slate 50',   hex: '#F8FAFC', usage: 'Page background' },
  ]
  swatches.forEach((sw, i) => {
    const x = 0.6 + i * 3.15
    s.addShape('roundRect', { x, y: 1.8, w: 2.9, h: 1.6, fill: { color: sw.color }, line: { color: 'CBD5E1', width: 1 }, rectRadius: 0.15 })
    s.addText(sw.name, { x, y: 3.5, w: 2.9, h: 0.3, fontSize: 14, bold: true, color: INK, align: 'center', fontFace: 'Calibri' })
    s.addText(sw.hex,  { x, y: 3.8, w: 2.9, h: 0.3, fontSize: 12, color: GRAY, align: 'center', fontFace: 'Consolas' })
    s.addText(sw.usage, { x, y: 4.1, w: 2.9, h: 0.3, fontSize: 11, color: GRAY, align: 'center', fontFace: 'Calibri', italic: true })
  })

  // Typography
  s.addText('Typography', { x: 0.6, y: 4.7, w: 12, h: 0.4, fontSize: 18, bold: true, color: RED, fontFace: 'Calibri' })
  s.addText('Inter — body, UI', { x: 0.6, y: 5.15, w: 6, h: 0.5, fontSize: 24, color: INK, fontFace: 'Calibri' })
  s.addText('Space Grotesk — display, headings', { x: 6.8, y: 5.15, w: 6, h: 0.5, fontSize: 24, color: NAVY, bold: true, fontFace: 'Calibri' })
}

// ===== Slide 16: Demo Walk-through =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'Live Demo', 'Open the app and walk through every role')

  // Demo accounts table
  s.addText('Demo accounts', { x: 0.6, y: 1.6, w: 12, h: 0.4, fontSize: 18, bold: true, color: RED, fontFace: 'Calibri' })

  const rows = [
    ['Role',     'Email',                'Password',  'See...'],
    ['Student',  'student@iuget.cm',     'password',  'Attendance, Results, Chatbot, Transcript'],
    ['Lecturer', 'lecturer@iuget.cm',    'password',  'Mark Attendance, Enter Grades, Classes'],
    ['Staff',    'staff@iuget.cm',       'password',  'User mgmt, Timetable, Announcements'],
    ['Admin',    'admin@iuget.cm',       'password',  'Analytics, Predictions, AI insights'],
  ]
  rows.forEach((row, i) => {
    const y = 2.1 + i * 0.5
    const fill = i === 0 ? NAVY : (i % 2 ? 'FFFFFF' : LIGHT)
    const color = i === 0 ? 'FFFFFF' : INK
    s.addShape('rect', { x: 0.6, y, w: 12.1, h: 0.48, fill: { color: fill }, line: { color: 'CBD5E1', width: 0.5 } })
    s.addText(row[0], { x: 0.7, y: y + 0.05, w: 1.6, h: 0.4, fontSize: 13, bold: i === 0, color, fontFace: 'Calibri', valign: 'middle' })
    s.addText(row[1], { x: 2.3, y: y + 0.05, w: 3.3, h: 0.4, fontSize: 13, color, fontFace: 'Consolas', valign: 'middle' })
    s.addText(row[2], { x: 5.6, y: y + 0.05, w: 1.7, h: 0.4, fontSize: 13, color, fontFace: 'Consolas', valign: 'middle' })
    s.addText(row[3], { x: 7.3, y: y + 0.05, w: 5.3, h: 0.4, fontSize: 13, color, fontFace: 'Calibri', valign: 'middle' })
  })
}

// ===== Slide 17: Testing =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'Testing & Validation', '18 functional test cases · all PASS')
  bullets(s, [
    'Authentication (T01-T04) — login, invalid login, unauthenticated route, wrong-role access',
    'Lecturer actions (T05-T06) — mark attendance, enter grades + auto-grading',
    'Admin actions (T07, T09-T11, T14) — publish, user CRUD, timetable slot editor',
    'Student actions (T08, T12, T13) — enroll, transcript PDF, attendance CSV',
    'AI & UX (T15-T18) — chatbot rules, theme toggle, notifications, persistence',
    'Visual QA — Chrome, Firefox, Safari + Android Chrome at 3 breakpoints',
    'Accessibility — keyboard navigation, semantic labels, WCAG AA contrast',
  ], { y: 1.8, fontSize: 16 })

  // Pass rate widget
  s.addShape('roundRect', { x: 9, y: 5.4, w: 3.5, h: 1.4, fill: { color: NAVY }, line: { type: 'none' }, rectRadius: 0.2 })
  s.addText('100%', { x: 9, y: 5.5, w: 3.5, h: 0.7, fontSize: 40, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })
  s.addText('18 / 18 tests passed', { x: 9, y: 6.2, w: 3.5, h: 0.4, fontSize: 14, color: 'C7D2FE', align: 'center', fontFace: 'Calibri' })
}

// ===== Slide 18: Results =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'Quantitative Results', 'What the project produced')

  const stats = [
    { v: '52',    l: 'Source files' },
    { v: '9,200', l: 'Lines of code' },
    { v: '24',    l: 'Pages' },
    { v: '19',    l: 'Modules' },
    { v: '14',    l: 'Reusable components' },
    { v: '7',     l: 'Diagrams' },
    { v: '478 kB', l: 'Bundle (gzip)' },
    { v: '< 20 s', l: 'Build time' },
  ]
  stats.forEach((st, i) => {
    const col = i % 4, row = Math.floor(i / 4)
    const x = 0.6 + col * 3.15, y = 1.9 + row * 2.4
    s.addShape('roundRect', { x, y, w: 2.9, h: 2.1, fill: { color: LIGHT }, line: { color: NAVY, width: 2 }, rectRadius: 0.2 })
    s.addText(st.v, { x, y: y + 0.3, w: 2.9, h: 1.0, fontSize: 36, bold: true, color: NAVY, align: 'center', fontFace: 'Calibri' })
    s.addText(st.l, { x, y: y + 1.4, w: 2.9, h: 0.5, fontSize: 14, color: INK, align: 'center', fontFace: 'Calibri' })
  })
}

// ===== Slide 19: Strengths & Limitations =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'Strengths & Limitations', 'An honest assessment')

  s.addShape('rect', { x: 0.6, y: 1.7, w: 5.9, h: 0.5, fill: { color: '10B981' }, line: { type: 'none' } })
  s.addText('Strengths', { x: 0.6, y: 1.7, w: 5.9, h: 0.5, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })

  bullets(s, [
    'Single codebase — easier to maintain than 15 tools',
    'Demo-ready — no backend setup needed for review',
    'Production-ready — Firebase one env-var away',
    'Every architectural choice is justifiable',
    'IUGET-native branding, not generic',
  ], { x: 0.6, y: 2.3, w: 5.9, h: 4.5, fontSize: 14 })

  s.addShape('rect', { x: 6.8, y: 1.7, w: 5.9, h: 0.5, fill: { color: RED }, line: { type: 'none' } })
  s.addText('Limitations', { x: 6.8, y: 1.7, w: 5.9, h: 0.5, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })

  bullets(s, [
    'Demo mode is client-only — no multi-device sync',
    'Chatbot is rules-based until Claude key added',
    'Predictive enrolment uses precomputed values',
    'No automated unit-test suite yet',
    'No native mobile app (Capacitor roadmap)',
  ], { x: 6.8, y: 2.3, w: 5.9, h: 4.5, fontSize: 14 })
}

// ===== Slide 20: Future Work =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'Future Work', 'The roadmap beyond this defence')
  bullets(s, [
    'Live AI: route chatbot through a backend proxy with conversation memory',
    'Server-side ML: regression / ARIMA model retrained nightly on real attendance + grades',
    'Mobile native: Capacitor wrapper or parallel React Native client',
    'Biometric attendance: face-api.js for selfie-based roll-call',
    'Fee module: Orange Money + MTN MoMo integration',
    'Test automation: Vitest unit tests + Playwright end-to-end',
    'Multi-language: French translation layer for full bilingual support',
    'Service worker: full offline app shell + queued mutations',
  ], { y: 1.8, fontSize: 17 })
}

// ===== Slide 21: Conclusion =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  title(s, 'Conclusion', 'A platform that earns its place')

  s.addText('SIARM demonstrates that a single Level-3 software-engineering student can deliver a unified, AI-augmented academic platform that competes — on user experience and architectural quality — with much larger commercial offerings.',
    { x: 0.6, y: 1.7, w: 12.1, h: 1.2, fontSize: 17, color: INK, fontFace: 'Calibri', italic: true })

  s.addText('All six specific objectives have been met.',
    { x: 0.6, y: 3.0, w: 12.1, h: 0.5, fontSize: 18, bold: true, color: RED, fontFace: 'Calibri', align: 'center' })

  // Three-column "what next" cards
  const cards = [
    { t: 'For IUGET',  d: 'A concrete migration path away from fragmented tools — deployable today.' },
    { t: 'For me',     d: 'Proof of the judgement and execution expected of a graduating software engineer.' },
    { t: 'For others', d: 'A reference architecture other Cameroonian universities can adopt and adapt.' },
  ]
  cards.forEach((c, i) => {
    const x = 0.6 + i * 4.2
    s.addShape('roundRect', { x, y: 3.8, w: 4.0, h: 2.8, fill: { color: LIGHT }, line: { color: NAVY, width: 1.5 }, rectRadius: 0.2 })
    s.addText(c.t, { x, y: 4.0, w: 4.0, h: 0.5, fontSize: 18, bold: true, color: NAVY, align: 'center', fontFace: 'Calibri' })
    s.addText(c.d, { x: x + 0.3, y: 4.7, w: 3.4, h: 1.8, fontSize: 13, color: INK, fontFace: 'Calibri' })
  })
}

// ===== Slide 22: Q&A =====
{
  const s = pres.addSlide({ masterName: 'SIARM_MASTER' })
  s.background = { color: NAVY }
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: NAVY }, line: { type: 'none' } })
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.15, fill: { color: RED }, line: { type: 'none' } })

  s.addText('Questions?', { x: 0.5, y: 2.5, w: 12.3, h: 1.8, fontSize: 96, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })
  s.addText('Thank you for listening.', { x: 0.5, y: 4.4, w: 12.3, h: 0.6, fontSize: 22, italic: true, color: 'C7D2FE', align: 'center', fontFace: 'Calibri' })

  s.addText('James Murdza  ·  Level-3 SWE  ·  IUGET Bonaberi', { x: 0.5, y: 5.8, w: 12.3, h: 0.4, fontSize: 16, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })
  s.addText('« Bien choisir c\'est déjà réussir »', { x: 0.5, y: 6.3, w: 12.3, h: 0.4, fontSize: 14, italic: true, color: 'A5B4FC', align: 'center', fontFace: 'Calibri' })
}

await pres.writeFile({ fileName: OUT_FILE })
console.log(`✓ PowerPoint written: ${OUT_FILE}`)
const stat = fs.statSync(OUT_FILE)
console.log(`  Size: ${(stat.size / 1024).toFixed(1)} KB`)
