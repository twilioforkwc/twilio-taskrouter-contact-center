const express = require('express');
const router = express.Router();

// require('dotenv').config();

// const accountSid = process.env.ACCOUNT_SID;
// const authToken = process.env.AUTH_TOKEN;
// const workspaceSid = process.env.WORKSPACE_SID;
const VoiceResponse = require('twilio').twiml.VoiceResponse;

/**
 * IVR voice response url.
 */
router.get('/voices/ivr', function (req, res, next) {
    // res.header('Content-Type', 'application/json; charset=utf-8')
    const response = new VoiceResponse();
    const gather = response.gather({
        input: 'speech dtmf',
        timeout: 3,
        numDigits: 1,
    });
    gather.say('Please press 1 or say sales for sales.');

    res.send(response.toString());
});

/**
 * IVR voice response url.
 */
router.post('/voices/ivr', function (req, res, next) {
    res.header('Content-Type', 'application/xml; charset=utf-8')
    const response = new VoiceResponse();
    const gather = response.gather({
        input: 'speech dtmf',
        timeout: 3,
        numDigits: 1,
    });
    gather.say({language: 'es'}, 'Para Español oprime el uno.');
    gather.say({language: 'en'}, 'For English, please hold or press two.');

    res.send(response.toString());
});

/**
 * IVR voice response url.
 */
router.post('/voices/enqueuecall', function (req, res, next) {
    res.header('Content-Type', 'application/xml; charset=utf-8')

    var digit_pressed = req.params.Digits;
    var language = "jp";

    if (digit_pressed == '1') {
        language = "es";
    } else {
        language = "en";
    }

    const response = new VoiceResponse();
    const task = '<Task>{"selected_language": "'+language+'"}</Task>';
    response.enqueue({
        workflowSid: 'WW0123401234...'
    }, task);

    res.send(response.toString());
});

// /**
//  * Worker詳細API
//  */
// router.get('/show/:sid', function (req, res, next) {
//     // Request Twioio API.
//     try {
//         client.taskrouter.v1
//             .workspaces(workspaceSid)
//             .workers(req.params.sid)
//             .fetch()
//             .then(worker => {
//                 res.send({
//                     status: "OK",
//                     friendlyName: worker.friendlyName,
//                     activityName: worker.activityName,
//                     attributes: worker.attributes
//                 });
//             });
//     } catch (error) {
//         res.send({ status: "NG" });
//     }
// });

// /**
//  * Worker追加API
//  */
// router.post('/create', function (req, res, next) {
//     // Parse json text.
//     paramsJson = parseRequestParameter(req);

//     // Request Twioio API.
//     try {
//         client.taskrouter.v1.workspaces(workspaceSid).workers.create({
//             friendlyName: paramsJson.name,
//             activityName: paramsJson.activity,
//             attributes: paramsJson.attributes,
//         }).then(reseult => {
//             res.send({ status: "OK" });
//         });
//     } catch (error) {
//         res.send({ status: "NG" });
//     }
// });

// /**
//  * Worker更新API
//  */
// router.put('/update', function (req, res, next) {
//     // Parse json text.
//     paramsJson = parseRequestParameter(req);
//     // Request Twioio API.
//     try {
//         client.taskrouter.v1
//             .workspaces(workspaceSid)
//             .workers(paramsJson.sid)
//             .update({
//                 friendlyName: paramsJson.name,
//                 activityName: paramsJson.activity,
//                 attributes: paramsJson.attributes
//             })
//             .then(
//                 worker =>
//                 {
//                     res.send({ status: "OK" });
//                 }
//             );
//     } catch (error) {
//         console.log(error);
//         res.send({ status: "NG" });
//     }
// });

// /**
//  * Worker削除API
//  */
// router.delete('/:sid', function (req, res, next) {
//     // Request Twioio API.
//     try {
//         client.taskrouter.v1
//             .workspaces(workspaceSid)
//             .workers(req.params.sid)
//             .remove();
//         res.send({ status: "OK" });
//     } catch (error) {
//         console.log(error);
//         res.send({ status: "NG" });
//     }
// });

function parseRequestParameter (req) {
    // GET Request parameters.
    var obj = req.body;
    var result = Object.keys(obj).filter( (key) => { 
        return obj[key] === '';
    });

    // Parse json text.
    resultJson = JSON.parse(result[0]);

    return resultJson;
}

module.exports = router;
