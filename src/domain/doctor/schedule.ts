import {Appointment, Doctor, Timetable} from "domain/models";
import mem from "foundation/support/mem";
import {DateTime} from "luxon";
import {pick} from "ramda";


type CreateOptions = {}

function create({}: CreateOptions) {

}

async function check() {
  const sch = await Doctor.query().findById(1);


}

export function make(doc: Doctor) {
  return new Schedule(doc);
}

class Schedule {
  private doc: Doctor;

  constructor(doc: Doctor) {
    this.doc = doc;
    this.getAppointments = mem(this.getAppointments);
  }

  private get schedule() {
    return this.doc.schedule;
  }

  private async isAvailableInSchedule(app): Promise<boolean> {
    const startFull = DateTime.fromISO(app.start);
    const day = startFull.weekday;

    const tables = await Timetable.query()
      .where('doctorId', this.doc.id)
      .where('start', '<', app.start)
      .orderBy('start', 'asc')
      // .first()
    ;

    const sch = tables[0].schedule[day];
    if (sch === null) return false;

    const start = DateTime.fromObject(pick(['hour', 'minute'], startFull.toObject()));
    const end = start.plus({minutes: app.duration});
    for (let period of sch) {
      if (
        DateTime.fromFormat(period[0], 'h:m') >= start
        && DateTime.fromFormat(period[1], 'h:m') <= end
      ) return true;
    }
    return false
  }

  public async isAvailable(req): Promise<boolean> {
    if (await this.isAvailableInSchedule(req)) return false;

    const apps = await this.getAppointments();
    const reqStart = DateTime.fromISO(req.start);
    for (let app of apps) {
      const start = DateTime.fromISO(app.start);
      const diff = reqStart.diff(start);
      if (diff.as('days') !== 0) continue;
      const dm = diff.as('minutes');
      if (dm <= 0) {
        if (dm > app.duration) return false;
      } else {
        if (dm > app.duration) return false;
      }
    }
    return true;
  }

  private async getAppointments() {
    return Appointment.query()
      .where('doctorId', this.doc.id)
      .where('start', '>', DateTime.utc().toISO())
      .where('state', '!=', Appointment.State.CANCELED)
      .orderBy('start', 'asc')
      // .debug()
      ;
  }
}

