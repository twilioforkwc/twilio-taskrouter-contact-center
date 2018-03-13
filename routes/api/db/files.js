const express = require('express');
const router = express.Router();
const fs = require('fs');
const extension = 'json';
const file_path = 'datas/'+extension+'/';

/* Get data from a file designated. */
router.get('/:file_name', function (req, res, next) {
    fs.readFile(file_path+req.params.file_name+'.'+extension, 'utf-8', (err, data) => {
        if (err) {
            res.send({ status: "NG", message: err, result: null });
        } else {
            res.send({ status: "OK", message: 'Get request was executed successfully!!', result: JSON.stringify(JSON.parse(data)) });
        }
    });
});

/* Write data to a file designated. */
router.post('/:file_name', function (req, res, next) {
    fs.writeFile(file_path+req.params.file_name+'.'+extension, JSON.stringify(req.body), function (err) {
        if (err) {
            res.send({ status: "NG", message: err, result: null });
        } else {
            res.send({ status: "OK", message: 'Post request was accepted correctly!!' });
        }
    });
});

module.exports = router;
