import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '@support/world'
import { HomePage } from '@pages/HomePage'

Given('I am on the home page', async function (this: CustomWorld) {
  const homePage = new HomePage(this.page)
  await homePage.open()
  this.set('homePage', homePage)
})

Then('the page title should contain {string}', async function (this: CustomWorld, title: string) {
  // Use toHaveTitle — it auto-retries until the title is set (domcontentloaded
  // fires before JS may set the <title>, so a plain getTitle() can return "").
  await expect(this.page).toHaveTitle(new RegExp(title, 'i'), { timeout: 30000 })
})

Then('the navigation bar should be visible', async function (this: CustomWorld) {
  const homePage = this.get<HomePage>('homePage')
  await homePage.assertVisible(homePage.navBar)
})

Then('featured products should be displayed', async function (this: CustomWorld) {
  const homePage = this.get<HomePage>('homePage')
  // Wait for at least one card to be visible
  await homePage.productCards.first().waitFor({ state: 'visible', timeout: 20000 })
  const count = await homePage.getFeaturedProductCount()
  expect(count).toBeGreaterThan(0)
})

When('I search for {string}', async function (this: CustomWorld, query: string) {
  const homePage = this.get<HomePage>('homePage')
  await homePage.searchProduct(query)
})

Then('I should see search results for {string}', async function (this: CustomWorld, query: string) {
  // Wait for results to appear after search
  const firstResult = this.page.locator('.productinfo h2').first()
  await firstResult.waitFor({ state: 'visible', timeout: 20000 })

  const count = await this.page.locator('.productinfo h2').count()
  expect(count).toBeGreaterThan(0)

  const firstProductName = await firstResult.textContent()
  expect(firstProductName?.toLowerCase()).toContain(query.toLowerCase().split(' ')[0])
})

When('I click on the Login\\/Signup link', async function (this: CustomWorld) {
  const homePage = this.get<HomePage>('homePage')
  await homePage.navigateToLogin()
})

Then('I should be on the login page', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/login/, { timeout: 15000 })
})
