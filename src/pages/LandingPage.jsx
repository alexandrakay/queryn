import { Box, Button, Typography, IconButton, Tooltip, Grid } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import DataObjectIcon from '@mui/icons-material/DataObject'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import MemoryIcon from '@mui/icons-material/Memory'
import StorageIcon from '@mui/icons-material/Storage'
import LanIcon from '@mui/icons-material/Lan'
import ArchitectureIcon from '@mui/icons-material/Architecture'
import FunctionsIcon from '@mui/icons-material/Functions'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import { useAuth } from '../context/AuthContext'

const TILES = [
  { icon: DataObjectIcon, bg: '#4B4B8F' },
  { icon: AccountTreeIcon, bg: '#2E2E6B' },
  { icon: MemoryIcon, bg: '#5C5C99' },
  { icon: StorageIcon, bg: '#3A3A7A' },
  { icon: LanIcon, bg: '#6B6BAA' },
  { icon: ArchitectureIcon, bg: '#2A2A60' },
  { icon: FunctionsIcon, bg: '#4A4A85' },
  { icon: ShowChartIcon, bg: '#393980' },
]

function IconTileGrid() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1.5,
        maxWidth: 320,
        mx: 'auto',
      }}
    >
      {TILES.map(({ icon: Icon, bg }, i) => (
        <Box
          key={i}
          sx={{
            bgcolor: bg,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            aspectRatio: '1',
            opacity: 0.92,
            transform: i % 3 === 1 ? 'translateY(10px)' : i % 3 === 2 ? 'translateY(-6px)' : 'none',
          }}
        >
          <Icon sx={{ fontSize: 36, color: 'rgba(255,255,255,0.85)' }} />
        </Box>
      ))}
    </Box>
  )
}

export default function LandingPage({ onToggleMode, mode }) {
  const { signInWithGoogle } = useAuth()

  const heroBg = mode === 'light' ? '#292966' : '#0D0D22'
  const heroText = '#FFFFFF'
  const heroSubtext = 'rgba(255,255,255,0.72)'

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: heroBg }}>
      <Box sx={{ position: 'fixed', top: 12, right: 12, zIndex: 10 }}>
        <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
          <IconButton
            onClick={onToggleMode}
            aria-label={mode === 'light' ? 'Dark mode' : 'Light mode'}
            sx={{ color: heroSubtext, '&:hover': { color: heroText } }}
          >
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Grid
        container
        sx={{
          flex: 1,
          minHeight: '100vh',
          px: { xs: 3, sm: 6, md: 10 },
          py: { xs: 8, md: 0 },
          alignItems: 'center',
          maxWidth: 1200,
          mx: 'auto',
          width: '100%',
        }}
      >
        {/* Left column — copy */}
        <Grid item xs={12} md={6} sx={{ pr: { md: 6 } }}>
          <Typography
            variant="overline"
            sx={{ color: heroSubtext, letterSpacing: 3, display: 'block', mb: 3 }}
          >
            queryn
          </Typography>

          <Typography
            component="h1"
            variant="h2"
            sx={{
              color: heroText,
              fontFamily: '"Fugaz One", sans-serif',
              fontSize: { xs: '2.6rem', sm: '3.4rem', md: '4rem' },
              lineHeight: 1.1,
              mb: 3,
            }}
          >
            Ace every WGU CS assessment
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: heroSubtext, mb: 5, maxWidth: 420, lineHeight: 1.7, fontSize: '1.05rem' }}
          >
            AI-generated quizzes across 10 core CS topics. Answer, get instant explanations, and walk away knowing what to review.
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={signInWithGoogle}
            sx={{
              bgcolor: heroText,
              color: '#292966',
              fontWeight: 700,
              py: 1.75,
              px: 4,
              fontSize: '1rem',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.88)' },
              boxShadow: 'none',
            }}
          >
            Sign in with Google
          </Button>
        </Grid>

        {/* Right column — decorative icon tiles */}
        <Grid
          item
          md={6}
          sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}
        >
          <IconTileGrid />
        </Grid>
      </Grid>
    </Box>
  )
}
