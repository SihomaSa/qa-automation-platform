import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  readonly emailInput = this.page.locator('[data-qa="login-email"]')
  readonly passwordInput = this.page.locator('[data-qa="login-password"]')
  readonly loginButton = this.page.locator('[data-qa="login-button"]')

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
    await this.emailInput.waitFor({ state: 'visible', timeout: 15000 })
    await this.fillInput(this.emailInput, email)
    await this.fillInput(this.passwordInput, password)
    await this.loginButton.click()
    await this.page.waitForLoadState('domcontentloaded')
    await this.page.waitForTimeout(1500)
  }

  /**
   * Read error message after failed login.
   * automationexercise.com shows: <p style="color: red;">Your email or password is incorrect!</p>
   * We use a broad selector and read ALL paragraph text in the login section.
   */
  async getErrorMessage(): Promise<string> {
    // Try multiple possible selectors the site may use
    const candidates = [
      'p[style*="color: red"]',
      'p[style*="color:red"]',
      '.login-form p',
      'form[action="/login"] p',
      '#form-login p',
    ]

    for (const selector of candidates) {
      try {
        const el = this.page.locator(selector)
        const visible = await el.isVisible({ timeout: 3000 })
        if (visible) {
          return (await el.first().textContent()) ?? ''
        }
      } catch { /* try next */ }
    }

    // Last resort: dump all visible paragraph text for debugging
    const allP = await this.page.$$eval('p', (els) =>
      els
        .filter((el) => (el as HTMLElement).offsetParent !== null) // only visible
        .map((el) => el.textContent?.trim())
        .filter(Boolean)
    )
    console.log('[DEBUG] All visible <p> on login page after submit:', allP)

    // Return first non-empty paragraph that sounds like an error
    return allP.find((t) => t && t.toLowerCase().includes('incorrect')) ?? allP[0] ?? ''
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.fillInput(this.signupNameInput, name)
    await this.fillInput(this.signupEmailInput, email)
    await this.signupButton.click()
    await this.waitForLoad()
  }
}
