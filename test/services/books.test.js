const { create: createBook, update: updateBook, read: readBook } = require('../../services/books');

describe('create book', () => {
  test('should return error if run without params', async () => {
    await expect(createBook()).rejects.toThrow('"booksData" is required');
  });
  test('should return error if run without title', async () => {
    await expect(createBook({
      date: Date(),
      author: 'Some Author',
      description: 'Super cool new book',
      image: '/images/130.jpg',
    })).rejects.toThrow('child "title" fails because ["title" is required]');
  });
  test('should return error if run without author', async () => {
    await expect(createBook({
      title: 'New book',
      date: Date(),
      description: 'Super cool new book',
      image: '/images/130.jpg',
    })).rejects.toThrow('child "author" fails because ["author" is required]');
  });
  test('should create book if title and author provided', async () => {
    const result = await createBook({
      title: 'New book',
      author: 'William Shakespeare',
    });
    expect(result).toBeDefined();
  });
  test('should create book if all data correct', async () => {
    const result = await createBook({
      title: 'New awesom book',
      date: Date(),
      author: 'Some Author',
      description: 'Super cool new book',
      image: '/images/130.jpg',
    });
    expect(result).toBeDefined();
  });
});

describe('update book', () => {
  test('should work fine with all params', async () => {
    const result = await updateBook(204, {
      title: 'New book',
      date: Date(),
      author: 'Some Author',
      description: 'Super cool new book',
      image: '/images/130.jpg',
    });
    expect(result).toBeDefined();
  });
  test('should return error if run without params', async () => {
    await expect(updateBook()).rejects.toThrow('"id" is required');
  });
  test('should return error if run without id', async () => {
    await expect(updateBook('', { title: 'new title' })).rejects.toThrow('"id" must be a number');
  });
  test('should return error if run with wrong id', async () => {
    await expect(updateBook(0, { title: 'new title' })).rejects.toThrow('"id" must be a positive number');
  });
  test('should return error if run withot booksData', async () => {
    await expect(updateBook(1)).rejects.toThrow('"booksData" is required');
  });
  test('should return error if run with array instead booksData object', async () => {
    await expect(updateBook(1, [])).rejects.toThrow('"booksData" must be an object');
  });
  test('should return error if run without any correct property in booksData obj', async () => {
    await expect(updateBook(1, { some: 'some' }))
      .rejects.toThrow('"booksData" must contain at least one of [title, date, author, description, image]');
  });
});

describe('read books', () => {
  test('should return error if search provided without search by', async () => {
    await expect(readBook({
      search: 'William Shakespeare',
    })).rejects.toThrow('"searchOptions" contains [search] without its required peers [searchBy]');
  });
  test('should return error if search by provided without search', async () => {
    await expect(readBook({
      searchBy: 'author',
    })).rejects.toThrow('"searchOptions" contains [searchBy] without its required peers [search]');
  });
  test('should return last 20 books if run without params', async () => {
    const result = await readBook();
    expect(result).toBeDefined();
  });
  test('should return result if searchBy and search provided', async () => {
    const resuit = await readBook({
      searchBy: 'id',
      search: '3',
    });
    expect(resuit).toBeDefined();
  });
  test('should return result if all params defined', async () => {
    const resuit = await readBook({
      searchBy: 'author',
      search: 'Some Author',
      sort: 'ASC',
      sortBy: 'date',
      limit: 2,
      offset: 0,
    });
    expect(resuit).toBeDefined();
  });
  test('search by date', async () => {
    const resuit = await readBook({
      searchBy: 'date',
      search: '2019-08-07',
      sort: 'ASC',
      sortBy: 'date',
      limit: 20,
      offset: 0,
    });
    expect(resuit).toBeDefined();
  });
});
