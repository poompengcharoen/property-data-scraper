import { connectDb } from './configs/db.js'
import cron from 'node-cron'
import scrape from './utils/scrape.js'
import thailandPropertyScraper from './scrapers/thailand-property.com.js'

const main = async () => {
	// Connect to the database
	await connectDb()

	// Start the scraping process
	await scrape(thailandPropertyScraper)
}

// Schedule the cron job
cron.schedule('*/30 * * * *', () => {
	console.log('Running the scraping task...')
	main()
		.then(() => console.log('Scraping task completed'))
		.catch((error) => console.error('Error running scraping task:', error))
})
