
const db = require('../../../server/models')
const { getAuthors, getAuthorById} = require('../../../server/services/authors/get');
const { createTestData } = require('../../helpers/testData');
const {getGenres} = require("../../../server/services/genres/get");

let authors;

beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    [ authors ] = await createTestData();
});

test('returns authors', async () => {
    const result = await getAuthors();
    expect(result).toBeDefined();
    expect(result.length).toBe(authors.length);
    expect(result[0].Name).toBe(authors[0].Name);
    expect(result[1].Name).toBe(authors[1].Name);
});
test('returns author with specific id', async () => {
    const result = await getAuthorById(authors[0].id);

    expect(result.Name).toBe(authors[0].Name);
    expect(result.ISBN).toBe(authors[0].ISBN);
});
test('returns author with invalid id', async () => {

    await expect(getAuthorById(999)).rejects.toThrow();
})
test('filters authors by exact name match', async () => {
    const result = await getAuthors({ Name: 'George Orwell' });

    expect(result.length).toBe(1);
    expect(result[0].Name).toBe('George Orwell');
});
test('filters authors by partial name match', async () => {
    const result = await getAuthors({ Name: 'J.K.' });

    expect(result.length).toBe(1);
    expect(result[0].Name).toMatch(/J.K. Rowling/i);
});

test('returns empty array when no author matches', async () => {
    const result = await getAuthors({ Name: 'Nonexistent Author' });

    expect(result).toEqual([]);
});

test('includes associated books for each author', async () => {
    const result = await getAuthors();

    for (const author of result) {
        for (const book of author.Books) {
            expect(book.Title).toBeDefined();
            expect(book.ISBN).toBeDefined();
        }
    }
});
