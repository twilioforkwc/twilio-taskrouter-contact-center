const express = require('express');
const router = express.Router();

const config = require('./config');

const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;
const twimlAppSid = config.TWILIO_TWIML_APP_SID;
const ClientCapability = require('twilio').jwt.ClientCapability;

/**
 * トークン生成
 */
router.get('/generateToken/:sid', function (req, res, next) {
    const identity = req.params.sid;
    // res.send('test'+authToken);
    const capability = new ClientCapability({
        accountSid: accountSid,
        authToken: authToken,
    });

    capability.addScope(new ClientCapability.IncomingClientScope(identity));
    capability.addScope(new ClientCapability.OutgoingClientScope({
        applicationSid: twimlAppSid,
        clientName: identity,
    }));

    // Include identity and token in a JSON response
    res.send({
        identity: identity,
        token: capability.toJwt(),
    });
});

module.exports = router;
