// Simulate scrolling to the bottom of the page with delay
const scrollToBottom = async (page, scrollDelay) => {
	await page.evaluate(async (scrollDelay) => {
		let scrollHeight = document.body.scrollHeight
		let scrollPosition = 0
		const distance = 200

		while (scrollPosition < scrollHeight) {
			window.scrollTo(0, scrollPosition)
			scrollPosition += distance
			await new Promise((resolve) => setTimeout(resolve, scrollDelay)) // Allow images to load
			scrollHeight = document.body.scrollHeight
		}
	}, scrollDelay)
}

export default scrollToBottom
