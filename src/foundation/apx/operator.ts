import {AppCtx} from "app";
import * as asyncBusboy from "async-busboy";
import {AnySchema} from "@hapi/joi";
import {Stream} from "stream";
import {badRequest, methodNotAllowed} from "boom";
import parse from 'co-body';

export type Attachment = Stream & {
  name: string
  type: string
  [x: string]: any
}

type FileMap = { [x: string]: Attachment }
type FileList = Attachment[]

type AttachProtocol<T> = [any, T]

class Operator {
  public ctx: AppCtx;

  constructor(ctx: AppCtx) {
    this.ctx = ctx;
  }

  get query() {
    return this.ctx.query;
  }

  qInt(name: string): number {
    const result = parseInt(this.query[name], 10);
    if (isNaN(result)) throw badRequest(`query integer param ${name} is required`)
    return result;
  }

  async attList(): Promise<AttachProtocol<FileList>> {
    this.assertBody();
    const {fields, files} = await asyncBusboy(this.ctx.req);

    let {data, $info} = fields;
    const atts = [];
    if (files) {
      $info = JSON.parse($info);
      for (const file of files) {
        // @ts-ignore
        const fname = file.fieldname;
        // atts[] = Object.assign(file, $info[fname]);
      }
    }

    return [JSON.parse(data), atts];
  }

  async att(options?: { list: true }): Promise<AttachProtocol<FileMap>> {
    this.assertBody();
    const {fields, files} = await asyncBusboy(this.ctx.req);

    let {data, $info} = fields;
    const atts = {};
    if (files) {
      $info = JSON.parse($info);
      for (const file of files) {
        // @ts-ignore
        const fname = file.fieldname;
        atts[fname] = Object.assign(file, $info[fname], {meta: $info[fname]});
      }
    }

    return [JSON.parse(data), atts];
  }

  async json(): Promise<any> {
    return await parse.json(this.ctx);
  }

  async validJson(schema: AnySchema): Promise<any> {
    return await schema.validateAsync(await this.json());
  }

  public async validQuery(schema: AnySchema): Promise<Obj> {
    return schema.validateAsync(this.query);
  }

  private assertBody(): void {
    if (this.ctx.method !== 'POST') {
      throw badRequest('body required!');
    }
  }
}

export default Operator;