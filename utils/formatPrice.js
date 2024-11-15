const formatPrice = (priceString) => {
	if (!priceString) return null

	// Match the first numeric value in the string
	const numericMatch = priceString.match(/[\d,]+(\.\d+)?/)
	if (!numericMatch) return null

	// Parse the matched numeric value
	const priceNumeric = parseFloat(numericMatch[0].replace(/,/g, ''))

	const currencyMap = {
		THB: ['฿', 'THB'],
		USD: ['$', 'USD'],
		EUR: ['€', 'EUR'],
		GBP: ['£', 'GBP'],
		JPY: ['¥', 'JPY'],
		AUD: ['$', 'AUD'],
		CAD: ['$', 'CAD'],
		CHF: ['CHF', 'CHF'],
		CNY: ['¥', 'CNY'],
		DKK: ['kr', 'DKK'],
		HKD: ['$', 'HKD'],
		IDR: ['Rp', 'IDR'],
		INR: ['₹', 'INR'],
		KRW: ['₩', 'KRW'],
		MXN: ['$', 'MXN'],
		MYR: ['RM', 'MYR'],
		NOK: ['kr', 'NOK'],
		NZD: ['$', 'NZD'],
		PHP: ['₱', 'PHP'],
		PLN: ['zł', 'PLN'],
		SGD: ['$', 'SGD'],
		ZAR: ['R', 'ZAR'],
		SEK: ['kr', 'SEK'],
		TWD: ['$', 'TWD'],
		VND: ['₫', 'VND'],
		BRL: ['R$', 'BRL'],
		RUB: ['₽', 'RUB'],
		TRY: ['₺', 'TRY'],
	}

	let currencyCode = null

	// First, prioritize explicit currency codes in the string
	for (const [key, values] of Object.entries(currencyMap)) {
		if (values.some((value) => priceString.includes(value) && value !== '$')) {
			currencyCode = key
			break
		}
	}

	// If no explicit currency code is found, check for ambiguous symbols (e.g., $)
	if (!currencyCode) {
		for (const [key, values] of Object.entries(currencyMap)) {
			if (values.includes('$') && priceString.includes('$')) {
				currencyCode = key
				break
			}
		}
	}

	// Return null if no currency code is found
	if (!currencyCode) return null

	return {
		priceNumeric,
		currencyCode,
	}
}

export default formatPrice
