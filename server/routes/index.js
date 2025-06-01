module.exports = (app) => {
    app.use('/api', require('./api/bookRoutes'));
    app.use('/api', require('./api/authorRoutes'));
    app.use('/api', require('./api/genreRoutes'));
    app.use('/api', require('./api/userRoutes'));
    app.use('/api', require('./api/libraryRoutes'));
    app.use(require('./htmlRoutes'));
}