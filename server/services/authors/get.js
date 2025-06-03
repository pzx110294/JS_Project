const db = require('../../models');
const {validateFields} = require("../../helpers/validateFields");
const {Op} = require("sequelize");
const {Book, Author } = db;

async function getAuthors(filters = {}) {
    let where = {};
    const include = [
        {
            model: Book,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            through: { attributes: [] }
        }
    ];
    if (filters.Name) {
        where.Name = {[Op.like]: `%${filters.Name}%`};
    }
    const authors = await Author.findAll({
        where,
        include,
        attributes: { exclude: ['createdAt', 'updatedAt']}
    });
    for (const author of authors) {
        validateFields(author, ['Name'], 'Author');
    } 
    return authors;
}

async function getAuthorById(id, user) {
    let include = [
        {
            model: Author,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            through: { attributes: [] }
        },
        {
            model: db.Genre,
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
    const data = await Author.findByPk(id, {
        include: [
            {
                model: Book,
                include,
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                through: { attributes: [] }
            }
        ],
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    validateFields(data, ['Name'], 'Author');
    const plainData = data.toJSON();
    
    let normalizedBooks = [];
    if (data && plainData.Books) {
        normalizedBooks = plainData.Books.map((book) => {
            if (book.Library?.length === 1) {
                book.UserBook = book.Library[0].UserBook;
            }
            delete book.Library;
            return book;
        });
    }
    plainData.Books = normalizedBooks;
    return plainData;
}

module.exports = { getAuthors, getAuthorById };