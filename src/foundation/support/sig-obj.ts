import conf from "conf";
import crypto from "crypto";

const ALG = 'sha256'
const SECRET = conf.spec.secret;

export async function signObj(obj: Obj): Promise<string> {
  return crypto.createHmac(ALG, SECRET)
    .update(JSON.stringify(obj))
    .digest('hex');
}

export async function checkObj(obj: Obj, sig: string): Promise<boolean> {
  return await signObj(obj) === sig;
}
