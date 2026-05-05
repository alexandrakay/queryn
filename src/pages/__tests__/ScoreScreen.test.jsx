import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { describe, it, expect } from 'vitest'
import { createAppTheme } from '../../theme'
import ScoreScreen from '../ScoreScreen'

const theme = createAppTheme('light')

function renderAtRoute({ score = 3, total = 5, topic = 'Algorithms' } = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[{ pathname: '/score', state: { score, total, topic } }]}>
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

  it('shows a placeholder AI summary', () => {
    renderAtRoute()
    expect(screen.getByTestId('ai-feedback')).toBeInTheDocument()
  })

  it('returns to topic selector on button click', async () => {
    const user = userEvent.setup()
    renderAtRoute()
    await user.click(screen.getByRole('button', { name: /back to topics/i }))
    expect(screen.getByTestId('topic-selector')).toBeInTheDocument()
  })
})
