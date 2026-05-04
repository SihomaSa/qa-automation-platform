import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  readonly loginHeader = this.page.getByRole('heading', { name: 'Login to your account' })
  readonly emailInput = this.page.locator('[data-qa="login-email"]')
  readonly passwordInput = this.page.locator('[data-qa="login-password"]')
  readonly loginButton = this.page.locator('[data-qa="login-button"]')
  readonly errorMessage = this.page.locator('p[style*="color: red"]')

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
    await this.waitForLoad()
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? ''
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.fillInput(this.signupNameInput, name)
    await this.fillInput(this.signupEmailInput, email)
    await this.signupButton.click()
    await this.waitForLoad()
  }
}
