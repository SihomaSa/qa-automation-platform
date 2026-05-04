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
  const homePage = this.get<HomePage>('homePage')
  const actualTitle = await homePage.getTitle()
  expect(actualTitle).toContain(title)
})

Then('the navigation bar should be visible', async function (this: CustomWorld) {
  const homePage = this.get<HomePage>('homePage')
  await homePage.assertVisible(homePage.navBar)
})

Then('featured products should be displayed', async function (this: CustomWorld) {
  const homePage = this.get<HomePage>('homePage')
  const count = await homePage.getFeaturedProductCount()
  expect(count).toBeGreaterThan(0)
})

When('I search for {string}', async function (this: CustomWorld, query: string) {
  const homePage = this.get<HomePage>('homePage')
  await homePage.searchProduct(query)
})

Then('I should see search results for {string}', async function (this: CustomWorld, query: string) {
  const productNames = this.page.locator('.productinfo h2')
  const count = await productNames.count()
  expect(count).toBeGreaterThan(0)

  // Verify at least one result matches
  const firstProduct = await productNames.first().textContent()
  expect(firstProduct?.toLowerCase()).toContain(query.toLowerCase().split(' ')[0])
})

When('I click on the Login/Signup link', async function (this: CustomWorld) {
  const homePage = this.get<HomePage>('homePage')
  await homePage.navigateToLogin()
})

Then('I should be on the login page', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/login/)
})
