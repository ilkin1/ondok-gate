import * as Router from 'koa-router';
import apx from 'apx/_index';

const root = new Router();
root.use(apx);

export default root.routes();
