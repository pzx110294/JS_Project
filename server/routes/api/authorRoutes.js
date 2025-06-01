const express = require('express');
const router = express.Router();

const { getAuthors, getAuthorById } = require("../../services/authors/get");
const { createAuthor } = require("../../services/authors/post");
const { updateAuthorById } = require("../../services/authors/put");
const { deleteAuthorById } = require("../../services/authors/delete");
const { auth } = require("../../middleware/authMiddleware");

router.get('/authors', async (req, res, next) => {
    try {
        let filters = {
            Name: req.query.Name
        }
        const result = await getAuthors(filters);
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
router.post('/authors', auth(['admin']), async (req, res, next) => {
    try {
        const newAuthor = await createAuthor(req.body);
        res.status(201).json(newAuthor);
    }
    catch (error) {
        next(error);
    }
})
router.put('/authors/:id', auth(['admin']), async (req, res, next) => {
    try {
        const updateAuthor = await updateAuthorById(req.params.id, req.body);
        res.json(updateAuthor);
    } 
    catch (error) {
        next(error);
    }
});
router.delete('/authors/:id', auth(['admin']), async (req, res, next) => {
    try {
        const deletedAuthor = await deleteAuthorById(req.params.id);
        res.json(deletedAuthor);
    }
    catch (error) {
        next(error);
    }
});
module.exports = router;
