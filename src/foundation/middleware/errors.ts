import { AppCtx } from 'app';
import { boomify, isBoom, badRequest } from 'boom';
import * as Joi from '@hapi/joi';
import conf from 'conf';

const mw = async (ctx: AppCtx, next) => {
  try {
    await next();
  } catch (err) {
    // @ts-ignore
    if (Joi.isError(err)) {
      err = badRequest('validation', { errors: err.details });
    }
    if (!isBoom(err)) {
      err = boomify(err, {
        statusCode: err.statusCode || err.status || 500
      })
    }

    const { statusCode, payload } = err.output;

    ctx.status = statusCode;
    ctx.body = { ...err.data, ...payload };
    ctx.app.emit('error', err, ctx);
  }
}

export default mw;
