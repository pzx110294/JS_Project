const db = require('../../../server/models')
const { getBooks, getBookById} = require('../../../server/services/books/get');
const { createTestData } = require('../../helpers/testData');
let authors, genres, books;

beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    [ authors, genres, books ] = await createTestData();
});

test('returns books with authors and genres', async () => {
    const result = await getBooks();
    
    expect(result.length).toBe(7);
    
    expect(result[0].Name).toBe(books[0].Name);
    expect(result[1].Name).toBe(books[1].Name);
    
    expect(result[0].ISBN).toBe(books[0].ISBN);
    expect(result[1].ISBN).toBe(books[1].ISBN);

    expect(new Date(result[0].PublicationDate).toISOString()).toBe(new Date(books[0].PublicationDate).toISOString());
    expect(new Date(result[1].PublicationDate).toISOString()).toBe(new Date(books[1].PublicationDate).toISOString());
    
    expect(result[0].Authors[0].Name).toBe(authors[0].Name);
    expect(result[0].Authors[1].Name).toBe(authors[1].Name);
    expect(result[0].Genres[0].Name).toBe(genres[0].Name);

    expect(result[1].Authors[0].Name).toBe(authors[1].Name);
    expect(result[1].Genres[0].Name).toBe(genres[0].Name);
    expect(result[1].Genres[1].Name).toBe(genres[1].Name);
});
test('returns book with specific id', async () => {
    const result = await getBookById(books[0].id);
    
    expect(result.Name).toBe(books[0].Name);
    expect(result.ISBN).toBe(books[0].ISBN);

    expect(result.Authors[0].Name).toBe(authors[0].Name);
    expect(result.Authors[1].Name).toBe(authors[1].Name);
    expect(result.Genres[0].Name).toBe(genres[0].Name);
});
test('returns book with invalid id', async () => {
    await expect(getBookById(999)).rejects.toThrow();
})

test('filters books by partial Title match', async () => {
    const result = await getBooks({ Title: 'Harry' });
    expect(result.length).toBe(1);
    expect(result[0].Title).toMatch(/Harry Potter/i);
});

test('filters books by exact ISBN', async () => {
    const result = await getBooks({ ISBN: '2222-2222' });
    expect(result.length).toBe(1);
    expect(result[0].Title).toBe('1984');
});

test('filters books by partial ISBN', async () => {
    const result = await getBooks({ ISBN: '2222' });
    expect(result.length).toBe(1);
    expect(result[0].Title).toBe('1984');
});

test('filters books by exact publication date', async () => {
    const result = await getBooks({ PublicationDate: '1949-06-08' });
    expect(result.length).toBe(1);
    expect(result[0].Title).toBe('1984');
});

test('filters books by author ID', async () => {
    const result = await getBooks({ AuthorId: authors[6].id }); // Isaac Asimov
    expect(result.length).toBe(1);
    expect(result[0].Title).toBe('Foundation');
});

test('returns books matching multiple filters (Title + AuthorId)', async () => {
    const result = await getBooks({
        Title: 'Foundation',
        AuthorId: authors[6].id
    });
    expect(result.length).toBe(1);
    expect(result[0].Title).toBe('Foundation');
});
