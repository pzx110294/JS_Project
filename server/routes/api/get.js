const express = require('express');
const router = express.Router();
const {getResource, getResourceById} = require('../../services/getResource');
router.get('/resource', async (req, res, next) => {
    try {
        const result = await getResource();
        res.json(result);
    }
    catch (error) {
        next(error);
    }
    
})
router.get('/resource/:id', async (req, res, next) => {
    try {
        const result = await getResourceById(req.params.id);
        if (result) {
            res.json(result);
        } else {
            const error = new Error("Resource not found");
            error.status = 404;
            next(error); 
        }
    }
    catch (error) {
        next(error);
    }
    
})
module.exports = router;