const db = require('../../models');
const { validateFields } = require('../../helpers/validateFields');

async function createAuthor(author) {
    validateFields(author, ['Name'], 'Author');

    const newAuthor = await db.Author.create(author);
    const result = db.Author.findByPk(newAuthor.id);
    return result;
}

module.exports = { createAuthor };
