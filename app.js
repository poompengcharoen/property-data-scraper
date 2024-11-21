import { connectDb, disconnectDb } from './configs/db.js'

import cron from 'node-cron'
import fazwazScraper from './scrapers/fazwaz.com.js'
import scrape from './utils/scrape.js'
import thailandPropertyScraper from './scrapers/thailand-property.com.js'

const main = async () => {
	try {
		await connectDb()

		// Randomly pick one scraper to run
		const scrapers = [thailandPropertyScraper, fazwazScraper]
		const randomScraper = scrapers[Math.floor(Math.random() * scrapers.length)]

		// Start the scraping process for the randomly selected scraper
		await scrape(randomScraper)

		// Disconnect from database
		await disconnectDb()

		console.log('Scraping task completed')
	} catch (error) {
		console.error('Error running scraping task:', error)
	}
}

// Scrape immediately when the script starts
await main()

// Schedule the cron job to run at midnight and midday every day
cron.schedule('0 0,12 * * *', async () => {
	await main()
})
