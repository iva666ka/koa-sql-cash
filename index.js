const Koa = require('koa');
const { port } = require('./config/config.js').config;
const { allRouters } = require('./routes');

const app = new Koa();

// error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.isJoi) {
      err.status = 400;
    }
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
    ctx.app.emit('error', err, ctx);
  }
});

// display error log
app.on('error', (err, ctx) => {
  if (err.status === 500 || !err.status) console.log({ err, ctx });
});

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
