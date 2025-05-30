const express = require('express');
const router = express.Router();

const { getBooks, getBookById }= require("../../services/books/get");
const {createBook} = require("../../services/books/post");

function prepareFilters(req) {
    return {
        Title: req.Title,
        ISBN: req.ISBN,
        PublicationDate: req.PublicationDate,
        AuthorId: req.AuthorId,
        GenreId: req.GenreId,
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

})

router.post('/books', async (req, res, next) => {
    try {
        const newBook = await createBook(req.body);
        res.status(201).json(newBook);
    }
    catch (error) {
        next(error);
    } 
})

module.exports = router;
