import 'dotenv/config'
import { chromium } from 'playwright'
import { requests } from './requests.js'
import { getLatestScrapingResults, saveScrapingResults } from './db.js'

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
          value: value[0],
          text: `${request.message}: ${value[0]}`,
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

  let previousResults = []

  try {
    previousResults = await getLatestScrapingResults()
  } catch (error) {
    console.warn('Previous results lookup skipped:', error.message)
  }

  const previousValuesByName = new Map(
    previousResults.map(({ name, value }) => [name, value]),
  )

  const newResults = results.filter((result) => {
    const previousValue = previousValuesByName.get(result.name)
    return previousValue !== result.value
  })

  await browser.close()

  try {
    await saveScrapingResults(results)
  } catch (error) {
    console.warn('MySQL persistence skipped:', error.message)
  }

  if (newResults.length === 0) {
    return ''
  }

  return `🛎️ Prices update:\n${newResults.map((result) => result.text).join('\n')}`
}

const sendMessage = async (message) => {
  if (!message) {
    return
  }

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
