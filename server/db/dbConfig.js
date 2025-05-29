const {Sequelize} = require('sequelize');

let sequelize;

if (process.env.NODE_ENV === 'test') {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
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