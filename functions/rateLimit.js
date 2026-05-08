/**
 * Fixed-window counters in Firestore (per UID + endpoint) to throttle AI calls before Anthropic.
 *
 * Limits (each window is WINDOW_MS below):
 * - generateQuestions: 30 attempts / 10 min — ~6 full quizzes with retries without blocking normal study.
 * - generateSessionSummary: 45 attempts / 10 min — summaries per completed quiz plus headroom.
 */
const WINDOW_MS = 10 * 60 * 1000

const LIMITS = {
  generateQuestions: 30,
  generateSessionSummary: 45,
}

/**
 * Pure rate window step — used by tests and by Firestore layer.
 *
 * @param {{ nowMs: number, windowMs: number, limit: number, prevWindowStartMs: number | null | undefined, prevCount: number | undefined }} params
 */
function applyRateIncrement({ nowMs, windowMs, limit, prevWindowStartMs, prevCount }) {
  let windowStartMs = nowMs
  let count = 0
  if (
    typeof prevWindowStartMs === 'number' &&
    typeof prevCount === 'number' &&
    nowMs - prevWindowStartMs < windowMs
  ) {
    windowStartMs = prevWindowStartMs
    count = prevCount
  }
  const nextCount = count + 1
  if (nextCount > limit) {
    return { allowed: false }
  }
  return { allowed: true, windowStartMs, count: nextCount }
}

const RATE_LIMIT_MESSAGE = 'Too many requests. Please wait a few minutes and try again.'

/**
 * @param {typeof import('firebase-admin')} admin
 * @param {string} uid
 * @param {'generateQuestions' | 'generateSessionSummary'} endpointKey
 * @returns {Promise<{ ok: true } | { ok: false, error: string }>}
 */
async function checkRateLimit(admin, uid, endpointKey) {
  const limit = LIMITS[endpointKey]
  if (limit == null) {
    return { ok: false, error: 'Rate limit misconfiguration.' }
  }

  const db = admin.firestore()
  const ref = db.collection('_rateLimits').doc(`${uid}_${endpointKey}`)
  /** @type {{ ok: true } | { ok: false, error: string }} */
  let result = { ok: true }

  await db.runTransaction(async tx => {
    const snap = await tx.get(ref)
    const nowMs = Date.now()
    let prevWindowStartMs = null
    let prevCount = 0

    if (snap.exists) {
      const data = snap.data() ?? {}
      const ws = data.windowStart
      prevWindowStartMs = typeof ws?.toMillis === 'function' ? ws.toMillis() : null
      if (prevWindowStartMs == null && typeof data.windowStartMs === 'number') {
        prevWindowStartMs = data.windowStartMs
      }
      prevCount = typeof data.count === 'number' ? data.count : 0
    }

    const outcome = applyRateIncrement({
      nowMs,
      windowMs: WINDOW_MS,
      limit,
      prevWindowStartMs: prevWindowStartMs ?? undefined,
      prevCount,
    })

    if (!outcome.allowed) {
      result = { ok: false, error: RATE_LIMIT_MESSAGE }
      return
    }

    tx.set(ref, {
      windowStart: admin.firestore.Timestamp.fromMillis(outcome.windowStartMs),
      count: outcome.count,
      endpointKey,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    result = { ok: true }
  })

  return result
}

module.exports = {
  applyRateIncrement,
  checkRateLimit,
  LIMITS,
  WINDOW_MS,
  RATE_LIMIT_MESSAGE,
}
