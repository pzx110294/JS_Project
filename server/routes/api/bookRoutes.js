const express = require('express');
const router = express.Router();

const { getBooks, getBookById } = require("../../services/books/get");
const { createBook } = require("../../services/books/post");
const { deleteBookById } = require("../../services/books/delete");
const {updateBookById} = require("../../services/books/put");
const {auth} = require("../../middleware/authMiddleware");

function prepareFilters(query) {
    return {
        Title: query.Title,
        ISBN: query.ISBN,
        PublicationDate: query.PublicationDate,
        AuthorId: query.AuthorId,
        GenreId: query.GenreId,
    }
}
router.get('/books', auth([], true), async (req, res, next) => {
    try {
        const filters = prepareFilters(req.query);
        const result = await getBooks(filters, req.user);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.get('/books/:id', auth([], true), async (req, res, next) => {
    try {
        const result = await getBookById(req.params.id, req.user);
        if (result) {
            res.json(result);
        }
    }
    catch (error) {
        next(error);
    }
});
router.post('/books', auth(['admin']), async (req, res, next) => {
    try {
        const newBook = await createBook(req.body);
        res.status(201).json(newBook);
    }
    catch (error) {
        next(error);
    }
});
router.put('/books/:id', auth(['admin']), async (req, res, next) => {
    try {
        const updatedBook = await updateBookById(req.params.id, req.body);
        res.json(updatedBook);
    }
    catch (error) {
        next(error);
    }
})
router.delete('/books/:id', auth(['admin']), async (req, res, next) => {
    try {
        const deletedBook = await deleteBookById(req.params.id);
        res.json(deletedBook);
    }
    catch (error) {
        next(error);
    }
});
module.exports = router;
