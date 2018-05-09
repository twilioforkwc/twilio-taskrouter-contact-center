const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');

// Route files path
const index = require('./routes/index');
const workers = require('./routes/api/twilio/workers');
const twiml = require('./routes/api/twilio/twiml');
const workflows = require('./routes/api/twilio/workflows');
const queues = require('./routes/api/twilio/taskqueues');
const activities = require('./routes/api/twilio/activities');
const capabilities = require('./routes/api/twilio/capabilities');
const tokenGenerator = require('./routes/api/twilio/token_generator');
const dbFiles = require('./routes/api/db/files');

const app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routing group
app.use('/', index);
app.use('/api/twilio/workers', workers);
app.use('/api/twilio/twiml', twiml);
app.use('/api/twilio/workflows', workflows);
app.use('/api/twilio/taskqueues', queues);
app.use('/api/twilio/activities', activities);
app.use('/api/twilio/capabilities', capabilities);
app.use('/api/twilio/token_generator', tokenGenerator);
app.use('/api/db/files', dbFiles);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
});

module.exports = app;
