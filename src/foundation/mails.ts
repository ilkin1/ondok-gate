// import AWS from 'aws-sdk';
import tpl from 'foundation/tpl';
// import intl from 'foundation/intl';
import nodemailer from 'nodemailer';
import conf from 'conf';
import {AppCtx} from 'app';
import * as juice from 'juice';
import op from "op";


const transports: Obj<(opts: Obj) => ({
  html, from, to, subject
}) => Promise<void>> = {
  null: () => async opts => {
  },
  mailtrap() {
    const transport = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'cc11512cdaa62d',
        pass: '6421d481b8e093'
      }
    });

    return async (opts) => {
      await transport.sendMail(opts);
    };
  },
  mailgun({apiKey, domain}) {
    const gun = require("mailgun-js")({apiKey, domain});
    return async function(opts) {
      await gun.messages().send(opts);
    }
  }
};

type Receiver = any | string | { email: string } | (string | { email: string })[]

type Options = {
  to: Receiver
  name: string
  data?: Obj
}

function resolveReceiver(receiver: Receiver): string[] {
  if (!Array.isArray(receiver)) {
    receiver = [receiver];
  }
  return receiver.map((item) => {
    return typeof item === 'object' ? item.email : item;
  });
}

const {driver, ...options} = conf.spec.mails;
const send = transports[driver](options);

class Mails {
  private ctx: AppCtx;

  constructor(ctx: AppCtx) {
    this.ctx = ctx;
  }

  public async renderHtml(name: string, data?: Obj): Promise<string> {
    return juice(await op(this.ctx).tpl.render(`mails/${name}.njk`, data));
  }

  public async send({to, data, name}: Options): Promise<void> {
    const html = await this.renderHtml(name, data);
    const t = await op(this.ctx).intl.getT();
    await send({
      html,
      from: 'OnDok Team <team@ondok.az>',
      to: resolveReceiver(to), subject: await t(`mails.subject.${name}`)
    });
  }

  public dispatch(opts: Options): void {
    this.send(opts).catch(console.error);
  }
}

export default Mails;