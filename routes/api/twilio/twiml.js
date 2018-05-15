const express = require('express');
const router = express.Router();
const fs = require('fs');
const extension = 'json';
const file_path = 'datas/'+extension+'/';

const config = require('./config');

const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const NgrokDomain = config.NGROK_GLOBAL_DOMAIN;
const ConferenceNumber = config.TWILIO_CONFERENCE_NUMBER;
const WorkspaceSID = config.TWILIO_TASKROUTER_WORKSPACE_SID;
const WorkflowSID = config.TWILIO_TASKROUTER_WORKFLOW_SID;
const client = require('twilio')(accountSid, authToken);

/**
 * IVR voice response url.
 * Respond twiml gather verb for selecting language.
 */
router.post('/voices/ivr', function (req, res) {
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
                gather.say({language: element.lang}, element.text);
            });
            res.send(response.toString());
        }
    });
});

/**
 * IVR voice response url.
 */
router.post('/voices/enqueue', function (req, res) {
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
        }
    });
});

/**
 * IVR voice response url.
 */
router.post('/voices/assignment', function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8')
    console.log('#####ASSIGNMENT######');
    console.log(req.body);
    console.log('###########');
    var to;
    var name = JSON.parse(req.body.WorkerAttributes).name;
    if(name.match(/#/)){
        to = 'sip:' + name.split('#')[1];
    } else {
        to = "client:"+req.body.WorkerSid;
    }
    console.log(to);
    var response = {
        'instruction': 'Conference',
        // 'to': "client:"+req.body.WorkerSid,
        'to': to,
        'from': ConferenceNumber,
        'status_callback': NgrokDomain+'api/twilio/twiml/voices/assignment/callback',
        'timeout': 1,
        'status_callback_events': 'initiated',
        'end_conference_on_exit': true
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
router.post('/voices/assignment/callback', function (req) {
    console.log('#####ASSIGNMENT CALLBACK######');
    console.log(req.body);
    console.log('###########');
});

/**
 * IVR voice response url.
 */
router.post('/voices/conference', function (req, res) {
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

            var muted = false;
            if(req.body.App_Muted === 'true') muted = true;
            client.conferences.each({
                    status: 'in-progress'
                },
                conferences => {
                    console.log('#####FRIENDLYNAME######');
                    console.log(conferences.friendlyName)
                    console.log('###########');
                    dial.conference({
                        muted: muted,
                        statusCallback: '/api/twilio/twiml/voices/dial/'+JSON.parse(data).worker,
                        statusCallbackEvent: 'join',
                    }, conferences.friendlyName);
                    res.send(response.toString());
                }
            );
        }
    });
});

/**
 * IVR voice response url.
 */
router.post('/voices/dial/:client', function (req) {
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
            .then( function() { });
    }
});

/**
 * Assignment callback endpoint.
 */
router.post('/voices/callback', function (req, res) {
    console.log('#####CallStatusChanged CALLBACK######');
    // console.log(req.body);
    console.log('###########');
    // console.log(req.body.CallSid);
    const opts = {status: 'in-progress'};
    client.conferences.each(opts, (conference) => {
        console.log(conference.sid);
        client.conferences(conference.sid).update({
            status: 'completed'
        });
    });

    setTimeout(function(){
        client.taskrouter.v1
            .workspaces(WorkspaceSID)
            .tasks
            .list()
            .then((tasks) => {
                tasks.forEach((task) => {
                    console.log('###########');
                    console.log(task.assignmentStatus);
                    console.log('###########');
                    if(task.assignmentStatus == 'wrapping'){
                        client.taskrouter.v1
                            .workspaces(WorkspaceSID)
                            .tasks(task.sid)
                            .update({
                                assignmentStatus: 'completed',
                                reason: 'call was finished.',
                            })
                            .then((task) => {
                                console.log(task.assignmentStatus);
                                console.log(task.reason);
                            });
                    }
                });
            });
        res.send('COMPLETE');
    },2000);

});

module.exports = router;
