const Koa = require('koa');
const { port } = require('./config/config.js').config;
const { allRouters } = require('./routes');

const app = new Koa();

// logger
app.use(async (ctx, next) => {
  console.log(`${ctx.method} ${ctx.url}`);
  await next();
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response
app.use(allRouters.routes());
app.use(allRouters.allowedMethods());

const server = app.listen(port, () => { console.log(`Server listening ${port} port`); });

module.exports = { server };
