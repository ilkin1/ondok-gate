import apx from 'foundation/apx';

const middleware = apx({
  sub: [
    require('./landing').default,
    require('./intl').default,
    // require('./push').default,
    // require('./doctor').default,
    // require('./dev').default,
    // require('./note').default,
    // require('./board').default,
    // require('./push').default,
  ]
});

export default middleware;