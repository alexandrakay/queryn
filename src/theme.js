import { createTheme } from '@mui/material'

export function createAppTheme(mode) {
  const light = {
    primary: { main: '#292966', light: '#5C5C99', dark: '#1a1a44', contrastText: '#FFFFFF' },
    secondary: { main: '#5C5C99', light: '#A3A3CC', dark: '#3a3a77' },
    background: { default: '#EFEFED', paper: '#FAFAF9' },
    text: { primary: '#1C1917', secondary: '#5C5C99' },
    divider: '#D6D3D1',
  }

  const dark = {
    primary: { main: '#CCCCFF', light: '#E0E0FF', dark: '#A3A3CC', contrastText: '#1a1a44' },
    secondary: { main: '#A3A3CC', light: '#CCCCFF', dark: '#5C5C99' },
    background: { default: '#12122A', paper: '#1E1E40' },
    text: { primary: '#F0F0FF', secondary: '#A3A3CC' },
    divider: 'rgba(204,204,255,0.12)',
  }

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
    shape: { borderRadius: 0 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: mode === 'light' ? '1px solid #D6D3D1' : '1px solid rgba(204,204,255,0.12)',
            boxShadow: 'none',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: mode === 'light' ? '#D6D3D1' : 'rgba(204,204,255,0.12)' },
        },
      },
    },
  })
}
