const path = require("path");
const viewsPath = path.join(__dirname, '../../../client/views/');

module.exports = (router) => {
    router.get('/login', (req, res) => {
        res.sendFile(viewsPath + 'login.html');
    });
    router.get('/register', (req, res) => {
        res.sendFile(viewsPath + 'register.html');
    });
};
