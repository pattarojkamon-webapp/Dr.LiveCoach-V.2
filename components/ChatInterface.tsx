
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, AppConfig, Role, Theme } from '../types';
import { TRANSLATIONS } from '../constants';
import { Send, LogOut, User as UserIcon, Bot, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  messages: ChatMessage[];
  config: AppConfig;
  onSendMessage: (text: string) => void;
  onEndSession: (durationSeconds: number) => void;
  isTyping: boolean;
  theme: Theme;
}

const ChatInterface: React.FC<Props> = ({ 
  messages, 
  config, 
  onSendMessage, 
  onEndSession,
  isTyping,
  theme
}) => {
  const [inputText, setInputText] = useState('');
  const [duration, setDuration] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[config.language];

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg`}
            style={{ backgroundColor: theme.secondary }}>
             {config.userRole === Role.COACH ? 'AI' : 'Dr'}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">
              {config.userRole === Role.COACH 
                ? `${config.persona.gender === 'Male' ? 'Mr.' : 'Ms.'} Client` 
                : 'Dr.LiveCoach (AI)'}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {t.activeNow} • {config.model}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {/* Timer Display */}
           <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
             <Clock size={14} className="text-slate-400" />
             <span className="text-sm font-mono font-medium text-slate-600">{formatTime(duration)}</span>
           </div>
        
          <button
            onClick={() => onEndSession(duration)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium text-sm"
          >
            <LogOut className="w-4 h-4" />
            {t.endSession}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] md:max-w-[70%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs
                  ${isUser ? 'bg-slate-700' : ''}`}
                  style={{ backgroundColor: !isUser ? theme.primary : undefined }}
                >
                  {isUser ? <UserIcon size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${isUser 
                    ? 'bg-slate-800 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}>
                  <ReactMarkdown 
                    components={{
                      p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                  <div className={`text-[10px] mt-2 opacity-70 text-right ${isUser ? 'text-slate-300' : 'text-slate-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start w-full">
            <div className="flex max-w-[80%] gap-3">
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white"
                style={{ backgroundColor: theme.primary }}
              >
                 <Bot size={14} />
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1.5 h-full items-center">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="relative flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            className="w-full pl-5 pr-14 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 outline-none transition-all shadow-inner text-slate-800 placeholder:text-slate-400"
            style={{ '--tw-ring-color': theme.secondary } as React.CSSProperties}
            placeholder={t.chatPlaceholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            autoFocus
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="absolute right-2 p-2.5 text-white rounded-lg hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100 transition-all"
            style={{ backgroundColor: theme.secondary }}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default ChatInterface;
