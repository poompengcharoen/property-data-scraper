import sample from 'lodash/sample.js'

export const NAME = 'Thailand Property'
export const BASE_URLS = ['https://www.thailand-property.com/properties-for-sale']
export const BASE_URL = sample(BASE_URLS)
export const PAGE_LOAD_TIMEOUT = 60000
export const SCROLL_DELAY = 300
export const NAVIGATION_DELAY = 1000

// Extracts property details from a page
export const extractProperties = () => {
	const properties = []
	const propertyElements = document.querySelectorAll('#search-results div.search-list')

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
			let bedrooms = '',
				bathrooms = '',
				propertySize = ''

			accommodationItems.forEach((item) => {
				const text = item.querySelector('span')?.innerText.trim() || ''
				const iconClass = item.querySelector('i')?.classList || []

				if (iconClass.contains('icon-bedroom')) bedrooms = text
				else if (iconClass.contains('icon-dp-icon-24')) bathrooms = text
				else if (iconClass.contains('icon-dp-icon-26')) propertySize = text
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
		const nextButton = Array.from(document.querySelectorAll('.pagination a')).find(
			(btn) => btn.innerText === '»'
		)
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
