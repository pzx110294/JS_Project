const express = require('express');
const router = express.Router();
const {getResource, getResourceById} = require('../services/getResource');
router.get('/api/resource', async (req, res) => {
    const result = await getResource();
    res.json(result);
})
router.get('/api/resource/:id', async (req, res) => {
    const result = await getResourceById(req.params.id);
    res.json(result);
})
module.exports = router;