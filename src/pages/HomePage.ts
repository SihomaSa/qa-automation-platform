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
    // #search_product exists on /products, not on the home page —
    // navigate there first before interacting with the search bar.
    await this.goto('/products')
    await this.waitForLoad()
    await this.dismissOverlays()
    await this.searchInput.waitFor({ state: 'visible', timeout: 20000 })
    await this.searchInput.scrollIntoViewIfNeeded()
    await this.searchInput.click()
    await this.searchInput.fill(query)
    await this.searchButton.click()
    // After submit the URL becomes /products?search=... and results render in .productinfo cards
    await this.page.waitForURL(/search=/, { timeout: 30000 })
    await this.page.locator('.productinfo').first().waitFor({ state: 'visible', timeout: 15000 })
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
