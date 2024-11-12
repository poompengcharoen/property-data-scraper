import delay from './delay.js'
import puppeteer from 'puppeteer'
import randomUseragent from 'random-useragent'
import { saveDataToDb } from '../configs/db.js'
import scrapePropertiesPage from './scrapePropertiesPage.js'

const scrape = async (
	baseUrl,
	scrollDelay,
	pageLoadTimeout,
	navigationDelay,
	extractProperties,
	getNextPageUrl
) => {
	const browser = await puppeteer.launch({ headless: true })
	const page = await browser.newPage()

	await page.setUserAgent(randomUseragent.getRandom())

	let url = baseUrl
	const allProperties = []

	try {
		while (url) {
			const properties = await scrapePropertiesPage(
				page,
				url,
				scrollDelay,
				pageLoadTimeout,
				extractProperties
			)
			if (properties.length > 0) {
				console.log(properties)
				allProperties.push(...properties)
				await saveDataToDb(properties)
			}

			url = await getNextPageUrl(page)
			await delay(navigationDelay * Math.random() + navigationDelay)
		}
	} catch (err) {
		console.error('Error during scraping:', err)
	} finally {
		await browser.close()
		console.log('Scraping complete!')
	}
}

export default scrape
