const request = require('supertest');
const { app, startServer } = require('../../../server/server');
const { User } = require('../../../server/models');
const { seedData } = require('../../../server/db/seedData');
const {getBooks} = require("../../../server/services/books/get");
const db = require("../../../server/models");

let server;
beforeAll(async () => {
  server = await startServer();
});
beforeEach(async () => {
  await db.sequelize.sync({ force: true });
  await seedData();
});
afterAll(async () => {
  await server.close();
});
describe('Authentication', () => {
  describe('POST /login', () => {
    it('should login admin with valid credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ username: 'admin', password: 'admin' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should login regular user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ username: 'user', password: 'user' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ username: 'admin', password: 'wrong' });
      
      expect(res.statusCode).toEqual(401);
    });

    it('should reject unknown user', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ username: 'nonexistent', password: 'test' });
      
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('Protected Routes', () => {
    let adminToken;
    let userToken;

    beforeAll(async () => {
      const adminRes = await request(app)
        .post('/api/login')
        .send({ username: 'admin', password: 'admin' });
      adminToken = adminRes.body.token;

      const userRes = await request(app)
        .post('/api/login')
        .send({ username: 'user', password: 'user' });
      userToken = userRes.body.token;
    });

    it('should allow admin to access protected route', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ Title: 'admin', ISBN: '123', AuthorId: 1, GenreId: 1 });
      
      expect(res.statusCode).toEqual(201);
      const books = await getBooks({Title: 'admin'});
      expect(books[0].Title).toBe('admin');
    });

    it('should reject user from admin-only route', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ Title: 'admin', ISBN: '123', AuthorId: 1, GenreId: 1 });
      
      expect(res.statusCode).toEqual(401);
    });

    it('should reject request without token', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({ Title: 'admin', ISBN: '123', AuthorId: 1, GenreId: 1 });
      
      expect(res.statusCode).toEqual(401);
    });
  });
});