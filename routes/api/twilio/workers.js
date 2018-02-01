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
    var param = { "Pending": "Show worker detail's api is not prepared yet." };
    // res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(param);
});

/**
 * Worker追加API
 */
router.post('/create', function (req, res, next) {

    // GET Request parameters.
    var obj = req.body;
    var result = Object.keys(obj).filter( (key) => { 
        return obj[key] === '';
    });

    // Parse json text.
    result = JSON.parse(result[0]);

    // Request Twioio API.
    try {
        client.taskrouter.v1.workspaces(workspaceSid).workers.create({
            friendlyName: result.name,
            activityName: result.activity,
            attributes: result.attributes,
        }).then(reseult => {
            res.send({ "status" : "OK" });
        });
    } catch (error) {
        res.send({ "status" : "NG" });
    }
});

module.exports = router;
