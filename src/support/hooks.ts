import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  Status,
  ITestCaseHookParameter,
} from '@cucumber/cucumber'
import { CustomWorld } from './world'
import { env } from '@config/env'
import * as fs from 'fs'
import * as path from 'path'

// Ensure reports directory exists
BeforeAll(async function () {
  const dirs = ['reports', 'reports/screenshots', 'reports/videos', 'allure-results']
  dirs.forEach((dir) => fs.mkdirSync(dir, { recursive: true }))
})

// Skip browser init for API-only scenarios
Before({ tags: 'not @api-only' }, async function (this: CustomWorld) {
  await this.init()
})

// Capture screenshot + attach to report on failure
After({ tags: 'not @api-only' }, async function (
  this: CustomWorld,
  scenario: ITestCaseHookParameter
) {
  if (scenario.result?.status === Status.FAILED) {
    if (env.SCREENSHOT_ON_FAIL) {
      const screenshotName = `${scenario.pickle.name.replace(/\s+/g, '_')}_${Date.now()}.png`
      const screenshotPath = path.join('reports/screenshots', screenshotName)

      const screenshot = await this.page?.screenshot({ path: screenshotPath, fullPage: true })

      if (screenshot) {
        await this.attach(screenshot, 'image/png')
      }
    }

    // Attach page HTML for debugging
    try {
      const html = await this.page?.content()
      if (html) await this.attach(html, 'text/html')
    } catch {
      // page may already be closed
    }
  }

  await this.teardown()
})

AfterAll(async function () {
  console.log('\n📊 Reports generated in ./reports/')
})
