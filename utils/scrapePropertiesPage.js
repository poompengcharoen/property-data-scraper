import scrollToBottom from './scrollToBottom.js'

// Scrape a single page
const scrapePropertiesPage = async (page, url, scrollDelay, pageLoadTimeout, extractProperties) => {
	try {
		console.log(`Scraping page: ${url}`)
		await page.goto(url, { waitUntil: 'domcontentloaded', timeout: pageLoadTimeout })
		await scrollToBottom(page, scrollDelay)
		return await page.evaluate(extractProperties)
	} catch (error) {
		console.error(`Error scraping page ${url}:`, error)
		return []
	}
}

export default scrapePropertiesPage
