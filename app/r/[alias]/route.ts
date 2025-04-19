import { NextResponse } from 'next/server';
import getCollection from '../../lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ alias: string }> }
): Promise<NextResponse> {
  const { alias } = await params;

  const collection = await getCollection('links');
  const link = await collection.findOne({ alias });

  if (!link) {
    return NextResponse.json({ error: 'doesnt exist' }, { status: 404 });
  }

  return NextResponse.redirect(link.url);
}
