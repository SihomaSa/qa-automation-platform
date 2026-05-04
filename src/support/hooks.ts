import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  Status,
  ITestCaseHookParameter,
  setDefaultTimeout,
} from '@cucumber/cucumber'
import { CustomWorld } from './world'
import * as fs from 'fs'
import * as path from 'path'

// Set default timeout for ALL steps — must be called at module level
setDefaultTimeout(60 * 1000) // 60 seconds

BeforeAll(async function () {
  const dirs = ['reports', 'reports/screenshots', 'reports/videos', 'allure-results']
  dirs.forEach((dir) => fs.mkdirSync(dir, { recursive: true }))
})

Before({ tags: '@e2e' }, async function (this: CustomWorld) {
  await this.init()
})

After({ tags: '@e2e' }, async function (
  this: CustomWorld,
  scenario: ITestCaseHookParameter
) {
  if (scenario.result?.status === Status.FAILED) {
    const screenshotOnFail = process.env.SCREENSHOT_ON_FAIL !== 'false'
    if (screenshotOnFail && this.page) {
      try {
        const screenshotName = `${scenario.pickle.name.replace(/\s+/g, '_')}_${Date.now()}.png`
        const screenshotPath = path.join('reports/screenshots', screenshotName)
        const screenshot = await this.page.screenshot({ path: screenshotPath, fullPage: true })
        await this.attach(screenshot, 'image/png')
      } catch { /* non-fatal */ }
    }
    try {
      const html = await this.page?.content()
      if (html) await this.attach(html, 'text/html')
    } catch { /* page may be closed */ }
  }
  await this.teardown()
})

AfterAll(async function () {
  console.log('\n📊 Reports generated in ./reports/')
})
