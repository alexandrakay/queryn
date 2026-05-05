import { describe, it, expect, vi, beforeEach } from 'vitest'

let mockAddDoc = vi.fn()
let mockServerTimestamp = vi.fn(() => ({ _type: 'serverTimestamp' }))
let mockCollection = vi.fn()

vi.mock('firebase/firestore', () => ({
  addDoc: (...args) => mockAddDoc(...args),
  collection: (...args) => mockCollection(...args),
  serverTimestamp: () => mockServerTimestamp(),
}))

vi.mock('../../firebase', () => ({
  db: { _isMockDb: true },
}))

import { saveSession } from '../firestore'

const SESSION_DATA = {
  topic: 'Algorithms',
  score: 3,
  totalQuestions: 5,
  aiFeedback: 'Great job on sorting. Review graph traversal.',
  questions: [
    { question: 'Q1', options: ['A', 'B', 'C', 'D'], correctIndex: 0, selectedIndex: 0, explanation: 'E1' },
  ],
}

describe('saveSession', () => {
  beforeEach(() => {
    mockAddDoc = vi.fn().mockResolvedValue({ id: 'session-123' })
    mockCollection = vi.fn().mockReturnValue('mock-collection-ref')
    mockServerTimestamp = vi.fn(() => ({ _type: 'serverTimestamp' }))
  })

  it('calls addDoc with the correct collection path', async () => {
    await saveSession('uid-abc', SESSION_DATA)
    expect(mockCollection).toHaveBeenCalledWith(
      expect.anything(),
      'users/uid-abc/sessions'
    )
    expect(mockAddDoc).toHaveBeenCalledWith('mock-collection-ref', expect.any(Object))
  })

  it('includes all required schema fields in the document', async () => {
    await saveSession('uid-abc', SESSION_DATA)
    const doc = mockAddDoc.mock.calls[0][1]
    expect(doc).toHaveProperty('topic', 'Algorithms')
    expect(doc).toHaveProperty('score', 3)
    expect(doc).toHaveProperty('totalQuestions', 5)
    expect(doc).toHaveProperty('aiFeedback')
    expect(doc).toHaveProperty('questions')
    expect(doc).toHaveProperty('createdAt')
  })

  it('sets createdAt to a server timestamp', async () => {
    await saveSession('uid-abc', SESSION_DATA)
    const doc = mockAddDoc.mock.calls[0][1]
    expect(mockServerTimestamp).toHaveBeenCalled()
    expect(doc.createdAt).toEqual({ _type: 'serverTimestamp' })
  })

  it('returns the new document id', async () => {
    const id = await saveSession('uid-abc', SESSION_DATA)
    expect(id).toBe('session-123')
  })
})
