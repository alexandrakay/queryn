import { getAuth } from 'firebase/auth'
import { app } from '../firebase'
import { MAX_TOPIC_LENGTH } from '../constants/topic'

const FUNCTIONS_BASE = 'https://us-central1-queryn-dfe1d.cloudfunctions.net'

function normalizeTopicOrThrow(topic) {
  if (topic == null || typeof topic !== 'string') {
    throw new Error('topic is required.')
  }
  const t = topic.trim()
  if (!t) {
    throw new Error('topic is required.')
  }
  if (t.length > MAX_TOPIC_LENGTH) {
    throw new Error('topic must be 250 characters or fewer.')
  }
  return t
}

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

  const status = res.status ?? 500
  const raw = typeof res.text === 'function' ? await res.text() : ''

  let data = {}
  try {
    data = raw ? JSON.parse(raw) : {}
  } catch {
    if (!res.ok) {
      throw new Error(`Request failed (${status}).`)
    }
    throw new Error('Invalid response from server.')
  }

  if (!res.ok) {
    const msg = typeof data.error === 'string' ? data.error : `Request failed (${status}).`
    throw new Error(msg)
  }

  return data
}

export async function generateQuestions(topic) {
  const t = normalizeTopicOrThrow(topic)
  const { questions } = await callFn('generateQuestions', { topic: t })

  if (!Array.isArray(questions) || questions.length !== 5) {
    throw new Error('Invalid question format from API')
  }

  return questions
}

export async function generateSessionSummary(topic, results) {
  if (!Array.isArray(results)) {
    throw new Error('topic and results are required.')
  }
  const t = normalizeTopicOrThrow(topic)
  const { summary } = await callFn('generateSessionSummary', { topic: t, results })
  return summary
}
