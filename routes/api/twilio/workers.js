const express = require('express');
const router = express.Router();

require('dotenv').config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const workspaceSid = process.env.WORKSPACE_SID;
const client = require('twilio')(accountSid, authToken);

/**
 * Worker一覧取得API
 */
router.get('/', function (req, res, next) {
    // res.header('Content-Type', 'application/json; charset=utf-8')
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
                activitySid: paramsJson.activity,
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
