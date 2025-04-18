import { MongoClient } from 'mongodb';
import { redirect } from 'next/navigation';

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db('url-shortener');

type Props = {
  params: {
    alias: string;
  };
};

export default async function RedirectPage({ params }: Props) {
  const { alias } = params;

  const result = await db.collection('urls').findOne({ alias });

  if (result) {
    redirect(result.url);
  }

  return <p>Alias not found.</p>;
}
