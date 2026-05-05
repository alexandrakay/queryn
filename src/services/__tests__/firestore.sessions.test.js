import { describe, it, expect, vi, beforeEach } from 'vitest'

let mockGetDocs = vi.fn()
let mockQuery = vi.fn()
let mockCollection = vi.fn()
let mockOrderBy = vi.fn()

vi.mock('firebase/firestore', () => ({
  getDocs: (...args) => mockGetDocs(...args),
  query: (...args) => mockQuery(...args),
  collection: (...args) => mockCollection(...args),
  orderBy: (...args) => mockOrderBy(...args),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}))

vi.mock('../../firebase', () => ({
  db: { _isMockDb: true },
}))

import { getSessions } from '../firestore'

const MOCK_SESSIONS = [
  { id: 'sess-1', topic: 'Algorithms', score: 4, totalQuestions: 5, createdAt: { toDate: () => new Date('2026-05-01') } },
  { id: 'sess-2', topic: 'Databases', score: 2, totalQuestions: 5, createdAt: { toDate: () => new Date('2026-04-30') } },
]

describe('getSessions', () => {
  beforeEach(() => {
    mockCollection = vi.fn().mockReturnValue('mock-col-ref')
    mockOrderBy = vi.fn().mockReturnValue('mock-order')
    mockQuery = vi.fn().mockReturnValue('mock-query')
    mockGetDocs = vi.fn().mockResolvedValue({
      docs: MOCK_SESSIONS.map(s => ({
        id: s.id,
        data: () => ({ topic: s.topic, score: s.score, totalQuestions: s.totalQuestions, createdAt: s.createdAt }),
      })),
    })
  })

  it('queries the correct collection path', async () => {
    await getSessions('uid-abc')
    expect(mockCollection).toHaveBeenCalledWith(expect.anything(), 'users/uid-abc/sessions')
  })

  it('orders results by createdAt descending', async () => {
    await getSessions('uid-abc')
    expect(mockOrderBy).toHaveBeenCalledWith('createdAt', 'desc')
  })

  it('returns an array of sessions with id and data', async () => {
    const sessions = await getSessions('uid-abc')
    expect(sessions).toHaveLength(2)
    expect(sessions[0]).toMatchObject({ id: 'sess-1', topic: 'Algorithms', score: 4 })
    expect(sessions[1]).toMatchObject({ id: 'sess-2', topic: 'Databases', score: 2 })
  })

  it('returns an empty array when no sessions exist', async () => {
    mockGetDocs.mockResolvedValue({ docs: [] })
    const sessions = await getSessions('uid-abc')
    expect(sessions).toEqual([])
  })
})
