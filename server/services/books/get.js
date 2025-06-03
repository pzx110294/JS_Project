const db = require('../../models');
const {Book, Author, Genre } = db;
const { validateFields } = require('../../helpers/validateFields');
const {Op} = require("sequelize");
async function getBooks(filters = {}, user) {
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
    if (user) {
        include.push({
            model: db.User,
            as: 'Library',
            attributes: ['username'],
            through: {
                model: db.UserBook,
                attributes: ['status'],
                where: {userId: user.id}
            },
            required: false
        });
    }
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
    const normalizedBooks = books.map((book) => {
        const json = book.toJSON();
        
        if (json.Library?.length === 1) {
            json.UserBook = json.Library[0].UserBook;
        } 
        delete json.Library;
        return json;
    })
    for (const book of normalizedBooks) {
        validateFields(book, ['Title', 'ISBN', 'Authors', 'Genres'], 'Book');
    }
    return normalizedBooks;
}
async function getBookById(id, user) {
    const include = [Author, Genre];
    if (user) {
        include.push({
            model: db.User,
            as: 'Library',
            attributes: ['username'],
            through: {
                attributes: ['status'],
                where: {userId: user.id}
            },
            required: false
        });
    }
    const book = await Book.findByPk(id, {include});
    validateFields(book, ['Title', 'ISBN', 'Authors', 'Genres'], 'Book');
    return book;
}
module.exports = { getBooks, getBookById };