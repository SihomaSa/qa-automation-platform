import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class HomePage extends BasePage {
  // Use id-based selectors — most stable against overlay/ad interference
  readonly logo = this.page.locator('img[alt="Website for automation practice"]')
  readonly searchInput = this.page.locator('#search_product')   // actual id on the site
  readonly searchButton = this.page.locator('#submit_search')
  readonly navBar = this.page.locator('#header')
  readonly loginLink = this.page.locator('a[href="/login"]')
  readonly cartLink = this.page.locator('a[href="/view_cart"]')
  readonly productCards = this.page.locator('.product-image-wrapper')

  constructor(page: Page) {
    super(page)
  }

  async open(): Promise<void> {
    await this.goto('/')
    await this.waitForLoad()
    // Dismiss cookie/ad overlay if present
    await this.dismissOverlays()
  }

  /** Close any modal or consent overlay that may block inputs */
  private async dismissOverlays(): Promise<void> {
    // Common overlay patterns on this site
    const overlaySelectors = [
      'button[aria-label="Close"]',
      '.modal-header .close',
      '#dismiss-button',
      '.fc-button-label',            // funding choices consent
      'button.fc-cta-consent',
      '[aria-label="Consent"]',
    ]
    for (const sel of overlaySelectors) {
      try {
        const btn = this.page.locator(sel)
        if (await btn.isVisible({ timeout: 1500 })) {
          await btn.click()
          await this.page.waitForTimeout(300)
        }
      } catch { /* not present */ }
    }
  }

  async searchProduct(query: string): Promise<void> {
    // #search_product is on /products, not the home page.
    // Retry up to 3 times in case the site returns a rate-limit page
    // ("too many people accessing") instead of the real /products page.
    const MAX_ATTEMPTS = 3
    let lastError = ''

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      await this.goto('/products')
      await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => {})
      await this.page.waitForTimeout(1500)
      await this.dismissOverlays()

      // Use evaluate() to bypass ad-overlay occlusion that blocks Playwright's
      // visibility checks. Returns false when the page is a rate-limit splash.
      const filled = await this.page.evaluate((q) => {
        const input = document.getElementById('search_product') as HTMLInputElement | null
        const button = document.getElementById('submit_search') as HTMLButtonElement | null
        if (!input) return false
        input.value = q
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
        button?.click()
        return true
      }, query)

      if (filled) {
        // URL becomes /products?search=... and cards render under .productinfo
        await this.page.waitForURL(/search=/, { timeout: 30000 })
        await this.page.locator('.productinfo').first().waitFor({ state: 'visible', timeout: 15000 })
        return
      }

      lastError = `attempt ${attempt}: #search_product not found — site may be rate-limiting`
      console.warn(`[WARN] searchProduct ${lastError}`)
      if (attempt < MAX_ATTEMPTS) await this.page.waitForTimeout(4000)
    }

    throw new Error(`searchProduct failed after ${MAX_ATTEMPTS} attempts. Last: ${lastError}`)
  }

  async navigateToLogin(): Promise<void> {
    await this.loginLink.click()
    await this.waitForLoad()
  }

  async navigateToCart(): Promise<void> {
    await this.cartLink.click()
    await this.waitForLoad()
  }

  async getFeaturedProductCount(): Promise<number> {
    return this.productCards.count()
  }
}
