import 'source-map-support/register';
import conf from 'conf';
import * as Koa from 'koa';
import errors from 'foundation/middleware/errors';
import cors from 'foundation/middleware/cors';
import router from './middleware/router';
import cache from 'foundation/cache';
import {createServer} from 'http';

const app = new Koa();

app.use(errors);
if (conf.isDev) app.use(cors);
app.use(router);

app.on('error', (err, ctx) => {
  console.error(err);
  // toast({title: 'App Error', body: err.message});
});

if (conf.isDev) {
  cache.clear();
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection', {promise, reason});
  });
}

export const http = createServer(app.callback());

http.listen(conf.spec.port, () => {
  console.info(`Server running on port ${conf.spec.port}`);
});
