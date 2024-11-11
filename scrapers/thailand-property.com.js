import puppeteer from 'puppeteer'
import randomUseragent from 'random-useragent'
import { saveDataToDb } from '../configs/db.js'

const baseUrl = 'https://www.thailand-property.com/properties-for-sale'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Function to simulate scrolling the page
const scrollToBottom = async (page) => {
	await page.evaluate(async () => {
		let scrollHeight = document.body.scrollHeight
		let scrollPosition = 0
		let distance = 200

		while (scrollPosition < scrollHeight) {
			window.scrollTo(0, scrollPosition)
			scrollPosition += distance
			await new Promise((resolve) => setTimeout(resolve, 300)) // Allow images to load
			scrollHeight = document.body.scrollHeight
		}
	})
}

// Function to scrape a page of properties
export const scrapePropertiesPage = async (page, url) => {
	try {
		console.log(`Scraping page ${url}`)
		await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
		await scrollToBottom(page)

		const properties = await page.evaluate(() => {
			const propertyElements = document.querySelectorAll('#search-results div.search-list')
			const properties = []

			propertyElements.forEach((element) => {
				try {
					const link = element.querySelector('.wrapper .left-block a')?.href || ''
					const title =
						element
							.querySelector('.wrapper .right-block .description-block h3.name')
							?.innerText.trim() || ''
					const price =
						element
							.querySelector('.wrapper .right-block .description-block .price')
							?.innerText.trim() || ''
					const type =
						element
							.querySelector('.wrapper .right-block .description-block .hidden-property-type')
							?.innerText.trim() || ''
					const location =
						element
							.querySelector('.wrapper .right-block .description-block .location small')
							?.innerText.replace(' , ', ', ')
							.trim() || ''
					const image = element.querySelector('.gallery .main-thumb img')?.src || ''
					const description =
						element
							.querySelector('.wrapper .right-block .description-block .description-text')
							?.innerText.trim() || ''

					const accommodationItems = element.querySelectorAll(
						'.wrapper .right-block .description-block .accommodation .list-inline li'
					)

					let bedrooms = ''
					let bathrooms = ''
					let propertySize = ''

					accommodationItems.forEach((item) => {
						const text = item.querySelector('span')?.innerText.trim() || ''
						const iconClass = item.querySelector('i')?.classList || []

						if (iconClass.contains('icon-bedroom')) {
							bedrooms = text
						} else if (iconClass.contains('icon-dp-icon-24')) {
							bathrooms = text
						} else if (iconClass.contains('icon-dp-icon-26')) {
							propertySize = text
						}
					})

					properties.push({
						title,
						type,
						price,
						bedrooms,
						bathrooms,
						propertySize,
						location,
						description,
						image,
						link: link ? link : `${baseUrl}${link}`,
					})
				} catch (err) {
					console.error('Error scraping individual property:', err)
				}
			})

			return properties
		})

		return properties
	} catch (error) {
		console.error(`Error scraping page ${url}:`, error)
		return []
	}
}

// Function to scrape properties from multiple pages
export const scrape = async () => {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()

	const userAgent = randomUseragent.getRandom()
	await page.setUserAgent(userAgent)

	let currentPage = 1
	let hasNextPage = true
	const allProperties = []
	let url = baseUrl

	while (hasNextPage) {
		const properties = await scrapePropertiesPage(page, url)

		if (properties.length > 0) {
			console.log(properties)
			allProperties.push(...properties)

			// Save to the database after each page
			await saveDataToDb(properties)

			try {
				const nextPageLink = await page.evaluate(() => {
					const nextButton = Array.from(document.querySelectorAll('.pagination a')).find(
						(btn) => btn.innerText === '»'
					)
					return nextButton ? nextButton.href : null
				})

				if (nextPageLink) {
					url = new URL(nextPageLink, baseUrl).href
					currentPage++
				} else {
					hasNextPage = false
				}
			} catch (err) {
				console.error(`Error fetching page ${url}:`, err)
				hasNextPage = false
			}
		} else {
			hasNextPage = false
		}

		await delay(Math.random() * 2000 + 1000)
	}

	await browser.close()
	console.log('Scraping complete!')
}
