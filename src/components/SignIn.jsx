import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import { useAuth } from '../context/AuthContext'

export default function SignIn() {
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
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2, p: 2 }} elevation={3}>
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
