const express = require('express');
const router = express.Router();

const { getGenres, getGenreById } = require("../../services/genres/get");
const { createGenre } = require("../../services/genres/post");
const {deleteGenreById} = require("../../services/genres/delete");

router.get('/genres', async (req, res, next) => {
    try {
        let filters = {
            Name: req.query.Name
        }
        const result = await getGenres(filters);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.get('/genres/:id', async (req, res, next) => {
    try {
        const result = await getGenreById(req.params.id);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.post('/genres', async (req, res, next) => {
    try {
        const newGenre = await createGenre(req.body);
        res.status(201).json(newGenre);
    }
    catch (error) {
        next(error);
    }
})
router.delete('/genres/:id', async (req, res, next) => {
    try {
        const deletedGenre = await deleteGenreById(req.params.id);
        res.json(deletedGenre);
    }
    catch (error) {
        next(error);
    }
});

module.exports = router;
