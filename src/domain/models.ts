import {Model as ObjectionModel} from 'objection';
import Enum from 'foundation/support/enum';

class Model extends ObjectionModel {
  [x: string]: any
}

export class User extends Model {
  static State = Enum({
    ACTIVE: 'a',
    INACTIVE: 'i',
    BANNED: 'b',
    EMAIL_NOT_VERIFIED: 'm'
  });
  static Sex = Enum({MALE: 'm', FEMALE: 'f'});
  static Role = Enum({
    ADMIN: 'a',
    OPERATOR: 'o',
    DOCTOR: 'd',
    PATIENT: 'p'
  });
  static readonly tableName = 'users';

  static get manager() {
    return require('./user');
  }

  // static readonly Scope = {
  //   PUBLIC: ['id', 'firstName', 'lastName', 'avatar']
  // };

  static get relationMappings() {
    return {
      // agent: {
      //   relation: Model.HasOneRelation,
      //   modelClass: Agent,
      //   join: {
      //     from: 'agent.userId',
      //     to: 'users.id'
      //   }
      // },
    };
  }
}

export class Doctor extends Model {
  static readonly tableName = 'doctor';
  static State = Enum({
    ACTIVE: 'a',
    INACTIVE: 'i',
    BANNED: 'b',
    EMAIL_NOT_VERIFIED: 'm'
  });

  static get manager() {
    return require('./doctor');
  }

  public $schedule() {
    return Doctor.manager.schedule.make(this);
  }
}

export class Appointment extends Model {
  static readonly tableName = 'appointment';
  public static Type = Enum({
    ONLINE: 'o',
    OFFLINE: 'f'
  });
  public static State = Enum({
    CANCELED: 'c',
    EXTERNAL: 'e'
  });

  static get relationMappings() {
    return {
      doctor: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'appointment.doctorId',
          to: 'users.id'
        }
      },
      company: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'appointment.patientId',
          to: 'users.id'
        }
      }
    };
  }
}

export class Timetable extends Model {
  static readonly tableName = 'timetable';

  static get relationMappings() {
    return {
      doctor: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'timetable.doctorId',
          to: 'doctor.id'
        }
      },
    };
  }
}

export class Payment extends Model {
  static readonly tableName = 'payment';
  public static get manager() {
    return require('./payment');
  }


}

