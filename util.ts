// import { OpenAIEmbeddings } from "@langchain/openai";
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
// //import { OpenAI } from '@langchain/openai'
// import { loadQAStuffChain } from 'langchain/chains'
// import { Document } from 'langchain/document'
// import { timeout } from './config'
// import OpenAI from "openai";

// export const createPineconeIndex = async (
//     client,
//     indexName,
//     vectorDimension
// ) => {
//     // Check if index exists
//     console.log(`Checking index: "${indexName}"...`);
//     // Get a list of existing indexes
//     const existingIndexes = await client.listIndexes();
//     // If index does not exist, create it
//     const indexExists = existingIndexes.indexes.some(index => index.name === indexName);
//     if (!indexExists){ //index does not exist
//         console.log(`Creating "${indexName}"...`);
//         //creating index:
//         await client.createIndex({
//             name: indexName,
//             dimension: vectorDimension,
//             metric: 'cosine',
//             spec: {
//                 serverless: {
//                   cloud: 'aws',
//                   region: 'us-east-1'
//                 }
//             }
//         });

//         console.log("Creating index, wait");
//         //Wait 80 seconds for creating index
//         await new Promise((resolve) => setTimeout(resolve, timeout));
//     } else { //Index already exists
//         console.log(`"${indexName}" exists.`);
//     }
// }

// //Uploading data to pinecone index
// export const updatePinecone = async (client, indexName, docs) => {
//     //get pinecone index
//     const index = client.Index(indexName);
//     console.log(`Pinecone index retrieved: ${indexName}`);

//     //Process each document in docs array:
//     for (const doc of docs){
//         console.log(`processing document: ${doc.metadata.source}`);
//         const textPath = doc.metadata.source;
//         const text = doc.pageContent;

//         //Creating instance 
//         const textSplitter = new RecursiveCharacterTextSplitter({
//             chunkSize: 2000,    //Was originally 1000 with no overlap, needs testing.
//             chunkOverlap: 100,
//         });
//         console.log('Splitting text into chunks...');
//         // Split text into chunks (documents)
//         const chunks = await textSplitter.createDocuments([text]);
//         console.log(`Text split into ${chunks.length} chunks`);
//         console.log(`Calling OpenAI's Embedding endpoint documents with ${chunks.length} text chunks`);
        
//         //Create OpenAI embeddings for documents
//         const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
//             chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " ")) //Replacing newlines with space
//         );
//         //embeddingsArrays can be used with pinecone
//         console.log(`Creating ${chunks.length} vector arrays with id, values and metadata`);

//         //Now data is formatted and needs to be uploaded to pinecone
//         //Create and upsert vectors in batches of 100
//         const batchSize = 100;
//         let batch: any = []; //empty array with any type
//         for(let i=0; i<chunks.length;i++){
//             const chunk = chunks[i];
//             const vector = {
//                 id: `${textPath}_${i}`,
//                 values: embeddingsArrays[i],
//                 metadata: {
//                     ...chunk.metadata,
//                     loc: JSON.stringify(chunk.metadata.loc),
//                     pageContent: chunk.pageContent,
//                     textPath: textPath,
//                 },
//             };

//             //Push vector into batch
//             batch.push(vector)
            
//             //If batch is full or we get to the last item, upsert the vectors
//             if (batch.length === batchSize || i === chunks.length-1){
//                 await index.upsert(
//                     batch
//                 );
//                 batch = []; //empty batch
//             }
//         }
//         console.log(`Pinecone index updated with ${chunks.length} vectors`);
//     }
// };

// //Querying pinedata database
// export const queryPineconeVectorStoreAndQueryLLM = async (
//     client, 
//     indexName,
//     question,
// ) => {
//     console.log("Querying Pinecone vector store...");
//     // Retrieve pinecone index
//     const index = client.index(indexName);
//     // Create query embedding
//     const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question)

//     //Querying pinecone db and getting top 10 matches
//     let queryResponse = await index.query({
//         topK: 10,
//         vector: queryEmbedding,
//         includeMetadata: true,
//         includeValues: true,
//     });

//     console.log(`Found ${queryResponse.matches.length} matches`);
//     console.log(`Asking question: ${question}`);

//     //if we have matches, we can call openai with the data
//     if (queryResponse.matches.length){
//         //Extract and concatenate page contents from matched documents
//         let concatenatedPageContent = queryResponse.matches.map(
//             (match) => match.metadata.pageContent)
//             .join(" ");  

//         //console.log("Original concatenatedPageContent Length: ",concatenatedPageContent.length)
//         // if (concatenatedPageContent.length > 17000){
//         //     concatenatedPageContent = concatenatedPageContent.slice(0, 16000)
//         // }
//         //console.log("After slicing concatenatedPageContent Length: ", concatenatedPageContent.length)

//         //CALL TO OPENAI AFTER APPENDING CONTEXT
//         const combinedPrompt = `Context: ${concatenatedPageContent}\n\nQuestion: ${question}, if there is provided context use it to answer`;
//         console.log("COMBINED PROMPT",combinedPrompt)
//         // Make a call to OpenAI with the combined context
//         const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//         //const result = await openai.invoke(combinedPrompt);
//         const result = await openai.chat.completions.create({
//             messages: [{ role: "system", content: combinedPrompt }],    
//             model: "gpt-3.5-turbo",
//         });
//         console.log("RESULT: ", result)
//         return result.choices[0].message.content;

//     } else {
//         console.log("No matches, no query");
//     }

// }
