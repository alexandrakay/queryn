import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { describe, it, expect } from 'vitest'
import { createAppTheme } from '../../theme'
import TopicSelector from '../TopicSelector'

const theme = createAppTheme('light')

const TOPICS = [
  'Data Structures',
  'Algorithms',
  'Operating Systems',
  'Databases',
  'Networks',
  'Software Design',
  'Limits',
  'Derivatives',
  'Integrals',
  'Differential Equations',
  'Java Development',
  'AI / Machine Learning',
]

function renderWithRouter() {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<TopicSelector />} />
          <Route path="/quiz/:topic" element={<div data-testid="quiz-screen" />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  )
}

describe('TopicSelector', () => {
  it('renders all 12 topic cards', () => {
    renderWithRouter()
    TOPICS.forEach(topic => {
      expect(screen.getByText(topic)).toBeInTheDocument()
    })
  })

  it('does not render the old Calculus card', () => {
    renderWithRouter()
    expect(screen.queryByText('Calculus')).not.toBeInTheDocument()
  })

  it('navigates to /quiz/:topic when a card is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter()
    await user.click(screen.getByText('Derivatives'))
    expect(screen.getByTestId('quiz-screen')).toBeInTheDocument()
  })

  it('navigates when the AI / Machine Learning card is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter()
    await user.click(screen.getByText('AI / Machine Learning'))
    expect(screen.getByTestId('quiz-screen')).toBeInTheDocument()
  })
})
