const Joi = require('@hapi/joi');

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

const searchOptionsSchema = Joi.object().keys({
  search: Joi.string().min(0).trim(),
  searchBy: Joi.string().lowercase().valid('title', 'date', 'author', 'description', 'image', 'id'),
  sort: Joi.string().uppercase().valid('ASC', 'DESC').default('DESC'),
  sortBy: Joi.string().lowercase().valid('title', 'date', 'author', 'description', 'image', 'id').default('id'),
  limit: Joi.number().integer().min(1).max(100)
    .default(20),
  offset: Joi.number().integer().min(0).default(0),
}).and('search', 'searchBy')
  .label('searchOptions');

module.exports = {
  idSchema,
  createBookSchema,
  updateBookSchema,
  searchOptionsSchema,
};
