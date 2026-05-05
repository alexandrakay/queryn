import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { describe, it, expect } from 'vitest'
import { createAppTheme } from '../../theme'
import QuizScreen from '../QuizScreen'

const theme = createAppTheme('light')

function renderAtRoute(topic = 'Algorithms') {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[`/quiz/${topic}`]}>
        <Routes>
          <Route path="/quiz/:topic" element={<QuizScreen />} />
          <Route path="/" element={<div data-testid="topic-selector" />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  )
}

describe('QuizScreen — layout', () => {
  it('displays the topic name', () => {
    renderAtRoute('Algorithms')
    expect(screen.getByText(/Algorithms/i)).toBeInTheDocument()
  })

  it('displays a question', () => {
    renderAtRoute()
    expect(screen.getByTestId('question-text')).toBeInTheDocument()
  })

  it('renders 4 answer options', () => {
    renderAtRoute()
    expect(screen.getAllByRole('button', { name: /option/i })).toHaveLength(4)
  })

  it('shows a progress indicator', () => {
    renderAtRoute()
    expect(screen.getByText(/question 1 of 5/i)).toBeInTheDocument()
  })
})

describe('QuizScreen — answer selection', () => {
  it('locks options after an answer is selected', async () => {
    const user = userEvent.setup()
    renderAtRoute()
    const options = screen.getAllByRole('button', { name: /option/i })
    await user.click(options[0])
    for (const btn of options) {
      expect(btn).toBeDisabled()
    }
  })

  it('shows a Next button after answering', async () => {
    const user = userEvent.setup()
    renderAtRoute()
    await user.click(screen.getAllByRole('button', { name: /option/i })[0])
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('shows an explanation after answering', async () => {
    const user = userEvent.setup()
    renderAtRoute()
    await user.click(screen.getAllByRole('button', { name: /option/i })[0])
    expect(screen.getByTestId('explanation')).toBeInTheDocument()
  })

  it('advances to the next question on Next click', async () => {
    const user = userEvent.setup()
    renderAtRoute()
    await user.click(screen.getAllByRole('button', { name: /option/i })[0])
    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText(/question 2 of 5/i)).toBeInTheDocument()
  })

  it('increments score when correct answer is selected', async () => {
    const user = userEvent.setup()
    renderAtRoute()
    // First question correctIndex is 1 (O(log n))
    const options = screen.getAllByRole('button', { name: /option/i })
    await user.click(options[1])
    expect(screen.getByTestId('score')).toHaveTextContent('1')
  })
})
