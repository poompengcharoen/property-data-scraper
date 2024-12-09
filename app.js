import { connectDb, disconnectDb } from './configs/db.js'

import cron from 'node-cron'
import fazwazScraper from './scrapers/fazwaz.com.js'
import inquirer from 'inquirer'
import scrape from './utils/scrape.js'
import thailandPropertyScraper from './scrapers/thailand-property.com.js'

const scrapers = [thailandPropertyScraper, fazwazScraper]

const main = async () => {
	try {
		await connectDb()

		// Randomly pick one scraper to run
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

// Schedule the cron job to run at midnight and midday every day
cron.schedule('0 0,12 * * *', async () => {
	await main()
})

// Development mode
if (process.env.NODE_ENV === 'development') {
	// Prompt the user to pick a scraper to run
	const scraperPrompt = await inquirer.prompt([
		{
			type: 'list',
			name: 'scraper',
			message: 'Choose a scraper to run:',
			choices: scrapers.map((scraper) => scraper.NAME),
		},
		{
			type: 'list',
			name: 'endpoint',
			message: 'Choose an endpoint to run:',
			// Dynamically fetch BASE_URLS for the selected scraper
			choices: (answers) => {
				const selectedScraper = scrapers.find((scraper) => scraper.NAME === answers.scraper)
				return selectedScraper.BASE_URLS
			},
			when: (answers) => !!answers.scraper, // Show only if a scraper is selected
		},
	])

	// Get the selected scraper and endpoint from the prompt
	const selectedScraperName = scraperPrompt.scraper
	const selectedScraper = scrapers.find((scraper) => scraper.NAME === selectedScraperName)
	const endpoint = scraperPrompt.endpoint

	// Start the scraping process for the selected scraper
	await scrape(selectedScraper, endpoint)

	// Disconnect from database
	await disconnectDb()

	console.log('Scraping task completed')
}
