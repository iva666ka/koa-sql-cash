const request = require('supertest');
const { server } = require('../index');

afterEach(() => {
  server.close();
});

describe('books routes', () => {
  test('get /books without query', async () => {
    const result = await request(server).get('/books');
    expect(result.statusCode).toBe(200);
    expect(result.body.length).toBe(20);
  });
  test('get /books with all params query', async () => {
    const result = await request(server).get('/books')
      .query({
        search: 'Some Author',
        searchBy: 'author',
        sort: 'asc',
        sortBy: 'title',
        limit: 2,
        offset: 2,
      });
    expect(result.statusCode).toBe(200);
    expect(result.body.length).toBe(2);
  });

  test('get /books/:id with exist id', async () => {
    const result = await request(server).get('/books/99');
    expect(result.statusCode).toBe(200);
    expect(result.body.length).toBe(1);
  });
  test('get /books/:id with wrong id', async () => {
    const result = await request(server).get('/books/99999999');
    expect(result.statusCode).toBe(200);
    expect(result.body.length).toBe(0);
  });

  test('post /books create book', async () => {
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

  test('delete /books/:id delete book', async () => {
    const result = await request(server).delete('/books/209');
    expect(result.statusCode).toBe(200);
  });
});
