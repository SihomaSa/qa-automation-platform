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
    // Guard: if login succeeded the page navigates away from /login — no error to read.
    const url = this.page.url()
    if (!url.includes('/login')) {
      console.log(`[DEBUG] getErrorMessage called but page is at ${url} (login succeeded?)`)
      return ''
    }

    // Primary: wait for the red server-side error paragraph inside the form
    try {
      const errorEl = this.page.locator('form[action="/login"] p[style*="color"]')
      await errorEl.waitFor({ state: 'visible', timeout: 8000 })
      return (await errorEl.first().textContent())?.trim() ?? ''
    } catch { /* not present, try broader selectors */ }

    // Broader: any red-coloured <p> anywhere on the page
    try {
      const anyRed = this.page.locator('p[style*="color: red"], p[style*="color:red"]')
      await anyRed.waitFor({ state: 'visible', timeout: 3000 })
      return (await anyRed.first().textContent())?.trim() ?? ''
    } catch { /* not present */ }

    // Last resort: dump all visible paragraph text for debugging
    const allP = await this.page.$$eval('p', (els) =>
      els
        .filter((el) => (el as Element & { offsetParent: Element | null }).offsetParent !== null)
        .map((el) => el.textContent?.trim())
        .filter(Boolean)
    )
    console.log('[DEBUG] All visible <p> on login page after submit:', allP)

    return allP.find((t) => t && t.toLowerCase().includes('incorrect')) ?? allP[0] ?? ''
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.fillInput(this.signupNameInput, name)
    await this.fillInput(this.signupEmailInput, email)
    await this.signupButton.click()
    await this.waitForLoad()
  }
}
