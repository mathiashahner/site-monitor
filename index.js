import 'dotenv/config'
import puppeteer from 'puppeteer-core'
import { requests } from './requests.js'

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL
const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN

const scraping = async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://production-sfo.browserless.io/chromium/stealth?token=${BROWSERLESS_TOKEN}`,
  })

  const page = await browser.newPage()
  let message = '🛎️ Prices update:\n'

  for (const request of requests) {
    try {
      await page.goto(request.url, { waitUntil: 'domcontentloaded' })
      await page.waitForSelector(request.selector)

      const value = await page.$eval(request.selector, (el) =>
        el.textContent.trim(),
      )

      message += `\n${request.message}: ${value}`
    } catch (error) {
      message += `\nError getting price`
      console.error(`Error processing ${request.name}:`, error.message)
    }
  }

  sendWebhookMessage(message)
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
