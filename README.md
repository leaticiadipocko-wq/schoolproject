# SIARM — Smart Institution Academic Resource Management

> Bachelor project · IUGET Bonaberi · 2026

A unified, AI-augmented academic operating system for private universities.
SIARM brings attendance, results, timetables, AI analytics, mobile learning, decision support,
predictive enrollment, and offline announcements into one seamless platform — with a strict
hierarchical role-based access model (Student / Lecturer / Staff / Admin).

---

## ✨ Modules

| # | Module | Status |
|---|---|---|
| 1 | Role-based authentication (4 roles) | ✅ |
| 2 | Attendance tracking | ✅ |
| 3 | Smart timetable + AI optimization | ✅ |
| 4 | Results & grade entry | ✅ |
| 5 | Offline announcements portal | ✅ |
| 6 | AI chatbot for university enquiries | ✅ |
| 7 | Intelligent course recommendations | ✅ |
| 8 | Mobile learning hub (W3Schools-style) | ✅ |
| 9 | Transcript generation (PDF) | ✅ |
| 10 | Real-time analytics dashboard | ✅ |
| 11 | Predictive enrollment system | ✅ |
| 12 | Decision support & AI insights | ✅ |
| 13 | Automated fee recovery analytics | ✅ |
| 14 | User management | ✅ |
| 15 | Institution settings | ✅ |

---

## 🚀 Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Run in demo mode (no Firebase needed)
npm run dev
```

Open `http://localhost:5173`.

### Demo credentials

| Role | Email | Password |
|---|---|---|
| Student   | `student@siarm.edu`   | `password` |
| Lecturer  | `lecturer@siarm.edu`  | `password` |
| Staff     | `staff@siarm.edu`     | `password` |
| Admin     | `admin@siarm.edu`     | `password` |

---

## 🔌 Connect to Firebase (production mode)

1. Create a Firebase project at <https://console.firebase.google.com>
2. Enable **Authentication → Email/Password** and **Firestore Database**
3. Copy `.env.example` to `.env` and fill in your Firebase keys
4. Set `VITE_DEMO_MODE=false`
5. Restart `npm run dev`

A `users` document is created in Firestore for each registered user with:
`{ uid, email, name, role, avatar, createdAt }`

---

## 🤖 Connect Claude (AI chatbot)

```bash
# In .env
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx
```

> ⚠ For production deployment, proxy AI requests through a backend so the API key is not exposed
> client-side. The current setup is for development/defense-demo purposes only.

---

## 🧱 Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** with custom design system (brand: indigo + cyan)
- **React Router 6** with role-guarded routes
- **Firebase 11** (Auth + Firestore + Storage)
- **Recharts** for analytics dashboards
- **Framer Motion** for animations
- **jsPDF** + **html2canvas** for transcript generation
- **Lucide React** for icons
- **React Hot Toast** for notifications

---

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/             # ProtectedRoute
│   ├── layout/           # Sidebar, Navbar, DashboardLayout
│   ├── ui/               # PageHeader, StatCard, EmptyState
│   └── Logo.jsx
├── context/
│   └── AuthContext.jsx   # Auth provider with demo + Firebase modes
├── lib/
│   ├── firebase.js       # Firebase init + DEMO_MODE flag
│   ├── roles.js          # Role hierarchy & helpers
│   ├── navItems.js       # Sidebar nav per role
│   └── mockData.js       # Demo data for all modules
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── student/          # 9 student pages
│   ├── lecturer/         # 4 lecturer pages
│   ├── staff/            # Staff dashboard
│   └── admin/            # 7 admin pages
├── App.jsx               # Routes
├── main.jsx              # Entry
└── index.css             # Tailwind + design tokens
```

---

## 🎓 Defense Notes

This project demonstrates:

- A **production-ready React frontend architecture** (component composition, context-based state, route guarding)
- A **role-based access control model** matching real university hierarchies
- **AI integration patterns** (chatbot, predictive analytics, recommendations) ready for Claude/OpenAI APIs
- **Offline-first patterns** (localStorage caching for announcements)
- **Document generation** (client-side PDF transcripts)
- **Data visualization** (Recharts: line, bar, area, pie charts)
- A **unified design system** that scales from mobile to desktop

### Roadmap (post-defense)

- [ ] Move AI requests to a backend proxy
- [ ] Add service worker for full offline app shell
- [ ] Biometric attendance via webcam + face-api.js
- [ ] Native mobile build via Capacitor
- [ ] WebSocket real-time chat (lecturer ↔ student)

---

## 📜 License

Bachelor project — © 2026 IUGET Bonaberi
