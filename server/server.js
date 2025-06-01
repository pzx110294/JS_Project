const express = require('express');
const path = require('path');
const app = express();
const db = require('./models');
const { seedData } = require('./db/seedData');
const { logRequests, logErrors } = require('./middleware/logging');
const { errorHandler } = require('./middleware/errorHandling');

app.get('/favicon.ico', (req, res) =>
    res.sendFile(path.join(__dirname, '../client/icon/favicon-16x16.png'))
);
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(logRequests);

const startServer = async () => {
    await db.sequelize.sync({force: false})
    await seedData();

    require('./routes')(app);
    app.use(logErrors);
    app.use(errorHandler);

    return app.listen(3000, () => {
            console.log("\x1b[33mhttp://localhost:3000/ \x1b[0m")
        }
    );
};

module.exports = { app, startServer };

if (require.main === module) {
    startServer()
    .catch(err => {
            console.error("Sequelize failed to sync:", err);
            process.exit(1);
    });
}
