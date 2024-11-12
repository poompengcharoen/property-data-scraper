import { connectDb } from './configs/db.js'
import cron from 'node-cron'
import fazwazScraper from './scrapers/fazwaz.com.js'
import scrape from './utils/scrape.js'
import thailandPropertyScraper from './scrapers/thailand-property.com.js'

const main = async () => {
	try {
		await connectDb()

		// Start the scraping process
		await Promise.all([scrape(thailandPropertyScraper), scrape(fazwazScraper)])

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
