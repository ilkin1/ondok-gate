import {User} from "domain/models";
import Joi from "@hapi/joi";

export const create = (() => {
  const schema = Joi.object({
    state: User.Role.joi()
  });
  return async data => {
    const {} = schema.validateAsync(data);
    User.query().insert({

    });
  }
})();

