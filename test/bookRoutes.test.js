const request = require('supertest');
const { server } = require('../index');

afterEach(() => {
  server.close();
});

describe('books routes', () => {
  test('get /books without query should return last 20 books', async () => {
    const result = await request(server).get('/books');
    expect(result.statusCode).toBe(200);
    expect(result.body.results.length).toBe(20);
  });
  test('get /books with all params query should return matched books', async () => {
    const result = await request(server).get('/books')
      .query({
        search: 'Some Author',
        searchBy: 'author',
        // sort: 'desc',
        // sortBy: 'title',
        limit: 20,
        offset: 0,
      });
    expect(result.statusCode).toBe(200);
    expect(result.body.results.length).toBe(20);
  });

  test('get /books/:id with exist id should return book with this id', async () => {
    const result = await request(server).get('/books/99');
    expect(result.statusCode).toBe(200);
    expect(result.body.id).toBe('99');
  });
  test('get /books/:id with not existing id should return empty array', async () => {
    const result = await request(server).get('/books/99999999');
    expect(result.statusCode).toBe(404);
    expect(result.text).toBe('id 99999999 does not found');
  });

  test('post /books with req.body title and author should create book', async () => {
    const result = await request(server).post('/books')
      .send({
        title: 'test',
        author: 'test',
      });
    expect(result.statusCode).toBe(200);
  });

  test('post /books/:id update book', async () => {
    const result = await request(server).post('/books/207')
      .send({
        title: 'new test title',
        date: new Date(),
        author: 'new author',
        description: 'new description',
        image: 'new url',
      });
    expect(result.statusCode).toBe(200);
  });
  test('post /books/:id with wrong id should return error', async () => {
    const result = await request(server).post('/books/9999999')
      .send({
        title: 'new test title',
        date: new Date(),
        author: 'new author',
        description: 'new description',
        image: 'new url',
      });
    expect(result.text).toBe('id 9999999 does not found');
    expect(result.statusCode).toBe(404);
  });

  test('delete /books/:id delete book', async () => {
    const result = await request(server).delete('/books/100114');
    expect(result.statusCode).toBe(404);
  });
});
