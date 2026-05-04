import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber'
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright'
import { env } from '@config/env'

export class CustomWorld extends World {
  browser!: Browser
  context!: BrowserContext
  page!: Page

  // Shared state across steps in a scenario
  scenarioData: Record<string, unknown> = {}

  constructor(options: IWorldOptions) {
    super(options)
  }

  async init(): Promise<void> {
    const browserType = { chromium, firefox, webkit }[env.BROWSER]

    this.browser = await browserType.launch({
      headless: env.HEADLESS,
      slowMo: env.SLOW_MO,
    })

    this.context = await this.browser.newContext({
      baseURL: env.BASE_URL,
      viewport: { width: 1280, height: 720 },
      recordVideo: env.VIDEO_ON_FAIL ? { dir: 'reports/videos/' } : undefined,
    })

    this.context.setDefaultTimeout(env.TIMEOUT)
    this.page = await this.context.newPage()
  }

  async teardown(): Promise<void> {
    await this.page?.close()
    await this.context?.close()
    await this.browser?.close()
  }

  /** Convenience: store a value to share between steps */
  set<T>(key: string, value: T): void {
    this.scenarioData[key] = value
  }

  /** Convenience: retrieve a stored value */
  get<T>(key: string): T {
    return this.scenarioData[key] as T
  }
}

setWorldConstructor(CustomWorld)
