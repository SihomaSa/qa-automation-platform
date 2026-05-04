import * as dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const EnvSchema = z.object({
  BASE_URL: z.string().url().default('https://automationexercise.com'),
  API_BASE_URL: z.string().url().default('https://automationexercise.com/api'),
  HEADLESS: z
    .string()
    .transform((v) => v !== 'false')
    .default('true'),
  BROWSER: z.enum(['chromium', 'firefox', 'webkit']).default('chromium'),
  SLOW_MO: z.coerce.number().default(0),
  TIMEOUT: z.coerce.number().default(30000),
  RETRIES: z.coerce.number().default(1),
  SCREENSHOT_ON_FAIL: z
    .string()
    .transform((v) => v !== 'false')
    .default('true'),
  VIDEO_ON_FAIL: z
    .string()
    .transform((v) => v !== 'false')
    .default('false'),
})

export type Env = z.infer<typeof EnvSchema>

const parsed = EnvSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format())
  process.exit(1)
}

export const env: Env = parsed.data
