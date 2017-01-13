// Load mongoose package
var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/players';
// Connect to MongoDB and create/use database called todoAppTest
mongoose.connect(url);
// Create a schema
var PlayerSchema = new mongoose.Schema({
    players: [{
        name: String,
        personId: String
    }]
});
// Create a model based on the schema
module.exports = mongoose.model('Player', PlayerSchema);

/*
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        //HURRAY!! We are connected. :)
        console.log('Connection established to', url);

        // do some work here with the database.
        var collection = db.collection('players');


        collection.insertMany(players, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('success');
            }
        });

        collection.findOne({name:"James Harden"}, function (err, result) {
            if (err) {
                console.log(err);
            } else if (result.length) {
                console.log('Found:', result);
            } else {
                console.log('No document(s) found with defined "find" criteria!');
            }
        });

        //Close connection
        db.close();
    }
});

*/
