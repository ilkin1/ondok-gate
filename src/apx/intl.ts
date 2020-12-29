import conf from 'conf';
import yaml from 'js-yaml';
import op from 'op';
import Joi from '@hapi/joi';
import {badRequest} from "boom";

const NAMESPACES = ['translation', 'directory'];

const lgnsSchema = Joi.object({
  lg: Joi.string().min(2).max(5).required(),
  ns: Joi.string().required()
});

function get() {
  return async ctx => {
    const {lg, ns} = await op(ctx).apx.validQuery(lgnsSchema);
    return await op.cache.proc.resolve(`intl.${lg}-${ns}`, async () => {
      try {
        const content = await op.res.get(`langs/${lg}-${ns}.yml`)
        return JSON.stringify(yaml.load(content) ?? {});
      } catch (e) {
        throw badRequest('not-found');
      }
    }, conf.debug ? 1 : 0);
  }
}

export default {name: 'intl', sub: {get}}
