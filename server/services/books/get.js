const db = require('../../models');
const {Book, Author,  Genre } = db;
async function getBooks() {
    const data = await Book.findAll({include: [Author, Genre]})
    return data;
}
async function getBookById(id) {
    const data = await Book.findByPk(id, {include: [Author,  Genre]});
    return data;
}
module.exports = { getBooks, getBookById };