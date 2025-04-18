import { MongoClient } from 'mongodb';
import { redirect } from 'next/navigation';

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db('url-shortener');

// Pretend `params` is a generic object, cast manually
export default async function RedirectPage(props: { params: { [key: string]: unknown } }) {
  const alias = props.params.alias as string;

  const result = await db.collection('urls').findOne({ alias });

  if (result) {
    redirect(result.url);
  }

  return <p>Alias not found.</p>;
}
