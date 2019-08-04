const Router = require('koa-router');
const { bookRoutes } = require('./books');

const allRouters = new Router();

allRouters.use('/books', bookRoutes.routes());

module.exports = {
  allRouters,
};
