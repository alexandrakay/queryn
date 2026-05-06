import { createTheme } from '@mui/material'

export function createAppTheme(mode) {
  const shared = {
    success: { main: '#4A7C59', light: '#6AAF7A', dark: '#2F5239', contrastText: '#FFFFFF' },
    error: { main: '#9B3A3A', light: '#C05050', dark: '#6B2020', contrastText: '#FFFFFF' },
  }

  const light = {
    ...shared,
    primary: { main: '#292966', light: '#5C5C99', dark: '#1a1a44', contrastText: '#FFFFFF' },
    secondary: { main: '#5C5C99', light: '#A3A3CC', dark: '#3a3a77' },
    background: { default: '#EFEFED', paper: '#FAFAF9' },
    text: { primary: '#1C1917', secondary: '#5C5C99' },
    divider: '#D6D3D1',
  }

  const dark = {
    ...shared,
    primary: { main: '#CCCCFF', light: '#E0E0FF', dark: '#A3A3CC', contrastText: '#1a1a44' },
    secondary: { main: '#A3A3CC', light: '#CCCCFF', dark: '#5C5C99' },
    background: { default: '#12122A', paper: '#1E1E40' },
    text: { primary: '#F0F0FF', secondary: '#A3A3CC' },
    divider: 'rgba(204,204,255,0.12)',
  }

  const cardShadow = mode === 'light'
    ? '0 2px 8px rgba(41,41,102,0.08), 0 1px 2px rgba(41,41,102,0.06)'
    : '0 2px 8px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)'

  return createTheme({
    palette: { mode, ...(mode === 'light' ? light : dark) },
    typography: {
      fontFamily: '"Work Sans", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontFamily: '"Fugaz One", sans-serif' },
      h2: { fontFamily: '"Fugaz One", sans-serif' },
      h3: { fontFamily: '"Fugaz One", sans-serif' },
      h4: { fontFamily: '"Fugaz One", sans-serif', letterSpacing: '-0.01em' },
      h5: { fontFamily: '"Fugaz One", sans-serif' },
      h6: { fontFamily: '"Fugaz One", sans-serif' },
      button: { fontWeight: 600, letterSpacing: '0.01em' },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: mode === 'light' ? '1px solid #D6D3D1' : '1px solid rgba(204,204,255,0.12)',
            boxShadow: cardShadow,
            transition: 'box-shadow 0.2s ease, transform 0.15s ease',
          },
        },
      },
      MuiCardActionArea: {
        styleOverrides: {
          root: {
            '&:hover': {
              '& .MuiCardContent-root': {
                transform: 'translateY(-1px)',
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
          contained: {
            boxShadow: mode === 'light'
              ? '0 2px 6px rgba(41,41,102,0.2)'
              : '0 2px 6px rgba(0,0,0,0.4)',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 4px 12px rgba(41,41,102,0.28)'
                : '0 4px 12px rgba(0,0,0,0.5)',
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: mode === 'light' ? '#D6D3D1' : 'rgba(204,204,255,0.12)' },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 4 },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            borderRadius: '12px !important',
            overflow: 'hidden',
          },
        },
      },
    },
  })
}
