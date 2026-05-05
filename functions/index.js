const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const Anthropic = require('@anthropic-ai/sdk')

const anthropicKey = defineSecret('ANTHROPIC_API_KEY')

exports.generateQuestions = onCall({ secrets: [anthropicKey] }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be signed in.')
  }

  const { topic } = request.data
  if (!topic || typeof topic !== 'string') {
    throw new HttpsError('invalid-argument', 'topic is required.')
  }

  const client = new Anthropic.default({ apiKey: anthropicKey.value() })
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Generate exactly 5 multiple choice questions about "${topic}" for a CS student.

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
    throw new HttpsError('internal', 'Invalid question format from API.')
  }

  return parsed
})

exports.generateSessionSummary = onCall({ secrets: [anthropicKey] }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be signed in.')
  }

  const { topic, results } = request.data
  if (!topic || !Array.isArray(results)) {
    throw new HttpsError('invalid-argument', 'topic and results are required.')
  }

  const client = new Anthropic.default({ apiKey: anthropicKey.value() })
  const resultLines = results
    .map(r => `Q: ${r.question} | Correct: ${r.correctIndex} | Selected: ${r.selectedIndex}`)
    .join('\n')

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `A CS student just completed a quiz on "${topic}". Here are their results:\n\n${resultLines}\n\nWrite a 2-3 sentence personalized summary of their performance. Note what they did well and what to review. Return plain text only, no JSON.`,
      },
    ],
  })

  return response.content[0].text.trim()
})
