import { useState, useMemo } from 'react'
import { ThemeProvider, CssBaseline, Box, CircularProgress, Typography, Button, IconButton, Tooltip } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { createAppTheme } from './theme'
import { AuthProvider, useAuth } from './context/AuthContext'
import SignIn from './components/SignIn'

function AppContent({ onToggleMode, mode }) {
  const { user, loading, signOut } = useAuth()

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
    <Box sx={{ p: 4, textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        queryn
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Welcome, {user.displayName}
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
        <Button variant="outlined" onClick={signOut}>
          Sign out
        </Button>
        <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
          <IconButton onClick={onToggleMode} color="primary">
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default function App() {
  const [mode, setMode] = useState('light')
  const theme = useMemo(() => createAppTheme(mode), [mode])
  const toggleMode = () => setMode(m => m === 'light' ? 'dark' : 'light')

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent onToggleMode={toggleMode} mode={mode} />
      </AuthProvider>
    </ThemeProvider>
  )
}
