import { connectDb, disconnectDb } from './configs/db.js'

import cron from 'node-cron'
import fazwazScraper from './scrapers/fazwaz.com.js'
import inquirer from 'inquirer'
import scrape from './utils/scrape.js'
import thailandPropertyScraper from './scrapers/thailand-property.com.js'

const scrapers = [thailandPropertyScraper, fazwazScraper]

const runScraper = async (scraper, endpoint = null) => {
	try {
		await connectDb()
		await scrape(scraper, endpoint)
		console.log(`Scraping task for ${scraper.NAME} completed.`)
	} catch (error) {
		console.error(`Error running scraping task for ${scraper.NAME}:`, error)
	} finally {
		await disconnectDb()
	}
}

const scheduleCronJobs = () => {
	cron.schedule('0 0,12 * * *', async () => {
		const randomScraper = scrapers[Math.floor(Math.random() * scrapers.length)]
		await runScraper(randomScraper)
	})
	console.log('Cron jobs scheduled for midnight and midday.')
}

const promptForScraper = async () => {
	const { scraper: selectedScraperName, endpoint } = await inquirer.prompt([
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
			choices: (answers) => {
				const selectedScraper = scrapers.find((scraper) => scraper.NAME === answers.scraper)
				return selectedScraper.BASE_URLS
			},
			when: (answers) => !!answers.scraper, // Show only if a scraper is selected
		},
	])

	const selectedScraper = scrapers.find((scraper) => scraper.NAME === selectedScraperName)
	await runScraper(selectedScraper, endpoint)
}

const main = async () => {
	if (process.env.NODE_ENV === 'development') {
		console.log('Running in development mode...')
		await promptForScraper()
	} else {
		scheduleCronJobs()
	}
}

main()
