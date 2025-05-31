const db = require("../../server/models");
async function seedData() {
    if (await db.Book.count() > 0) {
        return;
    }
    let authors = await db.Author.bulkCreate([
        { Name: 'Test Author 1' },
        { Name: 'Test Author 2' },
        { Name: 'Unique Author' },
        { Name: 'Jane Austen' },
        { Name: 'George Orwell' },
        { Name: 'J.K. Rowling' },
        { Name: 'Isaac Asimov' }
    ]);

    let genres = await db.Genre.bulkCreate([
        { Name: 'Test Genre 1' },
        { Name: 'Test Genre 2' },
        { Name: 'Unique Genre' },
        { Name: 'Fiction' },
        { Name: 'Science Fiction' },
        { Name: 'Fantasy' },
        { Name: 'Classic' }
    ]);

    let books = await db.Book.bulkCreate([
        {
            Title: 'Test book1',
            ISBN: '1234-5678',
            PublicationDate: new Date('2023-01-01')
        },
        {
            Title: 'Test book2',
            ISBN: '9999-9999',
            PublicationDate: new Date('2024-05-01')
        },
        {
            Title: 'Unique Book',
            ISBN: 'UNIQUE-ISBN',
            PublicationDate: new Date('2022-03-15')
        },
        {
            Title: 'Pride and Prejudice',
            ISBN: '9780451530783',
            PublicationDate: new Date('1813-01-28')
        },
        {
            Title: '1984',
            ISBN: '9788418915093',
            PublicationDate: new Date('1949-06-08')
        },
        {
            Title: 'Harry Potter and the Philosopher\'s Stone',
            ISBN: '9780439554930',
            PublicationDate: new Date('1997-06-26'),
            CoverUrl: "/images/harry-potter-philosopher-stone.jpg"
        },
        {
            Title: 'Foundation',
            ISBN: '9780553803716',
            PublicationDate: new Date('1951-01-01')
        }
    ]);

    await books[0].setAuthors([authors[0].id, authors[1].id]); // Test Author 1, Test Author 2
    await books[0].setGenres([genres[0].id]); // Test Genre 1

    await books[1].setAuthors([authors[1].id]); // Test Author 2
    await books[1].setGenres([genres[0].id, genres[1].id]); // Test Genre 1, Test Genre 2

    await books[2].setAuthors([authors[2].id]); // Unique Author
    await books[2].setGenres([genres[2].id]); // Unique Genre

    await books[3].setAuthors([authors[3].id]); // Jane Austen
    await books[3].setGenres([genres[3].id, genres[6].id]); // Fiction, Classic

    await books[4].setAuthors([authors[4].id]); // Orwell
    await books[4].setGenres([genres[4].id, genres[6].id]); // Sci-Fi, Classic

    await books[5].setAuthors([authors[5].id]); // Rowling
    await books[5].setGenres([genres[5].id]); // Fantasy

    await books[6].setAuthors([authors[6].id]); // Asimov
    await books[6].setGenres([genres[4].id]); // Sci-Fi

    return [ authors, genres, books ];
}

module.exports = { seedData };
