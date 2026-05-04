# Building queryn — Part 1: Scaffold, Firebase Auth & Deploy

> **Series:** Building queryn — an AI-powered WGU CS study tool with React, Firebase, and Claude
>
> **Part 1 of 4** | [Part 2 →](#) | [GitHub repo](https://github.com/alexandrakay/queryn)

---

## What we're building

queryn is a quiz app for WGU Computer Science students. Pick a topic, get 5 AI-generated multiple choice questions, see immediate explanations, and receive a personalized performance summary at the end — all powered by Claude Haiku.

By the end of this series you'll have a full-stack app running on Firebase with a server-side Anthropic API integration. In Part 1, we're laying the foundation: project scaffold, MUI theme, Firebase Authentication with Google Sign-In, and a first deploy to Firebase Hosting.

**Stack for this part:**
- React + Vite
- MUI v5
- Firebase Authentication (Google Sign-In)
- Firebase Hosting

---

## 1. Scaffold Vite + React + MUI v5

Start from an empty directory and initialize the project manually (or use `npm create vite@latest`).

### package.json

```json
{
  "name": "queryn",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emotion/react": "^11.13.0",
    "@emotion/styled": "^11.13.0",
    "@mui/icons-material": "^5.16.0",
    "@mui/material": "^5.16.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.4.0"
  }
}
```

```bash
npm install
```

### vite.config.js

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>queryn</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### MUI Theme — src/theme.js

One central theme file drives the visual identity of the whole app. MUI v5 uses Emotion under the hood — that's why `@emotion/react` and `@emotion/styled` are in the dependencies.

```js
import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1565c0' },
    secondary: { main: '#0288d1' },
    background: { default: '#f5f7fa' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
})

export default theme
```

### App entry point — src/main.jsx

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### App shell — src/App.jsx

```jsx
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material'
import theme from './theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 4, textAlign: 'center', mt: 8 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          queryn
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered WGU CS study tool
        </Typography>
      </Box>
    </ThemeProvider>
  )
}
```

Run `npm run dev` — you should see the queryn placeholder at `localhost:5173`.

---

## 2. Firebase Project Setup

> **This step is manual** — you'll do it in the Firebase Console.

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project named `queryn`
2. **Authentication** → Sign-in method → Enable **Google**
3. **Firestore Database** → Create database → Start in production mode
4. **Hosting** → Get started (we'll deploy at the end of this part)
5. **Project settings** → Your apps → Add a web app → Copy the config object

Create `.env.local` in your project root (this file is gitignored — never commit it):

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Also commit a `.env.example` with placeholder values so other developers know what's needed:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 3. Google Sign-In Auth Flow

*(Coming in the next commit — #3)*

---

## 4. Firebase Hosting — Initial Deploy

*(Coming in the next commit — #4)*

---

*Part 2 will cover the topic selector and quiz screen with MUI components.*
