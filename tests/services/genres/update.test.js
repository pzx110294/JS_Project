const db = require('../../../server/models');
const { updateGenreById } = require('../../../server/services/genres/put');
const { seedData } = require('../../../server/db/seedData');

let authors, genres, books;

beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    [authors, genres, books] = await seedData();
});

test('successfully updates an existing genre', async () => {
    const updated = await updateGenreById(genres[0].id, { Name: 'Updated Genre Name' });
    expect(updated.Name).toBe('Updated Genre Name');

    const dbGenre = await db.Genre.findByPk(genres[0].id);
    expect(dbGenre.Name).toBe('Updated Genre Name');
});

test('throws error if genre not found', async () => {
    const nonExistentId = 9999;
    await expect(updateGenreById(nonExistentId, { Name: 'Ghost Genre' }))
        .rejects
        .toThrow(`Genre with id ${nonExistentId} not found`);
});

test('throws error for empty Name field', async () => {
    await expect(updateGenreById(genres[1].id, { Name: '' }))
        .rejects
        .toThrow('Empty Name field');
});

test('throws error if data is missing', async () => {
    await expect(updateGenreById(genres[2].id, {}))
        .rejects
        .toThrow('Empty Name field');
});
