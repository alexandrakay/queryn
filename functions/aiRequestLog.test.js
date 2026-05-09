import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const {
  createAiTracer,
  logAiOutcome,
  topicCorrelationFingerprint,
  LOG_MESSAGE,
} = require('./aiRequestLog.js')

describe('topicCorrelationFingerprint', () => {
  it('returns a 12-char hex digest for normalized topics', () => {
    const a = topicCorrelationFingerprint('Algorithms')
    const b = topicCorrelationFingerprint('Algorithms')
    const c = topicCorrelationFingerprint('Data Structures')
    expect(a).toHaveLength(12)
    expect(a).toBe(b)
    expect(a).not.toBe(c)
  })

  it('returns undefined for empty or invalid input', () => {
    expect(topicCorrelationFingerprint('')).toBeUndefined()
    expect(topicCorrelationFingerprint(/** @type {unknown} */ (null))).toBeUndefined()
  })
})

describe('logAiOutcome', () => {
  /** @returns {unknown} fake Cloud logger */
  function fakeLogger() {
    return {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }
  }

  /** @returns {unknown} typed payload passed to firebase logger second arg */
  function secondArg(logger, spy) {
    const call = spy.mock.calls[0]
    expect(call[0]).toBe(LOG_MESSAGE)
    return call[1]
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uses info for HTTP 200', () => {
    const log = fakeLogger()
    logAiOutcome(log, {
      endpoint: 'generateQuestions',
      outcome: 'success',
      httpStatus: 200,
      durationMs: 42,
      uid: 'u1',
      topicLength: 10,
      topicFingerprintSource: 'Algorithms',
      resultsCount: undefined,
      errorClass: undefined,
    })
    expect(log.info).toHaveBeenCalledTimes(1)
    expect(log.warn).not.toHaveBeenCalled()
    expect(log.error).not.toHaveBeenCalled()
    const payload = secondArg(log, log.info)
    expect(payload.queryn_endpoint).toBe('generateQuestions')
    expect(payload.queryn_topicCorrelation).toBe(topicCorrelationFingerprint('Algorithms'))
  })

  it('uses warn for 4xx outcomes', () => {
    const log = fakeLogger()
    logAiOutcome(log, {
      endpoint: 'generateQuestions',
      outcome: 'rate_limited',
      httpStatus: 429,
      durationMs: 2,
      uid: 'u1',
      topicLength: 5,
      topicFingerprintSource: 'hello',
      errorClass: 'rate_limit',
    })
    expect(log.warn).toHaveBeenCalledTimes(1)
    const payload = secondArg(log, log.warn)
    expect(payload.queryn_httpStatus).toBe(429)
  })

  it('uses error for 5xx outcomes', () => {
    const log = fakeLogger()
    logAiOutcome(log, {
      endpoint: 'generateSessionSummary',
      outcome: 'upstream_error',
      httpStatus: 500,
      durationMs: 9,
      uid: 'u1',
      topicLength: 3,
      topicFingerprintSource: 'abc',
      errorClass: 'exception',
    })
    expect(log.error).toHaveBeenCalledTimes(1)
    const payload = secondArg(log, log.error)
    expect(payload.queryn_httpStatus).toBe(500)
  })

  it('does not include raw normalized topic bytes in emitted JSON — only fingerprint', () => {
    const topic = 'My Secret Topic Subject'
    const log = fakeLogger()
    logAiOutcome(log, {
      endpoint: 'generateQuestions',
      outcome: 'success',
      httpStatus: 200,
      durationMs: 1,
      uid: 'user-x',
      topicLength: topic.length,
      topicFingerprintSource: topic,
    })
    const payload = JSON.stringify(secondArg(log, log.info))
    expect(payload).not.toContain('Secret')
    expect(payload).not.toContain(topic)
    expect(payload).toContain(topicCorrelationFingerprint(topic))
  })
})

describe('createAiTracer', () => {
  it('binds timing, uid, validated topic fingerprint source, and results count', () => {
    const log = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }
    const t = createAiTracer('generateSessionSummary', log)
    t.bindAuth({ uid: 'abc' })
    t.bindResults([{ x: 1 }, { x: 2 }])
    t.noteValidatedTopic('Algorithms')
    t.finish({ outcome: 'success', httpStatus: 200 })
    expect(log.info).toHaveBeenCalledTimes(1)
    const [, payload] = log.info.mock.calls[0]
    expect(payload.queryn_uid).toBe('abc')
    expect(payload.queryn_resultsCount).toBe(2)
    expect(payload.queryn_topicLength).toBe('Algorithms'.length)
    expect(payload.queryn_topicCorrelation).toBe(topicCorrelationFingerprint('Algorithms'))
    expect(payload.queryn_durationMs).toBeGreaterThanOrEqual(0)
  })
})
