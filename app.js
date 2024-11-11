import { connectDb } from './configs/db.js'
import { scrape as scrapeThailandProperty } from './scrapers/thailand-property.com.js'

const main = async () => {
	// Connect to the database
	await connectDb()

	// Start the scraping process
	await scrapeThailandProperty()
}

main()
