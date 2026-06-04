# SIARM — Software Development Life Cycle (SDLC)

**Project**  SIARM — Smart Institution Academic Resource Management
**Institution** Institut Universitaire du Golfe de Guinée (IUGET) · Campus de Bonabéri, Douala
**Author** James Murdza · Level-3 Software Engineering
**Academic year** 2025 – 2026
**Document version** 1.0

---

## 1. Introduction

This document records the **Software Development Life Cycle** followed during the bachelor project SIARM. It documents which model was chosen, why it fits the constraints of a one-semester student project, and what was actually delivered at each phase. It is intended both as a defence artefact and as a template for the project's future evolution beyond this bachelor work.

The chosen model is an **iterative, Agile-inspired Scrum** approach with five one-week sprints. Each sprint produced shippable functionality that was demonstrated to peers and incorporated their feedback before the next iteration began.

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Planning │→ │ Requir.  │→ │ Analysis │→ │  Design  │→ │ Implem.  │
└──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘
                                                              ↓
                  ┌──────────┐  ┌──────────┐  ┌──────────┐
                  │  Maint.  │← │  Deploy  │← │ Testing  │
                  └──────────┘  └──────────┘  └──────────┘
```

---

## 2. SDLC Phases

### 2.1 Planning (Inception)

| Item | Description |
| --- | --- |
| **Duration** | Week 0 (1 week) — Late February 2026 |
| **Purpose** | Define what the project is, why it matters, and whether it can be delivered within the time available. |
| **Activities** | Vision statement · stakeholder identification · feasibility study (technical, economic, operational) · risk register · scope freeze using MoSCoW |
| **Outputs** | Project charter, stakeholder map, time-boxed scope statement |
| **Tools** | Notes app, whiteboard, Google Docs |

**Decisions taken at planning**

- The project must produce a *working* application that an institution could realistically adopt, not a research prototype.
- The reference institution is IUGET Bonabéri because the author has three years of student experience there.
- The implementation must be deliverable in a single semester by a solo developer.
- Mobile-money payment and offline-capable delivery are non-negotiable because they reflect the real Cameroonian context.

---

### 2.2 Requirements Elicitation

| Item | Description |
| --- | --- |
| **Duration** | Week 1 — Early March 2026 |
| **Purpose** | Capture what the system must do (functional) and how well it must do it (non-functional). |
| **Activities** | Informal interviews with the IUGET registrar and bursary · direct observation of paper-based attendance and grade entry · documentation of the actual fee structure and timetable |
| **Outputs** | 24 functional requirements (FR-X-NN) prioritised with MoSCoW · 10 non-functional requirements · 12 use cases |
| **Stakeholders consulted** | Registrar (Mrs Linda Foncha) · Bursary (Mrs Mariam Tagne) · Three classmates · One parent |

**Three founding insights from elicitation**

1. **Parents** are the most under-served stakeholder. They have no on-line surface, must travel to the campus, queue at the bursary, and receive a paper receipt.
2. **Bursary staff** have no consolidated view of tuition collection; they reconcile mobile-money screenshots manually.
3. **Lecturers** spend at least 30 minutes per week transcribing paper attendance into grade books.

---

### 2.3 Analysis

| Item | Description |
| --- | --- |
| **Duration** | Week 1–2 — Mid March 2026 |
| **Purpose** | Model the problem domain before designing the solution. |
| **Activities** | Identify entities and their relationships · derive use-cases from requirements · build the conceptual data model · sketch the user roles |
| **Outputs** | Conceptual ERD · use-case diagram · role hierarchy · domain glossary |
| **UML artefacts** | Use-case diagram (Figure 4.3 in the report), preliminary class diagram (Figure A.11), preliminary state diagrams for payment (Figure A.12) and enrolment (Figure A.13) |

**Entities identified** — User (abstract) → Student, Lecturer, Staff, Admin · Course · TimetableSlot · Result · Attendance · Payment · Announcement · Enrolment

---

### 2.4 Design

| Item | Description |
| --- | --- |
| **Duration** | Week 2 — Mid March 2026 |
| **Purpose** | Decide the structure of the solution so coding can proceed without architectural surprises. |
| **Activities** | Architecture choice (three-tier) · technology stack selection · database schema · UI design system (colour, typography, spacing) · security model · accessibility plan |
| **Outputs** | Architecture diagram · component diagram · sequence diagrams · data-flow diagram · deployment topology · activity diagram (attendance) · package diagram |
| **Tools** | Excalidraw, Figma sketches, hand-drawn whiteboard, custom-written SVGs |

**Key design decisions**

| # | Decision | Justification |
| - | --- | --- |
| D1 | React 18 + Vite + Tailwind | Fast dev loop, no design drift, small bundle. |
| D2 | Firebase Auth + Firestore | No back-end to maintain; scales to 100k users. |
| D3 | Demo-mode with localStorage fallback | Project must run offline during defence. |
| D4 | Five payment channels with privacy invariant | PIN/password never persisted (enforced as `setPwd('')`). |
| D5 | Three-tier (presentation · persistence · external) | Standard separation; survives every scaling step. |
| D6 | Role-based access control with hierarchical inheritance | Each capability owned by exactly one role. |
| D7 | Bilingual EN/FR through a Context-based dictionary | Lightweight; works offline; no extra dependency. |
| D8 | QR verification on every printable artefact | Anti-fraud touch absent from comparable systems. |

---

### 2.5 Implementation

| Item | Description |
| --- | --- |
| **Duration** | Weeks 3–7 — Late March to late April 2026 |
| **Purpose** | Build the application end-to-end. |
| **Activities** | Code organised in 53 source files across 24 pages and 14 reusable components. |
| **Outputs** | Working web application, deployed locally on the demonstration server. |

**Sprint backlog actually executed**

| Sprint | Focus | Notable deliverables |
| --- | --- | --- |
| S1 | Foundations | Vite + Tailwind scaffolding · Firebase wrapper · AuthContext + DataContext · design system · 53-file scaffold |
| S2 | Student & Lecturer surfaces | Attendance, Timetable (three IUGET specialties: SWE, CNSM, BST), Results, Transcript, ID Card, Announcements |
| S3 | Bursary & Administration | User management, Financial Tracking dashboard, automated Enrolment (single + bulk CSV), Timetable Builder |
| S4 | Public Parent Portal | Marketing landing page · 5-step wizard · five payment channels (MoMo, OM, PayPal, Visa, Bank) with simulated USSD · receipt with QR |
| S5 | Polish & defence | PWA shell · offline indicator · command palette · QR component shared across receipt/results/transcript/ID card · 50-page report · 25-slide presentation · 10 architectural diagrams |
| S6 (added later) | Bilingual + UX polish | EN/FR language toggle · Profile page · Help/FAQ page · ICS calendar export · 5 additional UML diagrams |

---

### 2.6 Testing and Validation

| Item | Description |
| --- | --- |
| **Duration** | Continuous through implementation; consolidated in Week 8 (early May 2026) |
| **Purpose** | Verify that every requirement listed at the analysis phase is met. |
| **Strategy** | Three concurrent test layers — functional, usability, performance. |

**Test summary**

- **Functional** — 25 explicit test cases, 25 passing.
- **Usability** — Three classmates and one administrative staff member completed scripted tasks while the author observed.
- **Performance** — Lighthouse audit on the production build returned 92 / 96 / 100 / 100 (Performance / Accessibility / Best Practices / SEO).
- **Compatibility** — Verified on Chrome, Firefox, Edge, Safari (current and previous major).
- **Offline** — Service worker pre-caches 13 entries (~ 2.1 MB); subsequent visits work without network.
- **Privacy** — Verified that PIN/password React state is reset to the empty string immediately after each simulated provider call.

---

### 2.7 Deployment

| Item | Description |
| --- | --- |
| **Duration** | Continuous (each sprint shipped to the demonstration URL) |
| **Purpose** | Make the application reachable for defence demonstration. |
| **Activities** | Production build (Vite) → deploy to the Daytona-managed demonstration host. |
| **Production guidance** | Vercel or Netlify free tier for the SPA · Firebase free tier for authentication and persistence. |

**Current demonstration deployment**

- Static assets served from a Node 22 server at `http://0.0.0.0:4173`.
- Service worker pre-caching enabled.
- Routes verified at every commit: `/`, `/parent`, `/parent/register`, `/login`, `/deliverables`, and the protected role surfaces.

---

### 2.8 Maintenance

| Item | Description |
| --- | --- |
| **Activities** | Bug fixes after the defence · adoption support if IUGET pilots the platform · prepare a real-Firebase migration. |
| **Strategy** | Continuous integration via GitHub Actions (planned) · semantic versioning · `CHANGELOG.md` per release. |
| **Backups** | Firestore export weekly · static-assets bundle archived per release. |

---

## 3. Why iterative Scrum, not waterfall?

The waterfall model would have been simpler to document, but it would have produced a less defensible result at the same time-budget. With one developer, one semester, and an evolving understanding of what IUGET actually needs, an iterative approach was indispensable.

Each one-week sprint produced a *visible* and *demonstrable* increment. Mistakes were caught and corrected the following week instead of after a year of design. The five sprints were not pre-planned in detail; each was scoped from the requirement backlog at the start of the week.

---

## 4. Risk Register

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Solo developer burnout | High | High | Time-boxing per sprint; honest weekly retrospective. |
| Scope creep | Very high | Very high | MoSCoW at planning; feature freeze 2 weeks before defence. |
| Daytona sandbox availability | Medium | High | Periodic local backups of the source-code zip. |
| Firebase free-tier limits | Low | Medium | Demo-mode with localStorage fallback. |
| Browser compatibility | Medium | Medium | Test on 4 browsers each sprint. |
| Privacy regression in payment | Medium | Very high | Explicit `setPwd('')` invariant + dedicated test case. |

---

## 5. Tools used per phase

| Phase | Tools |
| --- | --- |
| Planning | Pen & paper · Google Docs · Notes app |
| Requirements | Interviews · Google Forms |
| Analysis | Excalidraw · UML by hand |
| Design | Figma sketches · Tailwind config |
| Implementation | VS Code · Vite · Tailwind · React 18 · Firebase SDK · Lucide icons · Framer Motion · Recharts · jsPDF · html2canvas |
| Testing | Browser DevTools · Lighthouse · Manual scripts |
| Deployment | Daytona sandbox · Node static server |
| Documentation | `docx` library (Word) · `pptxgenjs` (PowerPoint) · custom SVG → PNG via `sharp` |

---

## 6. Lessons learned

1. **Privacy by construction beats privacy by policy.** Encoding `setPwd('')` as the last step of every payment handler is more reliable than a written policy.
2. **A flyer-style hero outperforms a sober one for a parent audience.** The decision to dedicate one full screen to the IUGET tuition figure paid off in the usability sessions.
3. **A monorepo for code + documents + diagrams works.** Keeping the report and PowerPoint generators in `scripts/` and the diagrams as committed SVGs means the entire defence package can be regenerated reproducibly.
4. **Translation should ship in v1.** Adding French in a later sprint required revisiting every page; a Context-based dictionary added on day one would have been cheaper.
5. **Demo data drives demo confidence.** The presence of *Chituh Innocentia*, *Nkwenti Deshnic* and the real lecturers — instead of `John Doe` — makes the demo feel rooted.

---

## 7. Conclusion

The Agile Scrum approach, scoped through MoSCoW and supported by a small but well-chosen toolchain, allowed a working academic platform to be delivered within a single semester by one developer. Every phase of the SDLC produced a tangible artefact that contributes to the defence package: the planning produced the charter, the requirements produced the FR / NFR tables, the analysis produced the UML diagrams, the design produced the architecture, the implementation produced the code, the testing produced the validated test cases, and the deployment produced the live demonstration URL.

The same SDLC can be re-used by future maintainers of SIARM: clone the repository, read this document, and continue from Sprint 7 onward.

— *James Murdza · Level-3 Software Engineering · IUGET Bonabéri · 2026*
