import { expect, test } from '@playwright/test'
import hmppsAuth from '../mockApis/hmppsAuth'
import exampleApi from '../mockApis/exampleApi'
import { resetStubs } from '../mockApis/wiremock'

test.describe('Anonymous access', () => {
  test.beforeEach(async () => {
    await Promise.all([exampleApi.stubExampleTime(), hmppsAuth.token({})])
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('should render the Forge journey when the user has not signed in', async ({ page }) => {
    // Arrange
    const homeUrl = '/'

    // Act
    const response = await page.goto(homeUrl)

    // Assert
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { name: 'This site is under construction...' })).toBeVisible()
    await expect(page.getByTestId('header-user-name')).toHaveCount(0)
    await expect(page.getByTestId('header-phase-banner')).toHaveText('dev')
  })

  test('should return not found when an HMPPS sign-in route is requested', async ({ page }) => {
    // Arrange
    const signInUrl = '/sign-in'

    // Act
    const response = await page.goto(signInUrl)

    // Assert
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: 'Sign in', exact: true })).toHaveCount(0)
  })
})
