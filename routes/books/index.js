const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const {
  create: createBook,
  readById: readBookById,
  read: readBook,
  update: updateBook,
  del: deleteBook,
} = require('../../services/books');

const bookRoutes = new Router();

bookRoutes.get('/', async (ctx) => {
  const result = await readBook(ctx.query);
  ctx.body = result;
});

bookRoutes.get('/:id', async (ctx) => {
  const result = await readBookById(ctx.params.id);
  ctx.body = result;
});

bookRoutes.post('/', bodyParser(), async (ctx) => {
  const result = await createBook(ctx.request.body);
  ctx.body = result;
});

bookRoutes.patch('/:id', bodyParser(), async (ctx) => {
  const result = await updateBook(ctx.params.id, ctx.request.body);
  ctx.body = result;
});

bookRoutes.del('/:id', async (ctx) => {
  const result = await deleteBook(ctx.params.id);
  ctx.body = result;
});

module.exports = {
  bookRoutes,
};
