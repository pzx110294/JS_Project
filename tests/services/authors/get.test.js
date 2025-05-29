
const db = require('../../../server/models')
const { getAuthors, getAuthorById} = require('../../../server/services/authors/get');
const { createTestData } = require('../../helpers/testData');

let authors;

beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    [ authors ] = await createTestData();
});

test('returns authors', async () => {
    const result = await getAuthors();
    expect(result).toBeDefined();
    expect(result.length).toBe(2);
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
