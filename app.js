import {
	BASE_URL,
	NAVIGATION_DELAY,
	PAGE_LOAD_TIMEOUT,
	SCROLL_DELAY,
	extractProperties,
	getNextPageUrl,
} from './scrapers/thailand-property.com.js'

import { connectDb } from './configs/db.js'
import scrape from './utils/scrape.js'

const main = async () => {
	// Connect to the database
	await connectDb()

	// Start the scraping process
	await scrape(
		BASE_URL,
		SCROLL_DELAY,
		PAGE_LOAD_TIMEOUT,
		NAVIGATION_DELAY,
		extractProperties,
		getNextPageUrl
	)
}

main()
