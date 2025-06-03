const path = require("path");
const viewsPath = path.join(__dirname, '../../../client/views/');

module.exports = (router) => {
    router.get('/addBook', (req, res) => {
        res.sendFile(viewsPath + 'addBook.html');
    });
    router.get('/library', (req, res) => {
        res.sendFile(viewsPath + 'library.html');
    });
};
