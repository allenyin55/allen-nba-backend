var express = require('express');
var router = express.Router();
var players = require('../data/players.json');
var db_players = require('../model/players');
var request = require('request')


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
        request.get({url: url}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send(body)
            }
        });
    });
});

module.exports = router;
