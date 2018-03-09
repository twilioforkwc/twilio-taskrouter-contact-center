const express = require('express');
const router = express.Router();

const Twilio = require('twilio');
const config = require('./config');
const nameGenerator = require('./name_generator');

// Access Token used for Video, IP Messaging, and Sync
const AccessToken = Twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;
const VideoGrant = AccessToken.VideoGrant;
const SyncGrant = AccessToken.SyncGrant;


router.get('/generate/:sid', function (req, res, next) {
    const identity = req.params.sid;
    // res.send(config.TWILIO_ACCOUNT_SID);
    // Create an access token which we will sign and return to the client
    const token = new AccessToken(
        config.TWILIO_ACCOUNT_SID,
        config.TWILIO_API_KEY,
        config.TWILIO_API_SECRET
    );

    // Assign the provided identity or generate a new one
    // token.identity = identity || nameGenerator();
    token.identity = req.params.sid;

    // Grant the access token Twilio Video capabilities
    const videoGrant = new VideoGrant();
    token.addGrant(videoGrant);

    if (config.TWILIO_CHAT_SERVICE_SID) {
        // Create a "grant" which enables a client to use IPM as a given user,
        // on a given device
        const chatGrant = new ChatGrant({
            serviceSid: config.TWILIO_CHAT_SERVICE_SID
        });
        token.addGrant(chatGrant);
    }

    if (config.TWILIO_SYNC_SERVICE_SID) {
        // Point to a particular Sync service, or use the account default to
        // interact directly with Functions.
        const syncGrant = new SyncGrant({
            serviceSid: config.TWILIO_SYNC_SERVICE_SID || 'default'
        });
        token.addGrant(syncGrant);
    }
    // res.send('test');
    // console.log(token);

    // Serialize the token to a JWT string and include it in a JSON response
    // return {
    //     identity: token.identity,
    //     token: token.toJwt()
    // };
    res.send({
        identity: token.identity,
        token: token.toJwt()
    });

});

module.exports = router;
