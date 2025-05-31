const express = require('express');
const router = express.Router();

const { getBooks, getBookById } = require("../../services/books/get");
const { createBook } = require("../../services/books/post");
const { deleteBookById } = require("../../services/books/delete");
const {updateBookById} = require("../../services/books/put");

function prepareFilters(query) {
    return {
        Title: query.Title,
        ISBN: query.ISBN,
        PublicationDate: query.PublicationDate,
        AuthorId: query.AuthorId,
        GenreId: query.GenreId,
    }
}
router.get('/books', async (req, res, next) => {
    try {
        const filters = prepareFilters(req.query);
        const result = await getBooks(filters);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.get('/books/:id', async (req, res, next) => {
    try {
        const result = await getBookById(req.params.id);
        if (result) {
            res.json(result);
        }
    }
    catch (error) {
        next(error);
    }
});
router.post('/books', async (req, res, next) => {
    try {
        const newBook = await createBook(req.body);
        res.status(201).json(newBook);
    }
    catch (error) {
        next(error);
    }
});
router.put('/books/:id', async (req, res, next) => {
    try {
        const updatedBook = await updateBookById(req.params.id, req.body);
        res.json(updatedBook);
    }
    catch (error) {
        next(error);
    }
})
router.delete('/books/:id', async (req, res, next) => {
    try {
        const deletedBook = await deleteBookById(req.params.id);
        res.json(deletedBook);
    }
    catch (error) {
        next(error);
    }
});
module.exports = router;
