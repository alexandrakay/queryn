import { useState, useEffect } from 'react'
import { Box, Card, CardContent, CircularProgress, Typography, Divider } from '@mui/material'
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

  useEffect(() => {
    if (!user) return
    getSessions(user.uid)
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false))
  }, [user])

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
          <Card key={session.id} sx={{ mb: 2 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  )
}
