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
const EM   = '10B981'

const pres = new pptxgen()
pres.author  = 'James Murdza'
pres.company = 'IUGET Bonaberi'
pres.title   = 'SIARM  Smart Institution Academic Resource Management'
pres.layout  = 'LAYOUT_WIDE'

function newSlide() {
  const s = pres.addSlide()
  s.background = { fill: BG }
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.1, fill: { color: RED } })
  s.addShape('rect', { x: 0, y: 7.1, w: 13.33, h: 0.4, fill: { color: NAVY } })
  s.addText('SIARM  |  IUGET Bonaberi', { x: 0.4, y: 7.13, w: 8, h: 0.34, fontSize: 10, color: 'FFFFFF', fontFace: 'Calibri' })
  s.addText('Bachelor Project  |  2026', { x: 8.5, y: 7.13, w: 4.5, h: 0.34, fontSize: 10, color: 'FFFFFF', fontFace: 'Calibri', align: 'right' })
  return s
}

function slideTitle(s, t) {
  s.addText(t, { x: 0.5, y: 0.2, w: 12.3, h: 0.6, fontSize: 28, bold: true, color: NAVY, fontFace: 'Calibri' })
}

function diag(s, file, x, y, w, h) {
  const fp = path.join(DIAGRAM_DIR, file)
  if (fs.existsSync(fp)) s.addImage({ path: fp, x, y, w, h })
}

const logo = fs.existsSync(path.join(BRAND_DIR, 'iuget-logo-white.png'))
  ? path.join(BRAND_DIR, 'iuget-logo-white.png') : null

// 1. COVER
{
  const s = pres.addSlide()
  s.background = { fill: NAVY }
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.1, fill: { color: RED } })
  if (logo) s.addImage({ path: logo, x: 5.7, y: 0.6, w: 2, h: 2 })
  s.addText('SIARM', { x: 0.5, y: 3.5, w: 12.3, h: 1.5, fontSize: 110, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })
  s.addText('Smart Institution Academic Resource Management', { x: 0.5, y: 5.0, w: 12.3, h: 0.5, fontSize: 20, color: 'C7D2FE', align: 'center', fontFace: 'Calibri' })
  s.addText('James Murdza  |  Level 3 SWE  |  IUGET Bonaberi  |  2025 2026', { x: 0.5, y: 6.3, w: 12.3, h: 0.4, fontSize: 13, color: 'BFD4FE', align: 'center', fontFace: 'Calibri' })
}

// 2. STUDENT INFO
{
  const s = newSlide()
  slideTitle(s, 'Student Information')
  const info = [
    ['Name', 'James Murdza'],
    ['Department', 'Software Engineering'],
    ['Level', 'Level 3  |  Sixth Semester'],
    ['Matricule', 'IUGET/2026/SWE/0011'],
    ['Topic', 'SIARM: Smart Institution Academic Resource Management'],
    ['Academic Year', '2025 / 2026'],
  ]
  info.forEach((d, i) => {
    const y = 1.3 + i * 0.85
    s.addShape('roundRect', { x: 0.6, y, w: 3.5, h: 0.65, fill: { color: NAVY }, rectRadius: 0.08 })
    s.addText(d[0], { x: 0.6, y, w: 3.5, h: 0.65, fontSize: 16, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
    s.addText(d[1], { x: 4.4, y, w: 8.4, h: 0.65, fontSize: 16, color: INK, valign: 'middle', fontFace: 'Calibri' })
  })
  s.addShape('roundRect', { x: 0.6, y: 6.5, w: 12.1, h: 0.45, fill: { color: 'EFF6FF' }, line: { color: NAVY, width: 1 }, rectRadius: 0.08 })
  s.addText('Affiliated with the University of Bamenda  |  IUGET Bonaberi Campus', { x: 0.6, y: 6.5, w: 12.1, h: 0.45, fontSize: 12, color: NAVY, align: 'center', valign: 'middle', fontFace: 'Calibri', bold: true })
}

// 3. BACKGROUND (simple cards, 1 word each)
{
  const s = newSlide()
  slideTitle(s, 'Background')
  const items = [
    ['Fragmented', 'Separate tools for grades, fees, attendance'],
    ['Manual', 'Paper roll call, typed transcripts'],
    ['Opaque', 'No real time KPIs for leadership'],
    ['Offline', 'Students lose access without internet'],
    ['Slow', 'Parents queue for hours to enrol'],
    ['Fraud', 'Paper receipts easily forged'],
  ]
  items.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3)
    const x = 0.5 + col * 4.25, y = 1.3 + row * 2.7
    s.addShape('roundRect', { x, y, w: 4, h: 2.4, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1.5 }, rectRadius: 0.12 })
    s.addShape('rect', { x, y, w: 4, h: 0.7, fill: { color: NAVY } })
    s.addText(it[0], { x, y, w: 4, h: 0.7, fontSize: 22, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
    s.addText(it[1], { x: x + 0.2, y: y + 0.8, w: 3.6, h: 1.5, fontSize: 14, color: INK, align: 'center', valign: 'top', fontFace: 'Calibri' })
  })
}

// 4. OBJECTIVES (short 1-liners)
{
  const s = newSlide()
  slideTitle(s, 'Objectives')
  const objs = [
    'Unified academic platform for IUGET',
    'Role aware architecture (Student, Lecturer, Staff, Admin, Parent)',
    '5 channel tuition payment with privacy guarantee',
    'Automated student enrolment from one form or CSV',
    'QR verifiable receipts, results, transcripts, ID cards',
    'Offline capable Progressive Web Application',
  ]
  objs.forEach((o, i) => {
    const y = 1.2 + i * 0.9
    s.addShape('roundRect', { x: 0.5, y, w: 0.5, h: 0.5, fill: { color: NAVY }, rectRadius: 0.1 })
    s.addText(`${i + 1}`, { x: 0.5, y, w: 0.5, h: 0.5, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
    s.addText(o, { x: 1.2, y: y + 0.05, w: 11.5, h: 0.5, fontSize: 16, color: INK, valign: 'middle', fontFace: 'Calibri' })
  })
}

// 5. LITERATURE REVIEW (2 cards, minimal)
{
  const s = newSlide()
  slideTitle(s, 'Literature Review')
  const refs = [
    ['Chen and Wang (2021)', 'Cloud SIS in developing countries', '40% faster enrolment', '60% fewer data errors'],
    ['Okafor and Eze (2022)', 'Mobile payment in African HE', '78% prefer mobile money', '62% want university integration'],
  ]
  refs.forEach((r, i) => {
    const x = 0.5 + i * 6.3
    s.addShape('roundRect', { x, y: 1.3, w: 5.9, h: 5.0, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1.5 }, rectRadius: 0.12 })
    s.addShape('rect', { x, y: 1.3, w: 5.9, h: 0.7, fill: { color: NAVY } })
    s.addText(r[0], { x, y: 1.3, w: 5.9, h: 0.7, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
    s.addText(r[1], { x: x + 0.3, y: 2.2, w: 5.3, h: 0.5, fontSize: 14, color: RED, italic: true, align: 'center', fontFace: 'Calibri' })
    s.addText(r[2], { x: x + 0.3, y: 3.2, w: 5.3, h: 0.5, fontSize: 28, bold: true, color: EM, align: 'center', fontFace: 'Calibri' })
    s.addText(r[2].replace('% faster enrolment', ''), { x: x + 0.3, y: 3.6, w: 5.3, h: 0.4, fontSize: 13, color: GRAY, align: 'center', fontFace: 'Calibri' })
  })
}

// 6. METHODOLOGY (just Sprint names on timeline, no descriptions)
{
  const s = newSlide()
  slideTitle(s, 'Methodology  |  5 Sprints (Agile Scrumban)')
  s.addShape('line', { x: 0.8, y: 3.8, w: 11.7, h: 0, line: { color: NAVY, width: 2.5 } })
  const sprints = ['S1\nFoundations', 'S2\nStudent & Lecturer', 'S3\nStaff & Admin', 'S4\nParent Portal', 'S5\nPolish & Defence']
  sprints.forEach((sp, i) => {
    const x = 0.8 + i * 2.45
    s.addShape('ellipse', { x: x - 0.22, y: 3.6, w: 0.45, h: 0.45, fill: { color: i === 0 ? RED : NAVY } })
    s.addShape('roundRect', { x: x - 0.9, y: 4.3, w: 2.2, h: 1.2, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1.5 }, rectRadius: 0.1 })
    s.addText(sp, { x: x - 0.9, y: 4.3, w: 2.2, h: 1.2, fontSize: 14, bold: true, color: NAVY, align: 'center', valign: 'middle', fontFace: 'Calibri' })
  })
  s.addText('Reason: Requirements evolved weekly. Waterfall would have locked a stale specification. Agile allowed mid course corrections.', { x: 0.5, y: 5.8, w: 12.3, h: 0.7, fontSize: 13, color: INK, align: 'center', fontFace: 'Calibri' })
}

// 7. USE CASE DIAGRAM (full page)
{
  const s = newSlide()
  slideTitle(s, 'Use Case Diagram')
  diag(s, '03-use-case.png', 0.5, 1.0, 12.3, 6.0)
}

// 8. SYSTEM ARCHITECTURE (full page)
{
  const s = newSlide()
  slideTitle(s, 'System Architecture')
  diag(s, '01-architecture.png', 0.8, 1.0, 11.7, 5.8)
}

// 9. RESULTS (big numbers only)
{
  const s = newSlide()
  slideTitle(s, 'Results')
  const stats = [
    ['25/25', 'Tests Passed'],
    ['92', 'Performance'],
    ['96', 'Accessibility'],
    ['100', 'Best Practices'],
    ['100', 'SEO'],
    ['482 kB', 'Bundle Size'],
  ]
  stats.forEach((st, i) => {
    const col = i % 3, row = Math.floor(i / 3)
    const x = 0.5 + col * 4.25, y = 1.2 + row * 2.7
    s.addShape('roundRect', { x, y, w: 4, h: 2.4, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1.5 }, rectRadius: 0.12 })
    s.addText(st[0], { x, y: y + 0.2, w: 4, h: 1.4, fontSize: 60, bold: true, color: NAVY, align: 'center', valign: 'middle', fontFace: 'Calibri' })
    s.addText(st[1], { x, y: y + 1.6, w: 4, h: 0.5, fontSize: 16, color: INK, align: 'center', fontFace: 'Calibri' })
  })
}

// 10. FINDINGS & LIMITATIONS (short lists)
{
  const s = newSlide()
  slideTitle(s, 'Findings & Limitations')
  s.addShape('roundRect', { x: 0.5, y: 1.1, w: 6.0, h: 5.6, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1.5 }, rectRadius: 0.12 })
  s.addShape('rect', { x: 0.5, y: 1.1, w: 6.0, h: 0.6, fill: { color: EM } })
  s.addText('Findings', { x: 0.5, y: 1.1, w: 6.0, h: 0.6, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
  const finds = ['6 problems identified, all addressed', '5 role architecture effective', 'Mobile money integration achievable', 'PWA delivers offline capability', 'Automated enrolment works']
  finds.forEach((f, i) => s.addText('  ' + f, { x: 0.7, y: 1.9 + i * 0.75, w: 5.6, h: 0.5, fontSize: 14, color: INK, fontFace: 'Calibri' }))

  s.addShape('roundRect', { x: 6.8, y: 1.1, w: 6.0, h: 5.6, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1.5 }, rectRadius: 0.12 })
  s.addShape('rect', { x: 6.8, y: 1.1, w: 6.0, h: 0.6, fill: { color: RED } })
  s.addText('Limitations', { x: 6.8, y: 1.1, w: 6.0, h: 0.6, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Calibri' })
  const lims = ['Chat uses mock data, not real time', 'Payment flows are simulations', 'Mock API, no persistent DB', 'Tested with ~50 students only']
  lims.forEach((l, i) => s.addText('  ' + l, { x: 7.0, y: 1.9 + i * 0.75, w: 5.6, h: 0.5, fontSize: 14, color: INK, fontFace: 'Calibri' }))
}

// 11. FUTURE WORK (short)
{
  const s = newSlide()
  slideTitle(s, 'Future Work')
  const items = ['Native Mobile Apps', 'Biometric Attendance', 'Live Payment APIs', 'Multi Tenant SaaS', 'Exam Scheduling', 'Library Module']
  items.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3)
    const x = 0.5 + col * 4.25, y = 1.3 + row * 2.7
    s.addShape('roundRect', { x, y, w: 4, h: 2.4, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1.5 }, rectRadius: 0.12 })
    s.addShape('rect', { x, y, w: 0.5, h: 2.4, fill: { color: RED } })
    s.addText(it, { x, y, w: 4, h: 2.4, fontSize: 20, bold: true, color: NAVY, align: 'center', valign: 'middle', fontFace: 'Calibri' })
  })
}

// 12. CONCLUSION (short)
{
  const s = newSlide()
  slideTitle(s, 'Conclusion')
  s.addShape('roundRect', { x: 0.5, y: 1.2, w: 12.3, h: 4.5, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 2 }, rectRadius: 0.15 })
  s.addText('SIARM consolidates admissions, attendance, timetable, results, transcripts, ID cards, tuition payment, financial tracking, and parent registration into a single role aware web platform.', { x: 1.0, y: 1.5, w: 11.3, h: 1.2, fontSize: 16, color: INK, align: 'center', valign: 'middle', fontFace: 'Calibri' })
  s.addShape('line', { x: 2.0, y: 2.9, w: 9.3, h: 0, line: { color: GRAY, width: 1 } })
  s.addText('All 8 specific objectives achieved. 25/25 tests passing. Ready for IUGET pilot.', { x: 1.0, y: 3.2, w: 11.3, h: 0.6, fontSize: 16, bold: true, color: NAVY, align: 'center', fontFace: 'Calibri' })
  s.addText('Affiliated with the University of Bamenda', { x: 1.0, y: 4.0, w: 11.3, h: 0.5, fontSize: 14, color: GRAY, align: 'center', fontFace: 'Calibri' })
}

// 13. Q&A
{
  const s = pres.addSlide()
  s.background = { fill: NAVY }
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.1, fill: { color: RED } })
  if (logo) s.addImage({ path: logo, x: 5.7, y: 0.8, w: 2, h: 2 })
  s.addText('Thank You', { x: 0.5, y: 3.2, w: 12.3, h: 1.3, fontSize: 96, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Calibri' })
  s.addText('Open for Questions', { x: 0.5, y: 4.6, w: 12.3, h: 0.6, fontSize: 28, color: 'C7D2FE', italic: true, align: 'center', fontFace: 'Calibri' })
  s.addText('James Murdza  |  Level 3 SWE  |  IUGET Bonaberi', { x: 0.5, y: 6.4, w: 12.3, h: 0.4, fontSize: 13, color: 'BFD4FE', align: 'center', fontFace: 'Calibri' })
}

pres.writeFile({ fileName: OUT_FILE })
  .then(() => console.log('PPTX written: ' + OUT_FILE))
  .catch(err => console.error('PPTX error:', err))
