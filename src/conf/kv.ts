import mongo from "foundation/db/mongo";

const coll = () => mongo.collection('conv_kv')

async function set(k, v) {
  await (await coll()).updateOne({k}, {$set: {v}});
}

async function find<V = any>(k: string): Promise<V | undefined> {
  return (await (await coll()).findOne({k}))?.v;
}

export {set, find};