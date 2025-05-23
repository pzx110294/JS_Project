const db = require('../../models');
const {Book, Author } = db;
async function getAuthors() {
    const data = await Author.findAll({include: [Book]})
    return data;
}

module.exports = getAuthors;