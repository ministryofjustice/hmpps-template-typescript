import { expect, test } from '@playwright/test'
import exampleApi from '../mockApis/exampleApi'

import { resetStubs } from '../mockApis/wiremock'
import { login } from '../testUtils'
import ExamplePage from '../pages/examplePage'

test.describe('Example', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Time from exampleApi is visible on page', async ({ page }) => {
    await exampleApi.stubExampleTime()
    await login(page)

    const examplePage = await ExamplePage.verifyOnPage(page)

    await expect(examplePage.timestamp).toHaveText('The time is currently 2025-01-01T12:00:00Z')
  })

  test('ExampleApi failure shows error page', async ({ page }) => {
    await exampleApi.stubExampleTime(500)

    const response = await login(page)

    expect(response?.status()).toBe(500)
    await expect(page).toHaveTitle('HMPPS Typescript Template - Error')
    await expect(page.locator('main h1')).not.toBeEmpty()
  })
})
