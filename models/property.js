import mongoose from 'mongoose'

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

export default Property
