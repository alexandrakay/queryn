import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { describe, it, expect, vi } from 'vitest'
import { createAppTheme } from '../../theme'
import LandingPage from '../LandingPage'

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ signInWithGoogle: vi.fn() }),
}))

const theme = createAppTheme('light')

function renderLandingPage(props = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <LandingPage onToggleMode={props.onToggleMode ?? vi.fn()} mode={props.mode ?? 'light'} />
      </MemoryRouter>
    </ThemeProvider>
  )
}

describe('LandingPage', () => {
  it('displays the app name', () => {
    renderLandingPage()
    expect(screen.getByText('queryn')).toBeInTheDocument()
  })

  it('communicates the app purpose', () => {
    renderLandingPage()
    expect(screen.getByText(/CS topics/i)).toBeInTheDocument()
  })

  it('has a Sign in with Google CTA button', () => {
    renderLandingPage()
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument()
  })

  it('has a dark/light mode toggle', () => {
    renderLandingPage({ mode: 'light' })
    expect(screen.getByRole('button', { name: /dark mode/i })).toBeInTheDocument()
  })

  it('calls onToggleMode when the mode toggle is clicked', async () => {
    const user = userEvent.setup()
    const onToggleMode = vi.fn()
    renderLandingPage({ onToggleMode })
    await user.click(screen.getByRole('button', { name: /dark mode/i }))
    expect(onToggleMode).toHaveBeenCalledOnce()
  })

  it('has an h1 hero headline', () => {
    renderLandingPage()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('keeps ornamental preview purely decorative for assistive tech', () => {
    renderLandingPage()
    const cluster = screen.getByTestId('landing-decoration-cluster')
    expect(cluster).toHaveAttribute('aria-hidden', 'true')
  })
})
