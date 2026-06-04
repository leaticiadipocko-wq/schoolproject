# SIARM — Offline Architecture

**Project**  SIARM — Smart Institution Academic Resource Management
**Institution** Institut Universitaire du Golfe de Guinée (IUGET) · Bonabéri
**Author** James Murdza · Level-3 Software Engineering
**Document version** 1.0

---

## 1. Why offline matters at IUGET

Many IUGET students access SIARM from networks that are *intermittent* rather than *absent*: home WiFi that drops every few minutes, mobile-data bundles that run out mid-day, or campus WiFi that has dead zones. A web application that only works while online would be unusable for a third of the user base.

SIARM is therefore designed **offline-first**. The expected behaviour is:

| Connectivity state | What happens |
| --- | --- |
| Online, first visit | The whole app shell (~2.2 MB) is downloaded and cached. |
| Online, subsequent visits | The cached shell is served immediately; data is refreshed in the background (stale-while-revalidate). |
| Offline | Every previously-visited page still loads. Actions taken offline are queued. |
| Reconnected | Queued actions are replayed automatically; cache is refreshed. |

---

## 2. Architecture in one picture

```
 ┌──────────────────────────────────────────────────────────────┐
 │                       Browser                                │
 │ ┌─────────────────────────────────────────────────────────┐  │
 │ │  React SPA  (cached statically by Service Worker)       │  │
 │ │  ─── reads / writes ──┐                                 │  │
 │ │                       ▼                                 │  │
 │ │  localStorage  ◄── DataContext  ── IndexedDB (planned)  │  │
 │ │                       │                                 │  │
 │ │  Offline queue ◄──────┘                                 │  │
 │ └─────────────────────────────────────────────────────────┘  │
 │ ┌─────────────────────────────────────────────────────────┐  │
 │ │  Service Worker (Workbox via vite-plugin-pwa)           │  │
 │ │  ─ Precaches HTML / JS / CSS / fonts / icons            │  │
 │ │  ─ Runtime caches: fonts · avatars · brand · Firestore  │  │
 │ │  ─ NetworkFirst fallback for the rest                   │  │
 │ └─────────────────────────────────────────────────────────┘  │
 └──────────────────────────────────────────────────────────────┘
                        │                  │
        (online only)   │                  │
                        ▼                  ▼
              Firebase Auth        Firestore + Storage
              (cookies cached)     (sync-on-reconnect)
```

---

## 3. Three layers of offline support

### 3.1 Static asset precaching (Workbox)

Every JavaScript bundle, CSS file, font, image, JSON manifest, IUGET logo and PWA icon is included in the precache manifest at build time. The current precache is approximately **2.2 MB** across 13 entries — the entire SIARM user interface fits in a single round-trip.

Configured via `globPatterns` and `maximumFileSizeToCacheInBytes` in `vite.config.js`.

### 3.2 Runtime caching

For resources that are not part of the build but are accessed at runtime, the service worker applies named caches with explicit strategies.

| Resource | Strategy | Cache name | Why |
| --- | --- | --- | --- |
| Google-Fonts CSS | CacheFirst (365 d) | `siarm-fonts-css` | Fonts rarely change. |
| Google-Fonts woff2 | CacheFirst (365 d) | `siarm-fonts-webfonts` | Same. |
| Dicebear avatars | CacheFirst (30 d) | `siarm-avatars` | Avatars are deterministic. |
| IUGET brand assets | CacheFirst | `siarm-brand` | Logos do not change. |
| Firestore reads | NetworkFirst (3 s timeout) | `siarm-firestore` | Fresh-when-online, cached-when-offline. |
| Everything else under our origin | NetworkFirst (4 s timeout) | `siarm-html` | Sensible default. |

### 3.3 Application-state persistence

The React context layer persists everything that should survive a reload:

| Data | Storage | Lifetime |
| --- | --- | --- |
| Authentication session | localStorage `siarm.demoUser` | Until sign-out |
| Mock-data store (attendance, results, timetable, fees) | localStorage `siarm.store.v2` | Until manual reset |
| Language preference | localStorage `siarm.lang` | Persistent |
| Theme preference | localStorage (in DataContext) | Persistent |
| Notification read-state | localStorage | Persistent |
| Offline-action queue | localStorage `siarm.offlineQueue.v1` | Until replayed |

When the local store reaches the localStorage 5 MB ceiling (unlikely with mock data), the same shape transparently migrates to IndexedDB.

---

## 4. The Offline Action Queue

The most important user-facing offline feature is **the queue**. When the user takes an action that would normally hit the network — marking attendance, entering a grade, submitting a tuition payment, publishing an announcement — the action is appended to the queue instead of being dropped on the floor.

### 4.1 Public API (src/lib/offlineQueue.js)

```js
import { enqueue, peek, size, clear, remove, flush, installAutoFlush }
  from '@/lib/offlineQueue'

// Add an action
enqueue({ type: 'attendance.mark', payload: { classId, present } })

// Inspect
peek()      // → array of actions
size()      // → number of queued actions

// Drain
await flush(async (action) => { /* replay against back-end */ })

// Auto-flush whenever the browser re-connects
installAutoFlush(replayHandler)
```

### 4.2 Lifecycle

1. **enqueue()** writes the action to localStorage with a unique id and `queuedAt` timestamp.
2. A `siarm:queueChanged` CustomEvent is dispatched so UI badges re-render.
3. On `window 'online'` event the queue is flushed: each action is replayed against the handler.
4. Successful actions are removed; failed actions remain in the queue with `lastError` recorded for retry.

### 4.3 Privacy guarantees

The queue never persists credentials. Tuition-payment actions queue only the **reference**, **amount** and **method** — never the PIN, password or card number.

---

## 5. The Offline Status page (`/{role}/offline`)

Every authenticated user has access to an Offline Mode page that reports:

- Current connection state (Online / Offline) — large card with Wi-Fi icon.
- Total cached entries across all Service-Worker caches.
- Storage quota used and total (via `navigator.storage.estimate()`).
- Number of queued actions.
- A complete enumeration of **what works offline** (12 features × bilingual EN/FR).
- A live cache inspector (each cache by name with entry count).
- A queue inspector with **Replay** and **Clear** buttons.
- An **Install app** button (when the `beforeinstallprompt` event has fired).
- Step-by-step install instructions for Chrome, Safari and Android.

---

## 6. What works offline today

| Module | Offline behaviour |
| --- | --- |
| Sign in / out | Works fully in DEMO_MODE. |
| Student dashboard | Cached data renders immediately. |
| Attendance | View existing records · mark attendance → queued. |
| Timetable | All three tracks (Bachelor evening, L1 morning, L2 morning) cached. |
| Results | View + print PDF offline. |
| Transcript | jsPDF + html2canvas run client-side; no network. |
| ID Card | Render + print + PNG + PDF offline. |
| Tuition & Fees | Receipt PDF prints offline. The actual provider call is queued. |
| Announcements | Last-seen announcements remain readable. |
| Mobile Learning | Cached lessons readable offline. |
| Lecturer pages | Attendance + grade entry → queued. |
| Staff pages | Enrolment → queued. Financial Tracking shows the cached snapshot. |
| Admin pages | Analytics dashboard from cached data. |
| Profile + Help | Fully offline; bilingual FAQ embedded in the JS bundle. |
| Command Palette | Cmd/Ctrl+K navigation works offline. |
| Parent Portal | Public page cached after first visit. |

---

## 7. What does NOT work offline (yet)

| Scenario | Why | Mitigation |
| --- | --- | --- |
| First visit | Browser needs to download the shell. | Pre-install via a campus QR code. |
| Live Firestore writes | Need a server round-trip. | Queued and replayed on reconnect. |
| Live mobile-money | MoMo / OM providers need real network. | Simulator runs offline; real channel is online-only by design. |
| Fresh CDN-served avatars on first visit | Dicebear is external. | Cached after the first visit; subsequent visits offline. |

---

## 8. How to install SIARM as an app

- **Chrome / Edge (desktop)** — click the install icon in the URL bar, or open *Menu → Install SIARM*.
- **Android Chrome** — the *Install SIARM* button appears in the bottom-right of the screen on first visit, and again on the Offline Mode page.
- **iOS Safari** — tap the *Share* icon → *Add to Home Screen*.

Once installed the app launches in a standalone window (no browser chrome) and can be opened in one tap from the home screen. The app is **62 MB on disk** when installed (Workbox cache + WebKit / Blink overhead).

---

## 9. Defence-ready three-sentence summary

> *SIARM is built offline-first. The entire user interface is precached on first visit (~2.2 MB across 13 entries); subsequent visits load instantly from cache, and any action taken offline — attendance, grades, payment — is queued and replayed automatically on reconnect. The privacy invariant survives every transition: the offline queue never contains a credential.*

— *James Murdza · Level-3 Software Engineering · IUGET Bonabéri · 2026*
