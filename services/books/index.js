const { pool: sqlConnectionPool } = require('../../storages/mysql.js');
const { elasticClient } = require('../../storages/elastic.js');

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

async function create(booksData) {
  const validatedBook = await createBookSchema.validate(booksData);

  const { insertId } = await sqlConnectionPool.query('INSERT INTO books SET ?', validatedBook);
  const [createdBook] = await sqlConnectionPool.query('SELECT * FROM books WHERE id=?', insertId);
  await elasticClient.index({
    id: insertId,
    index: elasticIndex,
    type: elasticType,
    body: createdBook,
  });
  return createdBook;
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

  if (!search || !searchBy) {
    return sqlConnectionPool
      .query(`SELECT * FROM books ORDER BY ?? ${sort} LIMIT ? OFFSET ?`, [sortBy, limit, offset]);
  }

  return sqlConnectionPool
    .query(
      `SELECT * FROM books WHERE ?? = ? ORDER BY ?? ${sort} LIMIT ? OFFSET ?`,
      [searchBy, search, sortBy, limit, offset],
    );
}

async function update(id, booksData) {
  const validatedId = await idSchema.validate(id);
  const validatedBook = await updateBookSchema.validate(booksData);

  const {
    affectedRows,
  } = await sqlConnectionPool.query('UPDATE books set ? WHERE id = ?', [validatedBook, validatedId]);

  if (affectedRows === 0) throw new Error(`id ${validatedId} does not found`);

  const [updatedBook] = await sqlConnectionPool.query('SELECT * FROM books WHERE id=?', validatedId);
  await elasticClient.index({
    id: validatedId,
    index: elasticIndex,
    type: elasticType,
    body: updatedBook,
  });
  return updatedBook;
}

async function del(id) {
  const validatedId = await idSchema.validate(id);

  const { affectedRows } = await sqlConnectionPool.query('DELETE FROM books WHERE id = ?', [validatedId]);
  if (affectedRows === 0) throw new Error(`id ${validatedId} does not found`);
  await elasticClient.delete({
    index: elasticIndex,
    type: elasticType,
    id: validatedId,
  });
  return { result: `book with id: ${validatedId} was deleted` };
}

module.exports = {
  create,
  read,
  update,
  del,
};
