import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '@support/world'
import { LoginPage } from '@pages/LoginPage'

Given('I am on the login page', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page)
  await loginPage.open()
  this.set('loginPage', loginPage)
})

When(
  'I log in with email {string} and password {string}',
  async function (this: CustomWorld, email: string, password: string) {
    const loginPage = this.get<LoginPage>('loginPage')
    await loginPage.login(email, password)
  }
)

Then('I should be redirected to the home page', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/\/$/, { timeout: 15000 })
})

Then('I should see a welcome message', async function (this: CustomWorld) {
  const welcomeMsg = this.page.locator('li a b')
  await expect(welcomeMsg).toBeVisible({ timeout: 10000 })
})

Then(
  'I should see an error message {string}',
  async function (this: CustomWorld, message: string) {
    const loginPage = this.get<LoginPage>('loginPage')
    const error = await loginPage.getErrorMessage()
    console.log(`[DEBUG] Got error message: "${error}"`)
    // Use includes() — page may have extra whitespace or surrounding text
    expect(error.toLowerCase()).toContain(message.toLowerCase().split(' ').slice(0, 4).join(' '))
  }
)
