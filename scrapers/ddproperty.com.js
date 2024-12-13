import sample from 'lodash/sample.js'

export const NAME = 'DDproperty'
export const BASE_URLS = [
	'https://www.ddproperty.com/en/property-for-sale',
	'https://www.ddproperty.com/en/property-for-rent',
]
export const BASE_URL = sample(BASE_URLS)
export const PAGE_LOAD_TIMEOUT = 60000
export const SCROLL_DELAY = 300
export const NAVIGATION_DELAY = 1000

// Extracts property details from a page
export const extractProperties = () => {
	const properties = []
	const propertyElements = document.querySelectorAll('.listing-widget-new .listing-card')

	propertyElements.forEach((element) => {
		try {
			const link = element.querySelector('.nav-link')?.href || ''
			const title = element.querySelector('.nav-link')?.innerText.trim() || ''
			const price = element.querySelector('.list-price')?.innerText.trim() || ''
			let type = element.querySelector('.listing-property-type')?.innerText.trim() || ''

			if (/house/i.test(type)) {
				type = 'House'
			} else if (/villa/i.test(type)) {
				type = 'Villa'
			} else if (/townhouse/i.test(type)) {
				type = 'Townhouse'
			} else if (/land/i.test(type)) {
				type = 'Land'
			} else if (/condo/i.test(type)) {
				type = 'Condo'
			}

			const location = element.querySelector('.listing-location')?.innerText.trim() || ''
			const image = element.querySelector('.image-container ul li:nth-child(1) img')?.src || ''
			const description = element.querySelector('.listing-property-type')?.innerText.trim() || ''

			// Extract bedroom, bathroom, and property size information
			const bedrooms = element.querySelector('.bed')?.innerText.trim() || ''
			const bathrooms = element.querySelector('.bath')?.innerText.trim() || ''
			const propertySize = element.querySelector('.listing-floorarea')?.innerText.trim() || ''

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
				link: link || `${BASE_URL}${link}`,
			})
		} catch (err) {
			console.error('Error scraping individual property:', err)
		}
	})

	return properties
}

// Fetch the URL of the next page if it exists
export const getNextPageUrl = async (page) => {
	return await page.evaluate(() => {
		const nextButton = document.querySelector('a[aria-label="Next"]')
		return nextButton ? nextButton.href : null
	})
}

export default {
	NAME,
	BASE_URLS,
	BASE_URL,
	PAGE_LOAD_TIMEOUT,
	SCROLL_DELAY,
	NAVIGATION_DELAY,
	extractProperties,
	getNextPageUrl,
}
