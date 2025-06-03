const path = require("path");
const viewsPath = path.join(__dirname, '../../../client/views/');

module.exports = (router) => {
    router.get('/addGenre', (req, res) => {
        res.sendFile(viewsPath + 'addGenre.html');
    });
};
