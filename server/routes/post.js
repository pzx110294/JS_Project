const express = require('express');
const router = express.Router();
const {createResource} = require('../services/createResource');
router.post('/api/resource', async (req, res) => {
    console.log('test ' + req.body);
    const newResource = await createResource(req.body);
    res.json(newResource);
})

module.exports = router;