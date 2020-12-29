module.exports = {
  apps: [
    // {
    //   name: 'site-dev',
    //   script: 'dist/gate.js',
    //   // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    //   // args: 'one two',
    //   instances: 1,
    //   autorestart: true,
    //   watch: true,
    //   max_memory_restart: '1G',
    //   env: {
    //     NODE_ENV: 'development'
    //   },
    //   env_production: {
    //     NODE_ENV: 'production'
    //   }
    // },
    {
      name: 'gate-dev',
      script: 'dist/gate.js',
      // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
      // args: 'one two',
      instances: 1,
      autorestart: true,
      watch: 'dist/gate.js',
      max_memory_restart: '1G',
      exec_mode: "fork",
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
  ]
}
