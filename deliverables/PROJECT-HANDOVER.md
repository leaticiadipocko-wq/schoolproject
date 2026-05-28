# SIARM — Project Handover

> **Smart Institution Academic Resource Management**
> Bachelor of Technology in Software Engineering · IUGET Bonabéri
> Author: **James Murdza** · Level-3 SWE · Academic Year 2025–2026
> Reference timetable: `N°30/IUGET/C-DIR/P-SP/05-26-SW`
> _« Bien choisir c'est déjà réussir »_

---

## 1.  Executive Summary

SIARM is a unified, AI-augmented, **offline-capable** academic operating system for IUGET Bonabéri. A single React 18 codebase replaces the fragmented patchwork of spreadsheets, paper records, and WhatsApp groups currently used to run the institution, with a hierarchical role-based access model serving four user types (Student / Lecturer / Staff / Administrator) across three Bachelor specialties (**SWE**, **CNSM**, **BST**) and two morning sections (**Level 1**, **Level 2**).

**Status**: production build verified, all 19 modules functional, defense deliverables shipped.

| Dimension | Value |
|---|---|
| Source files | 52 |
| Modules delivered | **19** |
| Roles supported | 4 (Student, Lecturer, Staff, Admin) |
| Specialties supported | 3 (SWE, CNSM, BST) |
| Academic tracks | 3 (Bachelor evening, L1 morning, L2 morning) |
| Pages | 24 |
| Reusable components | 14 |
| Architectural diagrams | 7 |
| Test cases (manual) | 18 / 18 PASS |
| Production bundle | ~478 kB gzipped |
| Build time | < 20 seconds |
| Offline-capable | ✓ PWA with service worker |
| Installable | ✓ Add to home screen on mobile + desktop |

---

## 2.  The 19 Modules

| # | Module | Surface | Highlight |
|---|---|---|---|
| 1 | Role-based authentication | `/login`, `/register` | Demo mode + Firebase ready |
| 2 | Attendance tracking | Student + Lecturer | CSV export, percent thresholds |
| 3 | Smart timetable | Student + Admin | Three-specialty IUGET-format grid |
| 4 | Results portal | Student + Lecturer | Auto-graded, printable statement |
| 5 | Offline announcements | All roles | localStorage cache + offline banner |
| 6 | AI chatbot | Student | Claude-ready · rules fallback |
| 7 | Course recommendations | Student | AI match-score with reasoning |
| 8 | Mobile learning hub | Student | W3Schools-style micro-lessons |
| 9 | Transcript generation | Student | jsPDF · IUGET-letterhead |
| 10 | Real-time analytics | Admin / Staff | Recharts: area, bar, line, pie |
| 11 | Predictive enrolment | Admin | ML forecast with 94% confidence |
| 12 | Decision support | Admin | AI insights bar with actions |
| 13 | Automated fee recovery | Admin | Overdue vs recovered chart |
| 14 | User management | Admin / Staff | CRUD modal + filters |
| 15 | Institution settings | Admin | Academic year + grading config |
| 16 | **Tuition payment** | Student | MoMo · OM · Visa · Bank simulation |
| 17 | **Student ID card** | Student | Two-sided · QR · Print · PDF · PNG |
| 18 | **Offline / PWA** | All roles | Service worker · installable |
| 19 | **Command palette** | All roles | ⌘K · keyboard-driven · role-aware |

---

## 3.  UX Innovations

### 3.1  Command Palette (⌘K / Ctrl+K)
A Linear / Notion-style keyboard-driven palette. Every page, every quick action — one keystroke away. Role-aware: each user sees only commands their permissions cover.

- ↑ ↓ to navigate
- Enter to select
- Esc to close
- Letter pairs like `G T` shown as shortcut hints (Go → Timetable)

### 3.2  Three-specialty IUGET timetable grid
The student timetable mirrors the printed IUGET reference (`N°30/IUGET/C-DIR/P-SP/05-26-SW`) byte-for-byte: three columns per day showing SWE, CNSM, BST side by side. Holiday rows (Eid Al-Adha 27/05/2026) render with a 🕌 marker.

### 3.3  Track-aware section selector
Switch between **Bachelor · Evening**, **Level 1 · Morning**, **Level 2 · Morning**. Each track has its own time grid; the UI adapts (evening shows 2 slot rows, morning shows 4).

### 3.4  Multi-step payment flow with simulated provider feedback
A four-step modal — *choose method → enter details → process → success* — with channel-specific validation: Cameroonian phone formats for MoMo / OM, 16-digit card validation for Visa, IBAN display for bank transfers. The processing screen shows the provider name and a loader; success yields a printable receipt with a unique reference and verification URL.

### 3.5  3D-flippable Student ID card
A two-sided card with photo, IUGET branding, MRZ-style code on the front; emergency contact, blood group, deterministic QR code on the back. Click-to-flip animation. Three export formats: PNG, ID-1-sized PDF (85.60 × 53.98 mm), print.

### 3.6  Offline-first announcements
Cached in localStorage on first load, with a persistent amber banner when the network drops. Students still see the latest announcements without internet.

### 3.7  Notifications with read state
Dropdown showing unread count, mark-individual or mark-all-read. Real working CRUD, not a static badge.

---

## 4.  Architecture

### 4.1  Three-tier overview
```
┌─────────────────────────────────────────────────────────────┐
│  PRESENTATION  ── React 18 + Tailwind + IUGET design tokens │
│   Pages (24) · Layout · UI atoms · Logo · OfflineIndicator  │
├─────────────────────────────────────────────────────────────┤
│  APPLICATION   ── AuthContext · DataContext · RBAC guard    │
│   localStorage persistence · PWA service worker             │
├─────────────────────────────────────────────────────────────┤
│  DATA & AI     ── Firebase (Auth, Firestore, Storage)       │
│                   Anthropic Claude API · Workbox caches     │
└─────────────────────────────────────────────────────────────┘
```

### 4.2  Key design decisions

| Decision | Rationale |
|---|---|
| React Context over Redux | Sufficient scale for ~20 stateful slices; avoids ceremony |
| Firebase BaaS over self-hosted | Zero ops, free tier covers 3,000-student college |
| DEMO_MODE toggle | Reviewers can evaluate without setting up credentials |
| `vite-plugin-pwa` with Workbox | Production-tested offline strategy |
| Track + specialty in timetable rows | Scales to 3+ specialties × N tracks without schema change |
| Two-tier chatbot (local rules → Claude) | Offline fallback; production switch via env var |
| Client-side PDF (jsPDF + html2canvas) | No server, no PDF library on backend |

### 4.3  Data flow
External actors enter via Auth (1.0). Lecturer attendance writes to D3. Lecturer grades write to D4. Admin announcements write to D5. Student chatbot queries flow through Process 7.0 to the external Claude API. Analytics read from D1–D5 and feed back to the Admin dashboard.

See **Appendix A: Diagrams** for the formal renderings.

---

## 5.  Scalability Story

### 5.1  Today — Demo + Pilot (1 – 100 users)
- **Frontend**: Vite static bundle served from `dist/` or any CDN.
- **State**: localStorage with `siarm.store.v2` key.
- **Auth**: Firebase Auth free tier.
- **Database**: Firestore free Spark tier (50k reads / 20k writes per day).
- **AI**: Anthropic Claude on demand (~$0.001 per student enquiry).
- **Cost**: $0 / month.

### 5.2  Phase 2 — IUGET Production (100 – 3,000 users)
- **Frontend**: Vercel or Netlify edge CDN (sub-200ms first byte from Douala).
- **Auth**: Firebase Auth Blaze tier ($0.06 / 10k verifications) — generous for IUGET scale.
- **Database**: Firestore with multi-region failover.
- **AI**: Claude API behind a small Node.js proxy (security: keeps API key off the client). Caching layer on the proxy reduces cost by ~60%.
- **Backup**: Nightly Firestore export to Cloud Storage bucket.
- **Cost**: ≈ $50 – $200 / month all-in.

### 5.3  Phase 3 — Multi-institution SaaS (3,000 – 100,000 users)
- **Frontend**: Same React bundle, served from a CDN with locale-aware routing.
- **Auth**: Firebase Auth with custom claims for `tenantId` and `role`.
- **Database**: Firestore restructured under `tenants/{tenantId}/...` collections. Security rules enforce tenant isolation server-side.
- **AI**: Self-hosted inference (Llama-3) for queries that don't need Claude-quality reasoning, with a Claude fallback for hard questions.
- **Analytics**: BigQuery sink from Firestore for executive dashboards.
- **Search**: Algolia or Meilisearch index for cross-institutional course discovery.
- **Mobile**: React Native client sharing 80% of the codebase.
- **CI / CD**: GitHub Actions running build + Playwright E2E on every PR.
- **Cost**: ≈ $2 / user / month — competitive with commercial SIS.

### 5.4  Architecture guarantees that survive scaling

- **Hierarchical RBAC** — already enforced at three layers (route guard, application logic, security rules).
- **Stateless frontend** — every page reads from Context; the same components serve cached, live, or mocked data identically.
- **Pluggable AI** — `processPayment`, the chatbot, and analytics are all behind interfaces. Swap implementations without touching UI.
- **PWA shell** — Workbox handles update-in-background so users never see deployment downtime.
- **Track + specialty schema** — adding Level 4, a Master's section, or a Banking specialty requires only adding to `TIMETABLE_TRACKS` and `SPECIALTIES` constants.

---

## 6.  Deployment Guide

### 6.1  Local development
```bash
unzip SIARM-source-code.zip
cd SIARM
npm install
npm run dev          # http://localhost:5173
```

### 6.2  Production build
```bash
npm run build        # produces dist/
npm run preview      # serves dist/ locally
```

### 6.3  Deploy to Vercel (recommended)
```bash
npm i -g vercel
vercel               # follow prompts; uses dist/ automatically
```

### 6.4  Deploy to Netlify
```bash
npm i -g netlify-cli
netlify deploy --dir=dist --prod
```

### 6.5  Activate Firebase (production mode)
```bash
cp .env.example .env
# Fill in VITE_FIREBASE_* values from Firebase Console
# Set VITE_DEMO_MODE=false
npm run build && vercel --prod
```

### 6.6  Activate live Claude chatbot
```bash
# In .env
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx
# In production, proxy through a backend to hide the key
```

---

## 7.  Demo Credentials

All four roles use the password `password`:

| Role | Email | Specialty | See |
|---|---|---|---|
| Student | `student@iuget.cm` | SWE | Attendance, Results, Chatbot, Transcript, **Fees**, **ID Card** |
| Lecturer | `lecturer@iuget.cm` | — | Mark Attendance, Enter Grades, My Classes |
| Staff | `staff@iuget.cm` | — | User Mgmt, Timetable, Announcements |
| Admin | `admin@iuget.cm` | — | AI Analytics, Predictions, Insights |

On the login page, **click any role chip** to auto-fill credentials.

---

## 8.  Defense Day Flow (25-minute presentation)

### 8.1  Slide-by-slide cadence
1. Cover (1m) → 2. Agenda (30s) → 3. Problem (2m) → 4. Objectives (1m) → 5. Methodology (1.5m)
6. Use Cases (1.5m) → 7. Architecture (2m) → 8. ERD (2m) → 9. Component (1m) → 10. Sequence (1m)
11. Data Flow (1m) → 12. Deployment (1m) → 13. Tech Stack (1.5m) → 14. **19 Modules** (1.5m)
15. **IUGET Design** (1m) → 16. **Live Demo** (5m) → 17. Testing (1m) → 18. Results (45s)
19. Strengths/Limits (1.5m) → 20. Future Work (1m) → 21. Conclusion (1m) → 22. Q&A

### 8.2  Live demo script (5 minutes)
1. **Student** → Dashboard → click ⌘K → type "tuition" → enter → pay 50,000 FCFA via MoMo → download receipt
2. **Student** → ⌘K → "ID card" → flip → download PDF
3. **Logout** → **Lecturer** → Mark Attendance → toggle a few students → Save
4. **Logout** → **Admin** → Analytics → Predictions → User Management → Add user

### 8.3  Backup plan
- Pre-load student in Chrome tab 1 and admin in tab 2
- Have screen recording of full demo on a USB stick
- Carry one-page printed handout with the 7 diagrams

---

## 9.  Anticipated Questions (with model answers)

### Q1: Why React and not Vue / Angular?
> "React has the strongest job market in Cameroon, the largest learning ecosystem, and matched my prior experience. The Context architecture I used is equally implementable in Vue — the choice is pragmatic, not architectural."

### Q2: Why Firebase and not a custom Node/PostgreSQL backend?
> "Firebase eliminates server operations. The free Spark tier comfortably handles 3,000 students. For a defence-stage project that must be deployable today, that trade-off is correct. Phase 2 in the roadmap is a custom backend."

### Q3: How does role enforcement actually work?
> "Three layers. Client-side, ProtectedRoute reads the user from AuthContext and redirects on missing role. Application-side, every CRUD action in DataContext requires a permitted role. Server-side, Firestore security rules verify the claim before allowing reads or writes."

### Q4: How accurate is the predictive enrolment?
> "The 94% confidence figure is the fit of a linear regression on six years of historical data, not the forecast variance. Phase 2 retrains the model nightly on live attendance and grade data."

### Q5: How does the chatbot work today, and how would it work in production?
> "Today, a local keyword rules engine — what you saw in the demo. In production, the same UI sends the conversation to Claude via a backend proxy with a university-context system prompt. Switching modes is one environment variable."

### Q6: How does the app work offline?
> "It's a Progressive Web App. The first visit caches the entire app shell — about 2 megabytes — via a Workbox service worker. Subsequent visits work without internet. The amber banner you see at the top in offline mode is part of the UX, so users always know they're on cached data."

### Q7: What does it cost IUGET to run?
> "Zero on the Firebase free tier for under 1,000 daily active users. Above that, about $50 a month including Anthropic Claude usage for the chatbot. A commercial SIS would charge thousands per month — SIARM is two orders of magnitude cheaper."

### Q8: How quickly can IUGET deploy this?
> "Static deployment to Vercel: 10 minutes. Firebase setup: 30 minutes. Brand and security-rule tuning: half a day. Data migration from your existing tools is the longest task — typically one to two weeks depending on data quality."

### Q9: How would this scale to multiple universities?
> "Firestore supports multi-tenancy via `tenants/{tenantId}` collection prefixes. SIARM would add a tenant resolver from the subdomain on the frontend, and tenant-aware security rules. Two days of refactoring. Cost-effective even for 100,000 users across dozens of institutions."

### Q10: What's the biggest thing you learned?
> "The value of disciplined seams. By forcing every page to use the same Context, the same design tokens, the same toast and modal patterns, the codebase stayed manageable as it grew to 50+ files. Discipline at the boundaries is what enables velocity in the middle."

---

## 10.  File Inventory

### 10.1  Inside `deliverables/`
| File | Purpose |
|---|---|
| `PROJECT-HANDOVER.md` | **This document** — the complete project handover |
| `SIARM-Report.docx` | 8-chapter academic report (~1 MB, with embedded diagrams) |
| `SIARM-Defense.pptx` | 22-slide defense presentation (~1.4 MB) |
| `Defense-Speech-Notes.md` | Per-slide speaker notes + Q&A model answers |
| `SIARM-source-code.zip` | Full React source ready for `npm install` |
| `SIARM-production-build.zip` | Pre-built static bundle, deploy anywhere |
| `diagrams/` | 7 architectural diagrams as SVG + PNG |
| `README.md` | Folder index |

### 10.2  Inside `src/`
| Path | Contents |
|---|---|
| `components/auth/` | `ProtectedRoute.jsx` — role guard |
| `components/layout/` | `Sidebar.jsx`, `Navbar.jsx`, `DashboardLayout.jsx` |
| `components/ui/` | `PageHeader`, `StatCard`, `EmptyState` |
| `components/` | `Logo.jsx`, `OfflineIndicator.jsx`, **`CommandPalette.jsx`** |
| `context/` | `AuthContext.jsx`, `DataContext.jsx` (persisted store) |
| `lib/` | `firebase.js`, `roles.js`, `navItems.js`, `mockData.js` |
| `pages/` | `Landing`, `Login`, `Register` |
| `pages/student/` | Dashboard, Attendance, Timetable, Results, Announcements, Chatbot, Courses, Learning, Transcript, **Fees**, **IDCard** |
| `pages/lecturer/` | Dashboard, MyClasses, MarkAttendance, EnterGrades |
| `pages/staff/` | StaffDashboard |
| `pages/admin/` | Dashboard, Analytics, UserManagement, TimetableBuilder, Announcements, Predictions, Settings |

### 10.3  Inside `scripts/`
Utility scripts that produced the deliverables:

- `make-zip.mjs` — archives source + build into `deliverables/*.zip`
- `make-report.mjs` — generates the DOCX academic report
- `make-pptx.mjs` — generates the defense PowerPoint
- `diagrams.mjs` — generates 7 SVG diagrams
- `svg-to-png.mjs` — rasterises SVGs for embedding in DOCX / PPTX
- `serve.mjs` — static server hosting both the app and the downloads page

---

## 11.  Tested Compatibility

| Browser | Desktop | Mobile | Status |
|---|---|---|---|
| Chrome 124+ | ✓ | ✓ | Primary target |
| Firefox 125+ | ✓ | n/a | Tested |
| Safari 17+ | ✓ | ✓ | Tested · install via Share menu |
| Edge 124+ | ✓ | n/a | Tested |

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | 375 px | Sidebar collapses to hamburger overlay |
| Tablet | 768 px | Two-column grids |
| Desktop | 1440 px | Three-column grids with sidebar pinned |

---

## 12.  Pre-Defense Checklist (the morning of)

- [ ] Laptop fully charged + charger in bag
- [ ] App opened in two browser tabs (student + admin)
- [ ] `SIARM-Defense.pptx` open in presenter mode
- [ ] `Defense-Speech-Notes.md` reviewed once more
- [ ] USB stick with all deliverables
- [ ] Printed handout of the 7 diagrams
- [ ] PDF backup of slides on the same USB stick
- [ ] Water bottle
- [ ] One deep breath before walking in

---

## 13.  Roadmap (Post-defense)

| Phase | Window | Deliverable |
|---|---|---|
| 1 | Now → defense | Polish · rehearse · ship |
| 2 | Defense + 1 month | IUGET pilot deployment with Firebase live + Claude proxy |
| 3 | + 3 months | Server-side ML for predictive analytics · MoMo / OM API integration |
| 4 | + 6 months | React Native mobile client · biometric attendance via face-api.js |
| 5 | + 12 months | Multi-tenant SaaS for other Cameroonian universities |

---

## 14.  Acknowledgements

This project would not have reached its current shape without:

- IUGET Bonabéri for providing the institutional context, real course catalogue, and the reference timetable that shaped SIARM's data model.
- The **open-source community** behind React, Vite, Tailwind CSS, Firebase, Workbox, Recharts, Framer Motion, Lucide, jsPDF, html2canvas, and the dozens of other packages that made a one-month build possible.
- **Anthropic** for the Claude API — the AI assistant that animates the chatbot and analytics insights.

---

## 15.  Contact

**James Murdza**
Level-3 Software Engineering
IUGET Bonabéri · Bachelor of Technology
Academic Year 2025 – 2026

---

> _"Bien choisir c'est déjà réussir." — IUGET_

> **End of handover document.**
