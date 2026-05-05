import { useState } from 'react'
import { Box, Card, CardContent, Typography, Button, LinearProgress, Stack } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'

const MOCK_QUESTIONS = [
  {
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctIndex: 1,
    explanation: 'Binary search halves the search space each step, giving O(log n) complexity.',
  },
  {
    question: 'Which data structure uses LIFO ordering?',
    options: ['Queue', 'Heap', 'Stack', 'Graph'],
    correctIndex: 2,
    explanation: 'A stack follows Last-In, First-Out — the last element pushed is the first popped.',
  },
  {
    question: 'What does CPU stand for?',
    options: ['Central Processing Unit', 'Core Processing Utility', 'Central Program Unit', 'Computer Processing Unit'],
    correctIndex: 0,
    explanation: 'CPU stands for Central Processing Unit — the primary component executing instructions.',
  },
  {
    question: 'Which sorting algorithm has the best average-case time complexity?',
    options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Selection Sort'],
    correctIndex: 2,
    explanation: 'Merge Sort runs in O(n log n) in all cases, the best achievable for comparison-based sorting.',
  },
  {
    question: 'What is a primary key in a relational database?',
    options: [
      'A key used to encrypt data',
      'A unique identifier for each record',
      'The first column in a table',
      'A foreign reference to another table',
    ],
    correctIndex: 1,
    explanation: 'A primary key uniquely identifies each row in a table and cannot be null.',
  },
]

function optionSx(i, selectedIndex, correctIndex) {
  if (selectedIndex === null) return {}
  if (i === correctIndex) return { borderColor: '#4A7C59', color: '#4A7C59', bgcolor: '#4A7C5912' }
  if (i === selectedIndex) return { borderColor: '#9B3A3A', color: '#9B3A3A', bgcolor: '#9B3A3A12' }
  return {}
}

export default function QuizScreen() {
  const { topic } = useParams()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [score, setScore] = useState(0)

  const question = MOCK_QUESTIONS[currentIndex]
  const answered = selectedIndex !== null
  const progress = (currentIndex / MOCK_QUESTIONS.length) * 100
  const isLast = currentIndex === MOCK_QUESTIONS.length - 1

  function handleSelect(i) {
    if (answered) return
    setSelectedIndex(i)
    if (i === question.correctIndex) setScore(s => s + 1)
  }

  function handleNext() {
    if (isLast) {
      navigate('/score', { state: { score, total: MOCK_QUESTIONS.length, topic } })
    } else {
      setCurrentIndex(i => i + 1)
      setSelectedIndex(null)
    }
  }

  return (
    <Box sx={{ p: 4, maxWidth: 720, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" color="text.secondary">{topic}</Typography>
        <Typography variant="body2" color="text.secondary" data-testid="score">
          {score}
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Question {currentIndex + 1} of {MOCK_QUESTIONS.length}
      </Typography>

      <LinearProgress variant="determinate" value={progress} sx={{ mb: 4, height: 4 }} />

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" data-testid="question-text">
            {question.question}
          </Typography>
        </CardContent>
      </Card>

      <Stack spacing={1.5}>
        {question.options.map((option, i) => (
          <Button
            key={i}
            variant="outlined"
            disabled={answered}
            sx={{ justifyContent: 'flex-start', py: 1.5, px: 2, textTransform: 'none', ...optionSx(i, selectedIndex, question.correctIndex) }}
            fullWidth
            aria-label={`option ${i + 1}`}
            onClick={() => handleSelect(i)}
          >
            <Typography variant="body1">{option}</Typography>
          </Button>
        ))}
      </Stack>

      {answered && (
        <Box sx={{ mt: 3 }}>
          <Card variant="outlined" sx={{ bgcolor: 'background.paper', mb: 2 }}>
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
                fontStyle="italic"
                data-testid="explanation"
              >
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
