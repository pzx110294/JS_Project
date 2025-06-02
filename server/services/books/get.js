const db = require('../../models');
const {Book, Author, Genre } = db;
const { validateFields } = require('../../helpers/validateFields');
const {Op} = require("sequelize");
async function getBooks(filters = {}) {
    let where = {};
    const include = [
        {
            model: Author,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            through: { attributes: [] }
        },
        {
            model: Genre,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            through: { attributes: [] }
        }
    ];
    if (filters.Title) {
        where.Title = { [Op.like]: `%${filters.Title}%` };
    }
    if (filters.ISBN) {
        where.ISBN = {[Op.like]: `%${filters.ISBN}%`};
    }
    if (filters.PublicationDate) {
        const day = new Date(filters.PublicationDate);
        const nextDay = new Date(day.getTime() + 24 * 60 * 60 * 1000);
        where.PublicationDate = {[Op.between]: [day, nextDay]};
    }
    if (filters.AuthorId) {
        include[0].where = {
            id: filters.AuthorId
        };
    }
    if (filters.GenreId) {
        include[1].where = {
            id: filters.GenreId
        };
    }
    const books = await Book.findAll({
        where,
        include,
        attributes: { exclude: ['createdAt', 'updatedAt']}
    });
    for (const book of books) {
        validateFields(book, ['Title', 'ISBN', 'Authors', 'Genres'], 'Book');
    }
    return books;
}
async function getBookById(id, user) {
    const include = [Author, Genre];
    if (user) {
        console.log('User is logged in');
    } 
    const book = await Book.findByPk(id, {include});
    validateFields(book, ['Title', 'ISBN', 'Authors', 'Genres'], 'Book');
    return book;
}
module.exports = { getBooks, getBookById };