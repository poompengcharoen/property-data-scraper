import delay from './delay.js'
import formatPrice from './formatPrice.js'
import puppeteer from 'puppeteer'
import randomUseragent from 'random-useragent'
import saveDataToDb from './saveDataToDb.js'
import scrapePropertiesPage from './scrapePropertiesPage.js'

const scrape = async (scraper, endpoint) => {
	const {
		BASE_URL,
		PAGE_LOAD_TIMEOUT,
		SCROLL_DELAY,
		NAVIGATION_DELAY,
		extractProperties,
		getNextPageUrl,
	} = scraper
	const browser = await puppeteer.launch({
		headless: process.env.NODE_ENV === 'production',
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	})
	const page = await browser.newPage()

	await page.setUserAgent(randomUseragent.getRandom())

	let url = endpoint || BASE_URL

	try {
		while (url) {
			const properties = await scrapePropertiesPage(
				page,
				url,
				SCROLL_DELAY,
				PAGE_LOAD_TIMEOUT,
				extractProperties
			)
			if (properties.length > 0) {
				const formattedProperties = properties.map((property) => {
					if (!property.price) {
						return property
					}

					const { priceNumeric, currencyCode } = formatPrice(property.price)
					return {
						...property,
						priceNumeric,
						currencyCode,
					}
				})

				console.log(formattedProperties)
				await saveDataToDb(formattedProperties)
			}

			url = await getNextPageUrl(page)
			await delay(NAVIGATION_DELAY * Math.random() + NAVIGATION_DELAY)
		}
	} catch (err) {
		console.error('Error during scraping:', err)
	} finally {
		await browser.close()
		console.log('Scraping complete!')
	}
}

export default scrape
