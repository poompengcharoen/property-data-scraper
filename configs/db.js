import dotenv from 'dotenv'
import mongoose from 'mongoose'

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' })

// MongoDB Schema for Property with unique constraint on 'link' and timestamps
const propertySchema = new mongoose.Schema(
	{
		title: String,
		type: String,
		price: String,
		bedrooms: String,
		bathrooms: String,
		propertySize: String,
		location: String,
		description: String,
		image: String,
		link: { type: String, unique: true }, // Enforce unique links
	},
	{
		timestamps: true, // Enable createdAt and updatedAt
	}
)

const Property = mongoose.model('Property', propertySchema)

// Connect to MongoDB using credentials from environment variables
export const connectDb = async () => {
	try {
		const dbUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?tls=true&authSource=admin&replicaSet=${process.env.DB_REPLICA_SET}`
		await mongoose.connect(dbUri)
		console.log('Connected to MongoDB')
	} catch (err) {
		console.error('Error connecting to MongoDB:', err)
	}
}

// Function to save data to MongoDB, avoiding duplicates by link and updating timestamp
export const saveDataToDb = async (data) => {
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
