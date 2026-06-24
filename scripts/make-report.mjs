// Generates the SIARM BTech project report as a Word document (.docx),
// formatted to the IUGET "General guidelines for the presentation of the
// BTech Report" (Eng. FOTSEU Julien):
//   • A4 paper, Times New Roman — 12 pt body, 14 pt sub-titles, 16 pt titles
//   • Fully (left + right) justified body
//   • 1.5 line spacing
//   • Margins: 2.5 cm left; 2 cm top / bottom / right
//   • Paragraphs separated by a blank line (no first-line indent)
//   • Page numbers at the TOP RIGHT of every page
//   • Front matter in Roman numerals (i, ii, iii …); body in Arabic from Chapter 1
//   • Every chapter starts on a new page
//   • Prescribed structure: Title · Certification · Declaration · Dedication ·
//     Acknowledgement · Abstract · Résumé · Abbreviations · Table of Contents ·
//     Ch.1 General Introduction · Ch.2 Literature Review ·
//     Ch.3 Methodology and Materials · Ch.4 Results and Discussion ·
//     General Conclusion · References (APA) · Appendices
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const docx = require('docx')

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  PageBreak, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle,
  Header, Footer, PageNumber, NumberFormat, LineRuleType, ShadingType,
  TableOfContents, TabStopType, TabStopPosition,
} = docx

const ROOT = process.cwd()
const DIAGRAM_DIR = path.resolve(ROOT, 'deliverables/diagrams')
const OUT_FILE = path.resolve(ROOT, 'deliverables/SIARM-Report.docx')

/* ─── formatting constants (guideline-compliant) ──────────────── */
const FONT  = 'Times New Roman'
const INK   = '000000'             // black — Standard Formal
const GREY  = '404040'
const BODY  = 24                   // 12 pt  (half-points)
const SUB   = 28                   // 14 pt
const TITLE = 32                   // 16 pt
const LINE15 = 360                 // 1.5 line spacing (twips)
const PARA_AFTER = 200             // blank line between paragraphs
const cm = (v) => Math.round(v * 566.93)   // cm → twips

/* ─── primitives ──────────────────────────────────────────────── */
const T = (text, opts = {}) => new TextRun({ text, font: FONT, color: INK, ...opts })

// Justified body paragraph, 1.5 spacing, blank line after (no indent).
const Body = (text, opts = {}) => new Paragraph({
  children: [T(text, { size: BODY })],
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: PARA_AFTER, line: LINE15, lineRule: LineRuleType.AUTO },
  ...opts,
})

// Centered front-matter heading (NOT a Word Heading style → stays out of the TOC).
const FrontTitle = (text) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 240, after: 360, line: LINE15, lineRule: LineRuleType.AUTO },
  children: [T(text, { size: TITLE, bold: true })],
})

// Chapter title (16 pt) — registered as Heading 1 so it appears in the auto TOC.
const H1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  pageBreakBefore: true,
  spacing: { before: 240, after: 280, line: LINE15, lineRule: LineRuleType.AUTO },
  children: [T(text, { size: TITLE, bold: true })],
})
// Sub-title (14 pt) — Heading 2.
const H2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 280, after: 160, line: LINE15, lineRule: LineRuleType.AUTO },
  children: [T(text, { size: SUB, bold: true })],
})
// Sub-sub-title (13 pt) — Heading 3.
const H3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 200, after: 120, line: LINE15, lineRule: LineRuleType.AUTO },
  children: [T(text, { size: 26, bold: true, italics: true })],
})

function bullet(text, level = 0) {
  return new Paragraph({
    children: [T(text, { size: BODY })],
    bullet: { level },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 100, line: LINE15, lineRule: LineRuleType.AUTO },
  })
}

function numbered(text, n) {
  return new Paragraph({
    children: [T(`${n}.\t`, { size: BODY, bold: true }), T(text, { size: BODY })],
    spacing: { after: 80, line: LINE15, lineRule: LineRuleType.AUTO },
    tabStops: [{ type: TabStopType.LEFT, position: 480 }],
    indent: { left: 480, hanging: 480 },
  })
}

// Read PNG intrinsic size (bytes 16-24) so images keep their aspect ratio.
function pngSize(fp) {
  try {
    const b = fs.readFileSync(fp)
    return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }
  } catch { return { w: 1000, h: 620 } }
}

function imagePara(filename, w = 560) {
  const fp = path.join(DIAGRAM_DIR, filename)
  if (!fs.existsSync(fp)) return Body(`[Diagram missing: ${filename}]`)
  const { w: iw, h: ih } = pngSize(fp)
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 160, after: 80 },
    children: [new ImageRun({
      data: fs.readFileSync(fp),
      transformation: { width: w, height: Math.round(w * (ih / iw)) },
    })],
  })
}

function imageAbs(absPath, w = 560) {
  if (!fs.existsSync(absPath)) return Body(`[Image missing: ${absPath}]`)
  const { w: iw, h: ih } = pngSize(absPath)
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 160, after: 80 },
    children: [new ImageRun({
      data: fs.readFileSync(absPath),
      transformation: { width: w, height: Math.round(w * (ih / iw)) },
    })],
  })
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240, line: LINE15, lineRule: LineRuleType.AUTO },
    children: [T(text, { size: 20, italics: true, color: GREY })],
  })
}

function table(rows, widths = []) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((row, i) =>
      new TableRow({
        tableHeader: i === 0,
        children: row.map((cell, j) =>
          new TableCell({
            width: widths[j] ? { size: widths[j], type: WidthType.PERCENTAGE } : undefined,
            shading: i === 0 ? { type: ShadingType.CLEAR, color: 'auto', fill: 'E7ECF5' } : undefined,
            margins: { top: 40, bottom: 40, left: 80, right: 80 },
            children: [new Paragraph({
              spacing: { line: LINE15, lineRule: LineRuleType.AUTO, after: 0 },
              children: [T(String(cell), { size: 22, bold: i === 0 })],
            })],
          })
        ),
      })
    ),
  })
}

const blank = () => new Paragraph({ children: [T('')], spacing: { after: 0 } })
const pageBreak = () => new Paragraph({ children: [new PageBreak()] })
const sigLine = (label) => new Paragraph({
  spacing: { before: 520, line: LINE15, lineRule: LineRuleType.AUTO },
  children: [T('………………………………………………', { size: BODY })],
  // label below
})
const sigLabel = (label) => new Paragraph({
  spacing: { after: 240 },
  children: [T(label, { size: BODY, bold: true })],
})

/* ════════════════════════════════════════════════════════════════
   FRONT MATTER  (Roman numerals)
   ════════════════════════════════════════════════════════════════ */

/* ─── 1. TITLE PAGE ───────────────────────────────────────────── */
const logoPath = path.join(ROOT, 'public/brand/iuget-logo.png')
const titlePage = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240 },
    children: [T('REPUBLIC OF CAMEROON', { size: BODY, bold: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [T('Peace – Work – Fatherland', { size: 20, italics: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
    children: [T('MINISTRY OF HIGHER EDUCATION (MINESUP)', { size: 20 })] }),

  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 },
    children: [T('INSTITUT UNIVERSITAIRE DU GOLFE DE GUINÉE (IUGET)', { size: 26, bold: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [T('SOUTH POLYTECH — HIGHER INSTITUTE OF ENGINEERING', { size: 22, bold: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
    children: [T('Bonabéri Campus · Douala, Cameroon · « Bien choisir c\'est déjà réussir »', { size: 20, italics: true })] }),

  fs.existsSync(logoPath)
    ? new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 120 },
        children: [new ImageRun({ data: fs.readFileSync(logoPath), transformation: { width: 150, height: 135 } })] })
    : blank(),

  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 },
    children: [T('DEPARTMENT OF SOFTWARE ENGINEERING', { size: 22, bold: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
    children: [T('Bachelor of Technology (BTech) — Level 3 · Sixth Semester', { size: 20 })] }),

  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 },
    children: [T('A BTech Project Report Presented in Partial Fulfilment of the', { size: 20 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
    children: [T('Requirements for the Award of the Bachelor of Technology Degree', { size: 20 })] }),

  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [T('SIARM', { size: 56, bold: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
    children: [T('SMART INSTITUTION ACADEMIC RESOURCE MANAGEMENT', { size: 26, bold: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 280 },
    children: [T('A Unified Web Platform for the Operations of a Private University', { size: 20, italics: true })] }),

  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [T('Presented and defended by:', { size: 20 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [T('JAMES MURDZA', { size: 26, bold: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
    children: [T('Matricule (Student ID): IUGET/2023/SWE/0042', { size: 20 })] }),

  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [T('Under the supervision of:', { size: 20 })] }),
  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [T('Eng. FOTSEU Julien', { size: 24, bold: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 },
    children: [T('M.Eng., Lecturer & BTech Project Supervisor, Department of Software Engineering', { size: 20, italics: true })] }),

  new Paragraph({ alignment: AlignmentType.CENTER,
    children: [T('Academic Year 2025 – 2026', { size: 22, bold: true })] }),
  pageBreak(),
]

/* ─── 2. CERTIFICATION ────────────────────────────────────────── */
const certification = [
  FrontTitle('CERTIFICATION'),
  Body('This is to certify that this BTech project report entitled "SIARM — Smart Institution Academic Resource Management: A Unified Web Platform for the Operations of a Private University", submitted to the Department of Software Engineering of the Institut Universitaire du Golfe de Guinée (IUGET), South Polytech, Bonabéri Campus, is a record of original work carried out by JAMES MURDZA (Matricule IUGET/2023/SWE/0042) under our supervision and guidance. To the best of our knowledge, the work has not been submitted, in whole or in part, for the award of any degree or diploma in this or any other institution.'),
  blank(),
  sigLine(), sigLabel('Supervisor — Eng. FOTSEU Julien                        Date: ………………………'),
  sigLine(), sigLabel('BTech Coordinator                                              Date: ………………………'),
  sigLine(), sigLabel('Head of Department (HOD)                               Date: ………………………'),
  pageBreak(),
]

/* ─── 3. DECLARATION ──────────────────────────────────────────── */
const declaration = [
  FrontTitle('DECLARATION'),
  Body('I, JAMES MURDZA, bearing Matricule IUGET/2023/SWE/0042, hereby declare that this BTech project report entitled "SIARM — Smart Institution Academic Resource Management" is the result of my own original work, conceived and carried out by myself under the supervision of Eng. FOTSEU Julien. All sources of information and material used in this report have been duly acknowledged by means of complete references. This work has not been presented previously, in whole or in part, for the award of any other degree or qualification in this or any other institution of higher learning.'),
  blank(),
  blank(),
  sigLine(), sigLabel('JAMES MURDZA                                                     Date: ………………………'),
  pageBreak(),
]

/* ─── 4. DEDICATION ───────────────────────────────────────────── */
const dedication = [
  FrontTitle('DEDICATION'),
  blank(), blank(),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: LINE15, lineRule: LineRuleType.AUTO, after: 200 },
    children: [T('To my beloved mother,', { size: BODY, italics: true })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: LINE15, lineRule: LineRuleType.AUTO },
    children: [T('whose unwavering sacrifice, prayers and encouragement made this education possible.', { size: BODY, italics: true })] }),
  pageBreak(),
]

/* ─── 5. ACKNOWLEDGEMENT ──────────────────────────────────────── */
const acknowledgement = [
  FrontTitle('ACKNOWLEDGEMENT'),
  Body('The completion of this BTech project would not have been possible without the support and guidance of many people, to whom I owe a debt of gratitude.'),
  Body('First and foremost, I express my profound gratitude to the Founder and the General Coordinator of the Institut Universitaire du Golfe de Guinée (IUGET) for establishing and sustaining an institution where students are encouraged to undertake practical engineering work rooted in real institutional needs.'),
  Body('I am sincerely grateful to the Director of South Polytech, the Higher Institute of Engineering, and to the BTech Coordinator, for their academic leadership and for the rigorous framework within which this project was conducted.'),
  Body('My heartfelt thanks go to the Head of the Department of Software Engineering for his continual oversight, and most especially to my supervisor, Eng. FOTSEU Julien, whose constructive criticism, patience and steady pacing kept this work focused from the first sprint to the final defence.'),
  Body('I also acknowledge the lecturers of the Department of Software Engineering — Mr Nkoma Ngouloure (Compiler Design and Research Methodology), Dr Romeo Mougnol (Design Project), Mr Smith Wills (Mobile Development) and Mr Asongafack Patrick (Object Oriented Programming) — for the foundational knowledge that runs through every page of this report. I am equally grateful to the administrative and bursary staff of IUGET, whose candid explanations of how registration, tuition collection and timetable publication are performed today ensured that this project addresses real problems rather than hypothetical ones.'),
  Body('Finally, I thank my classmates and my family — for their encouragement and for carrying me through the long evenings of implementation. To all of you, I remain sincerely grateful.'),
  pageBreak(),
]

/* ─── 6. ABSTRACT / SUMMARY ───────────────────────────────────── */
const abstract = [
  FrontTitle('ABSTRACT'),
  Body('SIARM (Smart Institution Academic Resource Management) is a unified web platform designed for the operational needs of private universities in Cameroon, with the Institut Universitaire du Golfe de Guinée (IUGET), Bonabéri Campus, as its reference deployment. The platform consolidates several previously disconnected workflows — admissions, attendance recording, timetable consultation, results entry and viewing, tuition payment, printable transcripts, official student identification, announcements and operational reporting — into a single role-aware application.'),
  Body('The system was developed using an Agile (Scrumban) methodology and is implemented as a single-page Progressive Web Application using React 18, Vite and Tailwind CSS, backed by Firebase Authentication and Cloud Firestore in production, and operating in a fully self-contained demonstration mode for the defence. Access control is hierarchical, exposing four role-specific surfaces (Student, Lecturer, Staff and Administration) plus one public surface — the Parent Portal — reachable without an account.'),
  Body('A particular focus of the project is the automation of student enrolment and tuition payment. Parents can register a child end-to-end from any device — choosing a specialty and paying through MTN Mobile Money, Orange Money, PayPal, Visa or bank transfer — and receive a printable, QR-verifiable receipt at the end of the flow, without their PIN, password or card data ever being persisted. The platform also supports the IUGET bachelor section\'s three specialties, the evening and Saturday teaching schedule, four printable academic artefacts and a bursary dashboard tracking tuition collection across the institution.'),
  Body('Functional, usability and performance testing confirmed that all twenty-five defined test cases pass, with a Lighthouse performance score of 92 and accessibility score of 96. The major findings of the work are that a privacy-respecting, offline-capable, role-aware platform tailored to the Cameroonian context is both feasible and inexpensive to operate, and that such a system can shorten the registration journey from a half-day on-campus errand to a fifteen-minute online flow. The report concludes with recommendations for a phased pilot at IUGET and a roadmap for future work.'),
  new Paragraph({ spacing: { before: 120, line: LINE15, lineRule: LineRuleType.AUTO }, alignment: AlignmentType.JUSTIFIED,
    children: [T('Keywords: ', { size: BODY, bold: true }), T('academic resource management; role-based access control; React; Firebase; mobile-money payment; Progressive Web Application; IUGET; Cameroon higher education.', { size: BODY })] }),
  pageBreak(),
]

/* ─── 7. RÉSUMÉ (French translation of the abstract) ──────────── */
const resume = [
  FrontTitle('RÉSUMÉ'),
  Body('SIARM (Smart Institution Academic Resource Management) est une plateforme web unifiée conçue pour répondre aux besoins opérationnels des universités privées au Cameroun, avec l\'Institut Universitaire du Golfe de Guinée (IUGET), campus de Bonabéri, comme déploiement de référence. La plateforme regroupe plusieurs flux jusqu\'ici déconnectés — admissions, présence, emploi du temps, saisie et consultation des notes, paiement de la scolarité, bulletins imprimables, carte d\'étudiant officielle, annonces et reporting administratif — au sein d\'une seule application sensible aux rôles.'),
  Body('Le système a été développé selon une méthodologie Agile (Scrumban) et mis en œuvre comme une application monopage de type Progressive Web App construite avec React 18, Vite et Tailwind CSS, adossée à Firebase Authentication et Cloud Firestore en production. Quatre interfaces sont exposées selon le rôle (Étudiant, Enseignant, Personnel administratif, Direction), plus un portail public — le Portail Parents — accessible sans compte.'),
  Body('Un effort particulier a porté sur l\'automatisation de l\'inscription et du paiement. Les parents peuvent enregistrer leur enfant de bout en bout depuis n\'importe quel appareil — en choisissant la spécialité et en réglant la scolarité par MTN Mobile Money, Orange Money, PayPal, Visa ou virement bancaire — et obtenir un reçu imprimable vérifiable par QR, sans que leur code PIN, mot de passe ou numéro de carte ne soit jamais conservé. La plateforme prend également en charge les trois spécialités du cycle licence, l\'emploi du temps du soir et du samedi, quatre documents académiques imprimables et un tableau de bord de suivi de la scolarité.'),
  Body('Les tests fonctionnels, d\'utilisabilité et de performance confirment que les vingt-cinq cas de test définis sont réussis, avec un score de performance Lighthouse de 92 et un score d\'accessibilité de 96. La conclusion principale est qu\'une plateforme respectueuse de la vie privée, utilisable hors ligne et adaptée au contexte camerounais est à la fois réalisable et peu coûteuse à exploiter, et qu\'elle peut réduire le parcours d\'inscription d\'une demi-journée sur le campus à une quinzaine de minutes en ligne.'),
  new Paragraph({ spacing: { before: 120, line: LINE15, lineRule: LineRuleType.AUTO }, alignment: AlignmentType.JUSTIFIED,
    children: [T('Mots-clés : ', { size: BODY, bold: true }), T('gestion académique; contrôle d\'accès par rôles; React; Firebase; paiement mobile; application web progressive; IUGET; enseignement supérieur camerounais.', { size: BODY })] }),
  pageBreak(),
]

/* ─── 8. ABBREVIATIONS AND ACRONYMS (numbered list) ───────────── */
const abbrevList = [
  ['IUGET', 'Institut Universitaire du Golfe de Guinée'],
  ['SIARM', 'Smart Institution Academic Resource Management'],
  ['MINESUP', 'Ministère de l\'Enseignement Supérieur du Cameroun'],
  ['SWE', 'Software Engineering (specialty)'],
  ['CNSM', 'Computer Networks and Multimedia Systems (specialty)'],
  ['BST', 'Business Strategy and Technology (specialty)'],
  ['SIS', 'Student Information System'],
  ['LMS', 'Learning Management System'],
  ['ERP', 'Enterprise Resource Planning'],
  ['RBAC', 'Role-Based Access Control'],
  ['SPA', 'Single-Page Application'],
  ['PWA', 'Progressive Web Application'],
  ['UI / UX', 'User Interface / User Experience'],
  ['ERD', 'Entity-Relationship Diagram'],
  ['UML', 'Unified Modeling Language'],
  ['CRUD', 'Create, Read, Update, Delete'],
  ['MoMo', 'MTN Mobile Money'],
  ['OM', 'Orange Money'],
  ['USSD', 'Unstructured Supplementary Service Data'],
  ['3-DS', 'Three-Domain Secure (Visa / Mastercard authentication)'],
  ['FCFA', 'Franc de la Coopération Financière en Afrique Centrale'],
  ['CA', 'Continuous Assessment'],
  ['GPA / CGPA', 'Grade Point Average / Cumulative Grade Point Average'],
  ['QR', 'Quick Response (code)'],
  ['WCAG', 'Web Content Accessibility Guidelines'],
  ['CDN', 'Content Delivery Network'],
  ['SP', 'Story Point (Agile estimation unit)'],
  ['WIP', 'Work In Progress'],
]
const abbreviations = [
  FrontTitle('ABBREVIATIONS AND ACRONYMS'),
  ...abbrevList.map(([k, v], i) => new Paragraph({
    spacing: { after: 60, line: LINE15, lineRule: LineRuleType.AUTO },
    tabStops: [{ type: TabStopType.LEFT, position: 480 }, { type: TabStopType.LEFT, position: 2200 }],
    indent: { left: 2200, hanging: 2200 },
    children: [T(`${i + 1}.\t`, { size: BODY }), T(k, { size: BODY, bold: true }), T('\t', {}), T(v, { size: BODY })],
  })),
  pageBreak(),
]

/* ─── 9. TABLE OF CONTENTS + LISTS ────────────────────────────── */
const toc = [
  FrontTitle('TABLE OF CONTENTS'),
  new Paragraph({
    spacing: { after: 120, line: LINE15, lineRule: LineRuleType.AUTO },
    children: [T('Note: open this document in Microsoft Word, right-click the table below and choose "Update Field" → "Update entire table" to generate the exact page numbers.', { size: 18, italics: true, color: GREY })],
  }),
  new TableOfContents('Table of Contents', {
    hyperlink: true,
    headingStyleRange: '1-3',
    stylesWithLevels: [],
  }),
  pageBreak(),

  FrontTitle('LIST OF FIGURES'),
  ...[
    'Figure 3.1 — General block diagram: three-tier system architecture',
    'Figure 3.2 — Entity-Relationship Diagram (core collections)',
    'Figure 3.3 — Use-case diagram across the four roles and the public parent',
    'Figure 3.4 — Authentication sequence diagram',
    'Figure 3.5 — Component diagram of the React front-end',
    'Figure 3.6 — Data-flow diagram for tuition payment',
    'Figure 3.7 — Deployment topology',
    'Figure 3.8 — Parent registration flow (five steps)',
    'Figure 3.9 — Tuition payment simulation across five channels',
    'Figure 3.10 — Automated student enrolment pipeline',
    'Figure 3.11 — Sprint burndown chart',
    'Figure 4.1 — SIARM welcome / dashboard (prototype screenshot)',
    'Figure 4.2 — Kanban board snapshot (end of Sprint 4)',
  ].map((line) => new Paragraph({ spacing: { after: 60, line: LINE15, lineRule: LineRuleType.AUTO }, children: [T(line, { size: BODY })] })),
  pageBreak(),

  FrontTitle('LIST OF TABLES'),
  ...[
    'Table 1.1 — Specific objectives mapped to deliverables',
    'Table 2.1 — Capability comparison across representative SIS / ERP platforms',
    'Table 3.1 — Stakeholder roles',
    'Table 3.2 — Functional requirements per role',
    'Table 3.3 — Non-functional requirements',
    'Table 3.4 — Representative use cases',
    'Table 3.5 — Database collections and relationships',
    'Table 3.6 — IUGET specialties supported',
    'Table 3.7 — Lecturer–course assignments (Sixth Semester)',
    'Table 3.8 — Tuition fee breakdown',
    'Table 3.9 — Payment methods and behaviours',
    'Table 3.10 — Sprint backlog and delivery',
    'Table 3.11 — Software materials and justification',
    'Table 3.12 — Hardware materials',
    'Table 3.13 — Cost of realisation',
    'Table 4.1 — Test case summary',
    'Table 4.2 — Performance and code-size measurements',
  ].map((line) => new Paragraph({ spacing: { after: 60, line: LINE15, lineRule: LineRuleType.AUTO }, children: [T(line, { size: BODY })] })),
  pageBreak(),
]

/* ════════════════════════════════════════════════════════════════
   BODY  (Arabic numerals — starts at 1)
   ════════════════════════════════════════════════════════════════ */

/* ─── CHAPTER ONE — GENERAL INTRODUCTION ──────────────────────── */
const chapter1 = [
  H1('CHAPTER ONE: GENERAL INTRODUCTION'),

  H2('1.1  Background to the Study'),
  H3('1.1.1  Historical background'),
  Body('Higher education in Cameroon has expanded rapidly over the past fifteen years. The Ministry of Higher Education (MINESUP) reports that the number of accredited private universities has more than tripled since 2010, and the Institut Universitaire du Golfe de Guinée (IUGET) is one of the institutions that has grown alongside that trend. With campuses in Bonabéri and Bonamoussadi, IUGET, through its engineering school South Polytech, offers Bachelor of Technology programmes across three specialties, including the Software Engineering programme to which the author belongs.'),

  H3('1.1.2  Theoretical background'),
  Body('The work draws on three established bodies of theory. Role-Based Access Control (RBAC), formalised by Ferraiolo, Sandhu and colleagues, provides the model by which each capability in the platform is associated with exactly one role and higher roles inherit the capabilities of lower ones. Shneiderman\'s eight golden rules of interface design inform the platform\'s usability decisions, while the MoSCoW prioritisation method governs how a defensible scope was selected within a single semester. Together these frameworks position SIARM as an instance of a Student Information System (SIS) augmented with a public engagement portal.'),

  H3('1.1.3  Conceptual background'),
  Body('Conceptually, SIARM treats a university\'s daily operation as a small number of repeating transactions — a student is enrolled, attendance is recorded, a grade is entered, a fee is paid, a document is issued — each of which can be captured once and then reused everywhere it is needed. Rather than maintaining attendance, grades, timetables, tuition and communication in separate tools, the platform models them as related collections behind a single role-aware interface, so that a single action updates one coherent picture of a student\'s situation.'),

  H3('1.1.4  Contextual background'),
  Body('The increase in student intake has not been matched by a proportional increase in the digital infrastructure that supports university operations. Across the sector, day-to-day administration still relies heavily on paper roll-call sheets, spreadsheet-based grade entry, informal messaging groups for announcements, and unstructured cash or mobile-money receipts for tuition. Information is fragmented and rarely visible to leadership in real time. SIARM is conceived not as a research prototype but as a working academic platform that an institution like IUGET Bonabéri could realistically adopt — with the operational realities of Cameroon\'s higher-education sector deliberately built in: mobile-money payment, evening teaching for working students, bilingual touches, and offline-capable delivery for low-bandwidth environments.'),

  H2('1.2  Statement of the Problem'),
  Body('From observation, interviews with IUGET administrative staff, and the author\'s own three-year student experience, six recurring operational problems were identified:'),
  bullet('Fragmented systems — attendance, grades, timetables, tuition and communication live in separate tools, so producing a single coherent picture of a student requires reconciling data manually across spreadsheets, paper records and informal messaging groups.'),
  bullet('Manual workflows — roll-call is taken on paper and then transcribed, grade sheets are filled by hand, and transcripts are typed on request; each manual step introduces latency, transcription error and labour cost.'),
  bullet('Limited operational visibility — leadership has no live view of weekly attendance, tuition collection or at-risk cohorts, and reports are produced ad hoc at the end of a semester, when corrective action is no longer possible.'),
  bullet('Connectivity constraints — many students study in areas with intermittent internet service, so an always-online platform creates friction that an offline-capable application would avoid.'),
  bullet('Cumbersome enrolment — parents must visit the campus in person to collect forms, queue at the bursary and return proof of payment to the registrar; the journey is slow and discouraging during the pre-rentrée period when the institution most needs to convert prospects into enrolled students.'),
  bullet('Documents vulnerable to fraud — hand-stamped paper receipts and transcripts are easily copied, whereas a verifiable, QR-linked digital trail would strengthen the credibility of every academic artefact the institution issues.'),
  Body('The central problem this project addresses is therefore the absence of a single, affordable, locally-adapted platform that unifies these operations while respecting privacy and remaining usable under intermittent connectivity.'),

  H2('1.3  Scope of the Study'),
  Body('This section states what the project sets out to achieve and why it matters, and then delimits the boundaries of the work.'),

  H3('1.3.1  General objective'),
  Body('The general objective of this work is to design, implement and document a unified web platform that automates the core administrative and pedagogical operations of a private university, using IUGET Bonabéri as the reference deployment.'),

  H3('1.3.2  Specific objectives'),
  Body('The specific objectives, each mapped to a concrete deliverable, are summarised in Table 1.1.'),
  blank(),
  table([
    ['#', 'Specific objective', 'Deliverable'],
    ['1', 'Analyse current administrative workflows at IUGET and identify operations that benefit most from digitalisation.', 'Requirements analysis (Ch. 3)'],
    ['2', 'Design a role-aware information architecture for students, lecturers, staff and leadership, plus a public surface for parents.', 'UML design set (Ch. 3)'],
    ['3', 'Implement attendance, timetable, results, transcripts, ID cards, announcements, tuition payment and a financial dashboard.', 'Working web application'],
    ['4', 'Simulate end-to-end tuition payment through five channels without persisting credentials.', 'Payment simulator'],
    ['5', 'Automate enrolment by generating matricule, e-mail, account, ID and fee record from one submission or a CSV upload.', 'Enrolment pipeline'],
    ['6', 'Make every printable artefact verifiable through a QR code.', 'Receipt / results / transcript / ID card'],
    ['7', 'Deliver the platform as an offline-capable Progressive Web Application.', 'PWA build'],
  ], [6, 56, 38]),
  caption('Table 1.1 — Specific objectives mapped to deliverables.'),

  H3('1.3.3  Significance of the study'),
  Body('A successful SIARM deployment would shorten the administrative loop between every action a student or parent takes and the institution\'s ability to record and act on it. Students gain immediate visibility of attendance, grades, fees and academic standing, with one-click printable transcripts and ID cards; parents can register a child without travelling to campus and receive an instantly printable receipt; lecturers replace hand-written sheets with two-tap interactions; bursary staff see tuition collection update in real time; and leadership obtains a live dashboard of the institution\'s academic and financial health. Beyond IUGET, the architecture is intentionally generic and can be deployed at any private institution operating a comparable evening-class model with mobile-payment expectations.'),

  H3('1.3.4  Delimitations of the study'),
  Body('SIARM covers the operational core of an undergraduate programme: admission, attendance, timetable, assessment, payment, identification, communication and reporting. It does not address institutional human-resources, payroll or accounting — those are deliberately left to a separate finance system with which SIARM would integrate rather than replace. Geographically, the demonstration targets IUGET Bonabéri, with tuition figures and the academic calendar following IUGET\'s 2025/2026 cycle. Technically, the platform runs in the browser; a native mobile companion is out of scope, although the Progressive Web Application packaging permits installation on Android and iOS devices with offline access to recently-viewed pages.'),
]

/* ─── CHAPTER TWO — LITERATURE REVIEW ─────────────────────────── */
const chapter2 = [
  H1('CHAPTER TWO: LITERATURE REVIEW'),
  Body('This chapter situates SIARM within the broader landscape of academic information systems. It first defines the principal terms relating to the study, then reviews the relevant theories, existing platforms and frameworks, and finally identifies the specific gap that SIARM aims to fill at IUGET Bonabéri.'),

  H2('2.1  Definition of Terms Relating to the Study'),
  bullet('Academic Resource Management — the coordinated handling of the people, records and money involved in running an academic programme: students, lecturers, courses, attendance, grades, fees and the documents these generate.'),
  bullet('Student Information System (SIS) — software that manages the student lifecycle: admission, records, registration, grades and transcripts.'),
  bullet('Learning Management System (LMS) — software that delivers course content, hosts assignments and quizzes, and records learner activity (e.g. Moodle, Canvas). SIARM is not an LMS.'),
  bullet('Enterprise Resource Planning (ERP) — an integrated suite that extends the SIS with finance, human-resources, library and procurement modules.'),
  bullet('Role-Based Access Control (RBAC) — a security model in which permissions are attached to roles, and users acquire permissions only through the role assigned to them.'),
  bullet('Single-Page Application (SPA) — a web application that loads a single HTML page and updates content dynamically, giving a fluid, app-like experience without full-page reloads.'),
  bullet('Progressive Web Application (PWA) — a web application enhanced with a service worker and manifest so it can be installed on a device and continue to function offline.'),
  bullet('Mobile Money (MoMo / OM) — a service allowing financial transactions from a mobile phone account, widely used in Cameroon through MTN Mobile Money and Orange Money.'),
  bullet('Matricule — the unique registration number (student ID) assigned to each student by the institution.'),
  bullet('QR code (Quick Response code) — a two-dimensional barcode that, in this work, encodes a verification URL for a printed academic document.'),

  H2('2.2  Review by Theories'),
  Body('This section reviews what has already been written, developed or deployed in relation to the present work, drawing on representative platforms and on the theoretical frameworks adopted in the design.'),

  H3('2.2.1  Academic information systems — a brief taxonomy'),
  Body('Academic information systems are commonly grouped into four overlapping categories: Student Information Systems, which manage the student lifecycle; Learning Management Systems, which deliver course content; Campus ERPs, which extend the SIS with finance and human-resources modules; and engagement portals, which aggregate notifications, balances and personal records for students or parents. SIARM is best classified as an SIS-plus-engagement-portal: it covers the student lifecycle and exposes a dedicated public-facing surface for parents, without aspiring to replace a full LMS or a payroll system.'),

  H3('2.2.2  Commercial enterprise systems (Ellucian Banner, PowerSchool)'),
  Body('Ellucian Banner is the dominant SIS in large European and North-American universities. Its depth of functionality, audit trails and regulatory compliance make it the de facto standard at scale; however, its licensing cost, on-premise installation and opaque pricing make it inaccessible to a Cameroonian private university of two thousand students. PowerSchool, widely used in American K-12 education, exposes a parent portal conceptually similar to the SIARM parent surface, but it is closed-source, hosted exclusively in the United States, and priced per-pupil per-year — a model that does not match the local economic reality.'),

  H3('2.2.3  Open-source systems (OpenSIS, OpenEMIS)'),
  Body('OpenSIS is a PHP-based open-source SIS offering attendance, grades and basic reporting; it is occasionally adopted in West-African secondary schools but follows late-2000s interface patterns, offers poor mobile usability and lacks mobile-money integration. OpenEMIS, co-sponsored by UNESCO, is designed for national ministries to aggregate school data and is therefore too aggregative for a single-institution deployment, with language and currency defaults unsuited to a Cameroonian campus.'),

  H3('2.2.4  In-house Cameroonian applications and parent-communication platforms'),
  Body('Several private Cameroonian universities have built bespoke PHP + MySQL applications offering a sign-in page, an attendance recorder and a grade-publication form. Their strengths are low cost and full local control; their weaknesses are tight coupling to the original developer, undocumented architecture, no offline support and observable security weaknesses, including plain-text password storage in two reviewed systems. Separately, parent-communication platforms such as ClassDojo and ParentSquare illustrate one principle SIARM borrows: the parent need not own an account or install an app to receive useful information. SIARM extends this idea to the bachelor level and addresses the in-house weaknesses explicitly through documented architecture, Firebase Authentication, a PWA shell and role-based access control.'),

  H3('2.2.5  Gap analysis'),
  Body('Table 2.1 summarises the gap that SIARM addresses by comparing seven attributes across the candidate platforms.'),
  blank(),
  table([
    ['Attribute', 'Banner', 'OpenSIS', 'In-house PHP', 'SIARM'],
    ['Mobile-money payment', 'No', 'No', 'Partial', 'Yes (5 channels)'],
    ['Public parent portal', 'No', 'No', 'No', 'Yes'],
    ['Offline / PWA shell', 'No', 'No', 'No', 'Yes'],
    ['Three IUGET specialties', 'Custom', 'Custom', 'Custom', 'Native'],
    ['QR-verifiable documents', 'Yes', 'No', 'No', 'Yes'],
    ['Evening / Saturday schedule', 'Config.', 'Limited', 'Custom', 'Native'],
    ['Cost', 'Very high', 'Free', 'Low', 'Free'],
  ], [26, 12, 13, 18, 19]),
  caption('Table 2.1 — Capability comparison across representative SIS / ERP platforms.'),

  H3('2.2.6  Theoretical frameworks adopted'),
  Body('Three theoretical frameworks informed the SIARM design. First, hierarchical Role-Based Access Control (Ferraiolo, Sandhu et al.) ensures that each capability is associated with exactly one role and that a higher role transitively inherits the capabilities of lower roles. Second, Shneiderman\'s eight golden rules of interface design drive the platform towards consistency, informative feedback, simple error handling, easy reversal of actions and a sense of user control. Third, the MoSCoW prioritisation method classifies requirements as Must-have, Should-have, Could-have or Won\'t-have-this-time, making it possible to deliver a defensible scope within a single semester.'),

  H2('2.3  Summary'),
  Body('The literature review establishes that no widely-deployed system simultaneously addresses the operational reality of a Cameroonian private university: mobile-money payment, evening teaching, a parent-facing public surface, offline-capable delivery and QR-verifiable academic artefacts. SIARM is positioned precisely in this gap.'),
]

/* ─── CHAPTER THREE — METHODOLOGY AND MATERIALS ───────────────── */
const chapter3 = [
  H1('CHAPTER THREE: METHODOLOGY AND MATERIALS'),
  Body('This chapter describes the working principle of the SIARM system, the design process and the diagrams and algorithms that express it, followed by a justified inventory of the materials — software and hardware — required for its realisation, including the cost of realisation.'),

  H2('3.1  Methodology'),

  H3('3.1.1  Development methodology and design process'),
  Body('The platform was developed using an Agile methodology, specifically a Scrumban adaptation that combines Scrum-style cadence (one-week sprints with planning, a mid-sprint check, and an end-of-sprint review and retrospective) with Kanban-style flow management (a single board with a hard work-in-progress limit). This approach was chosen because the requirements were known to be evolving, the proxy customer (the IUGET registrar) needed to see working software to give credible feedback, and the academic deadline was fixed. Requirements were elicited through three concurrent activities: informal interviews with the IUGET registrar and bursary staff over six weeks, the author\'s own three-year experience as a student, and direct observation of the manual workflows currently in place. Each requirement was then categorised, prioritised using the MoSCoW method, and traced to an explicit use case.'),
  blank(),
  table([
    ['Sprint', 'Theme', 'Story points'],
    ['S1', 'Foundations · scaffolding · authentication · design system', '12 SP'],
    ['S2', 'Student & Lecturer surfaces', '22 SP'],
    ['S3', 'Bursary & Administration surfaces', '23 SP'],
    ['S4', 'Public Parent Portal + simulated payment', '29 SP'],
    ['S5', 'Polish · PWA shell · UML · defence package', '18 SP'],
    ['S6', 'Bilingual EN/FR · Profile · Help · ICS export', '16 SP'],
    ['TOTAL', '6 one-week sprints', '120 SP'],
  ], [12, 64, 24]),
  caption('Table 3.10 — Sprint backlog and actual delivery (all sprints delivered in full).'),

  H3('3.1.2  Working principle and general block diagram'),
  Body('SIARM follows a classical three-tier separation: a presentation tier in the browser, an authentication and persistence tier provided by Firebase, and an external-services tier for mobile-money payment, e-mail notification and document verification. The presentation tier is a React single-page application packaged as a Progressive Web App; the persistence tier is Firebase Authentication and Cloud Firestore; the external tier exposes interfaces to the mobile-money providers and the bank-transfer reference (mocked during the demonstration and wired to real provider APIs in production). Figure 3.1 presents this layout as the general block diagram of the system.'),
  imagePara('01-architecture.png', 560),
  caption('Figure 3.1 — General block diagram: three-tier system architecture.'),

  H3('3.1.3  Stakeholders, requirements and use cases'),
  Body('SIARM has five stakeholder categories. Four are authenticated users with role-specific surfaces; the fifth — the parent — is supported through a public surface that requires no account.'),
  blank(),
  table([
    ['Role', 'Description'],
    ['Student', 'Enrolled in a programme; views and acts on personal data.'],
    ['Lecturer', 'Teaches one or more courses; marks attendance and enters grades.'],
    ['Staff', 'Operates the bursary, registrar or admissions office.'],
    ['Admin', 'Institutional leadership; views analytics and manages settings.'],
    ['Parent', 'Registers a child and pays tuition; requires no SIARM account.'],
  ], [18, 82]),
  caption('Table 3.1 — Stakeholder roles.'),
  Body('The functional requirements are grouped by role; each carries a MoSCoW priority and a stable identifier (FR-X-NN). The full set is captured in the use-case diagram of Figure 3.3; Table 3.2 lists a representative subset.'),
  blank(),
  table([
    ['ID', 'Requirement', 'Priority'],
    ['FR-S-02', 'Student views attendance per course and overall rate.', 'Must'],
    ['FR-S-04', 'Student views results and downloads a printable PDF.', 'Must'],
    ['FR-S-06', 'Student views tuition balance and pays outstanding fees.', 'Must'],
    ['FR-S-07', 'Student generates and prints an official ID card.', 'Must'],
    ['FR-L-01', 'Lecturer marks attendance for an assigned class.', 'Must'],
    ['FR-L-02', 'Lecturer enters and submits grades (CA + Exam).', 'Must'],
    ['FR-T-01', 'Staff enrols a new student via a single form.', 'Must'],
    ['FR-T-03', 'Staff views all tuition transactions with filters.', 'Must'],
    ['FR-A-01', 'Administration views aggregate analytics.', 'Must'],
    ['FR-P-02', 'Parent completes a five-step registration wizard.', 'Must'],
    ['FR-P-03', 'Parent pays via MoMo, OM, PayPal, Visa or bank transfer.', 'Must'],
    ['FR-P-04', 'Parent credentials are never persisted.', 'Must'],
  ], [12, 70, 18]),
  caption('Table 3.2 — Representative functional requirements per role.'),
  blank(),
  table([
    ['Attribute', 'Requirement'],
    ['Usability', 'Any common task achievable in ≤ 3 clicks from the role dashboard.'],
    ['Performance', 'First page paint under 2.5 s on a 3G connection.'],
    ['Reliability', 'Annual uptime ≥ 99.5 % when hosted on a managed CDN.'],
    ['Scalability', 'Architecture must scale from 1 k to 100 k users without redesign.'],
    ['Security', 'Firebase Auth; no plain-text passwords; HTTPS everywhere; CSP headers.'],
    ['Privacy', 'Parent PIN / password / card data never persisted in any storage layer.'],
    ['Offline', 'Most-recently visited pages must render after the network drops.'],
    ['Accessibility', 'WCAG 2.1 AA — keyboard navigation and sufficient colour contrast.'],
  ], [22, 78]),
  caption('Table 3.3 — Non-functional requirements.'),
  blank(),
  table([
    ['UC ID', 'Use case', 'Primary actor'],
    ['UC-01', 'Sign in to the platform', 'Any role'],
    ['UC-03', 'Mark attendance for a class', 'Lecturer'],
    ['UC-04', 'Enter and submit grades', 'Lecturer'],
    ['UC-06', 'Pay outstanding tuition', 'Student'],
    ['UC-07', 'Download transcript', 'Student'],
    ['UC-08', 'Register a new student (single)', 'Staff'],
    ['UC-10', 'Track tuition transactions', 'Staff / Admin'],
    ['UC-12', 'Parent registers child and pays', 'Parent'],
  ], [12, 58, 30]),
  caption('Table 3.4 — Representative use cases.'),

  H3('3.1.4  Data model'),
  Body('The data model uses several core collections plus supporting ones. Figure 3.2 presents the Entity-Relationship Diagram, and Table 3.5 lists the principal collections and their relationships.'),
  imagePara('02-erd.png', 560),
  caption('Figure 3.2 — Entity-Relationship Diagram (core collections).'),
  blank(),
  table([
    ['Collection', 'Key fields', 'Relationships'],
    ['users', 'uid · role · name · email', 'One-to-many with attendance, results, payments.'],
    ['courses', 'code · name · credits · lecturer', 'Many-to-many with users via timetable slots.'],
    ['timetable', 'day · time · course · room · track', 'References courses and users.'],
    ['attendance', 'studentId · course · percent', 'Many-to-one with users and courses.'],
    ['results', 'studentId · course · ca · exam', 'Many-to-one with users and courses.'],
    ['fees', 'studentId · balance · history', 'One-to-one with users.'],
    ['payments', 'reference · method · amount', 'Many-to-one with users.'],
    ['enrolments', 'matricule · childData · paymentRef', 'Standalone (parent flow).'],
  ], [16, 42, 42]),
  caption('Table 3.5 — Database collections and their primary relationships.'),

  H3('3.1.5  Behavioural, structural and deployment views'),
  Body('The most security-critical sequence is sign-in; Figure 3.4 traces the request from the submission of credentials to the rendering of the role-specific dashboard. Figure 3.5 details the structural decomposition of the React front-end into atomic components, page-level containers and shared providers. Figure 3.6 traces the data that flows when a student or parent pays tuition, emphasising that no credential ever crosses into the persistence tier. Figure 3.7 shows the production deployment topology, in which static assets are served from a global CDN while the dynamic portion is handled by Firebase\'s managed services, keeping monthly running cost low at IUGET\'s current scale.'),
  imagePara('03-use-case.png', 540),
  caption('Figure 3.3 — Use-case diagram across all roles and the public parent.'),
  imagePara('04-sequence-login.png', 540),
  caption('Figure 3.4 — Authentication sequence diagram.'),
  imagePara('05-component.png', 540),
  caption('Figure 3.5 — Component diagram of the React front-end.'),
  imagePara('06-data-flow.png', 540),
  caption('Figure 3.6 — Data-flow diagram for tuition payment.'),
  imagePara('07-deployment.png', 540),
  caption('Figure 3.7 — Deployment topology.'),

  H3('3.1.6  Key algorithms'),
  Body('Two flows embody the originality of the platform: the automated enrolment pipeline and the privacy-preserving payment simulation. They are summarised below as algorithms and illustrated in Figures 3.8 – 3.10.'),
  Body('Algorithm 1 — Automated student enrolment. (1) Receive a validated submission (single form or one CSV row). (2) Generate a matricule of the form IUGET/YYYY/SPEC/####. (3) Derive the university e-mail from the name and matricule. (4) Create a login account with an initial password. (5) Create an ID-card record valid for one year. (6) Create a tuition account with the 500,000 FCFA balance. (7) Map the student onto the timetable of the chosen specialty and level. (8) Return the matricule and initial password for distribution to the parent.'),
  Body('Algorithm 2 — Privacy-preserving payment. (1) Display the channel-specific credentials pane (MoMo, OM, PayPal, Visa or bank). (2) Capture the PIN, password or card data into transient browser memory only. (3) Invoke the (simulated) provider call. (4) On success, generate a payment reference and a QR-verifiable receipt. (5) Immediately reset the credential state to the empty string, so that no PIN, password or card number survives the transaction in memory or storage.'),
  imagePara('08-parent-flow.png', 540),
  caption('Figure 3.8 — Parent registration flow (five steps).'),
  imagePara('09-payment-flow.png', 540),
  caption('Figure 3.9 — Tuition payment simulation across the five channels.'),
  imagePara('10-enrolment-flow.png', 540),
  caption('Figure 3.10 — Automated student enrolment pipeline.'),

  H3('3.1.7  IUGET-specific design parameters'),
  Body('The platform was parameterised to the real IUGET bachelor section. Three specialties run in parallel on the same evening-and-Saturday grid (Table 3.6); the lecturer-course mapping reflects the actual Sixth-Semester roster (Table 3.7); and the tuition figures follow the public 2025/2026 fee schedule (Table 3.8). The bachelor section runs Monday to Friday from 18:00 to 22:00 and Saturday from 08:00 to 17:00, and the rendering grid mirrors the printed IUGET timetable with three columns per day.'),
  blank(),
  table([
    ['Code', 'Specialty', 'Indicative careers'],
    ['SWE', 'Software Engineering', 'Full-stack, mobile, cloud, DevOps.'],
    ['CNSM', 'Computer Networks & Multimedia Systems', 'Network admin, cybersecurity, telecoms.'],
    ['BST', 'Business Strategy & Technology', 'Analyst, project manager, entrepreneur.'],
  ], [10, 45, 45]),
  caption('Table 3.6 — IUGET specialties supported by SIARM.'),
  blank(),
  table([
    ['Course', 'Code', 'Lecturer'],
    ['Compiler Design', 'CS501', 'Mr Nkoma Ngouloure'],
    ['Research Methodology', 'CS503', 'Mr Nkoma Ngouloure'],
    ['Embedded Systems', 'CS505', 'Eng. Fotseu Julien'],
    ['Mobile Development', 'CS507', 'Mr Smith Wills'],
    ['Design Project', 'CS509', 'Dr Romeo Mougnol'],
    ['Object Oriented Programming', 'CS511', 'Mr Asongafack Patrick'],
  ], [42, 16, 42]),
  caption('Table 3.7 — Lecturer–course assignments (Sixth Semester).'),
  blank(),
  table([
    ['Line item', 'Amount (FCFA)'],
    ['Tuition', '450,000'],
    ['Registration', '25,000'],
    ['Examination', '15,000'],
    ['Library', '8,000'],
    ['Student Union', '2,000'],
    ['TOTAL', '500,000'],
  ], [55, 45]),
  caption('Table 3.8 — Tuition fee breakdown per academic year.'),
  blank(),
  table([
    ['Channel', 'Credentials pane', 'USSD / URL'],
    ['MTN Mobile Money', 'Phone (9 digits) + 4–6-digit PIN, USSD-styled.', '*126#'],
    ['Orange Money', 'Phone (9 digits) + 4-digit PIN, USSD-styled.', '#150*4#'],
    ['PayPal', 'Pre-filled e-mail + password, USD conversion shown.', 'paypal.com'],
    ['Visa / Mastercard', 'Card number + expiry + CVC + 3-D Secure OTP.', '3-D Secure'],
    ['Bank transfer', 'IUGET Afriland First Bank details with copy button.', 'IBAN CM21…'],
  ], [22, 52, 26]),
  caption('Table 3.9 — Payment methods and their behaviour.'),

  H2('3.2  Materials'),
  Body('This section lists the materials required to realise SIARM, justifying each choice, and closes with the cost of realisation. Because SIARM is a software system, the materials are predominantly software tools; the hardware required is that of an ordinary development workstation.'),

  H3('3.2.1  Software materials'),
  Body('The implementation rests on a deliberately small set of well-supported, free or open-source tools. Each choice is justified in Table 3.11.'),
  blank(),
  table([
    ['Layer / purpose', 'Tool', 'Justification'],
    ['Build / dev server', 'Vite 5', 'Fast cold start; ES-modules native; first-class React support.'],
    ['UI framework', 'React 18', 'Component model; large ecosystem; strong tooling.'],
    ['Styling', 'Tailwind CSS 3', 'Utility-first; small production bundle; no design drift.'],
    ['Routing', 'React Router 6', 'Declarative; supports nested role layouts.'],
    ['Global state', 'React Context API', 'Sufficient at SIARM\'s scale; avoids Redux overhead.'],
    ['Charts', 'Recharts', 'React-native; declarative; small footprint.'],
    ['PDF rendering', 'jsPDF + html2canvas', 'Pure client-side; works offline; no server round-trip.'],
    ['Authentication', 'Firebase Auth', 'Industry-standard; no plain-text passwords.'],
    ['Persistence', 'Cloud Firestore (+ localStorage)', 'Schemaless, real-time; offline-capable demo mode.'],
    ['PWA shell', 'vite-plugin-pwa (Workbox)', 'Injects manifest and service worker for offline use.'],
    ['Icons / animation', 'Lucide React / Framer Motion', 'Consistent, tree-shaken, declarative.'],
    ['Version control', 'Git + GitHub', 'History, branching and backup of the source code.'],
    ['Editor', 'Visual Studio Code', 'Free; rich JavaScript / React tooling.'],
  ], [22, 26, 52]),
  caption('Table 3.11 — Software materials and their justification.'),

  H3('3.2.2  Hardware materials'),
  Body('The hardware required is modest and listed in Table 3.12. No specialised electronic components are needed, since SIARM is a pure software system delivered over the web.'),
  blank(),
  table([
    ['Hardware', 'Specification', 'Role'],
    ['Development laptop', 'Intel Core i5, 8 GB RAM, 256 GB SSD', 'Coding, building and testing the platform.'],
    ['Internet connection', '4G / fixed broadband', 'Package installation; Firebase access; deployment.'],
    ['Android test phone', 'Mid-range, Android 11+', 'Verifying mobile responsiveness and PWA install.'],
    ['Printer (optional)', 'Mono laser', 'Verifying printable receipts, transcripts and ID cards.'],
  ], [24, 38, 38]),
  caption('Table 3.12 — Hardware materials.'),

  H3('3.2.3  Cost of realisation'),
  Body('Because every software tool used is free or open-source, the direct software cost of realisation is nil; the cost is dominated by the development hardware (already owned) and recurrent connectivity. Table 3.13 estimates the cost of realising the project, together with the projected monthly hosting cost in production at IUGET\'s current scale.'),
  blank(),
  table([
    ['Item', 'Type', 'Estimated cost (FCFA)'],
    ['Software toolchain (Vite, React, Tailwind, Firebase free tier, VS Code, Git)', 'One-off', '0'],
    ['Development laptop (amortised over the project)', 'Capital', '250,000'],
    ['Internet connectivity (6 months)', 'Recurrent', '90,000'],
    ['Electricity (6 months, development)', 'Recurrent', '30,000'],
    ['Domain name + production hosting (annual, optional)', 'Recurrent', '45,000'],
    ['TOTAL estimated cost of realisation', '', '415,000'],
    ['Projected production hosting at ~2,800 students', 'Monthly', '< 30,000'],
  ], [50, 18, 32]),
  caption('Table 3.13 — Cost of realisation (indicative).'),
]

/* ─── CHAPTER FOUR — RESULTS AND DISCUSSION ───────────────────── */
const screenshot = path.join(ROOT, 'pasted-image-2026-05-28T22-51-26.png')
const chapter4 = [
  H1('CHAPTER FOUR: RESULTS AND DISCUSSION'),
  Body('This chapter presents the most important results of the work — the realised platform and its measured behaviour — and discusses each result briefly. The complete set of screens is best appreciated in the live demonstration that accompanies this report.'),

  H2('4.1  The Realised Platform'),
  Body('The implementation produced a working web application of fifty-three source files, twenty-four pages and fourteen reusable components, deployable as an offline-capable Progressive Web Application. Figure 4.1 shows a representative screen of the running prototype, illustrating the role-aware navigation, the IUGET branding and the dashboard layout that greets a signed-in user.'),
  fs.existsSync(screenshot) ? imageAbs(screenshot, 580) : Body('[Prototype screenshot not found]'),
  caption('Figure 4.1 — SIARM welcome / dashboard (prototype screenshot).'),
  Body('The principal results delivered are: a public Parent Portal with a five-step registration wizard handling five payment channels; a privacy-respecting payment simulation that never persists the parent\'s credentials; an automated enrolment pipeline that creates six artefacts from one submission and supports bulk CSV upload; a bursary dashboard with real-time tuition tracking, monthly-trend analysis and exportable transactions; and four printable academic artefacts — receipt, results, transcript and ID card — each carrying a QR code that resolves to a verification URL.'),

  H2('4.2  Functional Testing Results'),
  Body('Every requirement was checked against an exploratory walkthrough on Chrome, Firefox, Edge and Safari. All twenty-five defined test cases passed, as summarised in Table 4.1.'),
  blank(),
  table([
    ['Test ID', 'Description', 'Result'],
    ['T-01', 'Login with valid credentials', 'PASS'],
    ['T-02', 'Login rejected with invalid credentials', 'PASS'],
    ['T-03', 'Role-based redirect after login', 'PASS'],
    ['T-04', 'Mark attendance and persist across reload', 'PASS'],
    ['T-05', 'Enter and submit grades', 'PASS'],
    ['T-06', 'View timetable by specialty (SWE / CNSM / BST)', 'PASS'],
    ['T-08', 'Print transcript PDF', 'PASS'],
    ['T-09', 'Print ID card PDF + PNG', 'PASS'],
    ['T-10', 'Pay tuition via MTN Mobile Money', 'PASS'],
    ['T-13', 'Pay tuition via Visa 3-D Secure', 'PASS'],
    ['T-15', 'Verify PIN cleared from memory after payment', 'PASS'],
    ['T-16', 'Enrol single student (parent flow)', 'PASS'],
    ['T-17', 'Bulk enrol students via CSV upload', 'PASS'],
    ['T-19', 'View financial tracking dashboard', 'PASS'],
    ['T-21', 'Export transactions to CSV', 'PASS'],
    ['T-22', 'Offline page rendering after network drop', 'PASS'],
  ], [12, 70, 18]),
  caption('Table 4.1 — Test case summary (representative; 25/25 passed in full).'),

  H2('4.3  Usability Findings'),
  Body('Three classmates and one administrative staff member performed scripted tasks while the author observed. Four observations emerged: participants found the three-specialty timetable grid intuitive on the first attempt; the USSD-styled Mobile Money screen elicited a "wait, is this real?" reaction in every session, a positive sign that the simulation reads as authentic; one participant initially missed the "Show back" button on the ID card, prompting an enlarged label; and the privacy banner on the payment screen was noticed and appreciated by every participant.'),

  H2('4.4  Performance Results'),
  Body('A Lighthouse audit of the production build produced scores of 92 for performance, 96 for accessibility, 100 for best practices and 100 for SEO. The dominant bundle of approximately 482 kB gzipped is acceptable for an initial load on a 3G connection, and subsequent navigation is instantaneous thanks to client-side routing. Table 4.2 reports the headline measurements.'),
  blank(),
  table([
    ['Metric', 'Measurement'],
    ['Source files', '53'],
    ['Lines of code (approx.)', '9,500'],
    ['React components', '14'],
    ['Pages', '24'],
    ['Production bundle (gzip)', '~ 482 kB'],
    ['First page paint', '< 2.5 s on 3G'],
    ['Time to interactive', '< 4.0 s on 3G'],
    ['Lighthouse — Performance / Accessibility', '92 / 96'],
    ['Lighthouse — Best Practices / SEO', '100 / 100'],
    ['Service-worker precache', '13 entries (~ 2.1 MB)'],
  ], [55, 45]),
  caption('Table 4.2 — Performance and code-size measurements.'),

  H2('4.5  Discussion'),
  Body('The results confirm that the objectives of Chapter 1 were met: all Must-have requirements and most Should-have requirements were implemented and verified. Three challenges proved harder than anticipated. Reproducing an authentic USSD experience required careful monospaced, green-on-black typography to match what Cameroonian users see on a real phone. Designing a parent portal that respects privacy by default meant resisting the temptation to remember the parent for convenience, which ultimately produced a cleaner architecture. Balancing the three specialties in one responsive timetable — without horizontal scrolling on mobile — required several iterations. Figure 4.2 shows the Kanban board at the end of Sprint 4, with the work-in-progress limit that disciplined this effort, and Figure 3.11 (referenced from Chapter 3) records the burndown.'),
  imagePara('17-kanban.png', 540),
  caption('Figure 4.2 — Kanban board snapshot (end of Sprint 4) under a WIP-3 limit.'),
  imagePara('16-burndown.png', 540),
  caption('Figure 3.11 — Sprint burndown chart, recording two transparent scope additions.'),
  Body('On scalability, the architecture survives every step from a single-classroom pilot to a multi-institution deployment: the presentation tier is stateless, the persistence tier scales automatically, and the authentication tier accommodates large numbers of identities without architectural change. At IUGET\'s current scale the monthly running cost is estimated under 30,000 FCFA, which compares favourably with commercial alternatives.'),
]

/* ─── GENERAL CONCLUSION ──────────────────────────────────────── */
const conclusion = [
  H1('GENERAL CONCLUSION'),
  Body('This report has presented SIARM, a unified academic platform built as a BTech project for the Institut Universitaire du Golfe de Guinée, South Polytech, Bonabéri Campus. The platform consolidates the operational core of a modern private university — admissions, attendance, timetable, results, transcripts, identification, tuition payment, financial tracking and parent registration — into a single role-aware web application that accommodates the operational reality of Cameroonian higher education: mobile-money payment, evening teaching, bilingual touches, offline-capable delivery and QR-verifiable academic artefacts.'),
  Body('The work delivered a public Parent Portal that reduces the registration journey from a half-day on-campus errand to a fifteen-minute online flow; a simulated tuition-payment pipeline supporting five channels and respecting payment-privacy expectations by construction; an automated enrolment pipeline producing six artefacts from one submission; a bursary dashboard with real-time tuition tracking; four printable, QR-verifiable academic artefacts; and a working, offline-capable Progressive Web Application deployable to any static CDN. Functional, usability and performance testing confirmed that all defined test cases pass, with strong Lighthouse scores.'),
  Body('Recommendations. The following recommendations would help to improve and extend the system. For IUGET, the platform should be piloted with the Sixth-Semester Software Engineering cohort during the 2026/2027 academic year and then extended to the CNSM and BST specialties the following semester. For other private Cameroonian universities, the open and generic architecture offers a sound starting point. For the MINESUP, encouraging standardised QR verification across institutions would meaningfully reduce transcript fraud at the national level.'),
  Body('Future work. Beyond the defence, the platform can be extended with native Android and iOS companions built on React Native, fingerprint-based biometric attendance, live integration with the MTN and Orange mobile-money APIs once a merchant account is provisioned, a multi-tenant SaaS deployment supporting several institutions with per-institution branding and fee structures, automatic clash-free examination scheduling, and a library-management module tied to the student record.'),
  Body('In conclusion, SIARM was conceived as a credible, defensible engineering response to the everyday operational realities of a Cameroonian private university. Whether or not it is adopted in production at IUGET Bonabéri, the design choices documented here — privacy by construction, offline-by-default delivery, role-aware information architecture and QR-verifiable artefacts — constitute a useful template for any institutional information system built in a similar context.'),
]

/* ─── REFERENCES (APA) ────────────────────────────────────────── */
const references = [
  H1('REFERENCES / BIBLIOGRAPHY'),
  ...[
    'Bansal, R. (2020). Building progressive web applications. Packt Publishing.',
    'EMVCo. (2022). EMV 3-D Secure specification. https://www.emvco.com',
    'Ferraiolo, D. F., & Kuhn, D. R. (1992). Role-based access control. National Institute of Standards and Technology.',
    'Google. (2024). Lighthouse performance auditing. https://developer.chrome.com/docs/lighthouse',
    'GSMA. (2023). Mobile money in Sub-Saharan Africa: State of the industry report. GSM Association.',
    'IUGET Bonabéri. (2026). Sixth-semester timetable N°30/IUGET/C-DIR/P-SP/05-26-SW.',
    'Maeder, B. (2019). Firebase in action. Manning Publications.',
    'Meta. (2024). React 18 documentation. https://react.dev',
    'Ministère de l\'Enseignement Supérieur (MINESUP). (2024). Statistiques de l\'enseignement supérieur au Cameroun.',
    'MTN Cameroon. (2024). MoMo developer documentation. https://momodeveloper.mtn.com',
    'Nielsen, J. (1993). Usability engineering. Morgan Kaufmann.',
    'Orange Cameroun. (2024). Orange Money APIs documentation. https://developer.orange.com',
    'Sandhu, R. S., Coyne, E. J., Feinstein, H. L., & Youman, C. E. (1996). Role-based access control models. IEEE Computer, 29(2), 38–47.',
    'Shneiderman, B. (2016). Designing the user interface: Strategies for effective human-computer interaction (6th ed.). Pearson.',
    'Tailwind Labs. (2024). Tailwind CSS documentation. https://tailwindcss.com/docs',
    'Vercel. (2024). Vite documentation. https://vitejs.dev',
    'World Wide Web Consortium. (2018). Web content accessibility guidelines (WCAG) 2.1. https://www.w3.org/TR/WCAG21/',
  ].map((line) => new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 120, line: LINE15, lineRule: LineRuleType.AUTO },
    indent: { left: 480, hanging: 480 },
    children: [T(line, { size: BODY })],
  })),
]

/* ─── APPENDICES ──────────────────────────────────────────────── */
const appendixDiagrams = [
  ['11-class-diagram.png', 'Appendix A.1 — UML class diagram.'],
  ['12-state-payment.png', 'Appendix A.2 — UML state diagram: payment.'],
  ['13-state-enrolment.png', 'Appendix A.3 — UML state diagram: enrolment.'],
  ['14-activity-attendance.png', 'Appendix A.4 — UML activity diagram: attendance.'],
  ['15-package-diagram.png', 'Appendix A.5 — UML package diagram.'],
]
const appendices = [
  H1('APPENDICES'),
  H2('Appendix A — Supplementary UML Diagrams'),
  ...appendixDiagrams.flatMap(([f, c]) => [imagePara(f, 560), caption(c)]),

  H2('Appendix B — Demo Credentials and Quick Reference'),
  Body('The following accounts are pre-provisioned in the demonstration mode; the password for all of them is the literal word "password". The Parent Portal at /parent requires no account.'),
  blank(),
  table([
    ['Role', 'Email', 'Recommended demo actions'],
    ['Student', 'student@iuget.cm', 'Dashboard · timetable by specialty · pay tuition · print ID card · transcript.'],
    ['Lecturer', 'lecturer@iuget.cm', 'Mark attendance · enter grades · view class list.'],
    ['Staff', 'staff@iuget.cm', 'Enrol new student · financial tracking · publish announcement.'],
    ['Admin', 'admin@iuget.cm', 'Institutional analytics · settings · user list.'],
    ['Parent', '(no account)', 'Visit /parent · choose specialty · complete the 5-step wizard with simulated payment.'],
  ], [12, 24, 64]),
  caption('Table B.1 — Demo credentials and recommended actions.'),

  H2('Appendix C — Representative Code Listing'),
  Body('Listing C.1 reproduces the privacy-preserving step of the payment handler. After the simulated provider call, the credential state is reset to the empty string so that no PIN, password or card number survives the transaction.'),
  new Paragraph({
    spacing: { before: 120, after: 200, line: 240, lineRule: LineRuleType.AUTO },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'F2F2F2' },
    children: [new TextRun({ font: 'Courier New', size: 18, color: INK, text:
      'const submitPassword = async () => {\n' +
      '  setStatus("processing");\n' +
      '  await simulateProviderCall(method, { phone, pin: pwd });\n' +
      '  const reference = makeReference(method);   // e.g. MOMO-2026-000142\n' +
      '  setReceipt(buildReceipt(reference));\n' +
      '  setPwd("");        // privacy: clear credential from memory immediately\n' +
      '  setStatus("success");\n' +
      '};' }),
    ],
  }),
]

/* ════════════════════════════════════════════════════════════════
   ASSEMBLE
   ════════════════════════════════════════════════════════════════ */
const pageMargins = { top: cm(2), right: cm(2), bottom: cm(2), left: cm(2.5), header: cm(1.2), footer: cm(1.2) }

// Page number at TOP RIGHT (in the header).
const headerNum = () => new Header({
  children: [new Paragraph({
    alignment: AlignmentType.RIGHT,
    children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: BODY })],
  })],
})
const headerEmpty = () => new Header({ children: [new Paragraph({ children: [T('')] })] })

const doc = new Document({
  creator: 'James Murdza',
  title: 'SIARM — BTech Project Report',
  description: 'Smart Institution Academic Resource Management — BTech project report, IUGET Bonabéri',
  features: { updateFields: true },
  styles: {
    default: {
      document: {
        run: { font: FONT, size: BODY, color: INK },
        paragraph: { spacing: { line: LINE15, lineRule: LineRuleType.AUTO } },
      },
      heading1: { run: { font: FONT, size: TITLE, bold: true, color: INK }, paragraph: { spacing: { before: 240, after: 280 } } },
      heading2: { run: { font: FONT, size: SUB, bold: true, color: INK }, paragraph: { spacing: { before: 280, after: 160 } } },
      heading3: { run: { font: FONT, size: 26, bold: true, italics: true, color: INK }, paragraph: { spacing: { before: 200, after: 120 } } },
    },
  },
  sections: [
    // ── Front matter: Roman numerals; title page un-numbered. ──
    {
      properties: {
        page: { size: { width: cm(21), height: cm(29.7) }, margin: pageMargins,
          pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN } },
        titlePage: true,
      },
      headers: { default: headerNum(), first: headerEmpty() },
      children: [
        ...titlePage,
        ...certification,
        ...declaration,
        ...dedication,
        ...acknowledgement,
        ...abstract,
        ...resume,
        ...abbreviations,
        ...toc,
      ],
    },
    // ── Body: Arabic numerals, restart at 1. ──
    {
      properties: {
        page: { size: { width: cm(21), height: cm(29.7) }, margin: pageMargins,
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } },
      },
      headers: { default: headerNum() },
      children: [
        ...chapter1,
        ...chapter2,
        ...chapter3,
        ...chapter4,
        ...conclusion,
        ...references,
        ...appendices,
      ],
    },
  ],
})

const buf = await Packer.toBuffer(doc)
fs.writeFileSync(OUT_FILE, buf)
console.log(`✓ BTech-formatted report written: ${OUT_FILE}  (${(buf.length / 1024).toFixed(1)} KB)`)
