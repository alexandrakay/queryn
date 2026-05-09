import { describe, it, expect } from 'vitest'
import { readE2eFlag, E2E_STUB_USER } from './e2eFlags.js'

describe('readE2eFlag', () => {
  it('is true when VITE_E2E is 1 or true', () => {
    expect(readE2eFlag({ VITE_E2E: '1' })).toBe(true)
    expect(readE2eFlag({ VITE_E2E: 'true' })).toBe(true)
  })

  it('is false when unset or other values', () => {
    expect(readE2eFlag({})).toBe(false)
    expect(readE2eFlag({ VITE_E2E: '0' })).toBe(false)
    expect(readE2eFlag({ VITE_E2E: '' })).toBe(false)
  })
})

describe('E2E_STUB_USER', () => {
  it('has stable uid for logs and Firestore paths', () => {
    expect(E2E_STUB_USER.uid).toBe('e2e-playwright-user')
    expect(E2E_STUB_USER.email).toContain('@')
  })
})
