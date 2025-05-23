const db = require('../../models');
async function createAuthor(author) {
    const data = await db.Author.create(author);
    return [data];
}

module.exports = { createAuthor };
