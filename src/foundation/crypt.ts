import * as crypto from 'crypto';
import res from "foundation/res";
import mem from "foundation/support/mem";

export const getPrivateKey = mem(() => res.get('jwt/jwtRS256.key').then(i => i.replace(/\\n/gm, '\n')));
export const getPublicKey = mem(() => res.get('jwt/jwtRS256.key.pub').then(i => i.replace(/\\n/gm, '\n')));

const SIG_ALG = 'sha256';

export async function sign(data: Obj): Promise<string> {
  const buf = Buffer.from(JSON.stringify(data));
  const sig = crypto.sign(SIG_ALG, buf, {
    key: await getPrivateKey(),
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING
  });
  return sig.toString('base64');
}

export async function verify(data: Obj, sign: string): Promise<boolean> {
  const result = crypto.verify(
    SIG_ALG,
    Buffer.from(JSON.stringify(data)),
    await getPublicKey(),
    Buffer.from(sign, 'base64')
  );
  console.log(result);
  return false;
}