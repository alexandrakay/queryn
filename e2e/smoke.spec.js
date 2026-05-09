// @ts-check
import { test, expect } from '@playwright/test'

const MOCK_QUESTIONS = Array.from({ length: 5 }, (_, i) => ({
  question: `E2E smoke question ${i + 1}`,
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correctIndex: 1,
  explanation: `E2E explanation ${i + 1}`,
}))

test.beforeEach(async ({ page }) => {
  await page.route('**/generateQuestions', async route => {
    if (route.request().method() !== 'POST') {
      await route.continue()
      return
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ questions: MOCK_QUESTIONS }),
    })
  })
  await page.route('**/generateSessionSummary', async route => {
    if (route.request().method() !== 'POST') {
      await route.continue()
      return
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ summary: 'E2E smoke summary.' }),
    })
  })
})

test('signed-in smoke: topic grid → quiz shows mocked question', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Pick a topic')).toBeVisible()
  await page.getByText('Networks', { exact: true }).click()
  await expect(page).toHaveURL(/\/quiz\/Networks/)
  await expect(page.getByTestId('question-text')).toContainText('E2E smoke question 1', { timeout: 15_000 })
})
