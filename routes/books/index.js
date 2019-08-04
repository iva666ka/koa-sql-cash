const Router = require('koa-router');

const bookRoutes = new Router();

bookRoutes.get('/', (ctx) => {
  ctx.body = 'get books methods';
});

bookRoutes.post('/', (ctx) => {
  ctx.body = 'post books method';
});

bookRoutes.get('/:id', (ctx) => {
  ctx.body = `get one book by id ${ctx.params.id} method`;
});

bookRoutes.post('/:id', (ctx) => {
  ctx.body = `update one book by id ${ctx.params.id} method`;
});

bookRoutes.del('/:id', (ctx) => {
  ctx.body = `delete one book by id ${ctx.params.id} method`;
});

module.exports = {
  bookRoutes,
};
