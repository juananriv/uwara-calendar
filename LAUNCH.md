# Launch & Validate Locally

How to run the app on your own machine to check changes **before** publishing to
Vercel. Always validate here first — once you push to Vercel it's live for the club.

---

## Prerequisites (one-time)

1. **Node.js 20 or newer** — check with:
   ```bash
   node -v
   ```
   If it's missing or older, install the LTS from <https://nodejs.org>.

2. **Install dependencies** (run once, and again whenever `package.json` changes):
   ```bash
   npm install
   ```

3. **Environment variables** — make sure `.env.local` exists in the project root with:
   ```
   GOOGLE_SHEETS_API_KEY=your_key
   SHEET_ID=your_sheet_id
   ```
   Without these, the app still loads but every section is empty (the data comes
   from Google Sheets). This file is **never committed**.

---

## 1. Development server (day-to-day)

Use this while editing — it hot-reloads on every save.

```bash
npm run dev
```

Then open **<http://localhost:3000>** in your browser.

- Edits to files under `app/`, `components/`, or `lib/` refresh automatically.
- The UI is a **phone frame** centered on the page — that's intentional, it mimics
  the mobile app. For a true phone view, open your browser's device toolbar
  (Chrome/Edge: `F12` → click the phone/tablet icon).
- Stop the server with `Ctrl + C`.

> Data is fetched fresh on every load (`cache: 'no-store'`), so changes you make
> in the Google Sheet show up on the next browser refresh — no restart needed.

---

## 2. Production preview (validate before deploying)

The dev server is forgiving; Vercel builds in **production mode**, which is
stricter. Before publishing, reproduce that build locally:

```bash
npm run build   # compiles + type-checks + lints — must finish with no errors
npm start       # serves the production build at http://localhost:3000
```

If `npm run build` fails, **fix it before pushing** — the same failure will break
the Vercel deploy. A successful build ends with a route table like:

```
Route (app)
┌ ƒ /
└ ○ /_not-found
```

> Note: during build you may see `Error fetching from Google Sheets: Dynamic
> server usage`. This is expected — it just tells Next.js the page renders
> dynamically (marked `ƒ`) because data is fetched live. It is not a failure.

---

## 3. Lint (optional, catches style/quality issues)

```bash
npm run lint
```

---

## Pre-publish checklist

- [ ] `npm run build` completes with **no errors**.
- [ ] App opens at `http://localhost:3000` via `npm start`.
- [ ] The tabs you changed look right (Inicio, Agenda, Proyectos, Actas, Nosotros).
- [ ] Google Sheet content renders (projects, leaders, tasks, actas, flyers).
- [ ] No broken images and no console errors (`F12` → Console).

---

## Publishing to Vercel

This project is linked to Vercel (see the `.vercel/` folder). The usual flow:

- **Push to your Git branch** → Vercel automatically builds a **Preview**
  deployment with its own URL. Share/open that URL to validate in a real
  environment before promoting.
- **Merge/push to the production branch** → Vercel promotes it to the live site.

If you have the Vercel CLI installed (`npm i -g vercel`), you can also run:

```bash
vercel          # create a preview deployment
vercel --prod   # deploy straight to production
```

Prefer the preview step — it's the safest way to confirm a change before the
whole club sees it.
