import Anthropic from '@anthropic-ai/sdk'

export async function generateQuestions(topic) {
  const client = new Anthropic({ apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY, dangerouslyAllowBrowser: true })
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

  const text = response.content[0].text.trim()
  const parsed = JSON.parse(text)

  if (!Array.isArray(parsed) || parsed.length !== 5) {
    throw new Error('Invalid question format from API')
  }

  return parsed
}
