import { Page, Locator, expect } from '@playwright/test'
import { env } from '@config/env'

export abstract class BasePage {
  constructor(protected page: Page) {}

  /** Navigate to a path relative to BASE_URL */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path)
  }

  /** Wait for page to fully load */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: env.TIMEOUT })
  }

  /** Get page title */
  async getTitle(): Promise<string> {
    return this.page.title()
  }

  /** Assert URL contains a path segment */
  async assertUrl(segment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(segment))
  }

  /** Assert element is visible */
  async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible()
  }

  /** Assert element contains text */
  async assertText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text)
  }

  /** Fill an input safely (clear first) */
  async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.clear()
    await locator.fill(value)
  }

  /** Take a named screenshot */
  async screenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({
      path: `reports/screenshots/${name}_${Date.now()}.png`,
      fullPage: true,
    })
  }
}
