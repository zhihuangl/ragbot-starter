import { Pinecone } from '@pinecone-database/pinecone';
import { config } from 'dotenv';
config();

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const explindex = pc.index('aisupport');
