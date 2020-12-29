import * as knex from 'knex'
import {Model} from 'objection';
import conf from 'conf';

const {
  database,
  hostname,
  port,
  user,
  password,
} = conf.spec.pg;
const connection = `postgres://${user}:${password}@${hostname}:${port}/${database}`;

const qb = knex({
  client: 'pg',
  connection
});

Model.knex(qb);

export default qb;