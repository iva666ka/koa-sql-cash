const Joi = require('@hapi/joi');
const { pool: sqlConnectionPool } = require('../../storages/mysql.js');

const idSchema = Joi.number().integer().positive().required()
  .label('id');

const createBookSchema = Joi.object().keys({
  title: Joi.string().min(1).max(256).trim()
    .required(),
  date: Joi.date(),
  author: Joi.string().min(1).max(64).trim()
    .required(),
  description: Joi.string().min(1).max(1024).trim(),
  image: Joi.string().min(1).max(256).trim(),
}).required()
  .label('booksData');

const updateBookSchema = Joi.object().keys({
  title: Joi.string().min(1).max(256).trim(),
  date: Joi.date(),
  author: Joi.string().min(1).max(64).trim(),
  description: Joi.string().min(1).max(1024).trim(),
  image: Joi.string().min(1).max(256).trim(),
}).required().or('title', 'date', 'author', 'description', 'image')
  .label('booksData');

const searchOptionsShema = Joi.object().keys({
  search: Joi.string().min(0).trim(),
  searchBy: Joi.string().lowercase().valid('title', 'date', 'author', 'description', 'image', 'id'),
  sort: Joi.string().uppercase().valid('ASC', 'DESC').default('DESC'),
  sortBy: Joi.string().lowercase().valid('title', 'date', 'author', 'description', 'image', 'id').default('id'),
  limit: Joi.number().integer().min(1).max(100)
    .default(20),
  offset: Joi.number().integer().min(0).default(0),
}).and('search', 'searchBy')
  .label('searchOptions');

async function create(booksData) {
  const validatedBook = await createBookSchema.validate(booksData);

  return sqlConnectionPool.query('INSERT INTO books SET ?', validatedBook);
}

async function read(searchOptions = {}) {
  const validatedSearchOptions = await searchOptionsShema.validate(searchOptions);

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

module.exports = {
  create,
  read,
  update,
};
