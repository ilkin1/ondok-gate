import conf from "conf";
import queryString from 'query-string'
import {AppCtx} from 'app';
import {badRequest} from "boom";
import {signObj, checkObj} from './sig-obj';

type UrlComponents = {
  path: string,
  query: Obj
}

export async function makeSignedUrl({path, query}: UrlComponents): Promise<string> {
  const url = new URL(conf.spec.gateUrl);
  url.pathname = path;
  url.search = queryString.stringify({...query, sig: await signObj(query)});
  return url.href;
}

export async function verifyQueryString(ctx: AppCtx): Promise<Obj> {
  const {sig, ...data}: Obj = queryString.parse(ctx.querystring, {parseNumbers: true, parseBooleans: true});
  console.log({sig, data});
  if (!await checkObj(data, sig)) {
    throw badRequest('signature.invalud')
  }
  return data;
}

