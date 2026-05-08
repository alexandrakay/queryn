const { onRequest } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const admin = require('firebase-admin')

admin.initializeApp()

const anthropicKey = defineSecret('ANTHROPIC_API_KEY')

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'https://queryn-dfe1d.web.app',
  'https://queryn-dfe1d.firebaseapp.com',
]

function setCors(req, res) {
  const origin = req.headers.origin
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin)
  }
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

async function verifyToken(req) {
  const header = req.headers.authorization ?? ''
  if (!header.startsWith('Bearer ')) return null
  try {
    return await admin.auth().verifyIdToken(header.slice(7))
  } catch {
    return null
  }
}

function makeAnthropicClient(apiKey) {
  const mod = require('@anthropic-ai/sdk')
  const AnthropicClass = mod.default ?? mod
  return new AnthropicClass({ apiKey })
}

const { parseTopic } = require('./topicValidation')

exports.generateQuestions = onRequest({ secrets: [anthropicKey] }, async (req, res) => {
  setCors(req, res)

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  const auth = await verifyToken(req)
  if (!auth) {
    res.status(401).json({ error: 'Must be signed in.' })
    return
  }

  const { topic } = req.body ?? {}
  const topicResult = parseTopic(topic)
  if (!topicResult.ok) {
    res.status(400).json({ error: topicResult.error })
    return
  }
  const normalizedTopic = topicResult.topic

  try {
    const client = makeAnthropicClient(anthropicKey.value())
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Generate exactly 5 multiple choice questions about "${normalizedTopic}" for a CS student.

Return ONLY a valid JSON array with no extra text. Each object must have:
- "question": string
- "options": array of exactly 4 strings
- "correctIndex": number (0-3)
- "explanation": string (1-2 sentences explaining the correct answer)

Example format:
[{"question":"...","options":["a","b","c","d"],"correctIndex":0,"explanation":"..."}]`,
        },
      ],
    })

    const raw = response.content[0].text.trim()
    const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
    const parsed = JSON.parse(text)

    if (!Array.isArray(parsed) || parsed.length !== 5) {
      res.status(500).json({ error: 'Invalid question format from API.' })
      return
    }

    res.json({ questions: parsed })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

exports.generateSessionSummary = onRequest({ secrets: [anthropicKey] }, async (req, res) => {
  setCors(req, res)

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  const auth = await verifyToken(req)
  if (!auth) {
    res.status(401).json({ error: 'Must be signed in.' })
    return
  }

  const { topic, results } = req.body ?? {}
  if (!Array.isArray(results)) {
    res.status(400).json({ error: 'topic and results are required.' })
    return
  }

  const topicResult = parseTopic(topic)
  if (!topicResult.ok) {
    res.status(400).json({ error: topicResult.error })
    return
  }
  const normalizedTopic = topicResult.topic

  try {
    const client = makeAnthropicClient(anthropicKey.value())
    const resultLines = results
      .map(r => `Q: ${r.question} | Correct: ${r.correctIndex} | Selected: ${r.selectedIndex}`)
      .join('\n')

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: `A CS student just completed a quiz on "${normalizedTopic}". Here are their results:\n\n${resultLines}\n\nWrite a 2-3 sentence personalized summary of their performance. Note what they did well and what to review. Return plain text only, no JSON.`,
        },
      ],
    })

    res.json({ summary: response.content[0].text.trim() })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})
