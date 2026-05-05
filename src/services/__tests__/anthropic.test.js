import { describe, it, expect, vi, beforeEach } from 'vitest'

let mockCreate = vi.fn()

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(function () {
    return { messages: { create: (...args) => mockCreate(...args) } }
  }),
}))

import { generateQuestions } from '../anthropic'

const MOCK_QUESTIONS = Array.from({ length: 5 }, (_, i) => ({
  question: `Question ${i + 1}`,
  options: ['A', 'B', 'C', 'D'],
  correctIndex: 0,
  explanation: `Explanation ${i + 1}`,
}))

describe('generateQuestions', () => {
  beforeEach(() => {
    mockCreate = vi.fn().mockResolvedValue({
      content: [{ text: JSON.stringify(MOCK_QUESTIONS) }],
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

  it('calls Claude with the topic in the prompt', async () => {
    await generateQuestions('Algorithms')
    const call = mockCreate.mock.calls[0][0]
    const prompt = call.messages[0].content
    expect(prompt).toContain('Algorithms')
  })

  it('throws if the response JSON is invalid', async () => {
    mockCreate.mockResolvedValue({ content: [{ text: 'not json' }] })
    await expect(generateQuestions('Networks')).rejects.toThrow()
  })
})
