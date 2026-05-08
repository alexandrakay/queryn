import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ currentUser: { getIdToken: vi.fn().mockResolvedValue('mock-token') } })),
}))

vi.mock('../../firebase', () => ({ app: {} }))

const MOCK_QUESTIONS = Array.from({ length: 5 }, (_, i) => ({
  question: `Question ${i + 1}`,
  options: ['A', 'B', 'C', 'D'],
  correctIndex: 0,
  explanation: `Explanation ${i + 1}`,
}))

const MOCK_RESULTS = MOCK_QUESTIONS.map((q, i) => ({
  question: q.question,
  correctIndex: q.correctIndex,
  selectedIndex: i % 2 === 0 ? 0 : 1,
}))

import { generateQuestions, generateSessionSummary } from '../anthropic'

describe('generateQuestions', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ questions: MOCK_QUESTIONS })),
    })
  })

  it('returns an array of 5 questions', async () => {
    const questions = await generateQuestions('Data Structures')
    expect(questions).toHaveLength(5)
  })

  it('each question has the required fields', async () => {
    const questions = await generateQuestions('Data Structures')
    for (const q of questions) {
      expect(q).toHaveProperty('question')
      expect(q).toHaveProperty('options')
      expect(q.options).toHaveLength(4)
      expect(q).toHaveProperty('correctIndex')
      expect(q).toHaveProperty('explanation')
    }
  })

  it('calls the function with the topic', async () => {
    await generateQuestions('Algorithms')
    const body = JSON.parse(global.fetch.mock.calls[0][1].body)
    expect(body.topic).toBe('Algorithms')
  })

  it('sends trimmed topic in the request body', async () => {
    await generateQuestions('  Algorithms  ')
    const body = JSON.parse(global.fetch.mock.calls[0][1].body)
    expect(body.topic).toBe('Algorithms')
  })

  it('does not call the API when topic exceeds max length', async () => {
    const long = 'x'.repeat(251)
    await expect(generateQuestions(long)).rejects.toThrow('topic must be 250 characters or fewer.')
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('throws if the response data is not a valid array of 5', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ questions: [{ question: 'only one' }] })),
    })
    await expect(generateQuestions('Networks')).rejects.toThrow()
  })

  it('throws on non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve(JSON.stringify({ error: 'Must be signed in.' })),
    })
    await expect(generateQuestions('Networks')).rejects.toThrow('Must be signed in.')
  })

  it('throws a sensible message when error response is not JSON', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      text: () => Promise.resolve('<html>bad gateway</html>'),
    })
    await expect(generateQuestions('Networks')).rejects.toThrow('Request failed (502).')
  })

  it('throws when OK response body is not JSON', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve('not-json'),
    })
    await expect(generateQuestions('Networks')).rejects.toThrow('Invalid response from server.')
  })
})

describe('generateSessionSummary', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () =>
        Promise.resolve(
          JSON.stringify({ summary: 'You did well on recursion but should review sorting algorithms.' })
        ),
    })
  })

  it('returns a non-empty string', async () => {
    const summary = await generateSessionSummary('Algorithms', MOCK_RESULTS)
    expect(typeof summary).toBe('string')
    expect(summary.length).toBeGreaterThan(0)
  })

  it('calls the function with topic and results', async () => {
    await generateSessionSummary('Databases', MOCK_RESULTS)
    const body = JSON.parse(global.fetch.mock.calls[0][1].body)
    expect(body.topic).toBe('Databases')
    expect(body.results).toEqual(MOCK_RESULTS)
  })

  it('does not call the API when topic exceeds max length', async () => {
    const long = 'x'.repeat(251)
    await expect(generateSessionSummary(long, MOCK_RESULTS)).rejects.toThrow('topic must be 250 characters or fewer.')
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('throws when results is not an array', async () => {
    await expect(generateSessionSummary('Algorithms', null)).rejects.toThrow('topic and results are required.')
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('throws server error message on non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve(JSON.stringify({ error: 'topic is required.' })),
    })
    await expect(generateSessionSummary('Algorithms', MOCK_RESULTS)).rejects.toThrow('topic is required.')
  })
})
