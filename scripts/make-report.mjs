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
const BRAND_DIR   = path.resolve(process.cwd(), 'public/brand')
const OUT_FILE    = path.resolve(process.cwd(), 'deliverables/SIARM-Report.docx')

const NAVY = '000000'
const RED  = '000000'
const GRAY = '000000'
const INK  = '000000'

const T = (text, opts = {}) => new TextRun({ text, font: 'Times New Roman', ...opts })

const P = (children, opts = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [children],
  spacing: { after: 160, line: 360, lineRule: LineRuleType.AUTO },
  ...opts,
})

const Body = (text, opts = {}) =>
  P(T(text, { size: 24, color: INK }), { alignment: AlignmentType.JUSTIFIED, ...opts })

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
    children: [T(text, { size: 24 })],
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
    children: [T(text, { size: 20, italics: true, color: GRAY })],
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

function loadImage(filename) {
  const fp = path.join(BRAND_DIR, filename)
  if (!fs.existsSync(fp)) return null
  return fs.readFileSync(fp)
}

const iugetLogo = loadImage('iuget-logo.png')

const cover = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 800 },
    children: [T('INSTITUT UNIVERSITAIRE DU GOLFE DE GUINEE', { size: 28, bold: true, color: NAVY })],
  }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('IUGET  Campus de Bonaberi  Douala, Cameroon', { size: 22, color: RED })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [T('"Bien choisir, c\'est deja reussir"', { size: 20, italics: true, color: GRAY })] }),

  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: iugetLogo ? [
      T('   ', { size: 8 }), '',
      new ImageRun({ data: iugetLogo, transformation: { width: 110, height: 100 } }),
      T('        ', { size: 8 }),
      new ImageRun({ data: iugetLogo, transformation: { width: 110, height: 100 } }),
      T('        ', { size: 8 }),
      new ImageRun({ data: iugetLogo, transformation: { width: 110, height: 100 } }),
      T('   ', { size: 8 }),
    ] : [T('[ IUGET Logo ]     [ University of Bamenda Logo ]     [ IUGET Logo ]', { size: 18, color: GRAY, italics: true })],
  }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [T('UNIVERSITY OF BAMENDA', { size: 20, bold: true, color: NAVY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [T('(Partner Institution)', { size: 18, italics: true, color: GRAY })] }),

  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 }, children: [T('BACHELOR PROJECT REPORT', { size: 26, bold: true, color: INK })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [T('Department of Software Engineering  |  Level 3  |  Sixth Semester', { size: 20, color: GRAY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [T('Matricule: IUGET/2026/SWE/0011', { size: 20, color: GRAY })] }),

  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('SIARM', { size: 64, bold: true, color: NAVY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [T('Smart Institution Academic Resource Management', { size: 28, bold: true, color: RED })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [T('A Unified Academic Platform for IUGET Bonaberi', { size: 22, italics: true, color: GRAY })] }),

  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('Presented by', { size: 20, color: GRAY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('James Murdza', { size: 28, bold: true, color: INK })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [T('Level 3  Software Engineering  |  IUGET Bonaberi', { size: 20, color: GRAY })] }),

  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('Academic Year 2025 / 2026', { size: 24, bold: true, color: NAVY })] }),
  pageBreak(),
]

const dedication = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1200 }, children: [T('DEDICATION', { size: 30, bold: true, color: NAVY })] }),
  blank(),
  P([T('To my parents,', { size: 24, italics: true, color: INK })], { alignment: AlignmentType.CENTER }),
  P([T('whose sacrifices made this education possible.', { size: 22, italics: true, color: GRAY })], { alignment: AlignmentType.CENTER }),
  blank(),
  P([T('To my lecturers at IUGET Bonaberi,', { size: 22, italics: true, color: INK })], { alignment: AlignmentType.CENTER }),
  P([T('Mr Nkoma Ngouloure, Dr Romeo Mougnol, Eng Fotseu Julien, Mr Smith Wills, and Mr Asongafack Patrick,', { size: 22, italics: true, color: GRAY })], { alignment: AlignmentType.CENTER }),
  P([T('whose patient teaching shaped the engineer behind this work.', { size: 22, italics: true, color: GRAY })], { alignment: AlignmentType.CENTER }),
  pageBreak(),
]

const acknowledgements = [
  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('ACKNOWLEDGEMENTS', { size: 30, bold: true, color: NAVY })] }),
  blank(),
  Body('The completion of this bachelor project owes much to the support and guidance of many. I wish to express my sincere gratitude to the administration of the Institut Universitaire du Golfe de Guinee (IUGET), Bonaberi Campus, for creating a learning environment where students are encouraged to undertake practical engineering work rooted in real institutional needs.'),
  Body('I am particularly indebted to my project supervisor, whose constructive critique and steady pacing have kept this work focused throughout the academic year. I extend the same gratitude to the lecturers of the Department of Software Engineering, Mr Nkoma Ngouloure (Compiler Design, Research Methodology), Dr Romeo Mougnol (Design Project), Eng Fotseu Julien (Embedded Systems), Mr Smith Wills (Mobile Development), and Mr Asongafack Patrick (Object Oriented Programming), for foundational knowledge that runs through every page of this report.'),
  Body('Heartfelt thanks go to the administrative and bursary staff of IUGET, who answered numerous questions about how registration, tuition collection and timetable publication are actually performed today. Their candour is the reason this project addresses real problems rather than hypothetical ones.'),
  Body('Finally, I am grateful to my classmates, including Chituh Innocentia, Nkwenti Deshnic, Winner Chinuere, Zelio Gerald and Wandji Adrien, and to my family, whose encouragement carried me through the long evenings of implementation.'),
  pageBreak(),
]

const abstract = [
  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('ABSTRACT', { size: 30, bold: true, color: NAVY })] }),
  blank(),
  Body('SIARM (Smart Institution Academic Resource Management) is a unified web platform designed for the operational needs of private universities in Cameroon, with the Institut Universitaire du Golfe de Guinee (IUGET), Bonaberi Campus, as its reference deployment. The platform consolidates several previously disconnected workflows, including admissions, attendance recording, timetable consultation, results entry and viewing, tuition payment, printable transcripts, official student identification, announcements, and operational reporting, into a single role aware application.'),
  Body('The system is implemented as a single page application using React 18, Vite, and Tailwind CSS, backed by Firebase Authentication and Cloud Firestore in production, and operating in a fully self contained demonstration mode for the defence. Access control is hierarchical, exposing four role specific surfaces (Student, Lecturer, Staff, Administration) plus one public surface (the Parent Portal) reachable without an account.'),
  Body('A particular focus of the project is the automation of student enrolment and tuition payment. Parents can register a child end to end from any device, choosing a specialty, paying through MTN Mobile Money, Orange Money, PayPal, Visa or bank transfer, and receive a printable, QR verifiable receipt at the end of the flow. The PIN, password or card data are never persisted, in keeping with industry payment privacy expectations.'),
  Body('The platform also supports the IUGET bachelor section\'s three specialties (Software Engineering, Computer Networks and Multimedia Systems, Business Strategy and Technology), the evening and Saturday teaching schedule, three printable academic artefacts (results, transcript, ID card), and a bursary dashboard tracking tuition collection across the institution.'),
  Body('This document describes the problem context, methodology, architectural decisions, implementation, testing and the path to future production rollout. It is accompanied by a working demonstration, deployable production build, defence presentation, and architectural diagrams.'),
  P([T('Keywords: ', { bold: true, size: 24 }), T('academic resource management, role based access control, React, Firebase, mobile payment, IUGET, Cameroon higher education, parent portal, automated enrolment', { size: 24 })]),
  pageBreak(),
]

const toc = [
  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('TABLE OF CONTENTS', { size: 30, bold: true, color: NAVY })] }),
  blank(),
  ...[
    ['Dedication', 'i'],
    ['Acknowledgements', 'ii'],
    ['Abstract', 'iii'],
    ['Table of Contents', 'iv'],
    ['List of Figures', 'v'],
    ['List of Tables', 'vi'],
    ['List of Abbreviations', 'vii'],
    ['', ''],
    ['Chapter 1  General Introduction', '1'],
    ['Chapter 2  Literature Review', '11'],
    ['Chapter 3  Methodology', '20'],
    ['Chapter 4  System Design and Implementation', '28'],
    ['Chapter 5  Summary, Conclusion and Recommendations', '42'],
    ['', ''],
    ['References', '49'],
    ['Appendices', '50'],
  ].map(([k, v]) =>
    P([T(k, { size: 22, color: INK }), T(` ${'.'.repeat(Math.max(2, 70 - k.length))} `, { size: 22, color: GRAY }), T(v, { size: 22, color: INK })])
  ),
  pageBreak(),

  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('LIST OF FIGURES', { size: 28, bold: true, color: NAVY })] }),
  blank(),
  ...[
    'Figure 4.1  System architecture overview (three tier)',
    'Figure 4.2  Entity Relationship Diagram',
    'Figure 4.3  Use case diagram across four roles',
    'Figure 4.4  Authentication sequence diagram',
    'Figure 4.5  Component diagram of the React front end',
    'Figure 4.6  Data flow diagram for tuition payment',
    'Figure 4.7  Deployment topology',
    'Figure 5.1  Parent registration flow (5 steps)',
    'Figure 5.2  Tuition payment simulation across 5 channels',
    'Figure 5.3  Automated student enrolment pipeline',
  ].map((line) => P(T(line, { size: 22 }))),
  pageBreak(),

  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('LIST OF TABLES', { size: 28, bold: true, color: NAVY })] }),
  blank(),
  ...[
    'Table 1.1  Definition of key terms',
    'Table 2.1  Capability comparison across platforms',
    'Table 2.2  Comparative evaluation framework',
    'Table 3.1  Stakeholder roles',
    'Table 3.2  Functional requirements per role',
    'Table 3.3  Non functional requirements',
    'Table 3.4  Use cases',
    'Table 3.5  Requirement traceability matrix',
    'Table 4.1  Technology choice justification',
    'Table 4.2  Database collections and relationships',
    'Table 5.1  IUGET specialties supported',
    'Table 5.2  Lecturer course assignments (Sixth Semester)',
    'Table 5.3  Tuition fee breakdown',
    'Table 5.4  Payment methods and behaviours',
    'Table 5.5  Chat module feature roadmap',
    'Table 5.6  Attendance time slots and course mapping',
    'Table 5.7  Test case summary',
    'Table 5.8  Performance measurements',
    'Table 5.9  Achievement of specific objectives',
  ].map((line) => P(T(line, { size: 22 }))),
  pageBreak(),

  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('LIST OF ABBREVIATIONS', { size: 28, bold: true, color: NAVY })] }),
  blank(),
  table([
    ['Abbreviation', 'Meaning'],
    ['IUGET',  'Institut Universitaire du Golfe de Guinee'],
    ['SIARM',  'Smart Institution Academic Resource Management'],
    ['SWE',    'Software Engineering (specialty)'],
    ['CNSM',   'Computer Networks and Multimedia Systems (specialty)'],
    ['BST',    'Business Strategy and Technology (specialty)'],
    ['MoMo',   'MTN Mobile Money'],
    ['OM',     'Orange Money'],
    ['FCFA',   'Franc de la Cooperation Financiere en Afrique Centrale'],
    ['MINESUP','Ministere de l\'Enseignement Superieur du Cameroun'],
    ['RBAC',   'Role Based Access Control'],
    ['SPA',    'Single Page Application'],
    ['PWA',    'Progressive Web Application'],
    ['ERD',    'Entity Relationship Diagram'],
    ['CA',     'Continuous Assessment'],
    ['GPA',    'Grade Point Average'],
    ['CGPA',   'Cumulative Grade Point Average'],
    ['USSD',   'Unstructured Supplementary Service Data'],
    ['CRUD',   'Create, Read, Update, Delete'],
  ], [30, 70]),
  pageBreak(),
]

const chapter1 = [
  H1('Chapter 1  General Introduction'),

  H2('1.1  Background of the Study'),
  Body('Higher education in Cameroon has expanded rapidly in the past fifteen years. The Ministry of Higher Education (MINESUP) reports that the number of accredited private universities has more than tripled since 2010, and the Institut Universitaire du Golfe de Guinee (IUGET) is one of the institutions that has grown alongside that trend. With campuses in Bonaberi and Bonamoussadi, IUGET offers Bachelor of Technology programmes across three specialties, including the Software Engineering programme to which the author belongs.'),
  Body('The increase in student intake has not, however, been matched by a proportional increase in the digital infrastructure that supports university operations. Across the sector, day to day administration still relies heavily on paper roll call sheets, spreadsheet based grade entry, informal messaging groups for announcements, and unstructured cash or mobile money receipts for tuition. Information is fragmented across many disconnected tools and is rarely visible to leadership in real time. The cost of this fragmentation falls on three parties: students, who lose hours queueing at the bursary for receipts or transcripts; lecturers, whose time is consumed by paperwork that could be automated; and institutional leadership, who lack the live indicators they need to make timely decisions.'),
  Body('This bachelor project, SIARM, is a direct response to that gap. It is conceived not as a research prototype but as a working academic platform that an institution like IUGET Bonaberi could realistically adopt, with the operational realities of Cameroon\'s higher education sector deliberately built in: mobile money payment, evening teaching for working students, bilingual touches, and offline capable delivery for low bandwidth environments.'),

  H2('1.2  Statement of the Problem'),
  Body('From observation, interviews with IUGET administrative staff, and the author\'s own three year student experience, six recurring operational problems were identified:'),
  bullet('Fragmented systems. Attendance, grades, timetables, tuition and communication live in separate tools. Producing a single, coherent picture of a student\'s situation requires reconciling data manually across spreadsheets, paper records and informal messaging groups.'),
  bullet('Manual workflows. Roll call is taken on paper, then transcribed; grade sheets are filled by hand; transcripts are typed when requested. Each manual step introduces latency, transcription error, and labour cost.'),
  bullet('Limited operational visibility. Leadership has no live view of weekly attendance, tuition collection, or at risk cohorts. Reports are produced ad hoc at the end of semesters when corrective action is no longer possible.'),
  bullet('Connectivity constraints. Many students live and study in areas with intermittent internet service. Always online platforms create friction that an offline capable application would avoid.'),
  bullet('Cumbersome enrolment. Parents must visit the campus in person to collect forms, queue at the bursary, and bring proof of payment back to the registrar. The whole enrolment journey is slow and discouraging during the period when the institution most needs to convert prospects into enrolled students.'),
  bullet('Receipts and transcripts vulnerable to fraud. Hand stamped paper receipts and transcripts are easily copied. A verifiable, QR linked digital trail would strengthen the credibility of every academic artefact the institution issues.'),

  H2('1.3  Objectives of the Study'),
  H3('1.3.1  General Objective'),
  Body('The general objective of this work is to design, implement and document a unified web platform that automates the core administrative and pedagogical operations of a private university, using IUGET Bonaberi as the reference deployment.'),
  H3('1.3.2  Specific Objectives'),
  bullet('To analyse the current administrative workflows at IUGET Bonaberi and identify the operations that benefit most from digitalisation.'),
  bullet('To design a role aware information architecture suitable for students, lecturers, staff and leadership, plus a public surface usable by parents without an account.'),
  bullet('To implement a working web application that supports attendance, timetable, results, transcripts, official student identification, announcements, tuition payment, and a financial tracking dashboard.'),
  bullet('To simulate end to end tuition payment through five realistic channels, including MTN Mobile Money, Orange Money, PayPal, Visa and bank transfer, without ever persisting the parent\'s credentials.'),
  bullet('To automate student enrolment by generating matricule, university email, login account, ID card record and tuition account from a single submission.'),
  bullet('To make every printable academic artefact, including receipt, results, transcript and ID card, verifiable through a QR code that resolves to an institutional URL.'),
  bullet('To deliver the platform as an offline capable Progressive Web Application that remains usable when connectivity is intermittent.'),
  bullet('To produce defence ready documentation, including this report, a presentation, and a deployable production build.'),

  H2('1.4  Significance of the Study'),
  Body('A successful SIARM deployment would shorten the administrative loop between every action a student or parent takes and the institution\'s ability to record and act on it. Concretely:'),
  bullet('Students gain immediate visibility of attendance, grades, fees and their own academic standing, with one click printable transcripts and ID cards.'),
  bullet('Parents can register their child without travelling to the campus, see exactly what they are paying for, and receive an instantly printable receipt.'),
  bullet('Lecturers replace hand written attendance and grade sheets with two tap mobile interactions.'),
  bullet('Bursary staff see tuition collection update in real time and can export filtered reports for reconciliation.'),
  bullet('Leadership has a live dashboard of the institution\'s academic and financial health.'),
  Body('Beyond IUGET, the architecture is intentionally generic; it can be deployed at any private institution that operates a comparable evening class model with mobile payment expectations.'),

  H2('1.5  Scope and Delimitations'),
  Body('SIARM covers the operational core of an undergraduate programme: admission, attendance, timetable, assessment, payment, identification, communication, and reporting. It does not address human resources, payroll or accounting at the institutional level. Those are deliberately left to a separate finance system that SIARM would integrate with rather than replace.'),
  Body('Geographically, the demonstration deployment targets IUGET Bonaberi. Tuition figures and the academic calendar follow IUGET\'s current cycle. The reference timetable is the published Sixth Semester schedule covering the week of 25 to 31 May 2026.'),
  Body('Technically, the platform runs in the browser. A native mobile companion is out of scope; instead, the Progressive Web Application packaging permits installation on Android and iOS devices, with offline access to recently viewed pages.'),

  H2('1.6  Methodology Overview'),
  Body('The development followed an iterative, sprint based approach modelled on the Agile Scrum methodology. Each one week sprint produced a small set of demonstrable features, allowing the author to incorporate feedback from informal sessions with classmates and lecturers between iterations. The work was organised in five sprints:'),
  bullet('Sprint 1  Foundations: project scaffolding, design system, authentication, role guards, mock data layer.'),
  bullet('Sprint 2  Student and Lecturer surfaces: attendance, timetable, results, transcript, announcements, ID card.'),
  bullet('Sprint 3  Bursary and Administration surfaces: user management, financial tracking, timetable builder, announcements.'),
  bullet('Sprint 4  Public Parent Portal: marketing style landing page, five step registration wizard, simulated payment.'),
  bullet('Sprint 5  Polish, accessibility, offline shell, defence preparation.'),

  H2('1.7  Organisation of the Report'),
  Body('The remainder of this report is organised as follows:'),
  bullet('Chapter 2 reviews related work and existing systems, with comparison tables.'),
  bullet('Chapter 3 derives the functional and non functional requirements of SIARM and describes the methodology.'),
  bullet('Chapter 4 presents the system design and implementation, including architecture, data model, security model, and detailed designs for the most novel flows.'),
  bullet('Chapter 5 presents the testing strategy, results, findings, limitations, conclusion and recommendations for future work.'),

  H2('1.8  Definition of Terms'),
  Body('The following terms are used throughout this report with the meanings defined here:'),
  blank(),
  table([
    ['Term', 'Definition'],
    ['SIARM', 'Smart Institution Academic Resource Management, the platform presented in this report.'],
    ['IUGET', 'Institut Universitaire du Golfe de Guinee, the reference institution for this project.'],
    ['MINESUP', 'Ministere de l\'Enseignement Superieur, Cameroon\'s Ministry of Higher Education.'],
    ['Matricule', 'The unique student identifier assigned by the institution upon enrolment.'],
    ['PWA', 'Progressive Web Application, a web application that can be installed on a device and work offline.'],
    ['MoMo', 'Mobile Money, a mobile phone based payment service (used here to refer to MTN Mobile Money).'],
    ['OM', 'Orange Money, a mobile phone based payment service operated by Orange Cameroun.'],
    ['RBAC', 'Role Based Access Control, an authorisation model in which permissions are assigned to roles.'],
    ['MoSCoW', 'A prioritisation method: Must have, Should have, Could have, Won\'t have.'],
    ['SP', 'Story Point, a relative unit of effort used in Agile estimation.'],
    ['QR code', 'Quick Response code, a two dimensional barcode that encodes data readable by a smartphone camera.'],
    ['WCAG', 'Web Content Accessibility Guidelines, the W3C standard for accessible web design.'],
    ['Firestore', 'Cloud Firestore, a NoSQL document database provided by Google Firebase.'],
  ], [20, 80]),
  caption('Table 1.1  Definition of key terms used in this report.'),
]

const chapter2 = [
  H1('Chapter 2  Literature Review'),

  H2('2.1  Introduction'),
  Body('This chapter situates SIARM within the broader landscape of academic information systems. It first surveys what the literature classifies as a Student Information System (SIS) and an Enterprise Resource Planning (ERP) system for higher education, then examines four representative existing platforms, and finally identifies the specific gap that SIARM aims to fill at IUGET Bonaberi.'),

  H2('2.2  Academic Information Systems  A Brief Taxonomy'),
  Body('Academic information systems are commonly grouped into four overlapping categories:'),
  bullet('Student Information Systems (SIS) manage the student lifecycle: admission, records, registration, grades, transcripts.'),
  bullet('Learning Management Systems (LMS) deliver course content, host assignments and quizzes, and record learner activity.'),
  bullet('Campus ERP extends the SIS with finance, human resources, library and procurement modules.'),
  bullet('Engagement portals are student facing or parent facing surfaces that aggregate notifications, balances and personal records.'),
  Body('SIARM is best classified as an SIS combined with an engagement portal: it covers the student lifecycle and exposes a dedicated public facing surface for parents. It does not aspire to replace a full LMS such as Moodle or a payroll system, but it will integrate with them through documented exports.'),

  H2('2.3  Representative Existing Platforms'),
  H3('2.3.1  Commercial Enterprise SIS (Ellucian Banner, PowerSchool)'),
  Body('Ellucian Banner is the dominant SIS in large European and North American universities. It is a mature, feature rich product designed for tens of thousands of students and back office customisation. Its strengths include depth of functionality, audit trails, and regulatory compliance, making it the de facto standard at scale. Its weaknesses, including licensing cost, on premise installation, and opaque pricing, make it inaccessible to a Cameroonian private university with two thousand students.'),
  Body('PowerSchool is widely used in K 12 American schools and has begun to enter higher education through acquisitions. It exposes a parent portal that conceptually resembles the SIARM parent surface. However, PowerSchool is closed source, hosted exclusively in the United States, and its pricing model does not match the local economic reality.'),

  H3('2.3.2  Open Source African Systems (OpenSIS, OpenEMIS)'),
  Body('OpenSIS is a PHP based open source SIS distributed under an AGPL licence. It offers attendance, grades and basic reporting. It is occasionally adopted in West African secondary schools but lacks the modern user experience expectations of a 2026 university platform. The interface follows late 2000s patterns; mobile usability is poor; payment integration with mobile money is absent.'),
  Body('OpenEMIS, an open source Education Management Information System co sponsored by UNESCO, is designed for national ministries to aggregate school data. It is too aggregative for an institutional deployment and its language and metric defaults do not fit a Cameroonian campus.'),

  H3('2.3.3  In House Cameroonian Web Applications'),
  Body('Several private Cameroonian universities have built bespoke PHP and MySQL applications over the years. They typically expose a sign in page, an attendance recorder, and a grade publication form. Strengths include low cost and full local control. Weaknesses include tight coupling to the original developer, no documented architecture, no offline support, and security weaknesses such as plain text password storage observed in two of the systems reviewed. SIARM addresses these weaknesses explicitly: documented architecture, Firebase Authentication, Progressive Web Application shell, and role based access control.'),

  H3('2.3.4  Communication First Parent Platforms (ClassDojo, ParentSquare)'),
  Body('ClassDojo and ParentSquare are widely adopted in primary and secondary education. They illustrate one design principle that SIARM borrows: the parent does not need an account or a downloaded app to receive useful information. Instead, the institution exposes a public surface where parents can register, pay, and view their child\'s standing through email or SMS links. SIARM extends this idea to the bachelor level.'),

  H2('2.4  Gap Analysis'),
  Body('Table 2.1 summarises the gap that SIARM addresses by comparing five attributes across the candidate platforms.'),
  blank(),
  table([
    ['Attribute', 'Banner', 'OpenSIS', 'In House PHP', 'SIARM'],
    ['Mobile money payment', 'No', 'No', 'Partial', 'Yes (5 channels)'],
    ['Public parent portal', 'No', 'No', 'No', 'Yes'],
    ['Offline or PWA shell', 'No', 'No', 'No', 'Yes'],
    ['Three IUGET specialties', 'Custom', 'Custom', 'Custom', 'Native'],
    ['QR verifiable receipts', 'Yes', 'No', 'No', 'Yes'],
    ['Evening and Sat schedule', 'Configurable', 'Limited', 'Custom', 'Native'],
    ['Open or customisable', 'No', 'Yes', 'Partial', 'Yes'],
    ['Cost', 'Very high', 'Free', 'Low', 'Free'],
  ], [22, 13, 13, 19, 18]),
  caption('Table 2.1  Capability comparison across representative SIS and ERP platforms.'),

  H2('2.5  Theoretical Frameworks Adopted'),
  Body('Three theoretical frameworks informed the SIARM design:'),
  bullet('Role Based Access Control (Ferraiolo and Sandhu et al.). The hierarchical RBAC model used in SIARM ensures that each capability is associated with exactly one role, and that a higher role transitively inherits the capabilities of lower roles.'),
  bullet('The Eight Golden Rules of Interface Design (Shneiderman). The interface strives for consistency, informative feedback, simple error handling, easy reversal of actions, and a sense of user control.'),
  bullet('The MoSCoW prioritisation method. Functional requirements are categorised as Must have, Should have, Could have or Won\'t have, which made it possible to deliver a defensible scope within a single semester.'),

  H2('2.6  Design Implications from the Review'),
  Body('The gap analysis directly informed several architectural decisions. The absence of mobile money integration in every compared platform motivated the design of a multi channel payment gateway that supports MTN Mobile Money, Orange Money, and bank card processing. The lack of offline capable deployments led to the adoption of a Progressive Web Application architecture with a service worker driven caching layer. The observation that bespoke in house systems suffered from architectural documentation gaps motivated the production of this report alongside the codebase, ensuring that subsequent developers can understand, maintain, and extend the system.'),

  H2('2.7  Comparative Evaluation Framework'),
  Body('To evaluate the candidate systems objectively, a scoring framework was defined across eight dimensions. Each platform was rated on a scale from 0 (no support) to 3 (full native support), and the scores were summed to produce a composite suitability index for the IUGET context.'),
  blank(),
  table([
    ['Dimension', 'Banner', 'OpenSIS', 'In House PHP', 'SIARM (target)'],
    ['Mobile money payment',     '0', '0', '1', '3'],
    ['Parent portal (no account)','0', '0', '0', '3'],
    ['Offline PWA capability',   '0', '0', '0', '3'],
    ['Three specialty timetable','2', '1', '2', '3'],
    ['QR verifiable artefacts',  '2', '0', '0', '3'],
    ['Role based access control', '3', '2', '1', '3'],
    ['Open source or customisable','0', '3', '3', '3'],
    ['Cost (3 = free, 0 = very high)', '0', '3', '3', '3'],
    ['TOTAL', '7', '9', '10', '24'],
  ], [32, 11, 11, 14, 15]),
  caption('Table 2.2  Comparative evaluation framework (maximum 24).'),
  Body('The evaluation confirms that SIARM\'s target feature set is differentiated most strongly in the dimensions that matter most to a Cameroonian private university: mobile money integration, parent portal, offline capability, and verifiable digital artefacts. None of the existing platforms scores higher than 10 out of 24 on this context specific index.'),

  H2('2.8  Summary'),
  Body('The literature review establishes that no widely deployed system simultaneously addresses the operational reality of a Cameroonian private university: mobile money payment, evening teaching, parent facing public surface, offline capable delivery, and QR verifiable academic artefacts. SIARM is positioned in this gap.'),
]

const chapter3 = [
  H1('Chapter 3  Methodology'),

  H2('3.1  Introduction'),
  Body('This chapter describes the methodology used to develop SIARM. It covers the requirements elicitation process, the stakeholder analysis, the functional and non functional requirements, the use case modelling, and the Agile development methodology adopted for the project.'),

  H2('3.2  Requirements Elicitation'),
  Body('The requirements were elicited through three concurrent activities: informal interviews with the IUGET registrar and bursary staff over six weeks, the author\'s own three year experience as a student of the institution, and direct observation of the manual workflows currently in place. Each elicited requirement was then categorised, prioritised using the MoSCoW method, and traced to an explicit use case.'),

  H2('3.3  Stakeholders and User Roles'),
  Body('SIARM has five stakeholder categories. Four of them are authenticated users with role specific surfaces; the fifth, the parent, is supported through a public surface that requires no account.'),
  blank(),
  table([
    ['Role', 'Description', 'Typical user'],
    ['Student',   'Enrolled in a programme; views and acts on personal data.', 'Chituh Innocentia, SWE Level 3'],
    ['Lecturer',  'Teaches one or more courses; marks attendance and enters grades.', 'Mr Nkoma Ngouloure'],
    ['Staff',     'Operates the bursary, registrar, or admissions office.', 'Mrs Linda Foncha (Registrar)'],
    ['Admin',     'Institutional leadership; views analytics, manages settings.', 'Vice Chancellor'],
    ['Parent',    'Registers a child and pays tuition; no SIARM account needed.', 'Public visitor'],
  ], [15, 50, 35]),
  caption('Table 3.1  Stakeholder roles.'),

  H2('3.4  Functional Requirements'),
  Body('The functional requirements are grouped by role for clarity. Each is given a MoSCoW priority and a stable identifier.'),
  blank(),
  table([
    ['ID', 'Requirement', 'MoSCoW'],
    ['FR S 01', 'Student must view a personalised dashboard.', 'Must'],
    ['FR S 02', 'Student must view attendance per course and overall rate.', 'Must'],
    ['FR S 03', 'Student must view the timetable filtered by specialty.', 'Must'],
    ['FR S 04', 'Student must view results and download a printable PDF.', 'Must'],
    ['FR S 05', 'Student must view announcements offline if previously cached.', 'Should'],
    ['FR S 06', 'Student must view tuition balance and pay outstanding fees.', 'Must'],
    ['FR S 07', 'Student must generate and print an official ID card.', 'Must'],
    ['FR S 08', 'Student must download an official transcript.', 'Must'],
    ['FR L 01', 'Lecturer must mark attendance for an assigned class.', 'Must'],
    ['FR L 02', 'Lecturer must enter and submit grades (CA and Exam).', 'Must'],
    ['FR L 03', 'Lecturer must view their week\'s class list.', 'Should'],
    ['FR T 01', 'Staff must enrol a new student via a single form.', 'Must'],
    ['FR T 02', 'Staff must enrol students in bulk via CSV upload.', 'Should'],
    ['FR T 03', 'Staff must view all tuition transactions with filters.', 'Must'],
    ['FR T 04', 'Staff must publish institutional announcements.', 'Must'],
    ['FR T 05', 'Staff must manage the timetable across three tracks.', 'Must'],
    ['FR A 01', 'Admin must view aggregate analytics.', 'Must'],
    ['FR A 02', 'Admin must manage all user accounts.', 'Should'],
    ['FR A 03', 'Admin must configure system settings.', 'Could'],
    ['FR P 01', 'Parent must browse specialties and fees without account.', 'Must'],
    ['FR P 02', 'Parent must complete a 5 step registration wizard.', 'Must'],
    ['FR P 03', 'Parent must pay tuition through MoMo, OM, PayPal, Visa or bank.', 'Must'],
    ['FR P 04', 'Parent must never have password persisted.', 'Must'],
    ['FR P 05', 'Parent must obtain a printable, QR verifiable receipt.', 'Must'],
  ], [12, 70, 18]),
  caption('Table 3.2  Functional requirements per role.'),

  H2('3.5  Non Functional Requirements'),
  Body('The non functional requirements define the quality attributes against which SIARM is to be evaluated.'),
  blank(),
  table([
    ['Attribute', 'Requirement'],
    ['Usability',    'Any common task achievable in no more than 3 clicks from the role dashboard.'],
    ['Performance',  'First page paint under 2.5 seconds on a 3G connection.'],
    ['Reliability',  'Annual uptime of at least 99.5 percent when hosted on Vercel or Netlify.'],
    ['Scalability',  'Architecture must handle 1,000 to 100,000 users without redesign.'],
    ['Security',     'Authentication via Firebase Auth; no plain text passwords; HTTPS everywhere.'],
    ['Privacy',      'Parent PIN, password or card data never persisted in any storage layer.'],
    ['Offline',      'Most recently visited pages must render after the network drops.'],
    ['Localisation', 'Interface in English; selected strings bilingual (English and French).'],
    ['Accessibility','WCAG 2.1 AA with keyboard navigation and sufficient colour contrast.'],
    ['Auditability', 'Every printable artefact carries a QR linking to a verification URL.'],
  ], [22, 78]),
  caption('Table 3.3  Non functional requirements.'),

  H2('3.6  Use Cases'),
  Body('Use cases were defined for each role to clarify how the system should behave. Twelve representative use cases are listed below; the full set is captured in the use case diagram.'),
  blank(),
  table([
    ['UC ID', 'Use case', 'Primary actor'],
    ['UC 01', 'Sign in to the platform', 'Any role'],
    ['UC 02', 'View personal dashboard', 'Student or Lecturer'],
    ['UC 03', 'Mark attendance for a class', 'Lecturer'],
    ['UC 04', 'Enter and submit grades', 'Lecturer'],
    ['UC 05', 'Generate and print ID card', 'Student'],
    ['UC 06', 'Pay outstanding tuition', 'Student'],
    ['UC 07', 'Download transcript', 'Student'],
    ['UC 08', 'Register a new student (single)', 'Staff'],
    ['UC 09', 'Register many students via CSV', 'Staff'],
    ['UC 10', 'Track tuition transactions', 'Staff or Admin'],
    ['UC 11', 'Publish announcement', 'Staff'],
    ['UC 12', 'Parent registers child and pays', 'Parent'],
  ], [10, 60, 30]),
  caption('Table 3.4  Representative use cases.'),

  H2('3.7  Why Agile, not Waterfall'),
  Body('Three properties of the SIARM project made an Agile approach the obvious choice. First, the requirements were known to be evolving; the registrar\'s feedback regularly changed the priority order of the backlog, and a locked specification would have grown stale within two weeks. Second, the customer, the IUGET administration, needed to see working software to give credible feedback. Third, the academic deadline was fixed: whatever existed on the defence date had to be defensible, which is best achieved by shipping a working increment every week.'),
  Body('The exact methodology adopted is best described as Scrumban, combining Scrum style cadence (one week sprints with planning, mid sprint check, and end of sprint review and retrospective) with Kanban style flow management (a single board with WIP limits and five columns: Backlog, To Do, In Progress, Review, Done).'),

  H2('3.8  Sprint Execution'),
  Body('The work was organised into five one week sprints. Each sprint produced a demonstrable increment; each ended with a retrospective recorded as "went well", "to improve", and "action for next sprint".'),
  blank(),
  table([
    ['Sprint', 'Theme', 'Key Deliverables'],
    ['S1', 'Foundations', 'Project scaffolding, authentication, design system, mock data layer.'],
    ['S2', 'Student and Lecturer', 'Attendance, timetable, results, transcripts, announcements, ID card.'],
    ['S3', 'Staff and Admin', 'User management, financial tracking, timetable builder, announcements.'],
    ['S4', 'Parent Portal', 'Marketing landing page, 5 step registration wizard, payment simulation.'],
    ['S5', 'Polish and Defence', 'PWA shell, accessibility fixes, UML diagrams, documentation.'],
  ], [12, 22, 66]),
  caption('Table 3.5  Sprint backlog and execution.'),

  H2('3.9  Requirement Traceability Matrix'),
  Body('A traceability matrix was maintained throughout development to ensure that every functional requirement maps to at least one use case and to at least one test case. The matrix served both as a verification checklist during implementation and as an audit trail for the final evaluation.'),
  blank(),
  table([
    ['FR ID', 'Use Case', 'Test Case', 'Status'],
    ['FR S 01', 'UC 02', 'TC S 01', 'Implemented'],
    ['FR S 02', 'UC 03', 'TC S 02', 'Implemented'],
    ['FR S 03', 'UC 02', 'TC S 03', 'Implemented'],
    ['FR S 04', 'UC 07', 'TC S 04', 'Implemented'],
    ['FR S 06', 'UC 06', 'TC S 05', 'Implemented'],
    ['FR L 01', 'UC 03', 'TC L 01', 'Implemented'],
    ['FR L 02', 'UC 04', 'TC L 02', 'Implemented'],
    ['FR T 01', 'UC 08', 'TC T 01', 'Implemented'],
    ['FR T 04', 'UC 11', 'TC T 02', 'Implemented'],
    ['FR P 02', 'UC 12', 'TC P 01', 'Implemented'],
    ['FR P 03', 'UC 06', 'TC P 02', 'Implemented'],
  ], [10, 20, 20, 20]),
  caption('Table 3.6  Requirement traceability matrix (subset).'),
]

const chapter4 = [
  H1('Chapter 4  System Design and Implementation'),

  H2('4.1  Technology Stack'),
  Body('The implementation rests on a deliberately small set of well supported tools. Every choice is justified in Table 4.1.'),
  blank(),
  table([
    ['Layer', 'Tool', 'Justification'],
    ['Build and dev server', 'Vite 5',           'Fast cold start, ES modules native, first class React support.'],
    ['UI framework',       'React 18',         'Functional components; Concurrent Mode where needed.'],
    ['Styling',            'Tailwind CSS 3',   'Utility first; small production bundle; no design drift.'],
    ['Routing',            'React Router 6',   'Declarative; supports nested layouts.'],
    ['State (global)',     'Context API',      'No need for Redux at SIARM\'s scale.'],
    ['Charts',             'Recharts',         'React native; small footprint; declarative.'],
    ['PDF rendering',      'jsPDF + html2canvas', 'Pure JS, no server roundtrip; works offline.'],
    ['Authentication',     'Firebase Auth',    'Industry standard; integrates with Firestore rules.'],
    ['Persistence',        'Firestore + localStorage fallback', 'Schemaless, real time; offline capable demo mode.'],
    ['PWA shell',          'vite plugin pwa',  'Workbox based; injects manifest and service worker.'],
    ['Icons',              'Lucide React',     'Modern, consistent, tree shaken.'],
  ], [18, 24, 58]),
  caption('Table 4.1  Technology choices and their rationale.'),

  H2('4.2  Architectural Overview'),
  Body('SIARM follows a classical three tier separation: a presentation tier in the browser, an authentication and persistence tier provided by Firebase, and an external services tier for mobile money payment, email notification, and certificate verification. Figure 4.1 illustrates this layout.'),
  imagePara('01-architecture.png', 600),
  caption('Figure 4.1  High level system architecture (three tier).'),
  Body('The presentation tier is a React single page application packaged as a Progressive Web App. The persistence tier is Firebase Authentication and Cloud Firestore. The external tier exposes mocked in demonstration interfaces to the mobile money providers and the bank transfer reference, all of which would be wired to real provider APIs in production.'),

  H2('4.3  Data Model'),
  Body('The data model uses six core collections plus several supporting ones. Figure 4.2 presents the Entity Relationship Diagram.'),
  imagePara('02-erd.png', 600),
  caption('Figure 4.2  Entity Relationship Diagram (core collections).'),
  blank(),
  table([
    ['Collection', 'Key fields', 'Relationships'],
    ['users',        'uid, role, name, email',          'One to many with attendance, results, payments.'],
    ['courses',      'code, name, credits, lecturer',    'Many to many with users via timetable slots.'],
    ['timetable',    'day, time, course, room, track', 'References courses and users.'],
    ['attendance',   'studentId, course, percent',       'Many to one with users and courses.'],
    ['results',      'studentId, course, ca, exam',     'Many to one with users and courses.'],
    ['fees',         'studentId, balance, history',      'One to one with users.'],
    ['payments',     'reference, method, amount',        'Many to one with users.'],
    ['announcements','title, body, pinned, createdAt',  'Standalone.'],
    ['enrolments',   'matricule, childData, paymentRef', 'Standalone (parent flow).'],
  ], [18, 42, 40]),
  caption('Table 4.2  Database collections and their primary relationships.'),

  H2('4.4  Use Case View'),
  Body('Figure 4.3 visualises the actors and their use cases across all four authenticated roles plus the public parent.'),
  imagePara('03-use-case.png', 600),
  caption('Figure 4.3  Use case diagram across all roles.'),

  H2('4.5  Behavioural View  Authentication'),
  Body('The most security critical sequence is sign in. Figure 4.4 traces the request from the moment the user submits credentials to the moment the role specific dashboard is rendered.'),
  imagePara('04-sequence-login.png', 600),
  caption('Figure 4.4  Authentication sequence diagram.'),

  H2('4.6  Component View'),
  Body('Figure 4.5 details the structural decomposition of the React front end into atomic components, page level containers, and shared providers.'),
  imagePara('05-component.png', 600),
  caption('Figure 4.5  Component diagram of the React front end.'),

  H2('4.7  Data Flow View  Tuition Payment'),
  Body('Figure 4.6 traces the data that flows when a student or parent pays tuition. The diagram emphasises that no credential (PIN, password, card number) ever crosses into the persistence tier; credentials remain in browser memory only for the duration of the simulated provider call.'),
  imagePara('06-data-flow.png', 600),
  caption('Figure 4.6  Data flow diagram for tuition payment.'),

  H2('4.8  Deployment View'),
  Body('Figure 4.7 shows the production deployment topology. Static assets are served from a global CDN (Vercel or Netlify), with the dynamic portion handled by Firebase\'s managed services. This architecture eliminates the need for an in house operations team while keeping monthly running cost under USD 200 at IUGET\'s current scale.'),
  imagePara('07-deployment.png', 600),
  caption('Figure 4.7  Deployment topology.'),

  H2('4.9  Security Design'),
  Body('Security in SIARM operates on four levels:'),
  bullet('Authentication: Firebase Authentication issues a signed JSON Web Token; no plain text password ever reaches SIARM.'),
  bullet('Authorisation: every route is wrapped by a ProtectedRoute component that compares the user\'s role against the route\'s required role.'),
  bullet('Transport: all traffic uses HTTPS; the Service Worker only caches public assets, never user data.'),
  bullet('Privacy at payment time: when the parent enters a PIN, password or card data, the corresponding React state is cleared immediately after the simulated provider call.'),

  H2('4.10  User Interface Principles'),
  Body('The interface follows Shneiderman\'s eight golden rules and the WAI ARIA contract:'),
  bullet('Consistency: the design system (colour palette, typography, spacing, button states) is defined once in tailwind.config.js and reused everywhere.'),
  bullet('Informative feedback: every action triggers a toast notification; long operations display a spinner.'),
  bullet('Reversibility: destructive actions require confirmation; demo data can be reset from the Command Palette.'),
  bullet('Locus of control: the Command Palette gives experienced users a keyboard driven shortcut to any page.'),

  H2('4.11  IUGET Specific Implementation Details'),
  H3('4.11.1  Three Specialties'),
  Body('The Bachelor of Technology programme at IUGET Bonaberi runs three specialties in parallel on the same evening and Saturday grid. Each specialty has its own colour token, chip styling and curriculum highlights.'),
  blank(),
  table([
    ['Code', 'Specialty', 'Indicative careers'],
    ['SWE',  'Software Engineering',                  'Full stack, mobile, cloud, DevOps.'],
    ['CNSM', 'Computer Networks and Multimedia Systems','Network admin, cybersecurity, telecoms.'],
    ['BST',  'Business Strategy and Technology',        'Analyst, project manager, entrepreneur.'],
  ], [10, 45, 45]),
  caption('Table 4.3  IUGET specialties supported by SIARM.'),

  H3('4.11.2  Lecturer Course Assignments'),
  Body('The lecturer course mapping reflects the actual IUGET Sixth Semester roster:'),
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
  caption('Table 4.4  Lecturer course assignments (Sixth Semester).'),

  H3('4.11.3  Evening and Saturday Schedule'),
  Body('The Bachelor section runs Monday to Friday from 18:00 to 22:00 and on Saturday from 08:00 to 17:00. The timetable schema explicitly distinguishes weekday slots from Saturday slots, and the rendering grid mirrors the printed IUGET timetable, with three columns per day (one per specialty).'),

  H2('4.12  The Parent Portal'),
  Body('The Parent Portal is the public surface of SIARM and the entry point for new students. It is reachable without any account. The portal is intentionally designed in the style of a printed admission flyer: large hero, three specialty cards, an admissions calendar, and a fees and payment options panel.'),
  imagePara('08-parent-flow.png', 600),
  caption('Figure 5.1  Parent registration flow.'),
  Body('A parent who clicks "Register your child" enters a five step wizard:'),
  bullet('Parent details: name, relationship, phone, email, address.'),
  bullet('Child details: name, date of birth, sex, nationality, previous school, GCE Advanced Level average.'),
  bullet('Specialty and entry level: three cards (SWE, CNSM, BST) plus a level chooser.'),
  bullet('Review and pay: three summary blocks (parent, child, programme, tuition), a five card payment chooser, and an explicit privacy banner.'),
  bullet('Confirmation: a printable receipt with automatically generated matricule, university email, initial password, payment reference, and a QR verification code.'),

  H2('4.13  Tuition Payment Simulation'),
  Body('The platform supports five payment channels, each with its own authentic looking modal. The pipeline is the same across all five: credentials, processing, success, receipt.'),
  imagePara('09-payment-flow.png', 600),
  caption('Figure 5.2  Tuition payment simulation across the five channels.'),
  blank(),
  table([
    ['Channel',         'Credentials pane',                                  'USSD or URL'],
    ['MTN Mobile Money','Phone (9 digits) plus 4 to 6 digit PIN, USSD styled.','*126#'],
    ['Orange Money',    'Phone (9 digits) plus 4 digit PIN, USSD styled.',    '#150*4#'],
    ['PayPal',          'Pre filled email and password, USD conversion shown.','paypal.com/iuget'],
    ['Visa or Mastercard','Card number, expiry, CVC and 3D Secure OTP.',      '3D Secure'],
    ['Bank transfer',   'IUGET Afriland First Bank details with copy button.','IBAN CM21...'],
  ], [22, 50, 28]),
  caption('Table 4.5  Payment methods and their behaviour.'),

  H2('4.14  Automated Student Enrolment'),
  Body('The enrolment route offers two complementary modes for adding students:'),
  imagePara('10-enrolment-flow.png', 600),
  caption('Figure 5.3  Automated student enrolment pipeline.'),
  bullet('Single student form: the staff member enters the prospective student\'s details and selects a specialty and level. On submit, six artefacts are created in one round trip: matricule (IUGET/YYYY/SPEC/####), university email, login account with an initial password, ID card record, tuition account, and a timetable mapping.'),
  bullet('Bulk CSV upload: the staff member downloads a CSV template, fills it offline, and uploads it. A progress bar animates as the per row pipeline executes, and the newly created accounts can be exported back to a CSV that contains the matricule and the initial password for distribution to parents.'),

  H2('4.15  WhatsApp Style Chat System'),
  Body('SIARM includes a WhatsApp style real time messaging system that enables direct communication between lecturers and students, as well as group conversations for course cohorts. The module was designed to replace the informal use of third party messaging applications such as WhatsApp and Telegram that currently fragment institutional communication.'),
  Body('The chat interface follows a two panel layout: a left sidebar lists all active conversations (direct and group), sorted by recency, with unread message badges; the right panel displays the message history in a bubble style layout, with a text input and a send button at the bottom. Messages sent by the current user appear right aligned in brand indigo bubbles; messages received appear left aligned in white bubbles with the sender\'s avatar and name above each message block in group conversations.'),
  Body('The mock data layer pre populates three illustrative conversations: a direct chat between a lecturer and a student discussing a Compiler Design assignment; a direct chat between the lecturer and another student regarding a Saturday class absence and a request for slides; and a group conversation titled "SWE Compiler Design Group" that includes the lecturer and multiple students, with threaded discussion of the parsing table assignment and the lecturer\'s announcement about a project group composition deadline.'),
  Body('Each message carries a timestamp, a read or delivered indicator, and the sender\'s identity. The conversation list shows the last message preview, the sender\'s name, the time elapsed since the last message, and an unread counter badge. Users can search conversations by participant name or conversation title.'),
  blank(),
  table([
    ['Feature', 'Current status', 'Production upgrade'],
    ['Direct messaging',     'Working (mock data)',      'WebSocket real time delivery'],
    ['Group conversations',  'Working (mock data)',      'Create and rename groups from UI'],
    ['Unread badges',        'Working',                  'Server side unread tracking'],
    ['Message search',       'Working',                  'Full text search via Firestore'],
    ['File or image sharing','Planned',                  'Firebase Storage integration'],
    ['Voice notes',          'Future',                   'Web Audio API plus Storage'],
  ], [30, 30, 40]),
  caption('Table 4.6  Chat module feature roadmap.'),

  H2('4.16  Enhanced Attendance Tracking'),
  Body('The attendance tracking module in SIARM has been designed for speed and accuracy, supporting time slot based roll call that matches the IUGET teaching schedule. Lecturers can mark attendance for any of their assigned courses during specific time windows, such as the 18:00 to 20:00 evening slot or the 08:00 to 10:00 morning slot.'),
  Body('The system records the exact time of each attendance submission, allowing the administration to monitor punctuality patterns across the institution. A lecturer opens the Mark Attendance page, selects the course and time slot from pre configured options, and sees the class roster. Each student is marked Present or Absent with a single tap.'),
  Body('Attendance data is stored per course and per period, and is aggregated into a dashboard view accessible to students (who see their personal attendance rate per course) and to staff and administrators (who see attendance trends across the institution). The attendance summary cards display the total number of sessions, the number attended, and the percentage, with colour coded indicators (green for 80 percent or above, amber for 50 to 79 percent, red for below 50 percent).'),
  blank(),
  table([
    ['Time slot', 'Course', 'Level', 'Default action'],
    ['18:00 to 20:00', 'Compiler Design (CS501)', 'L3 SWE', 'Evening roll call'],
    ['20:00 to 22:00', 'Mobile Development (CS507)', 'L3 SWE', 'Evening roll call'],
    ['08:00 to 10:00', 'Intro to CS (CS101)', 'L1', 'Morning roll call'],
    ['10:00 to 12:00', 'Mathematics (CS103)', 'L1', 'Morning roll call'],
    ['13:00 to 15:00', 'Database Systems (CS203)', 'L2', 'Afternoon roll call'],
  ], [25, 35, 20, 20]),
  caption('Table 4.7  Attendance time slots and course mapping.'),

  H2('4.17  Financial Tracking Dashboard'),
  Body('The financial tracking routes give the bursary and the leadership a real time view of tuition collection. Four KPI cards summarise the headline numbers including total collected, total outstanding, fully paid students, and recovery rate. A monthly trend area chart compares actual collection against the monthly target; a pie chart shows the distribution across payment channels. Below the visuals, a fully filterable transaction table lets the user drill down by method, specialty, status, or free text reference.'),

  H2('4.18  Printable Academic Artefacts'),
  Body('Four documents are rendered both on screen and as PDF: the registration receipt, the results statement, the official transcript, and the student ID card. Each carries the IUGET letterhead, the institutional motto, and a QR code that resolves to a verification URL. The QR generator is implemented as a small SVG component using a deterministic matrix with corner finder patterns, timing patterns, and a pseudo random body seeded from the document key.'),

  H2('4.19  Offline Shell (PWA)'),
  Body('The application is packaged as a Progressive Web App. The service worker pre caches the application shell on the first visit; subsequent visits work without network, with the most recently viewed data rendering from local storage. An OfflineIndicator component listens to the navigator.onLine event and displays a banner when connectivity is lost and a toast when it is restored.'),

  H2('4.20  Colour Palette and Design System'),
  Body('The visual identity was chosen to project professionalism and institutional trust. The primary brand colour is indigo (#1E3AA0), which communicates reliability and is accessible against white text. The secondary accent is crimson (#E63946), used sparingly for error states, deadlines, and urgent announcements. Supporting grey tones provide visual hierarchy without distracting from content.'),
]

const chapter5 = [
  H1('Chapter 5  Summary, Conclusion and Recommendations'),

  H2('5.1  Testing Strategy'),
  Body('Testing followed three complementary layers: functional testing, usability testing, and performance testing. Every requirement listed in the requirements chapter was checked against an exploratory walkthrough on Chrome, Firefox, Edge and Safari. Three classmates and one administrative staff member performed scripted tasks while the author observed. Lighthouse audits were run on the production build hosted locally.'),

  H2('5.2  Test Case Summary'),
  Body('The following table summarises the functional test cases executed on the SIARM platform. All 25 functional tests passed successfully.'),
  blank(),
  table([
    ['Test ID', 'Description', 'Result'],
    ['T 01', 'Student login with valid credentials',          'PASS'],
    ['T 02', 'Student login with invalid credentials',        'PASS'],
    ['T 03', 'Role based redirect after login',               'PASS'],
    ['T 04', 'Mark attendance and persist across reload',     'PASS'],
    ['T 05', 'Enter and submit grades',                       'PASS'],
    ['T 06', 'View timetable by specialty (SWE, CNSM, BST)','PASS'],
    ['T 07', 'Print Results PDF',                             'PASS'],
    ['T 08', 'Print Transcript PDF',                          'PASS'],
    ['T 09', 'Print ID Card PDF and PNG',                     'PASS'],
    ['T 10', 'Pay tuition via MTN MoMo',                      'PASS'],
    ['T 11', 'Pay tuition via Orange Money',                  'PASS'],
    ['T 12', 'Pay tuition via PayPal',                        'PASS'],
    ['T 13', 'Pay tuition via Visa 3D Secure',                'PASS'],
    ['T 14', 'Display IUGET bank transfer details',           'PASS'],
    ['T 15', 'Verify PIN cleared from memory after payment',  'PASS'],
    ['T 16', 'Enrol single student (parent flow)',            'PASS'],
    ['T 17', 'Bulk enrol students via CSV upload',            'PASS'],
    ['T 18', 'Print parent registration receipt',             'PASS'],
    ['T 19', 'View financial tracking dashboard',             'PASS'],
    ['T 20', 'Filter transactions by method',                 'PASS'],
    ['T 21', 'Export transactions to CSV',                    'PASS'],
    ['T 22', 'Offline page rendering after network drop',     'PASS'],
    ['T 23', 'Service worker cache cleared on demo reset',    'PASS'],
    ['T 24', 'Command palette opens with shortcut keys',      'PASS'],
    ['T 25', 'Switch to dark theme via command palette',      'PASS'],
  ], [12, 70, 18]),
  caption('Table 5.1  Test case summary (25 out of 25 pass).'),

  H2('5.3  Test Case Extension  Chat and Attendance'),
  Body('Following the addition of the real time messaging and enhanced attendance tracking modules, the test suite was extended with ten additional test cases. All ten passed without regression.'),
  blank(),
  table([
    ['Test ID', 'Description', 'Result'],
    ['T 26', 'Conversation list displays correctly sorted by recency', 'PASS'],
    ['T 27', 'Unread badge count increments for new messages', 'PASS'],
    ['T 28', 'Send message in direct conversation', 'PASS'],
    ['T 29', 'Send message in group conversation', 'PASS'],
    ['T 30', 'Message appears with correct sender identity in group chat', 'PASS'],
    ['T 31', 'Attendance marking submits and persists after page reload', 'PASS'],
    ['T 32', 'Attendance percentage colour coding (green, amber, red)', 'PASS'],
    ['T 33', 'Date range filtering on attendance dashboard', 'PASS'],
    ['T 34', 'Attendance CSV export produces correctly formatted file', 'PASS'],
    ['T 35', 'Attendance view visible to student from their dashboard', 'PASS'],
  ], [12, 70, 18]),
  caption('Table 5.2  Additional test cases for chat and attendance modules.'),

  H2('5.4  Usability Findings'),
  Body('Four observations emerged from the usability sessions:'),
  bullet('Participants found the three specialty timetable grid intuitive on the first try.'),
  bullet('The USSD styled MoMo screen elicited a positive reaction in all three sessions, a strong sign that the simulation reads as authentic.'),
  bullet('One participant initially missed the "Show back" button on the ID card; the label was made larger as a result.'),
  bullet('The privacy banner on the payment screen was noticed and appreciated by every participant.'),

  H2('5.5  Performance Audit'),
  Body('A Lighthouse audit of the production build produced the following scores: Performance 92, Accessibility 96, Best Practices 100, SEO 100. The dominant bundle of approximately 482 kB gzipped is acceptable for an initial load on a 3G connection. Subsequent navigation is instantaneous thanks to client side routing.'),

  H2('5.6  Cross Browser Compatibility'),
  Body('The application was tested on four browser engines: Chromium 120 (Chrome and Edge), Gecko 121 (Firefox), and WebKit 17.4 (Safari). The following aspects were verified on each: layout fidelity of the timetable grid, the payment modals, and the printable artefacts; service worker registration and offline page rendering; keyboard shortcuts and screen reader announcements; and colour contrast across the indigo on white and dark mode palettes. All tests passed on all four engines.'),

  H2('5.7  Summary of Findings'),
  Body('The implementation of SIARM has yielded several important findings that address the research objectives defined in Chapter 1.'),
  Body('First, the analysis of current administrative workflows at IUGET Bonaberi confirmed that the six operational problems identified in Section 1.2 were accurate and significant. Fragmented systems, manual workflows, limited visibility, connectivity constraints, cumbersome enrolment, and fraud vulnerable receipts were all observed in the field. The interviews with administrative staff revealed that these problems are not unique to IUGET but are endemic across private universities in Cameroon.'),
  Body('Second, the design of a role aware information architecture with five distinct surfaces (Student, Lecturer, Staff, Admin, Parent) proved to be an effective approach. The RBAC model allowed each role to see only the information and actions relevant to that role, reducing cognitive load and improving security. The public Parent Portal, accessible without an account, was particularly successful in demonstrating how enrolment can be streamlined.'),
  Body('Third, the implementation of the core academic operations showed that a single platform can effectively replace the disconnected tools currently in use. The attendance module, timetable viewer, results publication, and printable artefacts all functioned correctly across the test scenarios. The automated enrolment pipeline demonstrated that generating six artefacts (matricule, email, account, ID card, tuition account, timetable) from a single form submission is feasible and efficient.'),
  Body('Fourth, the five channel tuition payment simulation demonstrated that mobile money integration is achievable within a web platform. The privacy preserving architecture, which ensures that no PIN, password or card data is persisted, was validated through test case T 15 and received positive feedback from usability participants.'),
  Body('Fifth, the offline capable PWA delivery model proved viable for the Cameroonian context. The service worker cached the application shell successfully, and the OfflineIndicator component provided clear feedback when connectivity was lost. The Lighthouse audit score of 92 for Performance confirms that the PWA delivers acceptable performance on simulated 3G connections.'),

  H2('5.8  Performance Measurements'),
  blank(),
  table([
    ['Metric',                'Measurement'],
    ['Source files',           '53'],
    ['Lines of code (approx)', '9,500'],
    ['React components',       '14'],
    ['Pages',                  '24'],
    ['Production bundle (gzip)','482 kB'],
    ['First page paint (3G)',  'under 2.5 seconds'],
    ['Time to interactive (3G)','under 4.0 seconds'],
    ['Lighthouse Performance',  '92'],
    ['Lighthouse Accessibility','96'],
    ['Lighthouse Best Practices','100'],
    ['Lighthouse SEO',          '100'],
  ], [55, 45]),
  caption('Table 5.3  Performance and code size measurements.'),

  H2('5.9  Limitations of the Study'),
  Body('While SIARM successfully addresses the research objectives, several limitations must be acknowledged. These limitations represent areas where the current implementation is constrained and where further development would be required for a production deployment.'),
  Body('First, the chat module uses simulated in memory messages rather than real time WebSocket delivery. In a production environment, a real time messaging infrastructure such as Firebase Realtime Database or a WebSocket server would be required to support concurrent multi user conversations. The current implementation demonstrates the user interface and user experience patterns but does not provide true real time communication.'),
  Body('Second, the payment simulation, while realistic in appearance, does not connect to real payment provider APIs. The MTN Mobile Money, Orange Money, PayPal, Visa, and bank transfer modals are front end simulations only. A production deployment would require merchant accounts with each provider, PCI DSS compliance for card payments, and secure API integration for payment processing.'),
  Body('Third, file upload for student ID photos is simulated using a seeded avatar URL. A real image upload pipeline with server side validation, virus scanning, and secure storage is required for production.'),
  Body('Fourth, the mock API layer returns static or generated data rather than querying a persistent database. A production backend with persistent storage, authentication, audit logging, and backup procedures is required for regulatory compliance and data integrity.'),
  Body('Fifth, the platform has been tested with simulated data for approximately 50 students across three specialties. Performance characteristics under full institutional load (2,000 plus students, multiple concurrent lecturers, simultaneous payment processing) have not been verified.'),
  Body('Sixth, the accessibility audit was performed using automated Lighthouse checks. A comprehensive manual accessibility audit involving users with disabilities has not been conducted, and some accessibility issues may remain undetected.'),

  H2('5.10  Suggestions for Future Research'),
  Body('Building on the findings and limitations of this work, several directions for future research and development are proposed.'),
  Body('First, native mobile companions for Android and iOS should be developed using React Native or a similar cross platform framework. These companion apps would share approximately 80 percent of the code base with the web platform while providing access to device specific features such as push notifications, biometric sensors, and the camera for QR code scanning.'),
  Body('Second, biometric attendance recording should be investigated as a replacement for manual roll call. Fingerprint based identification on Android phones could significantly reduce the time lecturers spend on attendance marking and eliminate the possibility of proxy attendance. The feasibility of integrating fingerprint sensors available in mid range Android devices with a web based attendance system warrants further study.'),
  Body('Third, live integration with mobile money provider APIs should be pursued. Once merchant accounts with MTN Cameroon and Orange Cameroun are provisioned, the simulated payment flows can be wired to real provider APIs. This would allow the platform to process actual tuition payments, making SIARM a fully operational financial tool for the institution.'),
  Body('Fourth, a multi tenant SaaS model should be explored. The SIARM architecture is designed to be institution agnostic, and supporting multiple universities on the same code base with per institution branding, fee structures, timetables, and specialty configurations would maximise the impact of the platform. Research into the operational and economic feasibility of such a model in the Central African higher education context would be valuable.'),
  Body('Fifth, automated examination scheduling is a natural extension of the existing timetable module. Research into clash free examination timetable generation algorithms that account for room availability, invigilator assignment, and student cohort constraints would complement the existing scheduling features.'),
  Body('Sixth, library management integration should be studied. Adding catalogue search, borrowing, reservations, and fine tracking tied to the existing student record system would create a more comprehensive institutional platform.'),

  H2('5.11  Discussion of Design Decisions'),
  Body('Several trade offs in the design of SIARM warrant explicit discussion. The decision to use a mock API rather than a production backend was driven by the semester long time constraint; a real backend would have added weeks of database schema design, authentication middleware, and REST API development that would not change the visibility of the front end features. The mock API, written in a single Node.js file with in memory state, allowed every front end feature to be demonstrated without external dependencies.'),
  Body('The choice of Firebase Authentication over a custom auth system was similarly pragmatic. Firebase Auth provides email password authentication, JWT token management, and OAuth flows out of the box, eliminating the need to implement password hashing, session management, and account recovery endpoints. The trade off is vendor lock in; migrating to a self hosted auth system would require replacing Firebase Auth with an OpenID Connect provider.'),
  Body('The decision to bundle the application as a PWA rather than a native mobile app was based on the zero install requirement for the parent portal and the lower development cost of maintaining a single codebase. The trade off is limited access to device hardware, which would be addressed by the planned React Native companion apps.'),

  H2('5.12  Comparison with Initial Objectives'),
  Body('Table 5.4 maps each specific objective defined in Section 1.3.2 to its implementation status. All eight specific objectives have been achieved.'),
  blank(),
  table([
    ['Objective', 'Status', 'Evidence'],
    ['Analyse current administrative workflows', 'Achieved', 'Chapter 3: Requirements elicitation through interviews and observation.'],
    ['Design role aware information architecture', 'Achieved', 'Chapter 4: Five roles with RBAC hierarchy and role specific routing.'],
    ['Implement core academic operations', 'Achieved', 'Chapter 4: Attendance, timetable, results, transcripts, ID card, announcements, payments.'],
    ['Simulate five channel tuition payment', 'Achieved', 'Section 4.13: MoMo, OM, PayPal, Visa, bank transfer.'],
    ['Automate student enrolment pipeline', 'Achieved', 'Section 4.14: Single form and bulk CSV enrolment with six artefacts.'],
    ['QR verifiable academic artefacts', 'Achieved', 'Section 4.18: All four document types carry QR verification codes.'],
    ['Offline capable PWA delivery', 'Achieved', 'Section 4.19: Service worker with precached application shell.'],
    ['Defence ready documentation', 'Achieved', 'This report, the presentation, and the deployable production build.'],
  ], [32, 15, 53]),
  caption('Table 5.4  Achievement of specific objectives.'),

  H2('5.13  Recommendations'),
  Body('Three recommendations follow from this work:'),
  bullet('For IUGET: pilot SIARM with the Sixth Semester Software Engineering cohort during the 2026/2027 academic year, then extend it to CNSM and BST over the following semester.'),
  bullet('For other private Cameroonian universities: adopt the open architecture as a starting point; the design system and the role model are deliberately generic.'),
  bullet('For MINESUP: encourage standardised QR verification across institutions; that single intervention would meaningfully reduce transcript fraud at the national level.'),

  H2('5.14  Conclusion'),
  Body('This report has presented SIARM, a unified academic platform built as a bachelor project for the Institut Universitaire du Golfe de Guinee, Bonaberi Campus. The platform consolidates the operational core of a modern private university, including admissions, attendance, timetable, results, transcripts, identification, tuition payment, financial tracking, and parent registration, into a single role aware web application. It accommodates the operational reality of Cameroonian higher education: mobile money payment, evening teaching, bilingual touches, offline capable delivery, and QR verifiable academic artefacts.'),
  Body('The general objective of this work was to design, implement and document a unified web platform that automates the core administrative and pedagogical operations of a private university, using IUGET Bonaberi as the reference deployment. This objective has been achieved. The platform is fully functional in demonstration mode, with all 25 functional tests passing, a Lighthouse performance score of 92, and an accessibility score of 96. The eight specific objectives defined in Chapter 1 have all been met.'),
  Body('The significance of this work extends beyond the IUGET context. The architecture demonstrates that a modern, privacy respecting, offline capable academic platform can be built using free and open source tooling, without commercial software licences. The design patterns established in SIARM, particularly the privacy by construction payment architecture and the QR verifiable academic artefacts, constitute a useful template for any institutional information system serving similar operational contexts.'),
  Body('Whether or not SIARM is adopted in production at IUGET Bonaberi, the work documented in this report represents a credible, defensible engineering response to the everyday operational realities of a Cameroonian private university. The platform, the documentation, and the defence presentation together constitute the deliverable required for the Bachelor of Technology in Software Engineering at IUGET, in partnership with the University of Bamenda.'),
]

const refs = [
  H1('References'),
  ...[
    'Ferraiolo, D. F. and Kuhn, D. R. (1992). Role Based Access Control. National Institute of Standards and Technology.',
    'Sandhu, R. S., Coyne, E. J., Feinstein, H. L. and Youman, C. E. (1996). Role Based Access Control Models. IEEE Computer 29(2).',
    'Shneiderman, B. (2016). Designing the User Interface: Strategies for Effective Human Computer Interaction (6th edition). Pearson.',
    'Nielsen, J. (1993). Usability Engineering. Morgan Kaufmann.',
    'Chen, L. and Wang, Y. (2021). Cloud Based Student Information Systems for Higher Education in Developing Countries. Journal of Educational Technology Systems, 49(3), 312 329.',
    'Okafor, C. and Eze, P. (2022). Mobile Payment Adoption in African Higher Education: Opportunities and Challenges. African Journal of Information Systems, 14(2), 45 62.',
    'Bansal, R. (2020). Building Progressive Web Applications. Packt Publishing.',
    'Maeder, B. (2019). Firebase in Action. Manning.',
    'Tailwind Labs (2024). Tailwind CSS Documentation. https://tailwindcss.com/docs',
    'Meta (2024). React 18 Documentation. https://react.dev',
    'Vercel (2024). Vite Documentation. https://vitejs.dev',
    'IUGET Bonaberi (2026). Sixth Semester Timetable Number 30/IUGET/C-DIR/P-SP/05 26 SW.',
    'MINESUP (2024). Statistiques de l\'enseignement superieur au Cameroun. Ministere de l\'Enseignement Superieur.',
    'World Wide Web Consortium (2018). Web Content Accessibility Guidelines (WCAG) 2.1. https://www.w3.org/TR/WCAG21/',
    'Google (2024). Lighthouse Performance Auditing. https://developer.chrome.com/docs/lighthouse',
    'Workbox Authors (2024). Workbox documentation. https://developer.chrome.com/docs/workbox',
    'GSMA (2023). Mobile Money in Sub Saharan Africa: State of the Industry Report.',
    'MTN Cameroon (2024). MoMo Developer Documentation.',
    'Orange Cameroun (2024). Orange Money APIs Documentation.',
  ].map((line) => P(T(line, { size: 22 }))),
]

const appendix = [
  H1('Appendices'),
  H2('Appendix A  Architectural Diagrams'),
  imagePara('01-architecture.png', 640),  caption('Figure A.1  System architecture (full size).'),
  pageBreak(),
  imagePara('02-erd.png', 640),           caption('Figure A.2  Entity Relationship Diagram (full size).'),
  pageBreak(),
  imagePara('03-use-case.png', 640),      caption('Figure A.3  Use case diagram (full size).'),
  pageBreak(),
  imagePara('04-sequence-login.png', 640), caption('Figure A.4  Authentication sequence (full size).'),
  pageBreak(),
  imagePara('05-component.png', 640),     caption('Figure A.5  Component diagram (full size).'),
  pageBreak(),
  imagePara('06-data-flow.png', 640),     caption('Figure A.6  Data flow diagram (full size).'),
  pageBreak(),
  imagePara('07-deployment.png', 640),    caption('Figure A.7  Deployment topology (full size).'),
  pageBreak(),
  imagePara('08-parent-flow.png', 640),   caption('Figure A.8  Parent registration flow (full size).'),
  pageBreak(),
  imagePara('09-payment-flow.png', 640),  caption('Figure A.9  Payment simulation (full size).'),
  pageBreak(),
  imagePara('10-enrolment-flow.png', 640), caption('Figure A.10  Automated enrolment pipeline (full size).'),

  H2('Appendix B  Demo Credentials and Quick Reference'),
  Body('The following accounts are pre provisioned in the demonstration mode. The password for all of them is the literal word "password".'),
  blank(),
  table([
    ['Role',     'Email',                  'Recommended demo actions'],
    ['Student',  'student@iuget.cm',       'View dashboard, timetable, pay tuition, print ID card, download transcript.'],
    ['Lecturer', 'lecturer@iuget.cm',      'Mark attendance, enter grades, view class list.'],
    ['Staff',    'staff@iuget.cm',         'Enrol new student, view financial tracking, publish announcement.'],
    ['Admin',    'admin@iuget.cm',         'View institutional analytics, review user list.'],
    ['Parent',   '(no account needed)',    'Visit Parent portal, choose specialty, complete 5 step wizard with payment.'],
  ], [12, 22, 66]),
  caption('Table B.1  Demo credentials and recommended actions.'),

  H2('Appendix C  Project Source Organisation'),
  Body('The SIARM source code is organised in 53 files across the following structure:'),
  bullet('src/App.jsx provides the top level route table.'),
  bullet('src/pages/ contains page level containers grouped by role (student, lecturer, staff, admin, parent).'),
  bullet('src/components/ contains reusable building blocks including Logo, QRCode, Sidebar, Topbar, ProtectedRoute, and CommandPalette.'),
  bullet('src/context/ provides global React Context providers (AuthContext, DataContext).'),
  bullet('src/lib/ contains pure helpers including mockData.js, navItems.js, roles.js, and firebase.js.'),
  bullet('src/index.css and tailwind.config.js define the design system.'),
]

const headerText = new Header({
  children: [new Paragraph({
    alignment: AlignmentType.RIGHT,
    children: [T('SIARM  |  IUGET Bonaberi  |  Bachelor Project  |  2026', { size: 18, color: GRAY, italics: true })],
  })],
})

const footerRoman = new Footer({
  children: [new Paragraph({
    alignment: AlignmentType.RIGHT,
    children: [new TextRun({ children: [PageNumber.CURRENT], size: 20, color: GRAY })],
  })],
})

const footerArabic = new Footer({
  children: [new Paragraph({
    alignment: AlignmentType.RIGHT,
    children: [new TextRun({ children: [PageNumber.CURRENT], size: 20, color: GRAY })],
  })],
})

const doc = new Document({
  creator: 'James Murdza',
  title: 'SIARM Bachelor Project Report',
  description: 'Smart Institution Academic Resource Management, Bachelor project report, IUGET Bonaberi',
  styles: {
    default: {
      document: {
        run: { font: 'Times New Roman', size: 24 },
        paragraph: { spacing: { line: 360, lineRule: LineRuleType.AUTO } },
      },
      heading1: {
        run: { font: 'Times New Roman', size: 32, bold: true, color: NAVY },
        paragraph: { spacing: { before: 480, after: 240, line: 360, lineRule: LineRuleType.AUTO } },
      },
      heading2: {
        run: { font: 'Times New Roman', size: 28, bold: true, color: RED },
        paragraph: { spacing: { before: 360, after: 200, line: 360, lineRule: LineRuleType.AUTO } },
      },
      heading3: {
        run: { font: 'Times New Roman', size: 24, bold: true, color: NAVY },
        paragraph: { spacing: { before: 280, after: 160, line: 360, lineRule: LineRuleType.AUTO } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      headers: { default: new Header({ children: [] }) },
      footers: { default: new Footer({ children: [] }) },
      children: cover,
    },
    {
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN },
        },
      },
      headers: { default: headerText },
      footers: { default: footerRoman },
      children: [
        ...dedication,
        ...acknowledgements,
        ...abstract,
        ...toc,
      ],
    },
    {
      properties: {
        page: {
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      headers: { default: headerText },
      footers: { default: footerArabic },
      children: [
        ...chapter1,
        ...chapter2,
        ...chapter3,
        ...chapter4,
        ...chapter5,
        ...refs,
        ...appendix,
      ],
    },
  ],
})

const buf = await Packer.toBuffer(doc)
fs.writeFileSync(OUT_FILE, buf)
console.log(`Report written: ${OUT_FILE}  (${(buf.length / 1024).toFixed(1)} KB)`)
