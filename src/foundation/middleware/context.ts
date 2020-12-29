import op from 'op';

export default async (ctx, next) => {
  ctx.response.headers.rid = op(ctx).rid;
  return next();
}
