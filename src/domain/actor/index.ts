import {AppCtx} from 'app';
import * as jwt from './jwt';
import {unauthorized, forbidden, notFound} from 'boom';
import policies from './policy';
import {User} from 'domain/models';
import path from 'ramda/es/path';
import mem from 'foundation/support/mem';

export class Actor {
  public readonly ctx: AppCtx;
  private payload: any

  constructor(ctx: AppCtx) {
    this.ctx = ctx;
    this.getUser = mem(this.getUser);
  }

  getUser = async (): Promise<User> => {
    const user = await User.query().findOne({id: this.id});

    if (!user) {
      throw notFound('User not found!');
    }

    return user;
  };

  public isAnon(): boolean {
    return this.payload == null;
  }

  public getPayload(): Obj {
    if (this.payload === null) {
      throw unauthorized();
    }

    return this.payload;
  }

  get role() {
    return this.getPayload().role;
  }

  get email() {
    return this.getPayload().email;
  }

  get id() {
    return this.getPayload().sub;
  }

  public async obstruct(action: string, ...args: any[]): Promise<void> {
    if (!await this.granted(action, ...args)) throw forbidden();
  }

  public async granted(action: string, ...args: any[]): Promise<boolean> {
    return await path<any>(action.split('.'), policies)(this, ...args);
  }

  public async prepare(): Promise<void> {
    const token: string | undefined = this.ctx.request.headers.authorization;
    if (token === undefined) {
      this.payload = null;
    } else {
      try {
        this.payload = await jwt.verify(token);
      } catch (e) {
        if (e.name === 'TokenExpiredError') {
          throw unauthorized();
        }
        throw e;
      }
    }
  }

  findPayload(): Obj | null {
    return this.payload;
  }
}

function act(ctx: AppCtx): Actor {
  return ctx.$act ?? (ctx.$act = new Actor(ctx));
}

export default act;