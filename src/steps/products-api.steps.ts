import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '@support/world'
import { ApiResponse } from '@api/ApiClient'
import { productsService, ProductsResponse } from '@api/ProductsService'
import { apiClient } from '@api/ApiClient'

When('I request the products list', async function (this: CustomWorld) {
  const response = await productsService.getAllProducts()
  this.set('apiResponse', response)
})

When('I search for product {string} via API', async function (this: CustomWorld, query: string) {
  const response = await productsService.searchProduct(query)
  this.set('apiResponse', response)
  this.set('searchQuery', query)
})

When('I send a DELETE request to the products list endpoint', async function (this: CustomWorld) {
  const response = await apiClient.delete('/productsList')
  this.set('apiResponse', response)
})

Then('the response status code should be {int}', async function (this: CustomWorld, expectedStatus: number) {
  const response = this.get<ApiResponse>('apiResponse')
  expect(response.status).toBe(expectedStatus)
})

// New step: assert status is NOT a specific code
Then('the response status code should not be {int}', async function (this: CustomWorld, badStatus: number) {
  const response = this.get<ApiResponse>('apiResponse')
  expect(response.status).not.toBe(badStatus)
})

Then('the response should contain a list of products', async function (this: CustomWorld) {
  const response = this.get<ApiResponse<ProductsResponse>>('apiResponse')
  expect(Array.isArray(response.data.products)).toBe(true)
  expect(response.data.products.length).toBeGreaterThan(0)
})

Then('each product should have id, name, price and brand', async function (this: CustomWorld) {
  const response = this.get<ApiResponse<ProductsResponse>>('apiResponse')
  for (const product of response.data.products) {
    expect(product).toHaveProperty('id')
    expect(product).toHaveProperty('name')
    expect(product).toHaveProperty('price')
    expect(product).toHaveProperty('brand')
  }
})

Then('the response time should be under {int} milliseconds', async function (this: CustomWorld, maxMs: number) {
  const response = this.get<ApiResponse>('apiResponse')
  expect(response.duration).toBeLessThan(maxMs)
})

Then('the response should contain products matching {string}', async function (this: CustomWorld, query: string) {
  const response = this.get<ApiResponse<ProductsResponse>>('apiResponse')
  expect(response.data.products.length).toBeGreaterThan(0)
  const match = response.data.products.some((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  )
  expect(match).toBe(true)
})
