import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { data } = await req.json();

    if (!data) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: data,
    });

    const embedding = response.data[0].embedding;

    return NextResponse.json({ embedding }, { status: 200 });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
