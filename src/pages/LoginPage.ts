import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  readonly emailInput = this.page.locator('[data-qa="login-email"]')
  readonly passwordInput = this.page.locator('[data-qa="login-password"]')
  readonly loginButton = this.page.locator('[data-qa="login-button"]')

  // automationexercise.com shows error as a <p> inside the login form section
  // Use a broad selector and filter by content in the step
  readonly loginSection = this.page.locator('.login-form')

  readonly signupNameInput = this.page.locator('[data-qa="signup-name"]')
  readonly signupEmailInput = this.page.locator('[data-qa="signup-email"]')
  readonly signupButton = this.page.locator('[data-qa="signup-button"]')

  constructor(page: Page) {
    super(page)
  }

  async open(): Promise<void> {
    await this.goto('/login')
    await this.waitForLoad()
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillInput(this.emailInput, email)
    await this.fillInput(this.passwordInput, password)
    await this.loginButton.click()
    await this.page.waitForLoadState('domcontentloaded')
  }

  /**
   * Get any visible error/info text inside the login form.
   * automationexercise.com renders: <p style="color: red;">Your email or password is incorrect!</p>
   * We wait for ANY <p> that appears after submit and read its text.
   */
  async getErrorMessage(): Promise<string> {
    // Wait for a paragraph to appear in the login section after form submit
    const errorP = this.page.locator('.login-form').locator('p')
    await errorP.waitFor({ state: 'visible', timeout: 15000 })
    return (await errorP.textContent()) ?? ''
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.fillInput(this.signupNameInput, name)
    await this.fillInput(this.signupEmailInput, email)
    await this.signupButton.click()
    await this.waitForLoad()
  }
}
