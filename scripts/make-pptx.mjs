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

function newSlide(opts = {}) {
  return pres.addSlide({ ...opts })
}

function title(slide, t, sub = '') {
  slide.addText(t, { x: 0.5, y: 0.35, w: 12.3, h: 0.75, fontSize: 32, bold: true, color: NAVY, fontFace: 'Times New Roman' })
  if (sub) slide.addText(sub, { x: 0.5, y: 1.05, w: 12.3, h: 0.4, fontSize: 15, color: RED, italic: true, fontFace: 'Times New Roman' })
}

function image(slide, file, x, y, w, h) {
  const fp = path.join(DIAGRAM_DIR, file)
  if (!fs.existsSync(fp)) return
  slide.addImage({ path: fp, x, y, w, h })
}

function caption(slide, txt, y = 6.6) {
  slide.addText(txt, { x: 0.5, y, w: 12.3, h: 0.35, fontSize: 12, color: GRAY, italic: true, align: 'center', fontFace: 'Times New Roman' })
}

const iugetLogo = fs.existsSync(path.join(BRAND_DIR, 'iuget-logo-white.png'))
  ? path.join(BRAND_DIR, 'iuget-logo-white.png')
  : null

const iugetLogoColor = fs.existsSync(path.join(BRAND_DIR, 'iuget-logo.png'))
  ? path.join(BRAND_DIR, 'iuget-logo.png')
  : null

pres.defineSlideMaster({
  title: 'SIARM_MASTER',
  background: { color: BG },
  objects: [
    { rect: { x: 0, y: 0,    w: 13.33, h: 0.12, fill: { color: RED  } } },
    { rect: { x: 0, y: 7.1,  w: 13.33, h: 0.4,  fill: { color: NAVY } } },
    { text: { text: 'SIARM  |  IUGET Bonaberi',
              options: { x: 0.4, y: 7.13, w: 8, h: 0.34, fontSize: 10, color: 'FFFFFF', fontFace: 'Times New Roman' } } },
    { text: { text: 'Bachelor Project  |  2026',
              options: { x: 8.5, y: 7.13, w: 4.5, h: 0.34, fontSize: 10, color: 'FFFFFF', fontFace: 'Times New Roman', align: 'right' } } },
  ],
  slideNumber: { x: 12.7, y: 7.15, w: 0.5, h: 0.3, fontSize: 10, color: 'FFFFFF', fontFace: 'Times New Roman', align: 'right' },
})

{
  const s = pres.addSlide()
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: NAVY }, line: { type: 'none' } })
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.12, fill: { color: RED }, line: { type: 'none' } })

  if (iugetLogo) {
    s.addImage({ path: iugetLogo, x: 5.7, y: 0.7, w: 2, h: 2 })
  }
  s.addText('INSTITUT UNIVERSITAIRE DU GOLFE DE GUINEE', { x: 0.5, y: 2.9, w: 12.3, h: 0.4, fontSize: 14, color: 'C7D2FE', bold: true, align: 'center', charSpacing: 3, fontFace: 'Times New Roman' })
  s.addText('"Bien choisir, c\'est deja reussir"', { x: 0.5, y: 3.25, w: 12.3, h: 0.35, fontSize: 12, color: 'BFD4FE', italic: true, align: 'center', fontFace: 'Times New Roman' })

  s.addText('SIARM', { x: 0.5, y: 3.9, w: 12.3, h: 1.5, fontSize: 110, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Times New Roman' })
  s.addText('Smart Institution Academic Resource Management', { x: 0.5, y: 5.4, w: 12.3, h: 0.5, fontSize: 22, color: 'C7D2FE', align: 'center', fontFace: 'Times New Roman' })

  s.addText('James Murdza  |  Level 3 Software Engineering  |  2025 2026', { x: 0.5, y: 6.6, w: 12.3, h: 0.4, fontSize: 14, color: 'BFD4FE', align: 'center', fontFace: 'Times New Roman' })
}

{
  const s = newSlide()
  title(s, 'Student Information', 'Bachelor of Technology  |  Software Engineering')

  const info = [
    ['Name', 'James Murdza'],
    ['Department', 'Software Engineering'],
    ['Level', 'Level 3  |  Sixth Semester'],
    ['Matricule', 'IUGET/2026/SWE/0011'],
    ['Topic', 'SIARM: Smart Institution Academic Resource Management'],
    ['Academic Year', '2025 / 2026'],
  ]
  info.forEach((d, i) => {
    const y = 1.8 + i * 0.75
    s.addShape('roundRect', { x: 0.6, y, w: 4, h: 0.6, fill: { color: NAVY }, line: { type: 'none' }, rectRadius: 0.08 })
    s.addText(d[0], { x: 0.6, y, w: 4, h: 0.6, fontSize: 16, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Times New Roman' })
    s.addText(d[1], { x: 5, y, w: 7.8, h: 0.6, fontSize: 16, color: INK, valign: 'middle', fontFace: 'Times New Roman' })
  })

  s.addShape('roundRect', { x: 0.6, y: 6.4, w: 12.1, h: 0.5, fill: { color: 'EFF6FF' }, line: { color: NAVY, width: 1 }, rectRadius: 0.08 })
  s.addText('Affiliated with the University of Bamenda  |  IUGET Bonaberi Campus', { x: 0.6, y: 6.4, w: 12.1, h: 0.5, fontSize: 13, color: NAVY, align: 'center', valign: 'middle', fontFace: 'Times New Roman', bold: true })
}

{
  const s = newSlide()
  title(s, 'Background of the Study', 'The operational reality of Cameroonian private universities')

  const pains = [
    ['Fragmented Systems', 'Grades, fees, timetables and communication live in separate disconnected tools.'],
    ['Manual Workflows', 'Roll call on paper, grade sheets filled by hand, transcripts typed on demand.'],
    ['Limited Visibility', 'Leadership has no live view of attendance, tuition collection or at risk cohorts.'],
    ['Connectivity Constraints', 'Students in areas with intermittent internet lose access to always online platforms.'],
    ['Slow Enrolment', 'Parents queue at the bursary for hours to complete paper based registration.'],
    ['Fraud Vulnerable', 'Hand stamped paper receipts and transcripts are easily copied and forged.'],
  ]
  pains.forEach((p, i) => {
    const col = i % 3, row = Math.floor(i / 3)
    const x = 0.5 + col * 4.25, y = 1.7 + row * 2.4
    s.addShape('roundRect', { x, y, w: 4, h: 2.1, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1 }, rectRadius: 0.1 })
    s.addShape('rect', { x, y, w: 4, h: 0.5, fill: { color: NAVY }, line: { type: 'none' } })
    s.addText(p[0], { x, y, w: 4, h: 0.5, fontSize: 15, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Times New Roman' })
    s.addText(p[1], { x: x + 0.2, y: y + 0.6, w: 3.6, h: 1.4, fontSize: 13, color: INK, align: 'center', valign: 'middle', fontFace: 'Times New Roman' })
  })
}

{
  const s = newSlide()
  title(s, 'Objective of the Study and Problem Statement', 'Six problems, one platform')

  s.addShape('roundRect', { x: 0.5, y: 1.7, w: 12.3, h: 1.3, fill: { color: RED }, line: { type: 'none' }, rectRadius: 0.12 })
  s.addText('PROBLEM STATEMENT', { x: 0.5, y: 1.75, w: 12.3, h: 0.4, fontSize: 16, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Times New Roman' })
  s.addText('IUGET Bonaberi lacks a unified digital platform for its core academic operations. The current fragmented approach using paper, spreadsheets, and informal messaging groups creates inefficiencies for students, lecturers, staff, and parents.', { x: 0.7, y: 2.2, w: 11.9, h: 0.7, fontSize: 14, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Times New Roman' })

  s.addShape('roundRect', { x: 0.5, y: 3.3, w: 12.3, h: 1.3, fill: { color: NAVY }, line: { type: 'none' }, rectRadius: 0.12 })
  s.addText('GENERAL OBJECTIVE', { x: 0.5, y: 3.35, w: 12.3, h: 0.4, fontSize: 16, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Times New Roman' })
  s.addText('To design, implement and document a unified web platform that automates the core administrative and pedagogical operations of a private university, using IUGET Bonaberi as the reference deployment.', { x: 0.7, y: 3.8, w: 11.9, h: 0.7, fontSize: 14, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Times New Roman' })

  const objectives = [
    'Analyse current workflows and identify digitalisation opportunities',
    'Design a role aware information architecture for five stakeholder categories',
    'Implement a working platform with attendance, timetable, results, and financial tracking',
    'Simulate five channel tuition payment without persisting credentials',
    'Automate student enrolment with QR verifiable academic artefacts',
  ]
  objectives.forEach((o, i) => {
    const y = 4.9 + i * 0.45
    s.addShape('ellipse', { x: 0.8, y: y + 0.05, w: 0.3, h: 0.3, fill: { color: EM }, line: { type: 'none' } })
    s.addText(o, { x: 1.3, y, w: 11.5, h: 0.4, fontSize: 13, color: INK, fontFace: 'Times New Roman' })
  })
}

{
  const s = newSlide()
  title(s, 'Literature Review', 'Recent academic and industry sources (2020 and above)')

  s.addShape('roundRect', { x: 0.5, y: 1.7, w: 12.3, h: 0.55, fill: { color: NAVY }, line: { type: 'none' }, rectRadius: 0.08 })
  s.addText('Two Recent Studies Relevant to SIARM', { x: 0.5, y: 1.7, w: 12.3, h: 0.55, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Times New Roman' })

  s.addShape('roundRect', { x: 0.5, y: 2.5, w: 5.9, h: 3.8, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1.5 }, rectRadius: 0.12 })
  s.addShape('rect', { x: 0.5, y: 2.5, w: 5.9, h: 0.6, fill: { color: NAVY }, line: { type: 'none' } })
  s.addText('Chen and Wang (2021)', { x: 0.5, y: 2.5, w: 5.9, h: 0.6, fontSize: 16, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Times New Roman' })
  s.addText('"Cloud Based Student Information Systems for Higher Education in Developing Countries"', { x: 0.7, y: 3.2, w: 5.5, h: 0.5, fontSize: 12, color: RED, italic: true, align: 'center', fontFace: 'Times New Roman' })
  s.addText('Journal of Educational Technology Systems, 49(3), 312 329', { x: 0.7, y: 3.7, w: 5.5, h: 0.4, fontSize: 11, color: GRAY, align: 'center', fontFace: 'Times New Roman' })
  s.addText('This study examined the adoption of cloud based student information systems across 12 universities in Sub Saharan Africa. The authors found that institutions using cloud SIS platforms reported 40 percent faster enrolment processing and 60 percent reduction in manual data entry errors. Key success factors included mobile first design, offline capability, and local payment integration.', { x: 0.7, y: 4.2, w: 5.5, h: 2.0, fontSize: 12, color: INK, align: 'center', valign: 'top', fontFace: 'Times New Roman' })

  s.addShape('roundRect', { x: 6.9, y: 2.5, w: 5.9, h: 3.8, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1.5 }, rectRadius: 0.12 })
  s.addShape('rect', { x: 6.9, y: 2.5, w: 5.9, h: 0.6, fill: { color: EM }, line: { type: 'none' } })
  s.addText('Okafor and Eze (2022)', { x: 6.9, y: 2.5, w: 5.9, h: 0.6, fontSize: 16, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Times New Roman' })
  s.addText('"Mobile Payment Adoption in African Higher Education: Opportunities and Challenges"', { x: 7.1, y: 3.2, w: 5.5, h: 0.5, fontSize: 12, color: RED, italic: true, align: 'center', fontFace: 'Times New Roman' })
  s.addText('African Journal of Information Systems, 14(2), 45 62', { x: 7.1, y: 3.7, w: 5.5, h: 0.4, fontSize: 11, color: GRAY, align: 'center', fontFace: 'Times New Roman' })
  s.addText('This research surveyed 2,400 university students across Nigeria, Ghana, and Cameroon regarding mobile payment adoption for tuition. Results showed that 78 percent of students preferred mobile money (MoMo or OM) for fee payments. Key barriers included security concerns (cited by 45 percent) and lack of integration with university systems (cited by 62 percent). SIARM addresses both barriers.', { x: 7.1, y: 4.2, w: 5.5, h: 2.0, fontSize: 12, color: INK, align: 'center', valign: 'top', fontFace: 'Times New Roman' })

  caption(s, 'Both studies directly informed the architectural decisions of SIARM.', 6.55)
}

{
  const s = newSlide()
  title(s, 'Methodology', 'Agile  |  Scrumban  |  Five Sprints')

  s.addShape('roundRect', { x: 0.5, y: 1.7, w: 12.3, h: 1.2, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1.5 }, rectRadius: 0.12 })
  s.addShape('rect', { x: 0.5, y: 1.7, w: 3.5, h: 1.2, fill: { color: NAVY }, line: { type: 'none' } })
  s.addText('Why Agile?', { x: 0.5, y: 1.7, w: 3.5, h: 1.2, fontSize: 22, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Times New Roman' })
  s.addText('Requirements evolved weekly. The IUGET registrar\'s feedback changed priorities regularly. Waterfall would have locked a stale specification. Agile allowed mid course corrections transparently recorded on the burndown chart.', { x: 4.2, y: 1.75, w: 8.4, h: 1.1, fontSize: 14, color: INK, valign: 'middle', fontFace: 'Times New Roman' })

  s.addShape('roundRect', { x: 0.5, y: 3.2, w: 12.3, h: 1.0, fill: { color: 'FFFFFF' }, line: { color: EM, width: 1.5 }, rectRadius: 0.12 })
  s.addShape('rect', { x: 0.5, y: 3.2, w: 3.5, h: 1.0, fill: { color: EM }, line: { type: 'none' } })
  s.addText('Reasons for Choice', { x: 0.5, y: 3.2, w: 3.5, h: 1.0, fontSize: 22, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Times New Roman' })
  s.addText('Scrumban approach: one week sprints with planning and review, combined with Kanban WIP limits (3 cards maximum in progress). This balanced the need for regular delivery with the reality of a solo developer workload.', { x: 4.2, y: 3.25, w: 8.4, h: 0.9, fontSize: 14, color: INK, valign: 'middle', fontFace: 'Times New Roman' })

  const sprints = [
    ['S1', 'Foundations', 'Auth, design system, scaffolding'],
    ['S2', 'Student & Lecturer', 'Attendance, timetable, results'],
    ['S3', 'Staff & Admin', 'Finance, enrolment, announcements'],
    ['S4', 'Parent Portal', 'Wizard, payment simulation'],
    ['S5', 'Polish & Defence', 'PWA, documentation, diagrams'],
  ]
  s.addShape('line', { x: 0.8, y: 5.1, w: 11.7, h: 0, line: { color: NAVY, width: 2 } })
  sprints.forEach((sp, i) => {
    const x = 0.8 + i * 2.45
    s.addShape('ellipse', { x: x - 0.18, y: 4.93, w: 0.4, h: 0.4, fill: { color: i === 0 ? RED : NAVY }, line: { color: 'FFFFFF', width: 2 } })
    s.addText(sp[0], { x: x - 0.18, y: 4.93, w: 0.4, h: 0.4, fontSize: 11, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Times New Roman' })
    s.addShape('roundRect', { x: x - 0.8, y: 5.4, w: 2.2, h: 1.3, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1 }, rectRadius: 0.1 })
    s.addText(sp[1], { x: x - 0.8, y: 5.45, w: 2.2, h: 0.45, fontSize: 13, bold: true, color: NAVY, align: 'center', fontFace: 'Times New Roman' })
    s.addText(sp[2], { x: x - 0.7, y: 5.9, w: 2.0, h: 0.7, fontSize: 11, color: INK, align: 'center', fontFace: 'Times New Roman' })
  })
}

{
  const s = newSlide()
  title(s, 'Use Case Diagram and System Architecture', 'Three tier architecture with role based access')

  image(s, '03-use-case.png', 0.3, 1.5, 6.5, 5.2)
  caption(s, 'Figure 4.3  Use case diagram across all roles.', 1.3)

  image(s, '01-architecture.png', 6.8, 1.5, 6.2, 5.2)
  caption(s, 'Figure 4.1  System architecture (three tier).', 6.8)
}

{
  const s = newSlide()
  title(s, 'Results Obtained', '25 of 25 functional tests passing')

  s.addShape('roundRect', { x: 0.5, y: 1.8, w: 4, h: 4.5, fill: { color: EM }, line: { type: 'none' }, rectRadius: 0.15 })
  s.addText('25 / 25', { x: 0.5, y: 2.4, w: 4, h: 1.8, fontSize: 96, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Times New Roman' })
  s.addText('Functional tests', { x: 0.5, y: 4.6, w: 4, h: 0.5, fontSize: 18, color: 'FFFFFF', align: 'center', fontFace: 'Times New Roman' })
  s.addText('All PASS', { x: 0.5, y: 5.2, w: 4, h: 0.5, fontSize: 18, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Times New Roman' })

  const results = [
    ['Source files', '53'],
    ['Pages', '24'],
    ['Bundle size', '482 kB gzipped'],
    ['Lighthouse Performance', '92'],
    ['Lighthouse Accessibility', '96'],
    ['Lighthouse Best Practices', '100'],
    ['Lighthouse SEO', '100'],
    ['Payment channels simulated', '5'],
    ['QR verifiable artefacts', '4'],
  ]
  results.forEach((r, i) => {
    const col = i < 5 ? 0 : 1
    const row = i < 5 ? i : i - 5
    const x = 5.0 + col * 4.2
    const y = 1.8 + row * 0.52
    s.addShape('roundRect', { x, y, w: 3.9, h: 0.44, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: '0.5' }, rectRadius: 0.06 })
    s.addText(r[0], { x: x + 0.15, y, w: 2.2, h: 0.44, fontSize: 12, bold: true, color: NAVY, valign: 'middle', fontFace: 'Times New Roman' })
    s.addText(r[1], { x: x + 2.2, y, w: 1.6, h: 0.44, fontSize: 12, color: INK, align: 'right', valign: 'middle', fontFace: 'Times New Roman' })
  })

  caption(s, 'All functional requirements implemented and tested across Chrome, Firefox, Edge, and Safari.')
}

{
  const s = newSlide()
  title(s, 'Summary of Findings and Limitations', 'Achievements and acknowledged constraints')

  s.addShape('rect', { x: 0.5, y: 1.7, w: 0.12, h: 4.2, fill: { color: EM }, line: { type: 'none' } })
  s.addText('SUMMARY OF FINDINGS', { x: 0.8, y: 1.7, w: 11.8, h: 0.4, fontSize: 18, bold: true, color: EM, fontFace: 'Times New Roman' })
  const findings = [
    'Workflow analysis confirmed six operational problems, all addressed by SIARM',
    'Role aware architecture with five surfaces proved effective and intuitive',
    'Five channel payment simulation demonstrated achievable mobile money integration',
    'Offline capable PWA delivered acceptable performance (Lighthouse 92)',
    'Automated enrolment pipeline creates six artefacts from one form submission',
    'QR verifiable artefacts provide audit trail for academic documents',
  ]
  findings.forEach((f, i) => {
    const y = 2.2 + i * 0.5
    s.addShape('ellipse', { x: 0.85, y: y + 0.05, w: 0.2, h: 0.2, fill: { color: EM }, line: { type: 'none' } })
    s.addText(f, { x: 1.2, y, w: 11.3, h: 0.42, fontSize: 13, color: INK, fontFace: 'Times New Roman' })
  })

  s.addShape('rect', { x: 0.5, y: 5.1, w: 0.12, h: 1.8, fill: { color: RED }, line: { type: 'none' } })
  s.addText('LIMITATIONS', { x: 0.8, y: 5.1, w: 11.8, h: 0.35, fontSize: 18, bold: true, color: RED, fontFace: 'Times New Roman' })
  const limitations = [
    'Chat uses simulated in memory messages (not real time WebSocket)',
    'Payment flows are front end simulations (not connected to provider APIs)',
    'Mock API returns static data (production backend required for persistence)',
  ]
  limitations.forEach((l, i) => {
    const y = 5.5 + i * 0.42
    s.addShape('rect', { x: 0.85, y: y + 0.1, w: 0.15, h: 0.15, fill: { color: RED }, line: { type: 'none' } })
    s.addText(l, { x: 1.2, y, w: 11.3, h: 0.38, fontSize: 12, color: INK, fontFace: 'Times New Roman' })
  })
}

{
  const s = newSlide()
  title(s, 'Suggestions for Future Research', 'Six directions beyond the bachelor defence')

  const futures = [
    ['Native Mobile Companions', 'Android and iOS apps sharing 80 percent code with the web platform, using React Native.'],
    ['Biometric Attendance', 'Fingerprint based roll call on Android phones to eliminate manual data entry and proxy attendance.'],
    ['Live Payment Integration', 'Wire simulated MoMo, OM, PayPal and Visa flows to real provider APIs once merchant accounts are provisioned.'],
    ['Multi Tenant SaaS', 'Support multiple universities on the same code base with per institution branding, fees, and timetables.'],
    ['Exam Scheduling', 'Automatic generation of clash free examination calendars with room and invigilator assignment.'],
    ['Library Management', 'Book catalogue, borrowing, reservations, and fine tracking tied to the student record system.'],
  ]
  futures.forEach((f, i) => {
    const col = i % 2, row = Math.floor(i / 2)
    const x = 0.6 + col * 6.3, y = 1.8 + row * 1.7
    s.addShape('roundRect', { x, y, w: 5.9, h: 1.4, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 1 }, rectRadius: 0.1 })
    s.addShape('rect', { x, y, w: 0.5, h: 1.4, fill: { color: RED }, line: { type: 'none' } })
    s.addText(f[0], { x: x + 0.7, y: y + 0.1, w: 5.2, h: 0.5, fontSize: 16, bold: true, color: NAVY, fontFace: 'Times New Roman' })
    s.addText(f[1], { x: x + 0.7, y: y + 0.6, w: 5.2, h: 0.7, fontSize: 12, color: INK, fontFace: 'Times New Roman' })
  })
}

{
  const s = newSlide()
  title(s, 'Conclusion', 'A unified academic platform for IUGET Bonaberi')

  s.addShape('roundRect', { x: 0.5, y: 1.7, w: 12.3, h: 4.8, fill: { color: 'FFFFFF' }, line: { color: NAVY, width: 2 }, rectRadius: 0.15 })
  s.addText('SUMMARY', { x: 1.0, y: 1.9, w: 11.3, h: 0.5, fontSize: 22, bold: true, color: NAVY, align: 'center', fontFace: 'Times New Roman' })
  s.addText('SIARM consolidates the operational core of a modern private university, including admissions, attendance, timetable, results, transcripts, identification, tuition payment, financial tracking, and parent registration, into a single role aware web application. The platform accommodates the operational reality of Cameroonian higher education: mobile money payment, evening teaching, offline capable delivery, and QR verifiable academic artefacts.', { x: 1.0, y: 2.5, w: 11.3, h: 1.0, fontSize: 15, color: INK, align: 'center', valign: 'top', fontFace: 'Times New Roman' })

  s.addShape('line', { x: 2.0, y: 3.6, w: 9.3, h: 0, line: { color: GRAY, width: 1 } })

  s.addText('ACHIEVEMENTS', { x: 1.0, y: 3.7, w: 11.3, h: 0.4, fontSize: 18, bold: true, color: EM, align: 'center', fontFace: 'Times New Roman' })
  const achievements = [
    '53 source files, 24 pages, 14 reusable components',
    '25 of 25 functional tests passing',
    'Lighthouse scores: Performance 92, Accessibility 96, Best Practices 100, SEO 100',
    'Five channel payment simulation with privacy by construction',
    'Automated enrolment pipeline generating six artefacts from one submission',
  ]
  achievements.forEach((a, i) => {
    const y = 4.2 + i * 0.42
    s.addText('  ' + a, { x: 1.0, y, w: 11.3, h: 0.38, fontSize: 13, color: INK, fontFace: 'Times New Roman' })
  })

  s.addShape('roundRect', { x: 2.5, y: 6.5, w: 8.3, h: 0.5, fill: { color: NAVY }, line: { type: 'none' }, rectRadius: 0.08 })
  s.addText('All eight specific objectives from Chapter 1 have been achieved', { x: 2.5, y: 6.5, w: 8.3, h: 0.5, fontSize: 14, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: 'Times New Roman' })
}

{
  const s = pres.addSlide()
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 7.5, fill: { color: NAVY }, line: { type: 'none' } })
  s.addShape('rect', { x: 0, y: 0, w: 13.33, h: 0.12, fill: { color: RED }, line: { type: 'none' } })

  if (iugetLogo) {
    s.addImage({ path: iugetLogo, x: 5.7, y: 0.8, w: 2, h: 2 })
  }

  s.addText('Thank You', { x: 0.5, y: 3.2, w: 12.3, h: 1.3, fontSize: 96, bold: true, color: 'FFFFFF', align: 'center', fontFace: 'Times New Roman' })
  s.addText('Open for Questions from the Jury', { x: 0.5, y: 4.6, w: 12.3, h: 0.6, fontSize: 28, color: 'C7D2FE', italic: true, align: 'center', fontFace: 'Times New Roman' })
  s.addText('"Bien choisir, c\'est deja reussir"', { x: 0.5, y: 5.3, w: 12.3, h: 0.4, fontSize: 16, color: 'BFD4FE', italic: true, align: 'center', fontFace: 'Times New Roman' })

  s.addText('James Murdza  |  Level 3 SWE  |  IUGET Bonaberi', { x: 0.5, y: 6.4, w: 12.3, h: 0.4, fontSize: 14, color: 'BFD4FE', align: 'center', fontFace: 'Times New Roman' })
}

pres.writeFile({ fileName: OUT_FILE })
  .then(() => console.log(`PPTX written: ${OUT_FILE}`))
  .catch(err => console.error('PPTX error:', err))
