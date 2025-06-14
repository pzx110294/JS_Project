const path = require("path");
const viewsPath = path.join(__dirname, '../../../client/views/');

module.exports = (router) => {
    router.get('/addAuthor', (req, res) => {
        res.sendFile(viewsPath + 'addAuthor.html');
    });
    router.get('/authors/:id', (req, res) => {
        res.sendFile(viewsPath + 'author.html');
    });
    router.get('/editAuthor/:id', (req, res) => {
        res.sendFile(viewsPath + 'editAuthor.html');
    })
};
