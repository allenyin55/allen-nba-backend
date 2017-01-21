var express = require('express');
var router = express.Router();
var players = require('../data/players.json');
var db_players = require('../model/players');
var request = require('request');
var http = require('http')


//uncomment this when needs to add players to the database
/*db_players.collection.insert(players, function (err, result) {
    if(err)
        console.log(err);
    else
        console.log('success');
});*/

router.post('/', function(req, res, next) {
    var regex = new RegExp("^" + req.body.name + "$", "i");
    db_players.findOne({name: regex},function (err, result) {
      if (err) return console.error(err);
      var personId = JSON.parse(JSON.stringify(result)).personId;
      var url = "http://stats.nba.com/stats/commonplayerinfo/?PlayerID="+personId;
      var t1 = new Date();
      var options = {
        url: 'http://stats.nba.com/stats/commonplayerinfo/?PlayerID=201935',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Mobile Safari/537.36',
          Connection: 'keep-alive'
        }
      };
      request.get(options, function (error, response, body) {
        var t2 = new Date();
        if (!error && response.statusCode == 200) {
          console.log(t2.getTime()-t1.getTime());
          res.send(body)
        }
      });
    });
});

module.exports = router;
