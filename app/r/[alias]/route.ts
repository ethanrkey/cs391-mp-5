import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db('url-shortener');

export async function GET(req: NextRequest, context: any) {
  const alias = context?.params?.alias;

  const result = await db.collection('urls').findOne({ alias });

  if (result?.url) {
    return NextResponse.redirect(result.url);
  }

  return new NextResponse('Alias not found', { status: 404 });
}
