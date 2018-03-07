const express = require('express');
const router = express.Router();

const config = require('./config');

const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;
const workspaceSid = config.TWILIO_TASKROUTER_WORKSPACE_SID;
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
            .taskQueues(req.params.sid)
            .fetch()
            .then(taskqueue => {
                res.send({
                    status: "OK",
                    friendlyName: taskqueue.friendlyName,
                    reservationActivitySid: taskqueue.reservationActivitySid,
                    assignmentActivitySid: taskqueue.assignmentActivitySid,
                    maxReservedWorkers: taskqueue.maxReservedWorkers,
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

    // Request Twioio API.
    try {
        client.taskrouter.v1.workspaces(workspaceSid).taskQueues.create({
            friendlyName: paramsJson.task_queue_key+'-'+paramsJson.task_queue_val,
            reservationActivitySid: paramsJson.reservation_activity,
            assignmentActivitySid: paramsJson.assignment_activity,
            maxReservedWorkers: paramsJson.max_reserved_worker,
            targetWorkers: paramsJson.task_queue_key+' HAS "'+paramsJson.task_queue_val+'"',
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
    // Request Twioio API.
    try {
        client.taskrouter.v1
            .workspaces(workspaceSid)
            .taskQueues(paramsJson.sid)
            .update({
                friendly_name: paramsJson.task_queue_key+'-'+paramsJson.task_queue_val,
                max_reserved_workers: paramsJson.max_reserved_worker,
                target_workers: paramsJson.task_queue_key+' HAS "'+paramsJson.task_queue_val+'"',
                })
            .then(
                taskQueue =>
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
            .taskQueues(req.params.sid)
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
