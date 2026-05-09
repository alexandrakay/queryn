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
| Testing | Vitest + Testing Library |

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
