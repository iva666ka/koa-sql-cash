const { pool: sqlConnectionPool } = require('../../storages/mysql.js');

const {
  idSchema,
  createBookSchema,
  updateBookSchema,
  searchOptionsSchema,
} = require('./validators');

async function create(booksData) {
  const validatedBook = await createBookSchema.validate(booksData);

  return sqlConnectionPool.query('INSERT INTO books SET ?', validatedBook);
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

  return sqlConnectionPool.query('UPDATE books set ? WHERE id = ?', [validatedBook, validatedId]);
}

async function del(id) {
  const validatedId = await idSchema.validate(id);

  return sqlConnectionPool.query('DELETE FROM books WHERE id = ?', [validatedId]);
}

module.exports = {
  create,
  read,
  update,
  del,
};
