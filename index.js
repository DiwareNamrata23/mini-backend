const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes"); // Ensure this file exists
const blogRouter = require('./routes/routes'); // Import your blog routes
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000' // Allow requests from your frontend origin
}));
app.use(express.json()); // Parse JSON bodies

// User routes
app.use('/users', userRouter); // Ensure userRouter is properly defined

// Blog routes
app.use("/api", blogRouter); // Use the blog routes under /api endpoint

// Web scraping logic for news
const getNews = async () => {
    try {
        // Set up the request headers
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
            }
        };

        // Scrape Yahoo Finance stock news
        const { data } = await axios.get('https://finance.yahoo.com/topic/stock-market-news', options);
        const $ = cheerio.load(data);

        const articles = [];

        // Update the selector to match the current HTML structure
        $('li.js-stream-content').each((index, element) => {
            const title = $(element).find('h3').text().trim();
            const url = $(element).find('a').attr('href');

            // Check if the URL is relative and prepend the base URL if needed
            const fullUrl = url && url.startsWith('/') ? `https://finance.yahoo.com${url}` : url;

            if (title && fullUrl) {
                articles.push({ title, url: fullUrl });
            }
        });

        console.log("Scraped articles:", articles); // Log the scraped articles
        return articles; // Return articles even if it's an empty array
    } catch (error) {
        console.error("Error while scraping news:", error);
        return []; // Return an empty array on error
    }
};


// News route
app.get('/news', async (req, res) => {
    const news = await getNews();
    res.json(news);
});

// Root route
app.get("/", (req, res) => {
    res.send("Market Mavericks Backend");
});

// MongoDB connection logic
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");

        // Start the server on successful MongoDB connection
        const PORT = process.env.PORT || 5001;
        app.listen(PORT, () => {
            console.log("Server started on port " + PORT);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

module.exports = app;
