const express = require('express');
const router = express.Router();

const path = require("path");
const viewsPath = path.join(__dirname, '../../client/views/');
router.get('/', (req, res) => {
    res.sendFile(viewsPath + 'index.html');
});
router.get('*', (req, res) => {
   res.status(404).sendFile(viewsPath + '404.html');
})
module.exports = router;