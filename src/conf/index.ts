import spec from 'conf/spec';
import { Settings } from 'luxon';

process.env.TZ = 'UTC';
Settings.defaultZoneName = 'UTC';

export type Env = 'production' | 'development' | 'test' | 'local';

const pwaUrl = 'http://localhost:3000';

const conf = {
  debug: spec.debug,
  isDev: true,
  spec,
  pwaUrls: {
    root: pwaUrl,
    unsubscribe: `${pwaUrl}/unsubscribe`
  },
  //
  // media: {
  //   port: 3002
  // },
  //
  dirs: {
    project: spec.projectPath,
    res: `${spec.projectPath}/res`
  },
  //
  // port: process.env.GATE_PORT || params.port,
  //
  // http: {
  //   prefix: '/api'
  // },
  //
  // env: params.env as Env,
  // debug: params.debug,
  // isDev: params.env === 'development',
  // isProd: params.env === 'production',
  //
  // website: {
  //   url: params.siteUrl
  // },
  //
  // aws: { credentials: p.aws, region: 'eu-central-1' },
  //
  // logging: typeof p.logger === 'string' ? {
  //   driver: p.logger
  // } : p.logger,
  //
  // pie: params.pie ?? {
  //   bin: `${p.projectPath}/pie/venv/bin/python`,
  //   app: `${p.projectPath}/pie/app.py`
  // },
  //
  // cache: {
  //   redis: 'redis://127.0.0.1:6379'
  // },
};

export default Object.freeze(conf);