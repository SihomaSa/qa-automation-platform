/**
 * Run this ONCE to discover real selectors on automationexercise.com
 * Usage: npx ts-node -r tsconfig-paths/register src/support/debug-selectors.ts
 */
import { chromium } from 'playwright'

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  console.log('\n=== HOME PAGE ===')
  await page.goto('https://automationexercise.com', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2000)

  // Find search input
  const inputs = await page.$$eval('input', (els) =>
    els.map((el) => ({
      id: el.id,
      name: el.getAttribute('name'),
      placeholder: el.placeholder,
      type: el.type,
      className: el.className.substring(0, 60),
    }))
  )
  console.log('Inputs:', JSON.stringify(inputs, null, 2))

  console.log('\n=== LOGIN PAGE ===')
  await page.goto('https://automationexercise.com/login', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(2000)

  // Find login form structure
  const formHTML = await page.$eval('.login-form', (el) => el.innerHTML.substring(0, 2000)).catch(() => 'NOT FOUND: .login-form')
  console.log('Login form HTML:', formHTML)

  // Try submitting with wrong creds to see error
  await page.fill('[data-qa="login-email"]', 'wrong@test.com').catch(e => console.log('fill email error:', e.message))
  await page.fill('[data-qa="login-password"]', 'wrongpass').catch(e => console.log('fill pass error:', e.message))
  await page.click('[data-qa="login-button"]').catch(e => console.log('click error:', e.message))
  await page.waitForTimeout(2000)

  const errorHTML = await page.$eval('.login-form', (el) => el.innerHTML.substring(0, 2000)).catch(() => 'NOT FOUND')
  console.log('\nLogin form after submit:', errorHTML)

  await browser.close()
}

main().catch(console.error)
