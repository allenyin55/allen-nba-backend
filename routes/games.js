var express = require('express');
var router = express.Router();
var request = require('request');
var noodle = require('noodlejs');

const d = new Date();
var month = "";
var day = ""
var year = d.getFullYear().toString();
var currentMonth = d.getMonth()+1;

//format date into "20170404"
function formatDate(month, day){
  month = (month < 10) ? "0" + month.toString() : month.toString();
  day = (day < 10) ? "0" + day.toString() : day.toString();

  return month+day;
}

var date = year+formatDate(currentMonth, d.getDate());

var mapMonth = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4, 
  May: 5,
  Jun: 6, 
  Jul: 7, 
  Aug: 8, 
  Sep: 9, 
  Oct: 10,
  Nov: 11,
  Dec: 12
}

function getTeams(url){
  return noodle.query({
    url:      url,
    selector: 'ul.game-schedule li.team-name',
    extract:  'text'
  })
  .then(function (results) {
    return results.results[0].results;
  })
}

function getGameDates(url){
  return noodle.query({
    url:      url,
    selector: '.tablehead th, .tablehead td:first-child',
    extract:  'text'
  })
  .then(function (results) {
    return results.results[0].results;
  })
}

function getSchedule(){
  const url = 'http://www.espn.com/nba/team/schedule/_/name/gs'
  const regex = /^[a-zA-Z]{3},\s[a-zA-Z]{3}\s[0-9]{1,2}/;
  var realDates = [];
  var schedule = {};

  return getTeams(url)
  .then((teams) => {
    return getGameDates(url)
    .then((dates) => {
      for (let i = 0; i < dates.length; i++){
        if (regex.exec(dates[i]) !== null) realDates.push(regex.exec(dates[i]))
      }
      for (var i = 0; i < teams.length; i++){
        schedule[realDates[i]] = teams[i]
      }
      return schedule;
    })
  })
  .fail((err) => {
    console.log(err.message)
  })
}

function getNumSchedule(schedule){
  let numSchedule = [];
  Object.keys(schedule).forEach(key => {
    let theDate = formatDate(mapMonth[key.substring(5, 8)], parseInt(key.substring(9)));
    let lastYear = (parseInt(year)-1).toString()
    let aGame = {};
    if (mapMonth[key.substring(5, 8)] > 6 ){
      aGame[lastYear+theDate] = schedule[key];
      numSchedule.push(aGame);
    }  
    else{
      aGame[year+theDate] = schedule[key];
      numSchedule.push(aGame);
    }
  });
  return numSchedule;
}

function getLastGameDate(date, schedule){
 for (let i = 0; i < schedule.length; i++){
    let thisDate = Object.keys(schedule[i])[0];
    let nextDate = Object.keys(schedule[i+1])[0]
    if (thisDate < date && nextDate >= date) return thisDate;
  }
}

function getNextGameDate(date, schedule){
  for (let i = 0; i < schedule.length; i++){
    let thisDate = Object.keys(schedule[i])[0];
    let nextDate = Object.keys(schedule[i+1])[0]
    if (thisDate <= date && nextDate > date) return nextDate;
  }
}

router.get('/', function(req, res, next) {
    request.get({url: "http://data.nba.com/data/5s/json/cms/noseason/scoreboard/"+date+"/games.json"}, function (err, response, body) {
        res.send(JSON.parse(body).sports_content.games.game);
    })
});

router.get('/last', function(req, res, next){

    getSchedule().then((schedule)=>{
      if (schedule){
        const numSchedule =  getNumSchedule(schedule);
        const lastGameDate = getLastGameDate(date, numSchedule);
        if (lastGameDate){
          request.get({url: "http://data.nba.com/data/5s/json/cms/noseason/scoreboard/"+lastGameDate+"/games.json"}, function (err, response, body) {
            res.send(JSON.parse(body).sports_content.games.game);
        })
        }
        else res.send("Bug in games.js backend!")
      }
    })
});

router.get('/next', function(req, res, next){
  getSchedule().then((schedule)=>{
      if (schedule){
        const numSchedule =  getNumSchedule(schedule);
        const nextGameDate = getNextGameDate(date, numSchedule);
        if (nextGameDate){
          request.get({url: "http://data.nba.com/data/5s/json/cms/noseason/scoreboard/"+nextGameDate+"/games.json"}, function (err, response, body) {
            res.send(JSON.parse(body).sports_content.games.game);
        })
        }
        else res.send("Bug in games.js backend!")
      }
    })
})

module.exports = router;