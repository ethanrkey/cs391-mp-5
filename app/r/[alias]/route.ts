import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db('url-shortener');

export async function GET(
  request: Request,
  context: { params: { alias: string } }
) {
  const { alias } = context.params;

  const result = await db.collection('urls').findOne({ alias });

  if (result?.url) {
    return NextResponse.redirect(result.url);
  }

  return new NextResponse('Alias not found', { status: 404 });
}
