import { useState, useMemo } from 'react'
import { ThemeProvider, CssBaseline, Box, CircularProgress, IconButton, Tooltip } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { createAppTheme } from './theme'
import { AuthProvider, useAuth } from './context/AuthContext'
import SignIn from './components/SignIn'
import TopicSelector from './pages/TopicSelector'
import QuizScreen from './pages/QuizScreen'

function ModeToggle({ mode, onToggle }) {
  return (
    <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
      <IconButton
        onClick={onToggle}
        color="primary"
        sx={{ position: 'fixed', top: 12, right: 12 }}
      >
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
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
    return <SignIn onToggleMode={onToggleMode} mode={mode} />
  }

  return (
    <>
      <ModeToggle mode={mode} onToggle={onToggleMode} />
      <Routes>
        <Route path="/" element={<TopicSelector />} />
        <Route path="/quiz/:topic" element={<QuizScreen />} />
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
