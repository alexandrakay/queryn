import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAppTheme } from '../../theme'
import ScoreScreen from '../ScoreScreen'

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'test-uid' } }),
}))

vi.mock('../../services/anthropic', () => ({
  generateSessionSummary: vi.fn().mockResolvedValue('Great job overall!'),
}))

vi.mock('../../services/firestore', () => ({
  saveSession: vi.fn().mockResolvedValue('session-123'),
}))

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

describe('ScoreScreen', () => {
  it('displays the score', () => {
    renderAtRoute({ score: 3, total: 5 })
    expect(screen.getByText(/3 out of 5/i)).toBeInTheDocument()
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
    renderAtRoute()
    await user.click(screen.getByRole('button', { name: /back to topics/i }))
    expect(screen.getByTestId('topic-selector')).toBeInTheDocument()
  })
})
