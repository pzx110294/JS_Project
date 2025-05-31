function errorHandler(err, req, res, _next) {
    res.status(err.status || 500);
    res.json({
        error: err.message || 'Internal error'
    });
}
module.exports = { errorHandler }