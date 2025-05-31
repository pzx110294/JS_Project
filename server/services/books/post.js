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

    let authorIds = book.AuthorId;
    let genreIds = book.GenreId;

    if (typeof authorIds === 'string') {
        try {
            authorIds = JSON.parse(authorIds);
        } catch {
            throw new Error('Wrong authorId format');
        }
    }

    if (typeof genreIds === 'string') {
        try {
            genreIds = JSON.parse(genreIds);
        } catch {
            throw new Error('Wrong genreId format');
        }
    }

    await newBook.setAuthors(authorIds);
    await newBook.setGenres(genreIds);
    
    const result = await Book.findByPk(newBook.id, {
        include: [Author, Genre]
    });
    return result;
}

module.exports = { createBook };
