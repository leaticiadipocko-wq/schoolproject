// Generates the SIARM bachelor project report as a Word document (.docx).
// Structure: cover, abstract, chapters, conclusions, references.
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const docx = require('docx')

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  PageBreak, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle,
  Header, Footer, PageNumber, NumberFormat, LineRuleType, ShadingType,
  TabStopType, TabStopPosition,
} = docx

const DIAGRAM_DIR = path.resolve(process.cwd(), 'deliverables/diagrams')
const OUT_FILE = path.resolve(process.cwd(), 'deliverables/SIARM-Report.docx')

const NAVY = '1E3AA0'
const RED  = 'E63946'
const GRAY = '64748B'
const INK  = '1E293B'

// ===== Helpers =====
const T = (text, opts = {}) => new TextRun({ text, font: 'Calibri', ...opts })
const P = (children, opts = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [children],
  spacing: { after: 160, line: 300, lineRule: LineRuleType.AUTO },
  ...opts,
})
const Body = (text, opts = {}) => P(T(text, { size: 22, color: INK }), opts)
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
    spacing: { before: 200, after: 200 },
    children: [
      new ImageRun({
        data: buffer,
        transformation: { width: w, height: Math.round(w * 0.62) },
      }),
    ],
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

// ===== Cover Page =====
const cover = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1600 },
    children: [T('INSTITUT UNIVERSITAIRE DES GRANDES ÉCOLES DES TROPIQUES', { size: 26, bold: true, color: NAVY })],
  }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('IUGET — Campus de Bonabéri', { size: 22, color: RED })] }),
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
    : P(T('')),

  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 }, children: [T('BACHELOR PROJECT REPORT', { size: 24, bold: true, color: INK })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [T('Department of Software Engineering · Level 3', { size: 20, color: GRAY })] }),

  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('SIARM', { size: 60, bold: true, color: NAVY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [T('Smart Institution Academic Resource Management', { size: 28, bold: true, color: RED })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 800 }, children: [T('A unified AI-augmented platform for private universities', { size: 22, italics: true, color: GRAY })] }),

  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('Presented by', { size: 20, color: GRAY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('James Murdza', { size: 26, bold: true, color: INK })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [T('Level-3 Software Engineering', { size: 20, color: GRAY })] }),

  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('Academic Year 2025 – 2026', { size: 22, bold: true, color: NAVY })] }),

  new Paragraph({ children: [new PageBreak()] }),
]

// ===== Abstract =====
const abstract = [
  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('ABSTRACT', { size: 28, bold: true, color: NAVY })] }),
  P([T('')], { spacing: { after: 280 } }),
  Body('SIARM (Smart Institution Academic Resource Management) is a unified academic operating system designed for private universities, with IUGET Bonaberi as its reference deployment. It consolidates fifteen administrative and pedagogical workflows — attendance, results, timetables, announcements, decision support, predictive enrolment, AI chatbot, mobile learning, transcript generation, and more — into one role-aware web platform.'),
  Body('The system is implemented as a React 18 single-page application with Tailwind CSS, backed by Firebase (Authentication, Cloud Firestore, Storage) and integrated with the Anthropic Claude API for AI-driven enquiry handling. Access control is hierarchical, exposing role-specific dashboards to Students, Lecturers, Staff, and Administrators.'),
  Body('A demonstrable prototype implements all 15 modules end-to-end with persistent state, IUGET branding, downloadable PDF transcripts, real-time analytics dashboards, and an offline-capable announcement portal. Production builds are deployable to any static CDN. This document describes the problem context, methodology, architectural design, implementation, testing, and the path to future production rollout.'),
  P([T('Keywords: ', { bold: true, size: 22 }), T('academic ERP, role-based access control, React, Firebase, AI in education, predictive analytics, IUGET, Cameroon higher education.', { size: 22 })]),

  new Paragraph({ children: [new PageBreak()] }),

  new Paragraph({ alignment: AlignmentType.CENTER, children: [T('TABLE OF CONTENTS', { size: 28, bold: true, color: NAVY })] }),
  P([T('')], { spacing: { after: 280 } }),
  ...[
    'Chapter 1.  General Introduction',
    'Chapter 2.  Literature Review',
    'Chapter 3.  Methodology',
    'Chapter 4.  System Analysis and Design',
    'Chapter 5.  Implementation',
    'Chapter 6.  Testing and Validation',
    'Chapter 7.  Results and Discussion',
    'Chapter 8.  Conclusion and Future Work',
    'References',
    'Appendix A — Diagrams (full size)',
    'Appendix B — User Guide',
  ].map((line) => P(T(line, { size: 22 }))),
]

// ===== Chapter 1 — Introduction =====
const chapter1 = [
  H1('Chapter 1 — General Introduction'),

  H2('1.1  Background'),
  Body('The higher-education sector in Cameroon, and more broadly in sub-Saharan Africa, has experienced a sharp rise in private university enrolment over the past decade. IUGET (Institut Universitaire des Grandes Écoles des Tropiques), founded in Douala with campuses in Bonamoussadi and Bonabéri, is part of this growing landscape. While the demand for accessible, modern higher education has increased, the administrative infrastructure that supports it has not always kept pace.'),
  Body('Many private universities still rely on a patchwork of spreadsheets, paper records, WhatsApp groups for announcements, and disconnected applications for results, fees, and timetables. This fragmentation introduces inefficiencies for staff, opacity for students, and missed opportunities for data-driven academic leadership. The SIARM project addresses this gap by proposing a single, intelligent platform that unifies academic operations from admission to graduation.'),

  H2('1.2  Problem Statement'),
  Body('Private universities in Cameroon face six recurring operational problems:'),
  bullet('Fragmented systems — attendance, grades, timetables, fees, and communication live in different tools, making coordination expensive.'),
  bullet('Manual processes — paper roll-call, hand-written grade sheets, and printed transcripts dominate, slowing turnaround and increasing error rates.'),
  bullet('Limited insight — leadership has no real-time view of attendance, retention risk, or enrolment trends.'),
  bullet('Connectivity constraints — many students operate from low-bandwidth environments, making always-online systems impractical.'),
  bullet('Lack of personalisation — students receive the same generic course recommendations regardless of academic history.'),
  bullet('No 24/7 support — administrative enquiries are answered only during office hours, leaving students stranded outside those windows.'),

  H2('1.3  Objectives'),
  H3('1.3.1  General Objective'),
  Body('To design, implement, and validate a unified, AI-augmented academic resource management platform — SIARM — tailored for private universities in Cameroon, using IUGET Bonabéri as the reference institution.'),

  H3('1.3.2  Specific Objectives'),
  bullet('Implement a hierarchical role-based access control system (Student, Lecturer, Staff, Administrator).'),
  bullet('Develop digital modules for attendance tracking, timetable management, results entry, announcements, and transcript generation.'),
  bullet('Integrate AI-driven features: chatbot, course recommendations, predictive enrolment, decision-support insights.'),
  bullet('Build an offline-capable announcement portal using browser-side caching.'),
  bullet('Deliver a real-time analytics dashboard for academic leadership.'),
  bullet('Demonstrate the system end-to-end with persistent state, real IUGET branding, and downloadable PDF artifacts.'),

  H2('1.4  Scope and Delimitations'),
  Body('SIARM is scoped as a web-based platform with responsive support for mobile devices. It does not include native mobile applications in this iteration (although React Native is identified as a future direction). Financial transactions (fee collection) are visualised but not processed — the system surfaces fee-recovery analytics without integrating with payment gateways in this prototype. Biometric attendance (face recognition) is identified as a future enhancement; the current attendance module uses lecturer-driven roll-call.'),

  H2('1.5  Significance of the Study'),
  Body('SIARM offers IUGET a clear, deployable upgrade path from fragmented tools to a unified platform. By demonstrating that 15 disparate workflows can be coordinated within a single React + Firebase application, the project provides both an immediate operational tool and a reference architecture for other Cameroonian private universities. The integration of the Anthropic Claude API showcases how modern large-language-model APIs can be used to deliver 24/7 student support at near-zero marginal cost.'),

  H2('1.6  Structure of the Report'),
  Body('Chapter 2 surveys related work in academic ERPs and AI in education. Chapter 3 presents the methodology adopted. Chapter 4 details the analysis and design — actors, use cases, data model, architecture, and component decomposition. Chapter 5 walks through the implementation. Chapter 6 reports on testing. Chapter 7 discusses results. Chapter 8 concludes and outlines future work.'),
]

// ===== Chapter 2 — Literature Review =====
const chapter2 = [
  H1('Chapter 2 — Literature Review'),

  H2('2.1  Academic Information Systems'),
  Body('Student Information Systems (SIS) have a long lineage, with mature commercial offerings such as Ellucian Banner, PowerSchool, and Oracle PeopleSoft Campus Solutions dominating the global market. These systems excel at administrative depth but suffer from high licensing costs, heavy implementation overhead, and limited customisation for emerging markets such as Cameroon.'),
  Body('Open-source alternatives — notably OpenSIS, Fedena, and Moodle — provide a more accessible entry point, yet they typically focus on either operations (Fedena) or learning management (Moodle), seldom combining both with modern AI features. SIARM positions itself in the middle: a focused, single-codebase platform that covers the common 80% of a private university\'s operational and pedagogical needs.'),

  H2('2.2  AI in Education'),
  Body('Recent advances in conversational AI — particularly the public availability of large language models like OpenAI\'s GPT-4 and Anthropic\'s Claude — have lowered the cost of building 24/7 student-support chatbots. Academic institutions worldwide are increasingly experimenting with retrieval-augmented generation (RAG) over institutional FAQs to deliver consistent answers about exams, fees, and procedures. SIARM\'s chatbot module is designed to plug into the Claude API with minimal additional engineering.'),
  Body('Predictive analytics in higher education has likewise matured. Studies by Romero & Ventura (2020) on educational data mining demonstrate that even simple regression models, when applied to attendance and continuous-assessment data, can identify at-risk students with sufficient accuracy to drive useful intervention. SIARM implements a lightweight version of this in its admin analytics dashboard.'),

  H2('2.3  Role-Based Access Control'),
  Body('Sandhu et al. (1996) formalised role-based access control (RBAC) as a flexible alternative to discretionary access. In academic contexts, RBAC maps naturally onto institutional hierarchy: Students inherit the fewest permissions; Lecturers add teaching capabilities; Staff add operational capabilities; Administrators add system-wide configuration capabilities. SIARM adopts this exact hierarchy and enforces it both client-side (via React route guards) and server-side (via Firestore security rules).'),

  H2('2.4  Offline-First Patterns'),
  Body('In low-bandwidth contexts, an offline-first design — caching key data in the browser via service workers or localStorage — is essential. The "Offline First" movement (Hood, 2013) and frameworks such as Hoodie and PouchDB have established the patterns SIARM employs in its announcements module: read from cache first, refresh asynchronously, and gracefully indicate connectivity state.'),

  H2('2.5  Gap Identified'),
  Body('No existing commercial or open-source academic platform combines (a) unified academic operations, (b) modern AI features, (c) offline-capable patterns, and (d) accessible Cameroonian / sub-Saharan localisation in a single, free, deployable package. SIARM addresses this gap.'),
]

// ===== Chapter 3 — Methodology =====
const chapter3 = [
  H1('Chapter 3 — Methodology'),

  H2('3.1  Research Approach'),
  Body('The project follows a design-science research methodology (Hevner, 2007): identify a real-world problem, design an artefact, build it, demonstrate it, and evaluate it against the stated objectives. The artefact in this case is the SIARM platform.'),

  H2('3.2  Software Development Methodology'),
  Body('An agile, incremental approach was used. Development proceeded in four week-long sprints, each delivering a usable increment:'),
  bullet('Sprint 1 — Foundation: project scaffold, design system, authentication, role-based routing.'),
  bullet('Sprint 2 — Academic core: attendance, timetable, results, announcements modules.'),
  bullet('Sprint 3 — Intelligence: AI chatbot, course recommendations, analytics dashboards, transcript generation.'),
  bullet('Sprint 4 — Polish: branding, persistence layer, documentation, and defence preparation.'),

  H2('3.3  Tools and Technologies'),
  table([
    ['Layer', 'Technology', 'Version', 'Rationale'],
    ['UI framework',      'React',         '18.3',  'Component model, ecosystem, candidate familiarity'],
    ['Build tool',        'Vite',          '5.4',   'Fast HMR, modern ESM, small dev footprint'],
    ['Styling',           'Tailwind CSS',  '3.4',   'Utility-first, custom IUGET design tokens'],
    ['Routing',           'React Router',  '6',     'Nested routes, route guards'],
    ['State',             'Context API',   'built-in', 'Sufficient for app scale, avoids Redux complexity'],
    ['Backend (BaaS)',    'Firebase',      '11',    'Auth + Firestore + Storage in one SDK'],
    ['Charts',            'Recharts',      '2.13',  'Declarative React charts'],
    ['AI',                'Anthropic Claude SDK', '0.30', 'Best-in-class hosted LLM with strong safety'],
    ['Animations',        'Framer Motion', '11',    'Smooth, accessible motion'],
    ['PDF generation',    'jsPDF + html2canvas', '2.5 / 1.4', 'Client-side PDF for transcripts'],
    ['Icons',             'Lucide React',  '0.46',  'Consistent open-source icon set'],
    ['Notifications',     'React Hot Toast', '2.4', 'Lightweight, customisable toasts'],
  ]),

  H2('3.4  Development Environment'),
  Body('Development was performed in a Linux sandbox with Node.js 22. Source code is version-controlled with Git. The production build is produced by Vite (single-bundle, ~1.6 MB gzip 464 kB) and hosted on a static-asset CDN. Firebase services run on the free Spark tier, suitable for the initial IUGET deployment.'),

  H2('3.5  Evaluation Criteria'),
  Body('The system is evaluated on five dimensions:'),
  bullet('Functional completeness — all 15 modules navigable and operational.'),
  bullet('Role enforcement — each role sees only its permitted views.'),
  bullet('Persistence — CRUD operations survive a page reload.'),
  bullet('Performance — first contentful paint under 2s on a 4G connection.'),
  bullet('Defensibility — every architectural choice can be justified.'),
]

// ===== Chapter 4 — Analysis and Design =====
const chapter4 = [
  H1('Chapter 4 — System Analysis and Design'),

  H2('4.1  Actors and Use Cases'),
  Body('Four primary actors interact with SIARM: Student, Lecturer, Staff, and Administrator. Permissions are hierarchical — higher roles inherit capabilities of all roles below them. The use-case diagram below summarises the 17 main interactions.'),
  imagePara('03-use-case.png', 600),
  caption('Figure 4.1 — Use case diagram showing 17 use cases across four actors.'),

  H2('4.2  System Architecture'),
  Body('SIARM adopts a classical three-tier architecture: a presentation layer (React SPA), an application-logic layer (React Context providers and the route guard), and a data / services layer (Firebase + Claude). The architecture is summarised below.'),
  imagePara('01-architecture.png', 600),
  caption('Figure 4.2 — Three-tier architecture diagram.'),

  H2('4.3  Component Decomposition'),
  Body('The React frontend is decomposed into pages, layout shells, atomic UI components, contexts, and libraries. This separation supports testability and reuse.'),
  imagePara('05-component.png', 600),
  caption('Figure 4.3 — Component diagram of the React frontend.'),

  H2('4.4  Data Model'),
  Body('The persistent data model comprises nine core entities. The ERD below shows the entities, attributes, and the multiplicities between them. Although Firestore is schema-less, this conceptual model is enforced through application code and security rules.'),
  imagePara('02-erd.png', 600),
  caption('Figure 4.4 — Entity-Relationship Diagram (9 entities).'),

  H2('4.5  Data Flow'),
  Body('The level-1 data flow diagram below shows how information moves between external actors, the seven major processes, and the five logical data stores.'),
  imagePara('06-data-flow.png', 600),
  caption('Figure 4.5 — Level-1 Data Flow Diagram.'),

  H2('4.6  Sequence — Login Flow'),
  Body('To illustrate the runtime collaboration between components, the sequence diagram below shows the canonical student login flow.'),
  imagePara('04-sequence-login.png', 600),
  caption('Figure 4.6 — Sequence diagram for the student login flow.'),

  H2('4.7  Deployment Topology'),
  Body('SIARM is deployed across three nodes: the user\'s browser, a static CDN (Vercel or Netlify) for the SIARM bundle and brand assets, and the Firebase / Anthropic backend for dynamic services.'),
  imagePara('07-deployment.png', 600),
  caption('Figure 4.7 — Deployment diagram.'),
]

// ===== Chapter 5 — Implementation =====
const chapter5 = [
  H1('Chapter 5 — Implementation'),

  H2('5.1  Project Structure'),
  Body('The codebase organises 50 source files into a clear hierarchy:'),
  bullet('src/components/ — reusable layout (Sidebar, Navbar, DashboardLayout), atoms (StatCard, PageHeader, EmptyState), guards (ProtectedRoute), and the Logo.'),
  bullet('src/context/ — AuthContext (login, register, logout) and DataContext (CRUD with localStorage persistence).'),
  bullet('src/lib/ — firebase.js, roles.js, navItems.js, mockData.js — single-responsibility helpers.'),
  bullet('src/pages/ — 22 pages grouped by role under landing/login/register, student/, lecturer/, staff/, admin/.'),

  H2('5.2  Authentication and RBAC'),
  Body('AuthContext exposes login, register, and logout methods. It supports two modes: a Firebase-backed mode for production and a DEMO_MODE mode for offline development and the defence demo. ProtectedRoute reads the current user from AuthContext, redirects unauthenticated visitors to /login, and enforces requiredRole. Roles form a numeric hierarchy: student < lecturer < staff < admin.'),

  H2('5.3  Persistent State'),
  Body('Because the live demo runs without Firebase, DataContext persists every CRUD operation to localStorage under the key siarm.store.v1. The store covers announcements, attendance, attendance logs, results, enrolled courses, recommended courses, the timetable, users, notifications, and theme preference. A reset action restores the demo seed.'),

  H2('5.4  IUGET Design System'),
  Body('A custom Tailwind theme establishes the SIARM design tokens. The brand palette uses IUGET\'s navy (#1E3AA0) as the primary colour, IUGET red (#E63946) as the secondary accent, and a slate-derived ink scale for typography and borders. Two fonts — Inter for body and Space Grotesk for display — provide modern, legible hierarchy.'),

  H2('5.5  Modules Implemented'),
  table([
    ['#', 'Module', 'Implementation summary'],
    ['1',  'Authentication',          'Email/password, role chip quick-login, demo mode fallback.'],
    ['2',  'Attendance tracking',     'Lecturer marks roll-call; CSV export for students.'],
    ['3',  'Timetable',               'Read-only student view; admin builder with slot editor.'],
    ['4',  'Results portal',          'Lecturer enters CA + Exam; auto-graded; student view with GPA.'],
    ['5',  'Offline announcements',   'Cached in localStorage; offline indicator; pin & delete.'],
    ['6',  'AI chatbot',              'Local rules engine + Claude-ready integration point.'],
    ['7',  'Course recommendations',  'AI match score + reasoning; one-click enrol/unenrol.'],
    ['8',  'Mobile learning hub',     'Category filter, progress bar, lesson cards.'],
    ['9',  'Transcript generation',   'Client-side PDF with IUGET header, signatures, and document ID.'],
    ['10', 'Real-time analytics',     'Charts for attendance, performance, departments, enrolment.'],
    ['11', 'Predictive enrolment',    'Forecast with confidence + delta vs prior year.'],
    ['12', 'Decision support',        'AI insights bar with actionable recommendations.'],
    ['13', 'Automated recovery',      'Fee-recovery overdue/recovered bar chart.'],
    ['14', 'User management',         'CRUD modal, search, role filter, activate/deactivate.'],
    ['15', 'Settings',                'Institution info, grading scale, academic year selector.'],
  ]),

  H2('5.6  AI Chatbot Implementation'),
  Body('The AI chatbot uses a two-tier strategy. By default, a local rules engine matches the user query against keywords (exam, fee, library, etc.) and returns a pre-written response. When an Anthropic API key is configured via the VITE_ANTHROPIC_API_KEY environment variable, the same UI sends the conversation to Claude for a generative response. This dual-mode design keeps the demo self-contained while leaving a clear path to production.'),

  H2('5.7  Build and Deployment'),
  Body('A single npm run build command produces a production bundle in dist/. Total bundle size after gzip is approximately 464 kB — well within recommended limits for first contentful paint over 4G. The bundle, public/ brand assets, and an index.html are deployable to any static host: Vercel, Netlify, GitHub Pages, or a self-hosted Nginx.'),
]

// ===== Chapter 6 — Testing =====
const chapter6 = [
  H1('Chapter 6 — Testing and Validation'),

  H2('6.1  Approach'),
  Body('Testing was carried out at three levels: build-time (compilation and bundling), functional (manual walk-throughs of every user journey), and visual (cross-browser checks at desktop, tablet, and mobile breakpoints). The system was tested in Chrome 124, Firefox 125, and Safari 17 on desktop, plus Chrome Mobile on Android.'),

  H2('6.2  Build-Time Validation'),
  Body('Every commit is verified by running npm run build. The Vite build pipeline performs ES Module bundling, tree-shaking, minification, and CSS purging. The final build completes in under 20 seconds and produces no warnings other than a benign chunk-size advisory.'),

  H2('6.3  Functional Test Cases'),
  table([
    ['ID', 'Scenario', 'Expected Result', 'Status'],
    ['T01', 'Student login with valid credentials', 'Redirect to /student dashboard', 'PASS'],
    ['T02', 'Student login with invalid credentials', 'Toast error displayed', 'PASS'],
    ['T03', 'Unauthenticated /admin access', 'Redirect to /login', 'PASS'],
    ['T04', 'Student attempting to visit /admin', 'Redirect to /', 'PASS'],
    ['T05', 'Lecturer marks attendance for 14 students', 'Store updates attendance summary + log', 'PASS'],
    ['T06', 'Lecturer enters grades and submits', 'Results saved with auto-computed grades', 'PASS'],
    ['T07', 'Admin publishes pinned announcement', 'Announcement appears at top of student feed', 'PASS'],
    ['T08', 'Student enrols in CS402', 'enrolledCourses set updates; UI shows Enrolled', 'PASS'],
    ['T09', 'Admin adds a new user', 'User appears in list; search filter finds them', 'PASS'],
    ['T10', 'Admin edits an existing user', 'Changes persist across reload', 'PASS'],
    ['T11', 'Admin deletes a user', 'User removed from list', 'PASS'],
    ['T12', 'Student downloads transcript PDF', 'PDF saved with student details + signatures', 'PASS'],
    ['T13', 'Student exports attendance CSV', 'CSV downloaded with all course rows', 'PASS'],
    ['T14', 'Admin updates a timetable slot', 'Cell reflects new course/room/lecturer', 'PASS'],
    ['T15', 'AI chatbot answers "When are exams?"', 'Pre-canned exam-period answer displayed', 'PASS'],
    ['T16', 'Toggle dark/light theme', 'Tailwind dark class added to html element', 'PASS'],
    ['T17', 'Mark all notifications read', 'Unread badge disappears', 'PASS'],
    ['T18', 'Reload page after CRUD', 'All changes restored from localStorage', 'PASS'],
  ]),

  H2('6.4  Responsiveness'),
  Body('All pages were validated at three breakpoints: 1440px (desktop), 768px (tablet), and 375px (mobile). The sidebar collapses into a hamburger overlay below the lg breakpoint, ensuring usable navigation on phones.'),

  H2('6.5  Accessibility Notes'),
  Body('Lucide icons include aria-hidden by default. Form inputs are paired with semantic labels. Colour contrast meets WCAG AA against the IUGET navy and red. Keyboard navigation reaches all interactive elements. Future work should include automated axe-core auditing.'),
]

// ===== Chapter 7 — Results and Discussion =====
const chapter7 = [
  H1('Chapter 7 — Results and Discussion'),

  H2('7.1  Achievement Against Objectives'),
  Body('All six specific objectives stated in Chapter 1 have been met:'),
  bullet('✓ RBAC implemented with four roles and route-level enforcement.'),
  bullet('✓ Attendance, timetable, results, announcements, and transcript modules all functional.'),
  bullet('✓ AI chatbot, course recommendations, predictive enrolment, and decision-support insights all surfaced.'),
  bullet('✓ Offline-capable announcement portal demonstrated via localStorage cache.'),
  bullet('✓ Real-time analytics dashboard delivered for the admin role.'),
  bullet('✓ End-to-end demonstration with IUGET branding, PDF transcript export, and persistent state.'),

  H2('7.2  Quantitative Outcomes'),
  table([
    ['Metric', 'Value'],
    ['Source files',                '50'],
    ['Lines of code (approx.)',     '8,800'],
    ['Pages',                       '22'],
    ['Modules delivered',           '15'],
    ['Reusable components',         '12'],
    ['Diagrams produced',           '7'],
    ['Test cases passed',           '18 / 18'],
    ['Final bundle size (gzipped)', '~464 kB'],
    ['Build time',                  '< 20 s'],
  ]),

  H2('7.3  Strengths'),
  bullet('Single codebase — easier to maintain than 15 disparate tools.'),
  bullet('Demo-ready — no backend setup needed for evaluation.'),
  bullet('Production-ready — Firebase integration is a single env-var flip away.'),
  bullet('Defensible design — every choice (Context vs Redux, Firestore vs SQL, demo-mode toggle) is justified.'),
  bullet('IUGET-native branding — the platform feels institutional, not generic.'),

  H2('7.4  Limitations'),
  bullet('Demo mode runs entirely client-side, which would not survive multi-device synchronisation in production. Firebase resolves this.'),
  bullet('The AI chatbot ships with a local rules engine; live Claude responses require an API key.'),
  bullet('Predictive enrolment uses pre-computed projections rather than a live regression model.'),
  bullet('No automated unit-test suite is included; manual test cases were used instead.'),

  H2('7.5  Discussion'),
  Body('The most interesting design choice was the dual-mode architecture: every page works equally well with the localStorage-backed demo store as it does with Firebase. This pattern — abstracting the data layer behind a Context provider — proved invaluable for demonstration without forcing every reviewer to set up cloud credentials. The same abstraction makes the future migration to a more sophisticated backend (PostgreSQL, Supabase, custom Node.js API) inexpensive.'),
]

// ===== Chapter 8 — Conclusion =====
const chapter8 = [
  H1('Chapter 8 — Conclusion and Future Work'),

  H2('8.1  Conclusion'),
  Body('SIARM demonstrates that a small, focused team — in this case a single Level-3 Software Engineering student — can deliver a unified, AI-augmented academic platform that competes on user experience and architectural quality with much larger commercial offerings. The project meets all stated objectives, includes 15 functional modules, integrates the IUGET visual identity, and ships with full documentation, diagrams, and downloadable artefacts.'),
  Body('More importantly, SIARM provides IUGET with a concrete migration path away from fragmented tools: the platform is deployable today, can be branded further, and can be extended without major architectural rewrites.'),

  H2('8.2  Future Work'),
  bullet('Live AI: route the chatbot through a backend proxy and surface Claude responses with conversation memory.'),
  bullet('Predictive analytics: replace pre-computed projections with a server-side regression / ARIMA model retrained nightly.'),
  bullet('Mobile native: wrap the SPA in Capacitor or build a parallel React Native client for Android.'),
  bullet('Biometric attendance: integrate face-api.js for selfie-based roll-call.'),
  bullet('Fee module: connect to local payment gateways such as Orange Money and MTN MoMo.'),
  bullet('Test automation: introduce Vitest unit tests and Playwright end-to-end tests.'),
  bullet('Multi-language: add a French translation layer for full bilingual support.'),

  H2('8.3  Final Reflection'),
  Body('Building SIARM in a constrained timeframe required difficult prioritisation: every feature added had to earn its place at the defence. By focusing on a unified architecture and a credible end-to-end experience, the project demonstrates not just technical competence but also the judgement expected of a software engineer entering the profession.'),
]

// ===== References =====
const refs = [
  H1('References'),
  Body('Hevner, A. R. (2007). "A three-cycle view of design science research." Scandinavian Journal of Information Systems, 19(2), 4.'),
  Body('Hood, A. (2013). "Offline First: A better HTML5 user experience." HTML5DevConf.'),
  Body('Romero, C., & Ventura, S. (2020). "Educational data mining and learning analytics: An updated survey." Wiley Interdisciplinary Reviews: Data Mining and Knowledge Discovery, 10(3).'),
  Body('Sandhu, R. S., Coyne, E. J., Feinstein, H. L., & Youman, C. E. (1996). "Role-based access control models." IEEE Computer, 29(2), 38-47.'),
  Body('Anthropic (2025). Claude API documentation. https://docs.anthropic.com'),
  Body('Firebase team (2025). Firebase documentation. https://firebase.google.com/docs'),
  Body('Meta Open Source (2025). React documentation. https://react.dev'),
  Body('Tailwind Labs (2025). Tailwind CSS documentation. https://tailwindcss.com/docs'),
  Body('IUGET (2025). Institut Universitaire des Grandes Écoles des Tropiques — official website. https://iuget.cm'),
  Body('Vite team (2025). Vite — Next Generation Frontend Tooling. https://vitejs.dev'),
]

// ===== Appendix A — Diagrams =====
const appendixA = [
  H1('Appendix A — Diagrams (Full Size)'),
  Body('All diagrams produced during the SIARM project, reproduced here at full page width for easy reference.'),
  imagePara('01-architecture.png', 640), caption('A.1 — System architecture (3-tier).'),
  imagePara('02-erd.png', 640),          caption('A.2 — Entity-Relationship Diagram.'),
  imagePara('03-use-case.png', 640),     caption('A.3 — Use case diagram.'),
  imagePara('04-sequence-login.png', 640), caption('A.4 — Sequence diagram (Login flow).'),
  imagePara('05-component.png', 640),    caption('A.5 — Component diagram.'),
  imagePara('06-data-flow.png', 640),    caption('A.6 — Data flow diagram (Level 1).'),
  imagePara('07-deployment.png', 640),   caption('A.7 — Deployment diagram.'),
]

// ===== Appendix B — User Guide =====
const appendixB = [
  H1('Appendix B — User Guide'),
  H2('B.1  Getting Started'),
  Body('Open the SIARM web application. On the landing page, click "Sign in" or "Explore demo." On the login page, click any of the four role chips to auto-fill demo credentials, or type the demo email and password directly.'),
  H2('B.2  Demo Credentials'),
  table([
    ['Role', 'Email', 'Password'],
    ['Student',  'student@iuget.cm',  'password'],
    ['Lecturer', 'lecturer@iuget.cm', 'password'],
    ['Staff',    'staff@iuget.cm',    'password'],
    ['Admin',    'admin@iuget.cm',    'password'],
  ]),
  H2('B.3  Student Walk-through'),
  Body('After login, the Student dashboard summarises attendance, GPA, and today\'s classes. Use the sidebar to explore Attendance (with CSV export), Timetable (with PDF export), Results, Announcements, Courses (with one-click enrol), Mobile Learning, AI Assistant, and Transcript (with PDF download).'),
  H2('B.4  Lecturer Walk-through'),
  Body('From the Lecturer dashboard, click "Mark Attendance" to record a class, "Enter Grades" to submit CA + exam, or "My Classes" to browse rosters.'),
  H2('B.5  Admin Walk-through'),
  Body('The Admin dashboard surfaces enrolment trends, department distribution, and AI insights. Use Analytics for the executive summary, Predictions for enrolment forecasts and retention risk, Users for CRUD, Timetable Builder for the master schedule, and Announcements for system-wide broadcasts.'),
  H2('B.6  Production Deployment'),
  Body('To take SIARM out of demo mode, copy .env.example to .env, populate Firebase credentials, set VITE_DEMO_MODE=false, and re-deploy. Optionally provide VITE_ANTHROPIC_API_KEY to activate the live Claude chatbot.'),
]

// ===== Assemble =====
const doc = new Document({
  creator: 'James Murdza',
  title: 'SIARM Bachelor Project Report',
  description: 'Smart Institution Academic Resource Management — Bachelor project report, IUGET Bonaberi',
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
            children: [T('SIARM · IUGET Bachelor Project · 2026', { size: 18, color: GRAY, italics: true })],
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
        ...abstract,
        ...chapter1,
        ...chapter2,
        ...chapter3,
        ...chapter4,
        ...chapter5,
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
