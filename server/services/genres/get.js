const db = require('../../models');
const {validateFields} = require("../../helpers/validateFields");
const {Op} = require("sequelize");
const {Book, Genre } = db;

async function getGenres(filters = {}) {
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
    const genres = await Genre.findAll({
        where,
        include,
        attributes: { exclude: ['createdAt', 'updatedAt']}
    });
    for (const genre of genres) {
        validateFields(genre, ['Name'], 'Genre');
    }
    return genres;
}


async function getGenreById(id, user) {
    let include = [
        {
            model: db.Author,
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
    const data = await Genre.findByPk(id, {
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
    validateFields(data, ['Name'], 'Genre');
    const plainData = data.toJSON();

    let normalizedBooks = [];
    if (plainData.Books) {
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

module.exports = { getGenres, getGenreById };
