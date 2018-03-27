const express = require('express');
const router = express.Router();
const fs = require('fs');
const extension = 'json';
const file_path = 'datas/'+extension+'/';

const config = require('./config');

const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;
const workspaceSid = config.TWILIO_TASKROUTER_WORKSPACE_SID;
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const NgrokDomain = config.NGROK_GLOBAL_DOMAIN;
const ConferenceNumber = config.TWILIO_CONFERENCE_NUMBER;
const WorkflowSID = config.TWILIO_TASKROUTER_WORKFLOW_SID;
const client = require('twilio')(accountSid, authToken);

/**
 * IVR voice response url.
 * Respond twiml gather verb for selecting language.
 */
router.post('/voices/ivr', function (req, res, next) {
    res.header('Content-Type', 'application/xml; charset=utf-8')
    const response = new VoiceResponse();
    const gather = response.gather({
        action: '/api/twilio/twiml/voices/enqueue',
        input: 'speech dtmf',
        timeout: 3,
        numDigits: 1,
    });

    fs.readFile(file_path+'languages'+'.'+extension, 'utf-8', (err, data) => {
        if (err) {
            res.send({ status: "NG", message: err, result: null });
        } else {
            var say_list = null;
            say_list = JSON.parse(data);
            say_list.forEach(element => {
                console.log(element);
                gather.say({language: element.lang}, element.text);
            });
            res.send(response.toString());
        };
    });
});

/**
 * IVR voice response url.
 */
router.post('/voices/enqueue', function (req, res, next) {
    res.header('Content-Type', 'application/xml; charset=utf-8')

    var digit_pressed = req.body.Digits;
    var language = "mismatch";

    fs.readFile(file_path+'languages'+'.'+extension, 'utf-8', (err, data) => {
        if (err) {
            res.send({ status: "NG", message: err, result: null });
        } else {
            var say_list = null;
            say_list = JSON.parse(data);
            say_list.forEach(element => {
                if(element.pin_code == digit_pressed) {
                    language = element.identifer;
                }
            });
            const response = new VoiceResponse();
            var json = {
                selected_language: language
            };
            response.enqueue({
                workflowSid: WorkflowSID,
            })
            .task({}, JSON.stringify(json));

            res.send(response.toString());
        };
    });
});

/**
 * IVR voice response url.
 */
router.post('/voices/assignment', function (req, res, next) {
    res.header('Content-Type', 'application/json; charset=utf-8')
    console.log('#####ASSIGNMENT######');
    console.log(req.body);
    console.log('###########');
    var response = {
        'instruction': 'dequeue',
        'to': ConferenceNumber,
        'from': ConferenceNumber,
        'status_callback_url': NgrokDomain+'api/twilio/twiml/voices/assignment/callback',
        'status_callback_events': 'initiated'
    };
    fs.writeFile(file_path+'assignment'+'.'+extension, JSON.stringify({worker: req.body.WorkerSid}), function (err) {
        if (err) {
            res.send({ status: "NG", message: err, result: null });
        } else {
            res.send(JSON.stringify(response));
        }
    });
});

/**
 * IVR voice response url.
 */
router.post('/voices/assignment/callback', function (req, res, next) {
    console.log('#####ASSIGNMENT CALLBACK######');
    console.log(req.body);
    console.log('###########');
});

/**
 * IVR voice response url.
 */
router.post('/voices/conference', function (req, res, next) {
    res.header('Content-Type', 'application/xml; charset=utf-8')

    fs.readFile(file_path+'assignment'+'.'+extension, 'utf-8', (err, data) => {
        if (err) {
            res.send({ status: "NG", message: err, result: null });
        } else {
            var response = new VoiceResponse();
            var dial = response.dial();
            console.log('#####WORKER######');
            console.log(data);
            console.log('###########');
            dial.conference({
                statusCallback: '/api/twilio/twiml/voices/dial/'+JSON.parse(data).worker,
                statusCallbackEvent: 'join'
            }, 'TwilioTaskRouterContactConference');
            
            res.send(response.toString());
        };
    });
});

/**
 * IVR voice response url.
 */
router.post('/voices/dial/:client', function (req, res, next) {
    console.log('#####DIAL CLIENT######');
    console.log(req.body);
    console.log('###########');
    console.log(req.params.client);
    console.log('###########');
    if(req.body.SequenceNumber < 2){
        client.calls
            .create({
                url: NgrokDomain+'api/twilio/twiml/voices/conference',
                to: 'client:'+req.params.client,
                from: ConferenceNumber,
            })
            .then(
                call => {
                }
            );
    }
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
        });
}

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
