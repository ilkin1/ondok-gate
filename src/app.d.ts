/// <reference types="koa" />

import { Context, ParameterizedContext } from "koa";
import { Logger } from "foundation/logger";
import Rest from "foundation/rest";
import * as Koa from "koa";
import { Actor } from "domain/actor";

declare module "koa" {
  interface Request {
    fields: {
      [k: string]: any
    }
  }
}

interface CtxState {
  [k: string]: any
}

interface CtxCustom {
}

declare module 'app' {
  interface AppCtx extends ParameterizedContext<CtxState, CtxCustom> {
    [x: string]: any
  }
}

interface Object {
  optimize<T extends Object>(object: T): T;
  create<T extends Object>(object: T): T;
}