const {Sequelize} = require('sequelize');
const sqlite = require("node:sqlite");

let sequelize;

if (process.env.NODE_ENV === 'test') {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false 
    });
}
else {
    sequelize = new Sequelize(
        'database1',
        'Username',
        'Password',
        {
            host: 'localhost',
            dialect: 'sqlite',
            storage: './server/db/db.sqlite'
        }
    );
}

module.exports = sequelize;