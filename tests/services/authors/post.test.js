const db = require('../../../server/models')
const { createAuthor } = require('../../../server/services/authors/post');

beforeEach(async () => {
    await db.sequelize.sync({ force: true });
});

test('creates a valid author', async () => {
    const name = 'Test Author';
    const author = { Name: name };
    
    const result = await createAuthor(author);
    expect(result).toBeDefined();
    expect(result.Name).toBe(name);
});
test('throws error if missing Name', async () => {
    const name = '';
    const author = { Name: name };

    await expect(createAuthor(author)).rejects.toThrow('Empty Name field');
});