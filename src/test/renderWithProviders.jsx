import { render } from '@testing-library/react'
import { ThemeProvider } from '@mui/material'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { createAppTheme } from '../theme'

const theme = createAppTheme('light')

export function renderWithProviders(ui, { initialEntries = ['/'], routePath = '/' } = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path={routePath} element={ui} />
          <Route path="/" element={<div data-testid="topic-selector" />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  )
}
