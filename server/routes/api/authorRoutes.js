const express = require('express');
const router = express.Router();

const { getAuthors, getAuthorById} = require("../../services/authors/get");
const { createAuthor } = require("../../services/authors/post");

router.get('/authors', async (req, res, next) => {
    try {
        const result = await getAuthors();
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.get('/authors/:id', async (req, res, next) => {
    try {
        const result = await getAuthorById(req.params.id);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
})
router.post('/authors', async (req, res, next) => {
    try {
        const newAuthor = await createAuthor(req.body);
        res.status(201).json(newAuthor);
    }
    catch (error) {
        next(error);
    }
})

module.exports = router;
