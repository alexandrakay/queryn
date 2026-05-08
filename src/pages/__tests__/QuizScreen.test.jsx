import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAppTheme } from '../../theme'
import QuizScreen from '../QuizScreen'

vi.mock('../../services/anthropic', () => ({
  generateQuestions: vi.fn(),
}))

import { generateQuestions } from '../../services/anthropic'

const theme = createAppTheme('light')

const MOCK_QUESTIONS = Array.from({ length: 5 }, (_, i) => ({
  question: `Question ${i + 1}`,
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correctIndex: 1,
  explanation: `Explanation ${i + 1}`,
}))

function renderAtRoute(topic = 'Algorithms') {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[`/quiz/${topic}`]}>
        <Routes>
          <Route path="/quiz/:topic" element={<QuizScreen />} />
          <Route path="/" element={<div data-testid="topic-selector" />} />
          <Route path="/score" element={<div data-testid="score-screen" />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  )
}

describe('QuizScreen — layout', () => {
  beforeEach(() => {
    generateQuestions.mockResolvedValue(MOCK_QUESTIONS)
  })

  it('shows loading state initially', () => {
    renderAtRoute()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays the topic name after loading', async () => {
    renderAtRoute('Algorithms')
    await waitFor(() => expect(screen.getByText(/Algorithms/i)).toBeInTheDocument())
  })

  it('displays a question after loading', async () => {
    renderAtRoute()
    await waitFor(() => expect(screen.getByTestId('question-text')).toBeInTheDocument())
  })

  it('renders 4 answer options after loading', async () => {
    renderAtRoute()
    await waitFor(() => expect(screen.getAllByRole('button', { name: /option/i })).toHaveLength(4))
  })

  it('shows a progress indicator after loading', async () => {
    renderAtRoute()
    await waitFor(() => expect(screen.getByText(/question 1 of 5/i)).toBeInTheDocument())
  })

  it('shows error state when API fails', async () => {
    generateQuestions.mockRejectedValue(new Error('API error'))
    renderAtRoute()
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })

  it('surfaces the API error message in the quiz error banner', async () => {
    generateQuestions.mockRejectedValue(new Error('topic must be 250 characters or fewer.'))
    renderAtRoute()
    await waitFor(() => expect(screen.getByText(/250 characters or fewer/i)).toBeInTheDocument())
  })

  it('retries generating questions when Try again is clicked', async () => {
    const user = userEvent.setup()
    generateQuestions.mockRejectedValueOnce(new Error('Temporary failure')).mockResolvedValueOnce(MOCK_QUESTIONS)
    renderAtRoute()
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    await user.click(screen.getByTestId('quiz-retry-generation'))
    await waitFor(() => expect(screen.getByTestId('question-text')).toBeInTheDocument())
  })
})

describe('QuizScreen — answer selection', () => {
  beforeEach(() => {
    generateQuestions.mockResolvedValue(MOCK_QUESTIONS)
  })

  it('locks options after an answer is selected', async () => {
    const user = userEvent.setup()
    renderAtRoute()
    await waitFor(() => screen.getAllByRole('button', { name: /option/i }))
    await user.click(screen.getAllByRole('button', { name: /option/i })[0])
    for (const btn of screen.getAllByRole('button', { name: /option/i })) {
      expect(btn).toBeDisabled()
    }
  })

  it('shows a Next button after answering', async () => {
    const user = userEvent.setup()
    renderAtRoute()
    await waitFor(() => screen.getAllByRole('button', { name: /option/i }))
    await user.click(screen.getAllByRole('button', { name: /option/i })[0])
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('shows an explanation after answering', async () => {
    const user = userEvent.setup()
    renderAtRoute()
    await waitFor(() => screen.getAllByRole('button', { name: /option/i }))
    await user.click(screen.getAllByRole('button', { name: /option/i })[0])
    expect(screen.getByTestId('explanation')).toBeInTheDocument()
  })

  it('advances to the next question on Next click', async () => {
    const user = userEvent.setup()
    renderAtRoute()
    await waitFor(() => screen.getAllByRole('button', { name: /option/i }))
    await user.click(screen.getAllByRole('button', { name: /option/i })[0])
    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText(/question 2 of 5/i)).toBeInTheDocument()
  })

  it('increments score when correct answer is selected', async () => {
    const user = userEvent.setup()
    renderAtRoute()
    await waitFor(() => screen.getAllByRole('button', { name: /option/i }))
    // correctIndex is 1
    await user.click(screen.getAllByRole('button', { name: /option/i })[1])
    expect(screen.getByTestId('score')).toHaveTextContent('1')
  })
})
