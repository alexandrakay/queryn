import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import { useAuth } from '../context/AuthContext'

const accent = '#60a5fa'
const mono = "'DM Mono', monospace"
const display = "'Syne', sans-serif"

const DOTS = Array.from({ length: 12 })

function GoogleIcon() {
  return (
    <Box component="svg" width={16} height={16} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#0d0d0d" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#0d0d0d" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#0d0d0d" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#0d0d0d" />
    </Box>
  )
}

function TopicPill({ children, lit = false }) {
  return (
    <Box
      component="span"
      sx={{
        bgcolor: '#141414',
        border: '1px solid',
        borderColor: lit ? '#1a2d4a' : '#222',
        borderRadius: 1,
        px: '10px',
        py: '5px',
        fontFamily: mono,
        fontSize: 10,
        color: lit ? accent : '#ffffff',
        letterSpacing: '0.06em',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Box>
  )
}

function Block({ children, accentBlock = false, sx }) {
  return (
    <Box
      sx={{
        borderRadius: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        bgcolor: accentBlock ? '#0a0f1a' : '#141414',
        border: '1px solid',
        borderColor: accentBlock ? '#1a2d4a' : '#222',
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

export default function LandingPage({ onToggleMode, mode }) {
  const { signInWithGoogle } = useAuth()

  return (
    <Box
      sx={{
        bgcolor: '#0d0d0d',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: mono,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: '6vw 7vw 8vw', md: '4vh 6vw 5vh' },
          boxSizing: 'border-box',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: '6vh' }}>
          <Typography
            component="span"
            sx={{
              fontFamily: mono,
              fontSize: 11,
              letterSpacing: '0.18em',
              color: '#D3D3D3',
              textTransform: 'uppercase',
            }}
          >
            queryn
          </Typography>

          <IconButton
            onClick={onToggleMode}
            aria-label={mode === 'light' ? 'Dark mode' : 'Light mode'}
            sx={{
              width: 28,
              height: 28,
              border: '1px solid #2a2a2a',
              bgcolor: '#1a1a1a',
              color: '#4a4a4a',
              fontSize: 16,
              '&:hover': { bgcolor: '#1a1a1a' },
            }}
          >
            {mode === 'light' ? '☽' : '☀'}
          </IconButton>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '3vw',
            flex: 1,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0, width: { xs: '100%', md: 'auto' } }}>
            <Stack
              direction="row"
              alignItems="center"
              gap="7px"
              sx={{
                fontSize: 11,
                color: '#D3D3D3',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                mb: '18px',
              }}
            >
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: accent, flexShrink: 0 }} />
              AI quiz engine - CS
            </Stack>

            <Box sx={{ width: 32, height: 2, bgcolor: accent, borderRadius: 1, mb: 2 }} />

            <Typography
              component="h1"
              sx={{
                fontFamily: display,
                fontSize: { xs: 'clamp(36px, 10vw, 52px)', md: 'clamp(44px, 5.8vw, 92px)' },
                fontWeight: 800,
                lineHeight: 1,
                color: '#f5f5f0',
                letterSpacing: { xs: '-1.5px', md: '-3px' },
                m: { xs: '0 0 16px 0', md: '0 0 2.5vh 0' },
              }}
            >
              Ace every
              <br />
              CS
              <br />
              <Box component="em" sx={{ color: accent, fontStyle: 'normal' }}>
                assessment.
              </Box>
            </Typography>

            <Typography
              sx={{
                fontFamily: mono,
                fontSize: { xs: 13, md: 'clamp(12px, 1vw, 14px)' },
                lineHeight: 1.8,
                color: '#D3D3D3',
                maxWidth: { xs: '100%', md: '44ch' },
                mb: { xs: '28px', md: '4vh' },
              }}
            >
              AI-generated quizzes across 12 core CS topics. Answer, get instant explanations,
              and walk away knowing exactly what to review.
            </Typography>

            <Button
              onClick={signInWithGoogle}
              startIcon={<GoogleIcon />}
              endIcon={<Box component="span" sx={{ ml: 0.5, fontSize: 14 }}>→</Box>}
              sx={{
                bgcolor: accent,
                color: '#0d0d0d',
                fontFamily: mono,
                fontSize: 11.5,
                fontWeight: 500,
                letterSpacing: '0.06em',
                px: 3,
                py: '13px',
                borderRadius: 1.5,
                textTransform: 'uppercase',
                '&:hover': { bgcolor: accent },
              }}
            >
              Sign in with Google
            </Button>
          </Box>

          <Stack
            gap="12px"
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'flex-start',
              flexShrink: 0,
              width: { md: '40vw', lg: '36vw' },
              maxWidth: 460,
              overflow: 'hidden',
            }}
          >
            <Stack direction="row" gap="10px" alignItems="center">
              <TopicPill lit>/ data structures</TopicPill>
              <Block sx={{ width: 100, height: 80 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 8px)', gap: '6px', opacity: 0.15 }}>
                  {DOTS.map((_, i) => (
                    <Box key={i} sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#f5f5f0' }} />
                  ))}
                </Box>
              </Block>
            </Stack>

            <Stack direction="row" gap="10px" alignItems="center">
              <Block sx={{ width: 110, height: 110 }}>
                <Stack alignItems="center" justifyContent="center" gap="2px">
                  <Typography sx={{ fontFamily: display, fontSize: 26, fontWeight: 800, color: accent, letterSpacing: '-0.5px' }}>
                    12
                  </Typography>
                  <Typography sx={{ fontFamily: mono, fontSize: 10, color: '#333', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    topics
                  </Typography>
                </Stack>
              </Block>

              <Block accentBlock sx={{ width: 88, height: 88 }}>
                <Box component="svg" width={36} height={36} viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="10" stroke={accent} strokeWidth="1" opacity="0.5" />
                  <circle cx="14" cy="14" r="5" stroke={accent} strokeWidth="1" opacity="0.35" />
                  <circle cx="14" cy="14" r="2" fill={accent} opacity="0.8" />
                </Box>
              </Block>

              <Block sx={{ width: 76, height: 76 }}>
                <Box component="svg" width={28} height={28} viewBox="0 0 24 24" fill="none">
                  <polyline points="3,18 7,10 12,14 18,5 22,8" stroke={accent} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
                </Box>
              </Block>
            </Stack>

            <Stack direction="row" gap="10px" alignItems="center">
              <TopicPill>algorithms</TopicPill>
              <TopicPill>os</TopicPill>
              <TopicPill>networks</TopicPill>
            </Stack>

            <Stack direction="row" gap="10px" alignItems="center">
              <TopicPill>discrete math</TopicPill>
              <TopicPill lit>ai / ml</TopicPill>
            </Stack>

            <Typography sx={{ fontFamily: mono, fontSize: 10, color: '#D3D3D3', letterSpacing: '0.08em', mt: '4px' }}>
              instant explanations →
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
