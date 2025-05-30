const db = require('../../../server/models')
const { createBook } = require('../../../server/services/books/post');
const {createTestData} = require("../../helpers/testData");

let authors, genres;

beforeEach(async () => {
	await db.sequelize.sync({ force: true });
	[ authors, genres ] = await createTestData();
});

test('creates a valid book with multiple authors and genres', async () => {
	const title = 'Test Book';
	const isbn = '1234-5678';
	const date = new Date();
	const dateOnly = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
	
	const book = {
		Title: title,
		ISBN: isbn,
		PublicationDate: dateOnly,
		AuthorId: [ authors[0].id, authors[1].id ],
		GenreId: [genres[0].id, genres[1].id]
	};
	const result = await createBook(book);
	const {Authors, Title, ISBN, Genres, PublicationDate} = result;
	expect(result).toBeDefined();
	expect(Title).toBe(title);
	expect(ISBN).toBe(isbn);
	expect(new Date(PublicationDate).getTime()).toBe(dateOnly.getTime());
	
	expect(Authors.length).toBe(2);
	expect(Authors[0].id).toBe(authors[0].id);
	expect(Authors[0].Name).toBe(authors[0].Name);
	expect(Authors[1].id).toBe(authors[1].id);
	expect(Authors[1].Name).toBe(authors[1].Name);
	
	expect(Genres.length).toBe(2);
	expect(Genres[0].id).toBe(genres[0].id);
	expect(Genres[0].Name).toBe(genres[0].Name);
	expect(Genres[1].id).toBe(genres[1].id);
	expect(Genres[1].Name).toBe(genres[1].Name);
	
});
test('creates a valid book without a publication date', async () => {
	const title = 'Test Book';
	const isbn = '1234-5678';

	const book = {
		Title: title,
		ISBN: isbn,
		AuthorId: [ authors[0].id, authors[1].id ],
		GenreId: [genres[0].id, genres[1].id]
	};
	const result = await createBook(book);
	expect(result).toBeDefined();
	expect(result.PublicationDate).toBeNull();
});
test('throws error if missing Title', async () => {

	await expect(createBook({
		ISBN: '1234-5678',
		PublicationDate: Date.now(),
		AuthorId: authors[0].id,
		GenreId: [ genres[0].id, genres[1].id ]
	})).rejects.toThrow('Empty Title field');
});
test('throws error if missing ISBN', async () => {
	
	await expect(createBook({
		Title: 'Book without ISBN',
		PublicationDate: Date.now(),
		AuthorId: authors[0].id,
		GenreId: [ genres[0].id, genres[1].id ]
	})).rejects.toThrow('Empty ISBN field');
});

test('throws error if AuthorId is missing', async () => {
	await expect(createBook({
		Title: 'Missing Author',
		ISBN: '0000-1111',
		PublicationDate: Date.now(),
		GenreId: [ genres[0].id, genres[1].id ]
	})).rejects.toThrow('Empty AuthorId field');
});

test('throws error if AuthorId does not exist', async () => {
	await expect(createBook({
		Title: 'Bad Author Ref',
		ISBN: '9999-0000',
		PublicationDate: Date.now(),
		AuthorId: 9999,
		GenreId: [ genres[0].id, genres[1].id ]
	})).rejects.toThrow();
});

test('throws error if GenreId is missing', async () => {
	await expect(createBook({
		Title: 'Missing Genre',
		ISBN: '1234-5678',
		PublicationDate: Date.now(),
		AuthorId: authors[0].id
	})).rejects.toThrow('Empty GenreId field',);
})
test('throws error if GenreId does not exist', async () => {
	await expect(createBook({
		Title: 'Missing Genre',
		ISBN: '1234-5678',
		PublicationDate: Date.now(),
		AuthorId: authors[0].id,
		GenreId: 9999
	})).rejects.toThrow();
});
