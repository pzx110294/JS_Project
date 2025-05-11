const express = require('express');
const path = require('path');
const app = express();
const sequelize = require('./db/dbConfig');


app.use('/favicon.ico', express.static(path.join(__dirname, '../client/icon/favicon-16x16.png')));
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());
app.use(express.urlencoded( {
        extended: true
}))
app.use(logRequests);

sequelize.sync({force: false})
    .then(() => {
        const apiGetRoutes = require('./routes/api/get');
        const apiPostRoutes = require('./routes/api/post');
        const htmlRoutes = require('./routes/htmlRoutes');
        
        app.use('/api', apiGetRoutes);
        app.use('/api', apiPostRoutes);
        app.use(htmlRoutes);

        app.use(logErrors);
        app.use(errorHandler);
        
        app.listen(3000, () => {
                console.log("\x1b[33mhttp://localhost:3000/ \x1b[0m")
            }
        );
    })
function logErrors (err, req, res, next) {
        console.log("\x1b[31m" + err.stack + "\x1b[0m");
        next(err);
}

function errorHandler (err, req, res, _next) {
        res.status(err.status || 505);
        res.json({
                error: err.message || 'Internal error'
        });
}
function logRequests (req, res, next)  {
        console.log("[ " + new Date().toUTCString() + " ] " +
            " [ \x1b[32m " +  req.method + " \x1b[0m ] " +
            " [ \x1b[34m" + req.url + " \x1b[0m ] " +
            " [ " + JSON.stringify(req.body) + " ] ");
        next();
}
