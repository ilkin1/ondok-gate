import Joi from "@hapi/joi";

function unsubscribe() {
  const schema = Joi.object({
  });
  return async ctx => {

  }
}

export default {
  name: 'mailing',
  sub: [
    unsubscribe
  ]
}