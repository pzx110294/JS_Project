const db = require('../../models');
const { validateFields } = require('../../helpers/validateFields');
const {normalizeIds} = require("../../helpers/normalize");
const {checkIfAuthorExists, checkIfGenreExists} = require("../../helpers/checkIfExists");

async function updateBookById(id, book) {
    validateFields(book, ['Title', 'ISBN', 'AuthorId', 'GenreId'], 'Book');

    let authorIds = normalizeIds(book.AuthorId, 'authorId');
    let genreIds = normalizeIds(book.GenreId, 'genreId');

    await checkIfAuthorExists(authorIds);
    await checkIfGenreExists(genreIds);
    
    const existingBook = await db.Book.findByPk(id);
    if (!existingBook) {
        const error = new Error(`Book with id ${id} not found`);
        error.status = 404;
        throw error;
    }
    await existingBook.update({
        Title: book.Title,
        ISBN: book.ISBN,
        PublicationDate: book.PublicationDate
    });
    await existingBook.setAuthors(authorIds);
    await existingBook.setGenres(genreIds);
    const updatedBook = await db.Book.findByPk(id, {
        include: [db.Author, db.Genre]
    } );
    return updatedBook;
}
module.exports = { updateBookById }
