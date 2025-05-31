const db = require('../../models');
const { Book, Author, Genre } = db;
const { validateFields } = require('../../helpers/validateFields');
const { normalizeIds } = require('../../helpers/normalize');
const { checkIfGenreExists, checkIfAuthorExists } = require('../../helpers/checkIfExists');
const { validateDate } = require('../../helpers/validateDate');

async function createBook(book) {
    validateFields(book, ['Title', 'ISBN', 'AuthorId', 'GenreId'], 'Book');
    validateDate(book.PublicationDate);
    
    let authorIds = normalizeIds(book.AuthorId, 'authorId');
    let genreIds = normalizeIds(book.GenreId, 'genreId');
    await checkIfAuthorExists(authorIds);
    await checkIfGenreExists(genreIds);
    const newBook = await Book.create({
        Title: book.Title,
        ISBN: book.ISBN,
        PublicationDate: book.PublicationDate
    });
    await newBook.setAuthors(authorIds);
    await newBook.setGenres(genreIds);
    
    const result = await Book.findByPk(newBook.id, {
        include: [Author, Genre]
    });
    return result;
}

module.exports = { createBook };
