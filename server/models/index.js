const Sequelize = require('sequelize');
const sequelize = require('../db/dbConfig');

const db = {};

db.Author = require('./authors')(sequelize, Sequelize.DataTypes);
db.Book = require('./books')(sequelize, Sequelize.DataTypes);
db.Genre = require('./genres')(sequelize, Sequelize.DataTypes);

db.Book.belongsToMany(db.Author, { through: 'BookAuthors' });
db.Author.belongsToMany(db.Book, { through: 'BookAuthors', onDelete: 'CASCADE' });

db.Book.belongsToMany(db.Genre, { through: 'BookGenres' });
db.Genre.belongsToMany(db.Book, { through: 'BookGenres', onDelete: 'CASCADE' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
