# SIARM — Bachelor Defense Package

> By James Murdza · Level-3 Software Engineering · IUGET Bonaberi · 2026

This folder contains everything you need for your defense.

## 📦 What's inside

| File | Purpose | Open with |
|---|---|---|
| `SIARM-Complete-Package.zip` | **Everything in one download** — report, slides, speech notes, all docs, every diagram, and the source & build zips. | Any zip tool |
| `SIARM-Report.docx` | Full academic report — cover, abstract, 8 chapters, references, appendices with diagrams. | Microsoft Word, Google Docs, LibreOffice |
| `SIARM-Defense.pptx` | 22-slide defense presentation with IUGET branding and embedded diagrams. | PowerPoint, Google Slides, Keynote |
| `Defense-Speech-Notes.md` | Speaker notes for every slide + anticipated Q&A with model answers. | Any text editor or Markdown viewer |
| `SIARM-source-code.zip` | Full React source code, ready for `npm install && npm run dev`. | Any zip tool |
| `SIARM-production-build.zip` | Pre-built static bundle, ready to upload to any web host. | Any zip tool |
| `diagrams/` | All 7 architectural diagrams as both SVG (editable) and PNG (presentations). | Any image viewer; SVGs editable in Figma or draw.io |

## 🚀 Live demo

If the server is running, the SIARM app is live at the root URL of this deployment.
Use these demo credentials:

```
student@iuget.cm   / password
lecturer@iuget.cm  / password
staff@iuget.cm     / password
admin@iuget.cm     / password
```

## 🎯 Recommended defense flow

1. **The day before** — read `Defense-Speech-Notes.md` cover to cover. Practice the demo twice.
2. **The morning of** — copy this entire folder to a USB stick. Charge your laptop.
3. **At the podium** — open `SIARM-Defense.pptx` in presenter mode. Keep the live app in a second window.
4. **For Q&A** — refer to the "Anticipated questions" section of the speech notes.

## 🛠 Rebuilding from source

```bash
unzip SIARM-source-code.zip
cd SIARM
npm install
npm run dev
```

Open `http://localhost:5173` and you're running the full app locally.

## 📐 Diagrams reference

- `01-architecture.png` — 3-tier system architecture (React → Context → Firebase + Claude)
- `02-erd.png` — Entity-Relationship Diagram (9 entities)
- `03-use-case.png` — Use case diagram (4 actors, 17 use cases)
- `04-sequence-login.png` — Sequence diagram for the student login flow
- `05-component.png` — React component decomposition (50 files)
- `06-data-flow.png` — Level-1 Data Flow Diagram
- `07-deployment.png` — Deployment topology (3 nodes)

You've got this. Good luck with the defense.
