const db = require('../../models');

async function deleteGenreById(id) {
    const books = await db.Book.findAll({
        include: {
            model: db.Genre,
            where: {id: id}
        }
    });
    const deletedRows = await db.Genre.destroy({
        where: {id : id}
    });
    if (deletedRows === 0) {
         const error =  new Error(`could not find genre with id ${id}`);
         error.status = 404;
         throw error;
    }
    for (const book of books) {
        const remainingGenres = await book.getGenres();
        if (remainingGenres.length === 0) {
            await book.destroy();
        }
    } 
    return {message: `deleted genre with id ${id}`}
}
module.exports = { deleteGenreById }