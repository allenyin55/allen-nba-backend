var express = require('express');
var router = express.Router();
var request = require('request');

const d = new Date();
var month = '';
var day = ""
var currentMonth = (d.getMonth()+1).toString();

if((d.getMonth()+1)<10){
    month = "0"+currentMonth
}
else month = currentMonth;

day  = (d.getDate() < 10) ? "0"+ d.getDate().toString() : d.getDate().toString();

var date = d.getFullYear().toString()+month+day;


router.get('/', function(req, res, next) {
    request.get({url: "http://data.nba.com/data/5s/json/cms/noseason/scoreboard/"+date+"/games.json"}, function (err, response, body) {
        res.send(JSON.parse(body).sports_content.games.game);
    })
});

module.exports = router;