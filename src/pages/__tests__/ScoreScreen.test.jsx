import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAppTheme } from '../../theme'

const MOCK_AUTH_USER = Object.freeze({ uid: 'test-uid' })

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: MOCK_AUTH_USER }),
}))

vi.mock('../../services/anthropic', () => ({
  generateSessionSummary: vi.fn(),
}))

vi.mock('../../services/firestore', () => ({
  saveSession: vi.fn().mockResolvedValue('session-123'),
}))

import ScoreScreen from '../ScoreScreen'
import { generateSessionSummary } from '../../services/anthropic'

const theme = createAppTheme('light')

function renderAtRoute({ score = 3, total = 5, topic = 'Algorithms', results = [] } = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[{ pathname: '/score', state: { score, total, topic, results } }]}>
        <Routes>
          <Route path="/score" element={<ScoreScreen />} />
          <Route path="/" element={<div data-testid="topic-selector" />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  )
}

const SAMPLE_RESULTS = [
  { question: 'What is recursion?', correctIndex: 0, selectedIndex: 1 },
]

describe('ScoreScreen', () => {
  beforeEach(() => {
    generateSessionSummary.mockResolvedValue('Great job overall!')
  })

  it('displays the score', () => {
    renderAtRoute({ score: 3, total: 5 })
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('/5')).toBeInTheDocument()
  })

  it('displays the topic name', () => {
    renderAtRoute({ topic: 'Algorithms' })
    expect(screen.getByText(/Algorithms/i)).toBeInTheDocument()
  })

  it('shows an AI summary card', () => {
    renderAtRoute()
    expect(screen.getByText(/AI Summary/i)).toBeInTheDocument()
  })

  it('returns to topic selector on button click', async () => {
    const user = userEvent.setup()
    renderAtRoute({ results: SAMPLE_RESULTS })
    await waitFor(() => expect(generateSessionSummary).toHaveBeenCalled())
    await user.click(screen.getByRole('button', { name: /back to topics/i }))
    expect(screen.getByTestId('topic-selector')).toBeInTheDocument()
  })

  it('shows server error messaging when summary generation fails', async () => {
    generateSessionSummary.mockRejectedValueOnce(new Error('Must be signed in.'))
    renderAtRoute({ results: SAMPLE_RESULTS })
    await waitFor(() => expect(screen.getByText(/Must be signed in/i)).toBeInTheDocument())
  })

  it('retries summary generation when Retry is clicked', async () => {
    const user = userEvent.setup()
    let calls = 0
    generateSessionSummary.mockReset()
    generateSessionSummary.mockImplementation(() => {
      calls += 1
      return calls === 1
        ? Promise.reject(new Error('Temporary failure'))
        : Promise.resolve('Much better!')
    })
    renderAtRoute({ results: SAMPLE_RESULTS })
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    await user.click(screen.getByTestId('summary-retry'))
    await waitFor(() => expect(screen.getByTestId('ai-feedback')).toHaveTextContent('Much better!'))
    expect(generateSessionSummary).toHaveBeenCalledTimes(2)
  })
})
