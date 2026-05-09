# queryn

AI-powered CS quiz prep for CS students.

**Live app → [queryn-dfe1d.web.app](https://queryn-dfe1d.web.app)**

---

## What it does

queryn generates on-demand multiple choice quizzes across **twelve** study topics (core CS plus related math) using Claude Haiku. Answer a question, get an instant AI explanation, finish the session, and receive a personalized performance summary — all saved to your history.

---

## Topics

The topic grid in the app matches this set (12 cards):

| # | Topic |
|---|-------|
| 1 | Data Structures |
| 2 | Algorithms |
| 3 | Operating Systems |
| 4 | Databases |
| 5 | Networks |
| 6 | Software Design |
| 7 | Limits |
| 8 | Derivatives |
| 9 | Integrals |
| 10 | Differential Equations |
| 11 | Java Development |
| 12 | AI / Machine Learning |

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| UI | MUI v5 |
| Routing | React Router |
| Auth | Firebase Authentication (Google Sign-In) |
| Database | Cloud Firestore |
| Hosting | Firebase Hosting |
| AI | Anthropic Claude Haiku (`claude-haiku-4-5-20251001`) |
| API security | Firebase Cloud Functions (API key server-side) |
| Testing | Vitest + Testing Library + Playwright (smoke) |

---

## Quiz flow

```
Sign in → Pick topic → 5 AI questions → Answer + explanation → Score + AI summary → Saved to history
```

1. User signs in with Google (landing experience until Firebase reports a user).
2. Chooses one of **12** topic cards on the home grid; each card navigates to `/quiz/<topic>`.
3. A Cloud Function calls Claude Haiku and returns **five** multiple-choice questions as JSON.
4. User answers one question at a time with immediate correct/incorrect styling on the options.
5. After selecting an answer, an AI-written explanation appears before moving on.
6. After the fifth question, another Cloud Function call produces a short personalized summary.
7. The score screen shows the result, summary, and navigation back to topics or history.
8. A completed session is written under `users/{uid}/sessions` for history review.

While signed in, the top **Nav** bar (home, history, theme toggle, sign out) is shown on topic, score, and history routes; it is **hidden on quiz** so the question view stays focused.

Server-side **rate limits** apply per user to the AI HTTPS endpoints; throttled clients receive HTTP 429 with a clear error message.

---

## Project layout

High-level map (prefer this over a long per-file tree that drifts):

| Area | Responsibility |
|------|------------------|
| **`src/`** | React SPA: auth-aware routing, MUI theming, landing hero, 12-topic grid, quiz → score flow, session history, Firebase clients for auth/Firestore, and fetch calls to the hosted AI HTTPS functions. |
| **`functions/`** | Cloud Functions: shared topic validation, per-user rate limits, Anthropic proxying with secrets, structured Cloud Logging for each AI request outcome. |
| **`e2e/`** | Playwright smoke: real browser, **stubbed** Cloud Function responses and **E2E mode** (`vite --mode e2e` + committed `.env.e2e` placeholders only). |
| **Root** | `firebase.json`, `firestore.rules`, `playwright.config.js`, Vite config. |

---

## Firestore schema

```
users/{uid}/sessions/{sessionId}
{
  topic:          string,
  createdAt:      Timestamp,
  score:          number,
  totalQuestions: 5,
  aiFeedback:     string,
  questions: [
    {
      question:      string,
      options:       [string, string, string, string],
      correctIndex:  number,
      selectedIndex: number,
      explanation:   string
    }
  ]
}
```

Security rules: authenticated users can read/write only their own `users/{uid}/` path.

---

## Cloud Logging (AI HTTPS functions)

Structured logs fire once per **`generateQuestions`** and **`generateSessionSummary`** invocation (except `OPTIONS`). Search in **Logs Explorer** (Google Cloud Console) using JSON fields prefixed with `queryn_`:

| Field | Use |
|-------|-----|
| `jsonPayload.message="queryn_ai_request"` | Row type (same text as Firebase’s first log argument) |
| `jsonPayload.queryn_endpoint="generateQuestions"` | Filter one function |
| `jsonPayload.queryn_outcome="success"` | Outcomes include `success`, `auth_denied`, `validation_failed`, `rate_limited`, `upstream_malformed`, `internal_error` |
| `jsonPayload.queryn_httpStatus` | Match alerting to client-facing status codes |
| `jsonPayload.queryn_uid` | Your Firebase UID (debug your own traffic) |
| `jsonPayload.queryn_durationMs` | Wall time for the handler |
| `jsonPayload.queryn_topicLength`, `jsonPayload.queryn_topicCorrelation` | Topic size and SHA-256 short fingerprint — **never** raw topic text |
| `jsonPayload.queryn_resultsCount` | Question count returned or quiz result rows (when applicable) |

Example filter: `jsonPayload.queryn_endpoint="generateQuestions" AND jsonPayload.queryn_outcome="rate_limited"`.

---

## Local development

### Prerequisites

- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project with Authentication, Firestore, and Cloud Functions enabled
- An Anthropic API key stored as a Firebase secret (`ANTHROPIC_API_KEY`)

### Setup

```bash
git clone https://github.com/alexandrakay/queryn.git
cd queryn
npm install
```

Create `.env.local` in the project root:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Run

```bash
npm run dev         # start dev server at localhost:5173
npm run test        # run test suite (Vitest)
npm run test:watch  # watch mode
```

### End-to-end (Playwright)

Smoke tests use **`vite --mode e2e`**, which loads **`.env.e2e`** (`VITE_E2E=1` plus placeholder Firebase keys). In that mode the app skips Google sign-in and treats you as signed in with a fixed stub user. Cloud Function traffic is **not** required: specs stub `generateQuestions` / `generateSessionSummary` with `page.route` so CI never calls Anthropic.

```bash
npm run playwright:install        # Chromium into node_modules (matches playwright.config.js)
npm run test:e2e                  # starts dev:e2e if needed, runs e2e/smoke.spec.js
npm run test:e2e:ui               # optional Playwright UI mode
```

`playwright.config.js` sets `PLAYWRIGHT_BROWSERS_PATH=0` so browsers live under `node_modules/` (avoids broken global caches in some IDE environments). On Windows without sh, run `set PLAYWRIGHT_BROWSERS_PATH=0` then `npx playwright install chromium`, or use Git Bash.

Do not set `VITE_E2E` in production builds; it exists only for automated browser runs.

### Deploy

```bash
npm run build
firebase deploy --only hosting    # frontend only
firebase deploy --only functions  # Cloud Functions only
firebase deploy                   # everything
```

---

## Design

- **Fonts**: Syne (MUI heading scale) + DM Mono (body and UI). Topic card titles on the grid also use **Fugaz One** for display contrast.
- **Dark mode**: `#0d0d0d` background · `#141414` surfaces · `#60a5fa` accent · `#f5f5f0` text
- **Light mode**: `#f5f5f0` background · `#ffffff` surfaces · same accent and fonts
- Toggle between modes with the moon/sun button in **Nav** (when visible).

---

## Testing

```bash
npm run test
```

**Vitest** runs React component and service specs plus Node-side tests colocated under `functions/` (topic validation, rate limits, AI request logging, etc.). **Playwright** runs a single smoke path against the dev server in E2E mode; see [End-to-end (Playwright)](#end-to-end-playwright).
