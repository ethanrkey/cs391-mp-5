import { redirect } from 'next/navigation';
import { MongoClient } from 'mongodb';
import type { Metadata } from 'next';

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db('url-shortener');

type Props = {
  params: {
    alias: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Redirecting from ${params.alias}`,
  };
}

export default async function RedirectPage({ params }: Props) {
  const result = await db.collection('urls').findOne({ alias: params.alias });

  if (result) {
    redirect(result.url);
  }

  return <p>Alias not found.</p>;
}
