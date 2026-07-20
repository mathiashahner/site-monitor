import 'dotenv/config'
import { chromium } from 'playwright'
import { requests } from './requests.js'

const IS_DEV_ENV = process.env.IS_DEV_ENV
const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

const scraping = async () => {
  const browser = IS_DEV_ENV
    ? await chromium.launch({ headless: false })
    : await chromium.connect({
        wsEndpoint: `wss://production-sfo.browserless.io/?token=${BROWSERLESS_TOKEN}`,
      })

  const page = await browser.newPage()
  let message = '🛎️ Prices update:\n'

  for (const request of requests) {
    try {
      await page.goto(request.url, { waitUntil: 'domcontentloaded' })

      const value = await Promise.all(
        request.steps.map(async (step) => {
          await page.waitForSelector(step.selector, { timeout: 5000 })
          return await page.locator(step.selector).first().textContent()
        }),
      )

      message += `\n${request.message}: ${value}`
    } catch (error) {
      message += `\n${request.message}: Not found`
      console.error(`Error processing ${request.name}:`, error.message)
    }
  }

  // sendWebhookMessage(message)
  console.log(message)

  await browser.close()
}

const sendWebhookMessage = (message) => {
  fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: message }),
  })
}

scraping()
