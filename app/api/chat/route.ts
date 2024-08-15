import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Pinecone } from '@pinecone-database/pinecone';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.index('aisupport');

export async function POST(req: Request) {
  try {
    const { messages, llm } = await req.json();

    const baseUrl = new URL(req.url).origin;
    const embeddingUrl = `${baseUrl}/api/embedding`;

    const embeddingResponse = await fetch(embeddingUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: messages.map(msg => msg.content).join(' ') }),
    });

    if (!embeddingResponse.ok) {
      throw new Error('Failed to retrieve embedding vector');
    }

    const { embedding } = await embeddingResponse.json();

    const queryResponse = await index.query({
      topK: 4,
      vector: embedding,
      includeValues: true,
      includeMetadata: true,
    });

    const matches = queryResponse.matches;
    console.log(matches)
    const contextContent = matches.map(match => match.metadata.content).join('\n\n');
    //console.log(contextContent)
    const ragPrompt = [
      {
        role: 'system',
        content: `You are an AI customer service agent. You must respond to queries from the user in a friendly and respectful manner.
        If the answer is not provided in the context, the AI customer service agent will say, "I'm sorry, I don't know the answer, please reach out to our support team".`,
      },
      {
        role: 'system',
        content: `Context:\n${contextContent}`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: llm ?? 'gpt-3.5-turbo',
      stream: true,
      messages: [...ragPrompt, ...messages],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);

  } catch (e) {
    console.error('Error:', e);
    throw e;
  }
}