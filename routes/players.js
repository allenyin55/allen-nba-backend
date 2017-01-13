var express = require('express');
var router = express.Router();
var players = require('../data/players.json');
var db_players = require('../model/players');

var allPlayers = {
    players: players
};

db_players.collection.insert(players, function (err, result) {
    if(err)
        console.log(err);
    else
        console.log('success');
});

router.post('/', function(req, res, next) {
    var regex = new RegExp("^" + req.body.name + "$", "i");
    db_players.findOne({name: regex},function (err, result) {
        if (err) return console.error(err);
        res.send(result);
    });
});

module.exports = router;
