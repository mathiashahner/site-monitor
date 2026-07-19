import 'dotenv/config'
import { chromium } from 'playwright'
import { requests } from './requests.js'

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL
const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN

const scraping = async () => {
  const browser = 0
    ? await chromium.connect({
        wsEndpoint: `wss://production-sfo.browserless.io/?token=${BROWSERLESS_TOKEN}`,
      })
    : await chromium.launch({ headless: false })

  const page = await browser.newPage()
  let message = '🛎️ Prices update:\n'

  for (const request of requests) {
    try {
      await page.goto(request.url, { waitUntil: 'domcontentloaded' })
      await page.waitForSelector(request.selector)

      const value = await page.locator(request.selector).first().textContent()

      message += `\n${request.message}: ${value}`
    } catch (error) {
      message += `\n${request.message}: Error getting price`
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
