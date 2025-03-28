const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(
   'database1',
   'Username',
   'Password',
    {
        host: 'localhost',
        dialect: 'sqlite',
        storage: './server/db/db.sqlite'
    }
);

module.exports = sequelize;