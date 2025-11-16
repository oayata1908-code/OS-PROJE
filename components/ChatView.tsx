
import React, { useState, useRef, useEffect } from 'react';
import { Document, ChatMessage } from '../types';
import { askGeminiWithSearch, generateSpeech } from '../services/geminiService';
import { UserIcon, SparklesIcon, SendIcon, DocumentTextIcon, LinkIcon, SpeakerIcon, StopIcon } from './Icons';

interface ChatViewProps {
  document: Document;
}

// Audio decoding and playback helpers
const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(1, frameCount, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}


const ChatView: React.FC<ChatViewProps> = ({ document }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(null);
  const [playingMessage, setPlayingMessage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
     setAudioContext(new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 }));
     return () => {
        audioSource?.stop();
        audioContext?.close();
     }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const { text, sources } = await askGeminiWithSearch(input, document.content);
      const modelMessage: ChatMessage = { role: 'model', text, sources };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      setError('AI yanıt verirken bir hata oluştu. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePlayAudio = async (text: string, messageId: string) => {
    if (playingMessage === messageId) {
        audioSource?.stop();
        setAudioSource(null);
        setPlayingMessage(null);
        return;
    }

    if (audioSource) {
        audioSource.stop();
    }

    try {
        setPlayingMessage(messageId);
        const audioData = await generateSpeech(text);
        if (audioData && audioContext) {
            const decodedData = decode(audioData);
            const buffer = await decodeAudioData(decodedData, audioContext);
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.onended = () => {
                setPlayingMessage(null);
                setAudioSource(null);
            };
            source.start();
            setAudioSource(source);
        }
    } catch(err) {
        console.error("Error playing audio: ", err);
        setPlayingMessage(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50" style={{maxHeight: 'calc(100vh - 12rem)', minHeight: 'calc(100vh - 12rem)'}}>
      <div className="p-4 border-b border-slate-200 bg-white">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center">
            <DocumentTextIcon className="w-5 h-5 mr-2 text-slate-500" />
            Konu: <span className="ml-1 font-normal bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">{document.name}</span>
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-white" /></div>}
            <div className={`max-w-xl p-3 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-slate-200'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              {msg.role === 'model' && (
                <>
                  <button onClick={() => handlePlayAudio(msg.text, `msg-${index}`)} className="mt-2 p-1.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                     {playingMessage === `msg-${index}` ? <StopIcon className="w-4 h-4" /> : <SpeakerIcon className="w-4 h-4" />}
                  </button>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <h4 className="text-xs font-semibold text-slate-500 mb-2">Kaynaklar:</h4>
                      <div className="space-y-1.5">
                        {msg.sources.map((source, i) => (
                          <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs text-indigo-600 hover:underline">
                            <LinkIcon className="w-3 h-3 mr-1.5 flex-shrink-0" />
                            <span className="truncate">{source.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0"><UserIcon className="w-5 h-5 text-slate-600" /></div>}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-white animate-pulse" /></div>
                <div className="max-w-xl p-3 rounded-2xl bg-white border border-slate-200">
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                </div>
            </div>
        )}
        {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded-lg">{error}</div>}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="AI asistana bir soru sorun..."
            className="w-full pl-4 pr-12 py-2.5 border border-slate-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors">
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
