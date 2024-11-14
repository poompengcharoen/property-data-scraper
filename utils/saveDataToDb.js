import Property from '../models/property.js'

// Function to save data to MongoDB, avoiding duplicates by link and updating timestamp
const saveDataToDb = async (data) => {
	try {
		for (const property of data) {
			await Property.updateOne(
				{ link: property.link }, // Find document by link
				{
					$setOnInsert: property, // Insert only if it doesn’t already exist
					$set: { updatedAt: new Date() }, // Update the timestamp if it exists
				},
				{ upsert: true } // Insert if not found, otherwise update timestamp
			)
		}
		console.log('Properties saved to database')
	} catch (err) {
		console.error('Error saving properties to database:', err)
	}
}

export default saveDataToDb
