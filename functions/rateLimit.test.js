import { describe, it, expect, vi } from 'vitest'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { applyRateIncrement, checkRateLimit, LIMITS, RATE_LIMIT_MESSAGE } = require('./rateLimit.js')

describe('applyRateIncrement', () => {
  const base = {
    windowMs: 60_000,
    limit: 3,
    prevWindowStartMs: undefined,
    prevCount: undefined,
  }

  it('allows first request in a fresh window', () => {
    const nowMs = 1_700_000_000_000
    expect(applyRateIncrement({ ...base, nowMs })).toEqual({
      allowed: true,
      windowStartMs: nowMs,
      count: 1,
    })
  })

  it('carries count forward inside the window', () => {
    const start = 1_700_000_000_000
    const nowMs = start + 30_000
    expect(
      applyRateIncrement({
        ...base,
        nowMs,
        prevWindowStartMs: start,
        prevCount: 2,
      })
    ).toEqual({ allowed: true, windowStartMs: start, count: 3 })
  })

  it('rejects when increment would exceed the limit inside the window', () => {
    const start = 1_700_000_000_000
    const nowMs = start + 10_000
    expect(
      applyRateIncrement({
        ...base,
        nowMs,
        prevWindowStartMs: start,
        prevCount: 3,
      })
    ).toEqual({ allowed: false })
  })

  it('starts a new window after windowMs elapsed', () => {
    const start = 1_700_000_000_000
    const nowMs = start + 60_001
    expect(
      applyRateIncrement({
        ...base,
        nowMs,
        prevWindowStartMs: start,
        prevCount: 99,
      })
    ).toEqual({ allowed: true, windowStartMs: nowMs, count: 1 })
  })
})

describe('checkRateLimit (Firestore)', () => {
  /** @returns {typeof import('firebase-admin')} minimal admin stub */
  function stubAdmin(runTransactionImpl) {
    const docRef = { id: 'rate-doc' }
    const db = {
      collection() {
        return {
          doc: () => docRef,
        }
      },
      runTransaction: runTransactionImpl,
    }
    /** @returns {unknown} Firestore-ish service */
    const firestoreSvc = Object.assign(() => db, {
      Timestamp: {
        fromMillis: vi.fn(ms => ({
          __kind: 'ts',
          toMillis: () => ms,
        })),
      },
      FieldValue: {
        serverTimestamp: vi.fn(() => ({ __kind: 'sv' })),
      },
    })
    /** @returns {unknown} firebase-admin-ish */
    const admin = { firestore: firestoreSvc }
    return /** @type {typeof import('firebase-admin')} */ (admin)
  }

  it('returns ok:false and does not write when the window is already exhausted', async () => {
    const txSet = vi.fn()
    const admin = stubAdmin(async fn =>
      fn({
        get: vi.fn(async () => ({
          exists: true,
          data: () => ({
            windowStart: { toMillis: () => Date.now() },
            count: LIMITS.generateQuestions,
          }),
        })),
        set: txSet,
      })
    )

    const out = await checkRateLimit(admin, 'uid-xyz', 'generateQuestions')

    expect(out).toEqual({ ok: false, error: RATE_LIMIT_MESSAGE })
    expect(txSet).not.toHaveBeenCalled()
  })

  it('persists incremented count when under the limit', async () => {
    const txSet = vi.fn()
    const admin = stubAdmin(async fn =>
      fn({
        get: vi.fn(async () => ({ exists: false })),
        set: txSet,
      })
    )

    const out = await checkRateLimit(admin, 'uid-xyz', 'generateSessionSummary')
    expect(out).toEqual({ ok: true })
    expect(txSet).toHaveBeenCalledTimes(1)
    const payload = txSet.mock.calls[0][1]
    expect(payload.count).toBe(1)
    expect(payload.endpointKey).toBe('generateSessionSummary')
  })

  it('returns ok:false for unknown endpoints', async () => {
    const out = await checkRateLimit({}, 'uid-xyz', 'unknownEndpoint')
    expect(out).toEqual({ ok: false, error: 'Rate limit misconfiguration.' })
  })
})
