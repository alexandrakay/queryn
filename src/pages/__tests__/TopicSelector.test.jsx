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
  'Calculus',
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
  it('renders all 7 topic cards', () => {
    renderWithRouter()
    TOPICS.forEach(topic => {
      expect(screen.getByText(topic)).toBeInTheDocument()
    })
  })

  it('navigates to /quiz/:topic when a card is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter()
    await user.click(screen.getByText('Algorithms'))
    expect(screen.getByTestId('quiz-screen')).toBeInTheDocument()
  })
})
