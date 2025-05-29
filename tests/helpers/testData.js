async function createTestData() {
    const db = require("../../server/models");
    let authors = await db.Author.bulkCreate([
        { Name: 'Test Author 1' },
        { Name: 'Test Author 2' }
    ]);
    let genres = await db.Genre.bulkCreate([
        { Name: 'Test Genre 1' },
        { Name: 'Test Genre 2' }
    ]);

    let books = await db.Book.bulkCreate([{
        Title: 'Test book1',
        ISBN: '1234-5678',
        PublicationDate: new Date()
    }, {
        Title: 'Test book2',
        ISBN: '9999-9999',
        PublicationDate: new Date()
    }]);

    await books[0].setAuthors([authors[0].id, authors[1].id]);
    await books[0].setGenres([genres[0].id]);
    await books[1].setAuthors(authors[1].id);
    await books[1].setGenres([genres[0].id, genres[1].id]);
    return [ authors, genres, books ];
}

module.exports = { createTestData };