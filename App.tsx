
import React, { useState } from 'react';
import { AppState, AppConfig, ChatMessage, EvaluationResult, Role, Theme, Language, SessionRecord, User } from './types';
import Configuration from './components/Configuration';
import ChatInterface from './components/ChatInterface';
import LiveInterface from './components/LiveInterface';
import EvaluationDashboard from './components/EvaluationDashboard';
import HistoryList from './components/HistoryList';
import GuideModal from './components/GuideModal';
import { generateReply, generateEvaluation } from './services/geminiService';
import { saveSession } from './services/storageService';
import { THEMES, TRANSLATIONS } from './constants';
import { BrainCircuit, Globe, Palette, FileText, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  // Initialize as Default Guest User
  const [currentUser] = useState<User>({
    id: 'guest_user',
    username: 'Guest',
    name: 'Guest User',
    createdAt: Date.now()
  });

  const [appState, setAppState] = useState<AppState>('CONFIG');
  
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // UI Customization
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [currentLang, setCurrentLang] = useState<Language>('TH');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const t = TRANSLATIONS[currentLang];

  const startSession = async (newConfig: AppConfig) => {
    setConfig(newConfig);
    setMessages([]);
    setEvaluation(null);
    
    if (newConfig.interactionType === 'VOICE') {
      setAppState('LIVE_SESSION');
    } else {
      setAppState('CHAT');
      // Initial System Message
      const initialText = newConfig.userRole === Role.COACH 
        ? t.greetingCoach
        : t.greetingCoachee;

      const initialMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        text: initialText,
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!config) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    const newHistory = [...messages, newUserMsg];
    setMessages(newHistory);
    setIsTyping(true);

    try {
      const replyText = await generateReply(newHistory, config);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: replyText,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEndSession = async (finalHistory: ChatMessage[] = messages, durationSeconds: number = 0) => {
    if (!config || !currentUser) return;
    
    setMessages(finalHistory);
    setAppState('LOADING_EVALUATION');
    
    try {
      const result = await generateEvaluation(finalHistory, config);
      setEvaluation(result);
      
      const record: SessionRecord = {
        id: Date.now().toString(),
        userId: currentUser.id, // Associate with user
        timestamp: Date.now(),
        durationSeconds,
        config,
        messages: finalHistory,
        evaluation: result
      };
      saveSession(record);

      setAppState('EVALUATION');
    } catch (error) {
      console.error("Evaluation failed", error);
      setAppState('CHAT');
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setEvaluation(null);
    setAppState('CONFIG');
  };

  const handleSelectHistory = (session: SessionRecord) => {
    setConfig(session.config);
    setMessages(session.messages);
    setEvaluation(session.evaluation);
    setAppState('EVALUATION');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 transition-colors duration-500" style={{ backgroundColor: currentTheme.background }}>
      
      {/* Top Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setAppState('CONFIG')}
          >
            <div className="p-2.5 rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform" style={{ background: currentTheme.gradient }}>
              <BrainCircuit size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-['Prompt']">{t.title}</h1>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline-block tracking-wide">{t.subtitle}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
             {/* Guide Button */}
             <button
               onClick={() => setIsGuideOpen(true)}
               className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-2"
               title={t.guideBtn}
             >
               <BookOpen size={20} />
               <span className="text-sm font-medium hidden md:inline">{t.guideBtn}</span>
             </button>

             {/* History Button */}
             <button 
               onClick={() => setAppState('HISTORY')}
               className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-2"
               title={t.historyTitle}
             >
               <FileText size={20} />
               <span className="text-sm font-medium hidden md:inline">{t.historyTitle}</span>
             </button>

             <div className="h-6 w-px bg-slate-200 mx-1"></div>

             {/* Theme Selector */}
             <div className="relative group">
               <button className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors" title="Select Theme">
                 <Palette size={20} />
               </button>
               <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden hidden group-hover:block animate-fade-in z-50">
                 <div className="p-2 space-y-1">
                   {THEMES.map(theme => (
                     <button
                       key={theme.id}
                       onClick={() => setCurrentTheme(theme)}
                       className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 ${currentTheme.id === theme.id ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                     >
                       <div className="w-6 h-6 rounded-md shadow-sm" style={{ background: theme.gradient }}></div>
                       {theme.name}
                     </button>
                   ))}
                 </div>
               </div>
             </div>

             {/* Language Selector */}
             <div className="relative group">
               <button className="flex items-center gap-1.5 p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors border border-transparent hover:border-slate-200">
                 <Globe size={18} />
                 <span className="text-xs font-bold uppercase">{currentLang}</span>
               </button>
               <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden hidden group-hover:block animate-fade-in z-50">
                 <div className="p-1">
                   {(['TH', 'EN', 'CN'] as Language[]).map(lang => (
                     <button
                       key={lang}
                       onClick={() => setCurrentLang(lang)}
                       className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${currentLang === lang ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}
                     >
                       {lang === 'TH' ? '🇹🇭 ไทย' : lang === 'EN' ? '🇺🇸 English' : '🇨🇳 中文'}
                     </button>
                   ))}
                 </div>
               </div>
             </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-8 pb-12 px-4 sm:px-6 relative">
        
        {appState === 'CONFIG' && (
          <div className="animate-fade-in-up">
            <Configuration onStart={startSession} theme={currentTheme} language={currentLang} />
          </div>
        )}

        {appState === 'CHAT' && config && (
          <div className="animate-fade-in">
            <ChatInterface 
              config={config}
              messages={messages}
              onSendMessage={handleSendMessage}
              onEndSession={(duration) => handleEndSession(messages, duration)}
              isTyping={isTyping}
              theme={currentTheme}
            />
          </div>
        )}

        {appState === 'LIVE_SESSION' && config && (
          <div className="animate-fade-in">
            <LiveInterface 
              config={config}
              theme={currentTheme}
              onEndSession={(history) => handleEndSession(history, 0)}
            />
          </div>
        )}

        {appState === 'LOADING_EVALUATION' && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: currentTheme.secondary, borderTopColor: 'transparent' }}></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 font-['Prompt']">{t.analyzing}</h2>
              <p className="text-slate-500 mt-2">{t.analyzingDesc}</p>
            </div>
          </div>
        )}

        {appState === 'EVALUATION' && evaluation && config && (
          <div className="animate-fade-in">
            <EvaluationDashboard 
              result={evaluation}
              config={config}
              messages={messages}
              onRestart={handleRestart}
              theme={currentTheme}
            />
          </div>
        )}

        {appState === 'HISTORY' && (
          <HistoryList 
            theme={currentTheme} 
            language={currentLang} 
            onSelectSession={handleSelectHistory}
            currentUser={currentUser}
          />
        )}

      </main>

      {/* Guide Modal */}
      <GuideModal 
        isOpen={isGuideOpen} 
        onClose={() => setIsGuideOpen(false)} 
        language={currentLang}
        theme={currentTheme}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm mt-auto" style={{ background: currentTheme.primary }}>
        <div className="max-w-7xl mx-auto px-4 text-white opacity-80">
          <p>{t.footerCopyright}</p>
          <p className="mt-2 opacity-60 text-xs">Simulated Environment. Powered by Google Gemini 2.5 Flash</p>
        </div>
      </footer>

    </div>
  );
};

export default App;