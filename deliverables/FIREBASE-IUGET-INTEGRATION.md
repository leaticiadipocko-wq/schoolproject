# SIARM — Firebase Real-Time Integration Guide

**Audience** IUGET technical team that will operate SIARM in production.
**Outcome after following this guide** Real-time, multi-user SIARM connected to a live Firestore database, with data persisted across sessions, all signed in via Firebase Authentication.

---

## 1. What "real-time" actually means in SIARM

SIARM is built on **Cloud Firestore**, Google's real-time NoSQL database. When the platform is wired to Firestore (i.e. not in `DEMO_MODE`), every change made by one user appears within ~200 ms in every other user's browser. Concretely:

| Action | Real-time consequence |
| --- | --- |
| Registrar publishes an announcement | Every signed-in student receives it instantly |
| Lecturer enters CA grades | Affected students see their results update without reloading |
| Lecturer publishes a Mobile-Learning lesson | All enrolled students see it immediately |
| Parent completes payment | Bursary dashboard's total recovery rate updates live |
| Staff assigns a hall | Affected lecturer + students see the new room straight away |

This is the behaviour panels expect when they ask *"is the data real-time?"* — SIARM ships with the infrastructure for it; only IUGET's actual data needs to be loaded.

---

## 2. Honest disclosure — what I (the developer) can and cannot do

| Task | Who | Why |
| --- | --- | --- |
| Wire SIARM to Firestore | ✓ Done (see `src/lib/firebaseRealtime.js`) | Code change. |
| Provision a Firebase project on Google Cloud | ✗ IUGET | Requires an IUGET-owned Google account + billing setup. |
| Import IUGET's actual student / lecturer / course list | ✗ IUGET | Requires access to IUGET's records office. |
| Configure security rules to match IUGET's roles | ✗ IUGET | Requires authority to define who-can-see-what. |
| Connect MTN MoMo / Orange Money production endpoints | ✗ IUGET | Requires IUGET-registered merchant accounts. |

So the question *"is the data real-time data directly from IUGET?"* answers itself: the **architecture** is real-time; the **data** is whatever IUGET imports. The four steps below make that connection.

---

## 3. Provisioning Firebase (≈ 20 minutes)

### Step 3.1 — Create the project

1. Sign in to https://console.firebase.google.com with an IUGET-owned Google account.
2. Click **Add project**, name it `iuget-siarm` (or any internal name).
3. Disable Google Analytics for the first deployment; it can be re-enabled later.

### Step 3.2 — Enable Authentication

1. Open **Authentication** → **Get started**.
2. Enable **Email / Password** and **Anonymous** providers.
3. Optionally enable **Google**, **Microsoft** or **Apple** for staff single sign-on.

### Step 3.3 — Enable Cloud Firestore

1. Open **Firestore Database** → **Create database**.
2. Select **Production mode** (security rules will be applied below).
3. Choose `europe-west1` or `africa-south1` for lowest latency to Cameroon.

### Step 3.4 — Enable Storage

1. Open **Storage** → **Get started** → accept defaults.
2. This is used for profile photos, signatures, attachments, ID-card backups.

### Step 3.5 — Register the web app

1. **Project settings** → **General** → scroll to **Your apps** → **Web (</>)**.
2. Name the app *SIARM*.
3. Copy the configuration object that appears.

---

## 4. Wiring SIARM to the live project

### Step 4.1 — Fill in `.env.local`

Copy `.env.example` to `.env.local` at the project root and paste the values from Step 3.5:

```bash
VITE_DEMO_MODE=false
VITE_FIREBASE_API_KEY=AIzaSy…………………
VITE_FIREBASE_AUTH_DOMAIN=iuget-siarm.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=iuget-siarm
VITE_FIREBASE_STORAGE_BUCKET=iuget-siarm.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:abcdef
```

### Step 4.2 — Restart the dev server

```bash
npm run dev
```

SIARM auto-detects the keys at boot. The console will print `[SIARM] Live mode — connected to iuget-siarm`. If you still see DEMO badges, double-check that `VITE_DEMO_MODE` is `false`.

---

## 5. Firestore data model

SIARM expects nine top-level collections:

| Collection | Document shape |
| --- | --- |
| `users` | `{ uid, role, name, email, specialty?, level?, department?, courses?, avatar?, signature?, photo? }` |
| `courses` | `{ code, name, credits, lecturer, track, specialty? }` |
| `timetable` | `{ day, time, course, room, specialty, lecturer, track }` |
| `attendance` | `{ studentId, course, percent, lastUpdated }` |
| `results` | `{ studentId, course, ca, exam, total, semester }` |
| `fees` | `{ studentId, total, paid, balance, deadline }` |
| `payments` | `{ studentId, reference, amount, method, status, paidAt }` |
| `announcements` | `{ title, body, author, pinned, createdAt }` |
| `lessons` | `{ course, title, body, lecturer, duration, publishedAt }` |

### Importing IUGET's actual data

Use the helper script (planned, not yet shipped): `node scripts/import-iuget.mjs path/to/iuget-export.json`.

The simplest interim approach is **CSV upload via the existing Enrolment page** — staff sign in, navigate to *Enrolment → Bulk CSV upload*, and the rows become live Firestore documents.

---

## 6. Security rules (paste into Firestore rules tab)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isSignedIn() { return request.auth != null; }
    function isRole(r)   { return isSignedIn() && request.auth.token.role == r; }
    function isSelf(uid) { return isSignedIn() && request.auth.uid == uid; }

    // Users — read self; staff + admin may read everyone
    match /users/{uid} {
      allow read:  if isSelf(uid) || isRole('staff') || isRole('admin');
      allow write: if isSelf(uid) || isRole('admin');
    }

    // Courses, timetable, announcements — read by anyone signed in
    match /courses/{c}      { allow read: if isSignedIn(); allow write: if isRole('staff') || isRole('admin'); }
    match /timetable/{t}    { allow read: if isSignedIn(); allow write: if isRole('staff') || isRole('admin'); }
    match /announcements/{a}{ allow read: if isSignedIn(); allow write: if isRole('staff') || isRole('admin'); }

    // Attendance + grades — lecturer writes own course; student reads own row
    match /attendance/{a}   {
      allow read:  if isSelf(resource.data.studentId) || isRole('lecturer') || isRole('staff') || isRole('admin');
      allow write: if isRole('lecturer') || isRole('staff') || isRole('admin');
    }
    match /results/{r}      {
      allow read:  if isSelf(resource.data.studentId) || isRole('lecturer') || isRole('staff') || isRole('admin');
      allow write: if isRole('lecturer') || isRole('staff') || isRole('admin');
    }

    // Tuition — student reads own, staff manages
    match /fees/{f}         {
      allow read:  if isSelf(resource.data.studentId) || isRole('staff') || isRole('admin');
      allow write: if isRole('staff') || isRole('admin');
    }
    match /payments/{p}     {
      allow read:  if isSelf(resource.data.studentId) || isRole('staff') || isRole('admin');
      allow create: if isSignedIn();   // parents / students can pay
      allow update: if isRole('staff') || isRole('admin');
    }

    // Lessons — published by lecturers, read by everyone
    match /lessons/{l}      {
      allow read:  if isSignedIn();
      allow write: if isRole('lecturer') || isRole('staff') || isRole('admin');
    }
  }
}
```

---

## 7. Deploying the production build

```bash
npm run build
# ↓ deploy to Vercel, Netlify, Firebase Hosting or any static CDN
```

For Firebase Hosting:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting          # accept defaults; public dir = "dist"
firebase deploy
```

---

## 8. Daily operation — what changes when IUGET goes live

| Before (DEMO_MODE) | After (production) |
| --- | --- |
| All data in `localStorage` per browser. | One canonical Firestore database for every user. |
| Sign-in uses hard-coded `password`. | Sign-in via Firebase Auth (email + password, optionally MFA). |
| Mobile-money payments fully simulated. | Real MoMo / OM transactions; webhook updates Firestore. |
| Single-device demo. | Multi-device, multi-user, real-time updates. |
| No backups. | Firestore export weekly + GCS snapshot. |
| No audit log. | Every write tracked via Cloud Logging. |

---

## 9. The honest tl;dr

> SIARM's *architecture* is real-time. SIARM's *data* is only real on the day IUGET imports it. This document gives the IUGET technical team everything needed to make that day a one-afternoon exercise.

— *James Murdza · Level-3 Software Engineering · IUGET Bonabéri · 2026*
