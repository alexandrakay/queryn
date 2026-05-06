import { useState, useEffect } from 'react'
import { Box, Card, CardContent, Typography, Button, Divider, CircularProgress, Chip } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { generateSessionSummary } from '../services/anthropic'
import { saveSession } from '../services/firestore'

function scoreLabel(score, total) {
  const pct = score / total
  if (pct === 1) return { label: 'Perfect', color: 'success' }
  if (pct >= 0.8) return { label: 'Great job', color: 'success' }
  if (pct >= 0.6) return { label: 'Keep going', color: 'warning' }
  return { label: 'Keep practicing', color: 'error' }
}

export default function ScoreScreen() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { score = 0, total = 5, topic = '', results = [] } = state ?? {}
  const [aiFeedback, setAiFeedback] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const { label, color } = scoreLabel(score, total)

  useEffect(() => {
    if (!results.length) {
      setSummaryLoading(false)
      return
    }
    generateSessionSummary(topic, results)
      .then(summary => {
        setAiFeedback(summary)
        if (user) {
          saveSession(user.uid, {
            topic,
            score,
            totalQuestions: total,
            aiFeedback: summary,
            questions: results,
          }).catch(() => {})
        }
      })
      .catch(() => setAiFeedback('Unable to generate summary. Please try again.'))
      .finally(() => setSummaryLoading(false))
  }, [])

  return (
    <Box sx={{ p: { xs: 3, sm: 4 }, maxWidth: 600, mx: 'auto', textAlign: 'center', mt: { xs: 4, sm: 6 } }}>
      <Typography variant="overline" color="text.secondary" letterSpacing={2}>
        {topic}
      </Typography>

      <Typography
        variant="h2"
        color="primary"
        sx={{ mt: 1, mb: 1, fontFamily: '"Fugaz One", sans-serif', fontSize: { xs: '3.5rem', sm: '5rem' } }}
      >
        {score}<Typography component="span" variant="h4" color="text.secondary" sx={{ fontFamily: '"Fugaz One", sans-serif' }}>/{total}</Typography>
      </Typography>

      <Chip label={label} color={color} sx={{ mb: 3, fontWeight: 700, letterSpacing: 0.5 }} />

      <Divider sx={{ my: 3 }} />

      <Card variant="outlined" sx={{ mb: 4, textAlign: 'left' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="overline" color="text.secondary" display="block" gutterBottom letterSpacing={2}>
            AI Summary
          </Typography>
          {summaryLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">Generating your summary…</Typography>
            </Box>
          ) : (
            <Typography
              variant="body1"
              color="text.secondary"
              fontStyle="italic"
              data-testid="ai-feedback"
              sx={{ lineHeight: 1.7 }}
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
