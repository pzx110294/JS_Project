function logErrors(err, req, res, next) {
    console.log(`\x1b[31m${err.status} ${err.message}\n`);
    if (process.env.NODE_ENV !== 'test') {
        console.log(`${err.stack}`);
    }
    console.log(`\x1b[0m`)
    next(err);
}

function logRequests(req, res, next) {
    if (process.env.NODE_ENV !== 'test') {
        console.log("[ " + new Date().toUTCString() + " ] " +
            " [ \x1b[32m " + req.method + " \x1b[0m ] " +
            " [ \x1b[34m" + req.url + " \x1b[0m ] " +
            " [ " + JSON.stringify(req.body) + " ] ");
    }
    next();
}

module.exports = { logErrors, logRequests }