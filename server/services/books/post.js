const db = require('../../models');
const { Book, Author, Genre } = db;
const { validateFields } = require('../../helpers/validateFields');
const {getAuthorById} = require("../authors/get");
const {getGenreById} = require("../genres/get");

async function checkIfAuthorExists(authorIds) {
    for (const id of authorIds) {
        const author = await getAuthorById(id);
        if (!author) {
            const error = new Error(`Author with id ${id} does not exist`);
            error.status = 404;
            throw error;
        }
    }
}

async function checkIfGenreExists(genreIds) {
    for (const id of genreIds) {
        const genre = await getGenreById(id);
        if (!genre) {
            const error = new Error(`Genre with id ${id} does not exist`);
            error.status = 404;
            throw error;
        }
    }
}

async function createBook(book) {
    validateFields(book, ['Title', 'ISBN', 'AuthorId', 'GenreId'], 'Book');
    

    let authorIds = book.AuthorId;
    let genreIds = book.GenreId;

    if (typeof authorIds === 'string') {
        try {
            authorIds = JSON.parse(authorIds);
        } catch {
            throw new Error('Wrong authorId format');
        }
    }
    if (!Array.isArray(authorIds)) {
        authorIds = [authorIds];
    }

    if (typeof genreIds === 'string') {
        try {
            genreIds = JSON.parse(genreIds);
        } catch {
            throw new Error('Wrong genreId format');
        }
    }
    if (!Array.isArray(genreIds)) {
        genreIds = [genreIds];
    }
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
