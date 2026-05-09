/**
 * E2E / Playwright: gate fake auth and stable API behavior. Never enable in production builds.
 *
 * @param {Record<string, unknown>} env typically `import.meta.env`
 */
export function readE2eFlag(env) {
  const v = env?.VITE_E2E
  return v === '1' || v === 'true'
}

export function isE2eMode() {
  return readE2eFlag(import.meta.env)
}

/** Minimal user shape for routes that read `user.uid` (Firestore, etc.). */
export const E2E_STUB_USER = Object.freeze({
  uid: 'e2e-playwright-user',
  email: 'e2e@queryn.local',
  displayName: 'E2E User',
})
