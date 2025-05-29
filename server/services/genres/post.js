const db = require('../../models');
const { validateFields } = require('../../helpers/validateFields');

async function createGenre(genre) {
    validateFields(genre, ['Name'], 'Genre');

    const newGenre = await db.Genre.create(genre);
    const result = db.Genre.findByPk(newGenre.id);
    return result;
}

module.exports = { createGenre };
