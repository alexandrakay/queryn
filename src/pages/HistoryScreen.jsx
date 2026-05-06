import { useState, useEffect } from 'react'
import { Box, CircularProgress, Typography, Divider, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useAuth } from '../context/AuthContext'
import { getSessions } from '../services/firestore'

function formatDate(createdAt) {
  if (!createdAt?.toDate) return '—'
  return createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function scoreColor(score, total) {
  const pct = score / total
  if (pct === 1) return 'success'
  if (pct >= 0.8) return 'success'
  if (pct >= 0.6) return 'warning'
  return 'error'
}

export default function HistoryScreen() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (!user) return
    getSessions(user.uid)
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false))
  }, [user])

  function handleToggle(id) {
    setExpanded(prev => (prev === id ? null : id))
  }

  return (
    <Box sx={{ p: { xs: 3, sm: 4 }, maxWidth: 720, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" color="primary" sx={{ mb: 0.5 }}>
          History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your past quiz sessions
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : sessions.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }} data-testid="empty-history">
          No sessions yet. Pick a topic to get started.
        </Typography>
      ) : (
        sessions.map(session => (
          <Accordion
            key={session.id}
            expanded={expanded === session.id}
            onChange={() => handleToggle(session.id)}
            disableGutters
            elevation={0}
            sx={{ mb: 1.5, border: 1, borderColor: 'divider', '&:before': { display: 'none' } }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ py: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 1 }}>
                <Box>
                  <Typography variant="h6" fontFamily='"Fugaz One", sans-serif'>
                    {session.topic}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" letterSpacing={0.5}>
                    {formatDate(session.createdAt)}
                  </Typography>
                </Box>
                <Chip
                  label={`${session.score} / ${session.totalQuestions}`}
                  color={scoreColor(session.score, session.totalQuestions)}
                  size="small"
                  sx={{ fontWeight: 700, fontFamily: '"Fugaz One", sans-serif', fontSize: '0.85rem' }}
                />
              </Box>
            </AccordionSummary>
            {expanded === session.id && (
              <AccordionDetails sx={{ borderTop: 1, borderColor: 'divider', pt: 2, pb: 2.5 }}>
                <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{ lineHeight: 1.7 }}>
                  {session.aiFeedback ?? 'No summary available.'}
                </Typography>
              </AccordionDetails>
            )}
          </Accordion>
        ))
      )}
    </Box>
  )
}
