import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import QuizScreen from '../QuizScreen'

function renderAtRoute(topic = 'Algorithms') {
  return render(
    <MemoryRouter initialEntries={[`/quiz/${topic}`]}>
      <Routes>
        <Route path="/quiz/:topic" element={<QuizScreen />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('QuizScreen', () => {
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
