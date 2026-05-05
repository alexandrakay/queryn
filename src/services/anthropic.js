import { getAuth } from 'firebase/auth'
import { app } from '../firebase'

const FUNCTIONS_BASE = 'https://us-central1-queryn-dfe1d.cloudfunctions.net'

async function callFn(name, body) {
  const user = getAuth(app).currentUser
  const token = user ? await user.getIdToken() : null

  const res = await fetch(`${FUNCTIONS_BASE}/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(body),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Function call failed')
  return json
}

export async function generateQuestions(topic) {
  const { questions } = await callFn('generateQuestions', { topic })

  if (!Array.isArray(questions) || questions.length !== 5) {
    throw new Error('Invalid question format from API')
  }

  return questions
}

export async function generateSessionSummary(topic, results) {
  const { summary } = await callFn('generateSessionSummary', { topic, results })
  return summary
}
