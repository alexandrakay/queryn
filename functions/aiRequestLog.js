const crypto = require('node:crypto')
const { info: logInfo, warn: logWarn, error: logError } = require('firebase-functions/logger')

/** Default sink: `firebase-functions/logger` exports functions, not a `logger` object. */
const defaultFirebaseLogSink = {
  info: (...args) => logInfo(...args),
  warn: (...args) => logWarn(...args),
  error: (...args) => logError(...args),
}

/** Log label for substring search / saved queries in Cloud Logging. */
const LOG_MESSAGE = 'queryn_ai_request'

/**
 * Stable short fingerprint for correlating repeats of the same normalized topic — never ships raw topic text in logs.
 * @param {string} normalizedTopic
 */
function topicCorrelationFingerprint(normalizedTopic) {
  if (!normalizedTopic || typeof normalizedTopic !== 'string') return undefined
  return crypto.createHash('sha256').update(normalizedTopic, 'utf8').digest('hex').slice(0, 12)
}

function pruneUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))
}

/**
 * One structured Cloud Logging row per invocation outcome (Firebase logger JSON fields).
 *
 * Prefix fields with `queryn_` so log queries look like `jsonPayload.queryn_endpoint="generateQuestions"`.
 *
 * @param {unknown} loggerSink
 * @param {object} opts
 */
function logAiOutcome(loggerSink, opts) {
  const sink =
    loggerSink && typeof loggerSink.info === 'function' ? loggerSink : defaultFirebaseLogSink
  const payload = pruneUndefined({
    queryn_message: LOG_MESSAGE,
    queryn_endpoint: opts.endpoint,
    queryn_outcome: opts.outcome,
    queryn_httpStatus: opts.httpStatus,
    queryn_durationMs: opts.durationMs,
    queryn_uid: opts.uid ?? null,
    queryn_topicLength: opts.topicLength ?? null,
    queryn_topicCorrelation: opts.topicFingerprintSource
      ? topicCorrelationFingerprint(opts.topicFingerprintSource)
      : null,
    queryn_resultsCount: opts.resultsCount ?? null,
    queryn_errorClass: opts.errorClass ?? null,
  })

  let method = 'info'
  if (opts.httpStatus >= 500) method = 'error'
  else if (opts.httpStatus >= 400) method = 'warn'

  const fn = typeof sink[method] === 'function' ? sink[method] : sink.info
  fn.call(sink, LOG_MESSAGE, payload)
}

/**
 * @param {'generateQuestions' | 'generateSessionSummary'} endpoint
 * @param {unknown} [loggerSink]
 */
function createAiTracer(endpoint, loggerSink) {
  const sink =
    loggerSink && typeof loggerSink.info === 'function' ? loggerSink : defaultFirebaseLogSink
  const t0 = Date.now()
  /** @type {string | undefined} */
  let uid
  /** @type {number | undefined} */
  let topicLength
  /** @type {string | undefined} */
  let topicFingerprintSource
  /** @type {number | undefined} */
  let resultsCount

  return {
    bindAuth(auth) {
      uid = typeof auth?.uid === 'string' ? auth.uid : undefined
    },
    /** Result count after request body validates `Array.isArray`. */
    bindResults(results) {
      resultsCount = Array.isArray(results) ? results.length : undefined
    },
    noteRawTopicLength(topic) {
      topicLength = typeof topic === 'string' ? topic.length : 0
    },
    /** After server-side topic validation passes (normalized string). */
    noteValidatedTopic(normalizedTopic) {
      topicFingerprintSource = normalizedTopic
      topicLength = typeof normalizedTopic === 'string' ? normalizedTopic.length : undefined
    },
    finish(patch) {
      logAiOutcome(sink, {
        endpoint,
        uid,
        topicLength,
        topicFingerprintSource,
        resultsCount,
        durationMs: Date.now() - t0,
        ...patch,
      })
    },
  }
}

module.exports = {
  LOG_MESSAGE,
  createAiTracer,
  logAiOutcome,
  topicCorrelationFingerprint,
}
