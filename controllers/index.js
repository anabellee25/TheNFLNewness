var express = require('express');
var router = express.Router();
var Article = require('../models/Article');


//root
router.get('/', function(req, res) {
    Article.find({})
    .where('saved').equals(false)
    .where('deleted').equals(false)
    .sort('-date')
    .limit(15)
    .exec(function(error, articles) {
        if (error) {
            console.log(error);
            res.status(500);
        } else {
            console.log(articles);
            var object = {
                title: "All The NFL Newness That's Fit To Scrape",
                subtitle: "Hacker News Edition",
                articles: articles
            };
            res.render('index', object);
        }
    });
});

// render the saved articles

router.get('/saved', function(req, res) {
    Article.find({})
    .where('saved').equals(true)
    .where('deleted').equals(false)
    .populate('Notes')
    .sort('-date')
    .limit(15)
    .exec(function(error, articles) {
        if (error) {
            console.log(error);
            res.status(500);
        } else {
            console.log(articles);
            var object = {
                title: "All The NFL Newness That's Fit To Scrape",
                subtitle: "Hacker News Edition",
                articles: articles
            };
            res.render("saved", object);
        };
    });
});

router.use('/api', require('./api-routes'));

module.exports = router;