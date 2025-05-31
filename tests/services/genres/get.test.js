const db = require('../../../server/models')
const { getGenres, getGenreById} = require('../../../server/services/genres/get');
const { seedData } = require('../../../server/db/seedData');
let authors, genres;

beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    [ authors, genres ] = await seedData();
});

test('returns genres', async () => {
    const result = await getGenres();
    
    expect(result).toBeDefined();
    expect(result.length).toBe(genres.length);
    for (let i = 0; i < genres.length; i++) {
        expect(result[i].Name).toBe(genres[i].Name);
    }
});
test('returns genre with specific id', async () => {
    const result = await getGenreById(genres[0].id);

    expect(result.Name).toBe(genres[0].Name);
    expect(result.ISBN).toBe(genres[0].ISBN);
});
test('returns genre with invalid id', async () => {
    
    await expect(getGenreById(999)).rejects.toThrow();
})
test('filters genres by exact name match', async () => {
    const result = await getGenres({ Name: 'Fantasy' });

    expect(result.length).toBe(1);
    expect(result[0].Name).toBe('Fantasy');
});
test('filters genres by partial name match', async () => {
    const result = await getGenres({ Name: 'Sci' });

    expect(result.length).toBe(1);
    expect(result[0].Name).toMatch(/Science Fiction/i);
});

test('returns empty array when no genre matches', async () => {
    const result = await getGenres({ Name: 'Nonexistent Genre' });

    expect(result).toEqual([]);
});

test('includes associated books for each genre', async () => {
    const result = await getGenres();

    for (const genre of result) {
        for (const book of genre.Books) {
            expect(book.Title).toBeDefined();
            expect(book.ISBN).toBeDefined();
        }
    }
});