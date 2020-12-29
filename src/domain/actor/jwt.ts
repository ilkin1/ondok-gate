import * as jwt from 'jsonwebtoken';
import {badRequest} from 'boom';
import {getPrivateKey, getPublicKey} from 'foundation/crypt';

export function encode(payload: Obj): Promise<string> {
  return new Promise((resolve, reject) => {
    getPrivateKey().then((key) => {
      jwt.sign(payload, key, {
        algorithm: 'RS256'
      }, (err, token) => {
        if (err) reject(badRequest());
        else resolve(token);
      });
    }, reject)
  })
}

export function verify(token: string): Promise<Obj> {
  return new Promise((resolve, reject) => {
    getPrivateKey().then((key) => {
      jwt.verify(token, key, {
        algorithms: ['RS256']
      }, (err, payload) => {
        if (err) {
          reject(err);
        } else {
          if (typeof payload == 'string') {
            reject(new Error('???'));
          } else {
            resolve(payload);
          }
        }
      });
    }, reject)
  });
}