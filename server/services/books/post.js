const db = require('../../models');
const { Book, Author } = db;
async function createBook(book) {
    console.log(typeof Book.prototype.setAuthors);
    if (!book.hasOwnProperty('AuthorId')) {
        const error = new Error("Empty Author field");
        error.status = 422;
        throw error;
    }
 
    const t = await Book.sequelize.transaction();
    try {
        const newBook = await Book.create({
            Title: book.Title,
            ISBN: book.ISBN,
            PublicationDate: book.PublicationDate
        }, { transaction: t });

        await newBook.setAuthors(book.AuthorId, { transaction: t });

        await t.commit();
        const result = await Book.findByPk(newBook.id, {
            include: [Author]
        });
        return result;
    } catch (err) {
        await t.rollback();
        throw err;
    }
}


module.exports = { createBook };
