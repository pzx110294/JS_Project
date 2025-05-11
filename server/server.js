const express = require('express');
const path = require('path');
const app = express();
const sequelize = require('./db/dbConfig');


app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());
app.use(express.urlencoded( {
        extended: true
}))
app.use((req, res, next) => {
        console.log("{ " +  new Date () . toISOString () + " }  { " +  req.method + " }  { " + req.url + " } {" + JSON.stringify(req.query) + " }");
        next();
})

sequelize.sync({force: false})
    .then(() => {
        console.log('Db synced');

        const apiGetRoutes = require('./routes/api/get');
        const apiPostRoutes = require('./routes/api/post');
        const htmlRoutes = require('./routes/htmlRoutes');
        
        app.use('/api', apiGetRoutes);
        app.use('/api', apiPostRoutes);
        app.use(htmlRoutes);

        app.listen(3000, () => {
                console.log("http://localhost:3000/")
            }
        );

    })
