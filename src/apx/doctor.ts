import op from "op"
import Joi from "@hapi/joi"
import {Appointment, Doctor, Payment, User} from "domain/models";
import {badRequest} from "boom";
import {ApxRoute} from "foundation/apx";


function apply() {
  const schema = Joi.object({
    doctorId: Joi.number().positive().required(),
    appointment: Joi.object({
      start: Joi.string().isoDate().required(),
      duration: Joi.number().positive().required()
    }),
    payment: Joi.object({
      type: Joi.string().required()
    }).required(),
  });
  return async ctx => {
    const {doctorId, appointment, payment} = await op(ctx).apx.validJson(schema);

    const doc = await Doctor.query().findById(doctorId);
    if (doc.state !== Doctor.State.ACTIVE) throw badRequest('doc-inactive');

    const schedule = Doctor.manager.schedule.make(doc);
    if (!await schedule.isAvailable(appointment)) throw badRequest('time-unavailable');

    const app = await Appointment.query().insertAndFetch({
      type: Appointment.Type.ONLINE,
      doctorId,
    });

    const pay = Payment.manager.makeAndReserve(payment);

    return {id: app.id};
  }
}

function externalAppointment() {

}

function create() {
  const schema = Joi.object({
    sig: Joi.string().required()
  });
  return async ctx => {
    await op(ctx).act.obstruct('doctor.modify');
    const {...doc} = await op(ctx).apx.validJson(schema);
    const {id} = await Doctor.query().insertAndFetch({
      ...doc, state: Doctor.State.INACTIVE
    });
    return {id};
  }
}

function signUpDoctor() {
  const schema = Joi.object({
    id: Joi.number().positive().required(),
    sig: Joi.string().required(),
    user: Joi.any().required()
  });
  return async ctx => {
    const {id, sig, user: userData} = await op(ctx).apx.validJson(schema);
    const doc = await Doctor.query().findById(id);

    if (doc === undefined) throw badRequest('doc-not-found');
    if (!await Doctor.manager.checkBindDoctorSig(doc, sig)) throw badRequest('invalid-sig');
    if (doc.userId !== undefined) throw badRequest('doc-has-user');

    const user = await User.manager.create({...userData, role: User.Role.DOCTOR});

    await doc.$query().patch({userId: user.id});
  }
}

function getDocSig() {
  return async ctx => {
    const id = op(ctx).apx.qInt('id');
    const sig = await Doctor.manager.genBindDoctorSig(id);
    return {sig};
  }
}

export default {
  name: 'doctor',
  sub: [
    {name: 'get-bind-sig', factory: getDocSig},
    {name: 'create', factory: create},
    {name: 'sign-up', factory: signUpDoctor}
  ]
} as ApxRoute