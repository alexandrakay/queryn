import { describe, it, expect, vi, beforeEach } from 'vitest'

let mockGenerateQuestions = vi.fn()
let mockGenerateSessionSummary = vi.fn()

vi.mock('firebase/functions', () => ({
  getFunctions: vi.fn(),
  httpsCallable: vi.fn((_, name) => {
    if (name === 'generateQuestions') return (...args) => mockGenerateQuestions(...args)
    if (name === 'generateSessionSummary') return (...args) => mockGenerateSessionSummary(...args)
  }),
}))

vi.mock('../../firebase', () => ({ app: {} }))

import { generateQuestions, generateSessionSummary } from '../anthropic'

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

describe('generateQuestions', () => {
  beforeEach(() => {
    mockGenerateQuestions = vi.fn().mockResolvedValue({ data: MOCK_QUESTIONS })
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

  it('calls the Cloud Function with the topic', async () => {
    await generateQuestions('Algorithms')
    expect(mockGenerateQuestions).toHaveBeenCalledWith({ topic: 'Algorithms' })
  })

  it('throws if the response data is not a valid array of 5', async () => {
    mockGenerateQuestions.mockResolvedValue({ data: [{ question: 'only one' }] })
    await expect(generateQuestions('Networks')).rejects.toThrow()
  })
})

describe('generateSessionSummary', () => {
  beforeEach(() => {
    mockGenerateSessionSummary = vi.fn().mockResolvedValue({
      data: 'You did well on recursion but should review sorting algorithms.',
    })
  })

  it('returns a non-empty string', async () => {
    const summary = await generateSessionSummary('Algorithms', MOCK_RESULTS)
    expect(typeof summary).toBe('string')
    expect(summary.length).toBeGreaterThan(0)
  })

  it('calls the Cloud Function with topic and results', async () => {
    await generateSessionSummary('Databases', MOCK_RESULTS)
    expect(mockGenerateSessionSummary).toHaveBeenCalledWith({
      topic: 'Databases',
      results: MOCK_RESULTS,
    })
  })
})
