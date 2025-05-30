const express = require('express');
const router = express.Router();

const { getGenres, getGenreById } = require("../../services/genres/get");
const { createGenre } = require("../../services/genres/post");

router.get('/genres', async (req, res, next) => {
    try {
        const result = await getGenres();
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

module.exports = router;
