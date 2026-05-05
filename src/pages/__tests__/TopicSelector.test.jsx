import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import TopicSelector from '../TopicSelector'

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
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<TopicSelector />} />
        <Route path="/quiz/:topic" element={<div data-testid="quiz-screen" />} />
      </Routes>
    </MemoryRouter>
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
