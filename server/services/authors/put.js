const db = require('../../models');
const { validateFields } = require('../../helpers/validateFields');

async function updateAuthorById(id, author) {
    validateFields(author, ['Name'], 'Author');
    
    const [updatedRows ] = await db.Author.update(author, {
        where: {id: id}
    })
    if (updatedRows ===  0 ) {
        const error = new Error(`Author with id ${id} not found`);
        error.status = 404;
        throw error;
    }
    const updatedAuthor = await db.Author.findByPk(id, {include: db.Book});
    return updatedAuthor;
}
module.exports = { updateAuthorById }