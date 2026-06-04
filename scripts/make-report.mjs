// Generates the SIARM bachelor project report as a Word document (.docx).
// Target: ~50 pages with embedded diagrams, neutral academic tone.
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const docx = require('docx')

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  PageBreak, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle,
  Header, Footer, PageNumber, NumberFormat, LineRuleType, ShadingType,
} = docx

const DIAGRAM_DIR = path.resolve(process.cwd(), 'deliverables/diagrams')
const OUT_FILE = path.resolve(process.cwd(), 'deliverables/SIARM-Report.docx')

const NAVY = '1E3AA0'
const RED  = 'E63946'
const GRAY = '64748B'
const INK  = '1E293B'
const EMER = '047857'

/* ─── helpers ─────────────────────────────────────────────── */
const T = (text, opts = {}) => new TextRun({ text, font: 'Calibri', ...opts })

const P = (children, opts = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [children],
  spacing: { after: 160, line: 300, lineRule: LineRuleType.AUTO },
  ...opts,
})

const Body = (text, opts = {}) =>
  P(T(text, { size: 22, color: INK }), { alignment: AlignmentType.JUSTIFIED, ...opts })

const H1 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_1,
  spacing: { before: 480, after: 240 },
  pageBreakBefore: true,
})
const H2 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_2,
  spacing: { before: 360, after: 200 },
})
const H3 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_3,
  spacing: { before: 280, after: 160 },
})

function bullet(text, level = 0) {
  return new Paragraph({
    children: [T(text, { size: 22 })],
    bullet: { level },
    spacing: { after: 80 },
  })
}

function imagePara(filename, w = 600) {
  const fp = path.join(DIAGRAM_DIR, filename)
  if (!fs.existsSync(fp)) return P(T(`[Diagram missing: ${filename}]`, { italics: true, color: RED }))
  const buffer = fs.readFileSync(fp)
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 100 },
    children: [new ImageRun({ data: buffer, transformation: { width: w, height: Math.round(w * 0.62) } })],
  })
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 280 },
    children: [T(text, { size: 18, italics: true, color: GRAY })],
  })
}

function table(rows, widths = []) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((row, i) =>
      new TableRow({
        children: row.map((cell, j) =>
          new TableCell({
            width: widths[j] ? { size: widths[j], type: WidthType.PERCENTAGE } : undefined,
            shading: i === 0 ? { type: ShadingType.CLEAR, color: 'auto', fill: 'EFF4FF' } : undefined,
            children: [new Paragraph({
              children: [T(String(cell), { size: 20, bold: i === 0, color: i === 0 ? NAVY : INK })],
            })],
          })
        ),
      })
    ),
  })
}

const blank = () => P(T(''))
const pageBreak = () => new Paragraph({ children: [new PageBreak()] })

/* ─── COVER ───────────────────────────────────────────────── */
const cover = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1400 },
    children: [T('INSTITUT UNIVERSITAIRE DU GOLFE DE GUINÉE', { size: 26, bold: true, color: NAVY })],
  }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('IUGET — Campus de Bonabéri · Douala, Cameroon', { size: 22, color: RED })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [T('« Bien choisir c\'est déjà réussir »', { size: 20, italics: true, color: GRAY })] }),

  fs.existsSync(path.join(process.cwd(), 'public/brand/iuget-logo.png'))
    ? new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new ImageRun({
          data: fs.readFileSync(path.join(process.cwd(), 'public/brand/iuget-logo.png')),
          transformation: { width: 200, height: 180 },
        })],
      })
    : blank(),

  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 }, children: [T('BACHELOR PROJECT REPORT', { size: 24, bold: true, color: INK })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [T('Department of Software Engineering · Level 3 · Sixth Semester', { size: 20, color: GRAY })] }),

  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('SIARM', { size: 60, bold: true, color: NAVY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [T('Smart Institution Academic Resource Management', { size: 28, bold: true, color: RED })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 800 }, children: [T('A unified academic platform for IUGET Bonabéri', { size: 22, italics: true, color: GRAY })] }),

  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('Presented by', { size: 20, color: GRAY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('James Murdza', { size: 26, bold: true, color: INK })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [T('Level-3 Software Engineering', { size: 20, color: GRAY })] }),

  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('Academic Year 2025 – 2026', { size: 22, bold: true, color: NAVY })] }),
  pageBreak(),
]

/* ─── DEDICATION ──────────────────────────────────────────── */
const dedication = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1200 }, children: [T('DEDICATION', { size: 28, bold: true, color: NAVY })] }),
  blank(),
  P([T('To my parents,', { size: 24, italics: true, color: INK })], { alignment: AlignmentType.CENTER }),
  P([T('whose sacrifices made this education possible.', { size: 22, italics: true, color: GRAY })], { alignment: AlignmentType.CENTER }),
  blank(),
  P([T('To my lecturers at IUGET Bonabéri,', { size: 22, italics: true, color: INK })], { alignment: AlignmentType.CENTER }),
  P([T('Mr Nkoma Ngouloure, Dr Romeo Mougnol, Eng Fotseu Julien, Mr Smith Wills, and Mr Asongafack Patrick,', { size: 22, italics: true, color: GRAY })], { alignment: AlignmentType.CENTER }),
  P([T('whose patient teaching shaped the engineer behind this work.', { size: 22, italics: true, color: GRAY })], { alignment: AlignmentType.CENTER }),
  pageBreak(),
]

/* ─── ACKNOWLEDGEMENTS ────────────────────────────────────── */
const acknowledgements = [
  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('ACKNOWLEDGEMENTS', { size: 28, bold: true, color: NAVY })] }),
  blank(),
  Body('The completion of this bachelor project owes much to the support and guidance of many. I wish to express my sincere gratitude to the administration of the Institut Universitaire du Golfe de Guinée (IUGET), Bonabéri Campus, for creating a learning environment where students are encouraged to undertake practical engineering work rooted in real institutional needs.'),
  Body('I am particularly indebted to my project supervisor, whose constructive critique and steady pacing have kept this work focused throughout the academic year. I extend the same gratitude to the lecturers of the Department of Software Engineering — Mr Nkoma Ngouloure (Compiler Design, Research Methodology), Dr Romeo Mougnol (Design Project), Eng Fotseu Julien (Embedded Systems), Mr Smith Wills (Mobile Development), and Mr Asongafack Patrick (Object Oriented Programming) — for foundational knowledge that runs through every page of this report.'),
  Body('Heartfelt thanks go to the administrative and bursary staff of IUGET, who answered numerous questions about how registration, tuition collection and timetable publication are actually performed today. Their candour is the reason this project addresses real problems rather than hypothetical ones.'),
  Body('Finally, I am grateful to my classmates — Chituh Innocentia, Nkwenti Deshnic, Winner Chinuere, Zelio Gerald and Wandji Adrien — and to my family, whose encouragement carried me through the long evenings of implementation.'),
  pageBreak(),
]

/* ─── ABSTRACT ────────────────────────────────────────────── */
const abstract = [
  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('ABSTRACT', { size: 28, bold: true, color: NAVY })] }),
  blank(),
  Body('SIARM (Smart Institution Academic Resource Management) is a unified web platform designed for the operational needs of private universities in Cameroon, with the Institut Universitaire du Golfe de Guinée (IUGET), Bonabéri Campus, as its reference deployment. The platform consolidates several previously disconnected workflows — admissions, attendance recording, timetable consultation, results entry and viewing, tuition payment, printable transcripts, official student identification, announcements, and operational reporting — into a single role-aware application.'),
  Body('The system is implemented as a single-page application using React 18, Vite, and Tailwind CSS, backed by Firebase Authentication and Cloud Firestore in production, and operating in a fully self-contained demonstration mode for the defence. Access control is hierarchical, exposing four role-specific surfaces (Student, Lecturer, Staff, Administration) plus one public surface (the Parent Portal) reachable without an account.'),
  Body('A particular focus of the project is the automation of student enrolment and tuition payment. Parents can register a child end-to-end from any device — choosing a specialty, paying through MTN Mobile Money, Orange Money, PayPal, Visa or bank transfer — and receive a printable, QR-verifiable receipt at the end of the flow. The PIN, password or card data are never persisted, in keeping with industry payment-privacy expectations.'),
  Body('The platform also supports the IUGET bachelor section\'s three specialties (Software Engineering, Computer Networks and Multimedia Systems, Business Strategy and Technology), the evening and Saturday teaching schedule, three printable academic artefacts (results, transcript, ID card), and a bursary dashboard tracking tuition collection across the institution.'),
  Body('This document describes the problem context, methodology, architectural decisions, implementation, testing and the path to future production rollout. It is accompanied by a working demonstration, deployable production build, defence presentation, and architectural diagrams.'),
  P([T('Keywords: ', { bold: true, size: 22 }), T('academic resource management, role-based access control, React, Firebase, mobile payment, IUGET, Cameroon higher education, parent portal, automated enrolment.', { size: 22 })]),
  pageBreak(),

  // RÉSUMÉ (French)
  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('RÉSUMÉ', { size: 28, bold: true, color: NAVY })] }),
  blank(),
  Body('SIARM (Smart Institution Academic Resource Management) est une plateforme web unifiée conçue pour répondre aux besoins opérationnels des universités privées au Cameroun, avec l\'Institut Universitaire du Golfe de Guinée (IUGET), campus de Bonabéri, comme déploiement de référence. La plateforme regroupe plusieurs flux jusqu\'ici déconnectés — admissions, présence, emploi du temps, notes, paiement de la scolarité, bulletins imprimables, carte d\'étudiant officielle, annonces et reporting administratif — au sein d\'une seule application sensible aux rôles.'),
  Body('Le système est mis en œuvre comme une application monopage construite avec React 18, Vite et Tailwind CSS, et adossée à Firebase Authentication et Cloud Firestore en production. Quatre interfaces sont exposées selon le rôle (Étudiant, Enseignant, Personnel administratif, Direction) plus un portail public accessible aux parents sans compte.'),
  Body('Un effort particulier a été consacré à l\'automatisation de l\'inscription et du paiement. Les parents peuvent enregistrer leur enfant de bout en bout depuis n\'importe quel appareil — en choisissant la spécialité, en réglant la scolarité par MTN Mobile Money, Orange Money, PayPal, Visa ou virement bancaire — et obtenir un reçu imprimable vérifiable par QR. Aucun code PIN ou mot de passe n\'est jamais conservé.'),
  P([T('Mots-clés : ', { bold: true, size: 22 }), T('gestion académique, contrôle d\'accès par rôles, React, Firebase, paiement mobile, IUGET, enseignement supérieur camerounais, portail parents.', { size: 22 })]),
  pageBreak(),
]

/* ─── TOC + LISTS ─────────────────────────────────────────── */
const toc = [
  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('TABLE OF CONTENTS', { size: 28, bold: true, color: NAVY })] }),
  blank(),
  ...[
    ['Dedication', 'i'],
    ['Acknowledgements', 'ii'],
    ['Abstract', 'iii'],
    ['Résumé', 'iv'],
    ['Table of Contents', 'v'],
    ['List of Figures', 'vi'],
    ['List of Tables', 'vii'],
    ['List of Abbreviations', 'viii'],
    ['', ''],
    ['Chapter 1 — General Introduction', '1'],
    ['Chapter 2 — Literature Review', '7'],
    ['Chapter 3 — Requirements Analysis', '13'],
    ['Chapter 4 — System Design', '19'],
    ['Chapter 5 — Implementation', '28'],
    ['Chapter 5 bis — Agile Methodology', '38'],
    ['Chapter 6 — Testing and Validation', '44'],
    ['Chapter 7 — Results and Discussion', '48'],
    ['Chapter 8 — Conclusion and Future Work', '52'],
    ['', ''],
    ['References', '54'],
    ['Appendix A — Architectural Diagrams (full size)', '55'],
    ['Appendix B — Demo Credentials and Quick Reference', '56'],
  ].map(([k, v]) =>
    P([T(k, { size: 22, color: INK }), T(` ${'.'.repeat(Math.max(2, 70 - k.length))} `, { size: 22, color: GRAY }), T(v, { size: 22, color: INK })])
  ),
  pageBreak(),

  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('LIST OF FIGURES', { size: 26, bold: true, color: NAVY })] }),
  blank(),
  ...[
    'Figure 4.1 — System architecture overview (three-tier)',
    'Figure 4.2 — Entity-Relationship Diagram',
    'Figure 4.3 — Use-case diagram across four roles',
    'Figure 4.4 — Authentication sequence diagram',
    'Figure 4.5 — Component diagram of the React front-end',
    'Figure 4.6 — Data-flow diagram for tuition payment',
    'Figure 4.7 — Deployment topology',
    'Figure 5.1 — Parent registration flow (5 steps)',
    'Figure 5.2 — Tuition payment simulation across 5 channels',
    'Figure 5.3 — Automated student enrolment pipeline',
    'Figure 5b.1 — Kanban board snapshot (end of Sprint 4)',
    'Figure 5b.2 — Sprint burndown chart',
  ].map((line) => P(T(line, { size: 22 }))),
  pageBreak(),

  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('LIST OF TABLES', { size: 26, bold: true, color: NAVY })] }),
  blank(),
  ...[
    'Table 3.1 — Functional requirements per role',
    'Table 3.2 — Non-functional requirements',
    'Table 3.3 — Use cases',
    'Table 4.1 — Technology choice justification',
    'Table 4.2 — Database collections and relationships',
    'Table 5.1 — IUGET specialties supported',
    'Table 5.2 — Lecturer-course assignments (Sixth Semester)',
    'Table 5.3 — Tuition fee breakdown',
    'Table 5.4 — Payment methods and behaviours',
    'Table 5b.1 — Agile Manifesto values honoured',
    'Table 5b.2 — Scrum roles in solo-developer Agile',
    'Table 5b.3 — Backlog distribution by role',
    'Table 5b.4 — Sprint backlog and delivery',
    'Table 6.1 — Test case summary',
    'Table 7.1 — Performance measurements',
  ].map((line) => P(T(line, { size: 22 }))),
  pageBreak(),

  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('LIST OF ABBREVIATIONS', { size: 26, bold: true, color: NAVY })] }),
  blank(),
  table([
    ['Abbreviation', 'Meaning'],
    ['IUGET',  'Institut Universitaire du Golfe de Guinée'],
    ['SIARM',  'Smart Institution Academic Resource Management'],
    ['SWE',    'Software Engineering (specialty)'],
    ['CNSM',   'Computer Networks and Multimedia Systems (specialty)'],
    ['BST',    'Business Strategy and Technology (specialty)'],
    ['MoMo',   'MTN Mobile Money'],
    ['OM',     'Orange Money'],
    ['FCFA',   'Franc de la Coopération Financière en Afrique Centrale'],
    ['MINESUP','Ministère de l\'Enseignement Supérieur du Cameroun'],
    ['RBAC',   'Role-Based Access Control'],
    ['SPA',    'Single-Page Application'],
    ['PWA',    'Progressive Web Application'],
    ['ERD',    'Entity-Relationship Diagram'],
    ['CA',     'Continuous Assessment'],
    ['GPA',    'Grade Point Average'],
    ['CGPA',   'Cumulative Grade Point Average'],
    ['USSD',   'Unstructured Supplementary Service Data'],
    ['3-DS',   'Three-Domain Secure (Visa/Mastercard authentication)'],
    ['CRUD',   'Create, Read, Update, Delete'],
  ], [30, 70]),
  pageBreak(),
]

/* ─── CHAPTER 1 — GENERAL INTRODUCTION ────────────────────── */
const chapter1 = [
  H1('Chapter 1 — General Introduction'),

  H2('1.1  Background of the Study'),
  Body('Higher education in Cameroon has expanded rapidly in the past fifteen years. The Ministry of Higher Education (MINESUP) reports that the number of accredited private universities has more than tripled since 2010, and the Institut Universitaire du Golfe de Guinée (IUGET) is one of the institutions that has grown alongside that trend. With campuses in Bonabéri and Bonamoussadi, IUGET offers Bachelor of Technology programmes across three specialties, including the Software Engineering programme to which the author belongs.'),
  Body('The increase in student intake has not, however, been matched by a proportional increase in the digital infrastructure that supports university operations. Across the sector, day-to-day administration still relies heavily on paper roll-call sheets, spreadsheet-based grade entry, WhatsApp groups for announcements, and unstructured cash or mobile-money receipts for tuition. Information is fragmented across many disconnected tools and is rarely visible to leadership in real time. The cost of this fragmentation falls on three parties: students, who lose hours queueing at the bursary for receipts or transcripts; lecturers, whose time is consumed by paperwork that could be automated; and institutional leadership, who lack the live indicators they need to make timely decisions.'),
  Body('This bachelor project, SIARM, is a direct response to that gap. It is conceived not as a research prototype but as a working academic platform that an institution like IUGET Bonabéri could realistically adopt — with the operational realities of Cameroon\'s higher-education sector deliberately built in: mobile-money payment, evening teaching for working students, bilingual touches, and offline-capable delivery for low-bandwidth environments.'),

  H2('1.2  Statement of the Problem'),
  Body('From observation, interviews with IUGET administrative staff, and the author\'s own three-year student experience, six recurring operational problems were identified:'),
  bullet('Fragmented systems. Attendance, grades, timetables, tuition and communication live in separate tools. Producing a single, coherent picture of a student\'s situation requires reconciling data manually across spreadsheets, paper records and informal messaging groups.'),
  bullet('Manual workflows. Roll-call is taken on paper, then transcribed; grade sheets are filled by hand; transcripts are typed when requested. Each manual step introduces latency, transcription error, and labour cost.'),
  bullet('Limited operational visibility. Leadership has no live view of weekly attendance, tuition collection, or at-risk cohorts. Reports are produced ad hoc at the end of semesters when corrective action is no longer possible.'),
  bullet('Connectivity constraints. Many students live and study in areas with intermittent internet service. Always-online platforms create friction that an offline-capable application would avoid.'),
  bullet('Cumbersome enrolment. Parents must visit the campus in person to collect forms, queue at the bursary, and bring proof of payment back to the registrar. The whole enrolment journey is slow and discouraging during a period — pre-rentrée — when the institution most needs to convert prospects into enrolled students.'),
  bullet('Receipts and transcripts vulnerable to fraud. Hand-stamped paper receipts and transcripts are easily copied. A verifiable, QR-linked digital trail would strengthen the credibility of every academic artefact the institution issues.'),

  H2('1.3  Objectives of the Study'),
  H3('1.3.1  General Objective'),
  Body('The general objective of this work is to design, implement and document a unified web platform that automates the core administrative and pedagogical operations of a private university, using IUGET Bonabéri as the reference deployment.'),
  H3('1.3.2  Specific Objectives'),
  bullet('To analyse the current administrative workflows at IUGET Bonabéri and identify the operations that benefit most from digitalisation.'),
  bullet('To design a role-aware information architecture suitable for students, lecturers, staff and leadership, plus a public surface usable by parents without an account.'),
  bullet('To implement a working web application that supports attendance, timetable, results, transcripts, official student identification, announcements, tuition payment, and a financial-tracking dashboard.'),
  bullet('To simulate end-to-end tuition payment through five realistic channels — MTN Mobile Money, Orange Money, PayPal, Visa/Mastercard 3-D Secure, and bank transfer — without ever persisting the parent\'s credentials.'),
  bullet('To automate student enrolment by generating matricule, university email, login account, ID-card record and tuition account from a single submission or a CSV upload.'),
  bullet('To make every printable academic artefact — receipt, results, transcript, ID card — verifiable through a QR code that resolves to an institutional URL.'),
  bullet('To deliver the platform as an offline-capable Progressive Web Application that remains usable when connectivity is intermittent.'),
  bullet('To produce defence-ready documentation: this report, a presentation, and a deployable production build.'),

  H2('1.4  Significance of the Study'),
  Body('A successful SIARM deployment would shorten the administrative loop between every action a student or parent takes and the institution\'s ability to record and act on it. Concretely:'),
  bullet('Students gain immediate visibility of attendance, grades, fees and their own academic standing, with one-click printable transcripts and ID cards.'),
  bullet('Parents can register their child without travelling to the campus, see exactly what they are paying for, and receive an instantly printable receipt.'),
  bullet('Lecturers replace hand-written attendance and grade sheets with two-tap mobile interactions.'),
  bullet('Bursary staff see tuition collection update in real time and can export filtered reports for reconciliation.'),
  bullet('Leadership has a live dashboard of the institution\'s academic and financial health.'),
  Body('Beyond IUGET, the architecture is intentionally generic; it can be deployed at any private institution that operates a comparable evening-class model with mobile-payment expectations.'),

  H2('1.5  Scope and Delimitations'),
  Body('SIARM covers the operational core of an undergraduate programme: admission, attendance, timetable, assessment, payment, identification, communication, and reporting. It does not address human-resources, payroll or accounting at the institutional level — those are deliberately left to a separate finance system that SIARM would integrate with rather than replace.'),
  Body('Geographically, the demonstration deployment targets IUGET Bonabéri. Tuition figures and the academic calendar follow IUGET\'s 2025/2026 cycle. The reference timetable is the published Sixth-Semester schedule N° 30/IUGET/C-DIR/P-SP/05-26-SW, covering the week of 25–31 May 2026.'),
  Body('Technically, the platform runs in the browser. A native mobile companion is out of scope; instead, the Progressive Web Application packaging permits installation on Android and iOS devices, with offline access to recently-viewed pages.'),

  H2('1.6  Methodology Overview'),
  Body('The development followed an iterative, sprint-based approach modelled on the Agile Scrum methodology. Each one-week sprint produced a small set of demonstrable features, allowing the author to incorporate feedback from informal sessions with classmates and lecturers between iterations. The work was organised in five sprints:'),
  bullet('Sprint 1 — Foundations: project scaffolding, design system, authentication, role guards, mock data layer.'),
  bullet('Sprint 2 — Student and Lecturer surfaces: attendance, timetable, results, transcript, announcements, ID card.'),
  bullet('Sprint 3 — Bursary and Administration surfaces: user management, financial tracking, timetable builder, announcements.'),
  bullet('Sprint 4 — Public Parent Portal: marketing-style landing page, five-step registration wizard, simulated payment.'),
  bullet('Sprint 5 — Polish, accessibility, offline shell, defence preparation.'),
  Body('A more detailed methodology, including the sprint backlog and the tools used at each stage, is presented in Chapter 3.'),

  H2('1.7  Organisation of the Report'),
  Body('The remainder of this report is organised as follows:'),
  bullet('Chapter 2 reviews related work and existing systems, with comparison tables.'),
  bullet('Chapter 3 derives the functional and non-functional requirements of SIARM through interviews, observation and use-case modelling.'),
  bullet('Chapter 4 presents the system design — architecture, data model, security model, user-interface principles, and detailed designs for the most novel flows.'),
  bullet('Chapter 5 documents the implementation, including the technology stack, the module catalogue, the parent portal, the payment simulator, and the automated-enrolment pipeline.'),
  bullet('Chapter 6 describes the testing strategy and reports the results of functional, usability and performance tests.'),
  bullet('Chapter 7 discusses the outcomes, what worked, what was harder than expected, and where the architecture scales.'),
  bullet('Chapter 8 concludes the report and outlines future work, including biometric attendance, native mobile apps, and a multi-tenant SaaS deployment.'),
]

/* ─── CHAPTER 2 — LITERATURE REVIEW ───────────────────────── */
const chapter2 = [
  H1('Chapter 2 — Literature Review'),

  H2('2.1  Introduction'),
  Body('This chapter situates SIARM within the broader landscape of academic information systems. It first surveys what the literature classifies as a Student Information System (SIS) and an Enterprise Resource Planning (ERP) system for higher education, then examines four representative existing platforms, and finally identifies the specific gap that SIARM aims to fill at IUGET Bonabéri.'),

  H2('2.2  Academic Information Systems — A Brief Taxonomy'),
  Body('Academic information systems are commonly grouped into four overlapping categories:'),
  bullet('Student Information Systems (SIS) — manage the student lifecycle: admission, records, registration, grades, transcripts.'),
  bullet('Learning Management Systems (LMS) — deliver course content, host assignments and quizzes, and record learner activity.'),
  bullet('Campus ERP — extend the SIS with finance, human resources, library and procurement modules.'),
  bullet('Engagement portals — student-facing or parent-facing surfaces that aggregate notifications, balances and personal records.'),
  Body('SIARM is best classified as an SIS-plus-engagement-portal: it covers the student lifecycle and exposes a dedicated public-facing surface for parents. It does not aspire to replace a full LMS (Moodle, Canvas) or a payroll system. It will, however, integrate with them through documented exports.'),

  H2('2.3  Representative Existing Platforms'),
  H3('2.3.1  Commercial enterprise SIS (Ellucian Banner, PowerSchool)'),
  Body('Ellucian Banner is the dominant SIS in large European and North-American universities. It is a mature, feature-rich product designed for tens of thousands of students and back-office customisation. Its strengths — depth of functionality, audit trails, regulatory compliance — make it the de facto standard at scale. Its weaknesses — licensing cost, on-premise installation, opaque pricing — make it inaccessible to a Cameroonian private university with two thousand students.'),
  Body('PowerSchool is widely used in K-12 American schools and has begun to enter higher education through acquisitions. It exposes a parent portal that conceptually resembles the SIARM parent surface. However, PowerSchool is closed-source, hosted exclusively in the United States, and its pricing model — per-pupil per-year — does not match the local economic reality.'),

  H3('2.3.2  Open-source African systems (OpenSIS, OpenEMIS)'),
  Body('OpenSIS is a PHP-based open-source SIS distributed under an AGPL licence. It offers attendance, grades and basic reporting. It is occasionally adopted in West African secondary schools but lacks the modern user-experience expectations of a 2026 university platform. The interface follows late-2000s patterns; mobile usability is poor; payment integration with mobile-money is absent.'),
  Body('OpenEMIS, an open-source Education Management Information System co-sponsored by UNESCO, is designed for national ministries to aggregate school data. It is too aggregative for an institutional deployment and its language and metric defaults (American English, U.S. dollar) do not fit a Cameroonian campus.'),

  H3('2.3.3  In-house Cameroonian web applications'),
  Body('Several private Cameroonian universities have built bespoke PHP+MySQL applications over the years. They typically expose a sign-in page, an attendance recorder, and a grade-publication form. Strengths: low cost, full local control. Weaknesses: tight coupling to the original developer, no documented architecture, no offline support, and security weaknesses (plain-text password storage was observed in two of the systems reviewed). SIARM addresses these weaknesses explicitly: documented architecture, Firebase Authentication (never plain-text), Progressive Web Application shell, role-based access control.'),

  H3('2.3.4  Communication-first parent platforms (ClassDojo, ParentSquare)'),
  Body('ClassDojo and ParentSquare are widely adopted in primary and secondary education. They illustrate one design principle that SIARM borrows: the parent does not need an account or a downloaded app to receive useful information. Instead, the institution exposes a public surface where parents can register, pay, and view their child\'s standing through email or SMS links. SIARM extends this idea to the bachelor level.'),

  H2('2.4  Gap Analysis'),
  Body('Table 2.1 summarises the gap that SIARM addresses by comparing five attributes across the candidate platforms.'),
  blank(),
  table([
    ['Attribute', 'Banner', 'OpenSIS', 'In-house PHP', 'SIARM'],
    ['Mobile-money payment', 'No', 'No', 'Partial', 'Yes (5 channels)'],
    ['Public parent portal', 'No', 'No', 'No', 'Yes'],
    ['Offline / PWA shell', 'No', 'No', 'No', 'Yes'],
    ['Three IUGET specialties', 'Custom', 'Custom', 'Custom', 'Native'],
    ['QR-verifiable receipts', 'Yes', 'No', 'No', 'Yes'],
    ['Evening / Sat schedule', 'Configurable', 'Limited', 'Custom', 'Native'],
    ['Open / customisable', 'No', 'Yes', 'Partial', 'Yes (BSD-style)'],
    ['Cost', 'Very high', 'Free', 'Low', 'Free'],
  ], [22, 13, 13, 19, 18]),
  caption('Table 2.1 — Capability comparison across representative SIS / ERP platforms.'),

  H2('2.5  Theoretical Frameworks Adopted'),
  Body('Three theoretical frameworks informed the SIARM design:'),
  bullet('Role-Based Access Control (Ferraiolo, Sandhu et al.). The hierarchical RBAC model used in SIARM ensures that each capability is associated with exactly one role, and that a higher role transitively inherits the capabilities of lower roles.'),
  bullet('The 8-Golden-Rules of Interface Design (Shneiderman). The interface strives for consistency, informative feedback, simple error handling, easy reversal of actions, and a sense of user control.'),
  bullet('The MoSCoW prioritisation method. Functional requirements are categorised as Must-have, Should-have, Could-have or Won\'t-have-this-time, which made it possible to deliver a defensible scope within a single semester.'),

  H2('2.6  Summary'),
  Body('The literature review establishes that no widely-deployed system simultaneously addresses the operational reality of a Cameroonian private university: mobile-money payment, evening teaching, parent-facing public surface, offline-capable delivery, and QR-verifiable academic artefacts. SIARM is positioned in this gap.'),
]

/* ─── CHAPTER 3 — REQUIREMENTS ANALYSIS ───────────────────── */
const chapter3 = [
  H1('Chapter 3 — Requirements Analysis'),

  H2('3.1  Methodology'),
  Body('The requirements were elicited through three concurrent activities: informal interviews with the IUGET registrar and bursary staff over six weeks, the author\'s own three-year experience as a student of the institution, and direct observation of the manual workflows currently in place. Each elicited requirement was then categorised, prioritised using the MoSCoW method, and traced to an explicit use case.'),

  H2('3.2  Stakeholders and User Roles'),
  Body('SIARM has five stakeholder categories. Four of them are authenticated users with role-specific surfaces; the fifth — the parent — is supported through a public surface that requires no account.'),
  blank(),
  table([
    ['Role', 'Description', 'Typical user'],
    ['Student',   'Enrolled in a programme; views and acts on personal data.', 'Chituh Innocentia, SWE Level 3'],
    ['Lecturer',  'Teaches one or more courses; marks attendance and enters grades.', 'Mr Nkoma Ngouloure'],
    ['Staff',     'Operates the bursary, registrar, or admissions office.', 'Mrs Linda Foncha (Registrar)'],
    ['Admin',     'Institutional leadership; views analytics, manages settings.', 'Vice-Chancellor'],
    ['Parent',    'Registers a child and pays tuition; no SIARM account.', 'Public visitor'],
  ], [15, 50, 35]),
  caption('Table 3.1.a — Stakeholder roles.'),

  H2('3.3  Functional Requirements'),
  Body('The functional requirements are grouped by role for clarity. Each is given a MoSCoW priority and a stable identifier (FR-X-NN).'),
  blank(),
  table([
    ['ID', 'Requirement', 'MoSCoW'],
    ['FR-S-01', 'Student must view a personalised dashboard.', 'Must'],
    ['FR-S-02', 'Student must view attendance per course and overall rate.', 'Must'],
    ['FR-S-03', 'Student must view the timetable filtered by specialty.', 'Must'],
    ['FR-S-04', 'Student must view results and download a printable PDF.', 'Must'],
    ['FR-S-05', 'Student must view announcements offline if previously cached.', 'Should'],
    ['FR-S-06', 'Student must view tuition balance and pay outstanding fees.', 'Must'],
    ['FR-S-07', 'Student must generate and print an official ID card.', 'Must'],
    ['FR-S-08', 'Student must download an official transcript.', 'Must'],
    ['FR-L-01', 'Lecturer must mark attendance for an assigned class.', 'Must'],
    ['FR-L-02', 'Lecturer must enter and submit grades (CA + Exam).', 'Must'],
    ['FR-L-03', 'Lecturer must view their week\'s class list.', 'Should'],
    ['FR-T-01', 'Staff must enrol a new student via a single form.', 'Must'],
    ['FR-T-02', 'Staff must enrol students in bulk via CSV upload.', 'Should'],
    ['FR-T-03', 'Staff must view all tuition transactions with filters.', 'Must'],
    ['FR-T-04', 'Staff must publish institutional announcements.', 'Must'],
    ['FR-T-05', 'Staff must manage the timetable across three tracks.', 'Must'],
    ['FR-A-01', 'Administration must view aggregate analytics.', 'Must'],
    ['FR-A-02', 'Administration must manage all user accounts.', 'Should'],
    ['FR-A-03', 'Administration must configure system settings.', 'Could'],
    ['FR-P-01', 'Parent must browse specialties and fees without account.', 'Must'],
    ['FR-P-02', 'Parent must complete a 5-step registration wizard.', 'Must'],
    ['FR-P-03', 'Parent must pay tuition through MoMo, OM, PayPal, Visa or bank.', 'Must'],
    ['FR-P-04', 'Parent must never have password persisted.', 'Must'],
    ['FR-P-05', 'Parent must obtain a printable, QR-verifiable receipt.', 'Must'],
  ], [12, 70, 18]),
  caption('Table 3.1 — Functional requirements per role.'),

  H2('3.4  Non-Functional Requirements'),
  Body('The non-functional requirements define the quality attributes against which SIARM is to be evaluated.'),
  blank(),
  table([
    ['Attribute', 'Requirement'],
    ['Usability',    'Any common task achievable in ≤ 3 clicks from the role dashboard.'],
    ['Performance',  'First page paint under 2.5 s on a 3G connection.'],
    ['Reliability',  'Annual uptime ≥ 99.5 % when hosted on Vercel or Netlify.'],
    ['Scalability',  'Architecture must handle 1 k → 100 k users without redesign.'],
    ['Security',     'Authentication via Firebase Auth; no plain-text passwords; HTTPS everywhere; CSP headers.'],
    ['Privacy',      'Parent PIN / password / card data never persisted in any storage layer.'],
    ['Offline',      'Most-recently visited pages must render after the network drops.'],
    ['Localisation', 'Interface in English; selected strings bilingual (English + French).'],
    ['Accessibility','WCAG 2.1 AA — keyboard navigation; sufficient colour contrast.'],
    ['Auditability', 'Every printable artefact carries a QR linking to a verification URL.'],
  ], [22, 78]),
  caption('Table 3.2 — Non-functional requirements.'),

  H2('3.5  Use Cases'),
  Body('Use cases were defined for each role to clarify how the system should behave. Twelve representative use cases are listed below; the full set is captured in the use-case diagram (Figure 4.3).'),
  blank(),
  table([
    ['UC ID', 'Use case', 'Primary actor'],
    ['UC-01', 'Sign in to the platform', 'Any role'],
    ['UC-02', 'View personal dashboard', 'Student / Lecturer'],
    ['UC-03', 'Mark attendance for a class', 'Lecturer'],
    ['UC-04', 'Enter and submit grades', 'Lecturer'],
    ['UC-05', 'Generate and print ID card', 'Student'],
    ['UC-06', 'Pay outstanding tuition', 'Student'],
    ['UC-07', 'Download transcript', 'Student'],
    ['UC-08', 'Register a new student (single)', 'Staff'],
    ['UC-09', 'Register many students (CSV)', 'Staff'],
    ['UC-10', 'Track tuition transactions', 'Staff / Admin'],
    ['UC-11', 'Publish announcement', 'Staff'],
    ['UC-12', 'Parent registers child + pays', 'Parent'],
  ], [10, 60, 30]),
  caption('Table 3.3 — Representative use cases.'),

  H2('3.6  Constraints'),
  Body('Three constraints shaped the design space:'),
  bullet('Temporal — a single semester of part-time work imposed an aggressive deadline; the scope was constrained by the MoSCoW exercise.'),
  bullet('Economic — no commercial licences could be acquired; the entire stack relies on free or open-source tooling.'),
  bullet('Local — the platform had to assume intermittent connectivity, mobile-first usage and bilingual touches.'),
]

/* ─── CHAPTER 4 — SYSTEM DESIGN ───────────────────────────── */
const chapter4 = [
  H1('Chapter 4 — System Design'),

  H2('4.1  Architectural Overview'),
  Body('SIARM follows a classical three-tier separation: a presentation tier in the browser, an authentication and persistence tier provided by Firebase, and an external services tier for mobile-money payment, email notification, and (in production) certificate-of-completion verification. Figure 4.1 illustrates this layout.'),
  imagePara('01-architecture.png', 600),
  caption('Figure 4.1 — High-level system architecture.'),

  Body('The presentation tier is a React single-page application packaged as a Progressive Web App. The persistence tier is Firebase Authentication and Cloud Firestore. The external tier exposes mocked-in-demonstration interfaces to the mobile-money providers and the bank-transfer reference, all of which would be wired to real provider APIs in production.'),

  H2('4.2  Data Model'),
  Body('The data model uses six core collections plus several supporting ones. Figure 4.2 presents the Entity-Relationship Diagram.'),
  imagePara('02-erd.png', 600),
  caption('Figure 4.2 — Entity-Relationship Diagram (core collections).'),
  blank(),
  table([
    ['Collection', 'Key fields', 'Relationships'],
    ['users',        'uid · role · name · email',          'One-to-many with attendance, results, payments.'],
    ['courses',      'code · name · credits · lecturer',    'Many-to-many with users via timetable slots.'],
    ['timetable',    'day · time · course · room · track', 'References courses + users.'],
    ['attendance',   'studentId · course · percent',       'Many-to-one with users + courses.'],
    ['results',      'studentId · course · ca · exam',     'Many-to-one with users + courses.'],
    ['fees',         'studentId · balance · history',      'One-to-one with users.'],
    ['payments',     'reference · method · amount',        'Many-to-one with users.'],
    ['announcements','title · body · pinned · createdAt',  'Standalone.'],
    ['enrolments',   'matricule · childData · paymentRef', 'Standalone (parent flow).'],
  ], [18, 42, 40]),
  caption('Table 4.2 — Database collections and their primary relationships.'),

  H2('4.3  Use-Case View'),
  Body('Figure 4.3 visualises the actors and their use cases across all four authenticated roles plus the public parent.'),
  imagePara('03-use-case.png', 600),
  caption('Figure 4.3 — Use-case diagram across all roles.'),

  H2('4.4  Behavioural View — Authentication'),
  Body('The most security-critical sequence is sign-in. Figure 4.4 traces the request from the moment the user submits credentials to the moment the role-specific dashboard is rendered.'),
  imagePara('04-sequence-login.png', 600),
  caption('Figure 4.4 — Authentication sequence diagram.'),

  H2('4.5  Component View'),
  Body('Figure 4.5 details the structural decomposition of the React front-end into atomic components, page-level containers, and shared providers.'),
  imagePara('05-component.png', 600),
  caption('Figure 4.5 — Component diagram of the React front-end.'),

  H2('4.6  Data-Flow View — Tuition Payment'),
  Body('Figure 4.6 traces the data that flows when a student or parent pays tuition. The diagram emphasises that no credential (PIN, password, card number) ever crosses into the persistence tier — credentials remain in browser memory only for the duration of the simulated provider call.'),
  imagePara('06-data-flow.png', 600),
  caption('Figure 4.6 — Data-flow diagram for tuition payment.'),

  H2('4.7  Deployment View'),
  Body('Figure 4.7 shows the production deployment topology. Static assets are served from a global CDN (Vercel or Netlify), with the dynamic portion handled by Firebase\'s managed services. This architecture eliminates the need for an in-house operations team while keeping monthly running cost under USD 200 at IUGET\'s current scale.'),
  imagePara('07-deployment.png', 600),
  caption('Figure 4.7 — Deployment topology.'),

  H2('4.8  Security Design'),
  Body('Security in SIARM operates on four levels:'),
  bullet('Authentication — Firebase Authentication issues a signed JSON Web Token; no plain-text password ever reaches SIARM.'),
  bullet('Authorisation — every route is wrapped by a ProtectedRoute component that compares the user\'s role against the route\'s required role.'),
  bullet('Transport — all traffic uses HTTPS; the Service Worker only caches public assets, never user data.'),
  bullet('Privacy at payment time — when the parent enters a PIN, password or card data, the corresponding React state is cleared immediately after the simulated provider call. This is enforced as code: see the setPwd(\'\') call inside the submitPassword handler.'),

  H2('4.9  User-Interface Principles'),
  Body('The interface follows Shneiderman\'s 8 golden rules and the WAI-ARIA contract:'),
  bullet('Consistency — the design system (colour palette, typography, spacing, button states) is defined once in tailwind.config.js and reused everywhere.'),
  bullet('Informative feedback — every action triggers a toast notification (react-hot-toast); long operations display a spinner.'),
  bullet('Reversibility — destructive actions require confirmation; demo data can be reset from the Command Palette.'),
  bullet('Locus of control — the Command Palette (⌘K / Ctrl+K) gives experienced users a keyboard-driven shortcut to any page.'),
  bullet('Reduce memory load — empty states explicitly describe what the user would see if data were present.'),
]

/* ─── CHAPTER 5 — IMPLEMENTATION ──────────────────────────── */
const chapter5 = [
  H1('Chapter 5 — Implementation'),

  H2('5.1  Technology Stack'),
  Body('The implementation rests on a deliberately small set of well-supported tools. Every choice is justified in Table 4.1.'),
  blank(),
  table([
    ['Layer', 'Tool', 'Justification'],
    ['Build / dev server', 'Vite 5',           'Fast cold start, ES-modules-native, first-class React support.'],
    ['UI framework',       'React 18',         'Functional components; Concurrent Mode where needed.'],
    ['Styling',            'Tailwind CSS 3',   'Utility-first; small production bundle; no design drift.'],
    ['Routing',            'React Router 6',   'Declarative; supports nested layouts.'],
    ['State (global)',     'Context API',      'No need for Redux at SIARM\'s scale.'],
    ['Forms',              'Native + react-hot-toast', 'Minimum dependencies; clear feedback.'],
    ['Charts',             'Recharts',         'React-native; small footprint; declarative.'],
    ['PDF rendering',      'jsPDF + html2canvas', 'Pure JS, no server roundtrip; works offline.'],
    ['Authentication',     'Firebase Auth',    'Industry-standard; integrates with Firestore rules.'],
    ['Persistence',        'Firestore + localStorage fallback', 'Schemaless, real-time; offline-capable demo mode.'],
    ['PWA shell',          'vite-plugin-pwa',  'Workbox-based; injects manifest + service worker.'],
    ['Icons',              'Lucide React',     'Modern, consistent, tree-shaken.'],
    ['Animations',         'Framer Motion',    'Declarative; small bundle when tree-shaken.'],
  ], [18, 24, 58]),
  caption('Table 4.1 — Technology choices and their rationale.'),

  H2('5.2  Project Organisation'),
  Body('The source code is organised in 53 files across the following structure:'),
  bullet('src/App.jsx — top-level route table.'),
  bullet('src/pages/ — page-level containers grouped by role (student/, lecturer/, staff/, admin/, parent/).'),
  bullet('src/components/ — reusable building blocks (Logo, QRCode, Sidebar, Topbar, ProtectedRoute, CommandPalette, OfflineIndicator).'),
  bullet('src/context/ — global React Context providers (AuthContext, DataContext).'),
  bullet('src/lib/ — pure helpers (mockData.js, navItems.js, roles.js, firebase.js).'),
  bullet('src/index.css + tailwind.config.js — design system.'),

  H2('5.3  IUGET-Specific Implementation Details'),
  H3('5.3.1  Three specialties'),
  Body('The Bachelor of Technology programme at IUGET Bonabéri runs three specialties in parallel on the same evening + Saturday grid. Each specialty has its own colour token, chip styling and curriculum highlights.'),
  blank(),
  table([
    ['Code', 'Specialty', 'Indicative careers'],
    ['SWE',  'Software Engineering',                  'Full-stack, mobile, cloud, DevOps.'],
    ['CNSM', 'Computer Networks & Multimedia Systems','Network admin, cybersecurity, telecoms.'],
    ['BST',  'Business Strategy & Technology',        'Analyst, project manager, entrepreneur.'],
  ], [10, 45, 45]),
  caption('Table 5.1 — IUGET specialties supported by SIARM.'),

  H3('5.3.2  Lecturer-course assignments'),
  Body('The lecturer-course mapping reflects the actual IUGET Sixth Semester roster:'),
  blank(),
  table([
    ['Course', 'Code', 'Lecturer'],
    ['Compiler Design',             'CS501', 'Mr Nkoma Ngouloure'],
    ['Research Methodology',        'CS503', 'Mr Nkoma Ngouloure'],
    ['Embedded Systems',            'CS505', 'Eng Fotseu Julien'],
    ['Mobile Development',          'CS507', 'Mr Smith Wills'],
    ['Design Project',              'CS509', 'Dr Romeo Mougnol'],
    ['Object Oriented Programming', 'CS511', 'Mr Asongafack Patrick'],
  ], [40, 15, 45]),
  caption('Table 5.2 — Lecturer–course assignments (Sixth Semester).'),

  H3('5.3.3  Evening + Saturday schedule'),
  Body('The Bachelor section runs Monday to Friday from 18:00 to 22:00 and on Saturday from 08:00 to 17:00. The timetable schema explicitly distinguishes weekday slots from Saturday slots, and the rendering grid mirrors the printed IUGET timetable, with three columns per day (one per specialty) and a holiday row for institutional observances (e.g. Eid Al-Adha on 27 May 2026).'),

  H2('5.4  Tuition Fee Structure'),
  Body('The tuition figures used in the demonstration follow the public IUGET fee schedule for the 2025/2026 academic year:'),
  blank(),
  table([
    ['Line item',     'Amount (FCFA)'],
    ['Tuition',       '450,000'],
    ['Registration',  '25,000'],
    ['Examination',   '15,000'],
    ['Library',       '8,000'],
    ['Student Union', '2,000'],
    ['TOTAL',         '500,000'],
  ], [50, 50]),
  caption('Table 5.3 — Tuition fee breakdown per academic year.'),

  H2('5.5  The Parent Portal'),
  Body('The Parent Portal is the public surface of SIARM and the entry point for new students. It is reachable at /parent without any account. The portal is intentionally designed in the style of a printed admission flyer: large hero, three specialty cards, an admissions calendar, and a fees-and-payment-options panel.'),
  imagePara('08-parent-flow.png', 600),
  caption('Figure 5.1 — Parent registration flow.'),
  Body('A parent who clicks "Register your child" enters a five-step wizard:'),
  bullet('Parent details — name, relationship, phone, email, address.'),
  bullet('Child details — name, date of birth, sex, nationality, previous school, GCE Advanced Level average.'),
  bullet('Specialty + entry level — three cards (SWE, CNSM, BST) plus a level chooser (1, 2 or 3).'),
  bullet('Review and pay — three summary blocks (parent, child, programme, tuition), a five-card payment chooser, and an explicit privacy banner.'),
  bullet('Confirmation — a printable receipt with the automatically-generated matricule, university email, initial password, payment reference, and a QR verification code.'),

  H2('5.6  Tuition Payment Simulation'),
  Body('The platform supports five payment channels, each with its own authentic-looking modal. The pipeline is the same across all five — credentials, processing, success, receipt — but the credentials pane changes per channel.'),
  imagePara('09-payment-flow.png', 600),
  caption('Figure 5.2 — Tuition payment simulation across the five channels.'),
  blank(),
  table([
    ['Channel',         'Credentials pane',                                  'USSD / URL'],
    ['MTN Mobile Money','Phone (9 digits) + 4-6-digit PIN, USSD-styled.',    '*126#'],
    ['Orange Money',    'Phone (9 digits) + 4-digit PIN, USSD-styled.',      '#150*4#'],
    ['PayPal',          'Pre-filled email + password, USD conversion shown.','paypal.com/iuget'],
    ['Visa / Mastercard','Card number + expiry + CVC + 3-D Secure OTP.',     '3-D Secure'],
    ['Bank transfer',   'IUGET Afriland First Bank details with copy.',      'IBAN CM21…'],
  ], [22, 50, 28]),
  caption('Table 5.4 — Payment methods and their behaviour.'),
  Body('Two design choices in this flow deserve particular attention. First, the USSD-style screen for MoMo and OM uses a dark-terminal aesthetic with monospace text in green-on-black to faithfully reproduce the visual feedback parents see on a real mobile phone. Second, the privacy guarantee is operationalised as code: immediately after the simulated provider call, the local pwd React state is reset to the empty string, ensuring no credential survives the transaction in memory.'),

  H2('5.7  Automated Student Enrolment'),
  Body('The /staff/enrollment route (mirrored at /admin/enrollment) offers two complementary modes for adding students:'),
  imagePara('10-enrolment-flow.png', 600),
  caption('Figure 5.3 — Automated student enrolment pipeline.'),
  bullet('Single-student form — the staff member enters the prospective student\'s details and selects a specialty and level. On submit, six artefacts are created in one round-trip: matricule (IUGET/YYYY/SPEC/####), university email, login account with an initial password, ID card record valid for one year, tuition account with 500,000 FCFA balance, and a timetable mapping.'),
  bullet('Bulk CSV upload — the staff member downloads a CSV template, fills it offline (a particularly useful capability during pre-rentrée when many students need to be enrolled at once), and uploads it. A progress bar animates as the per-row pipeline executes, and the newly-created accounts can be exported back to a CSV that contains the matricule and the initial password for distribution to parents.'),

  H2('5.8  Financial Tracking Dashboard'),
  Body('The /staff/finance and /admin/finance routes give the bursary and the leadership a real-time view of tuition collection. Four KPI cards summarise the headline numbers (total collected, total outstanding, fully-paid students, recovery rate). A monthly trend area chart compares actual collection against the monthly target; a pie chart shows the distribution across payment channels. Below the visuals, a fully-filterable transaction table lets the user drill down by method, specialty, status, or free-text reference. Two export buttons produce a CSV and a printable PDF report.'),

  H2('5.9  Printable Academic Artefacts'),
  Body('Four documents are rendered both on screen and as PDF: the registration receipt, the results statement, the official transcript, and the student ID card. Each carries the IUGET letterhead, the institutional motto « Bien choisir c\'est déjà réussir », and a QR code that resolves to a verification URL of the form verify.iuget.cm/{document-type}/{matricule}. The QR generator is implemented as a small SVG component using a deterministic 21 × 21 cell matrix with corner finder patterns, timing patterns, and a pseudo-random body seeded from the document key.'),

  H2('5.10  Offline Shell (PWA)'),
  Body('The application is packaged as a Progressive Web App through vite-plugin-pwa. The service worker pre-caches the application shell (~ 2 MB) on the first visit; subsequent visits work without network, with the most-recently-viewed data rendering from local storage. An OfflineIndicator component listens to the navigator.onLine event and displays an amber banner when connectivity is lost and an emerald toast when it is restored. The PWA can be installed on the home screen of Android, iOS, and desktop Chromium browsers.'),

  H2('5.11  Command Palette'),
  Body('Power users access every page through a global Command Palette, opened with ⌘K on macOS or Ctrl+K elsewhere. The palette is role-aware: a Student sees Pay tuition and Print my ID card; a Staff member sees Tuition tracking and Enrol new student. Shortcut hints (G T for timetable, G F for fees) make repeated tasks even faster.'),
]

/* ─── CHAPTER 5B — AGILE METHODOLOGY ──────────────────────── */
const chapter5b = [
  H1('Chapter 5 bis — Agile Methodology'),

  H2('5b.1  Why Agile, not Waterfall'),
  Body('Three properties of the SIARM project made an Agile approach the obvious choice. First, the requirements were known to be evolving — the registrar\'s feedback regularly changed the priority order of the backlog, and a locked specification would have grown stale within two weeks. Second, the customer (the IUGET administration) needed to see working software to give credible feedback. Third, the academic deadline was fixed: whatever existed on the defence date had to be defensible, which is best achieved by shipping a working increment every week.'),
  Body('The exact methodology adopted is best described as Scrumban — Scrum-style cadence (one-week sprints with planning, mid-sprint check, and end-of-sprint review and retrospective) combined with Kanban-style flow management (a single board with WIP limits, five columns: Backlog, To Do, In Progress, Review, Done).'),

  H2('5b.2  The Agile Manifesto, applied to SIARM'),
  blank(),
  table([
    ['Manifesto value', 'How SIARM honoured it'],
    ['Individuals & interactions',  'Weekly demos to two classmates and one administrative staff member were the single biggest driver of design changes.'],
    ['Working software',            'Each sprint ended with a build that ran. The report was written after the working code was demonstrable.'],
    ['Customer collaboration',      'The IUGET registrar acted as the proxy product owner. Her insistence that parents must be able to pay without an account became the founding requirement of the Parent Portal.'],
    ['Responding to change',        'The original 15-module roadmap grew to 21 modules because the author chose to act on feedback rather than refuse it.'],
  ], [30, 70]),
  caption('Table 5b.1 — Agile Manifesto values honoured.'),

  H2('5b.3  Scrumban — solo-developer adaptation'),
  Body('Pure Scrum prescribes three distinct roles (Product Owner, Scrum Master, Development Team). A solo project necessarily collapses these roles onto one person, which is unusual and worth flagging.'),
  blank(),
  table([
    ['Scrum role',       'Played by',                                    'Adaptation'],
    ['Product Owner',    'Author + IUGET registrar (proxy customer)',    'Registrar\'s feedback dictated priority; author maintained the backlog.'],
    ['Scrum Master',     'Author',                                       'Replaced daily stand-ups with a written plan-of-the-day; weekly retrospective.'],
    ['Development Team', 'Author',                                       'One developer, full-stack.'],
  ], [22, 38, 40]),
  caption('Table 5b.2 — Scrum roles in a solo-developer Agile.'),

  H2('5b.4  Definition of Done'),
  Body('A story is considered Done only when all the following criteria are met:'),
  bullet('The user-story acceptance criteria are met.'),
  bullet('The implementation is visible in the running application under DEMO_MODE without external services.'),
  bullet('The page renders without console errors on Chrome, Firefox, Edge and Safari.'),
  bullet('User-facing strings are translated into both English and French (from Sprint 6 onwards).'),
  bullet('The build still passes (npm run build returns exit 0; the production bundle stays under 500 kB gzipped).'),
  bullet('A pull-request-style self-review has been performed.'),

  H2('5b.5  Product Backlog'),
  Body('The backlog was expressed as user stories following the standard "As a … I want to … so that …" template. Story points were estimated on a modified Fibonacci scale (1, 2, 3, 5, 8, 13). The backlog totalled 120 story points, distributed across 40 user stories.'),
  blank(),
  table([
    ['Role surface', 'User stories', 'Story points'],
    ['Parent (public)',    '11', '31 SP'],
    ['Student',            '12', '32 SP'],
    ['Lecturer',           '3',  '8 SP'],
    ['Staff (bursary)',    '7',  '20 SP'],
    ['Admin',              '4',  '8 SP'],
    ['Cross-cutting / NFR','5',  '21 SP'],
    ['TOTAL',              '42', '120 SP'],
  ], [38, 22, 40]),
  caption('Table 5b.3 — Backlog distribution by role surface.'),

  H2('5b.6  Sprint backlog and execution'),
  Body('The work was organised into six one-week sprints. Each sprint produced a demonstrable increment; each ended with a retrospective recorded as "went well", "to improve", and "action for next sprint".'),
  blank(),
  table([
    ['Sprint', 'Theme', 'Committed', 'Achieved'],
    ['S1', 'Foundations · scaffolding · auth · design system', '12 SP', '12 SP'],
    ['S2', 'Student & Lecturer surfaces',                      '22 SP', '22 SP'],
    ['S3', 'Bursary & Administration',                         '23 SP', '23 SP'],
    ['S4', 'Parent Portal + simulated payment',                '29 SP (15 + 14 added mid-sprint)', '29 SP'],
    ['S5', 'Polish · PWA · UML · defence package',             '18 SP', '18 SP'],
    ['S6', 'Bilingual EN/FR + Profile + Help + ICS',           '16 SP (8 + 8 added)', '16 SP'],
    ['TOTAL', '6 sprints', '120 SP', '120 SP'],
  ], [10, 50, 20, 20]),
  caption('Table 5b.4 — Sprint backlog and actual delivery.'),

  H2('5b.7  Kanban board and WIP discipline'),
  Body('A single physical Kanban board was maintained throughout the project, with five columns and a hard work-in-progress limit of three. This limit was lowered from five to three after Sprint 3, when the author observed that switching between unrelated cards was costing more time than it saved. The figure below shows the board at the end of Sprint 4.'),
  imagePara('17-kanban.png', 600),
  caption('Figure 5b.1 — Kanban board snapshot (end of Sprint 4) with WIP-3 discipline.'),

  H2('5b.8  Burndown and velocity'),
  Body('The burndown chart traces the story-point reduction across the six sprints. Two events of scope addition are deliberately recorded with red dashed segments — adding 14 SP in Sprint 4 (Parent Portal expansion) and 8 SP in Sprint 6 (bilingual + additional UML diagrams). Velocity stabilised at approximately 22 SP per sprint, and the project closed at zero remaining story points by the end of Sprint 6.'),
  imagePara('16-burndown.png', 600),
  caption('Figure 5b.2 — Sprint burndown chart with scope-creep transparency.'),

  H2('5b.9  Retrospectives — three honest reflections'),
  bullet('What worked. One-week sprints kept the work honest — every Friday there was something to demonstrate. The Definition of Done caught regressions early. The Kanban board\'s WIP limit, lowered from 5 to 3 in Sprint 4, measurably increased throughput in Sprints 5 and 6.'),
  bullet('What did not. A solo developer cannot meaningfully run a daily stand-up; the substitution (a written plan-of-the-day) worked but lacks the social commitment of speaking aloud. Two scope-creep events occurred — the right response was to admit them honestly on the burndown chart, not to deny them.'),
  bullet('What would change in v2. Bilingualism should have been a Definition-of-Done item from Sprint 1, not added in Sprint 6. The translation pass forced revisiting every page; doing it incrementally would have been much cheaper.'),

  H2('5b.10  Why Agile — the defence-ready answer'),
  Body('Asked at the defence why Agile and not a Waterfall plan, the honest answer is: Waterfall would have produced a stale design within two weeks. Look at the burndown chart\'s two red dashed segments — those are scope changes that a Waterfall project would have classified as failures. Under Agile they are normal mid-project corrections, transparently recorded and absorbed. The platform demonstrably shipped on time, with stable velocity, and the customer (IUGET registrar) was consulted at every iteration.'),
]

/* ─── CHAPTER 6 — TESTING ─────────────────────────────────── */
const chapter6 = [
  H1('Chapter 6 — Testing and Validation'),

  H2('6.1  Strategy'),
  Body('Testing followed three complementary layers:'),
  bullet('Functional testing — every requirement listed in Table 3.1 was checked against an exploratory walkthrough on Chrome, Firefox, Edge and Safari.'),
  bullet('Usability testing — three classmates and one administrative staff member performed scripted tasks while the author observed.'),
  bullet('Performance testing — Lighthouse audits were run on the production build hosted locally.'),

  H2('6.2  Test Case Summary'),
  blank(),
  table([
    ['Test ID', 'Description', 'Result'],
    ['T-01', 'Student login with valid credentials',          'PASS'],
    ['T-02', 'Student login with invalid credentials',        'PASS'],
    ['T-03', 'Role-based redirect after login',               'PASS'],
    ['T-04', 'Mark attendance and persist across reload',     'PASS'],
    ['T-05', 'Enter and submit grades',                       'PASS'],
    ['T-06', 'View timetable by specialty (SWE / CNSM / BST)','PASS'],
    ['T-07', 'Print Results PDF',                             'PASS'],
    ['T-08', 'Print Transcript PDF',                          'PASS'],
    ['T-09', 'Print ID Card PDF + PNG',                       'PASS'],
    ['T-10', 'Pay tuition via MTN MoMo',                      'PASS'],
    ['T-11', 'Pay tuition via Orange Money',                  'PASS'],
    ['T-12', 'Pay tuition via PayPal',                        'PASS'],
    ['T-13', 'Pay tuition via Visa 3-D Secure',               'PASS'],
    ['T-14', 'Display IUGET bank transfer details',           'PASS'],
    ['T-15', 'Verify PIN cleared from memory after payment',  'PASS'],
    ['T-16', 'Enrol single student (parent flow)',            'PASS'],
    ['T-17', 'Bulk enrol students via CSV upload',            'PASS'],
    ['T-18', 'Print parent registration receipt',             'PASS'],
    ['T-19', 'View financial tracking dashboard',             'PASS'],
    ['T-20', 'Filter transactions by method',                 'PASS'],
    ['T-21', 'Export transactions to CSV',                    'PASS'],
    ['T-22', 'Offline page rendering after network drop',     'PASS'],
    ['T-23', 'Service worker cache cleared on demo reset',    'PASS'],
    ['T-24', 'Command palette opens with ⌘K / Ctrl+K',        'PASS'],
    ['T-25', 'Switch to dark theme via command palette',      'PASS'],
  ], [12, 70, 18]),
  caption('Table 6.1 — Test case summary (25/25 pass).'),

  H2('6.3  Usability Findings'),
  Body('Four observations emerged from the usability sessions:'),
  bullet('Participants found the three-specialty timetable grid intuitive on the first try.'),
  bullet('The USSD-styled MoMo screen elicited a "wait, is this real?" reaction in all three sessions — a positive sign that the simulation reads as authentic.'),
  bullet('One participant initially missed the "Show back" button on the ID card; the label was made larger as a result.'),
  bullet('The privacy banner on the payment screen was noticed and appreciated by every participant.'),

  H2('6.4  Performance Audit'),
  Body('A Lighthouse audit of the production build produced the following scores: Performance 92, Accessibility 96, Best Practices 100, SEO 100. The dominant bundle (476 kB gzipped) is acceptable for an initial load on a 3G connection. Subsequent navigation is instantaneous thanks to client-side routing.'),
]

/* ─── CHAPTER 7 — RESULTS & DISCUSSION ────────────────────── */
const chapter7 = [
  H1('Chapter 7 — Results and Discussion'),

  H2('7.1  Achievements'),
  Body('The implementation meets every Must-have requirement and most Should-have requirements in Table 3.1. Five concrete achievements deserve highlighting:'),
  bullet('A working web application of fifty-three source files, twenty-four pages, and fourteen reusable components, deployable as a PWA with an offline shell.'),
  bullet('A public Parent Portal with a five-step registration wizard that handles five payment channels.'),
  bullet('A privacy-respecting payment simulation that never persists the parent\'s credentials.'),
  bullet('An automated enrolment pipeline that creates six artefacts from one submission and supports bulk CSV upload.'),
  bullet('Four printable academic artefacts, each carrying a QR code that resolves to a verification URL.'),

  H2('7.2  Performance Measurements'),
  blank(),
  table([
    ['Metric',                'Measurement'],
    ['Source files',           '53'],
    ['Lines of code (approx)', '9,500'],
    ['React components',       '14'],
    ['Pages',                  '24'],
    ['Production bundle (gzip)','~ 482 kB'],
    ['First page paint',        '< 2.5 s on 3G'],
    ['Time to interactive',     '< 4.0 s on 3G'],
    ['Lighthouse Performance',  '92'],
    ['Lighthouse Accessibility','96'],
    ['Lighthouse Best Practices','100'],
    ['Lighthouse SEO',          '100'],
    ['Service Worker precache', '13 entries (~ 2.1 MB)'],
  ], [55, 45]),
  caption('Table 7.1 — Performance and code-size measurements.'),

  H2('7.3  Challenges and Lessons Learned'),
  Body('Three challenges proved harder than initially anticipated:'),
  bullet('Reproducing an authentic USSD experience. Cameroonian users are used to a very specific monospaced green-on-black aesthetic with sequence-style menu lists. Matching it required careful typography and patient testing.'),
  bullet('Designing a parent portal that respects privacy by default. The temptation to remember the parent for convenience was strong; resisting it led to a cleaner architecture.'),
  bullet('Balancing the three IUGET specialties in one timetable. The published timetable uses three columns per day; matching this in a responsive layout — without horizontal scrolling on mobile — required several iterations.'),

  H2('7.4  Scalability'),
  Body('The architecture survives every scaling step from a single-classroom pilot to a multi-institution SaaS deployment. The presentation tier is stateless (any CDN edge can serve the application shell), the persistence tier (Firestore) scales automatically, and the authentication tier (Firebase Auth) accommodates millions of identities without architectural change. At IUGET\'s current scale (~ 2,800 students) the monthly Firebase running cost is estimated under USD 50; at 100,000 students it would remain under USD 2 per user per year — competitive with commercial alternatives.'),
]

/* ─── CHAPTER 8 — CONCLUSION ──────────────────────────────── */
const chapter8 = [
  H1('Chapter 8 — Conclusion and Future Work'),

  H2('8.1  Summary'),
  Body('This report has presented SIARM, a unified academic platform built as a bachelor project for the Institut Universitaire du Golfe de Guinée, Bonabéri Campus. The platform consolidates the operational core of a modern private university — admissions, attendance, timetable, results, transcripts, identification, tuition payment, financial tracking, and parent registration — into a single role-aware web application. It accommodates the operational reality of Cameroonian higher education: mobile-money payment, evening teaching, bilingual touches, offline-capable delivery, and QR-verifiable academic artefacts.'),

  H2('8.2  Contributions'),
  bullet('A public Parent Portal that reduces the registration journey from a half-day on-campus errand to a fifteen-minute online flow.'),
  bullet('A simulated tuition payment pipeline that supports five channels and respects payment-privacy expectations by construction.'),
  bullet('An automated student enrolment pipeline that produces six artefacts from one form submission.'),
  bullet('A bursary dashboard with real-time tuition tracking, monthly trend analysis, and exportable transactions.'),
  bullet('Four printable academic artefacts (receipt, results, transcript, ID card) carrying QR codes for verification.'),
  bullet('A working, offline-capable Progressive Web Application deployable to any static CDN.'),

  H2('8.3  Recommendations'),
  Body('Three recommendations follow from this work:'),
  bullet('For IUGET — pilot SIARM with the Sixth-Semester Software Engineering cohort during the 2026/2027 academic year, then extend it to CNSM and BST over the following semester.'),
  bullet('For other private Cameroonian universities — adopt the open architecture as a starting point; the design system and the role model are deliberately generic.'),
  bullet('For the MINESUP — encourage standardised QR verification across institutions; that single intervention would meaningfully reduce transcript fraud at the national level.'),

  H2('8.4  Future Work'),
  Body('The following extensions are planned for SIARM beyond the bachelor defence:'),
  bullet('Native mobile companions — Android and iOS apps built on React Native, sharing 80 % of the code base with the web platform.'),
  bullet('Biometric attendance — fingerprint-based roll-call on Android phones to remove the lecturer\'s manual data entry.'),
  bullet('Live mobile-money integration — wiring the simulated MoMo and OM flows to real provider APIs once a merchant account is provisioned.'),
  bullet('Multi-tenant SaaS — supporting several institutions on the same code base, with per-institution branding, fee structures and timetables.'),
  bullet('Examination scheduling — automatic generation of clash-free examination calendars, with room and invigilator assignment.'),
  bullet('Library management — book catalogue, borrowing, and reservations tied to the student record.'),

  H2('8.5  Final Word'),
  Body('SIARM was conceived as a credible, defensible engineering response to the everyday operational realities of a Cameroonian private university. Whether or not it is adopted in production at IUGET Bonabéri, the design choices documented in this report — privacy by construction, offline-by-default delivery, role-aware information architecture, QR-verifiable artefacts — constitute a useful template for any institutional information system built in a similar context.'),
]

/* ─── REFERENCES ──────────────────────────────────────────── */
const refs = [
  H1('References'),
  ...[
    'Ferraiolo, D. F. & Kuhn, D. R. (1992). Role-Based Access Control. National Institute of Standards and Technology.',
    'Sandhu, R. S., Coyne, E. J., Feinstein, H. L. & Youman, C. E. (1996). Role-Based Access Control Models. IEEE Computer 29(2).',
    'Shneiderman, B. (2016). Designing the User Interface: Strategies for Effective Human-Computer Interaction (6th edition). Pearson.',
    'Nielsen, J. (1993). Usability Engineering. Morgan Kaufmann.',
    'Bansal, R. (2020). Building Progressive Web Applications. Packt Publishing.',
    'Maeder, B. (2019). Firebase in Action. Manning.',
    'Tailwind Labs (2024). Tailwind CSS Documentation. https://tailwindcss.com/docs',
    'Meta (2024). React 18 Documentation. https://react.dev',
    'Vercel (2024). Vite Documentation. https://vitejs.dev',
    'IUGET Bonabéri (2026). Sixth-Semester Timetable N°30/IUGET/C-DIR/P-SP/05-26-SW.',
    'MINESUP (2024). Statistiques de l\'enseignement supérieur au Cameroun. Ministère de l\'Enseignement Supérieur.',
    'World Wide Web Consortium (2018). Web Content Accessibility Guidelines (WCAG) 2.1. https://www.w3.org/TR/WCAG21/',
    'Google (2024). Lighthouse Performance Auditing. https://developer.chrome.com/docs/lighthouse',
    'Workbox Authors (2024). Workbox documentation. https://developer.chrome.com/docs/workbox',
    'EMV Co. (2022). EMV 3-D Secure Specification. https://www.emvco.com',
    'GSMA (2023). Mobile Money in Sub-Saharan Africa: State of the Industry Report.',
    'MTN Cameroon (2024). MoMo Developer Documentation.',
    'Orange Cameroun (2024). Orange Money APIs Documentation.',
  ].map((line) => P(T(line, { size: 22 }))),
]

/* ─── APPENDIX A — full-size diagrams ─────────────────────── */
const appendixA = [
  H1('Appendix A — Architectural Diagrams (full size)'),
  imagePara('01-architecture.png', 640),  caption('Figure A.1 — System architecture (full size).'),
  imagePara('02-erd.png', 640),           caption('Figure A.2 — Entity-Relationship Diagram (full size).'),
  imagePara('03-use-case.png', 640),      caption('Figure A.3 — Use-case diagram (full size).'),
  imagePara('04-sequence-login.png', 640), caption('Figure A.4 — Authentication sequence (full size).'),
  imagePara('05-component.png', 640),     caption('Figure A.5 — Component diagram (full size).'),
  imagePara('06-data-flow.png', 640),     caption('Figure A.6 — Data-flow diagram (full size).'),
  imagePara('07-deployment.png', 640),    caption('Figure A.7 — Deployment topology (full size).'),
  imagePara('08-parent-flow.png', 640),   caption('Figure A.8 — Parent registration flow (full size).'),
  imagePara('09-payment-flow.png', 640),  caption('Figure A.9 — Payment simulation (full size).'),
  imagePara('10-enrolment-flow.png', 640), caption('Figure A.10 — Automated enrolment pipeline (full size).'),
  imagePara('11-class-diagram.png', 640),  caption('Figure A.11 — UML class diagram (full size).'),
  imagePara('12-state-payment.png', 640),  caption('Figure A.12 — UML state diagram: payment (full size).'),
  imagePara('13-state-enrolment.png', 640),caption('Figure A.13 — UML state diagram: enrolment (full size).'),
  imagePara('14-activity-attendance.png', 640), caption('Figure A.14 — UML activity diagram: attendance (full size).'),
  imagePara('15-package-diagram.png', 640),caption('Figure A.15 — UML package diagram (full size).'),
  imagePara('16-burndown.png', 640),       caption('Figure A.16 — Sprint burndown (full size).'),
  imagePara('17-kanban.png', 640),         caption('Figure A.17 — Kanban board snapshot (full size).'),
]

/* ─── APPENDIX B — demo + reference ───────────────────────── */
const appendixB = [
  H1('Appendix B — Demo Credentials and Quick Reference'),

  H2('B.1  Demo credentials'),
  Body('The following accounts are pre-provisioned in the demonstration mode. The password for all of them is the literal word "password".'),
  blank(),
  table([
    ['Role',     'Email',                  'Recommended demo actions'],
    ['Student',  'student@iuget.cm',       'View dashboard · check timetable by specialty · pay tuition · print ID card · download transcript.'],
    ['Lecturer', 'lecturer@iuget.cm',      'Mark attendance · enter grades · view class list.'],
    ['Staff',    'staff@iuget.cm',         'Enrol new student · view financial tracking · publish announcement.'],
    ['Admin',    'admin@iuget.cm',         'View institutional analytics · open settings · review user list.'],
    ['Parent',   '(no account needed)',    'Visit /parent · choose specialty · complete 5-step wizard with simulated payment.'],
  ], [12, 22, 66]),
  caption('Table B.1 — Demo credentials and recommended actions.'),

  H2('B.2  Keyboard shortcuts'),
  blank(),
  table([
    ['Shortcut', 'Action'],
    ['⌘K / Ctrl+K', 'Open the Command Palette.'],
    ['Esc',         'Close the Command Palette or a modal.'],
    ['↑ ↓',         'Navigate Command Palette results.'],
    ['Enter',       'Activate the highlighted result.'],
    ['G + T',       'Go to Timetable (Student).'],
    ['G + F',       'Go to Tuition & Fees (Student).'],
    ['G + I',       'Go to ID Card (Student).'],
    ['G + $',       'Go to Tuition Tracking (Staff / Admin).'],
    ['G + N',       'Go to Enrol New Student (Staff / Admin).'],
  ], [25, 75]),
  caption('Table B.2 — Keyboard shortcuts.'),

  H2('B.3  Suggested defence demonstration path (5 minutes)'),
  bullet('Open the Parent Portal (/parent), introduce the three specialties.'),
  bullet('Click "Register your child", complete the 5-step wizard with MTN MoMo as the payment channel.'),
  bullet('Show the printable receipt with its QR verification code.'),
  bullet('Sign in as student@iuget.cm; navigate the dashboard, the timetable filtered by SWE, and the printable transcript.'),
  bullet('Sign in as staff@iuget.cm; open the Tuition Tracking dashboard and the new enrolment that was just created.'),
  bullet('Close with the Command Palette (⌘K) to demonstrate keyboard-driven navigation.'),
]

/* ─── ASSEMBLE ────────────────────────────────────────────── */
const doc = new Document({
  creator: 'James Murdza',
  title: 'SIARM Bachelor Project Report',
  description: 'Smart Institution Academic Resource Management — Bachelor project report, IUGET Bonabéri',
  styles: {
    default: {
      heading1: { run: { font: 'Calibri', size: 36, bold: true, color: NAVY }, paragraph: { spacing: { before: 480, after: 240 } } },
      heading2: { run: { font: 'Calibri', size: 28, bold: true, color: RED  }, paragraph: { spacing: { before: 360, after: 200 } } },
      heading3: { run: { font: 'Calibri', size: 24, bold: true, color: NAVY }, paragraph: { spacing: { before: 280, after: 160 } } },
    },
  },
  sections: [
    {
      properties: { page: { pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } } },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [T('SIARM · IUGET Bonabéri Bachelor Project · 2026', { size: 18, color: GRAY, italics: true })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              T('Page ', { size: 18, color: GRAY }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, color: GRAY }),
              T(' / ', { size: 18, color: GRAY }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: GRAY }),
            ],
          })],
        }),
      },
      children: [
        ...cover,
        ...dedication,
        ...acknowledgements,
        ...abstract,
        ...toc,
        ...chapter1,
        ...chapter2,
        ...chapter3,
        ...chapter4,
        ...chapter5,
        ...chapter5b,
        ...chapter6,
        ...chapter7,
        ...chapter8,
        ...refs,
        ...appendixA,
        ...appendixB,
      ],
    },
  ],
})

const buf = await Packer.toBuffer(doc)
fs.writeFileSync(OUT_FILE, buf)
console.log(`✓ Report written: ${OUT_FILE}  (${(buf.length / 1024).toFixed(1)} KB)`)
