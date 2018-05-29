const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
// const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = 3000;

// Initialize Express
const app = express();



// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

const exphbs = require("express-handlebars");


app.engine('handlebars', exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



// Routes
// ===========================================================

app.get("/", function (req, res) {
	res.render("landing");
});





app.listen(PORT, function () {
	console.log("App running on port " + PORT + "!");

	app.get("/", function (req, res) {
		res.render("landing");
	});
});