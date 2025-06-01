const db = require('../../models');

async function createBook(req) {
    const { Title, ISBN, PublicationDate, Authors } = req.body;

    // Przygotuj dane książki
    const bookData = {
        Title,
        ISBN,
        PublicationDate: PublicationDate || null,
        CoverUrl: req.file ? '/images/' + req.file.filename : null
    };

    // Utwórz książkę
    const newBook = await db.Book.create(bookData);

    // Obsługa autorów (jeśli przekazani)
    if (Authors) {
        const authorNames = Authors.split(',').map(name => name.trim());
        const authorInstances = await Promise.all(
            authorNames.map(name =>
                db.Author.findOrCreate({ where: { Name: name } }).then(([author]) => author)
            )
        );
        await newBook.setAuthors(authorInstances);
    }

    return newBook;
}

module.exports = {
    createBook
};