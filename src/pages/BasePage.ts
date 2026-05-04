import { Page, Locator, expect } from '@playwright/test'

export abstract class BasePage {
  constructor(protected page: Page) {}

  async goto(path = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' })
  }

  /** Wait for page — use domcontentloaded, NOT networkidle (ads/trackers break it) */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded')
  }

  async getTitle(): Promise<string> {
    return this.page.title()
  }

  async assertUrl(segment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(segment))
  }

  async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible()
  }

  async assertText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text)
  }

  async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.clear()
    await locator.fill(value)
  }

  async screenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({
      path: `reports/screenshots/${name}_${Date.now()}.png`,
      fullPage: true,
    })
  }
}
