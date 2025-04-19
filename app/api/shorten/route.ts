import getCollection from '../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { alias, url } = await req.json();

    if (!alias || !url) {
      return NextResponse.json({ error: 'Need both alias and URL' }, { status: 400 });
    }

    const collection = await getCollection('links');

    const existing = await collection.findOne({ alias });
    if (existing) {
      return NextResponse.json({ error: 'Alias already taken' }, { status: 409 });
    }

    await collection.insertOne({ alias, url });

    return NextResponse.json({
      message: 'Short URL created',
      alias,
      shortUrl: `/r/${alias}`
    });
  } catch (err) {
    console.error('Error inserting link:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
