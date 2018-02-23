const express = require('express');
const router = express.Router();

require('dotenv').config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const workspaceSid = process.env.WORKSPACE_SID;
const client = require('twilio')(accountSid, authToken);

/**
 * キューリスト取得API
 */
router.get('/', function (req, res, next) {
    client.taskrouter.v1
    .workspaces(workspaceSid)
    .taskQueues
    .list()
    .then((taskQueues) => {
        var result = [];
        taskQueues.forEach((taskQueue, i) => {
            console.log(taskQueue);
            result[i] = {
                'friendlyName' : taskQueue.friendlyName,
                'maxReservedWorkers' : taskQueue.maxReservedWorkers,
                'reservationActivitySid' : taskQueue.reservationActivitySid,
                'reservationActivityName' : taskQueue.reservationActivityName,
                'sid' : taskQueue.sid,
                'targetWorkers' : taskQueue.targetWorkers,
                'taskOrder' : taskQueue.taskOrder,
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
            .workers(req.params.sid)
            .fetch()
            .then(worker => {
                res.send({
                    status: "OK",
                    friendlyName: worker.friendlyName,
                    activityName: worker.activityName,
                    attributes: worker.attributes
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
    // var mAttributes = {
    //     name: paramsJson.name,
    //     technical_skill: paramsJson.skills,
    //     languages: paramsJson.languages,
    // };

    // Request Twioio API.
    try {
        client.taskrouter.v1.workspaces(workspaceSid).taskQueues.create({
            // friendlyName: paramsJson.name,
            // activityName: paramsJson.activity,
            // attributes: JSON.stringify(mAttributes),
            friendlyName: paramsJson.task_queue_key+'-'+paramsJson.task_queue_val,
            reservationActivitySid: 'WAa565844509dfee41c31af37541f6af8d',
            assignmentActivitySid: 'WA273cbfa957f970d12dd941953c69690c',
            targetWorkers: "'"+paramsJson.task_queue_key+' HAS '+'"'+paramsJson.task_queue_val+'"'+"'",
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
    var mAttributes = {
        name: paramsJson.name,
        technical_skill: paramsJson.skills,
        languages: paramsJson.languages,
    };
    // Request Twioio API.
    try {
        client.taskrouter.v1
            .workspaces(workspaceSid)
            .workers(paramsJson.sid)
            .update({
                friendlyName: paramsJson.name,
                activityName: paramsJson.activity,
                attributes: JSON.stringify(mAttributes),
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
