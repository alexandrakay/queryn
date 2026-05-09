# queryn

AI-powered CS quiz prep for CS students.

**Live app → [queryn-dfe1d.web.app](https://queryn-dfe1d.web.app)**

---

## What it does

queryn generates on-demand multiple choice quizzes across 12 core Computer Science topics using Claude Haiku. Answer a question, get an instant AI explanation, finish the session, and receive a personalized performance summary — all saved to your history.

---

## Topics

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

1. User signs in with Google
2. Selects one of 12 topic cards
3. Cloud Function calls Claude Haiku → returns 5 MCQs as JSON
4. User answers one question at a time with immediate correct/incorrect feedback
5. Each answer reveals an AI-generated explanation
6. After question 5, a second Claude call generates a personalized session summary
7. Score screen displays result + summary
8. Session written to Firestore for history review

---

## Project structure

```
queryn/
├── src/
│   ├── e2eFlags.js              # `VITE_E2E` gate + stub user id (Playwright)
│   ├── App.jsx                  # Root — routing, theme toggle, auth guard
│   ├── theme.js                 # MUI theme (dark editorial palette)
│   ├── components/
│   │   └── Nav.jsx              # Authenticated nav bar with sign-out
│   ├── context/
│   │   └── AuthContext.jsx      # Firebase auth state + signIn/signOut
│   ├── pages/
│   │   ├── LandingPage.jsx      # Pre-auth hero page
│   │   ├── TopicSelector.jsx    # 10-card topic grid
│   │   ├── QuizScreen.jsx       # Question + answer + explanation
│   │   ├── ScoreScreen.jsx      # Final score + AI summary
│   │   └── HistoryScreen.jsx    # Past sessions accordion
│   └── services/
│       ├── anthropic.js         # Cloud Function calls (generateQuestions, generateSessionSummary)
│       └── firestore.js         # saveSession, getSessions
├── functions/
│   ├── index.js                 # Cloud Functions — proxies Anthropic API calls server-side
│   └── aiRequestLog.js          # Structured Cloud Logging for AI HTTPS handlers
├── e2e/
│   └── smoke.spec.js            # Playwright — topic grid → quiz (mocked Cloud Functions)
├── playwright.config.js         # E2E runner + `npm run dev:e2e` webServer
├── .env.e2e                     # Dummy `VITE_*` + `VITE_E2E=1` for Playwright only (committed)
├── firebase.json                # Hosting + Functions config
└── firestore.rules              # Auth-gated read/write rules
```

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

Smoke tests use **`vite --mode e2e`**, which loads **`.env.e2e`** (`VITE_E2E=1` plus placeholder Firebase keys). In that mode the app skips Google sign-in and treats you as signed in with a fixed stub user (`src/e2eFlags.js`, `src/context/AuthContext.jsx`). Cloud Function traffic is **not** required: specs stub `generateQuestions` / `generateSessionSummary` with `page.route` so CI never calls Anthropic.

```bash
npm install
npm run playwright:install        # Chromium into node_modules (matches playwright.config.js)
npm run test:e2e                  # starts dev:e2e if needed, runs e2e/smoke.spec.js
npm run test:e2e:ui               # optional Playwright UI mode
```

`playwright.config.js` sets `PLAYWRIGHT_BROWSERS_PATH=0` so browsers live under `node_modules/` (avoids broken global caches in some IDE environments). Scripts invoke the **local** CLI via `node node_modules/playwright/cli.js` (so you do not need a global `playwright` on `PATH`). On **Windows cmd.exe**, prefer **Git Bash** or **WSL** for `npm run playwright:install` so the `PLAYWRIGHT_BROWSERS_PATH=0` prefix works; or set the variable, then run the same `node …\\playwright\\cli.js install chromium` command manually.

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

- **Fonts**: Syne (display headings) + DM Mono (body, UI, labels)
- **Dark mode**: `#0d0d0d` background · `#141414` surfaces · `#60a5fa` accent · `#f5f5f0` text
- **Light mode**: `#f5f5f0` background · `#ffffff` surfaces · same accent and fonts
- Toggle between modes with the moon/sun button on any screen

---

## Testing

```bash
npm run test
```

Vitest runs frontend and `functions/` unit tests (topic validation, rate limits, AI request logging, etc.).
