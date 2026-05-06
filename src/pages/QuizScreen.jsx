import { useState, useEffect } from 'react'
import { Box, Card, CardContent, Typography, Button, LinearProgress, Stack, CircularProgress, Alert, useTheme } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { generateQuestions } from '../services/anthropic'

function optionSx(i, selectedIndex, correctIndex, isDark) {
  if (selectedIndex === null) return {}
  const correctSx = {
    borderColor: '#22c55e',
    borderWidth: 2,
    color: '#22c55e',
    bgcolor: isDark ? 'rgba(34,197,94,0.22)' : 'rgba(34,197,94,0.14)',
    '&.Mui-disabled': {
      borderColor: '#22c55e',
      borderWidth: 2,
      color: '#22c55e',
      bgcolor: isDark ? 'rgba(34,197,94,0.22)' : 'rgba(34,197,94,0.14)',
    },
  }
  const wrongSx = {
    borderColor: '#ef4444',
    borderWidth: 2,
    color: '#ef4444',
    bgcolor: isDark ? 'rgba(239,68,68,0.22)' : 'rgba(239,68,68,0.14)',
    '&.Mui-disabled': {
      borderColor: '#ef4444',
      borderWidth: 2,
      color: '#ef4444',
      bgcolor: isDark ? 'rgba(239,68,68,0.22)' : 'rgba(239,68,68,0.14)',
    },
  }
  if (i === correctIndex) return correctSx
  if (i === selectedIndex) return wrongSx
  return {}
}

export default function QuizScreen() {
  const { topic } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState([])

  useEffect(() => {
    generateQuestions(topic)
      .then(setQuestions)
      .catch(() => setError('Failed to generate questions. Please try again.'))
      .finally(() => setLoading(false))
  }, [topic])

  if (loading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary">Generating questions for {topic}…</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="outlined" onClick={() => navigate('/')}>Back to Topics</Button>
      </Box>
    )
  }

  const question = questions[currentIndex]
  const answered = selectedIndex !== null
  const progress = (currentIndex / questions.length) * 100
  const isLast = currentIndex === questions.length - 1

  function handleSelect(i) {
    if (answered) return
    setSelectedIndex(i)
    if (i === question.correctIndex) setScore(s => s + 1)
    setResults(prev => [...prev, { question: question.question, correctIndex: question.correctIndex, selectedIndex: i }])
  }

  function handleNext() {
    if (isLast) {
      navigate('/score', { state: { score, total: questions.length, topic, results } })
    } else {
      setCurrentIndex(i => i + 1)
      setSelectedIndex(null)
    }
  }

  return (
    <Box sx={{ p: 4, maxWidth: 720, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">{topic}</Typography>
        <Typography variant="body2" color="text.secondary" data-testid="score">{score}</Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Question {currentIndex + 1} of {questions.length}
      </Typography>

      <LinearProgress variant="determinate" value={progress} sx={{ mb: 4, height: 4 }} />

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" data-testid="question-text">{question.question}</Typography>
        </CardContent>
      </Card>

      <Stack spacing={1.5}>
        {question.options.map((option, i) => (
          <Button
            key={i}
            variant="outlined"
            disabled={answered}
            fullWidth
            aria-label={`option ${i + 1}`}
            sx={{ justifyContent: 'flex-start', py: 1.5, px: 2, textTransform: 'none', ...optionSx(i, selectedIndex, question.correctIndex, isDark) }}
            onClick={() => handleSelect(i)}
          >
            <Typography variant="body1">{option}</Typography>
          </Button>
        ))}
      </Stack>

      {answered && (
        <Box sx={{ mt: 3 }}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" fontStyle="italic" data-testid="explanation">
                {question.explanation}
              </Typography>
            </CardContent>
          </Card>
          <Button variant="contained" fullWidth onClick={handleNext}>
            {isLast ? 'See Results' : 'Next'}
          </Button>
        </Box>
      )}
    </Box>
  )
}
