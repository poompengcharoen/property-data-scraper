# Property Data Scraper

This project is a Node.js-based web scraper designed to collect property listing data and save it to a MongoDB database. Using Puppeteer for browser automation, this scraper captures detailed information on available properties, stores it in MongoDB, and enforces a unique constraint on each listing to avoid duplicate entries.

## Features

- **Automated Web Scraping**: Collects property data including title, price, type, location, size, and images.
- **Duplicate Handling**: Prevents duplicate entries by enforcing unique constraints on property URLs.
- **Pagination Support**: Automatically navigates through multiple pages to collect data from all available listings.
- **MongoDB Integration**: Saves data directly to a MongoDB database, using environment variables for credentials.
- **Randomized User Agent**: Uses randomized user agents to simulate different browsers and avoid detection.
- **Automated Scheduling with `node-cron`**: Schedule periodic scraping tasks to keep the database updated.

## Project Structure

- **app.js**: The main entry point. Connects to MongoDB, initiates the scraping process, and sets up the cron schedule.
- **configs/db.js**: Handles MongoDB configuration, schema definition, and data-saving functions.
- **scrapers/**: Contains the scraping scripts for logic, including page navigation, data extraction, and pagination.
- **utils/**: Contains the main scraping logics and page handlers.

## Requirements

- **Node.js** (v16 or higher recommended)
- **MongoDB** instance (local or cloud-based)
- Environment variables for MongoDB credentials (see setup instructions below)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/poompengcharoen/property-data-scraper.git
   cd property-data-scraper
   ```

2. **Install dependencies**:

   ```bash
   yarn
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory with the following variables:
   ```plaintext
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=your_db_host
   DB_NAME=your_db_name
   DB_REPLICA_SET=your_replica_set
   ```
4. **Run the scraper**:
   ```bash
   yarn start
   ```

## Usage

To run the scraper manually, simply execute:

```bash
yarn start
```

This will connect to MongoDB, initiate the scraping process, and save the data to the database.

### Automated Scheduling with `node-cron`

This project uses `node-cron` to automate scraping at regular intervals. By default, it is set up in `app.js` to run every hour. To customize the interval:

1. **Open `app.js`** and locate the cron schedule line:

   ```javascript
   cron.schedule('0 * * * *', () => { ... });
   ```

   The schedule `'0 * * * *'` will run the scraping process at the start of every hour. Modify this cron expression as needed to set your desired interval (e.g., every day, every 15 minutes).

2. **Run the scraper**:
   ```bash
   yarn start
   ```
   This will start the application, connect to MongoDB, and set up the cron job.

## MongoDB Schema

Each property entry is saved with the following fields:

- **`title`**: The title of the property listing.
- **`type`**: Type of property (e.g., Condo, House).
- **`price`**: Original price string.
- **`priceNumeric`**: Extracted numerical price.
- **`currencyCode`**: Currency of the price (e.g., THB, USD).
- **`bedrooms`**, **`bathrooms`**: Number of bedrooms and bathrooms.
- **`propertySize`**: Size of the property.
- **`location`**: Location of the property.
- **`description`**: A brief description of the property.
- **`keywords`**: Keywords generated for the property.
- **`link`**: Unique URL for the property listing.

## Error Handling

- **Duplicate Entries**: The `link` field is enforced as unique in MongoDB to prevent duplicate entries. Existing entries will be updated with the latest timestamp.
- **Connection Errors**: Handles MongoDB connection issues, logging errors if the connection fails.

## Dependencies

- **dotenv**: For managing environment variables.
- **mongoose**: For MongoDB object modeling.
- **puppeteer**: For headless browser automation.
- **random-useragent**: For rotating user agents to avoid detection.
- **node-cron**: For scheduling periodic scraping tasks.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add a new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Special thanks to [Puppeteer](https://pptr.dev/) and [Mongoose](https://mongoosejs.com/) for making this project possible.
- Property data sourced from [thailand-property.com](https://www.thailand-property.com/).

## Contact

For questions or support, please open an issue or contact [poom.pengcharoen@gmail.com].
