import { Box, Button, Card, CardContent, Typography, IconButton, Tooltip } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useAuth } from '../context/AuthContext'

export default function SignIn({ onToggleMode, mode }) {
  const { signInWithGoogle } = useAuth()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ position: 'fixed', top: 12, right: 12 }}>
        <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
          <IconButton onClick={onToggleMode} color="primary">
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2, p: 2 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="primary" gutterBottom>
            queryn
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            AI-powered CS study tool
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={signInWithGoogle}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}
