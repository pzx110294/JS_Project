const db = require('../../models');

async function deleteAuthorById(id) {
    const books = await db.Book.findAll({
        include: {
            model: db.Author,
            where: {id: id}
        }
    });
    const deletedRows = await db.Author.destroy({
        where: {id : id}
    });
    if (deletedRows === 0) {
         const error =  new Error(`could not find author with id ${id}`);
         error.status = 404;
         throw error;
    }
    for (const book of books) {
        const remainingAuthors = await book.getAuthors();
        if (remainingAuthors.length === 0) {
            await book.destroy();
        }
    } 
    return {message: `deleted author with id ${id}`}
}
module.exports = { deleteAuthorById }