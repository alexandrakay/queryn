import { useState, useMemo } from 'react'
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { createAppTheme } from './theme'
import { AuthProvider, useAuth } from './context/AuthContext'
import Nav from './components/Nav'
import SignIn from './components/SignIn'
import TopicSelector from './pages/TopicSelector'
import QuizScreen from './pages/QuizScreen'
import ScoreScreen from './pages/ScoreScreen'
import HistoryScreen from './pages/HistoryScreen'

function AppRoutes({ mode, onToggleMode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return <SignIn onToggleMode={onToggleMode} mode={mode} />
  }

  return (
    <>
      <Nav mode={mode} onToggle={onToggleMode} />
      <Routes>
        <Route path="/" element={<TopicSelector />} />
        <Route path="/quiz/:topic" element={<QuizScreen />} />
        <Route path="/score" element={<ScoreScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  const [mode, setMode] = useState('light')
  const theme = useMemo(() => createAppTheme(mode), [mode])
  const toggleMode = () => setMode(m => m === 'light' ? 'dark' : 'light')

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes mode={mode} onToggleMode={toggleMode} />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
