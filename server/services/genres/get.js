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


async function getGenreById(id) {
    const data = await Genre.findByPk(id, {include: Book});
    validateFields(data, ['Name'], 'Genre');
    return data;
}

module.exports = { getGenres, getGenreById };