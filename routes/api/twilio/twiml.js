// import { workers, worker } from 'cluster';

const express = require('express');
const router = express.Router();

require('dotenv').config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const workspaceSid = process.env.WORKSPACE_SID;
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const client = require('twilio')(accountSid, authToken);
var lang_list = {
    es: { say: "Para Español oprime el uno."},
    en: { say: "For English, please hold or press two."},
    jp: { say: "日本語の方は3を押すか、日本語といってください。"},
    ch: { say: "中国語の方は4を押すか、中国語といってください。"},
};
var skill_list = {
    csharp: { say: "シーシャープの方は1を教えてください。"},
    curl:   { say: "カールの方は2を教えてください。"},
    java:   { say: "ジャバの方は3を教えてください。"},
    nodejs: { say: "ノードジェイエスの方は4を教えてください。"},
    php:    { say: "ピーエイチピーの方は5を教えてください。"},
    python: { say: "パイソンの方は6を教えてください。"},
    ruby:   { say: "ルビーの方は7を教えてください。"},
};


/**
 * STEP 1
 * Respond twiml gather verb for selecting language.
 */
router.post('/voices/ivr/step1', function (req, res, next) {
    client.taskrouter.v1
        .workspaces(workspaceSid)
        .workers
        .list()
        .then((workers) => {
            // res.send('ewiwiei');
            // return workers;
            var unique_result;
            var result = [];
            workers.forEach(function(worker, i){
                var languages = JSON.parse(worker.attributes).languages;
                languages.forEach(function(language, i){
                    result.push(language);
                });
            });
            // 重複を削除したリスト
            var unique_result = result.filter(function (x, i, self) {
                return self.indexOf(x) === i;
            });

            res.header('Content-Type', 'application/xml; charset=utf-8')
            const response = new VoiceResponse();
            const gather = response.gather({
                action: 'https://6f635a7c.ngrok.io/api/twilio/twiml/voices/ivr/step3',
                input: 'speech dtmf',
                timeout: 3,
                numDigits: 1,
            });

            unique_result.forEach(function(lang, i){
                gather.say({language: lang}, lang_list[lang].say);
            });

            res.send(response.toString());
            
        });
});

/**
 * STEP 2
 * Respond twiml gather verb for selecting skill.
 */
router.post('/voices/ivr/step2', function (req, res, next) {
    client.taskrouter.v1
        .workspaces(workspaceSid)
        .workers
        .list()
        .then((workers) => {
            // res.send('ewiwiei');
            // return workers;
            var unique_result;
            var result = [];
            workers.forEach(function(worker, i){
                var skills = JSON.parse(worker.attributes).technical_skill;
                skills.forEach(function(skill, i){
                    result.push(skill);
                });
            });
            // 重複を削除したリスト
            var unique_result = result.filter(function (x, i, self) {
                return self.indexOf(x) === i;
            });

            res.header('Content-Type', 'application/xml; charset=utf-8')
            const response = new VoiceResponse();
            const gather = response.gather({
                action: 'https://6f635a7c.ngrok.io/api/twilio/twiml/voices/ivr/step3',
                input: 'speech dtmf',
                timeout: 3,
                numDigits: 1,
            });

            unique_result.forEach(function(skill, i){
                gather.say({technical_skill: skill}, skill_list[skill].say);
            });

            res.send(response.toString());

        });
});

/**
 * STEP 3
 * Push worker who properly to queue.
 */
router.post('/voices/ivr/step3', function (req, res, next) {

    var digit_pressed = req.params.Digits;
    var language = "jp";

    if (digit_pressed == '1') {
        language = "es";
    } else {
        language = "en";
    }

    // const response = new VoiceResponse();
    // const task = '<Task>{"selected_language": "'+language+'"}</Task>';
    // response.enqueue({
    //     workflowSid: 'WWedb795761ce8db8aabf93f1319d130c6'
    // }, task);

    // res.send(response.toString());

    var resp = new VoiceResponse();
    
    var json = { selected_language: 'en' };
    
    // resp
    // .enqueueTask({
    //     workflowSid: 'WWedb795761ce8db8aabf93f1319d130c6',
    // })
    // .task({}, JSON.stringify(json));
    resp.enqueue({workflowSid: 'WWedb795761ce8db8aabf93f1319d130c6'}).task({}, JSON.stringify(json));
    
    // res.setHeader('Content-Type', 'application/xml');
    res.header('Content-Type', 'application/xml; charset=utf-8')
    res.send(resp.toString());
    // res.end();
});

/**
 * IVR voice response url.
 */
router.get('/voices/ivr', function (req, res, next) {
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

/**
 * Return workers list.
 */
function _getWorkerList() {
    // return "wei";
    client.taskrouter.v1
        .workspaces(workspaceSid)
        .workers
        .list()
        .then((workers) => {
            // return "testes";
            // return workers;
            var result = [];
            workers.forEach(function(worker, i){
                result[i] = {
                    'accountSid': worker.accountSid,
                    'activityName': worker.activityName,
                    'activitySid': worker.activitySid,
                    'attributes': worker.attributes,
                    'available': worker.available,
                    'dateCreated': worker.dateCreated,
                    'dateStatusChanged': worker.dateStatusChanged,
                    'dateUpdated': worker.dateUpdated,
                    'friendlyName': worker.friendlyName,
                    'sid': worker.sid,
                    'workspaceSid': worker.workspaceSid
                }
            });
            return result;
            // res.send(JSON.stringify(result));
        });
}

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
