
var axios = require("axios");
var db = require("../models");
var express = require("express");
var app = express();
var cheerio = require("cheerio");

  // Scrape route
  app.get("/scrape", function(req, res) {
    axios.get("http://www.sportingnews.com/us/nfl/news").then(function(response) {
      let $ = cheerio.load(response.data);
      $("article").each(function(i, element) {
        var result = {};

        result.title = $(this).children("div")
        .children("h3")
        .children("a").text();

        result.link = "http://www.sportingnews.com" + $(this).children("div")
        .children("h3")
        .children("a")
        .attr("href");

        result.image = $(this).children("figure")
        .children("a")
        .children("div")
        .children("img")
        .attr("src");

        // result.title = $(this).children("a").text();
        // result.link = "http://www.sportingnews.com" + $(this).children("a").attr("href");
        // result.image = $(this).map("img").attr("src")

        console.log(result);

        db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
      });
      res.json("/");
    });
  });

  // Get saved articles
  app.get("/articles/savedArticles", function(req, res){
    db.Article.find({
      saved: true
    })
    .then(function(dbSavedArticles){
      res.json(dbSavedArticles);
    })
  });

  // Save articles
  app.post("/articles/saveOneArticle/:id", function(req, res){
    db.Article.findByIdAndUpdate(req.params.id, { saved: true })
    .then(function(dbSavedArticle){
      res.json(dbSavedArticle);
    })
    .catch(function(err){
      res.json(err);
    })
  });
  
  // Get articles for main page.
  app.get("/articles", function(req, res) {
    db.Article.find({
      saved: false
    })
    .then(function(dbArticles){
      res.json(dbArticles);
    })
  });
  
  // get notes from db and populate for this ID
  app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id})
    .populate("note")
    .then(function(dbArticles){
      res.json(dbArticles)
    })
  });
  
  // update article on DB with note ID
  app.post("/notes/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findByIdAndUpdate(req.params.id, { note: dbNote._id });
      })
      .then(function(dbArticle){
        res.json(dbArticle);
      })
      .catch(function(err){
        res.json(err);
      })
  });

  // delete note for article
  app.delete("/notes/:id", function(req, res) {
    db.Note.deleteOne(req.body)
    .then(function(dbNote){
      return db.Article.findByIdAndUpdate(req.params.id, { note: dbNote._id });
    })
    .then(function(deleted){
      res.json(deleted);
    })
    .catch(function(err){
      res.json(err);
    })
  });

  // Delete one article from DB.
  app.delete("/articles/deleteOne/:id", function(req, res){
    db.Article.findByIdAndDelete({_id: req.params.id})
    .then(function(deleted){
      res.json(deleted);
    })
    .catch(function(err){
      res.json(err);
    })
  })


  // Delete all articles except saved articles from DB.
  app.delete("/articles/deleteAll", function(req, res){
    db.Article.deleteMany({ saved: false })
    .then(function(deleted){
      res.json(deleted);
    })
    .catch(function(err){
      res.json(err);
    })
  })

module.exports = app;