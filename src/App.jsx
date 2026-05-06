import { useState, useMemo } from 'react'
import { ThemeProvider, CssBaseline, Box, CircularProgress, IconButton, Tooltip, AppBar, Toolbar, Button } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import HistoryIcon from '@mui/icons-material/History'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { createAppTheme } from './theme'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import TopicSelector from './pages/TopicSelector'
import QuizScreen from './pages/QuizScreen'
import ScoreScreen from './pages/ScoreScreen'
import HistoryScreen from './pages/HistoryScreen'

function Nav({ mode, onToggle }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const onQuiz = pathname.startsWith('/quiz')

  if (onQuiz) return null

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Button color="primary" onClick={() => navigate('/')} sx={{ fontFamily: '"Fugaz One", sans-serif', fontSize: '1.1rem' }}>
          queryn
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="History">
            <IconButton color="primary" onClick={() => navigate('/history')}>
              <HistoryIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
            <IconButton onClick={onToggle} color="primary">
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

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
    return <LandingPage onToggleMode={onToggleMode} mode={mode} />
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
