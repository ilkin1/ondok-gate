import i18next from 'i18next';
import {AppCtx} from "app"
import mem from "foundation/support/mem";
import res from "foundation/res";
import {memoize} from 'lodash';
import op from "op";
import yaml from "js-yaml";
import {badRequest} from "boom";
import conf from "conf";


class Intl {
  private ctx: AppCtx;

  constructor(ctx: AppCtx) {
    this.ctx = ctx;
    this.getT = mem(this.getT);
  }

  getT = async () => {
    const lg = 'en';
    const ns = 'backend'
    return await i18next.init({
      lng: lg, ns,
      fallbackLng: 'en',
      defaultNS: ns,
      debug: true,
      resources: {
        [lg]: {[ns]: await getResource(lg, ns)}
      }
    });
  }
}

const getResource = async (lg: string, ns: string): Promise<Obj> => {
  const content = await op.res.get(`langs/${lg}-${ns}.yml`)
  return yaml.load(content) ?? {};
}

export default Intl;
