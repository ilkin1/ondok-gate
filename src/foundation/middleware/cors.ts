import conf from 'conf';

const cors = require('@koa/cors');

const mw = cors({
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'Date', 'rid'],
    origin: '*',
    // origin: conf.website.url,
});

export default mw;