const express = require('express');
const router = express.Router();
const {createResource} = require('../../services/createResource');
router.post('/resource', async (req, res, next) => {
    console.log('request: ' + JSON.stringify(req.body));
    try {
        const newResource = await createResource(req.body);
        res.status(201).json(newResource);
    }
    catch (error) {
        next(error);
    }
})

module.exports = router;