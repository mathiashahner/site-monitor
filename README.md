# site-monitor

A web scraping tool that monitors price changes on websites and sends notifications to Discord via webhooks. The tool uses Puppeteer with Browserless.io for reliable, bot-detection-resistant web scraping.

## Setup Instructions

1. Create a [browserless.io](https://browserless.io) account and get your API token

2. Create a Discord Webhook on the channel where you want to receive notifications and get the URL

3. Create a `.env` file and add your credentials

   ```env
   BROWSERLESS_TOKEN=your_browserless_token_here
   WEBHOOK_URL=your_discord_webhook_url_here
   ```

4. Install Dependencies

   ```bash
   pnpm install
   ```

5. Running site-monitor

   ```bash
   node index.js
   ```

## Customizing Monitored Sites

To add or modify the websites being monitored, edit the `requests.js` file:

```javascript
export const requests = [
  {
    name: 'site-identifier',
    message: '🏷️ Display Name',
    selector: '.css-selector-for-price',
    url: 'https://example.com/page-to-monitor',
  },
  // Add more sites here...
]
```

## Scheduling (Optional)

To run site-monitor automatically, you can set up a cron job:

```bash
# Edit your crontab
crontab -e

# Add a line to run every hour
0 * * * * cd /path/to/site-monitor && node index.js
```

## Troubleshooting

- **Scraping failures**: Website selectors may have changed - update the CSS selector in `requests.js`
- **Rate limiting**: Browserless.io has usage limits based on your plan

## Next steps

- [ ] Save error logs
- [ ] Save price history to compare with the next run
