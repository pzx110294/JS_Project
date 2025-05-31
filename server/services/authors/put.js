const db = require('../../models');
const { validateFields } = require('../../helpers/validateFields');

async function updateAuthorById(id, author) {
    validateFields(author, ['Name'], 'Author');
    const updatedAuthor = await db.Author.update(author, {
        where: {id: id}
    })
    return updatedAuthor;
}
module.exports = { updateAuthorById }