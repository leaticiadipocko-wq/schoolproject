# SIARM Defense — Speech Notes

> Time budget: ~25 minutes presentation + 10 minutes Q&A.
> Speak slowly. Make eye contact. Refer to slides naturally — do not read them.

---

## Slide 1 · Cover (1 min)

> "Good morning, members of the jury. My name is James Murdza, Level-3 Software Engineering. Today I'm presenting **SIARM — Smart Institution Academic Resource Management** — a unified academic platform I built for IUGET. It brings 15 administrative and pedagogical workflows into one role-aware web application."

---

## Slide 2 · Agenda (30 sec)

> "I'll cover: the problem we're solving, my objectives, the methodology I followed, the system design, the implementation, a live demo, testing, and finish with results, limitations, and future work. Then I'll take your questions."

---

## Slide 3 · Problem (2 min)

> "Private universities in Cameroon — including IUGET — face six recurring pains. **Fragmented systems**: attendance is on paper, grades are on Excel, announcements live on WhatsApp. **Manual processes** slow down operations and introduce errors. **Limited insight**: leadership has no real-time view of who's at risk. **Connectivity**: many students operate in low-bandwidth conditions. **No personalization**: students get generic course advice. And **no 24/7 support**: questions outside office hours go unanswered. SIARM addresses all six."

---

## Slide 4 · Objectives (1 min)

> "My general objective was to design and build a unified AI-augmented academic platform tailored for IUGET. The six specific objectives are listed here — and as we'll see, all six have been met."

---

## Slide 5 · Methodology (1.5 min)

> "I followed a design-science research method: identify a problem, design an artefact, build it, demonstrate it, and evaluate it. The implementation used four agile sprints, each delivering a usable increment. I evaluated SIARM on five criteria: functional completeness, role enforcement, persistence, performance, and defensibility."

---

## Slide 6 · Use Cases (1.5 min)

> "Four actors interact with SIARM: Student, Lecturer, Staff, and Administrator. The diagram shows 17 use cases. Note the hierarchy — higher roles inherit the capabilities of all roles below them. The system boundary makes clear which actions are inside SIARM versus delegated to external services like the Claude AI."

---

## Slide 7 · Architecture (2 min)

> "SIARM uses a classical three-tier architecture. The **presentation layer** is a React 18 single-page application with Tailwind CSS. The **application logic layer** uses React Context for state, with a ProtectedRoute component enforcing role-based access. The **data and services layer** is Firebase — Auth, Firestore, and Storage — with the Anthropic Claude API for AI. The dashed line shows the AI integration is optional and pluggable."

---

## Slide 8 · ERD (2 min)

> "Nine core entities. A User can be either a Student or a Lecturer. Students Enrol in Courses; Enrolments yield Attendance records and Results. Lecturers publish Announcements and own TimetableSlots. Although Firestore is schema-less, this conceptual model is enforced by my application code and by Firestore security rules."

---

## Slide 9 · Component Diagram (1 min)

> "The 50 source files organise into pages, layout shells, atomic UI components, contexts, and libraries. Pages depend on layout and context. Layout depends on UI atoms and context. This separation supports testability."

---

## Slide 10 · Sequence Diagram (1 min)

> "Login is the canonical flow that exercises every layer. The student submits credentials, Login page calls AuthContext, which calls Firebase Auth and then Firestore for the user profile. The user object is returned and the dashboard renders. This same pattern applies to every protected action."

---

## Slide 11 · Data Flow (1 min)

> "At the data-flow level: seven processes, five logical data stores. Students drive Auth and Chatbot; Lecturers drive Attendance and Results; Admins drive Analytics. The Claude API is a special external entity that the Chatbot process talks to."

---

## Slide 12 · Deployment (1 min)

> "Three deployment nodes. The user's browser runs the React SPA and a service worker for offline caching. A static CDN — Vercel or Netlify — serves the bundle. The Firebase backend is managed; the Claude API is hosted by Anthropic. Nothing is self-hosted, which is appropriate for an institution that doesn't want to operate infrastructure."

---

## Slide 13 · Tech Stack (1.5 min)

> "Every dependency had to earn its place. React for the component model, Tailwind for utility-first styling with IUGET tokens, React Router for nested routes with guards, Context for state because the app doesn't need Redux complexity. Firebase to avoid backend ops on the Spark free tier. Claude SDK for the highest-quality AI responses. Recharts, jsPDF, Framer Motion, Lucide — all small, focused, well-maintained."

---

## Slide 14 · 15 Modules (1.5 min)

> "Every module on your original list is implemented and demonstrable. From authentication to settings — all 15 work end-to-end with persistent state."

---

## Slide 15 · IUGET Design System (1 min)

> "I built a custom design system around IUGET's brand identity: navy as primary, red as accent, gray for borders, slate for backgrounds. Two fonts — Inter for body, Space Grotesk for display headings. The platform feels institutional, not like a generic template."

---

## Slide 16 · Live Demo (5 min)

> "Now let me show you the platform live."

**Open the app. Use the demo accounts in order:**

1. **Student** (`student@iuget.cm` / `password`)
   - Show the dashboard, attendance chart, today's classes
   - Open the AI Chatbot, ask "When are the exams?"
   - Open Courses, enrol in CS402 — point out the toast
   - Open Transcript, click "Download PDF" — show the PDF
   - Logout

2. **Lecturer** (`lecturer@iuget.cm` / `password`)
   - Open "Mark Attendance" — click "All present", then deselect a few, click "Save"
   - Open "Enter Grades" — change a CA value, watch the grade letter update live, "Submit"
   - Logout

3. **Admin** (`admin@iuget.cm` / `password`)
   - Show the analytics dashboard with the enrolment chart
   - Open Predictions — show the 2026 forecast with 94% confidence
   - Open User Management — click "Add user", create a fake user, edit them, delete
   - Open Timetable Builder — click an empty cell, fill it, click another cell to edit
   - Open Announcements — write a quick announcement, publish — show it appears in the recent list

---

## Slide 17 · Testing (1 min)

> "I executed 18 manual functional test cases covering authentication, lecturer actions, admin actions, student actions, AI behaviour, and persistence. Every test passed. I also validated cross-browser and three responsive breakpoints, and confirmed WCAG AA contrast compliance."

---

## Slide 18 · Quantitative Results (45 sec)

> "Quantitatively: 50 source files, ~8,800 lines of code, 22 pages, 15 modules, 12 reusable components, 7 diagrams. The production bundle is 464 kilobytes gzipped. The build completes in under 20 seconds."

---

## Slide 19 · Strengths & Limitations (1.5 min)

> "Strengths first: single codebase, demo-ready without infrastructure, production-ready with one environment variable, every choice is justifiable, and the IUGET branding is native — not bolted on.
> Honest limitations: demo mode is client-only, the chatbot uses rules until a Claude key is added, predictive enrolment uses precomputed values, there's no automated test suite, and there's no native mobile app yet. Each limitation has a planned resolution."

---

## Slide 20 · Future Work (1 min)

> "The roadmap is concrete. Live AI through a backend proxy. A server-side ML model trained nightly. A native mobile app via Capacitor. Biometric attendance with face-api.js. Local payments through Orange Money and MTN Mobile Money. Automated testing with Vitest and Playwright. Full bilingual French / English support."

---

## Slide 21 · Conclusion (1 min)

> "SIARM proves that a single Level-3 student, working over four weeks, can deliver a unified academic platform that competes on UX and architecture with much larger commercial systems. All six objectives have been met. For IUGET it's a deployable migration path. For me it's proof of the judgement expected of a graduating software engineer. For others it's a reference architecture they can adopt."

---

## Slide 22 · Q&A

> "Thank you for listening. I welcome your questions."

---

## Anticipated questions and short answers

### Q1: Why React and not Vue / Angular / Svelte?
> "React has the largest job market in Cameroon, the most learning material, and matched my prior experience. The Context-based architecture I used is equally implementable in Vue, so the choice is not architectural — it's pragmatic."

### Q2: Why Firebase and not a custom backend?
> "Firebase eliminates server operations. The free Spark tier comfortably handles thousands of users. For a defence-stage project that needs to be deployable today, the trade-off favours managed services. A custom Node.js / PostgreSQL backend is the natural Phase 2."

### Q3: How do you handle security?
> "Authentication is JWT-based via Firebase. Role enforcement happens at three layers: client-side route guards, application logic in DataContext, and server-side Firestore security rules. Sensitive operations like user deletion require admin role, which is verified server-side."

### Q4: How accurate is the predictive enrolment?
> "In this iteration, the projection is precomputed from a six-year historical series. The 94% confidence figure refers to the fit of the linear regression, not the forecast variance. The future-work roadmap commits to a server-side model retrained nightly."

### Q5: How does the chatbot actually work right now?
> "Two-tier strategy. By default a local keyword rules engine matches the question and returns a pre-written response — that's what you saw in the demo. When VITE_ANTHROPIC_API_KEY is set, the same UI sends the conversation to Claude with a university-context system prompt. The switching is automatic."

### Q6: What does it cost to run?
> "On Firebase free tier: zero, up to 50k reads / 20k writes per day. Anthropic Claude charges per token; a typical student enquiry costs about $0.001. For an institution of 3,000 students with moderate AI usage, expect under $50/month."

### Q7: How long would it take to deploy at IUGET?
> "Static deployment to Vercel takes 10 minutes. Firebase project setup is 30 minutes. Custom branding tweaks and security rule customisation, maybe a day. The hardest part is data migration from existing tools — that's where most of the integration effort would go."

### Q8: How do you handle offline?
> "Today: localStorage for announcements with an offline indicator badge in the UI. Tomorrow: a full service worker for the app shell with IndexedDB and queued mutations that sync when connectivity returns."

### Q9: How would this scale to multiple universities?
> "Firestore supports multi-tenancy via top-level collection prefixes. SIARM would add a tenants/{tenantId} root collection and rewrite the security rules. The frontend would resolve the tenant from the subdomain. Two days of refactoring."

### Q10: What's the biggest thing you learned?
> "The value of consistent constraints. By forcing every page to use the same Context, the same design tokens, the same toast system, the codebase stayed manageable as it grew to 50 files. Discipline at the seams enables velocity in the middle."

---

## During the live demo — recovery tactics

| If… | Then… |
|---|---|
| The Wi-Fi cuts out | Demo continues — everything works offline (localStorage). |
| You lose your place | Pause for 2 seconds, look at the sidebar, restart on the dashboard. |
| A button doesn't respond | Refresh once — store reloads instantly. |
| Jury asks for a feature mid-demo | "Excellent question — let me show you" → navigate from sidebar. |
| Time is short | Skip Mobile Learning and Settings. Cover all 3 roles. |

---

## Defense checklist (the morning of)

- [ ] Laptop charged, charger in bag
- [ ] App pre-loaded in two browser tabs (logged in as student in one, admin in the other)
- [ ] Slides open in fullscreen mode
- [ ] All four deliverables on a USB stick
- [ ] PDF of slides in case projector fails
- [ ] One-page printed handout with diagrams (for jury)
- [ ] Water bottle
- [ ] Calm breath

Good luck. You've built something real. Trust it.
