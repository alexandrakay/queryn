import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { describe, it, expect, vi } from 'vitest'
import { createAppTheme } from '../../theme'
import Nav from '../Nav'

const theme = createAppTheme('light')

const mockSignOut = vi.fn()
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ signOut: mockSignOut }),
}))

function renderNav({ mode = 'light', path = '/' } = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="*" element={<Nav mode={mode} onToggle={vi.fn()} />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  )
}

describe('Nav', () => {
  it('renders the app name link', () => {
    renderNav()
    expect(screen.getByRole('button', { name: /queryn/i })).toBeInTheDocument()
  })

  it('renders a sign-out button', () => {
    renderNav()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('calls signOut when the sign-out button is clicked', async () => {
    const user = userEvent.setup()
    renderNav()
    await user.click(screen.getByRole('button', { name: /sign out/i }))
    expect(mockSignOut).toHaveBeenCalledOnce()
  })

  it('is hidden on quiz routes', () => {
    renderNav({ path: '/quiz/Algorithms' })
    expect(screen.queryByRole('button', { name: /queryn/i })).not.toBeInTheDocument()
  })
})
