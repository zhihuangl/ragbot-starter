// import { NextResponse } from 'next/server'
// import { Pinecone } from '@pinecone-database/pinecone'
// import { TextLoader } from 'langchain/document_loaders/fs/text'
// import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
// import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
// import {
//     createPineconeIndex,
//     updatePinecone
// } from '../../../util'
// import { indexName } from '../../../config'

// //Used to interact with pinecone functions
// export async function POST() {
//     //getting all documents that we're storing
//     const loader = new DirectoryLoader('./documents', {
//         ".txt": (path) => new TextLoader(path),
//         ".md": (path) => new TextLoader(path),
//         ".pdf": (path) => new PDFLoader(path),
//     })

//     const docs = await loader.load()
//     const vectorDimensions = 1536

//     const client = new Pinecone({
//       apiKey: process.env.PINECONE_API_KEY,
//     });

//     try {
//         await createPineconeIndex(client, indexName, vectorDimensions)
//         await updatePinecone(client, indexName, docs)
//     } catch (err) {
//         console.log("ERROR: " , err)
//     }

//     return NextResponse.json({
//         data: "Successfully created index and loaded data into pinecone"
//     })
// }