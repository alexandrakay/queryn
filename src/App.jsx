import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material'
import theme from './theme'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 4, textAlign: 'center', mt: 8 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          queryn
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered WGU CS study tool
        </Typography>
      </Box>
    </ThemeProvider>
  )
}
