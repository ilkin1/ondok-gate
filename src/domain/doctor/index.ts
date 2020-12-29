import {checkObj, signObj} from "foundation/support/sig-obj";

export const schedule = require('./schedule');

const BIND_DOCTOR_SALT = 'EAdQ5EItkMjKzkK9sF55';
export async function genBindDoctorSig(doc): Promise<string> {
  return await signObj({
    doc: doc.id,
    salt: BIND_DOCTOR_SALT
  });
}

export async function checkBindDoctorSig(doc, sig): Promise<boolean> {
  return await checkObj({
    doc: doc.id,
    salt: BIND_DOCTOR_SALT
  }, sig);
}
