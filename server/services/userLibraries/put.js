const db = require('../../models');

async function updateLibraryStatus(userId, bookId, status = 'to read') {
    const validStatuses = ['to read', 'reading', 'finished'];

    if (!validStatuses.includes(status)) {
        const error = new Error(`Invalid status: ${status}`);
        error.status = 400;
        throw error;
    }

    const userBook = await db.UserBook.findOne({
        where: { UserId: userId, BookId: bookId },
        attributes: { exclude: ['createdAt', 'updatedAt'] } 
    });

    if (!userBook) {
        const error = new Error(`Book with ID ${bookId} not found in user's library`);
        error.status = 404;
        throw error;
    }

    await userBook.update({ status },  );
    return userBook;
}

module.exports = { updateLibraryStatus };
