import { Box, Card, CardContent, Typography, Button, Divider } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

export default function ScoreScreen() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { score = 0, total = 5, topic = '' } = state ?? {}

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', textAlign: 'center', mt: 6 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {topic}
      </Typography>

      <Typography variant="h4" color="primary" sx={{ my: 2 }}>
        {score} out of {total}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Card variant="outlined" sx={{ mb: 4, textAlign: 'left' }}>
        <CardContent>
          <Typography variant="overline" color="text.secondary" display="block" gutterBottom>
            AI Summary
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            fontStyle="italic"
            data-testid="ai-feedback"
          >
            Your personalized performance summary will appear here once AI integration is complete.
          </Typography>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={() => navigate('/')}
      >
        Back to Topics
      </Button>
    </Box>
  )
}
