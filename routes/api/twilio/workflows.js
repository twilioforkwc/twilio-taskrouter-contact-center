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
    // Request Twilio API.
    console.log(paramsJson.selectedLanguage);
    var expression = "";
    if (paramsJson.selectedLanguage.length > 0) {
        expression = expression + "(";
        paramsJson.selectedLanguage.forEach(function(lang, i){
            expression = expression + generateExpression("selected_language", "==", lang);
            console.log(paramsJson.selectedLanguage.length);
            console.log(i);
            if ((i+1)< paramsJson.selectedLanguage.length) {
                expression = expression + " AND\n ";
            }
        });
        expression = expression + ") OR\n ";
    }
    if (paramsJson.selectedLanguage.length > 0) {
        expression = expression + "(";
        paramsJson.selectedSkill.forEach(function(skill, i){
            expression = expression + generateExpression("technical_skill", "==", skill);
            if ((i+1)< paramsJson.selectedSkill.length) {
                expression = expression + " AND\n ";
            }
        });
        expression = expression + ") OR\n ";
    }
    if (paramsJson.startTime && paramsJson.endTime) {
        expression = expression + "(taskrouter.currentTime > "+paramsJson.startTime.replace(/:/g,"")+" AND taskrouter.currentTime < "+paramsJson.endTime.replace(/:/g,"")+")";
    }
    // expression = expression + "\"";
    console.log(expression);
    // expression = expression + "(";
    // expression = expression + ")";
    var configuration = {
        "task_routing": {
            "filters": [
                {
                    "targets": [
                        {
                            "queue": "WQ9e1ed3f73b3bfb8630fb0053d7f1427c"
                        }
                    ],
                    "filter_friendly_name": "Language - English",
                    "expression": expression
                }
            ],
            "default_filter": {
                "queue": "WQ9e1ed3f73b3bfb8630fb0053d7f1427c"
            }
        }
    }
    console.log(configuration);
    // exit;

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

function generateExpression(property, relation, data) {
    return property + " " + relation + " " + "'" + data + "'";
}

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
