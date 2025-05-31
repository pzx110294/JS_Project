const db = require('../../../server/models')
const { seedData } = require('../../../server/db/seedData');
const { deleteAuthorById } = require('../../../server/services/authors/delete')
const { getBooks, getBookById} = require("../../../server/services/books/get");

let authors, genres, books;

beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    [ authors, genres,  books ] = await seedData();
});

test('deletes author with id 1', async () => {
    let authorsBooks = await getBooks({AuthorId: 1});
    expect(authorsBooks.length).toBe(2);
    
    let book1 = await getBookById(1);
    expect(book1.Authors.length).toBe(2);
    
    const result = await deleteAuthorById(1);
    expect(result).toEqual({message: 'deleted author with id 1'});
    
    book1 = await getBookById(1);
    expect(book1.Authors.length).toBe(1);
    await expect(getBookById(2)).rejects.toThrow();
})
test('deletes author with incorrect id', async () => {
    const incorrectId = 'incorrect id';
    await expect(deleteAuthorById(incorrectId)).rejects.toThrow(`could not find author with id ${incorrectId}`);
})
