﻿const request = require('supertest');
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