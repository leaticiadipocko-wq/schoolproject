import pptxgen from 'pptxgenjs'

const pptx = new pptxgen()
pptx.layout = 'LAYOUT_16x9'
pptx.author = 'James Murdza — IUGET Bonabéri'
pptx.title = 'SIARM Defense Presentation'

const BRAND = '1e3aa0'
const ACCENT = 'e63946'
const DARK = '0f172a'
const WHITE = 'ffffff'
const GRAY = '64748b'
const GREEN = '059669'
const PURPLE = '7c3aed'
const CYAN = '0891b2'
const ORANGE = 'd97706'
const PINK = 'ec4899'
const LIGHT = 'f8fafc'

const HEADING = { fontFace: 'Arial', fontSize: 28, bold: true, color: DARK }
const SMALL = { fontFace: 'Arial', fontSize: 11, color: GRAY }

function footer(s, n, total) {
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 5.2, w: '100%', h: 0.4, fill: { color: DARK } })
  s.addText('SIARM — IUGET Bonabéri', { x: 0.5, y: 5.22, w: 4, h: 0.35, ...SMALL, color: '94a3b8' })
  s.addText(`${n} / ${total}`, { x: 8, y: 5.22, w: 1.5, h: 0.35, ...SMALL, color: '94a3b8', align: 'right' })
}

function section(title, sub, icon, n, total) {
  const s = pptx.addSlide()
  s.background = { fill: BRAND }
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.8, w: 1.2, h: 1.2, fill: { color: ACCENT }, rectRadius: 0.15 })
  s.addText(icon, { x: 0.5, y: 1.8, w: 1.2, h: 1.2, fontFace: 'Arial', fontSize: 48, color: WHITE, align: 'center', valign: 'middle' })
  s.addText(title, { x: 2, y: 1.8, w: 7, h: 0.8, fontFace: 'Arial', fontSize: 40, bold: true, color: WHITE })
  s.addText(sub, { x: 2, y: 2.8, w: 7, h: 0.6, fontFace: 'Arial', fontSize: 18, color: 'cbd5e1' })
  footer(s, n, total)
}

function iconBox(s, x, y, w, h, icon, label, desc, color) {
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color }, rectRadius: 0.12, shadow: { type: 'outer', blur: 6, offset: 2, color: '000000', opacity: 0.15 } })
  s.addText(icon, { x, y: y + 0.15, w, h: 0.6, fontFace: 'Arial', fontSize: 28, color: WHITE, align: 'center' })
  s.addText(label, { x, y: y + 0.7, w, h: 0.4, fontFace: 'Arial', fontSize: 12, bold: true, color: WHITE, align: 'center' })
  if (desc) s.addText(desc, { x: x + 0.15, y: y + 1.0, w: w - 0.3, h: 0.5, fontFace: 'Arial', fontSize: 9, color: 'e2e8f0', align: 'center', valign: 'top' })
}

function flowArrow(s, startX, y, items, color) {
  const boxW = 1.8, gap = 0.4
  items.forEach((item, i) => {
    const x = startX + i * (boxW + gap)
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w: boxW, h: 1.2, fill: { color }, rectRadius: 0.1 })
    s.addText(item.icon, { x, y: y + 0.1, w: boxW, h: 0.4, fontFace: 'Arial', fontSize: 20, color: WHITE, align: 'center' })
    s.addText(item.label, { x, y: y + 0.5, w: boxW, h: 0.6, fontFace: 'Arial', fontSize: 10, color: WHITE, align: 'center', valign: 'top' })
    if (i < items.length - 1) s.addText('→', { x: x + boxW, y: y + 0.3, w: gap, h: 0.6, fontFace: 'Arial', fontSize: 24, color: GRAY, align: 'center', valign: 'middle' })
  })
}

const TOTAL = 50

// SLIDE 1: Title
{
  const s = pptx.addSlide()
  s.background = { fill: DARK }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 4.5, w: '100%', h: 1.1, fill: { color: BRAND } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 0.5, w: 1.5, h: 1.5, fill: { color: BRAND }, rectRadius: 0.2 })
  s.addText('🎓', { x: 0.5, y: 0.5, w: 1.5, h: 1.5, fontFace: 'Arial', fontSize: 48, color: WHITE, align: 'center', valign: 'middle' })
  s.addText('SIARM', { x: 2.3, y: 0.6, w: 7, h: 1, fontFace: 'Arial', fontSize: 60, bold: true, color: WHITE })
  s.addText('Smart Institution\nAcademic Resource Management', { x: 2.3, y: 1.5, w: 7, h: 0.8, fontFace: 'Arial', fontSize: 18, color: '94a3b8', lineSpacingMultiple: 1.3 })
  s.addShape(pptx.shapes.RECTANGLE, { x: 2.3, y: 2.6, w: 3, h: 0.04, fill: { color: ACCENT } })
  s.addText('Bachelor of Technology — Software Engineering', { x: 2.3, y: 2.8, w: 7, h: 0.4, fontFace: 'Arial', fontSize: 14, color: '64748b' })
  s.addText('👨‍🎓  James Murdza  •  Level 3 SWE  •  IUGET Bonabéri, Douala', { x: 2.3, y: 3.3, w: 7, h: 0.4, fontFace: 'Arial', fontSize: 13, color: '94a3b8' })
  s.addText('📅  Academic Year 2025/2026', { x: 2.3, y: 3.8, w: 7, h: 0.4, fontFace: 'Arial', fontSize: 13, color: '64748b' })
  s.addText('« Bien choisir c\'est déjà réussir » — IUGET', { x: 0.5, y: 4.6, w: 9, h: 0.4, fontFace: 'Arial', fontSize: 12, italic: true, color: WHITE, align: 'center' })
}

// SLIDE 2: TOC
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('📋  Table of Contents', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const toc = [
    { num: '01', label: 'Problem & Motivation', icon: '❓', color: ACCENT },
    { num: '02', label: 'Objectives', icon: '🎯', color: BRAND },
    { num: '03', label: 'Architecture', icon: '🏗️', color: GREEN },
    { num: '04', label: 'Features', icon: '⚡', color: PURPLE },
    { num: '05', label: 'User Roles', icon: '👥', color: CYAN },
    { num: '06', label: 'Database', icon: '🗄️', color: ORANGE },
    { num: '07', label: 'UI/UX Design', icon: '🎨', color: PINK },
    { num: '08', label: 'Security', icon: '🔒', color: 'dc2626' },
    { num: '09', label: 'Walkthrough', icon: '🖥️', color: BRAND },
    { num: '10', label: 'Results', icon: '📊', color: GREEN },
  ]
  toc.forEach((item, i) => {
    const col = i % 5, row = Math.floor(i / 5)
    const x = 0.7 + col * 1.8, y = 1.3 + row * 2
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w: 1.6, h: 1.6, fill: { color: item.color }, rectRadius: 0.12, shadow: { type: 'outer', blur: 4, offset: 2, color: '000000', opacity: 0.1 } })
    s.addText(item.icon, { x, y: y + 0.2, w: 1.6, h: 0.6, fontFace: 'Arial', fontSize: 28, color: WHITE, align: 'center' })
    s.addText(item.num, { x, y: y + 0.7, w: 1.6, h: 0.3, fontFace: 'Arial', fontSize: 10, color: 'ffffff80', align: 'center' })
    s.addText(item.label, { x, y: y + 1.0, w: 1.6, h: 0.5, fontFace: 'Arial', fontSize: 10, bold: true, color: WHITE, align: 'center' })
  })
  footer(s, 2, TOTAL)
}

// SLIDE 3: Section
section('Problem Statement', 'Why SIARM was built', '❓', 3, TOTAL)

// SLIDE 4: Before/After
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('❌  BEFORE vs ✅  AFTER (SIARM)', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.2, w: 4, h: 3.7, fill: { color: 'fef2f2' }, rectRadius: 0.12, line: { color: 'fecaca', width: 1 } })
  s.addText('❌  BEFORE', { x: 0.7, y: 1.3, w: 4, h: 0.5, fontFace: 'Arial', fontSize: 14, bold: true, color: 'dc2626', align: 'center' })
  const before = ['Paper attendance sheets', 'Manual grade compilation', 'No central student portal', 'Physical fee receipts only', 'No parent visibility', 'Manual MINESUP reports']
  before.forEach((item, i) => s.addText(`✗  ${item}`, { x: 1, y: 1.9 + i * 0.5, w: 3.5, h: 0.4, fontFace: 'Arial', fontSize: 11, color: '991b1b' }))
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 5.2, y: 1.2, w: 4, h: 3.7, fill: { color: 'f0fdf4' }, rectRadius: 0.12, line: { color: 'bbf7d0', width: 1 } })
  s.addText('✅  AFTER (SIARM)', { x: 5.2, y: 1.3, w: 4, h: 0.5, fontFace: 'Arial', fontSize: 14, bold: true, color: GREEN, align: 'center' })
  const after = ['Digital attendance tracking', 'Automated grade management', '24/7 online student portal', 'Instant digital payments', 'Parent portal for tracking', 'One-click MINESUP export']
  after.forEach((item, i) => s.addText(`✓  ${item}`, { x: 5.5, y: 1.9 + i * 0.5, w: 3.5, h: 0.4, fontFace: 'Arial', fontSize: 11, color: '166534' }))
  footer(s, 4, TOTAL)
}

// SLIDE 5: Motivation (Visual)
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🎯  Motivation & Vision', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const goals = [
    { icon: '📱', label: 'Digitize', desc: 'Full student lifecycle', color: BRAND },
    { icon: '🌐', label: 'Unify', desc: 'One platform for all', color: GREEN },
    { icon: '⚡', label: 'Real-time', desc: 'Instant data access', color: PURPLE },
    { icon: '📄', label: 'Paperless', desc: '90% less paperwork', color: CYAN },
    { icon: '🌍', label: 'Bilingual', desc: 'EN/FR support', color: ORANGE },
    { icon: '📶', label: 'Offline', desc: 'Works without internet', color: PINK },
  ]
  goals.forEach((g, i) => iconBox(s, 0.7 + (i % 3) * 3, 1.3 + Math.floor(i / 3) * 2, 2.6, 1.7, g.icon, g.label, g.desc, g.color))
  footer(s, 5, TOTAL)
}

// SLIDE 6: Section
section('Project Objectives', 'What SIARM aims to achieve', '🎯', 6, TOTAL)

// SLIDE 7: Objectives (Grid)
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🎯  Project Objectives', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const obj = [
    { icon: '✅', label: 'Attendance', color: BRAND }, { icon: '📊', label: 'Grades', color: GREEN },
    { icon: '💰', label: 'Payments', color: ORANGE }, { icon: '📅', label: 'Timetable', color: PURPLE },
    { icon: '🆔', label: 'ID Cards', color: CYAN }, { icon: '📚', label: 'Learning', color: PINK },
    { icon: '👥', label: 'Roles', color: 'dc2626' }, { icon: '👨‍👩‍👦', label: 'Parents', color: BRAND },
    { icon: '📈', label: 'Analytics', color: GREEN }, { icon: '🏛️', label: 'MINESUP', color: ORANGE },
    { icon: '📶', label: 'Offline', color: PURPLE }, { icon: '🌐', label: 'Bilingual', color: CYAN },
  ]
  obj.forEach((o, i) => {
    const x = 0.7 + (i % 4) * 2.25, y = 1.3 + Math.floor(i / 4) * 1.35
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w: 2, h: 1.1, fill: { color: o.color }, rectRadius: 0.1, shadow: { type: 'outer', blur: 3, offset: 1, color: '000000', opacity: 0.1 } })
    s.addText(o.icon, { x, y: y + 0.1, w: 2, h: 0.5, fontFace: 'Arial', fontSize: 22, color: WHITE, align: 'center' })
    s.addText(o.label, { x, y: y + 0.6, w: 2, h: 0.4, fontFace: 'Arial', fontSize: 11, bold: true, color: WHITE, align: 'center' })
  })
  footer(s, 7, TOTAL)
}

// SLIDE 8: Section
section('Literature Review', 'Existing solutions & gaps', '📖', 8, TOTAL)

// SLIDE 9: Existing Solutions
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('📖  Existing Solutions & Gaps', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const sol = [
    { name: 'Moodle', icon: '📚', pros: 'LMS', cons: 'No fees', color: ORANGE },
    { name: 'Google Class', icon: '🏫', pros: 'Simple', cons: 'No admin', color: GREEN },
    { name: 'SAP/Oracle', icon: '💼', pros: 'Complete', cons: 'Expensive', color: PURPLE },
    { name: 'Excel', icon: '📊', pros: 'Flexible', cons: 'No validation', color: CYAN },
    { name: 'Paper', icon: '📄', pros: 'Simple', cons: 'Lost data', color: GRAY },
  ]
  sol.forEach((item, i) => {
    const x = 0.7 + i * 1.8
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 1.3, w: 1.6, h: 2.8, fill: { color: 'f8fafc' }, rectRadius: 0.1, line: { color: 'e2e8f0', width: 1 } })
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x + 0.3, y: 1.5, w: 1, h: 1, fill: { color: item.color }, rectRadius: 0.15 })
    s.addText(item.icon, { x: x + 0.3, y: 1.5, w: 1, h: 1, fontFace: 'Arial', fontSize: 28, color: WHITE, align: 'center', valign: 'middle' })
    s.addText(item.name, { x, y: 2.6, w: 1.6, h: 0.4, fontFace: 'Arial', fontSize: 11, bold: true, color: DARK, align: 'center' })
    s.addText(`✓ ${item.pros}`, { x, y: 3.0, w: 1.6, h: 0.3, fontFace: 'Arial', fontSize: 9, color: GREEN, align: 'center' })
    s.addText(`✗ ${item.cons}`, { x, y: 3.3, w: 1.6, h: 0.3, fontFace: 'Arial', fontSize: 9, color: 'dc2626', align: 'center' })
  })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.5, y: 4.3, w: 7, h: 0.7, fill: { color: 'fef2f2' }, rectRadius: 0.1, line: { color: ACCENT, width: 1.5 } })
  s.addText('⚠️  GAP: No affordable, all-in-one platform for African universities', { x: 1.5, y: 4.3, w: 7, h: 0.7, fontFace: 'Arial', fontSize: 13, bold: true, color: ACCENT, align: 'center', valign: 'middle' })
  footer(s, 9, TOTAL)
}

// SLIDE 10: SIARM Solution (Hub diagram)
{
  const s = pptx.addSlide()
  s.background = { fill: DARK }
  s.addText('✨  SIARM: The Unified Solution', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING, color: WHITE })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const features = [
    { icon: '📋', label: 'Attendance', color: BRAND }, { icon: '📊', label: 'Grades', color: GREEN },
    { icon: '📅', label: 'Timetable', color: PURPLE }, { icon: '💰', label: 'Fees', color: ORANGE },
    { icon: '📚', label: 'Learning', color: CYAN }, { icon: '💬', label: 'Discuss', color: PINK },
    { icon: '🆔', label: 'ID Card', color: 'dc2626' }, { icon: '📈', label: 'Analytics', color: BRAND },
  ]
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.5, y: 2, w: 3, h: 1.5, fill: { color: BRAND }, rectRadius: 0.2 })
  s.addText('🎓\nSIARM\nAll-in-One', { x: 3.5, y: 2, w: 3, h: 1.5, fontFace: 'Arial', fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle', lineSpacingMultiple: 1.3 })
  features.forEach((f, i) => {
    const angle = (i / features.length) * Math.PI * 2
    const x = 5 + 3.5 * Math.cos(angle) - 0.6, y = 2.75 + 1.8 * Math.sin(angle) - 0.4
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w: 1.2, h: 0.9, fill: { color: f.color }, rectRadius: 0.1 })
    s.addText(f.icon, { x, y: y + 0.05, w: 1.2, h: 0.45, fontFace: 'Arial', fontSize: 16, color: WHITE, align: 'center' })
    s.addText(f.label, { x, y: y + 0.5, w: 1.2, h: 0.3, fontFace: 'Arial', fontSize: 8, color: WHITE, align: 'center' })
  })
  footer(s, 10, TOTAL)
}

// SLIDE 11: Section
section('System Architecture', 'How SIARM is built', '🏗️', 11, TOTAL)

// SLIDE 12: Architecture (Layered)
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🏗️  High-Level Architecture', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 1.3, w: 9, h: 0.8, fill: { color: 'dbeafe' }, rectRadius: 0.1 })
  s.addText('👨‍🎓👩‍🏫👨‍💼👨‍💻  Users (Students, Lecturers, Staff, Admins)', { x: 0.5, y: 1.3, w: 9, h: 0.8, fontFace: 'Arial', fontSize: 14, bold: true, color: BRAND, align: 'center', valign: 'middle' })
  s.addText('⬇️', { x: 4.5, y: 2.1, w: 1, h: 0.5, fontFace: 'Arial', fontSize: 24, color: GRAY, align: 'center' })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 2.6, w: 9, h: 0.8, fill: { color: BRAND }, rectRadius: 0.1 })
  s.addText('⚛️  React 18 + Vite + Tailwind CSS  •  PWA (Service Worker)', { x: 0.5, y: 2.6, w: 9, h: 0.8, fontFace: 'Arial', fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  s.addText('⬇️', { x: 4.5, y: 3.4, w: 1, h: 0.5, fontFace: 'Arial', fontSize: 24, color: GRAY, align: 'center' })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5, y: 3.9, w: 9, h: 0.8, fill: { color: ORANGE }, rectRadius: 0.1 })
  s.addText('🔥  Firebase  •  Auth  •  Firestore  •  Storage  •  Real-time Sync', { x: 0.5, y: 3.9, w: 9, h: 0.8, fontFace: 'Arial', fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  footer(s, 12, TOTAL)
}

// SLIDE 13: Component Architecture
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🧩  Component Architecture', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 2, y: 1.2, w: 6, h: 0.7, fill: { color: DARK }, rectRadius: 0.1 })
  s.addText('📱  App.jsx  —  All Routes', { x: 2, y: 1.2, w: 6, h: 0.7, fontFace: 'Arial', fontSize: 13, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  const providers = [{ label: '🌐 Language', color: CYAN }, { label: '🔐 Auth', color: GREEN }, { label: '📦 Data', color: PURPLE }]
  providers.forEach((p, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 2.5 + i * 2, y: 2.1, w: 1.8, h: 0.6, fill: { color: p.color }, rectRadius: 0.08 })
    s.addText(p.label, { x: 2.5 + i * 2, y: 2.1, w: 1.8, h: 0.6, fontFace: 'Arial', fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  })
  s.addText('⬇️', { x: 4.5, y: 2.7, w: 1, h: 0.4, fontFace: 'Arial', fontSize: 18, color: GRAY, align: 'center' })
  const comps = [{ label: '📄 Pages\n40+', color: BRAND }, { label: '🧩 UI\nReusable', color: '0891b2' }, { label: '🔧 Lib\nUtils', color: GREEN }, { label: '🔀 Router\nGuards', color: 'dc2626' }]
  comps.forEach((c, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.5 + i * 2.1, y: 3.2, w: 1.9, h: 1, fill: { color: c.color }, rectRadius: 0.1 })
    s.addText(c.label, { x: 1.5 + i * 2.1, y: 3.2, w: 1.9, h: 1, fontFace: 'Arial', fontSize: 11, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  })
  footer(s, 13, TOTAL)
}

// SLIDE 14: Tech Stack
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('⚙️  Technology Stack', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const tech = [
    { icon: '⚛️', name: 'React 18', desc: 'UI Framework', color: '0ea5e9' },
    { icon: '⚡', name: 'Vite 5', desc: 'Build Tool', color: PURPLE },
    { icon: '🎨', name: 'Tailwind', desc: 'Styling', color: CYAN },
    { icon: '🔥', name: 'Firebase', desc: 'Backend', color: ORANGE },
    { icon: '✨', name: 'Framer', desc: 'Animations', color: PINK },
    { icon: '📶', name: 'PWA', desc: 'Offline', color: GREEN },
  ]
  tech.forEach((t, i) => iconBox(s, 0.7 + (i % 3) * 3, 1.3 + Math.floor(i / 3) * 2, 2.6, 1.7, t.icon, t.name, t.desc, t.color))
  footer(s, 14, TOTAL)
}

// SLIDE 15: Section
section('Features Overview', 'What SIARM delivers', '⚡', 15, TOTAL)

// SLIDE 16: Feature Matrix
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('⚡  Features by Role', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const roles = [
    { icon: '👨‍🎓', label: 'Student', features: ['📋 Attendance', '📊 Grades', '📅 Timetable', '💰 Fees', '📚 Learning'], color: '0ea5e9' },
    { icon: '👩‍🏫', label: 'Lecturer', features: ['✅ Mark Attendance', '📝 Enter Grades', '📖 Lessons', '📋 Assignments'], color: PURPLE },
    { icon: '👨‍💼', label: 'Staff', features: ['👥 Users', '📝 Enrollment', '💳 Finance', '📅 Timetable', '📈 Analytics'], color: GREEN },
    { icon: '🔑', label: 'Admin', features: ['⚙️ Settings', '📊 Dashboard', '🔍 Audit', '🏛️ MINESUP'], color: 'dc2626' },
  ]
  roles.forEach((r, i) => {
    const x = 0.5 + i * 2.4
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 1.2, w: 2.2, h: 3.7, fill: { color: 'f8fafc' }, rectRadius: 0.12, line: { color: 'e2e8f0', width: 1 } })
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x + 0.6, y: 1.4, w: 1, h: 1, fill: { color: r.color }, rectRadius: 0.15 })
    s.addText(r.icon, { x: x + 0.6, y: 1.4, w: 1, h: 1, fontFace: 'Arial', fontSize: 28, color: WHITE, align: 'center', valign: 'middle' })
    s.addText(r.label, { x, y: 2.5, w: 2.2, h: 0.4, fontFace: 'Arial', fontSize: 13, bold: true, color: DARK, align: 'center' })
    r.features.forEach((f, j) => s.addText(f, { x: x + 0.2, y: 3 + j * 0.4, w: 1.8, h: 0.35, fontFace: 'Arial', fontSize: 9, color: '475569' }))
  })
  footer(s, 16, TOTAL)
}

// SLIDE 17: Attendance (Flow + Stats)
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('📋  Attendance Tracking', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  flowArrow(s, 0.7, 1.3, [{ icon: '👩‍🏫', label: 'Lecturer\nMarks' }, { icon: '📱', label: 'Digital\nRecord' }, { icon: '📊', label: 'Auto\nCalculate' }, { icon: '👨‍🎓', label: 'Student\nViews' }], BRAND)
  const stats = [{ icon: '✅', label: 'Present', value: '88%', color: GREEN }, { icon: '❌', label: 'Absent', value: '12%', color: 'dc2626' }, { icon: '📊', label: 'Average', value: '85%', color: BRAND }]
  stats.forEach((st, i) => {
    const x = 0.7 + i * 3
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 3, w: 2.6, h: 1.5, fill: { color: st.color }, rectRadius: 0.12 })
    s.addText(st.icon, { x, y: 3.1, w: 2.6, h: 0.5, fontFace: 'Arial', fontSize: 24, color: WHITE, align: 'center' })
    s.addText(st.value, { x, y: 3.5, w: 2.6, h: 0.6, fontFace: 'Arial', fontSize: 28, bold: true, color: WHITE, align: 'center' })
    s.addText(st.label, { x, y: 4.1, w: 2.6, h: 0.3, fontFace: 'Arial', fontSize: 11, color: 'ffffff90', align: 'center' })
  })
  footer(s, 17, TOTAL)
}

// SLIDE 18: Grades
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('📊  Grade Management', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  flowArrow(s, 0.7, 1.3, [{ icon: '📝', label: 'CA Marks\n(40%)' }, { icon: '📋', label: 'Final Exam\n(60%)' }, { icon: '➕', label: 'Calculate\nTotal' }, { icon: '📊', label: 'GPA &\nTranscript' }], GREEN)
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 3, w: 4, h: 1.8, fill: { color: 'f0fdf4' }, rectRadius: 0.1, line: { color: 'bbf7d0', width: 1 } })
  s.addText('📊  Grading Scale', { x: 0.7, y: 3.1, w: 4, h: 0.4, fontFace: 'Arial', fontSize: 13, bold: true, color: GREEN, align: 'center' })
  ;['A (16-20) = Bien', 'B (14-15) = Assez Bien', 'C (12-13) = Passable', 'D (<12) = Échec'].forEach((g, i) => s.addText(g, { x: 1, y: 3.5 + i * 0.3, w: 3.5, h: 0.3, fontFace: 'Arial', fontSize: 10, color: '166534' }))
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 5.2, y: 3, w: 4, h: 1.8, fill: { color: 'dbeafe' }, rectRadius: 0.1, line: { color: '93c5fd', width: 1 } })
  s.addText('🔒  QR Verification', { x: 5.2, y: 3.1, w: 4, h: 0.4, fontFace: 'Arial', fontSize: 13, bold: true, color: BRAND, align: 'center' })
  s.addText('📱  Scan to verify authenticity\n📄  PDF transcripts with QR\n🖨️  Printable official documents', { x: 5.5, y: 3.5, w: 3.5, h: 1.2, fontFace: 'Arial', fontSize: 10, color: '1e40af', lineSpacingMultiple: 1.5 })
  footer(s, 18, TOTAL)
}

// SLIDE 19: Fees
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('💰  Tuition & Fee Payments', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const methods = [{ icon: '📱', name: 'MTN MoMo', color: ORANGE }, { icon: '🟠', name: 'Orange Money', color: 'ea580c' }, { icon: '💳', name: 'Visa/MC', color: BRAND }, { icon: '🏦', name: 'Bank', color: GREEN }]
  methods.forEach((m, i) => {
    const x = 0.7 + i * 2.25
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 1.3, w: 2, h: 1.2, fill: { color: m.color }, rectRadius: 0.1, shadow: { type: 'outer', blur: 4, offset: 2, color: '000000', opacity: 0.1 } })
    s.addText(m.icon, { x, y: 1.4, w: 2, h: 0.5, fontFace: 'Arial', fontSize: 24, color: WHITE, align: 'center' })
    s.addText(m.name, { x, y: 1.9, w: 2, h: 0.4, fontFace: 'Arial', fontSize: 11, bold: true, color: WHITE, align: 'center' })
  })
  flowArrow(s, 0.7, 2.8, [{ icon: '📋', label: 'View Fees' }, { icon: '💳', label: 'Pay Now' }, { icon: '✅', label: 'Confirm' }, { icon: '🧾', label: 'Receipt' }], BRAND)
  ;[{ label: '92% Recovery Rate', color: GREEN, x: 0.7 }, { label: 'Instant Processing', color: BRAND, x: 3.7 }, { label: 'Digital Receipts', color: PURPLE, x: 6.7 }].forEach((b) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: b.x, y: 4.3, w: 2.6, h: 0.7, fill: { color: b.color }, rectRadius: 0.08 })
    s.addText(b.label, { x: b.x, y: 4.3, w: 2.6, h: 0.7, fontFace: 'Arial', fontSize: 12, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  })
  footer(s, 19, TOTAL)
}

// SLIDE 20: Timetable (Grid)
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('📅  Timetable Management', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.2, w: 8.5, h: 3.5, fill: { color: 'f8fafc' }, rectRadius: 0.1, line: { color: 'e2e8f0', width: 1 } })
  ;['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((d, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 2.2 + i * 1.2, y: 1.3, w: 1.1, h: 0.5, fill: { color: BRAND }, rectRadius: 0.05 })
    s.addText(d, { x: 2.2 + i * 1.2, y: 1.3, w: 1.1, h: 0.5, fontFace: 'Arial', fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  })
  ;['6-8 PM', '8-10 PM'].forEach((t, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 2 + i * 1.2, w: 1.2, h: 1, fill: { color: 'e2e8f0' }, rectRadius: 0.05 })
    s.addText(t, { x: 0.8, y: 2 + i * 1.2, w: 1.2, h: 1, fontFace: 'Arial', fontSize: 10, bold: true, color: DARK, align: 'center', valign: 'middle' })
  })
  const classes = [{ d: 0, t: 0, n: 'Math', c: BRAND }, { d: 1, t: 0, n: 'Prog', c: GREEN }, { d: 2, t: 1, n: 'DB', c: PURPLE }, { d: 3, t: 0, n: 'Web', c: CYAN }, { d: 4, t: 1, n: 'Net', c: ORANGE }, { d: 5, t: 0, n: 'Lab', c: PINK }]
  classes.forEach((cl) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 2.2 + cl.d * 1.2, y: 2 + cl.t * 1.2, w: 1.1, h: 1, fill: { color: cl.c }, rectRadius: 0.08 })
    s.addText(cl.n, { x: 2.2 + cl.d * 1.2, y: 2 + cl.t * 1.2, w: 1.1, h: 1, fontFace: 'Arial', fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  })
  s.addText('📱  Export to .ics  •  🔍  Filter by specialty  •  ⚠️  Conflict detection', { x: 0.7, y: 4.8, w: 8.5, h: 0.3, fontFace: 'Arial', fontSize: 10, color: GRAY, align: 'center' })
  footer(s, 20, TOTAL)
}

// SLIDE 21: Mobile Learning
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('📚  Mobile Learning', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.5, y: 1.2, w: 3, h: 3.8, fill: { color: DARK }, rectRadius: 0.3, line: { color: '334155', width: 2 } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.7, y: 1.5, w: 2.6, h: 3.2, fill: { color: WHITE }, rectRadius: 0.1 })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.8, y: 1.6, w: 2.4, h: 0.4, fill: { color: BRAND }, rectRadius: 0.05 })
  s.addText('📚 Mobile Learning', { x: 3.8, y: 1.6, w: 2.4, h: 0.4, fontFace: 'Arial', fontSize: 9, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  ;['📖 Chapter 1: Intro', '📖 Chapter 2: Basics', '📖 Chapter 3: Advanced', '📝 Quiz'].forEach((l, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.9, y: 2.1 + i * 0.5, w: 2.2, h: 0.4, fill: { color: 'f1f5f9' }, rectRadius: 0.05 })
    s.addText(l, { x: 3.9, y: 2.1 + i * 0.5, w: 2.2, h: 0.4, fontFace: 'Arial', fontSize: 8, color: DARK, valign: 'middle' })
  })
  const feats = [{ icon: '📱', label: 'Any Device', x: 0.7, color: BRAND }, { icon: '📶', label: 'Works Offline', x: 0.7, color: GREEN }, { icon: '📖', label: 'By Course', x: 7.5, color: PURPLE }, { icon: '🎯', label: 'Self-Paced', x: 7.5, color: CYAN }]
  feats.forEach((f, i) => {
    const y = 1.5 + i * 0.9
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: f.x, y, w: 2.2, h: 0.7, fill: { color: f.color }, rectRadius: 0.08 })
    s.addText(`${f.icon}  ${f.label}`, { x: f.x, y, w: 2.2, h: 0.7, fontFace: 'Arial', fontSize: 11, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  })
  footer(s, 21, TOTAL)
}

// SLIDE 22: Discussions
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('💬  Discussions & Announcements', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const msgs = [{ t: 'When is the assignment due?', u: true }, { t: 'Due Friday at midnight', u: false }, { t: 'Can we get an extension?', u: true }, { t: 'I\'ll consider it', u: false }]
  msgs.forEach((m, i) => {
    const y = 1.3 + i * 0.8, x = m.u ? 1 : 5
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w: 4, h: 0.6, fill: { color: m.u ? 'dbeafe' : 'dcfce7' }, rectRadius: 0.1 })
    s.addText(`${m.u ? 'Student' : 'Lecturer'}: ${m.t}`, { x: x + 0.2, y, w: 3.6, h: 0.6, fontFace: 'Arial', fontSize: 10, color: DARK, valign: 'middle' })
  })
  ;[{ icon: '📚', label: 'Per Course', color: BRAND }, { icon: '💬', label: 'Threaded', color: GREEN }, { icon: '📌', label: 'Pinned', color: ORANGE }, { icon: '🔔', label: 'Notifications', color: PURPLE }].forEach((f, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7 + i * 2.25, y: 4.5, w: 2, h: 0.6, fill: { color: f.color }, rectRadius: 0.08 })
    s.addText(`${f.icon}  ${f.label}`, { x: 0.7 + i * 2.25, y: 4.5, w: 2, h: 0.6, fontFace: 'Arial', fontSize: 11, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  })
  footer(s, 22, TOTAL)
}

// SLIDE 23: ID Card
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🆔  Digital ID Card & Transcripts', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.3, w: 4, h: 2.5, fill: { color: BRAND }, rectRadius: 0.15, line: { color: '1e40af', width: 2 } })
  s.addText('🎓 IUGET BONABÉRI', { x: 0.7, y: 1.4, w: 4, h: 0.4, fontFace: 'Arial', fontSize: 11, bold: true, color: WHITE, align: 'center' })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.2, y: 1.9, w: 1.2, h: 1.2, fill: { color: WHITE }, rectRadius: 0.1 })
  s.addText('📷', { x: 1.2, y: 1.9, w: 1.2, h: 1.2, fontFace: 'Arial', fontSize: 28, color: GRAY, align: 'center', valign: 'middle' })
  s.addText('STUDENT ID CARD', { x: 2.6, y: 2, w: 1.8, h: 0.3, fontFace: 'Arial', fontSize: 9, bold: true, color: WHITE })
  s.addText('Name: John Doe\nMat: IUGET-2025-001\nSpec: Software Engineering', { x: 2.6, y: 2.3, w: 1.8, h: 0.8, fontFace: 'Arial', fontSize: 8, color: 'dbeafe', lineSpacingMultiple: 1.4 })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.5, y: 3.2, w: 1, h: 0.5, fill: { color: WHITE }, rectRadius: 0.05 })
  s.addText('QR', { x: 1.5, y: 3.2, w: 1, h: 0.5, fontFace: 'Arial', fontSize: 10, bold: true, color: DARK, align: 'center', valign: 'middle' })
  ;[{ icon: '🖨️', label: 'Printable', color: BRAND }, { icon: '📱', label: 'QR Code', color: GREEN }, { icon: '🔒', label: 'Verified', color: PURPLE }, { icon: '📄', label: 'PDF Export', color: CYAN }].forEach((f, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 5.2 + (i % 2) * 2.2, y: 1.3 + Math.floor(i / 2) * 1.3, w: 2, h: 1, fill: { color: f.color }, rectRadius: 0.1 })
    s.addText(`${f.icon}  ${f.label}`, { x: 5.2 + (i % 2) * 2.2, y: 1.3 + Math.floor(i / 2) * 1.3, w: 2, h: 1, fontFace: 'Arial', fontSize: 12, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 4, w: 8.5, h: 1, fill: { color: 'f0fdf4' }, rectRadius: 0.1, line: { color: 'bbf7d0', width: 1 } })
  s.addText('📄  Official Transcripts  •  📊  GPA Calculation  •  🔒  QR Verified  •  🖨️  Printable', { x: 0.7, y: 4, w: 8.5, h: 1, fontFace: 'Arial', fontSize: 12, bold: true, color: GREEN, align: 'center', valign: 'middle' })
  footer(s, 23, TOTAL)
}

// SLIDE 24: Section
section('User Roles & Permissions', 'Hierarchical access control', '👥', 24, TOTAL)

// SLIDE 25: Role Pyramid
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('👥  Role-Based Access Control', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const pyramid = [
    { label: '🔑 ADMIN', desc: 'Full System Access', color: 'dc2626', w: 8, y: 1.2 },
    { label: '👨‍💼 STAFF', desc: 'Operations & Finance', color: GREEN, w: 6.5, y: 2.1 },
    { label: '👩‍🏫 LECTURER', desc: 'Classes & Grades', color: PURPLE, w: 5, y: 3 },
    { label: '👨‍🎓 STUDENT', desc: 'View & Submit', color: '0ea5e9', w: 3.5, y: 3.9 },
  ]
  pyramid.forEach((p) => {
    const x = (10 - p.w) / 2
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: p.y, w: p.w, h: 0.7, fill: { color: p.color }, rectRadius: 0.08, shadow: { type: 'outer', blur: 3, offset: 1, color: '000000', opacity: 0.1 } })
    s.addText(p.label, { x, y: p.y, w: p.w * 0.5, h: 0.7, fontFace: 'Arial', fontSize: 12, bold: true, color: WHITE, align: 'center', valign: 'middle' })
    s.addText(p.desc, { x: x + p.w * 0.5, y: p.y, w: p.w * 0.5, h: 0.7, fontFace: 'Arial', fontSize: 10, color: 'ffffff90', valign: 'middle' })
  })
  s.addText('⬆️  Higher roles include all lower permissions  ⬆️', { x: 0.7, y: 4.8, w: 8.5, h: 0.3, fontFace: 'Arial', fontSize: 10, color: GRAY, align: 'center' })
  footer(s, 25, TOTAL)
}

// SLIDE 26: Permission Matrix
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🔐  Permission Matrix', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const headers = ['Feature', 'Student', 'Lecturer', 'Staff', 'Admin']
  headers.forEach((h, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7 + i * 1.8, y: 1.2, w: 1.6, h: 0.5, fill: { color: BRAND }, rectRadius: 0.05 })
    s.addText(h, { x: 0.7 + i * 1.8, y: 1.2, w: 1.6, h: 0.5, fontFace: 'Arial', fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  })
  const rows = [['Attendance', '👁️ View', '✏️ Mark', '📊 Report', '📊 All'], ['Grades', '👁️ View', '✏️ Enter', '📊 Report', '📊 All'], ['Fees', '💳 Pay', '—', '📊 Track', '📊 All'], ['Users', '—', '—', '👥 Manage', '👥 All'], ['Settings', '—', '—', '—', '⚙️ Edit']]
  rows.forEach((row, i) => {
    const y = 1.8 + i * 0.6
    row.forEach((cell, j) => {
      s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7 + j * 1.8, y, w: 1.6, h: 0.5, fill: { color: i % 2 === 0 ? 'f8fafc' : WHITE }, rectRadius: 0.03, line: { color: 'e2e8f0', width: 0.5 } })
      s.addText(cell, { x: 0.7 + j * 1.8, y, w: 1.6, h: 0.5, fontFace: 'Arial', fontSize: 9, color: DARK, align: 'center', valign: 'middle' })
    })
  })
  footer(s, 26, TOTAL)
}

// SLIDE 27: Section
section('Database Design', 'Data model & storage', '🗄️', 27, TOTAL)

// SLIDE 28: Data Entities
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🗄️  Core Data Entities', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const entities = [
    { icon: '👥', name: 'Users', desc: 'Students, Lecturers,\nStaff, Admins', color: BRAND },
    { icon: '📚', name: 'Courses', desc: 'Academic courses\n& specialties', color: GREEN },
    { icon: '📋', name: 'Attendance', desc: 'Per-course,\nper-date records', color: PURPLE },
    { icon: '📊', name: 'Results', desc: 'CA + Exam grades\nper student', color: 'dc2626' },
    { icon: '💰', name: 'Fees', desc: 'Tuition structure\n& payments', color: ORANGE },
    { icon: '📅', name: 'Timetable', desc: 'Weekly schedule\nslots', color: CYAN },
  ]
  entities.forEach((e, i) => iconBox(s, 0.7 + (i % 3) * 3, 1.3 + Math.floor(i / 3) * 2, 2.6, 1.7, e.icon, e.name, e.desc, e.color))
  footer(s, 28, TOTAL)
}

// SLIDE 29: Firestore Collections
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🔥  Firestore Collections', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const cols = [
    { name: 'users/', icon: '👥', fields: 'role, specialty, matricule', color: BRAND },
    { name: 'courses/', icon: '📚', fields: 'department, credits', color: GREEN },
    { name: 'attendance/', icon: '📋', fields: 'student, course, date, status', color: PURPLE },
    { name: 'results/', icon: '📊', fields: 'CA mark, exam mark, total', color: 'dc2626' },
    { name: 'fees/', icon: '💰', fields: 'structure, transactions', color: ORANGE },
    { name: 'timetable/', icon: '📅', fields: 'course, room, time, day', color: CYAN },
    { name: 'announcements/', icon: '📢', fields: 'pinning, dates', color: PINK },
    { name: 'assignments/', icon: '📝', fields: 'deadlines, submissions', color: '059669' },
  ]
  cols.forEach((c, i) => {
    const x = 0.7 + (i % 4) * 2.25, y = 1.3 + Math.floor(i / 4) * 2
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w: 2, h: 1.7, fill: { color: 'f8fafc' }, rectRadius: 0.1, line: { color: c.color, width: 1.5 } })
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x + 0.5, y: y + 0.15, w: 1, h: 0.6, fill: { color: c.color }, rectRadius: 0.08 })
    s.addText(c.icon, { x: x + 0.5, y: y + 0.15, w: 1, h: 0.6, fontFace: 'Arial', fontSize: 18, color: WHITE, align: 'center', valign: 'middle' })
    s.addText(c.name, { x, y: y + 0.8, w: 2, h: 0.35, fontFace: 'Arial', fontSize: 10, bold: true, color: DARK, align: 'center' })
    s.addText(c.fields, { x: x + 0.1, y: y + 1.15, w: 1.8, h: 0.45, fontFace: 'Arial', fontSize: 8, color: GRAY, align: 'center' })
  })
  footer(s, 29, TOTAL)
}

// SLIDE 30: Demo Mode
{
  const s = pptx.addSlide()
  s.background = { fill: DARK }
  s.addText('🎮  Demo Mode Architecture', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING, color: WHITE })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3, y: 1.3, w: 4, h: 0.8, fill: { color: BRAND }, rectRadius: 0.1 })
  s.addText('VITE_DEMO_MODE=true', { x: 3, y: 1.3, w: 4, h: 0.8, fontFace: 'Arial', fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  s.addText('⬇️', { x: 4.5, y: 2.1, w: 1, h: 0.5, fontFace: 'Arial', fontSize: 24, color: GRAY, align: 'center' })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 2, y: 2.6, w: 6, h: 1, fill: { color: ORANGE }, rectRadius: 0.1 })
  s.addText('💾  localStorage  —  No Server Needed', { x: 2, y: 2.6, w: 6, h: 1, fontFace: 'Arial', fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  ;[{ icon: '📦', label: 'Pre-seeded Data' }, { icon: '⚡', label: 'Full Features' }, { icon: '🔄', label: 'Persistent' }, { icon: '🎯', label: 'For Evaluation' }].forEach((f, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1 + i * 2.2, y: 3.9, w: 2, h: 0.9, fill: { color: '1e293b' }, rectRadius: 0.08, line: { color: '334155', width: 1 } })
    s.addText(`${f.icon}  ${f.label}`, { x: 1 + i * 2.2, y: 3.9, w: 2, h: 0.9, fontFace: 'Arial', fontSize: 11, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  })
  footer(s, 30, TOTAL)
}

// SLIDE 31: Section
section('UI/UX Design', 'User experience & design principles', '🎨', 31, TOTAL)

// SLIDE 32: Design System
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🎨  Design System', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const colors = [{ name: 'Brand', hex: '#1e3aa0', color: BRAND }, { name: 'Accent', hex: '#e63946', color: ACCENT }, { name: 'Dark', hex: '#0f172a', color: DARK }, { name: 'Ink', hex: '#64748b', color: GRAY }, { name: 'Light', hex: '#f8fafc', color: LIGHT }]
  colors.forEach((c, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7 + i * 1.8, y: 1.2, w: 1.6, h: 1, fill: { color: c.color }, rectRadius: 0.1, line: { color: 'e2e8f0', width: 1 } })
    s.addText(c.name, { x: 0.7 + i * 1.8, y: 1.8, w: 1.6, h: 0.3, fontFace: 'Arial', fontSize: 10, bold: true, color: DARK, align: 'center' })
    s.addText(c.hex, { x: 0.7 + i * 1.8, y: 2.1, w: 1.6, h: 0.2, fontFace: 'Arial', fontSize: 8, color: GRAY, align: 'center' })
  })
  const designFeats = [
    { icon: '🔤', label: 'Typography', desc: 'Inter + Display', color: BRAND },
    { icon: '🧩', label: 'Components', desc: 'Cards, Buttons, Inputs', color: GREEN },
    { icon: '🌙', label: 'Dark Mode', desc: 'Class-based toggle', color: DARK },
    { icon: '✨', label: 'Animations', desc: 'Framer Motion', color: PINK },
    { icon: '📱', label: 'Responsive', desc: 'Mobile-first', color: CYAN },
    { icon: '♿', label: 'Accessible', desc: 'ARIA compliant', color: PURPLE },
  ]
  designFeats.forEach((f, i) => iconBox(s, 0.7 + (i % 3) * 3, 2.6 + Math.floor(i / 3) * 1.4, 2.6, 1.1, f.icon, f.label, f.desc, f.color))
  footer(s, 32, TOTAL)
}

// SLIDE 33: Dark Mode
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🌙  Dark Mode Implementation', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1, y: 1.3, w: 3.5, h: 2, fill: { color: 'f8fafc' }, rectRadius: 0.12, line: { color: 'e2e8f0', width: 1 } })
  s.addText('☀️  Light Mode', { x: 1, y: 1.4, w: 3.5, h: 0.4, fontFace: 'Arial', fontSize: 13, bold: true, color: DARK, align: 'center' })
  s.addText('• White backgrounds\n• Dark text\n• Subtle borders', { x: 1.3, y: 1.9, w: 3, h: 1.2, fontFace: 'Arial', fontSize: 10, color: '475569', lineSpacingMultiple: 1.4 })
  s.addText('⇄', { x: 4.7, y: 1.8, w: 0.6, h: 0.8, fontFace: 'Arial', fontSize: 28, color: GRAY, align: 'center', valign: 'middle' })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 5.5, y: 1.3, w: 3.5, h: 2, fill: { color: DARK }, rectRadius: 0.12, line: { color: '334155', width: 1 } })
  s.addText('🌙  Dark Mode', { x: 5.5, y: 1.4, w: 3.5, h: 0.4, fontFace: 'Arial', fontSize: 13, bold: true, color: WHITE, align: 'center' })
  s.addText('• Dark backgrounds\n• Light text\n• Elevated cards', { x: 5.8, y: 1.9, w: 3, h: 1.2, fontFace: 'Arial', fontSize: 10, color: '94a3b8', lineSpacingMultiple: 1.4 })
  ;[{ icon: '⚙️', label: 'Tailwind darkMode: class', color: BRAND }, { icon: '🔘', label: 'Toggle in Navbar', color: GREEN }, { icon: '💾', label: 'localStorage persistence', color: PURPLE }, { icon: '🎨', label: 'Comprehensive CSS overrides', color: CYAN }].forEach((f, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7 + i * 2.25, y: 3.8, w: 2, h: 0.9, fill: { color: f.color }, rectRadius: 0.08 })
    s.addText(`${f.icon}  ${f.label}`, { x: 0.7 + i * 2.25, y: 3.8, w: 2, h: 0.9, fontFace: 'Arial', fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  })
  footer(s, 33, TOTAL)
}

// SLIDE 34: Bilingual
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🌐  Bilingual Support (EN/FR)', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 2, y: 1.3, w: 6, h: 1.5, fill: { color: 'f8fafc' }, rectRadius: 0.12, line: { color: 'e2e8f0', width: 1 } })
  s.addText('🇬🇧  English', { x: 2.5, y: 1.5, w: 2.2, h: 0.5, fontFace: 'Arial', fontSize: 14, bold: true, color: BRAND, align: 'center' })
  s.addText('⇄', { x: 4.9, y: 1.5, w: 0.6, h: 0.5, fontFace: 'Arial', fontSize: 20, color: GRAY, align: 'center' })
  s.addText('🇫🇷  Français', { x: 5.7, y: 1.5, w: 2.2, h: 0.5, fontFace: 'Arial', fontSize: 14, bold: true, color: ACCENT, align: 'center' })
  s.addText('387+ Translation Keys  •  Auto-detect Browser Language  •  localStorage Persistence', { x: 2, y: 2.2, w: 6, h: 0.4, fontFace: 'Arial', fontSize: 10, color: GRAY, align: 'center' })
  const examples = [{ en: 'Dashboard', fr: 'Tableau de bord', color: BRAND }, { en: 'Attendance', fr: 'Présences', color: GREEN }, { en: 'Results', fr: 'Résultats', color: PURPLE }, { en: 'Sign In', fr: 'Se connecter', color: CYAN }]
  examples.forEach((ex, i) => {
    const y = 3 + i * 0.55
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.5, y, w: 2.5, h: 0.45, fill: { color: ex.color }, rectRadius: 0.06 })
    s.addText(ex.en, { x: 1.5, y, w: 2.5, h: 0.45, fontFace: 'Arial', fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle' })
    s.addText('→', { x: 4.2, y, w: 0.5, h: 0.45, fontFace: 'Arial', fontSize: 14, color: GRAY, align: 'center', valign: 'middle' })
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 4.9, y, w: 2.5, h: 0.45, fill: { color: ex.color }, rectRadius: 0.06 })
    s.addText(ex.fr, { x: 4.9, y, w: 2.5, h: 0.45, fontFace: 'Arial', fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  })
  footer(s, 34, TOTAL)
}

// SLIDE 35: Section
section('Security Implementation', 'Protecting user data', '🔒', 35, TOTAL)

// SLIDE 36: Security
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🔒  Security Measures', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const sec = [
    { icon: '🔐', name: 'Firebase Auth', desc: 'Email/Password', color: BRAND },
    { icon: '🛡️', name: 'Role Guards', desc: 'ProtectedRoute', color: GREEN },
    { icon: '⏰', name: 'Session Timeout', desc: '30-min idle', color: ORANGE },
    { icon: '🔑', name: 'Password Hash', desc: 'bcrypt', color: PURPLE },
    { icon: '🔒', name: 'HTTPS', desc: 'All API calls', color: CYAN },
    { icon: '📱', name: 'QR Verify', desc: 'ID & Transcript', color: PINK },
    { icon: '📝', name: 'Audit Log', desc: 'Track actions', color: 'dc2626' },
    { icon: '✅', name: 'Validation', desc: 'All forms', color: '059669' },
  ]
  sec.forEach((item, i) => iconBox(s, 0.7 + (i % 4) * 2.25, 1.3 + Math.floor(i / 4) * 2, 2, 1.7, item.icon, item.name, item.desc, item.color))
  footer(s, 36, TOTAL)
}

// SLIDE 37: Section
section('Testing & Quality', 'Ensuring reliability', '🧪', 37, TOTAL)

// SLIDE 38: Testing
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🧪  Testing Approach', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const testing = [
    { icon: '👨‍💻', name: 'Manual Testing', desc: 'All roles & features', color: BRAND },
    { icon: '🌐', name: 'Cross-Browser', desc: 'Chrome, Firefox, Safari', color: GREEN },
    { icon: '📱', name: 'Responsive', desc: 'All screen sizes', color: PURPLE },
    { icon: '📶', name: 'Offline', desc: 'Network throttling', color: CYAN },
    { icon: '🎮', name: 'Demo Mode', desc: 'All CRUD operations', color: ORANGE },
    { icon: '🔍', name: 'Edge Cases', desc: 'Empty states, errors', color: PINK },
    { icon: '♿', name: 'Accessibility', desc: 'Screen readers', color: 'dc2626' },
    { icon: '⚡', name: 'Performance', desc: 'Lighthouse audit', color: '059669' },
  ]
  testing.forEach((t, i) => iconBox(s, 0.7 + (i % 4) * 2.25, 1.3 + Math.floor(i / 4) * 2, 2, 1.7, t.icon, t.name, t.desc, t.color))
  footer(s, 38, TOTAL)
}

// SLIDE 39: Section
section('Deployment', 'Going live', '🚀', 39, TOTAL)

// SLIDE 40: Deployment
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🚀  Deployment Stack', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  flowArrow(s, 0.5, 1.3, [{ icon: '💻', label: 'Git Push' }, { icon: '⚡', label: 'Vite Build' }, { icon: '▲', label: 'Vercel CDN' }, { icon: '🔥', label: 'Firebase' }], BRAND)
  const platforms = [
    { icon: '▲', name: 'Vercel', desc: 'Frontend Hosting\nCDN + Edge Functions', color: DARK },
    { icon: '🔥', name: 'Firebase', desc: 'Auth + Firestore\n+ Storage', color: ORANGE },
    { icon: '📶', name: 'PWA', desc: 'Service Worker\nOffline Support', color: GREEN },
    { icon: '🔄', name: 'CI/CD', desc: 'Auto Deploy\nfrom main branch', color: PURPLE },
  ]
  platforms.forEach((p, i) => {
    const x = 0.7 + i * 2.25
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 3, w: 2, h: 1.8, fill: { color: p.color }, rectRadius: 0.12, shadow: { type: 'outer', blur: 5, offset: 2, color: '000000', opacity: 0.12 } })
    s.addText(p.icon, { x, y: 3.2, w: 2, h: 0.5, fontFace: 'Arial', fontSize: 28, color: WHITE, align: 'center' })
    s.addText(p.name, { x, y: 3.5, w: 2, h: 0.4, fontFace: 'Arial', fontSize: 13, bold: true, color: WHITE, align: 'center' })
    s.addText(p.desc, { x, y: 3.9, w: 2, h: 0.7, fontFace: 'Arial', fontSize: 9, color: 'ffffff90', align: 'center' })
  })
  footer(s, 40, TOTAL)
}

// SLIDE 41: Section
section('System Walkthrough', 'Live demonstration flow', '🖥️', 41, TOTAL)

// SLIDE 42: Landing Page
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🏠  Landing Page', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1, y: 1.2, w: 8, h: 4, fill: { color: 'f1f5f9' }, rectRadius: 0.15, line: { color: 'e2e8f0', width: 1 } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1, y: 1.2, w: 8, h: 0.5, fill: { color: 'e2e8f0' }, rectRadius: 0.15 })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.2, y: 1.35, w: 0.3, h: 0.2, fill: { color: 'dc2626' }, rectRadius: 0.05 })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.6, y: 1.35, w: 0.3, h: 0.2, fill: { color: ORANGE }, rectRadius: 0.05 })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 2, y: 1.35, w: 0.3, h: 0.2, fill: { color: GREEN }, rectRadius: 0.05 })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 2.8, y: 1.3, w: 5.5, h: 0.3, fill: { color: WHITE }, rectRadius: 0.05 })
  s.addText('siarm.vercel.app', { x: 2.8, y: 1.3, w: 5.5, h: 0.3, fontFace: 'Arial', fontSize: 8, color: GRAY, align: 'center', valign: 'middle' })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.5, y: 1.9, w: 7, h: 1.2, fill: { color: BRAND }, rectRadius: 0.1 })
  s.addText('🎓  SIARM\nSmart Institution Academic Resource Management', { x: 1.5, y: 1.9, w: 7, h: 1.2, fontFace: 'Arial', fontSize: 14, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  ;[{ icon: '📋', label: 'Attendance', color: BRAND }, { icon: '📊', label: 'Grades', color: GREEN }, { icon: '💰', label: 'Fees', color: ORANGE }, { icon: '📅', label: 'Timetable', color: PURPLE }].forEach((f, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1.8 + i * 1.8, y: 3.3, w: 1.5, h: 1, fill: { color: f.color }, rectRadius: 0.08 })
    s.addText(`${f.icon}\n${f.label}`, { x: 1.8 + i * 1.8, y: 3.3, w: 1.5, h: 1, fontFace: 'Arial', fontSize: 10, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  })
  s.addText('🌐  Language Toggle  •  🌙  Dark Mode  •  📱  Responsive', { x: 1, y: 4.5, w: 8, h: 0.4, fontFace: 'Arial', fontSize: 10, color: GRAY, align: 'center' })
  footer(s, 42, TOTAL)
}

// SLIDE 43: Student Dashboard
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('👨‍🎓  Student Dashboard', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.2, w: 8.5, h: 3.8, fill: { color: 'f8fafc' }, rectRadius: 0.12, line: { color: 'e2e8f0', width: 1 } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1, y: 1.4, w: 4, h: 0.6, fill: { color: BRAND }, rectRadius: 0.08 })
  s.addText('👋  Welcome back, John!', { x: 1, y: 1.4, w: 4, h: 0.6, fontFace: 'Arial', fontSize: 12, bold: true, color: WHITE, valign: 'middle' })
  const dashStats = [{ icon: '📊', value: '88%', label: 'Attendance', color: GREEN }, { icon: '📈', value: '3.5', label: 'GPA', color: BRAND }, { icon: '📚', value: '6', label: 'Courses', color: PURPLE }, { icon: '📅', value: '3', label: 'Today', color: CYAN }]
  dashStats.forEach((st, i) => {
    const x = 1 + i * 2
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 2.2, w: 1.8, h: 1.2, fill: { color: st.color }, rectRadius: 0.08 })
    s.addText(st.icon, { x, y: 2.3, w: 1.8, h: 0.4, fontFace: 'Arial', fontSize: 16, color: WHITE, align: 'center' })
    s.addText(st.value, { x, y: 2.6, w: 1.8, h: 0.5, fontFace: 'Arial', fontSize: 20, bold: true, color: WHITE, align: 'center' })
    s.addText(st.label, { x, y: 3.1, w: 1.8, h: 0.2, fontFace: 'Arial', fontSize: 8, color: 'ffffff90', align: 'center' })
  })
  ;['📋 Attendance Chart', '📅 Today\'s Schedule', '📢 Announcements', '💰 Fee Balance'].forEach((w, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1 + (i % 2) * 4.2, y: 3.6 + Math.floor(i / 2) * 0.6, w: 4, h: 0.5, fill: { color: WHITE }, rectRadius: 0.06, line: { color: 'e2e8f0', width: 1 } })
    s.addText(w, { x: 1 + (i % 2) * 4.2, y: 3.6 + Math.floor(i / 2) * 0.6, w: 4, h: 0.5, fontFace: 'Arial', fontSize: 10, color: DARK, valign: 'middle' })
  })
  footer(s, 43, TOTAL)
}

// SLIDE 44: Lecturer Dashboard
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('👩‍🏫  Lecturer Dashboard', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const lecFeats = [
    { icon: '📋', label: 'Mark\nAttendance', desc: 'Digital roll calls', color: BRAND },
    { icon: '📊', label: 'Enter\nGrades', desc: 'CA + Exam', color: GREEN },
    { icon: '📚', label: 'Publish\nLessons', desc: 'Mobile learning', color: PURPLE },
    { icon: '📝', label: 'Create\nAssignments', desc: 'With deadlines', color: CYAN },
    { icon: '💬', label: 'Join\nDiscussions', desc: 'Course threads', color: ORANGE },
    { icon: '📅', label: 'View\nSchedule', desc: 'Today\'s classes', color: PINK },
  ]
  lecFeats.forEach((f, i) => iconBox(s, 0.7 + (i % 3) * 3, 1.3 + Math.floor(i / 3) * 2, 2.6, 1.7, f.icon, f.label, f.desc, f.color))
  footer(s, 44, TOTAL)
}

// SLIDE 45: Admin Dashboard
{
  const s = pptx.addSlide()
  s.background = { fill: DARK }
  s.addText('🔑  Admin Dashboard', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING, color: WHITE })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const kpis = [{ icon: '👥', value: '2,847', label: 'Students', color: BRAND }, { icon: '📈', value: '92%', label: 'Recovery', color: GREEN }, { icon: '📊', value: '88%', label: 'Attendance', color: PURPLE }, { icon: '💰', value: '95M', label: 'Revenue', color: ORANGE }]
  kpis.forEach((k, i) => {
    const x = 0.7 + i * 2.25
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 1.2, w: 2, h: 1.5, fill: { color: k.color }, rectRadius: 0.12, shadow: { type: 'outer', blur: 5, offset: 2, color: '000000', opacity: 0.2 } })
    s.addText(k.icon, { x, y: 1.3, w: 2, h: 0.5, fontFace: 'Arial', fontSize: 24, color: WHITE, align: 'center' })
    s.addText(k.value, { x, y: 1.7, w: 2, h: 0.6, fontFace: 'Arial', fontSize: 24, bold: true, color: WHITE, align: 'center' })
    s.addText(k.label, { x, y: 2.3, w: 2, h: 0.3, fontFace: 'Arial', fontSize: 10, color: 'ffffff90', align: 'center' })
  })
  ;[{ icon: '📊', label: 'Analytics', color: BRAND }, { icon: '🤖', label: 'AI Insights', color: GREEN }, { icon: '⚙️', label: 'Settings', color: PURPLE }, { icon: '🔍', label: 'Audit Log', color: CYAN }].forEach((f, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 1 + i * 2.2, y: 3.2, w: 2, h: 0.9, fill: { color: '1e293b' }, rectRadius: 0.08, line: { color: '334155', width: 1 } })
    s.addText(`${f.icon}  ${f.label}`, { x: 1 + i * 2.2, y: 3.2, w: 2, h: 0.9, fontFace: 'Arial', fontSize: 12, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 4.3, w: 4, h: 0.7, fill: { color: '1e293b' }, rectRadius: 0.08, line: { color: '334155', width: 1 } })
  s.addText('📈  Enrollment Trends', { x: 0.7, y: 4.3, w: 4, h: 0.7, fontFace: 'Arial', fontSize: 11, color: '94a3b8', align: 'center', valign: 'middle' })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 5.2, y: 4.3, w: 4, h: 0.7, fill: { color: '1e293b' }, rectRadius: 0.08, line: { color: '334155', width: 1 } })
  s.addText('🥧  Department Distribution', { x: 5.2, y: 4.3, w: 4, h: 0.7, fontFace: 'Arial', fontSize: 11, color: '94a3b8', align: 'center', valign: 'middle' })
  footer(s, 45, TOTAL)
}

// SLIDE 46: AI Chatbot
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🤖  AI-Powered Chatbot', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 5.5, y: 1.2, w: 3.5, h: 4, fill: { color: WHITE }, rectRadius: 0.15, line: { color: 'e2e8f0', width: 1.5 }, shadow: { type: 'outer', blur: 10, offset: 3, color: '000000', opacity: 0.15 } })
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 5.5, y: 1.2, w: 3.5, h: 0.7, fill: { color: BRAND }, rectRadius: 0.15 })
  s.addText('🤖  SIARM AI Assistant', { x: 5.5, y: 1.2, w: 3.5, h: 0.7, fontFace: 'Arial', fontSize: 11, bold: true, color: WHITE, align: 'center', valign: 'middle' })
  const chatMsgs = [{ t: 'How do I check attendance?', u: true }, { t: 'Go to Dashboard → Attendance...', u: false }, { t: 'How to pay fees?', u: true }, { t: 'Go to Fees → Pay Now...', u: false }]
  chatMsgs.forEach((m, i) => {
    const y = 2 + i * 0.6, x = m.u ? 6 : 5.8, w = m.u ? 2.8 : 3
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.5, fill: { color: m.u ? BRAND : 'f1f5f9' }, rectRadius: 0.08 })
    s.addText(m.t, { x: x + 0.1, y, w: w - 0.2, h: 0.5, fontFace: 'Arial', fontSize: 8, color: m.u ? WHITE : DARK, valign: 'middle' })
  })
  const chatFeats = [
    { icon: '🌐', label: 'Bilingual', desc: 'EN/FR support', color: BRAND },
    { icon: '🎯', label: 'Context-Aware', desc: 'Knows user role', color: GREEN },
    { icon: '💡', label: 'Suggestions', desc: 'Quick questions', color: PURPLE },
    { icon: '📶', label: 'Offline Fallback', desc: 'Predefined answers', color: CYAN },
    { icon: '✨', label: 'Animated', desc: 'Framer Motion', color: PINK },
    { icon: '🤖', label: 'Claude AI', desc: 'Anthropic API', color: ORANGE },
  ]
  chatFeats.forEach((f, i) => {
    const x = 0.7 + (i % 3) * 1.6, y = 1.3 + Math.floor(i / 3) * 1.8
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w: 1.4, h: 1.5, fill: { color: f.color }, rectRadius: 0.1 })
    s.addText(f.icon, { x, y: y + 0.15, w: 1.4, h: 0.4, fontFace: 'Arial', fontSize: 20, color: WHITE, align: 'center' })
    s.addText(f.label, { x, y: y + 0.55, w: 1.4, h: 0.4, fontFace: 'Arial', fontSize: 9, bold: true, color: WHITE, align: 'center' })
    s.addText(f.desc, { x, y: y + 0.95, w: 1.4, h: 0.4, fontFace: 'Arial', fontSize: 8, color: 'ffffff90', align: 'center' })
  })
  footer(s, 46, TOTAL)
}

// SLIDE 47: Section
section('Results & Impact', 'Measurable outcomes', '📊', 47, TOTAL)

// SLIDE 48: Impact Metrics
{
  const s = pptx.addSlide()
  s.background = { fill: DARK }
  s.addText('📊  Project Impact', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING, color: WHITE })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const metrics = [{ icon: '📄', value: '40+', label: 'Pages &\nComponents', color: BRAND }, { icon: '👥', value: '4', label: 'User\nRoles', color: GREEN }, { icon: '⚡', value: '12+', label: 'Core\nModules', color: PURPLE }, { icon: '📶', value: '100%', label: 'Offline\nCapable', color: CYAN }]
  metrics.forEach((m, i) => {
    const x = 0.7 + i * 2.25
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y: 1.2, w: 2, h: 3, fill: { color: '1e293b' }, rectRadius: 0.15, line: { color: '334155', width: 1 }, shadow: { type: 'outer', blur: 8, offset: 3, color: '000000', opacity: 0.2 } })
    s.addText(m.icon, { x, y: 1.5, w: 2, h: 0.6, fontFace: 'Arial', fontSize: 32, color: WHITE, align: 'center' })
    s.addText(m.value, { x, y: 2.2, w: 2, h: 1, fontFace: 'Arial', fontSize: 48, bold: true, color: ACCENT, align: 'center' })
    s.addText(m.label, { x, y: 3.3, w: 2, h: 0.7, fontFace: 'Arial', fontSize: 13, color: '94a3b8', align: 'center' })
  })
  footer(s, 48, TOTAL)
}

// SLIDE 49: Challenges & Solutions
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('💡  Challenges & Solutions', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const challenges = [
    { challenge: 'Complex Roles', solution: 'ProtectedRoute Guards', icon: '👥', color: BRAND },
    { challenge: 'Offline Support', solution: 'PWA + Workbox', icon: '📶', color: GREEN },
    { challenge: 'Bilingual UI', solution: 'LanguageContext', icon: '🌐', color: PURPLE },
    { challenge: 'Real-time Sync', solution: 'Firestore Listeners', icon: '🔄', color: CYAN },
    { challenge: 'Payments', solution: 'Demo Simulation', icon: '💰', color: ORANGE },
    { challenge: 'PDF Generation', solution: 'jsPDF + html2canvas', icon: '📄', color: PINK },
    { challenge: 'QR Verification', solution: 'qrcode Library', icon: '📱', color: 'dc2626' },
    { challenge: 'Dark Mode', solution: 'Tailwind Class Toggle', icon: '🌙', color: DARK },
  ]
  challenges.forEach((c, i) => {
    const x = 0.7 + (i % 4) * 2.25, y = 1.3 + Math.floor(i / 4) * 2
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x, y, w: 2, h: 1.7, fill: { color: c.color }, rectRadius: 0.12 })
    s.addText(c.icon, { x, y: y + 0.15, w: 2, h: 0.5, fontFace: 'Arial', fontSize: 24, color: WHITE, align: 'center' })
    s.addText(c.challenge, { x, y: y + 0.6, w: 2, h: 0.4, fontFace: 'Arial', fontSize: 10, bold: true, color: WHITE, align: 'center' })
    s.addText('→', { x, y: y + 0.95, w: 2, h: 0.2, fontFace: 'Arial', fontSize: 12, color: 'ffffff80', align: 'center' })
    s.addText(c.solution, { x, y: y + 1.15, w: 2, h: 0.4, fontFace: 'Arial', fontSize: 9, color: 'ffffff90', align: 'center' })
  })
  footer(s, 49, TOTAL)
}

// SLIDE 50: Future Enhancements
{
  const s = pptx.addSlide()
  s.background = { fill: WHITE }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.15, h: '100%', fill: { color: BRAND } })
  s.addText('🚀  Future Enhancements', { x: 0.7, y: 0.3, w: 8.5, h: 0.7, ...HEADING })
  s.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 0.95, w: 2, h: 0.04, fill: { color: ACCENT } })
  const future = [
    { icon: '🔔', label: 'Push Notifications', desc: 'Firebase Cloud Messaging', color: BRAND },
    { icon: '📹', label: 'Video Conferencing', desc: 'Online classes', color: GREEN },
    { icon: '🤖', label: 'ML Predictions', desc: 'Advanced analytics', color: PURPLE },
    { icon: '📱', label: 'Mobile App', desc: 'React Native', color: CYAN },
    { icon: '🏛️', label: 'Exam Boards', desc: 'National integration', color: ORANGE },
    { icon: '🏫', label: 'Multi-Campus', desc: 'IUGET expansion', color: PINK },
    { icon: '⛓️', label: 'Blockchain', desc: 'Certificate verification', color: 'dc2626' },
    { icon: '💬', label: 'SMS Alerts', desc: 'Parents & students', color: '059669' },
  ]
  future.forEach((f, i) => iconBox(s, 0.7 + (i % 4) * 2.25, 1.3 + Math.floor(i / 4) * 2, 2, 1.7, f.icon, f.label, f.desc, f.color))
  footer(s, 50, TOTAL)
}

// SLIDE 51: Thank You
{
  const s = pptx.addSlide()
  s.background = { fill: DARK }
  s.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 4.5, w: '100%', h: 1.1, fill: { color: BRAND } })
  s.addText('Thank You', { x: 0.5, y: 1, w: 9, h: 1.2, fontFace: 'Arial', fontSize: 52, bold: true, color: WHITE, align: 'center' })
  s.addShape(pptx.shapes.RECTANGLE, { x: 3.5, y: 2.3, w: 3, h: 0.05, fill: { color: ACCENT } })
  s.addText('Questions & Discussion', { x: 0.5, y: 2.6, w: 9, h: 0.7, fontFace: 'Arial', fontSize: 22, color: '94a3b8', align: 'center' })
  s.addText('James Murdza — Level 3 Software Engineering\nIUGET Bonabéri, Douala, Cameroon\n\n« Bien choisir c\'est déjà réussir » — IUGET', { x: 0.5, y: 3.4, w: 9, h: 1.2, fontFace: 'Arial', fontSize: 14, color: '64748b', align: 'center', lineSpacingMultiple: 1.5 })
}

const outPath = '/home/daytona/project/deliverables/SIARM-Defense-Presentation.pptx'
pptx.writeFile({ fileName: outPath }).then(() => console.log(`✓ Created: ${outPath}`)).catch(err => { console.error('Error:', err); process.exit(1) })
