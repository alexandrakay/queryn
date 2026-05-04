import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F97316',
      light: '#FB923C',
      dark: '#EA580C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#78716C',
      light: '#A8A29E',
      dark: '#57534E',
    },
    background: {
      default: '#EFEFED',
      paper: '#FAFAF9',
    },
    text: {
      primary: '#1C1917',
      secondary: '#78716C',
    },
    divider: '#D6D3D1',
  },
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
          border: '1px solid #D6D3D1',
          boxShadow: 'none',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#D6D3D1' },
      },
    },
  },
})

export default theme
