const express = require('express');
const path = require('path');
const app = express();
const db = require('./models');

app.get('/favicon.ico', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/icon/favicon-16x16.png'))
);
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(logRequests);

db.sequelize.sync({force: false})
    .then(() => {
        const htmlRoutes = require('./routes/htmlRoutes');
        const apiBookRoutes = require('./routes/api/bookRoutes');
        const apiAuthorRoutes = require('./routes/api/authorRoutes');
        const apiGenreRoutes = require('./routes/api/genreRoutes');
        
        app.use('/api', apiBookRoutes);
        app.use('/api', apiAuthorRoutes);
        app.use('/api', apiGenreRoutes);
        app.use(htmlRoutes);

        app.use(logErrors);
        app.use(errorHandler);

        app.listen(3000, () => {
                console.log("\x1b[33mhttp://localhost:3000/ \x1b[0m")
            }
        );
    }).catch(err => {
    console.error("Sequelize failed to sync:", err);
    process.exit(1);
});

function logErrors(err, req, res, next) {
    console.log(`\x1b[31m${err.status} ${err.message}\n${err.stack} \x1b[0m`);
    next(err);
}

function errorHandler(err, req, res, _next) {
    res.status(err.status || 500);
    res.json({
        error: err.message || 'Internal error'
    });
}

function logRequests(req, res, next) {
    console.log("[ " + new Date().toUTCString() + " ] " +
        " [ \x1b[32m " + req.method + " \x1b[0m ] " +
        " [ \x1b[34m" + req.url + " \x1b[0m ] " +
        " [ " + JSON.stringify(req.body) + " ] ");
    next();
}
