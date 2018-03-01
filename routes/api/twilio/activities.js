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
        .activities
        .list()
        .then((activities) => {
            var result = [];
            activities.forEach((activity, i) => {
                console.log(activity.sid);
                result[i] = {
                    'accountSid': activity.accountSid,
                    'available': activity.available,
                    'dateCreated': activity.dateCreated,
                    'dateUpdated': activity.dateUpdated,
                    'friendlyName': activity.friendlyName,
                    'sid': activity.sid,
                    'workspaceSid': activity.workspaceSid,
                    'url': activity.url
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
            .activities(req.params.sid)
            .fetch()
            .then(activity => {
                res.send({
                    status: "OK",
                    friendlyName: activity.friendlyName,
                    available: activity.available,
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
        client.taskrouter.v1.workspaces(workspaceSid).activities.create({
            friendlyName: paramsJson.name,
            available: paramsJson.available,
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
            .activities(paramsJson.sid)
            .update({
                friendlyName: paramsJson.name,
                available: paramsJson.available,
            })
            .then(
                activity =>
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
            .activities(req.params.sid)
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
