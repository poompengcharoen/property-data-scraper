import { connectDb } from './configs/db.js'
import cron from 'node-cron'
import scrape from './utils/scrape.js'
import thailandPropertyScraper from './scrapers/thailand-property.com.js'

const main = async () => {
	try {
		await connectDb()

		// Start the scraping process
		await scrape(thailandPropertyScraper)
		console.log('Scraping task completed')
	} catch (error) {
		console.error('Error running scraping task:', error)
	}
}

// Scrape immediately when the script starts
await main()

// Schedule the cron job
cron.schedule('*/30 * * * *', async () => {
	await main()
})
