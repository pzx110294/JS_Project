const db = require('../../models');

async function deleteBookById(id) {
    const deletedRows = await db.Book.destroy({
        where: {id : id}
    });
    if (deletedRows === 0) {
        const error =  new Error(`could not find book with id ${id}`);
        error.status = 404;
        throw error;
    }
    return {message: `deleted book with id ${id}`}
}
module.exports = { deleteBookById }

