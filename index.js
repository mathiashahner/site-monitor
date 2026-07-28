import 'dotenv/config'
import { chromium } from 'playwright'
import { requests } from './requests.js'
import { saveScrapingResults } from './db.js'

const isDevEnv = process.env.NODE_ENV === 'development'
const browserlessToken = process.env.BROWSERLESS_TOKEN
const discordoWebhookUrl = process.env.DISCORD_WEBHOOK_URL

const scraping = async () => {
  const browser = isDevEnv
    ? await chromium.launch({ headless: false })
    : await chromium.connect(
        `wss://production-sfo.browserless.io/chromium/playwright?token=${browserlessToken}`,
      )

  const results = await Promise.all(
    requests.map(async (request) => {
      try {
        const page = await browser.newPage()
        await page.goto(request.url, { waitUntil: 'domcontentloaded' })

        const value = await Promise.all(
          request.steps.map(async (step) => {
            await page.waitForSelector(step.selector, { timeout: 5000 })
            return await page.locator(step.selector).first().textContent()
          }),
        )

        return {
          name: request.name,
          message: request.message,
          value: value,
          text: `${request.message}: ${value}`,
        }
      } catch (error) {
        console.error(`Error processing ${request.name}:`, error.message)
        return {
          name: request.name,
          message: request.message,
          value: null,
          text: `${request.message}: Not found`,
        }
      }
    }),
  )

  await browser.close()

  try {
    await saveScrapingResults(results)
  } catch (error) {
    console.warn('MySQL persistence skipped:', error.message)
  }

  return `🛎️ Prices update:\n${results.map((result) => result.text).join('\n')}`
}

const sendMessage = async (message) => {
  if (isDevEnv) {
    console.log(message)
    return
  }

  await fetch(discordoWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: message }),
  })
}

const main = async () => {
  const message = await scraping()
  await sendMessage(message)
}

main()
