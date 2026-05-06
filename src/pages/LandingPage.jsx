import { Box, Button, Typography, IconButton, Tooltip, Stack, Divider } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  'AI-generated multiple choice questions',
  'Instant feedback with explanations',
  'Personalized session summaries',
  'Full history of past sessions',
]

export default function LandingPage({ onToggleMode, mode }) {
  const { signInWithGoogle } = useAuth()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ position: 'fixed', top: 12, right: 12 }}>
        <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
          <IconButton onClick={onToggleMode} color="primary" aria-label={mode === 'light' ? 'Dark mode' : 'Light mode'}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          py: 8,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h2"
          color="primary"
          sx={{ mb: 1, fontSize: { xs: '3rem', sm: '4.5rem' } }}
        >
          queryn
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 1, fontFamily: '"Work Sans", sans-serif', fontWeight: 400 }}
        >
          AI-powered CS quiz prep for WGU students
        </Typography>

        <Divider sx={{ width: 48, my: 4, borderColor: 'primary.main', borderBottomWidth: 2 }} />

        <Stack spacing={1} sx={{ mb: 5, textAlign: 'left' }}>
          {FEATURES.map((f) => (
            <Typography key={f} variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>—</Box>
              {f}
            </Typography>
          ))}
        </Stack>

        <Button
          variant="contained"
          size="large"
          startIcon={<GoogleIcon />}
          onClick={signInWithGoogle}
          sx={{ py: 1.5, px: 4, fontSize: '1rem' }}
        >
          Sign in with Google
        </Button>
      </Box>
    </Box>
  )
}
