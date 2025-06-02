const db = require('../../models');
const {checkIfBookExists} = require("../../helpers/checkIfExists");
const { UserBook } = db;

async function addBookToLibrary(userId, bookId, status) {
  const validStatuses = ['to read', 'reading', 'finished'];
  if (status && !validStatuses.includes(status)) {
    const error = new Error(`Invalid status: ${status}`);
    error.status = 400;
    throw error;
  }
  await checkIfBookExists(bookId);

  const [userBook, created] = await UserBook.findOrCreate({
    where: { UserId: userId, BookId: bookId },
    defaults: {
      UserId: userId, 
      BookId: bookId, 
      status: status 
    }
  });
  
  if (!created) {
    const error = new Error('Book is already in library');
    error.status = 409;
    throw error;
  }
  
  return userBook;
}

module.exports = { addBookToLibrary };