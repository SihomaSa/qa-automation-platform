import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class HomePage extends BasePage {
  // Locators
  readonly logo = this.page.locator('img[alt="Website for automation practice"]')
  readonly searchInput = this.page.getByPlaceholder('Search Product')
  readonly searchButton = this.page.locator('#submit_search')
  readonly navBar = this.page.locator('#header')
  readonly loginLink = this.page.getByRole('link', { name: /signup.*login/i })
  readonly cartLink = this.page.getByRole('link', { name: /cart/i })
  readonly featuredProductsSection = this.page.locator('.features_items')
  readonly productCards = this.page.locator('.product-image-wrapper')

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
    await this.waitForLoad()
  }

  async navigateToLogin(): Promise<void> {
    await this.loginLink.click()
    await this.assertUrl('login')
  }

  async navigateToCart(): Promise<void> {
    await this.cartLink.click()
    await this.assertUrl('view_cart')
  }

  async getFeaturedProductCount(): Promise<number> {
    return this.productCards.count()
  }

  async isLoaded(): Promise<boolean> {
    return this.logo.isVisible()
  }
}
