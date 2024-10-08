"use client";
import {useEffect, useRef, useState} from 'react';
import Bubble from '../components/Bubble'
import { useChat, Message } from 'ai/react';
import Footer from '../components/Footer';
import PromptSuggestionRow from '../components/PromptSuggestions/PromptSuggestionsRow';
import ThemeButton from '../components/ThemeButton';
import useConfiguration from './hooks/useConfiguration';
import './globals.css';

export default function Home() {
  const { append, messages, input, handleInputChange, handleSubmit } = useChat();
  const { useRag, llm, similarityMetric, setConfiguration } = useConfiguration();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    handleSubmit(e, { options: { body: { useRag, llm, similarityMetric } } });
  }

  const handlePrompt = (promptText) => {
    const msg: Message = { id: crypto.randomUUID(), content: promptText, role: 'user' };
    append(msg, { options: { body: { useRag, llm, similarityMetric } } });
  };
  return (
    <>
      <main className="flex h-screen flex-col items-center justify-center">
        <section className='chatbot-section flex flex-col origin:w-[800px] w-full origin:h-[735px] h-full rounded-md p-2 md:p-6'>
          <div className='chatbot-header pb-6'>
            <div className='flex justify-between'>
              <div className='flex items-center gap-2'>
                <svg width="24" height="25" viewBox="0 0 24 25">
                  <path d="M20 9.96057V7.96057C20 6.86057 19.1 5.96057 18 5.96057H15C15 4.30057 13.66 2.96057 12 2.96057C10.34 2.96057 9 4.30057 9 5.96057H6C4.9 5.96057 4 6.86057 4 7.96057V9.96057C2.34 9.96057 1 11.3006 1 12.9606C1 14.6206 2.34 15.9606 4 15.9606V19.9606C4 21.0606 4.9 21.9606 6 21.9606H18C19.1 21.9606 20 21.0606 20 19.9606V15.9606C21.66 15.9606 23 14.6206 23 12.9606C23 11.3006 21.66 9.96057 20 9.96057ZM7.5 12.4606C7.5 11.6306 8.17 10.9606 9 10.9606C9.83 10.9606 10.5 11.6306 10.5 12.4606C10.5 13.2906 9.83 13.9606 9 13.9606C8.17 13.9606 7.5 13.2906 7.5 12.4606ZM16 17.9606H8V15.9606H16V17.9606ZM15 13.9606C14.17 13.9606 13.5 13.2906 13.5 12.4606C13.5 11.6306 14.17 10.9606 15 10.9606C15.83 10.9606 16.5 11.6306 16.5 12.4606C16.5 13.2906 15.83 13.9606 15 13.9606Z" />
                </svg>
                <h1 className='chatbot-text-primary text-xl md:text-2xl font-medium'>EarthSupremacy Corp. Chatbot</h1>
              </div>
              <div className='flex gap-1'>
                <ThemeButton />
              </div>
            </div>
            <p className="chatbot-text-secondary-inverse text-sm md:text-base mt-2 md:mt-4">Chat with our EarthSupremacy Corp AI support agent for all of your needs and questions! Questions may or may not be answered depending on the contents and nature of the question!</p>
          </div>
          <div className='flex-1 relative overflow-y-auto my-4 md:my-6'>
            <div className='absolute w-full overflow-x-hidden'>
              {messages.map((message, index) => <Bubble ref={messagesEndRef} key={`message-${index}`} content={message} />)}
            </div>
          </div>
          {!messages || messages.length === 0 && (
            <PromptSuggestionRow onPromptClick={handlePrompt} />
          )}
          <form className='flex h-[40px] gap-2' onSubmit={handleSend}>
            <input onChange={handleInputChange} value={input} className='chatbot-input flex-1 text-sm md:text-base outline-none bg-transparent rounded-md p-2' placeholder='Send a message...' />
            <button type="submit" className='chatbot-send-button flex rounded-md items-center justify-center px-2.5 origin:px-3'>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M2.925 5.025L9.18333 7.70833L2.91667 6.875L2.925 5.025ZM9.175 12.2917L2.91667 14.975V13.125L9.175 12.2917ZM1.25833 2.5L1.25 8.33333L13.75 10L1.25 11.6667L1.25833 17.5L18.75 10L1.25833 2.5Z" />
              </svg>
              <span className='hidden origin:block font-semibold text-sm ml-2'>Send</span>
            </button>
          </form>
          <Footer />
        </section>
      </main>
    </>
  )
}