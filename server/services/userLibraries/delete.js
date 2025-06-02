const db = require('../../models');
async function deleteLibraryBook(userId, bookId) {
    const userBook = await db.UserBook.findOne({
        where: { UserId: userId, BookId: bookId }
    });

    if (!userBook) {
        const error = new Error(`Book with ID ${bookId} not found in user's library`);
        error.status = 404;
        throw error;
    }

    await userBook.destroy();
    return { message: `Book with ID ${bookId} deleted successfully` };
}

module.exports = { deleteLibraryBook };