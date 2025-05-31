const db = require('../../../server/models')
const { seedData } = require('../../../server/db/seedData');
const { deleteGenreById } = require('../../../server/services/genres/delete')
const { getBooks, getBookById} = require("../../../server/services/books/get");

let authors, genres, books;

beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    [ authors, genres,  books ] = await seedData();
});

test('deletes genre with id 1', async () => {
    let genresBooks = await getBooks({GenreId: 1});
    expect(genresBooks.length).toBe(2);
    
    let book1 = await getBookById(2);
    expect(book1.Genres.length).toBe(2);
    
    const result = await deleteGenreById(1);
    expect(result).toEqual({message: 'deleted genre with id 1'});
    
    book1 = await getBookById(2);
    expect(book1.Genres.length).toBe(1);
    await expect(getBookById(1)).rejects.toThrow();
})
test('deletes genre with incorrect id', async () => {
    const incorrectId = 'incorrect id';
    await expect(deleteGenreById(incorrectId)).rejects.toThrow(`could not find genre with id ${incorrectId}`);
})
