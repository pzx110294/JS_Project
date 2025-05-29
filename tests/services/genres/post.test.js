const db = require('../../../server/models')
const { createGenre } = require('../../../server/services/genres/post');

beforeEach(async () => {
    await db.sequelize.sync({ force: true });
});

test('creates a valid genre', async () => {
    const name = 'Test Genre';
    const genre = { Name: name };
    
    const result = await createGenre(genre);
    expect(result).toBeDefined();
    expect(result.Name).toBe(name);
});
test('throws error if missing Name', async () => {
    const name = '';
    const genre = { Name: name };

    await expect(createGenre(genre)).rejects.toThrow('Empty Name field');
});