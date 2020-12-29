import * as Router from 'koa-router';
import {AppCtx} from 'app';
import {notFound} from "boom";

type Handler = (ctx: AppCtx) => Promise<any>
type Factory = () => Handler
type Routes = { [x: string]: (Factory | { [x: string]: Factory }) } | Route[]
type Route = ({
  sub?: Routes
  name: string
  factory: Factory
} | {
  sub?: Routes
  name: string
  handler: Handler
} | {
  sub?: Routes
})

export type ApxRoutes = Routes;
export type ApxRoute = Route;

export default function compile(root: Route) {
  let kv = {};
  const prefix = (val: string | undefined) => val === undefined ? '' : `${val}.`;

  function operate(route, name?: string) {
    if (route.name) name = `${prefix(name)}${route.name}`;
    if (route.handler) {
      if (name === undefined) throw new Error();
      kv[name] = route.handler
    } else if (route.factory) {
      if (name === undefined) throw new Error();
      kv[name] = route.factory()
    }

    if (route.sub) {
      if (Array.isArray(route.sub)) {
        for (let sub of route.sub) {
          operate(sub, name);
        }
      } else {
        for (let [k, v] of Object.entries(route.sub) as any) {
          if (typeof v === 'function') {
            kv[`${prefix(name)}${k}`] = v();
          } else if (typeof v === 'object') {
            operate({name: k, sub: v}, name);
          } else {
            throw new Error();
          }
        }
      }
    }
  }

  operate(root);

  kv = Object.create(kv);
  const router = new Router;
  router.register('/apx/:action', ['get', 'post'], async (ctx: AppCtx) => {
    const handler = kv[ctx.params.action];
    if (!handler) throw notFound();
    const result = await handler(ctx);
    ctx.response.status = 200;
    if (result !== undefined) {
      ctx.response.body = result;
    }
  });

  return router.routes();
}

