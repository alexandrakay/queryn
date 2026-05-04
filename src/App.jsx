import { ThemeProvider, CssBaseline, Box, CircularProgress, Typography, Button } from '@mui/material'
import theme from './theme'
import { AuthProvider, useAuth } from './context/AuthContext'
import SignIn from './components/SignIn'

function AppContent() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return <SignIn />
  }

  return (
    <Box sx={{ p: 4, textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        queryn
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Welcome, {user.displayName}
      </Typography>
      <Button variant="outlined" onClick={signOut} sx={{ mt: 2 }}>
        Sign out
      </Button>
    </Box>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}
