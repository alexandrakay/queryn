import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAppTheme } from '../../theme'
import HistoryScreen from '../HistoryScreen'

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'test-uid' } }),
}))

vi.mock('../../services/firestore', () => ({
  getSessions: vi.fn(),
}))

import { getSessions } from '../../services/firestore'

const theme = createAppTheme('light')

const MOCK_SESSIONS = [
  {
    id: 'sess-1',
    topic: 'Algorithms',
    score: 4,
    totalQuestions: 5,
    createdAt: { toDate: () => new Date('2026-05-01T10:00:00Z') },
  },
  {
    id: 'sess-2',
    topic: 'Databases',
    score: 2,
    totalQuestions: 5,
    createdAt: { toDate: () => new Date('2026-04-30T10:00:00Z') },
  },
]

function renderHistory() {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={['/history']}>
        <Routes>
          <Route path="/history" element={<HistoryScreen />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  )
}

describe('HistoryScreen', () => {
  beforeEach(() => {
    getSessions.mockResolvedValue(MOCK_SESSIONS)
  })

  it('shows a loading state initially', () => {
    renderHistory()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders a session entry for each past session', async () => {
    renderHistory()
    await waitFor(() => expect(screen.getByText('Algorithms')).toBeInTheDocument())
    expect(screen.getByText('Databases')).toBeInTheDocument()
  })

  it('displays the score for each session', async () => {
    renderHistory()
    await waitFor(() => expect(screen.getByText('4 / 5')).toBeInTheDocument())
    expect(screen.getByText('2 / 5')).toBeInTheDocument()
  })

  it('shows an empty state when no sessions exist', async () => {
    getSessions.mockResolvedValue([])
    renderHistory()
    await waitFor(() => expect(screen.getByTestId('empty-history')).toBeInTheDocument())
  })
})
