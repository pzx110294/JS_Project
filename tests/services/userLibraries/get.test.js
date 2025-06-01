const request = require('supertest');
const { app} = require('../../../server/server');
const { UserBook } = require('../../../server/models');
const { seedData } = require('../../../server/db/seedData');
const db = require('../../../server/models');

let adminToken;
let userToken;
let testBookId;

beforeEach(async () => {
    await db.sequelize.sync({ force: true });
    const [_authors, _genres, books] = await seedData();
    testBookId = books[0].id;

    const adminRes = await request(app)
        .post('/api/login')
        .send({ username: 'admin', password: 'admin' });
    adminToken = adminRes.body.token;

    const userRes = await request(app)
        .post('/api/login')
        .send({ username: 'user', password: 'user' });
    userToken = userRes.body.token;
});

describe('POST /api/library', () => {
    it('should add a book to user library', async () => {
        const res = await request(app)
            .post('/api/library')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ BookId: testBookId, status: 'to read' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('UserId');
        expect(res.body).toHaveProperty('BookId', testBookId);
        expect(res.body).toHaveProperty('status', 'to read');
    });

    it('should update status if book already in library', async () => {
        await request(app)
            .post('/api/library')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ BookId: testBookId, status: 'to read' });

        const res = await request(app)
            .post('/api/library')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ BookId: testBookId, status: 'reading' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toBe('reading');
    });

    it('should reject invalid status', async () => {
        const res = await request(app)
            .post('/api/library')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ BookId: testBookId, status: 'invalid' });

        expect(res.statusCode).toEqual(400);
    });

    it('should reject non-existent book', async () => {
        const res = await request(app)
            .post('/api/library')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ BookId: 9999, status: 'to read' });

        expect(res.statusCode).toEqual(404);
    });
});
describe('GET /api/library', () => {
    beforeEach(async () => {
        await UserBook.bulkCreate([
            { UserId: 2, BookId: testBookId, status: 'to read' },
            { UserId: 2, BookId: 2, status: 'reading' },
            { UserId: 2, BookId: 3, status: 'finished' }
        ]);
    });

    it('should return all books in user library', async () => {
        const res = await request(app)
            .get('/api/library')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.Library).toHaveLength(3);
    });

    it('should filter by status', async () => {
        const res = await request(app)
            .get('/api/library?status=reading')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.Library).toHaveLength(1);
        expect(res.body.Library[0].UserBook.status).toBe('reading');
        
    });

    it('should return error for nonexistent filter', async () => {
        const res = await request(app)
            .get('/api/library?status=nonexistent')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(400);
        expect(res.body).not.toHaveProperty('Library');
    });
});