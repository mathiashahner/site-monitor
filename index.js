import puppeteer from 'puppeteer'

const URL =
  'https://www.msccruzeiros.com.br/ofertas/super-bingo?departureDateFrom=29%2F11%2F2025&departureDateTo=29%2F11%2F2025&passengers=2%7C0%7C0%7C0&area=SOA&nights=6%2C7'

const scraping = async () => {
  // Launch headless browser
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  // Go to the page
  await page.goto(URL, { waitUntil: 'networkidle2' })

  // Wait for the price selector to appear
  await page.waitForSelector('.prices__main-price span')

  // Extract the price text
  const price = await page.$eval('.prices__main-price span', (el) =>
    el.textContent.trim()
  )

  fetch(
    'https://discord.com/api/webhooks/1414766620664139896/kERXHcKC2D0jDstLUnAKxoj2xeDyfAlBMCzgPdDB4B7C-QIBonm-QkYv8RjNbYNn9_d8',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `Cruzeiro MSC: ${price}`,
      }),
    }
  )

  await browser.close()
}

scraping()
