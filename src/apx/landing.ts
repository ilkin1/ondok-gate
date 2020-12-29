import op from "op";
import Joi from "@hapi/joi";
import {DateTime} from "luxon";

const col = () => op.mongo.collection('survey');

function addSurvey() {
  const schema = Joi.any();
  return async ctx => {
    const data = await op(ctx).apx.validJson(schema);
    await col().insertOne({
      createdAt: DateTime.local().toBSON(),
      data
    });
    op(ctx).mails.dispatch({
      to: data.contacts.email,
      name: 'survey-thanks',
    });
  }
}

export default {
  sub: {
    'survey.add': addSurvey
  }
}