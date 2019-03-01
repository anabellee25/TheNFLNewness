var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var Article = require("../../models/Article");
var Note = require("../../models/Note");



router.get("/scrape", function(req, res) {
    axios.get("http://www.sportingnews.com/us/nfl/news").then(function(response) {
        var $ = cheerio.load(response.data);

        var newArticle = [];

        $("article h3").each(function(i, element) {
            var result = {};

            result.title = $(this).children("a").text();
            result.link = "http://www.sportingnews.com" + $(this).children("a").attr("href");

            // console.log(result);

            db.Article.create(result).then(function(dbArticle) {
                console.log(dbArticle);
            }).catch(function(err) {
                console.log(err);

                newArticle.push(result);
            });
        });
        // res.send("Scrape Complete!")
        console.log(newArticle);
        res.render("index", {plans: newArticle});
    });
});