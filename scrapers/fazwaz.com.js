export const BASE_URL = 'https://www.fazwaz.com/property-for-sale/thailand'
export const PAGE_LOAD_TIMEOUT = 60000
export const SCROLL_DELAY = 300
export const NAVIGATION_DELAY = 1000

// Extracts property details from a page
export const extractProperties = () => {
	const properties = []
	const propertyElements = document.querySelectorAll(
		'.result-search__row .loaded .result-search__item'
	)

	propertyElements.forEach((element) => {
		try {
			const link = element.querySelector('.link-unit')?.href || ''
			const title =
				element
					.querySelector('.result-search__item__description .unit-info__description-title')
					?.innerText.trim() || ''
			const price =
				element.querySelector('.result-search__item__description .price-tag')?.innerText.trim() ||
				''
			const type = element.querySelector('.wrap-icon-info .i-7')
				? 'Villa'
				: element.querySelector('.wrap-icon-info .i-6')
				? 'House'
				: element.querySelector('.wrap-icon-info .i-10')
				? 'Townhouse'
				: element.querySelector('.wrap-icon-info .i-12')
				? 'Land'
				: element.querySelector('.wrap-icon-info .i-8')
				? 'Condo'
				: ''
			const location =
				element
					.querySelector('.result-search__item__description .location-unit')
					?.innerText.trim() || ''
			const image =
				element.querySelector('.result-search__item__slide img.main-gallery-img')?.src || ''
			const description =
				element
					.querySelector('.result-search__item__description .unit-info__shot-description')
					?.innerText.trim() || ''

			// Extract bedroom, bathroom, and property size information
			const bedrooms = element.querySelector('.i-bed')?.nextSibling?.nodeValue.trim() || ''
			const bathrooms = element.querySelector('.i-bath')?.nextSibling?.nodeValue.trim() || ''
			const propertySize =
				element
					.querySelector('.i-size')
					?.parentNode?.querySelector('span.area-tooltip')
					?.textContent.trim() || ''

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
	BASE_URL,
	PAGE_LOAD_TIMEOUT,
	SCROLL_DELAY,
	NAVIGATION_DELAY,
	extractProperties,
	getNextPageUrl,
}
