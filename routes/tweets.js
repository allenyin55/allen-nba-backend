var express = require('express');
var router = express.Router();
var Twit = require('twit')
var moment = require('moment-timezone');

var T = new Twit({
  consumer_key:         'Bvdf4QA3YxErvKm7KoKh7Ry45',
  consumer_secret:      'Y9GWK7UVQVRs6QJrfSHAIrBUtWvDQ9gae6NGEjD6IbusdjlcWo',
  access_token:         '4688225935-EGOLweymzJhYFZJHeEro3N2qJcK2yMSFtijGvzO',
  access_token_secret:  '1m4Sqbk6hhUl2Gb9ep70rmkUbN3lpIFlJxWo4ako3bl4g',
})

router.get('/', function(req, res, next) {
  T.get('statuses/user_timeline', { screen_name: "warriors" }, function(err, data, response) {
    const rawTweets = data.slice(0, 6);
    let tweetsArr = [];
    rawTweets.forEach((tweet) => {
      let aTweet = {profile_image: tweet.user.profile_image_url_https, 
                    name: tweet.user.name,
                    created_at: moment.tz(tweet.created_at, "America/Los_Angeles").format(),
                    text: tweet.text,
                    image: (tweet.extended_entities) ? tweet.extended_entities.media[0].media_url_https : "",
                    size: (tweet.extended_entities) ? tweet.extended_entities.media[0].sizes.small : ""
                  }
      tweetsArr.push(aTweet);
    });
    res.send(tweetsArr)
})
});

module.exports = router;