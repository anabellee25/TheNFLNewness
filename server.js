var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

// scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");
var PORT = 3700;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
// Make public a static folder
app.use(express.static("public"));

//handlebars below
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(require('./controllers'));

// Connect to the Mongo DB

mongoose.Promise = Promise;
const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/theNFLNewness";

mongoose.connect(dbURI, { useNewUrlParser: true });

var db = mongoose.connection;
db.on("error", function(error) {
    console.log("Mongoose error: ", error)
});

db.once("open", function() {
    console.log("Connection to the Mogods successful")
    app.listen(PORT, function() {
        console.log("App running on http://localhost:"+ PORT);
      });
});

module.exports(app);

//scraping the site for articles and posting them to the db
// app.get("/", function(req, res) {
//     axios.get("http://www.sportingnews.com/us/nfl/news").then(function(response) {
//         var $ = cheerio.load(response.data);

//         var newArticle = [];

//         $("article h3").each(function(i, element) {
//             var result = {};

//             result.title = $(this).children("a").text();
//             result.link = "http://www.sportingnews.com" + $(this).children("a").attr("href");

//             // console.log(result);

//             db.Article.create(result).then(function(dbArticle) {
//                 console.log(dbArticle);
//             }).catch(function(err) {
//                 console.log(err);

//                 newArticle.push(result);
//             });
//         });
//         // res.send("Scrape Complete!")
//         console.log(newArticle);
//         res.render("index", {plans: newArticle});
//     });
// });



// getting all articles from the db
// app.get("/articles", function(req, res) {
//     db.Article.find({}).then(function(dbArticle) {
//         res.json(dbArticle);
//     }).catch(function (err) {
//         res.json(err);
//     });
// });

// //getting articles by id
// app.get("/articles/:id", function(req, res) {
//     db.Article.findOne({_id: req.params.id})
//     .populate("note")
//     .then(function(dbArticle) {
//         res.json(dbArticle);
//     }).catch(function(err) {
//         res.json(err)
//     });
// });

// //updating or posting a note associated with the article.
// app.post("articles/:id", function(req, res) {
//     db.Note.create(req.body).then(function(dbNote){
//         return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
//     }).then(function(dbArticle){
//         res.json(dbArticle);
//     }).catch(function(err) {
//         res.json(err);
//     });
// });


app.listen(PORT, function() {
    console.log("App running on http://localhost:"+ PORT);
  });