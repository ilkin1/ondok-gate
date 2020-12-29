import {Actor} from 'domain/actor';
import {User} from 'domain/models';

type AuthFunc = (actor: Actor, ...args: any) => number | boolean | Promise<number | boolean>
type Node = Obj<AuthFunc> | { [x: string]: Node }

const isRole = (role: string) => (actor: Actor) => actor.role === role;
const multiple = (...roles: string[]) => (actor: Actor) => roles.includes(actor.role);
const isAdmin = isRole(User.Role.ADMIN);
const isPatient = isRole(User.Role.PATIENT);
const isOperator = multiple(User.Role.OPERATOR, User.Role.ADMIN);
const isDoctor = isRole(User.Role.DOCTOR);
const isAnon = (actor: Actor) => actor.isAnon();

const getId = (val: any) => typeof val === 'number' ? val : val.id;

const isExactDoctor = (actor: Actor, doc) => actor.id === getId(doc);

const checks: Node = {
  role: {
    anon: isAnon,
    admin: isAdmin,
    operator: isOperator,
    doctor: isDoctor,
    patient: isPatient,
  },
  doctor: {
    modify: async (actor, doctor) => {
      return isOperator(actor) || isExactDoctor(actor, doctor);
    }
  },
};

export default checks;
