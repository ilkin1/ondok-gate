import nunjucks from 'nunjucks';
import res from './res';
// import router from '../ctrl';
import conf from 'conf';
import {AppCtx} from 'app';
import mem from "foundation/support/mem";
import op from 'op';

const getEnv = mem(() => {
  const env = nunjucks.configure(res.path('templates'), {
    autoescape: true,
    noCache: true
  });

  return env;
});

export default class Tpl {
  private ctx: AppCtx;

  constructor(ctx: AppCtx) {
    this.ctx = ctx;
  }

  private async getFacade() {
    return {
      t: await op(this.ctx).intl.getT(),
      conf
    }
  }

  async render(name: string, data?: Obj): Promise<string> {
    const tpl = await this.getFacade();
    return await new Promise((resolve, reject) => {
      getEnv().render(name, {...data, tpl}, function (err, res) {
        if (err) {
          reject(err);
        } else {
          if (typeof res !== 'string') {
            throw new Error('??');
          }
          resolve(res);
        }
      });
    });
  }
}
