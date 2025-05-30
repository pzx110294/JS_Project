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

async function getAuthorById(id) {
    const data = await Author.findByPk(id, {include: Book, attributes: {exclude: ['createdAt', 'updatedAt']}});
    validateFields(data, ['Name'], 'Author');
    return data;
}

module.exports = { getAuthors, getAuthorById };