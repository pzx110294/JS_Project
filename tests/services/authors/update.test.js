const db = require('../../../server/models');
const { updateAuthorById } = require('../../../server/services/authors/put');
const { seedData } = require('../../../server/db/seedData');

let authors, genres, books;

beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    [authors, genres, books] = await seedData();
});

test('successfully updates an existing author', async () => {
    const updated = await updateAuthorById(authors[0].id, { Name: 'Updated Author Name' });
    expect(updated.Name).toBe('Updated Author Name');

    const dbAuthor = await db.Author.findByPk(authors[0].id);
    expect(dbAuthor.Name).toBe('Updated Author Name');
});

test('throws error if author not found', async () => {
    const nonExistentId = 9999;
    await expect(updateAuthorById(nonExistentId, { Name: 'Ghost Author' }))
        .rejects
        .toThrow(`Author with id ${nonExistentId} not found`);
});

test('throws error for empty Name field', async () => {
    await expect(updateAuthorById(authors[1].id, { Name: '' }))
        .rejects
        .toThrow('Empty Name field');
});

test('throws error if data is missing', async () => {
    await expect(updateAuthorById(authors[2].id, {}))
        .rejects
        .toThrow('Empty Name field');
});
