const createError = require('http-errors');
const { pool: sqlConnectionPool } = require('../../storages/mysql.js');
const { elasticClient } = require('../../storages/elastic.js');
const { redisClient } = require('../../storages/redis.js');

const {
  elasticType,
  elasticIndex,
} = require('../../config/config.js').config;

const {
  idSchema,
  createBookSchema,
  updateBookSchema,
  searchOptionsSchema,
} = require('./validators');

const { setQueryDSL } = require('./utils/setQueryDSL.js');

async function create(booksData) {
  const validatedBook = await createBookSchema.validate(booksData);

  const { insertId } = await sqlConnectionPool.query('INSERT INTO books SET ?', validatedBook);
  const [createdBook] = await sqlConnectionPool.query('SELECT * FROM books WHERE id=?', insertId);

  const promiseArray = [];
  promiseArray.push(
    elasticClient.index({
      id: insertId,
      index: elasticIndex,
      type: elasticType,
      body: createdBook,
    }),
    redisClient.hmset(`book:${insertId}`, createdBook),
  );

  await Promise.all(promiseArray);

  return createdBook;
}

async function readById(id) {
  const validatedId = await idSchema.validate(id);

  const redisResult = await redisClient.hgetall(`book:${validatedId}`);
  if (redisResult !== null) return redisResult;

  const [sqlResult] = await sqlConnectionPool.query('SELECT * FROM books WHERE id=?', validatedId);
  if (sqlResult === undefined) throw createError(404, `id ${validatedId} does not found`);

  redisClient.hmset(`book:${validatedId}`, sqlResult)
    .then() // do nothing when promise resolves. We have already sent the result to the client
    .catch((e) => { console.log('Can\'t write book into redis.', e); });

  return sqlResult; // sent result before redisClient.hmset.resolve
}

async function read(searchOptions = {}) {
  const validatedSearchOptions = await searchOptionsSchema.validate(searchOptions);

  const {
    search,
    searchBy,
    sort,
    sortBy,
    limit,
    offset,
  } = validatedSearchOptions;

  if (searchBy === 'id' && Number.isInteger(parseInt(search, 10))) return readById(search);

  const queryDSL = setQueryDSL(search, searchBy, sort, sortBy);

  const { body: { hits } } = await elasticClient.search({
    index: elasticIndex,
    type: elasticType,
    size: limit,
    from: offset,
    body: queryDSL,
  });

  const result = {};
  result.meta = {
    total: hits.total,
    search,
    searchBy,
    sort,
    sortBy,
    limit,
    offset,
  };
  // eslint-disable-next-line no-underscore-dangle
  result.results = hits.hits.map(foundedBook => foundedBook._source);
  return result;
}

async function update(id, booksData) {
  const validatedId = await idSchema.validate(id);
  const validatedBook = await updateBookSchema.validate(booksData);

  const {
    affectedRows,
  } = await sqlConnectionPool.query('UPDATE books set ? WHERE id = ?', [validatedBook, validatedId]);

  if (affectedRows === 0) throw createError(404, `id ${validatedId} does not found`);

  const [updatedBook] = await sqlConnectionPool.query('SELECT * FROM books WHERE id=?', validatedId);

  const promiseArray = [];
  promiseArray.push(
    elasticClient.index({
      id: validatedId,
      index: elasticIndex,
      type: elasticType,
      body: updatedBook,
    }),
    redisClient.hmset(`book:${validatedId}`, updatedBook),
  );

  await Promise.all(promiseArray);

  return updatedBook;
}

async function del(id) {
  const validatedId = await idSchema.validate(id);

  const { affectedRows } = await sqlConnectionPool.query('DELETE FROM books WHERE id = ?', [validatedId]);
  if (affectedRows === 0) throw createError(404, `id ${validatedId} does not found`);

  const promiseArray = [];
  promiseArray.push(
    elasticClient.delete({
      index: elasticIndex,
      type: elasticType,
      id: validatedId,
    }),
    redisClient.del(`book:${validatedId}`),
  );

  await Promise.all(promiseArray);

  return { result: `book with id: ${validatedId} was deleted` };
}

module.exports = {
  create,
  read,
  readById,
  update,
  del,
};
