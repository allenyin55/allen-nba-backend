var express = require('express');
var router = express.Router();
var request = require('request');

var d = new Date();
var year = 0;
var currentYear = d.getFullYear();
var currentMonth = d.getMonth() + 1;

if(currentMonth>10) year = currentYear;
else if(currentMonth<7) year = currentYear-1;


router.get('/', function(req, res, next) {
    request.get({url: "http://data.nba.com/data/json/cms/"+year+"/league/standings.json"}, function (err, response, body) {
        res.send(JSON.parse(body).sports_content.standings.team);
    })
});

module.exports = router;