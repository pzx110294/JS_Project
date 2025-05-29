const express = require('express');
const router = express.Router();

const { getBooks, getBookById }= require("../../services/books/get");
const {createBook} = require("../../services/books/post");

router.get('/books', async (req, res, next) => {
    try {
        const result = await getBooks();
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
