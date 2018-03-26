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
                console.log('console ready.');
                console.log(workflow.configuration);
                console.log('console end.');
                var filters = parseFiltersToArrayFromJson(workflow.configuration);
                // exit;
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

function parseFiltersToArrayFromJson(jsonFilters) {
    console.log('STARTSTARTSTARTSTARTSTARTSTART');
    var filters = [];
    // console.log(JSON.parse(jsonFilters));
    // exit;
    JSON.parse(jsonFilters).task_routing.filters.forEach(function(filter, i){
        var tmpObject = {};
        var languages = [];
        var skills = [];
        var startTime, endTime;
        // console.log(filter);
        tmpObject.filter_friendly_name = filter.filter_friendly_name;
        tmpObject.queue = filter.targets[0].queue;
        // tmpObject.expressions.languages = [];
        // tmpObject.expressions.skills = [];
        console.log(tmpObject.queue);
        // console.log(filter.expression.split(' OR\n ')[0]);
        filter.expression.split(' OR\n ').forEach(function(dataOr, i){
            dataOr = dataOr.replace(/\(/g,"");
            dataOr = dataOr.replace(/\)/g,"");
            // console.log(data );
            dataOr.split(' AND\n ').forEach(function(dataAnd, i){
                if (dataAnd.indexOf('taskrouter.currentTime') != -1) {
                    startTime = dataAnd.split(' AND ')[0].split(' > ')[1];
                    endTime = dataAnd.split(' AND ')[1].split(' < ')[1];
                } else {
                    if (dataAnd.indexOf('language') != -1) {
                        languages.push(dataAnd.split(' == ')[1].replace(/\'/g,""));
                    } else {
                        skills.push(dataAnd.split(' == ')[1].replace(/\'/g,""));
                    }
                }
            });
        });
        // .replace(/:/g,"")
        // console.log(tmpObject.filter_friendly_name);
        tmpObject.selected_languages = languages;
        tmpObject.selected_skills = skills;
        tmpObject.start_time = startTime.substr(0,2)+":"+startTime.substr(2,2);
        tmpObject.end_time = endTime.substr(0,2)+":"+endTime.substr(2,2);
        // console.log(languages);
        filters.push(tmpObject);
    });
    console.log('ENDENDENDENDENDENDENDENDENDEND');
    return filters;
};

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
    console.log(configuration);
    // exit;

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
