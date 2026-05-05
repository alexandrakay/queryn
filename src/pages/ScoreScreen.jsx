import { useState, useEffect } from 'react'
import { Box, Card, CardContent, Typography, Button, Divider, CircularProgress } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { generateSessionSummary } from '../services/anthropic'

export default function ScoreScreen() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { score = 0, total = 5, topic = '', results = [] } = state ?? {}
  const [aiFeedback, setAiFeedback] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)

  useEffect(() => {
    if (!results.length) {
      setSummaryLoading(false)
      return
    }
    generateSessionSummary(topic, results)
      .then(setAiFeedback)
      .catch(() => setAiFeedback('Unable to generate summary. Please try again.'))
      .finally(() => setSummaryLoading(false))
  }, [])

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
          {summaryLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">Generating your summary…</Typography>
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
              data-testid="ai-feedback"
            >
              {aiFeedback ?? 'No summary available.'}
            </Typography>
          )}
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
