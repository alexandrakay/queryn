import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from '../firebase'

function getFn(name) {
  return httpsCallable(getFunctions(app), name)
}

export async function generateQuestions(topic) {
  const fn = getFn('generateQuestions')
  const result = await fn({ topic })
  const parsed = result.data

  if (!Array.isArray(parsed) || parsed.length !== 5) {
    throw new Error('Invalid question format from API')
  }

  return parsed
}

export async function generateSessionSummary(topic, results) {
  const fn = getFn('generateSessionSummary')
  const result = await fn({ topic, results })
  return result.data
}
