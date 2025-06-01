const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/authMiddleware');
const { addBookToLibrary } = require('../../services/userLibraries/post');
const { getUserLibrary } = require('../../services/userLibraries/get');
const {updateLibraryStatus} = require("../../services/userLibraries/put");

router.post('/library', auth(['user', 'admin']), async (req, res, next) => {
  try {
    const result = await addBookToLibrary(req.user.id, req.body.BookId, req.body.status);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
router.put('/library/:id', auth(['user', 'admin']), async (req, res, next) => {
  try {
    const result = await updateLibraryStatus(req.user.id, req.params.id, req.body.status);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
router.get('/library', auth(['user', 'admin']), async (req, res, next) => {
  try {
    const result = await getUserLibrary(req.user.id, req.query.status);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;