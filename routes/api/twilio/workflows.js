const express = require('express');
const router = express.Router();

const config = require('./config');

const accountSid = config.TWILIO_ACCOUNT_SID;
const authToken = config.TWILIO_AUTH_TOKEN;
const workspaceSid = config.TWILIO_TASKROUTER_WORKSPACE_SID;
const client = require('twilio')(accountSid, authToken);

/**
 * Workflow一覧取得
 */
router.get('/', function (req, res) {
    res.header('Content-Type', 'application/json; charset=utf-8')
    client.taskrouter.v1
    .workspaces(workspaceSid)
    .workflows
    .list()
    .then((workflows) => {
        var result = [];
        workflows.forEach((workflow, i) => {
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
 * Workflow詳細API
 */
router.get('/show/:sid', function (req, res) {
    // Request Twioio API.
    try {
        client.taskrouter.v1
            .workspaces(workspaceSid)
            .workflows(req.params.sid)
            .fetch()
            .then((workflow) => {
                var filters = JSON.parse(workflow.configuration).task_routing.filters;
                res.send({
                    status: "OK",
                    friendlyName: workflow.friendlyName,
                    sid: workflow.sid,
                    assignmentCallbackUrl: workflow.assignmentCallbackUrl,
                    fallbackAssignmentCallbackUrl: workflow.fallbackAssignmentCallbackUrl,
                    taskReservationTimeout: workflow.taskReservationTimeout,
                    configuration: workflow.configuration,
                    filters: filters,
                    dateCreated: workflow.dateCreated,
                    dateUpdated: workflow.dateUpdated,
                });
            });
    } catch (error) {
        res.send({ status: "NG" });
    }
});

/**
 * Workflow追加API
 */
router.post('/create', function (req, res) {
    // Parse json text.
    var paramsJson = parseRequestParameter(req);
    var expression = paramsJson.expression;
    var configuration = {
        "task_routing": {
            "filters": [
                {
                    "targets": [
                        {
                            "queue": paramsJson.task_queue_sid
                        }
                    ],
                    "filter_friendly_name": paramsJson.filterFriendlyName,
                    "expression": expression
                }
            ],
            "default_filter": {
                "queue": paramsJson.task_queue_sid
            }
        }
    }

    try {
        client.taskrouter.v1
            .workspaces(workspaceSid)
            .workflows
            .create({
                friendlyName: paramsJson.friendlyName,
                assignmentCallbackUrl: paramsJson.assignmentCallbackUrl,
                fallbackAssignmentCallbackUrl: paramsJson.fallbackAssignmentCallbackUrl,
                taskReservationTimeout: paramsJson.taskReservationTimeout,
                configuration: JSON.stringify(configuration),
            })
            .then(function(){
                res.send({ status: "OK" });
            });
    } catch (error) {
        res.send({ status: "NG" });
    }
});

/**
 * Workflow更新API
 */
router.put('/update', function (req, res) {
    // Parse json text.
    var paramsJson = parseRequestParameter(req);
    var expression = paramsJson.expression;
    var configuration = {
        "task_routing": {
            "filters": [
                {
                    "targets": [
                        {
                            "queue": paramsJson.task_queue_sid
                        }
                    ],
                    "filter_friendly_name": paramsJson.filterFriendlyName,
                    "expression": expression
                }
            ],
            "default_filter": {
                "queue": paramsJson.task_queue_sid
            }
        }
    }

    try {
        client.taskrouter.v1
            .workspaces(workspaceSid)
            .workflows(paramsJson.sid)
            .update({
                friendlyName: paramsJson.friendlyName,
                assignmentCallbackUrl: paramsJson.assignmentCallbackUrl,
                fallbackAssignmentCallbackUrl: paramsJson.fallbackAssignmentCallbackUrl,
                taskReservationTimeout: paramsJson.taskReservationTimeout,
                configuration: JSON.stringify(configuration),
            })
            .then(function(){
                res.send({ status: "OK" });
            });
    } catch (error) {
        res.send({ status: "NG" });
    }
});

/**
 * Workflow削除API
 */
router.delete('/:sid', function (req, res) {
    // Request Twioio API.
    try {
        client.taskrouter.v1
            .workspaces(workspaceSid)
            .workflows(req.params.sid)
            .remove();
        res.send({ status: "OK" });
    } catch (error) {
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
    var resultJson = JSON.parse(result[0]);

    return resultJson;
}

module.exports = router;
