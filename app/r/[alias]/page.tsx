import { MongoClient } from 'mongodb';
import { redirect } from 'next/navigation';

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db('url-shortener');

export default async function RedirectPage({ params }: { params: { alias: string } }) {
  const result = await db.collection('urls').findOne({ alias: params.alias });

  if (result) {
    redirect(result.url);
  }

  return <p>Alias not found.</p>;
}
