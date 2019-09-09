const Joi = require('@hapi/joi');

const idSchema = Joi.number().integer().positive().required()
  .label('id');

const createBookSchema = Joi.object().keys({
  title: Joi.string().min(1).max(255).trim()
    .required(),
  date: Joi.date()
    .default(new Date()),
  author: Joi.string().min(1).max(255).trim()
    .required(),
  description: Joi.string().max(10000).trim().allow('')
    .default(''),
  image: Joi.string().max(255).trim().allow('')
    .default(''),
}).required()
  .label('booksData');

const updateBookSchema = Joi.object().keys({
  title: Joi.string().min(1).max(255).trim(),
  date: Joi.date(),
  author: Joi.string().min(1).max(255).trim(),
  description: Joi.string().max(10000).trim().allow(''),
  image: Joi.string().max(255).trim().allow(''),
}).required().or('title', 'date', 'author', 'description', 'image')
  .label('booksData');

const searchOptionsSchema = Joi.object().keys({
  search: Joi.string().min(0).trim(),
  searchBy: Joi.string().lowercase().valid('title', 'date', 'author', 'description', 'image', 'id'),
  sort: Joi.string().uppercase().valid('ASC', 'DESC'), // todo possible rename to sortDirection?
  sortBy: Joi.string().lowercase().valid('title', 'date', 'author', 'description', 'image', 'id'),
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
