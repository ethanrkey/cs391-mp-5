import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db('url-shortener');

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
    const { url, alias } = await req.json();
  
    if (!url || typeof url !== 'string' || !isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid or missing URL' }, { status: 400 });
    }
  
    if (!alias || typeof alias !== 'string' || alias.trim() === '') {
      return NextResponse.json({ error: 'Alias is required' }, { status: 400 });
    }
  
    const existing = await db.collection('urls').findOne({ alias });
  
    if (existing) {
      return NextResponse.json({ error: 'Alias already taken' }, { status: 409 });
    }
  
    await db.collection('urls').insertOne({ alias, url });
  
    return NextResponse.json(
      { message: 'Short URL created', shortUrl: `/r/${alias}` },
      { status: 201 }
    );
}
