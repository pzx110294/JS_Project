const path = require("path");
const viewsPath = path.join(__dirname, '../../../client/views/');

module.exports = (router) => {
    router.get('/addGenre', (req, res) => {
        res.sendFile(viewsPath + 'addGenre.html');
    });
    router.get('/genres/:id', (req, res) => {
        res.sendFile(viewsPath + 'genre.html');
    });
    router.get('/editGenre/:id', (req, res) => {
        res.sendFile(viewsPath + 'editGenre.html');
    });
};
