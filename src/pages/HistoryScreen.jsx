import { useState, useEffect } from 'react'
import { Box, CircularProgress, Typography, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useAuth } from '../context/AuthContext'
import { getSessions } from '../services/firestore'

function formatDate(createdAt) {
  if (!createdAt?.toDate) return '—'
  return createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
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
    <Box sx={{ p: 4, maxWidth: 720, mx: 'auto' }}>
      <Typography variant="h5" color="primary" gutterBottom>
        History
      </Typography>
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
            sx={{ mb: 1, border: 1, borderColor: 'divider', '&:before': { display: 'none' } }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 1 }}>
                <Box>
                  <Typography variant="h6" fontFamily='"Fugaz One", sans-serif'>
                    {session.topic}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(session.createdAt)}
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary">
                  {session.score} / {session.totalQuestions}
                </Typography>
              </Box>
            </AccordionSummary>
            {expanded === session.id && (
              <AccordionDetails sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
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
