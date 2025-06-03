const path = require("path");
const viewsPath = path.join(__dirname, '../../../client/views/');

module.exports = (router) => {
    router.get('/addAuthor', (req, res) => {
        res.sendFile(viewsPath + 'addAuthor.html');
    });
};
