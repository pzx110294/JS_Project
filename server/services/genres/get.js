const db = require('../../models');
const {validateFields} = require("../../helpers/validateFields");
const {Book, Genre } = db;

async function getGenres() {
    const data = await Genre.findAll({include: [Book]})
    return data;
}

async function getGenreById(id) {
    const data = await Genre.findByPk(id);
    validateFields(data, ['Name'], 'Genre');
    return data;
}

module.exports = { getGenres, getGenreById };