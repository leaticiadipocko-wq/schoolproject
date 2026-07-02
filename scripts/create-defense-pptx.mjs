import pptxgen from 'pptxgenjs'

const pptx = new pptxgen()
pptx.layout = 'LAYOUT_16x9'
pptx.author = 'James Murdza — IUGET Bonabéri'
pptx.title = 'SIARM Defense Presentation — Smart Institution Academic Resource Management'

// ─── Design tokens ───────────────────────────────────────────
const BRAND = '1e3aa0'
const ACCENT = 'e63946'
const DARK = '0f172a'
const LIGHT = 'f8fafc'
const GRAY = '64748b'
const WHITE = 'ffffff'

const TITLE_FONT = { fontFace: 'Arial', fontSize: 36, bold: true, color: WHITE }
const SUBTITLE_FONT = { fontFace: 'Arial', fontSize: 18, color: 'cbd5e1' }
const HEADING = { fontFace: 'Arial', fontSize: 28, bold: true, color: DARK }
const SUBHEADING = { fontFace: 'Arial', fontSize: 20, bold: true, color: BRAND }
const BODY = { fontFace: 'Arial', fontSize: 14, color: '334155', lineSpacingMultiple: 1.3 }
const BODY_WHITE = { fontFace: 'Arial', fontSize: 14, color: WHITE, lineSpacingMultiple: 1.3 }
const BULLET = { fontFace: 'Arial', fontSize: 14, color: '334155', bullet: { type: 'bullet', indent: 20 }, lineSpacingMultiple: 1.3 }
const SMALL = { fontFace: 'Arial', fontSize: 11, color: GRAY }

// Helper: add brand footer
function addFooter(slide, num, total) {
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 5.2, w: '100%', h: 0.4, fill: { color: DARK } })
  slide.addText('SIARM — IUGET Bonabéri', { x: 0.5, y: 5.22, w: 4, h: 0.35, ...SMALL, color: '94a3b8' })
  slide.addText(`${num} / ${total}`, { x: 8, y: 5.22, w: 1.5, h: 0.35, ...SMALL, color: '94a3b8', align: 'right' })
}

// Helper: section divider
function sectionDivider(title, subtitle, slideNum, total) {
  const slide = pptx.addSlide()
  slide.background = { fill: BRAND }
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: BRAND } })
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 2, w: 1, h: 1.5, fill: { color: ACCENT } })
  slide.addText(title, { x: 1.5, y: 1.8, w: 7.5, h: 1.2, ...TITLE_FONT, fontSize: 40 })
  slide.addText(subtitle, { x: 1.5, y: 3.2, w: 7.5, h: 0.8, ...SUBTITLE_FONT })
  addFooter(slide, slideNum, total)
  return slide
}

// Helper: content slide with bullets
function contentSlide(title, bullets, slideNum, total) {
  const slide = pptx.addSlide()
  slide.background = { fill: WHITE }
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  slide.addText(title, { x: 0.7, y: 0.3, w: 8.5, h: 0.8, ...HEADING })
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 1.05, w: 2, h: 0.05, fill: { color: ACCENT } })
  slide.addText(bullets.map(b => ({ text: typeof b === 'string' ? b : b.text, options: BULLET })), {
    x: 0.7, y: 1.4, w: 8.5, h: 3.5,
    valign: 'top',
  })
  addFooter(slide, slideNum, total)
  return slide
}

// Helper: two-column slide
function twoColSlide(title, left, right, slideNum, total) {
  const slide = pptx.addSlide()
  slide.background = { fill: WHITE }
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  slide.addText(title, { x: 0.7, y: 0.3, w: 8.5, h: 0.8, ...HEADING })
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 1.05, w: 2, h: 0.05, fill: { color: ACCENT } })
  slide.addText(left.map(b => ({ text: typeof b === 'string' ? b : b.text, options: BULLET })), {
    x: 0.7, y: 1.4, w: 4, h: 3.5, valign: 'top',
  })
  slide.addText(right.map(b => ({ text: typeof b === 'string' ? b : b.text, options: BULLET })), {
    x: 5.2, y: 1.4, w: 4, h: 3.5, valign: 'top',
  })
  addFooter(slide, slideNum, total)
  return slide
}

// Helper: diagram slide (box diagram)
function diagramSlide(title, boxes, slideNum, total) {
  const slide = pptx.addSlide()
  slide.background = { fill: WHITE }
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  slide.addText(title, { x: 0.7, y: 0.3, w: 8.5, h: 0.8, ...HEADING })
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 1.05, w: 2, h: 0.05, fill: { color: ACCENT } })

  const cols = Math.min(boxes.length, 3)
  const boxW = 2.5
  const gap = 0.3
  const startX = (10 - (cols * boxW + (cols - 1) * gap)) / 2

  boxes.forEach((box, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = startX + col * (boxW + gap)
    const y = 1.5 + row * 1.6
    const color = box.color || BRAND

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w: boxW, h: 1.3,
      fill: { color },
      rectRadius: 0.1,
      shadow: { type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.15 },
    })
    slide.addText(box.title, {
      x, y: y + 0.15, w: boxW, h: 0.5,
      fontFace: 'Arial', fontSize: 13, bold: true, color: WHITE, align: 'center',
    })
    slide.addText(box.desc, {
      x, y: y + 0.6, w: boxW, h: 0.55,
      fontFace: 'Arial', fontSize: 10, color: 'e2e8f0', align: 'center', valign: 'top',
    })
  })

  addFooter(slide, slideNum, total)
  return slide
}

// Helper: stat card slide
function statSlide(title, stats, slideNum, total) {
  const slide = pptx.addSlide()
  slide.background = { fill: DARK }
  slide.addText(title, { x: 0.7, y: 0.3, w: 8.5, h: 0.8, ...HEADING, color: WHITE })
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 1.05, w: 2, h: 0.05, fill: { color: ACCENT } })

  const boxW = 2.5
  const gap = 0.3
  const startX = (10 - (stats.length * boxW + (stats.length - 1) * gap)) / 2

  stats.forEach((s, i) => {
    const x = startX + i * (boxW + gap)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.5, w: boxW, h: 2.5,
      fill: { color: '1e293b' },
      rectRadius: 0.15,
      line: { color: '334155', width: 1 },
    })
    slide.addText(s.value, {
      x, y: 1.8, w: boxW, h: 1,
      fontFace: 'Arial', fontSize: 40, bold: true, color: ACCENT, align: 'center',
    })
    slide.addText(s.label, {
      x, y: 2.8, w: boxW, h: 0.5,
      fontFace: 'Arial', fontSize: 14, color: '94a3b8', align: 'center',
    })
    slide.addText(s.sub, {
      x, y: 3.3, w: boxW, h: 0.4,
      fontFace: 'Arial', fontSize: 11, color: '64748b', align: 'center',
    })
  })

  addFooter(slide, slideNum, total)
  return slide
}

// ─── TOTAL SLIDES ────────────────────────────────────────────
const TOTAL = 50

// ─── SLIDE 1: Title ──────────────────────────────────────────
{
  const slide = pptx.addSlide()
  slide.background = { fill: DARK }
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: DARK } })
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 4.5, w: '100%', h: 1.1, fill: { color: BRAND } })
  slide.addText('SIARM', { x: 0.5, y: 0.5, w: 9, h: 1.2, fontFace: 'Arial', fontSize: 60, bold: true, color: WHITE })
  slide.addText('Smart Institution Academic Resource Management', { x: 0.5, y: 1.6, w: 9, h: 0.7, fontFace: 'Arial', fontSize: 22, color: '94a3b8' })
  slide.addText('Bachelor of Technology — Software Engineering', { x: 0.5, y: 2.4, w: 9, h: 0.5, fontFace: 'Arial', fontSize: 16, color: '64748b' })
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.5, y: 3.2, w: 3, h: 0.05, fill: { color: ACCENT } })
  slide.addText('Presented by James Murdza\nLevel 3 — Software Engineering\nIUGET Bonabéri, Douala, Cameroon', {
    x: 0.5, y: 3.5, w: 9, h: 1, fontFace: 'Arial', fontSize: 14, color: '94a3b8', lineSpacingMultiple: 1.5,
  })
  slide.addText('Academic Year 2025/2026', { x: 0.5, y: 4.6, w: 9, h: 0.5, fontFace: 'Arial', fontSize: 13, color: WHITE })
}

// ─── SLIDE 2: Table of Contents ──────────────────────────────
{
  const slide = pptx.addSlide()
  slide.background = { fill: WHITE }
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  slide.addText('Table of Contents', { x: 0.7, y: 0.3, w: 8.5, h: 0.8, ...HEADING })
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 1.05, w: 2, h: 0.05, fill: { color: ACCENT } })

  const toc = [
    '1.  Title & Introduction',
    '2.  Problem Statement & Motivation',
    '3.  Project Objectives',
    '4.  Literature Review',
    '5.  System Architecture',
    '6.  Technology Stack',
    '7.  Features Overview',
    '8–14.  Feature Deep Dives (7 slides)',
    '15.  User Roles & Permissions',
    '16.  Database Design',
    '17.  UI/UX Design',
    '18.  Security Implementation',
    '19.  Testing & Quality',
    '20.  Deployment',
    '21–30.  System Walkthrough (10 slides)',
    '31–40.  Diagrams & Screenshots (10 slides)',
    '41–45.  Results & Impact (5 slides)',
    '46–48.  Challenges & Solutions (3 slides)',
    '49.  Future Enhancements',
    '50.  Conclusion & Thank You',
  ]
  slide.addText(toc.join('\n'), {
    x: 0.7, y: 1.3, w: 8.5, h: 3.7,
    fontFace: 'Arial', fontSize: 13, color: '475569', lineSpacingMultiple: 1.25, valign: 'top',
  })
  addFooter(slide, 2, TOTAL)
}

// ─── SLIDE 3: Section — Problem Statement ────────────────────
sectionDivider('Problem Statement', 'Why SIARM was built', 3, TOTAL)

// ─── SLIDE 4: Problem Statement ──────────────────────────────
contentSlide('The Problem at IUGET', [
  'IUGET Bonabéri relied on paper-based and fragmented systems for academic management',
  'Students had no central portal to check attendance, grades, or pay tuition',
  'Lecturers manually recorded attendance on paper sheets — error-prone and time-consuming',
  'Grade submission required physical paperwork between departments',
  'No real-time communication channel between students, lecturers, and administration',
  'Parents had no visibility into their child\'s academic progress or fees',
  'Government (MINESUP) reporting required manual data compilation',
  'No backup or disaster recovery for academic records',
], 4, TOTAL)

// ─── SLIDE 5: Motivation ─────────────────────────────────────
contentSlide('Motivation & Vision', [
  'Digitize the entire student lifecycle — from admission to graduation',
  'Provide a single platform accessible to all stakeholders: students, lecturers, staff, parents',
  'Enable real-time data access and decision-making for administrators',
  'Reduce paperwork by 90% and improve data accuracy',
  'Support bilingual (EN/FR) interface for Cameroon\'s bilingual community',
  'Build a Progressive Web App that works offline — critical for areas with unstable internet',
  'Align with MINESUP reporting requirements from day one',
], 5, TOTAL)

// ─── SLIDE 6: Section — Objectives ───────────────────────────
sectionDivider('Project Objectives', 'What SIARM aims to achieve', 6, TOTAL)

// ─── SLIDE 7: Objectives ─────────────────────────────────────
twoColSlide('Project Objectives', [
  'Automate attendance tracking with digital roll calls',
  'Centralize grade management (CA + exams)',
  'Enable online tuition payments (MoMo, OM, Visa, bank)',
  'Provide real-time timetable management',
  'Generate official transcripts and ID cards digitally',
  'Support mobile learning content delivery',
], [
  'Implement role-based access (student, lecturer, staff, admin)',
  'Enable parent portal for fee tracking',
  'Provide analytics dashboards for leadership',
  'Ensure MINESUP compliance for government reports',
  'Build an offline-capable PWA',
  'Deliver bilingual support (English & French)',
], 7, TOTAL)

// ─── SLIDE 8: Section — Literature Review ────────────────────
sectionDivider('Literature Review', 'Existing solutions & gaps', 8, TOTAL)

// ─── SLIDE 9: Literature Review ──────────────────────────────
contentSlide('Existing Solutions & Their Limitations', [
  'Moodle: Great for LMS but lacks attendance, fees, and administrative modules',
  'Google Classroom: No tuition tracking, no role-based admin, no offline support',
  'Custom ERP systems (SAP, Oracle): Too expensive for small institutions',
  'Excel spreadsheets: No validation, no multi-user access, no audit trail',
  'Paper registers: Lost data, no analytics, time-consuming compilation',
  'Mobile money apps: Not integrated with academic records',
  'Gap: No affordable, all-in-one platform designed for African universities',
], 9, TOTAL)

// ─── SLIDE 10: SIARM Solution ────────────────────────────────
contentSlide('SIARM: The Unified Solution', [
  'All-in-one platform covering: attendance, grades, timetables, fees, learning, discussions',
  'Role-based dashboards — each user sees exactly what they need',
  'Progressive Web App — works offline after first load',
  'Bilingual (EN/FR) from the ground up',
  'Built with modern web technologies — no app store required',
  'Firebase backend for real-time sync and scalability',
  'Demo mode for evaluation without server setup',
  'Designed specifically for IUGET Bonabéri\'s workflows',
], 10, TOTAL)

// ─── SLIDE 11: Section — Architecture ────────────────────────
sectionDivider('System Architecture', 'How SIARM is built', 11, TOTAL)

// ─── SLIDE 12: Architecture Diagram ──────────────────────────
diagramSlide('High-Level Architecture', [
  { title: 'Frontend', desc: 'React 18 + Vite + Tailwind CSS', color: BRAND },
  { title: 'Backend', desc: 'Firebase Auth + Firestore + Storage', color: '059669' },
  { title: 'PWA Layer', desc: 'Service Worker + Workbox + IndexedDB', color: '7c3aed' },
], 12, TOTAL)

// ─── SLIDE 13: Component Architecture ────────────────────────
diagramSlide('Component Architecture', [
  { title: 'Pages', desc: '40+ page components organized by role', color: BRAND },
  { title: 'Components', desc: 'Reusable UI: Sidebar, Navbar, Modals', color: '0891b2' },
  { title: 'Context', desc: 'Auth, Data, Language providers', color: '7c3aed' },
  { title: 'Lib/Utils', desc: 'Roles, helpers, mock data, Firebase config', color: '059669' },
  { title: 'Routing', desc: 'react-router-dom v6 with role guards', color: 'dc2626' },
  { title: 'State', desc: 'Context + localStorage persistence', color: 'd97706' },
], 13, TOTAL)

// ─── SLIDE 14: Tech Stack ────────────────────────────────────
diagramSlide('Technology Stack', [
  { title: 'React 18', desc: 'Component-based UI framework', color: '0ea5e9' },
  { title: 'Vite 5', desc: 'Fast build tool & dev server', color: '7c3aed' },
  { title: 'Tailwind CSS', desc: 'Utility-first styling', color: '06b6d4' },
  { title: 'Firebase', desc: 'Auth, Firestore, Storage', color: 'f59e0b' },
  { title: 'Framer Motion', desc: 'Smooth animations', color: 'ec4899' },
  { title: 'PWA', desc: 'Offline-first with Workbox', color: '10b981' },
], 14, TOTAL)

// ─── SLIDE 15: Section — Features ────────────────────────────
sectionDivider('Features Overview', 'What SIARM delivers', 15, TOTAL)

// ─── SLIDE 16: Feature Matrix ────────────────────────────────
twoColSlide('Feature Matrix by Role', [
  'STUDENT: Dashboard, Attendance, Timetable, Results, Assignments, Discussions, Learning, Fees, ID Card, Transcript',
  'LECTURER: Dashboard, Classes, Mark Attendance, Enter Grades, Publish Lessons, Assignments, Discussions',
], [
  'STAFF: Dashboard, User Management, Enrollment, Finance, Timetable Builder, Analytics, Audit, MINESUP Reports, Data Export',
  'ADMIN: All Staff features + Settings, Executive Dashboard, AI Insights',
], 16, TOTAL)

// ─── SLIDE 17: Attendance Feature ────────────────────────────
contentSlide('Attendance Tracking', [
  'Lecturers mark attendance per course, per date — present/absent',
  'Students see real-time attendance records with percentage calculations',
  'Color-coded: green for present, red for absent',
  'Filterable by course and semester',
  'Attendance percentage displayed prominently on student dashboard',
  'Data feeds into MINESUP compliance reports',
  'Eliminates paper registers and manual compilation',
], 17, TOTAL)

// ─── SLIDE 18: Grades Feature ────────────────────────────────
contentSlide('Grade Management', [
  'Two-component grading: Continuous Assessment (CA) + Final Exam',
  'Lecturers enter grades per student with batch submission',
  'Students view results by semester with GPA calculation',
  'Downloadable PDF transcripts with QR verification codes',
  'Grade analytics visible to admin for institutional performance tracking',
  'Supports IUGET\'s grading scale and academic recovery flows',
], 18, TOTAL)

// ─── SLIDE 19: Fees Feature ──────────────────────────────────
contentSlide('Tuition & Fee Payments', [
  'Multiple payment methods: MTN MoMo, Orange Money, Visa/Mastercard, Bank Transfer',
  'Fee structure displayed clearly with outstanding balance',
  'Payment history with printable receipts',
  'Real-time balance updates after payment',
  'Bursary dashboard for staff: track collected vs. outstanding fees',
  'Recovery rate metrics for financial reporting',
  'Demo mode simulates instant payment processing',
], 19, TOTAL)

// ─── SLIDE 20: Timetable Feature ─────────────────────────────
contentSlide('Timetable Management', [
  'Weekly schedule grid view for students',
  'Filterable by specialty and track (Bachelor evening, Level 1/2 morning)',
  'Timetable builder for staff: create and manage schedules',
  'Export to calendar (.ics file) for personal calendar apps',
  'Supports IUGET\'s complex scheduling: Mon-Fri 6-10 PM + Saturday 8 AM-5 PM',
  'Conflict detection prevents double-booking rooms or lecturers',
], 20, TOTAL)

// ─── SLIDE 21: Mobile Learning ───────────────────────────────
contentSlide('Mobile Learning Module', [
  'Lecturers publish lessons with rich text content',
  'Students access course materials on any device',
  'Organized by course for easy navigation',
  'Available offline after first load — study anywhere',
  'Supports self-paced learning alongside formal classes',
  'Bridges the gap between classroom and independent study',
], 21, TOTAL)

// ─── SLIDE 22: Discussions & Communication ───────────────────
contentSlide('Discussions & Announcements', [
  'Course-specific discussion threads for student-lecturer interaction',
  'Post new messages and reply to existing threads',
  'Institutional announcements with pinning capability',
  'Announcements available offline for reliable access',
  'Notification system alerts users to new activity',
  'Reduces email clutter and physical notice boards',
], 22, TOTAL)

// ─── SLIDE 23: ID Card & Transcript ──────────────────────────
contentSlide('Digital ID Card & Transcripts', [
  'Student ID card generated with photo, QR code, and matricule',
  'Printable for physical use — no need to visit registrar',
  'QR code scannable for instant verification',
  'Official transcripts with all grades and GPA',
  'PDF download with institutional branding',
  'Digital signatures for document authenticity',
  'Reduces wait times from days to seconds',
], 23, TOTAL)

// ─── SLIDE 24: Section — User Roles ──────────────────────────
sectionDivider('User Roles & Permissions', 'Hierarchical access control', 24, TOTAL)

// ─── SLIDE 25: Role Hierarchy ────────────────────────────────
diagramSlide('Role-Based Access Control', [
  { title: 'Student', desc: 'View own data: grades, attendance, fees', color: '0ea5e9' },
  { title: 'Lecturer', desc: 'Manage classes: attendance, grades, lessons', color: '7c3aed' },
  { title: 'Staff', desc: 'Operations: enrollment, finance, users', color: '059669' },
  { title: 'Admin', desc: 'Full access: settings, analytics, all modules', color: 'dc2626' },
], 25, TOTAL)

// ─── SLIDE 26: Permission Matrix ─────────────────────────────
twoColSlide('Permission Matrix', [
  'Students: Read own attendance, grades, fees; Submit assignments; Join discussions',
  'Lecturers: Mark attendance; Enter grades; Create assignments; Publish lessons',
], [
  'Staff: Manage users; Process enrollment; Track finance; Build timetables; Export data',
  'Admin: All staff permissions + system settings + analytics + audit log + MINESUP reports',
], 26, TOTAL)

// ─── SLIDE 27: Section — Database Design ─────────────────────
sectionDivider('Database Design', 'Data model & storage', 27, TOTAL)

// ─── SLIDE 28: Data Model ────────────────────────────────────
diagramSlide('Core Data Entities', [
  { title: 'Users', desc: 'Students, Lecturers, Staff, Admins', color: BRAND },
  { title: 'Courses', desc: 'Academic courses & specialties', color: '059669' },
  { title: 'Attendance', desc: 'Per-course, per-date records', color: '7c3aed' },
  { title: 'Results', desc: 'CA + Exam grades per student', color: 'dc2626' },
  { title: 'Fees', desc: 'Tuition structure & payments', color: 'd97706' },
  { title: 'Timetable', desc: 'Weekly schedule slots', color: '0891b2' },
], 28, TOTAL)

// ─── SLIDE 29: Firebase Schema ───────────────────────────────
contentSlide('Firestore Collections', [
  'users/ — User profiles with role, specialty, matricule',
  'courses/ — Course catalog with department and credits',
  'attendance/ — Attendance records: student, course, date, status',
  'results/ — Grades: student, course, CA mark, exam mark, total',
  'fees/ — Fee structure and payment transactions',
  'timetable/ — Schedule slots: course, room, time, day',
  'announcements/ — Institutional notices with pinning and dates',
  'assignments/ — Assignment details with deadlines and submissions',
  'discussions/ — Threaded messages per course',
], 29, TOTAL)

// ─── SLIDE 30: Demo Mode ─────────────────────────────────────
contentSlide('Demo Mode Architecture', [
  'When no Firebase keys are configured, SIARM enters DEMO_MODE',
  'All data stored in browser localStorage — no server needed',
  'Pre-seeded with realistic mock data for all roles',
  'Full feature parity with production mode',
  'Ideal for evaluation, presentations, and development',
  'Toggle via VITE_DEMO_MODE=true in environment config',
  'Data persists across browser sessions until manually reset',
], 30, TOTAL)

// ─── SLIDE 31: Section — UI/UX Design ────────────────────────
sectionDivider('UI/UX Design', 'User experience & design principles', 31, TOTAL)

// ─── SLIDE 32: Design System ─────────────────────────────────
diagramSlide('Design System', [
  { title: 'Colors', desc: 'Brand (navy), Accent (red), Ink (slate)', color: BRAND },
  { title: 'Typography', desc: 'Inter + display font pairing', color: '7c3aed' },
  { title: 'Components', desc: 'Cards, buttons, inputs, badges', color: '059669' },
  { title: 'Dark Mode', desc: 'Full dark theme with class toggle', color: DARK },
  { title: 'Animations', desc: 'Framer Motion page transitions', color: 'ec4899' },
  { title: 'Responsive', desc: 'Mobile-first Tailwind breakpoints', color: '0891b2' },
], 32, TOTAL)

// ─── SLIDE 33: Dark Mode ─────────────────────────────────────
contentSlide('Dark Mode Implementation', [
  'Tailwind CSS darkMode: \'class\' strategy',
  'Toggle button in Navbar — Sun/Moon icons',
  'DataContext manages theme state with localStorage persistence',
  'Comprehensive .dark overrides in index.css for all components',
  'Dark body (bg-ink-950), dark cards (bg-ink-900), dark inputs',
  'Sidebar and Navbar have dedicated dark surfaces',
  'Smooth transition between themes — no page flash',
], 33, TOTAL)

// ─── SLIDE 34: Bilingual Support ─────────────────────────────
contentSlide('Bilingual Support (EN/FR)', [
  'LanguageContext provides t(key) translation function',
  '387+ translation keys in both English and French',
  'Auto-detects browser language on first visit',
  'Persistent language preference in localStorage',
  'Toggle available in Navbar and profile settings',
  'All UI text, labels, and messages fully translated',
  'Supports variable interpolation: {name}, {date}, etc.',
], 34, TOTAL)

// ─── SLIDE 35: Section — Security ────────────────────────────
sectionDivider('Security Implementation', 'Protecting user data', 35, TOTAL)

// ─── SLIDE 36: Security Features ─────────────────────────────
contentSlide('Security Measures', [
  'Firebase Authentication with email/password',
  'Role-based route protection via ProtectedRoute component',
  'Session timeout: 30-minute idle detection with 2-minute warning',
  'Password hashing (bcrypt) in demo mode',
  'HTTPS enforced for all API communications',
  'QR code verification for ID cards and transcripts',
  'Audit log tracking all administrative actions',
  'Input validation on all forms',
], 36, TOTAL)

// ─── SLIDE 37: Section — Testing ─────────────────────────────
sectionDivider('Testing & Quality Assurance', 'Ensuring reliability', 37, TOTAL)

// ─── SLIDE 38: Testing Strategy ──────────────────────────────
contentSlide('Testing Approach', [
  'Manual testing across all user roles and features',
  'Cross-browser testing: Chrome, Firefox, Safari, Edge',
  'Mobile responsiveness testing on various screen sizes',
  'Offline functionality testing with network throttling',
  'Demo mode testing for all CRUD operations',
  'Edge case testing: empty states, long text, missing data',
  'Accessibility testing with screen readers',
  'Performance profiling with Lighthouse',
], 38, TOTAL)

// ─── SLIDE 39: Section — Deployment ──────────────────────────
sectionDivider('Deployment', 'Going live', 39, TOTAL)

// ─── SLIDE 40: Deployment Architecture ────────────────────────
diagramSlide('Deployment Stack', [
  { title: 'Vercel', desc: 'Frontend hosting with CDN', color: DARK },
  { title: 'Firebase', desc: 'Backend services (Auth, DB, Storage)', color: 'f59e0b' },
  { title: 'PWA', desc: 'Service Worker for offline support', color: '10b981' },
  { title: 'CI/CD', desc: 'Auto-deploy from Git main branch', color: '7c3aed' },
], 40, TOTAL)

// ─── SLIDE 41: Section — System Walkthrough ──────────────────
sectionDivider('System Walkthrough', 'Live demonstration flow', 41, TOTAL)

// ─── SLIDE 42: Landing Page ──────────────────────────────────
contentSlide('Landing Page', [
  'Marketing page with hero section and feature grid',
  'Statistics: 2,847 active students, 88% attendance, 92% recovery',
  'Feature highlights with icons and descriptions',
  'Vision section explaining role-based architecture',
  'Call-to-action for registration and demo access',
  'Language toggle (EN/FR) in navigation',
  'Dark/Light theme toggle',
], 42, TOTAL)

// ─── SLIDE 43: Student Dashboard ─────────────────────────────
contentSlide('Student Dashboard', [
  'Personalized greeting with student name',
  'Quick stats: attendance %, GPA, active courses, classes today',
  'Attendance chart showing per-course breakdown (recharts)',
  'Today\'s schedule with course times',
  'Latest announcements from administration',
  'Course list with quick access links',
  'Outstanding tuition balance with due date',
  'Student ID card preview with QR code',
], 43, TOTAL)

// ─── SLIDE 44: Lecturer Dashboard ────────────────────────────
contentSlide('Lecturer Dashboard', [
  'Overview of assigned classes and student counts',
  'Quick access to mark attendance for today\'s classes',
  'Recent grade submissions and pending work',
  'Upcoming schedule and deadlines',
  'Discussion notifications from students',
  'Lesson publishing shortcut',
], 44, TOTAL)

// ─── SLIDE 45: Admin Dashboard ───────────────────────────────
contentSlide('Admin Dashboard', [
  'Executive KPIs: total users, enrollment trends, revenue',
  'Enrollment trends chart (recharts line chart)',
  'Department distribution pie chart',
  'AI-powered insights (using Anthropic Claude)',
  'Quick action buttons for common tasks',
  'Recent activity feed',
  'Financial summary with recovery metrics',
], 45, TOTAL)

// ─── SLIDE 46: AI Chatbot ────────────────────────────────────
contentSlide('AI-Powered Chatbot (New Feature)', [
  'Floating chat widget available on all pages',
  'Powered by Anthropic Claude API',
  'Bilingual support — responds in user\'s preferred language',
  'Context-aware: knows user role and available features',
  'Handles common questions: attendance, fees, grades, timetable',
  'Suggested questions for quick start',
  'Graceful fallback to predefined responses when offline',
  'Smooth animations with Framer Motion',
], 46, TOTAL)

// ─── SLIDE 47: Section — Results & Impact ────────────────────
sectionDivider('Results & Impact', 'Measurable outcomes', 47, TOTAL)

// ─── SLIDE 48: Impact Metrics ────────────────────────────────
statSlide('Project Impact', [
  { value: '40+', label: 'Pages & Components', sub: 'Full-featured platform' },
  { value: '4', label: 'User Roles', sub: 'Student, Lecturer, Staff, Admin' },
  { value: '12+', label: 'Core Modules', sub: 'Attendance to Analytics' },
  { value: '100%', label: 'Offline Capable', sub: 'PWA with service worker' },
], 48, TOTAL)

// ─── SLIDE 49: Challenges & Solutions ────────────────────────
twoColSlide('Challenges & Solutions', [
  'Challenge: Complex role hierarchy → Solution: Role-based routing with ProtectedRoute component',
  'Challenge: Offline support → Solution: PWA with Workbox runtime caching + localStorage fallback',
  'Challenge: Bilingual UI → Solution: Centralized LanguageContext with 387+ translation keys',
  'Challenge: Real-time sync → Solution: Firebase Firestore with real-time listeners',
], [
  'Challenge: Payment integration → Solution: Demo mode with realistic MoMo/OM simulation',
  'Challenge: PDF generation → Solution: jsPDF + html2canvas for transcripts and receipts',
  'Challenge: QR code verification → Solution: qrcode library with canvas rendering',
  'Challenge: Dark mode → Solution: Tailwind darkMode class with comprehensive CSS overrides',
], 49, TOTAL)

// ─── SLIDE 50: Future Enhancements ───────────────────────────
contentSlide('Future Enhancements', [
  'Real-time notifications with Firebase Cloud Messaging',
  'Video conferencing integration for online classes',
  'Advanced analytics with machine learning predictions',
  'Mobile app (React Native) for iOS and Android',
  'Integration with national examination boards',
  'Multi-campus support for IUGET expansion',
  'Blockchain-based certificate verification',
  'SMS notifications for parents and students',
], 50, TOTAL)

// ─── SLIDE 51: Conclusion (bonus) ────────────────────────────
{
  const slide = pptx.addSlide()
  slide.background = { fill: DARK }
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: DARK } })
  slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 4.5, w: '100%', h: 1.1, fill: { color: BRAND } })
  slide.addText('Thank You', { x: 0.5, y: 1, w: 9, h: 1.2, fontFace: 'Arial', fontSize: 52, bold: true, color: WHITE, align: 'center' })
  slide.addShape(pptx.shapes.RECTANGLE, { x: 3.5, y: 2.3, w: 3, h: 0.05, fill: { color: ACCENT } })
  slide.addText('Questions & Discussion', { x: 0.5, y: 2.6, w: 9, h: 0.7, fontFace: 'Arial', fontSize: 22, color: '94a3b8', align: 'center' })
  slide.addText('James Murdza — Level 3 Software Engineering\nIUGET Bonabéri, Douala, Cameroon\n\n« Bien choisir c\'est déjà réussir » — IUGET', {
    x: 0.5, y: 3.4, w: 9, h: 1.2, fontFace: 'Arial', fontSize: 14, color: '64748b', align: 'center', lineSpacingMultiple: 1.5,
  })
}

// ─── Generate ────────────────────────────────────────────────
const outPath = '/home/daytona/project/deliverables/SIARM-Defense-Presentation.pptx'
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log(`✓ Created: ${outPath}`)
}).catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
