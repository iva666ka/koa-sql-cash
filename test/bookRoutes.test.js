const request = require('supertest');
const { server } = require('../index');

afterEach(() => {
  server.close();
});

describe('books routes', () => {
  test('get /books exist', async () => {
    const result = await request(server).get('/books');
    expect(result.statusCode).toBe(200);
  });
  test('post /books exist', async () => {
    const result = await request(server).post('/books');
    expect(result.statusCode).toBe(200);
  });
  test('get /books/:id exist', async () => {
    const result = await request(server).get('/books/123');
    expect(result.statusCode).toBe(200);
  });
  test('delete /books/:id exist', async () => {
    const result = await request(server).delete('/books/123');
    expect(result.statusCode).toBe(200);
  });
  test('post /books/:id exist', async () => {
    const result = await request(server).post('/books/123');
    expect(result.statusCode).toBe(200);
  });
});
