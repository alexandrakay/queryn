import { describe, it, expect } from 'vitest'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { parseTopic, MAX_TOPIC_CHARS } = require('./topicValidation.js')

describe('parseTopic (Cloud Functions)', () => {
  it('accepts a topic at exactly the max length', () => {
    const t = 'a'.repeat(MAX_TOPIC_CHARS)
    expect(parseTopic(t)).toEqual({ ok: true, topic: t })
  })

  it('rejects a topic longer than the max', () => {
    const t = 'a'.repeat(MAX_TOPIC_CHARS + 1)
    expect(parseTopic(t)).toEqual({
      ok: false,
      error: 'topic must be 250 characters or fewer.',
    })
  })

  it('trims whitespace and accepts valid topic', () => {
    expect(parseTopic('  Algorithms  ')).toEqual({ ok: true, topic: 'Algorithms' })
  })

  it('rejects whitespace-only topic', () => {
    expect(parseTopic('   \t  ')).toEqual({ ok: false, error: 'topic is required.' })
  })

  it('rejects non-string topic', () => {
    expect(parseTopic(null)).toEqual({ ok: false, error: 'topic is required.' })
    expect(parseTopic(123)).toEqual({ ok: false, error: 'topic is required.' })
  })
})
