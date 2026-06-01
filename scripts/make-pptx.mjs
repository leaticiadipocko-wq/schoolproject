// SIARM defence PowerPoint — diagram-heavy, minimal text per slide.
// 24 slides, each anchored by an explanatory diagram or visual block.
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pptxgen = require('pptxgenjs')

const DIAGRAM_DIR = path.resolve(process.cwd(), 'deliverables/diagrams')
const BRAND_DIR   = path.resolve(process.cwd(), 'public/brand')
const OUT_FILE    = path.resolve(process.cwd(), 'deliverables/SIARM-Defense.pptx')

/* Palette aligned with the IUGET-branded app */
const NAVY = '1E3AA0'
const RED  = 'E63946'
const GRAY = '64748B'
const INK  = '1E293B'
const BG   = 'F8FAFC'
const AMB  = 'F59E0B'
const EM   = '10B981'

const pres = new pptxgen()
pres.author  = 'James Murdza'
pres.company = 'IUGET Bonabéri'
pres.title   = 'SIARM — Smart Institution Academic Resource Management'
pres.layout  = 'LAYOUT_WIDE'   // 13.33 × 7.5 in

/* ─── Master ──────────────────────────────────────────────── */
pres.defineSlideMaster({
  title: 'SIARM_MASTER',
  background: { color: BG },
  objects: [
    { rect: { x: 0, y: 0,    w: 13.33, h: 0.12, fill: { color: RED  } } },
    { rect: { x: 0, y: 7.1,  w: 13.33, h: 0.4,  fill: { color: NAVY } } },
    { text: { text: 'SIARM · IUGET Bonabéri',
              options: { x: 0.4, y: 7.13, w: 8, h: 0.34, fontSize: 10, color: 'FFFFFF', fontFace: 'Calibri' } } },
    { text: { text: 'Bachelor Project · 2026',
              options: { x: 8.5, y: 7.13, w: 4.5, h: 0.34, fontSize: 10, color: 'FFFFFF', fontFace: 'Calibri', align: 'right' } } },
  ],
  slideNumber: { x: 12.7, y: 7.15, w: 0.5, h: 0.3, fontSize: 10, color: 'FFFFFF', fontFace: 'Calibri', align: 'right' },
})

/* ─── helpers ─────────────────────────────────────────────── */
function newSlide(opts = {}) {
  return pres.addSlide({ masterName: 'SIARM_MASTER', ...opts })
}

function title(slide, t, sub = '') {
  slide.addText(t, { x: 0.5, y: 0.35, w: 12.3, h: 0.75, fontSize: 32, bold: true, color: NAVY, fontFace: 'Calibri' })
  if (sub) slide.addText(sub, { x: 0.5, y: 1.05, w: 12.3, h: 0.4, fontSize: 15, color: RED, italic: true, fontFace: 'Calibri' })
}

function image(slide, file, x, y, w, h) {
  const fp = path.join(DIAGRAM_DIR, file)
  if (!fs.existsSync(fp)) return
  slide.addImage({ path: fp, x, y, w, h })
}

function chip(slide, x, y, w, h, fill, txt, fs = 13, color = 'FFFFFF') {
  slide.addShape('roundRect', { x, y, w, h, fill: { color: fill }, line: { type: 'none' }, rectRadius: 0.08 })
  slide.addText(txt, { x, y, w, h, fontSize: fs, color, bold: true, align: 'center', valign: 'middle', fontFace: 'Calibri' })
}

function caption(slide, txt, y = 6.6) {
  slide.addText(txt, { x: 0.5, y, w: 12.3, h: 0.35, fontSize: 12, color: GRAY, italic: true, align: 'center', fontFace: 'Calibri' })
}

/* ─── 1. COVER ────────────────────────────────────────────── */
{
  const s = pres.addSlide()
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: NAVY }, line: { type: 'none' } })
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.12, fill: { color: RED }, line: { type: 'none' } })

  if (fs.existsSync(path.join(BRAND_DIR, 'iuget-logo-white.png'))) {
    s.addImage({ path: path.join(BRAND_DIR, 'iuget-logo-white.png'), x: 5.7, y: 0.7, w: 2, h: 2 })
  }
  s.addText('INSTITUT UNIVERSITAIRE DU GOLFE DE GUINÉE', { x: 0.5, y: 2.9, w: 12.3, h: 0.4, fontSize: 14, color: 'C7D2FE', bold: true, align: 'center', charSpacing: 3, fontFace: 'Calibri' })
  s.addText('« Bien choisir c\'est déjà réussir »', { x: 0.5, y: 3.25, w: 12.3, h: 0.35, fontSize: 12, color: 'BFD4FE', italic: true, align: 'center', fontFace: 'Calibri' })

  s.addText('SIARM', { x: 0.5, y: 3.9, w: 12.3, h: 1.5, fontSize: 110, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })
  s.addText('Smart Institution Academic Resource Management', { x: 0.5, y: 5.4, w: 12.3, h: 0.5, fontSize: 22, color: 'C7D2FE', align: 'center', fontFace: 'Calibri' })

  s.addText('James Murdza  ·  Level-3 Software Engineering  ·  2025–2026', { x: 0.5, y: 6.6, w: 12.3, h: 0.4, fontSize: 14, color: 'BFD4FE', align: 'center', fontFace: 'Calibri' })
}

/* ─── 2. OUTLINE (icons over short labels) ────────────────── */
{
  const s = newSlide()
  title(s, 'Defence outline', 'Five short acts · twenty-five minutes')

  const acts = [
    { n: '1', t: 'Context',        x: 0.6  },
    { n: '2', t: 'Design',         x: 3.1  },
    { n: '3', t: 'Implementation', x: 5.6  },
    { n: '4', t: 'Results',        x: 8.1  },
    { n: '5', t: 'Conclusion',     x: 10.6 },
  ]
  acts.forEach((a, i) => {
    s.addShape('roundRect', { x: a.x, y: 2.5, w: 2.1, h: 2.4, fill: { color: i === 0 ? RED : NAVY }, line: { type: 'none' }, rectRadius: 0.15 })
    s.addText(a.n, { x: a.x, y: 2.7, w: 2.1, h: 1, fontSize: 60, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })
    s.addText(a.t, { x: a.x, y: 4.0, w: 2.1, h: 0.6, fontSize: 16, color: 'FFFFFF', bold: true, align: 'center', fontFace: 'Calibri' })
    if (i < acts.length - 1) {
      s.addShape('line', { x: a.x + 2.15, y: 3.7, w: 0.3, h: 0, line: { color: GRAY, width: 2 } })
    }
  })
  caption(s, 'Each act is anchored by one or two diagrams.', 5.4)
}

/* ─── 3. PROBLEM (visual cards, very short text) ──────────── */
{
  const s = newSlide()
  title(s, 'Problem context', 'Six pains observed at IUGET today')
  const items = [
    ['Fragmented', 'Tools for grades, fees, timetable do not talk to each other.'],
    ['Manual',     'Roll-call on paper · grade sheets typed twice.'],
    ['Opaque',     'Leadership cannot see weekly KPIs in real time.'],
    ['Offline-poor','Students lose access when internet drops.'],
    ['Slow enrol', 'Parents queue at the bursary for hours.'],
    ['Forgeable',  'Paper receipts and transcripts are easily copied.'],
  ]
  items.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3)
    const x = 0.5 + col * 4.25, y = 1.7 + row * 2.4
    s.addShape('roundRect', { x, y, w: 4, h: 2.1, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1 }, rectRadius: 0.1 })
    s.addShape('rect', { x, y, w: 4, h: 0.5, fill: { color: NAVY }, line: { type: 'none' } })
    s.addText(it[0], { x, y, w: 4, h: 0.5, fontSize: 15, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
    s.addText(it[1], { x: x + 0.2, y: y + 0.6, w: 3.6, h: 1.4, fontSize: 13, color: INK, align: 'center', valign: 'middle', fontFace: 'Calibri' })
  })
}

/* ─── 4. OBJECTIVES (1 line each) ─────────────────────────── */
{
  const s = newSlide()
  title(s, 'Objectives', 'Six deliverables — defence-ready')
  const objs = [
    'Unified academic platform for IUGET — one app for everything operational.',
    'Role-aware information architecture — Student, Lecturer, Staff, Admin, Parent.',
    'End-to-end tuition payment — MoMo, OM, PayPal, Visa, Bank.',
    'Automated student enrolment — single form or CSV upload.',
    'Printable, QR-verifiable receipts · results · transcripts · ID cards.',
    'Offline-capable Progressive Web Application.',
  ]
  objs.forEach((o, i) => {
    const y = 1.7 + i * 0.85
    s.addShape('roundRect', { x: 0.6, y, w: 0.5, h: 0.5, fill: { color: NAVY }, line: { type: 'none' }, rectRadius: 0.1 })
    s.addText(`${i + 1}`, { x: 0.6, y, w: 0.5, h: 0.5, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
    s.addText(o, { x: 1.3, y: y + 0.05, w: 11.4, h: 0.5, fontSize: 16, color: INK, fontFace: 'Calibri' })
  })
}

/* ─── 5. METHODOLOGY (timeline) ───────────────────────────── */
{
  const s = newSlide()
  title(s, 'Methodology', 'Five sprints · one semester')
  const sprints = [
    ['S1', 'Foundations',  'Scaffolding · Auth · Design system'],
    ['S2', 'Student / Lecturer', 'Attendance · Timetable · Results · Transcripts · ID card'],
    ['S3', 'Staff / Admin', 'Users · Finance · Timetable builder · Announcements'],
    ['S4', 'Parent Portal', 'Wizard · Payment simulation · QR receipts'],
    ['S5', 'Polish',        'PWA · Accessibility · Documentation · Defence'],
  ]
  // Timeline line
  s.addShape('line', { x: 0.8, y: 4.3, w: 11.7, h: 0, line: { color: NAVY, width: 2 } })
  sprints.forEach((sp, i) => {
    const x = 0.8 + i * 2.45
    s.addShape('ellipse', { x: x - 0.18, y: 4.13, w: 0.4, h: 0.4, fill: { color: i === 0 ? RED : NAVY }, line: { color: 'FFFFFF', width: 2 } })
    s.addText(sp[0], { x: x - 0.18, y: 4.13, w: 0.4, h: 0.4, fontSize: 11, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
    s.addShape('roundRect', { x: x - 0.8, y: 4.7, w: 2.2, h: 1.5, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1 }, rectRadius: 0.1 })
    s.addText(sp[1], { x: x - 0.8, y: 4.75, w: 2.2, h: 0.45, fontSize: 13, bold: true, color: NAVY, align: 'center', fontFace: 'Calibri' })
    s.addText(sp[2], { x: x - 0.7, y: 5.2, w: 2.0, h: 1.0, fontSize: 11, color: INK, align: 'center', fontFace: 'Calibri' })
  })
  caption(s, 'Each one-week sprint produced shippable functionality.', 2.0)
}

/* ─── 6. SYSTEM ARCHITECTURE (diagram-first) ──────────────── */
{
  const s = newSlide()
  title(s, 'System architecture', 'Three-tier separation')
  image(s, '01-architecture.png', 1.5, 1.5, 10.3, 5)
  caption(s, 'Figure 4.1 — Presentation · Persistence · External services')
}

/* ─── 7. ENTITY-RELATIONSHIP DIAGRAM ──────────────────────── */
{
  const s = newSlide()
  title(s, 'Data model', 'Nine collections, hierarchical relationships')
  image(s, '02-erd.png', 1.5, 1.5, 10.3, 5)
  caption(s, 'Figure 4.2 — Entity-Relationship Diagram')
}

/* ─── 8. USE-CASE DIAGRAM ─────────────────────────────────── */
{
  const s = newSlide()
  title(s, 'Use-case view', 'Four authenticated roles + Parent (public)')
  image(s, '03-use-case.png', 1.5, 1.5, 10.3, 5)
  caption(s, 'Figure 4.3 — Use-case diagram')
}

/* ─── 9. AUTH SEQUENCE ────────────────────────────────────── */
{
  const s = newSlide()
  title(s, 'Authentication sequence', 'Firebase Auth · JSON Web Token · role guard')
  image(s, '04-sequence-login.png', 1.5, 1.5, 10.3, 5)
  caption(s, 'Figure 4.4 — Login sequence diagram')
}

/* ─── 10. COMPONENT DIAGRAM ───────────────────────────────── */
{
  const s = newSlide()
  title(s, 'Component view', 'React decomposition — pages / containers / shared')
  image(s, '05-component.png', 1.5, 1.5, 10.3, 5)
  caption(s, 'Figure 4.5 — Component diagram of the front-end')
}

/* ─── 11. DATA-FLOW PAYMENT ───────────────────────────────── */
{
  const s = newSlide()
  title(s, 'Data flow — tuition payment', 'Credentials never persisted')
  image(s, '06-data-flow.png', 1.5, 1.5, 10.3, 5)
  caption(s, 'Figure 4.6 — Privacy by construction')
}

/* ─── 12. DEPLOYMENT ──────────────────────────────────────── */
{
  const s = newSlide()
  title(s, 'Deployment topology', 'CDN edge · Firebase managed services')
  image(s, '07-deployment.png', 1.5, 1.5, 10.3, 5)
  caption(s, 'Figure 4.7 — Production deployment')
}

/* ─── 13. TECH STACK GRID ─────────────────────────────────── */
{
  const s = newSlide()
  title(s, 'Technology stack', 'Lean, well-supported, free')

  const stack = [
    { row: 'Front-end', items: ['React 18', 'Vite 5', 'Tailwind CSS 3', 'React Router 6', 'Recharts', 'Lucide'] },
    { row: 'Back-end',  items: ['Firebase Auth', 'Cloud Firestore', 'Vercel CDN'] },
    { row: 'Documents', items: ['jsPDF', 'html2canvas', 'docx', 'pptxgenjs'] },
    { row: 'Offline',   items: ['vite-plugin-pwa', 'Workbox', 'LocalStorage cache'] },
  ]

  let y = 1.7
  stack.forEach((row) => {
    s.addShape('roundRect', { x: 0.5, y, w: 2.2, h: 0.85, fill: { color: NAVY }, line: { type: 'none' }, rectRadius: 0.1 })
    s.addText(row.row, { x: 0.5, y, w: 2.2, h: 0.85, fontSize: 16, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
    row.items.forEach((it, i) => {
      const x = 3.0 + i * 1.65
      s.addShape('roundRect', { x, y: y + 0.08, w: 1.55, h: 0.7, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1 }, rectRadius: 0.1 })
      s.addText(it, { x, y: y + 0.08, w: 1.55, h: 0.7, fontSize: 12, color: INK, align: 'center', valign: 'middle', fontFace: 'Calibri' })
    })
    y += 1.1
  })
}

/* ─── 14. THREE SPECIALTIES (visual) ──────────────────────── */
{
  const s = newSlide()
  title(s, 'IUGET Bachelor specialties', 'Same evening + Saturday grid for all three')

  const specs = [
    { code: 'SWE',  full: 'Software Engineering',                  color: NAVY, accent: '3B6DF5' },
    { code: 'CNSM', full: 'Computer Networks & Multimedia Systems',color: RED,  accent: 'F87171' },
    { code: 'BST',  full: 'Business Strategy & Technology',        color: AMB,  accent: 'FBBF24' },
  ]
  specs.forEach((sp, i) => {
    const x = 0.6 + i * 4.25
    s.addShape('roundRect', { x, y: 1.7, w: 4, h: 4.5, fill: { color: 'FFFFFF' }, line: { color: sp.color, width: 2 }, rectRadius: 0.15 })
    s.addShape('rect', { x, y: 1.7, w: 4, h: 1.5, fill: { color: sp.color }, line: { type: 'none' } })
    s.addText(sp.code, { x, y: 1.8, w: 4, h: 0.8, fontSize: 36, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })
    s.addText(sp.full, { x: x + 0.2, y: 2.6, w: 3.6, h: 0.5, fontSize: 13, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })

    const meta = [
      '3 years · 6 semesters',
      '500,000 FCFA / year',
      'Mon-Fri 18:00–22:00',
      'Saturday 08:00–17:00',
    ]
    meta.forEach((m, j) => {
      s.addText('•  ' + m, { x: x + 0.4, y: 3.4 + j * 0.55, w: 3.4, h: 0.45, fontSize: 13, color: INK, fontFace: 'Calibri' })
    })
  })
}

/* ─── 15. PARENT FLOW (full image) ────────────────────────── */
{
  const s = newSlide()
  title(s, 'Parent registration flow', 'Five steps · zero account required')
  image(s, '08-parent-flow.png', 1.5, 1.5, 10.3, 5)
  caption(s, 'Figure 5.1 — Public Parent Portal flow')
}

/* ─── 16. PAYMENT SIMULATION (image) ──────────────────────── */
{
  const s = newSlide()
  title(s, 'Payment simulation', 'Same pipeline · five channels')
  image(s, '09-payment-flow.png', 1.5, 1.5, 10.3, 5)
  caption(s, 'Figure 5.2 — MoMo · OM · PayPal · Visa · Bank')
}

/* ─── 17. PRIVACY GUARANTEE (callout, very few words) ─────── */
{
  const s = newSlide()
  title(s, 'Privacy guarantee', 'Implemented as code')

  // Big block with code-style line
  s.addShape('roundRect', { x: 1.0, y: 1.8, w: 11.3, h: 4.3, fill: { color: '0F172A' }, line: { type: 'none' }, rectRadius: 0.15 })
  s.addText('// after the simulated provider call', { x: 1.5, y: 2.2, w: 10, h: 0.4, fontSize: 18, color: '94A3B8', fontFace: 'Consolas, monospace' })
  s.addText('setPwd(\'\')   // PIN / password erased from memory', { x: 1.5, y: 2.7, w: 10, h: 0.5, fontSize: 28, color: '86EFAC', bold: true, fontFace: 'Consolas, monospace' })

  s.addText('🛡  No PIN, password or card data is ever persisted.', { x: 1.5, y: 4.3, w: 10, h: 0.5, fontSize: 22, color: 'FFFFFF', bold: true, fontFace: 'Calibri' })
  s.addText('The privacy notice is printed in the modal and on every receipt.', { x: 1.5, y: 5.0, w: 10, h: 0.5, fontSize: 16, color: 'BFD4FE', italic: true, fontFace: 'Calibri' })

  caption(s, 'A defining authenticity touch — no academic SIS surveyed offered this.')
}

/* ─── 18. AUTOMATED ENROLMENT (image) ─────────────────────── */
{
  const s = newSlide()
  title(s, 'Automated student enrolment', 'Two modes · one pipeline')
  image(s, '10-enrolment-flow.png', 1.5, 1.5, 10.3, 5)
  caption(s, 'Figure 5.3 — Single form or bulk CSV')
}

/* ─── 19. FINANCIAL TRACKING (visual) ─────────────────────── */
{
  const s = newSlide()
  title(s, 'Financial tracking', 'Bursary dashboard — what staff see')

  // KPI strip
  const kpis = [
    { label: 'Collected',  value: '8.2 M FCFA', color: EM   },
    { label: 'Outstanding', value: '1.4 M FCFA', color: AMB },
    { label: 'Fully paid', value: '14 students', color: NAVY },
    { label: 'Recovery',   value: '92 %',        color: RED  },
  ]
  kpis.forEach((k, i) => {
    const x = 0.5 + i * 3.2
    s.addShape('roundRect', { x, y: 1.7, w: 2.9, h: 1.2, fill: { color: k.color }, line: { type: 'none' }, rectRadius: 0.12 })
    s.addText(k.label, { x, y: 1.8, w: 2.9, h: 0.4, fontSize: 12, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })
    s.addText(k.value, { x, y: 2.15, w: 2.9, h: 0.7, fontSize: 22, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })
  })

  // Visual: monthly trend bars (mock)
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']
  const heights = [3.0, 2.4, 3.5, 1.6, 4.2, 3.1, 2.6, 2.1, 2.0]
  s.addText('Monthly collection trend  (FCFA M)', { x: 0.5, y: 3.2, w: 12.3, h: 0.4, fontSize: 14, bold: true, color: INK, fontFace: 'Calibri' })
  heights.forEach((h, i) => {
    const x = 0.8 + i * 1.4
    s.addShape('rect', { x, y: 6.4 - h * 0.5, w: 1.0, h: h * 0.5, fill: { color: NAVY }, line: { type: 'none' } })
    s.addText(months[i], { x: x - 0.2, y: 6.45, w: 1.4, h: 0.3, fontSize: 11, color: INK, align: 'center', fontFace: 'Calibri' })
    s.addText(h.toString(), { x: x - 0.2, y: 6.4 - h * 0.5 - 0.4, w: 1.4, h: 0.3, fontSize: 11, bold: true, color: NAVY, align: 'center', fontFace: 'Calibri' })
  })
}

/* ─── 20. PRINTABLE ARTEFACTS (visual grid) ───────────────── */
{
  const s = newSlide()
  title(s, 'Four printable artefacts', 'Each carries a verification QR')

  const docs = [
    { name: 'Registration receipt', url: 'verify.iuget.cm/{matricule}/{ref}' },
    { name: 'Results statement',    url: 'verify.iuget.cm/results/{matricule}' },
    { name: 'Official transcript',  url: 'verify.iuget.cm/transcript/{matricule}' },
    { name: 'Student ID card',      url: 'verify.iuget.cm/{matricule}' },
  ]
  docs.forEach((d, i) => {
    const col = i % 2, row = Math.floor(i / 2)
    const x = 0.6 + col * 6.3, y = 1.8 + row * 2.5
    s.addShape('roundRect', { x, y, w: 5.9, h: 2.3, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1 }, rectRadius: 0.12 })
    // Mock QR (just a stylised checkered box)
    s.addShape('rect', { x: x + 0.4, y: y + 0.4, w: 1.5, h: 1.5, fill: { color: NAVY }, line: { type: 'none' } })
    s.addShape('rect', { x: x + 0.65, y: y + 0.65, w: 1.0, h: 1.0, fill: { color: 'FFFFFF' }, line: { type: 'none' } })
    s.addShape('rect', { x: x + 0.85, y: y + 0.85, w: 0.6, h: 0.6, fill: { color: NAVY }, line: { type: 'none' } })
    s.addText(d.name, { x: x + 2.1, y: y + 0.45, w: 3.6, h: 0.5, fontSize: 18, bold: true, color: NAVY, fontFace: 'Calibri' })
    s.addText(d.url,  { x: x + 2.1, y: y + 1.0,  w: 3.6, h: 0.5, fontSize: 13, color: INK, fontFace: 'Consolas, monospace' })
    s.addText('PDF · Print · QR-verifiable', { x: x + 2.1, y: y + 1.5, w: 3.6, h: 0.4, fontSize: 12, color: GRAY, italic: true, fontFace: 'Calibri' })
  })
}

/* ─── 21. TESTING ─────────────────────────────────────────── */
{
  const s = newSlide()
  title(s, 'Testing summary', '25 functional tests · 25 pass')

  // Big stat
  s.addShape('roundRect', { x: 0.5, y: 1.8, w: 4, h: 4.5, fill: { color: EM }, line: { type: 'none' }, rectRadius: 0.15 })
  s.addText('25 / 25', { x: 0.5, y: 2.4, w: 4, h: 1.8, fontSize: 96, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })
  s.addText('Functional tests', { x: 0.5, y: 4.6, w: 4, h: 0.5, fontSize: 18, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })
  s.addText('All PASS', { x: 0.5, y: 5.2, w: 4, h: 0.5, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })

  // Lighthouse cards
  const lh = [
    { name: 'Performance',     v: '92',  color: AMB },
    { name: 'Accessibility',   v: '96',  color: EM  },
    { name: 'Best Practices',  v: '100', color: EM  },
    { name: 'SEO',             v: '100', color: EM  },
  ]
  lh.forEach((c, i) => {
    const col = i % 2, row = Math.floor(i / 2)
    const x = 5.0 + col * 4, y = 1.8 + row * 2.3
    s.addShape('roundRect', { x, y, w: 3.7, h: 2, fill: { color: 'FFFFFF' }, line: { color: c.color, width: 2 }, rectRadius: 0.1 })
    s.addText(c.v, { x, y: y + 0.2, w: 3.7, h: 1, fontSize: 48, bold: true, color: c.color, align: 'center', fontFace: 'Calibri' })
    s.addText(c.name, { x, y: y + 1.3, w: 3.7, h: 0.5, fontSize: 14, color: INK, align: 'center', fontFace: 'Calibri' })
  })
  caption(s, 'Lighthouse audit of the production build · 482 kB gzipped')
}

/* ─── 22. SCALABILITY ─────────────────────────────────────── */
{
  const s = newSlide()
  title(s, 'Scalability', 'Architecture survives 1 K → 100 K students')

  const tiers = [
    { range: '1 — 100 users',    cost: 'Free',     who: 'IUGET demo / pilot',    color: EM   },
    { range: '100 — 3 000 users', cost: '50–200 USD/month', who: 'IUGET Bonabéri production', color: NAVY },
    { range: '3 K — 100 K users', cost: '~ 2 USD / user / year', who: 'Multi-institution SaaS',  color: RED  },
  ]
  tiers.forEach((t, i) => {
    const y = 1.9 + i * 1.6
    s.addShape('roundRect', { x: 0.6, y, w: 12.1, h: 1.3, fill: { color: 'FFFFFF' }, line: { color: t.color, width: 2 }, rectRadius: 0.12 })
    s.addShape('rect', { x: 0.6, y, w: 3.4, h: 1.3, fill: { color: t.color }, line: { type: 'none' } })
    s.addText(t.range, { x: 0.6, y, w: 3.4, h: 1.3, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
    s.addText(t.cost,  { x: 4.2, y: y + 0.1, w: 4, h: 1.1, fontSize: 18, bold: true, color: t.color, valign: 'middle', fontFace: 'Calibri' })
    s.addText(t.who,   { x: 8.3, y: y + 0.1, w: 4.3, h: 1.1, fontSize: 14, color: INK, valign: 'middle', fontFace: 'Calibri' })
  })
  caption(s, 'Same code base · stateless front-end · serverless persistence', 6.8)
}

/* ─── 23. KEY ACHIEVEMENTS ────────────────────────────────── */
{
  const s = newSlide()
  title(s, 'Achievements', 'Six concrete deliverables')

  const ach = [
    { n: '53',    l: 'source files' },
    { n: '24',    l: 'pages' },
    { n: '14',    l: 'reusable components' },
    { n: '10',    l: 'architectural diagrams' },
    { n: '5',     l: 'payment channels' },
    { n: '4',     l: 'QR-verifiable artefacts' },
  ]
  ach.forEach((a, i) => {
    const col = i % 3, row = Math.floor(i / 3)
    const x = 0.6 + col * 4.25, y = 1.8 + row * 2.3
    s.addShape('roundRect', { x, y, w: 4, h: 2, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1 }, rectRadius: 0.12 })
    s.addText(a.n, { x, y: y + 0.2, w: 4, h: 1, fontSize: 60, bold: true, color: NAVY, align: 'center', fontFace: 'Calibri' })
    s.addText(a.l, { x, y: y + 1.4, w: 4, h: 0.5, fontSize: 14, color: INK, align: 'center', fontFace: 'Calibri' })
  })
}

/* ─── 24. FUTURE WORK ─────────────────────────────────────── */
{
  const s = newSlide()
  title(s, 'Future work', 'Beyond the bachelor defence')
  const items = [
    ['Native mobile companions',    'React Native · 80% shared code with web'],
    ['Biometric attendance',        'Fingerprint roll-call on Android'],
    ['Live MoMo / OM integration',  'Wire simulated flows to provider APIs'],
    ['Multi-tenant SaaS',           'Per-institution branding, fees, timetables'],
    ['Exam scheduling',             'Clash-free generation, room + invigilator'],
    ['Library management',          'Catalogue, borrowing, reservations'],
  ]
  items.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2)
    const x = 0.6 + col * 6.3, y = 1.8 + row * 1.5
    s.addShape('roundRect', { x, y, w: 5.9, h: 1.2, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1 }, rectRadius: 0.1 })
    s.addShape('rect', { x, y, w: 0.5, h: 1.2, fill: { color: RED }, line: { type: 'none' } })
    s.addText(it[0], { x: x + 0.7, y: y + 0.1, w: 5.2, h: 0.5, fontSize: 16, bold: true, color: NAVY, fontFace: 'Calibri' })
    s.addText(it[1], { x: x + 0.7, y: y + 0.6, w: 5.2, h: 0.5, fontSize: 13, color: INK, italic: true, fontFace: 'Calibri' })
  })
}

/* ─── 25. THANK YOU / Q&A ─────────────────────────────────── */
{
  const s = pres.addSlide()
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: NAVY }, line: { type: 'none' } })
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.12, fill: { color: RED }, line: { type: 'none' } })

  if (fs.existsSync(path.join(BRAND_DIR, 'iuget-logo-white.png'))) {
    s.addImage({ path: path.join(BRAND_DIR, 'iuget-logo-white.png'), x: 5.7, y: 0.8, w: 2, h: 2 })
  }

  s.addText('Thank you.', { x: 0.5, y: 3.2, w: 12.3, h: 1.3, fontSize: 96, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })
  s.addText('Questions?', { x: 0.5, y: 4.6, w: 12.3, h: 0.6, fontSize: 28, color: 'C7D2FE', italic: true, align: 'center', fontFace: 'Calibri' })

  s.addText('James Murdza  ·  Level-3 SWE  ·  IUGET Bonabéri', { x: 0.5, y: 6.4, w: 12.3, h: 0.4, fontSize: 14, color: 'BFD4FE', align: 'center', fontFace: 'Calibri' })
}

/* ─── write file ─────────────────────────────────────────── */
pres.writeFile({ fileName: OUT_FILE })
  .then(() => console.log(`✓ PPTX written: ${OUT_FILE}`))
  .catch((e) => { console.error(e); process.exit(1) })
