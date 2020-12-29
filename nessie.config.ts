import { ClientPostgreSQL } from "https://deno.land/x/nessie/mod.ts";
import { ClientMySQL } from "https://deno.land/x/nessie/mod.ts";
import { ClientSQLite } from "https://deno.land/x/nessie/mod.ts";
import conf from './src/conf/index.ts';

/** These are the default config options. */
const clientOptions = {
  migrationFolder: "./db/migrations",
  seedFolder: "./db/seeds",
};

/** Select one of the supported clients */
const clientPg = new ClientPostgreSQL(clientOptions, {
  database: "nessie",
  hostname: "localhost",
  port: 5432,
  user: "root",
  password: "pwd",
});

/** This is the final config object */
const config = {
  client: clientPg,
  // Defaults to false, if you want the query builder exposed in migration files, set this to true.
  exposeQueryBuilder: false,
};

export default config;
