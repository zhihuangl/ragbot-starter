import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Pinecone } from '@pinecone-database/pinecone';
import { NextRequest, NextResponse } from 'next/server';
import { queryPineconeVectorStoreAndQueryLLM } from '../../../util';
import { indexName } from '../../../config';  

export async function POST(req: NextRequest) {
  const body = await req.json()
  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const text = await queryPineconeVectorStoreAndQueryLLM(client, indexName, body);
  return NextResponse.json({
    data: text
  })

}

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const pinecone = new Pinecone({
//   apiKey: process.env.PINECONE_API_KEY,
// });

// const index = pinecone.index('aisupport');

// export async function POST(req: Request) {
//   try {
//     const { messages, llm } = await req.json();

//     const baseUrl = new URL(req.url).origin;
//     const embeddingUrl = `${baseUrl}/api/embedding`;

//     const embeddingResponse = await fetch(embeddingUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ data: messages.map(msg => msg.content).join(' ') }),
//     });

//     if (!embeddingResponse.ok) {
//       throw new Error('Failed to retrieve embedding vector');
//     }

//     const { embedding } = await embeddingResponse.json();

//     const queryResponse = await index.query({
//       topK: 4,
//       vector: embedding,
//       includeValues: true,
//       includeMetadata: true,
//     });

//     const matches = queryResponse.matches;

//     const contextContent = matches.map(match => match.metadata.content).join('\n\n');

//     const ragPrompt = [
//       {
//         role: 'system',
//         content: `You are an AI assistant answering questions. Format responses using markdown where applicable.
//         If the answer is not provided in the context, the AI assistant will say, "I'm sorry, I don't know the answer".`,
//       },
//       {
//         role: 'system',
//         content: `Context:\n${contextContent}`,
//       },
//     ];

//     const response = await openai.chat.completions.create({
//       model: llm ?? 'gpt-3.5-turbo',
//       stream: true,
//       messages: [...ragPrompt, ...messages],
//     });

//     const stream = OpenAIStream(response);
//     return new StreamingTextResponse(stream);

//   } catch (e) {
//     console.error('Error:', e);
//     throw e;
//   }
// }
