const express = require('express');
const router = express.Router();

require('dotenv').config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twimlAppSid= process.env.TWIML_APP_SID;
const ClientCapability = require('twilio').jwt.ClientCapability;

/**
 * トークン生成
 */
router.get('/generateToken/:sid', function (req, res, next) {
    const identity = req.params.sid;
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
