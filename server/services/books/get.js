const db = require('../../models');
const {Book, Author, Genre } = db;
const { validateFields } = require('../../helpers/validateFields');
async function getBooks() {
    const books = await Book.findAll({include: [Author, Genre]});
    for (const book of books) {
        validateFields(book, ['Title', 'ISBN', 'Authors', 'Genres'], 'Book');
    }
    return books;
}
async function getBookById(id) {
    const book = await Book.findByPk(id, {include: [Author, Genre]});
    validateFields(book, ['Title', 'ISBN', 'Authors', 'Genres'], 'Book');
    return book;
}
module.exports = { getBooks, getBookById };