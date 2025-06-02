const request = require('supertest');
const { app} = require('../../../server/server');
const { UserBook } = require('../../../server/models');
const { seedData } = require('../../../server/db/seedData');
const db = require('../../../server/models');


let testBookId;
let userToken;

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

describe('DELETE /library/:id', () => {
  it('should delete a book from user library', async () => {
    // Step 1: Add the book to the user's library
    const postRes = await request(app)
      .post('/api/library')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ BookId: testBookId, status: 'to read' });

    expect(postRes.status).toBe(200);

    // Step 2: Delete the book from the user's library
    const deleteRes = await request(app)
      .delete(`/api/library/${testBookId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toBe(`Book with ID ${testBookId} deleted successfully`);
  });

  it('should return 404 if the book is not in the user library', async () => {
    const deleteRes = await request(app)
      .delete('/api/library/999') // invalid ID
      .set('Authorization', `Bearer ${userToken}`);


    expect(deleteRes.status).toBe(404);
    expect(deleteRes.body.error).toContain(`Book with ID 999 not found in user's library`);
  });

  it('should return 401 if unauthorized', async () => {
    const deleteRes = await request(app)
      .delete(`/api/library/${testBookId}`);

    expect(deleteRes.status).toBe(401);
    expect(deleteRes.body.error).toContain('Unauthorized');
  });
});
