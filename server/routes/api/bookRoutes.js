const express = require('express');
const router = express.Router();

const { getBooks, getBookById } = require("../../services/books/get");
const { createBook } = require("../../services/books/post");

const multer = require('multer');
const path = require('path');

// Konfiguracja multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../../client/images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage: storage });

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
    } catch (error) {
        next(error);
    }
});

router.get('/books/:id', async (req, res, next) => {
    try {
        const result = await getBookById(req.params.id);
        if (result) {
            res.json(result);
        }
    } catch (error) {
        next(error);
    }
});

// <- tu dodaliśmy multer!
router.post('/books', upload.single('cover'), async (req, res, next) => {
    try {
        const newBook = await createBook(req);
        res.status(201).json(newBook);
    } catch (error) {
        next(error);
    }
});

module.exports = router;