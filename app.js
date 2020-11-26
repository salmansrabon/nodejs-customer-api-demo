const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

// To see detail log
app.use(morgan('dev'));
// Read data from api body
app.use(bodyParser.json());
// To route api controller
const customerRoutes = require('./api/routes/customer');
app.use('/customer', customerRoutes);


// If user inputs wrong API URL then show in json format
app.use((req, res, next) => {
    const err = new Error(`${req.method} ${req.url} Not Found`);
    err.status = 404;
    next(err);
});

// If any internal error occurs then show in json format
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
        },
    });
});

module.exports=app;