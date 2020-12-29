import mongo from 'foundation/db/mongo';
import Apx from 'foundation/apx/operator';
import {AppCtx} from 'app';
import res from "foundation/res";
import qb from 'foundation/db/objection';
import cache from 'foundation/cache';
import Intl from 'foundation/intl';
import Mails from 'foundation/mails';
import Tpl from 'foundation/tpl';

export class Operator {
  ctx: AppCtx;

  [x: string]: any

  constructor(ctx: AppCtx) {
    this.ctx = ctx;
  }

  public get apx(): Apx {
    return this.$apx ?? (this.$apx = new Apx(this.ctx));
  }

  // dump(data: Obj): void {
  //   this.dispatch(async () => {
  //     if (!await this.act.isAnon()) {
  //       const actorId = await this.act.getActorId();
  //       if (actorId) data.actorId = actorId;
  //       data.rid = this.rid;
  //     }
  //     dump(data);
  //   });
  // }

  public dispatch(action: () => Promise<any>): void {
    action().catch(console.error);
  }

  public get mails(): Mails {
    return this.$mails ?? (this.$mails = new Mails(this.ctx));
  }

  public get intl(): Intl {
    return this.$intl ?? (this.$intl = new Intl(this.ctx));
  }

  public get tpl(): Tpl {
    return this.$tpl ?? (this.$tpl = new Tpl(this.ctx));
  }
}

export default function op(ctx: AppCtx): Operator {
  return ctx.$op ?? (ctx.$op = new Operator(ctx));
}
op.res = res;
op.qb = qb;
op.mongo = mongo;
op.cache = cache;
op.dispatch = (action: () => Promise<any>): void => {
  action().catch(console.error);
};

