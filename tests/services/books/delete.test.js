const db = require('../../../server/models');
const { seedData } = require('../../../server/db/seedData');
const { deleteBookById } = require('../../../server/services/books/delete');
const { getBooks, getBookById } = require("../../../server/services/books/get");

let authors, genres, books;

beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    [ authors, genres, books ] = await seedData();
});

test('deletes book with id 1', async () => {
    const initialBook = await getBookById(1);
    expect(initialBook.Title).toBe('Test book1');

    const result = await deleteBookById(1);
    expect(result).toEqual({message: 'deleted book with id 1'});

    await expect(getBookById(1)).rejects.toThrow();
});

test('deletes book with incorrect id', async () => {
    const incorrectId = 'incorrect id';
    await expect(deleteBookById(incorrectId)).rejects.toThrow(`could not find book with id ${incorrectId}`);
});

test('deleting book does not affect authors', async () => {
    const author = await db.Author.findByPk(1);
    expect(author.Name).toBe('Test Author 1');

    await deleteBookById(1);

    const sameAuthor = await db.Author.findByPk(1);
    expect(sameAuthor.Name).toBe('Test Author 1');
});