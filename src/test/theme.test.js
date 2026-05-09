import { describe, it, expect } from 'vitest'
import { createAppTheme } from '../theme'

describe('createAppTheme', () => {
  it('has a non-zero border radius for visual depth', () => {
    const theme = createAppTheme('light')
    expect(theme.shape.borderRadius).toBeGreaterThan(0)
  })

  it('enables card shadows in light mode', () => {
    const theme = createAppTheme('light')
    const cardRoot = theme.components?.MuiCard?.styleOverrides?.root
    expect(cardRoot?.boxShadow).not.toBe('none')
  })

  it('enables card shadows in dark mode', () => {
    const theme = createAppTheme('dark')
    const cardRoot = theme.components?.MuiCard?.styleOverrides?.root
    expect(cardRoot?.boxShadow).not.toBe('none')
  })

  it('disables card transition under prefers-reduced-motion', () => {
    const theme = createAppTheme('light')
    const cardRoot = theme.components?.MuiCard?.styleOverrides?.root
    const reduced = cardRoot?.['@media (prefers-reduced-motion: reduce)']
    expect(reduced?.transition).toBe('none')
  })

  it('removes card content hover lift under prefers-reduced-motion', () => {
    const theme = createAppTheme('light')
    const root = theme.components?.MuiCardActionArea?.styleOverrides?.root
    const reduced = root?.['@media (prefers-reduced-motion: reduce)']
    expect(reduced?.['&:hover .MuiCardContent-root']?.transform).toBe('none')
  })
})
