const db = require('../../../server/models')
const { getGenres, getGenreById} = require('../../../server/services/genres/get');
const { createTestData } = require('../../helpers/testData');

let authors, genres;

beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    [ authors, genres ] = await createTestData();
});

test('returns genres', async () => {
    const result = await getGenres();
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
    expect(result[0].Name).toBe(genres[0].Name);
    expect(result[1].Name).toBe(genres[1].Name);
});
test('returns genre with specific id', async () => {
    const result = await getGenreById(genres[0].id);

    expect(result.Name).toBe(genres[0].Name);
    expect(result.ISBN).toBe(genres[0].ISBN);
});
test('returns genre with invalid id', async () => {
    
    await expect(getGenreById(999)).rejects.toThrow();
})