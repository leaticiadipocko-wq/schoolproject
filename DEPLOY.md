# SIARM — Deployment Guide

Quick reference for deploying SIARM to a public URL.

---

## 1. Vercel (recommended)

### One-time setup

1. Sign up at https://vercel.com/signup with GitHub.
2. **Add New → Project** → import `leaticiadipocko-wq/schoolproject`.
3. Vercel reads `vercel.json` automatically — no manual config needed.
4. Add environment variables (optional):
   - `VITE_DEMO_MODE=true` → run in safe mode without Firebase
   - `VITE_FIREBASE_API_KEY=…` → switch to live Firebase
   - (other `VITE_FIREBASE_*` keys as needed)
5. Click **Deploy**.

### Custom URL

In **Settings → Domains**, type a short name like `siarm-iuget`. Final URL: `https://siarm-iuget.vercel.app`.

### Auto-deploy

Every push to `main` triggers a new deployment automatically. Vercel will:
- Run `npm install`
- Run `npm run build`
- Serve `dist/` behind HTTPS

Build time: ~1 min · cold-start: instant · cost: free.

---

## 2. Netlify (alternative)

1. Sign up at https://app.netlify.com with GitHub.
2. **Add new site → Import an existing project** → choose the repo.
3. Build command: `npm run build` · Publish directory: `dist`
4. Add a `_redirects` file (not needed because `vercel.json` covers Netlify too via fallback) or follow Netlify's SPA-routing docs.

---

## 3. Firebase Hosting (when you flip to live Firebase)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting    # public dir = "dist", single-page = yes
npm run build
firebase deploy
```

---

## 4. Local self-hosted

```bash
npm install
npm run build
node scripts/serve.mjs   # serves dist/ on :4173
```

---

## 5. Environment variables — reference

| Name | Purpose | Demo / Production |
| --- | --- | --- |
| `VITE_DEMO_MODE` | Force localStorage-only mode | `true` for safe demo |
| `VITE_FIREBASE_API_KEY` | Firebase web API key | Required for live data |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain | `iuget-siarm.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firestore project ID | `iuget-siarm` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket | `iuget-siarm.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID | from console |
| `VITE_FIREBASE_APP_ID` | Web app ID | from console |

See `.env.example` for the full list and `deliverables/FIREBASE-IUGET-INTEGRATION.md` for the IUGET-specific procedure.
