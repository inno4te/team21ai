# Team21 AI Workspace

AI coach + productivity tools for Team21 Academy. Local-first, modular, $0/month.
**inno4te · Team21 Academy**

## What's in this build (Weeks 1–2 milestone)

- App shell: auth, module registry with lazy-loaded routes, responsive sidebar/bottom-bar, offline badge, PWA
- **AI Chat + AI Coach** — working end-to-end through the free-tier LLM router
- **Prompt Library** — local-first, works offline
- **PDF Tools** — placeholder rail (engines land weeks 5–6)
- Apps Script backend: auth, sessions, per-user daily quotas, LLM router (Gemini → Groq → Cerebras)

## Deploy the frontend (no local tools needed)

1. Create a GitHub repo, upload this folder's contents (or push via github.dev).
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. Push to `main`. The included workflow builds and deploys automatically.
4. Your app is live at `https://<you>.github.io/<repo>/`.

## Deploy the backend (about 10 minutes)

1. Go to **script.google.com → New project**, name it `T21 Workspace Backend`.
2. Create four files and paste in the code from `backend/appsscript/`: `Code.gs`, `Setup.gs`, `Auth.gs`, `Quota.gs`, `Llm.gs`.
3. In the editor, select the `setup` function and **Run** it once (authorize when asked). It creates the database spreadsheet.
4. **Project Settings → Script Properties**, add your free API keys (any one is enough to start; all three = resilience):
   - `GEMINI_KEY` — free at aistudio.google.com
   - `GROQ_KEY` — free at console.groq.com
   - `CEREBRAS_KEY` — free at cloud.cerebras.ai
5. **Deploy → New deployment → Web app** → Execute as: **Me** → Who has access: **Anyone** → Deploy. Copy the `/exec` URL.
6. Open your deployed app → **Settings** → paste the URL → Save → create an account → chat.

Re-deploying backend changes: **Deploy → Manage deployments → Edit → New version** (keeps the same URL).

## Free-tier notes

- Keys never ship to the browser — they live in Script Properties only.
- Each user gets 40 LLM requests/day (`DAILY_LIMIT` in `Quota.gs`) so no one drains the shared quota.
- Router falls through Gemini → Groq → Cerebras on rate limits; reorder in `Llm.gs` anytime.
- Free tiers may train on prompts. Keep sensitive documents on the local path (that's the architecture).

## Adding a module later

One folder in `src/modules/<name>/` + one entry in `src/core/moduleRegistry.ts`. That's it — routing, sidebar, and code-splitting are automatic.

## Roadmap

Weeks 3–4 RAG + KB ingestion → Weeks 5–6 PDF engines (pdf.js, pdf-lib, Tesseract.js) → Week 7 FR i18n + PWA polish → Week 8 pilot cohort.
