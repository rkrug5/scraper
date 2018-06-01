const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const exphbs = require("express-handlebars");


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

var PORT = process.env.PORT || 3000;


// Initialize Express
const app = express();


// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));



// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/farkScraper", function (err) {
	console.log(err || 'CONNECTED!');
});



app.engine('handlebars', exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



// Routes
// ===========================================================

app.get("/", function (req, res) {
	db.Article.find(function (err, articles) {
		res.render("landing", { articles: articles });
	});
});

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
	// First, we grab the body of the html with request
	axios.get("http://www.fark.com/geek").then(function (response) {
		// Then, we load that into cheerio and save it to $ for a shorthand selector
		var $ = cheerio.load(response.data);

		// Now, we grab every h2 within an article tag, and do the following:
		$("td.headlineText .headline").each(function (i, element) {
			// Save an empty result object
			var result = {},
				headline = $(this);

			// Add the text and href of every link, and save them as properties of the result object
			result.title = headline.text();

			result.link = headline
				.children("a")
				.attr("href");

			//console.log(result);

			// Create a new Article using the `result` object built from scraping
			db.Article.create(result)
				.then(function (dbArticle) {
					// View the added result in the console
					console.log(dbArticle);
				})
				.catch(function (err) {
					// If an error occurred, send it to the client
					// return res.json(err);
				});
		});

		// If we were able to successfully scrape and save an Article, send a message to the client
		res.send("Scrape Complete");
	});
});

//listen for stuff, if not listening, then no use in having a server

app.listen(PORT, function () {
	console.log("App running on port " + PORT + "!");
});