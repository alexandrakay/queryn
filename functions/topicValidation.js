const MAX_TOPIC_CHARS = 250

/**
 * @param {unknown} topic
 * @returns {{ ok: true, topic: string } | { ok: false, error: string }}
 */
function parseTopic(topic) {
  if (topic == null || typeof topic !== 'string') {
    return { ok: false, error: 'topic is required.' }
  }
  const t = topic.trim()
  if (!t) {
    return { ok: false, error: 'topic is required.' }
  }
  if (t.length > MAX_TOPIC_CHARS) {
    return { ok: false, error: 'topic must be 250 characters or fewer.' }
  }
  return { ok: true, topic: t }
}

module.exports = { MAX_TOPIC_CHARS, parseTopic }
