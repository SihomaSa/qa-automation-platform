import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class HomePage extends BasePage {
  readonly logo = this.page.locator('img[alt="Website for automation practice"]')
  readonly searchInput = this.page.getByPlaceholder('Search Product')
  readonly searchButton = this.page.locator('#submit_search')
  readonly navBar = this.page.locator('#header')
  readonly loginLink = this.page.locator('a[href="/login"]')
  readonly cartLink = this.page.locator('a[href="/view_cart"]')
  readonly productCards = this.page.locator('.product-image-wrapper')
  readonly searchResults = this.page.locator('#search-products .product-image-wrapper')

  constructor(page: Page) {
    super(page)
  }

  async open(): Promise<void> {
    await this.goto('/')
    await this.waitForLoad()
  }

  async searchProduct(query: string): Promise<void> {
    await this.fillInput(this.searchInput, query)
    await this.searchButton.click()
    // Wait for the search results section to appear — not networkidle
    await this.page.waitForSelector('#search-products', { timeout: 30000 })
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

  async isLoaded(): Promise<boolean> {
    return this.logo.isVisible()
  }
}
