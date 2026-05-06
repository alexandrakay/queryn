import { createTheme } from '@mui/material'

export function createAppTheme(mode) {
  const isDark = mode === 'dark'

  const palette = {
    mode,
    primary: {
      main: '#60a5fa',
      light: '#93c5fd',
      dark: '#3b82f6',
      contrastText: isDark ? '#0d0d0d' : '#ffffff',
    },
    secondary: {
      main: isDark ? '#3d3d3d' : '#6b6b6b',
      light: isDark ? '#5a5a5a' : '#8a8a8a',
      dark:  isDark ? '#222222' : '#4a4a4a',
      contrastText: isDark ? '#f5f5f0' : '#0d0d0d',
    },
    success: { main: '#22c55e', light: '#4ade80', dark: '#16a34a', contrastText: '#0d0d0d' },
    error:   { main: '#ef4444', light: '#f87171', dark: '#dc2626', contrastText: '#ffffff' },
    warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706', contrastText: '#0d0d0d' },
    background: {
      default: isDark ? '#0d0d0d' : '#f5f5f0',
      paper:   isDark ? '#141414' : '#ffffff',
    },
    text: {
      primary:   isDark ? '#f5f5f0' : '#0d0d0d',
      secondary: isDark ? '#5a5a5a' : '#6b6b6b',
      disabled:  isDark ? '#3d3d3d' : '#aaaaaa',
    },
    divider: isDark ? '#222222' : '#e0e0da',
  }

  const cardBorder = isDark ? '1px solid #222' : '1px solid #e0e0da'
  const cardBg     = isDark ? '#141414' : '#ffffff'
  const cardShadow = isDark
    ? '0 2px 8px rgba(0,0,0,0.6)'
    : '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'

  return createTheme({
    palette,
    typography: {
      fontFamily: '"DM Mono", "Roboto Mono", monospace',
      h1: { fontFamily: '"Syne", sans-serif', fontWeight: 800, letterSpacing: '-2px' },
      h2: { fontFamily: '"Syne", sans-serif', fontWeight: 800, letterSpacing: '-1.5px' },
      h3: { fontFamily: '"Syne", sans-serif', fontWeight: 800, letterSpacing: '-1px' },
      h4: { fontFamily: '"Syne", sans-serif', fontWeight: 700, letterSpacing: '-0.5px' },
      h5: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
      h6: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
      overline: { fontFamily: '"DM Mono", monospace', letterSpacing: '0.12em', fontSize: '0.65rem' },
      caption:  { fontFamily: '"DM Mono", monospace', letterSpacing: '0.06em' },
      button:   { fontFamily: '"DM Mono", monospace', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' },
    },
    shape: { borderRadius: 6 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { background: isDark ? '#0d0d0d' : '#f5f5f0' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            background: cardBg,
            border: cardBorder,
            boxShadow: cardShadow,
            transition: 'box-shadow 0.2s ease, transform 0.15s ease',
          },
        },
      },
      MuiCardActionArea: {
        styleOverrides: {
          root: {
            '&:hover .MuiCardContent-root': { transform: 'translateY(-1px)' },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDark ? '#0d0d0d' : '#f5f5f0',
            borderBottom: cardBorder,
            boxShadow: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 6 },
          contained: {
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 4px 16px rgba(96,165,250,0.3)' },
          },
          outlined: {
            borderColor: isDark ? '#222' : '#e0e0da',
            color: isDark ? '#f5f5f0' : '#0d0d0d',
            '&:hover': { borderColor: '#60a5fa', color: '#60a5fa', background: 'transparent' },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: isDark ? '#3d3d3d' : '#6b6b6b',
            '&:hover': { color: '#60a5fa', background: 'transparent' },
          },
        },
      },
      MuiDivider: {
        styleOverrides: { root: { borderColor: isDark ? '#222' : '#e0e0da' } },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 4, background: isDark ? '#222' : '#e0e0da' },
          bar:  { background: '#60a5fa' },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            background: cardBg,
            border: cardBorder,
            boxShadow: 'none',
            borderRadius: '6px !important',
            overflow: 'hidden',
            '&:before': { display: 'none' },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontFamily: '"DM Mono", monospace', letterSpacing: '0.04em' },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.7rem',
            background: isDark ? '#222' : '#0d0d0d',
            color: '#f5f5f0',
          },
        },
      },
    },
  })
}
