var express = require('express');
var router = express.Router();
var request = require('request');
var noodle = require('noodlejs');

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

router.get('/last', function(req, res, next){

  const url = 'http://www.espn.com/nba/team/schedule/_/name/gs'
  var teams = [];
  var dates = [];
  var realDates = []
  const regex = /^[a-zA-Z]{3},\s[a-zA-Z]{3}\s[0-9]{1,2}/

  noodle.query({
    url:      url,
    selector: 'ul.game-schedule li.team-name',
    extract:  'text'
  })
  .then(function (results) {
    teams = results.results[0].results;
  });

   noodle.query({
      url:      url,
      selector: '.tablehead th, .tablehead td:first-child',
      extract:  'text'
    })
    .then(function (results) {
      dates = results.results[0].results;
      for (let i = 0; i < dates.length; i++){
        if (regex.exec(dates[i]) !== null) realDates.push(regex.exec(dates[i]))
      }
    var schedule = {};
    for (var i = 0; i < teams.length; i++){
      schedule[realDates[i]] = teams[i]
    }
    console.log(schedule)
    });
});

module.exports = router;