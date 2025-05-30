const db = require('../../models');
const {validateFields} = require("../../helpers/validateFields");
const {Book, Author } = db;

async function getAuthors() {
    const data = await Author.findAll({include: Book})
    return data;
}

async function getAuthorById(id) {
    const data = await Author.findByPk(id, {include: Book});
    validateFields(data, ['Name'], 'Author');
    return data;
}

module.exports = { getAuthors, getAuthorById };