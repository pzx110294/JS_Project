const express = require('express');
const path = require('path');
const app = express();
const sequelize = require('./db/dbConfig');
const Resource = require('./models/resources');

const viewsPath = path.join(__dirname, '../client/views/');

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());
sequelize.sync({force: false})
    .then(() => {
        console.log('Db synced');

        const getRoutes = require('./routes/get');
        const postRoutes = require('./routes/post');
        app.use(getRoutes);
        app.use(postRoutes);

        app.get('/', (req, res) => {
            res.sendFile(viewsPath + 'index.html');
        });
        app.get('/resource', (req, res) => {
            res.sendFile(viewsPath + 'resource.html');
        })
        app.listen(3000, () => {
                console.log("port 3000")
            }
        );

    })
