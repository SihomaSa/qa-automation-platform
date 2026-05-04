import { expect } from '@playwright/test'
import { ApiResponse } from '@api/ApiClient'

/** Extra semantic assertions on top of Playwright's expect */
export const Assert = {
  /** Assert API response status */
  status(response: ApiResponse, expected: number): void {
    expect(response.status, `Expected status ${expected}, got ${response.status}`).toBe(expected)
  },

  /** Assert response time is within a budget */
  responseTime(response: ApiResponse, maxMs: number): void {
    expect(
      response.duration,
      `Response took ${response.duration}ms, expected < ${maxMs}ms`
    ).toBeLessThan(maxMs)
  },

  /** Assert object has all required keys */
  hasKeys(obj: Record<string, unknown>, keys: string[]): void {
    for (const key of keys) {
      expect(obj, `Missing key: ${key}`).toHaveProperty(key)
    }
  },

  /** Assert array is not empty */
  notEmpty(arr: unknown[], label = 'array'): void {
    expect(arr.length, `Expected ${label} to have items, got empty array`).toBeGreaterThan(0)
  },

  /** Assert value is within a numeric range */
  inRange(value: number, min: number, max: number, label = 'value'): void {
    expect(value, `${label} (${value}) out of range [${min}, ${max}]`).toBeGreaterThanOrEqual(min)
    expect(value, `${label} (${value}) out of range [${min}, ${max}]`).toBeLessThanOrEqual(max)
  },
}
