import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = 'url-shortener';

let client: MongoClient;
let db: Db;

export default async function getCollection(name: string) {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
  }
  return db.collection(name);
}
