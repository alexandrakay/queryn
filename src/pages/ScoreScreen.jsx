import { useState, useEffect, useCallback } from 'react'
import { Box, Card, CardContent, Typography, Button, Divider, CircularProgress, Chip, Alert } from '@mui/material'
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
  const [summaryError, setSummaryError] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const { label, color } = scoreLabel(score, total)

  const loadSummary = useCallback(async () => {
    if (!results.length) {
      setSummaryLoading(false)
      setSummaryError(null)
      setAiFeedback(null)
      return
    }
    setSummaryLoading(true)
    setSummaryError(null)
    setAiFeedback(null)
    try {
      const summary = await generateSessionSummary(topic, results)
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
    } catch (err) {
      const msg =
        err instanceof Error && err.message?.trim()
          ? err.message.trim()
          : 'Unable to generate summary. Please try again.'
      setSummaryError(msg)
    } finally {
      setSummaryLoading(false)
    }
  }, [topic, results, user, score, total])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

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
          ) : summaryError ? (
            <Box sx={{ mt: 1 }}>
              <Alert severity="error" sx={{ mb: 2 }}>{summaryError}</Alert>
              <Button variant="outlined" size="small" data-testid="summary-retry" onClick={() => loadSummary()}>
                Retry summary
              </Button>
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
