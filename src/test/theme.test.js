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
})
