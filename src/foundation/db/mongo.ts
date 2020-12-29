import { MongoClient, Collection, Db } from 'mongodb';
import conf from 'conf';

const {url, db: dbName} = conf.spec.mongo;

// Create a new MongoClient
const client = new MongoClient(url, {
  useUnifiedTopology: true
});

async function connection(): Promise<MongoClient> {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client;
}

// async function db(name: string = dbName): Promise<Db> {
//   return (await connection()).db(name);
// }

function collection(name: string): Collection {
  return client.db(dbName).collection(name);
}

export default {
  connect: () => client.connect(),
  // connection,
  // db,
  collection
}