const express = require('express');
const router = express.Router();

require('dotenv').config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const workspaceSid = process.env.WORKSPACE_SID;
const client = require('twilio')(accountSid, authToken);

/**
 * Workflow一覧取得
 */
router.get('/', function (req, res, next) {
    res.header('Content-Type', 'application/json; charset=utf-8')
    client.taskrouter.v1
    .workspaces(workspaceSid)
    .workflows
    .list()
    .then((workflows) => {
        var result = [];
        workflows.forEach((workflow, i) => {
            console.log(workflow.configuration);
            console.log('korehatesgtetestsetstse');
            result[i] = {
                'friendlyName': workflow.friendlyName,
                'sid': workflow.sid,
                'assignmentCallbackUrl': workflow.assignmentCallbackUrl,
                'fallbackAssignmentCallbackUrl': workflow.fallbackAssignmentCallbackUrl,
                'taskReservationTimeout': workflow.taskReservationTimeout,
                'configuration': workflow.configuration,
                'dateCreated': workflow.dateCreated,
                'dateUpdated': workflow.dateUpdated,
            }
        });
        res.send(JSON.stringify(result));
    });
});

/**
 * Worker詳細API
 */
router.get('/show/:sid', function (req, res, next) {
    // Request Twioio API.
    try {
        client.taskrouter.v1
            .workspaces(workspaceSid)
            .workflows(req.params.sid)
            .fetch()
            .then((workflow) => {
                console.log(workflow.friendlyName)
                res.send({
                    status: "OK",
                    friendlyName: workflow.friendlyName,
                    sid: workflow.sid,
                    assignmentCallbackUrl: workflow.assignmentCallbackUrl,
                    fallbackAssignmentCallbackUrl: workflow.fallbackAssignmentCallbackUrl,
                    taskReservationTimeout: workflow.taskReservationTimeout,
                    configuration: workflow.configuration,
                    dateCreated: workflow.dateCreated,
                    dateUpdated: workflow.dateUpdated,
                });
            });
    } catch (error) {
        res.send({ status: "NG" });
    }
});

/**
 * Worker追加API
 */
router.post('/create', function (req, res, next) {
    // Parse json text.
    var paramsJson = parseRequestParameter(req);
    var mAttributes = {
        name: paramsJson.name,
        technical_skill: paramsJson.skills,
        languages: paramsJson.languages,
    };

    // Request Twioio API.
    try {
        client.taskrouter.v1.workspaces(workspaceSid).workers.create({
            friendlyName: paramsJson.name,
            activityName: paramsJson.activity,
            attributes: JSON.stringify(mAttributes),
        }).then(reseult => {
            res.send({ status: "OK" });
        });
    } catch (error) {
        res.send({ status: "NG" });
    }
});

/**
 * Worker更新API
 */
router.put('/update', function (req, res, next) {
    // Parse json text.
    var paramsJson = parseRequestParameter(req);
    // var mAttributes = {
    //     name: paramsJson.name,
    //     technical_skill: paramsJson.skills,
    //     languages: paramsJson.languages,
    // };
    // Request Twioio API.
    try {
        client.taskrouter.v1
            .workspaces(workspaceSid)
            .workflows(paramsJson.sid)
            .update({
                friendlyName: paramsJson.friendlyName,
                assignmentCallbackUrl: paramsJson.assignmentCallbackUrl,
                fallbackAssignmentCallbackUrl: paramsJson.fallbackAssignmentCallbackUrl,
                taskReservationTimeout: paramsJson.taskReservationTimeout,
                // attributes: JSON.stringify(mAttributes),
            })
            .then(
                worker =>
                {
                    res.send({ status: "OK" });
                }
            );
    } catch (error) {
        console.log(error);
        res.send({ status: "NG" });
    }
});

/**
 * Worker削除API
 */
router.delete('/:sid', function (req, res, next) {
    // Request Twioio API.
    try {
        client.taskrouter.v1
            .workspaces(workspaceSid)
            .workers(req.params.sid)
            .remove();
        res.send({ status: "OK" });
    } catch (error) {
        console.log(error);
        res.send({ status: "NG" });
    }
});

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
