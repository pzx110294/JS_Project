const db = require('../../../server/models');
const { seedData } = require('../../../server/db/seedData');
const { updateBookById } = require('../../../server/services/books/put');

let authors, genres, books;

beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    [authors, genres, books] = await seedData();
});

describe('updateBookById', () => {
    it('updates book title, ISBN, date, authors, and genres correctly', async () => {
        const bookToUpdate = books[0];
        const updated = await updateBookById(bookToUpdate.id, {
            Title: 'Updated Book Title',
            ISBN: 'UPDATED-ISBN',
            PublicationDate: new Date('2025-01-01'),
            AuthorId: [authors[2].id],
            GenreId: [genres[2].id, genres[3].id] 
        });

        expect(updated.Title).toBe('Updated Book Title');
        expect(updated.ISBN).toBe('UPDATED-ISBN');
        expect(new Date(updated.PublicationDate).toISOString()).toBe(new Date('2025-01-01').toISOString());

        const authorNames = updated.Authors.map(a => a.Name);
        expect(authorNames).toContain('Unique Author');
        expect(authorNames).not.toContain('Test Author 1');

        const genreNames = updated.Genres.map(g => g.Name);
        expect(genreNames).toContain('Unique Genre');
        expect(genreNames).toContain('Fiction');
    });

    it('throws if book ID does not exist', async () => {
        await expect(updateBookById(9999, {
            Title: 'Nope',
            ISBN: 'NOPE',
            PublicationDate: new Date(),
            AuthorId: [authors[0].id],
            GenreId: [genres[0].id]
        })).rejects.toThrow('Book with id 9999 not found');
    });

    it('throws if any author ID does not exist', async () => {
        const bookToUpdate = books[1];
        await expect(updateBookById(bookToUpdate.id, {
            Title: 'Invalid Author',
            ISBN: 'FAIL-AUTHOR',
            PublicationDate: new Date(),
            AuthorId: [999],
            GenreId: [genres[0].id]
        })).rejects.toThrow('Author not found');
    });

    it('throws if any genre ID does not exist', async () => {
        const bookToUpdate = books[1];
        await expect(updateBookById(bookToUpdate.id, {
            Title: 'Invalid Genre',
            ISBN: 'FAIL-GENRE',
            PublicationDate: new Date(),
            AuthorId: [authors[0].id],
            GenreId: [999]
        })).rejects.toThrow('Genre not found');
    });

    it('parses stringified JSON arrays', async () => {
        const bookToUpdate = books[2];
        const updated = await updateBookById(bookToUpdate.id, {
            Title: 'Parsed JSON Book',
            ISBN: 'JSON-123',
            PublicationDate: new Date('2025-05-30'),
            AuthorId: JSON.stringify([authors[4].id]),
            GenreId: JSON.stringify([genres[5].id])
        });

        const authorNames = updated.Authors.map(a => a.Name);
        const genreNames = updated.Genres.map(g => g.Name);
        expect(authorNames).toContain('George Orwell');
        expect(genreNames).toContain('Fantasy');
    });

    it('throws on bad JSON in AuthorId', async () => {
        const bookToUpdate = books[2];
        await expect(updateBookById(bookToUpdate.id, {
            Title: 'Bad JSON',
            ISBN: 'BAD-JSON',
            PublicationDate: new Date(),
            AuthorId: '[1,2', 
            GenreId: [genres[0].id]
        })).rejects.toThrow('Wrong authorId format');
    });

    it('throws on missing required fields', async () => {
        await expect(updateBookById(books[0].id, {
            Title: '',
            ISBN: '',
            PublicationDate: '',
            AuthorId: '',
            GenreId: ''
        })).rejects.toThrow('Empty Title field');
    });
});
