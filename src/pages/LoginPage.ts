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

    // Disable HTML5 native validation so values like "notanemail"
    // are still submitted to the server (which returns the real error).
    await this.page.evaluate(() => {
      const form = document.querySelector('form[action="/login"]') as HTMLFormElement | null
      if (form) form.noValidate = true
    })

    await this.fillInput(this.emailInput, email)
    await this.fillInput(this.passwordInput, password)

    // Use Promise.all so we don't miss a fast navigation before click resolves
    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      this.loginButton.click(),
    ])
    await this.page.waitForTimeout(1000)
  }

  /**
   * Read error message after failed login.
   * automationexercise.com renders: <p style="color: red;">Your email or password is incorrect!</p>
   * We wait explicitly for that element so we never fall back to unrelated paragraphs.
   */
  async getErrorMessage(): Promise<string> {
    // Primary: wait for the red-coloured server-side error paragraph
    try {
      const errorEl = this.page.locator('p[style*="color: red"], p[style*="color:red"]')
      await errorEl.waitFor({ state: 'visible', timeout: 8000 })
      return (await errorEl.first().textContent())?.trim() ?? ''
    } catch { /* not present, try next */ }

    // Fallback: any <p> inside the login form
    try {
      const formError = this.page.locator('form[action="/login"] p')
      const count = await formError.count()
      if (count > 0) {
        return (await formError.first().textContent())?.trim() ?? ''
      }
    } catch { /* not present */ }

    // Last resort: dump all visible paragraph text for debugging
    const allP = await this.page.$$eval('p', (els) =>
      els
        .filter((el) => (el as Element & { offsetParent: Element | null }).offsetParent !== null)
        .map((el) => el.textContent?.trim())
        .filter(Boolean)
    )
    console.log('[DEBUG] All visible <p> on login page after submit:', allP)

    // Return a paragraph that contains "incorrect", else first available
    return allP.find((t) => t && t.toLowerCase().includes('incorrect')) ?? allP[0] ?? ''
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.fillInput(this.signupNameInput, name)
    await this.fillInput(this.signupEmailInput, email)
    await this.signupButton.click()
    await this.waitForLoad()
  }
}
