const db = require('../../models');
const { Book, Author, Genre } = db;
const { validateFields } = require('../../helpers/validateFields');
async function createBook(book) {
    validateFields(book, ['Title', 'ISBN', 'AuthorId', 'GenreId'], 'Book');

    const newBook = await Book.create({
        Title: book.Title,
        ISBN: book.ISBN,
        PublicationDate: book.PublicationDate
    });
    await newBook.setAuthors(book.AuthorId);
    await newBook.setGenres(book.GenreId);

    const result = await Book.findByPk(newBook.id, {
        include: [Author, Genre]
    });
    return result;
}


module.exports = { createBook };
