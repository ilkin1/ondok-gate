import {Migration} from "https://deno.land/x/nessie/mod.ts";
import {Schema} from "https://deno.land/x/nessie/qb.ts";
import Dex from "https://deno.land/x/dex/mod.ts";

export function queryStrings(list: string[]) {
  return ({queryBuilder}) => {
    for (let qs of list) {
      queryBuilder.queryString(qs);
    }
    return queryBuilder;
  }
}