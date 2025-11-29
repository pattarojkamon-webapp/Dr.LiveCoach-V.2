
import React, { useState, useEffect } from 'react';
import { SessionRecord, Theme, Language, User as AppUser } from '../types';
import { getSessions, deleteSession } from '../services/storageService';
import { TRANSLATIONS } from '../constants';
import { Clock, Calendar, Trash2, ArrowRight, User, Bot, FileText } from 'lucide-react';

interface Props {
  theme: Theme;
  language: Language;
  onSelectSession: (session: SessionRecord) => void;
  currentUser: AppUser | null;
}

const HistoryList: React.FC<Props> = ({ theme, language, onSelectSession, currentUser }) => {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (currentUser) {
      setSessions(getSessions(currentUser.id));
    }
  }, [currentUser]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (currentUser && confirm('Are you sure you want to delete this record?')) {
      const updated = deleteSession(id, currentUser.id);
      setSessions(updated);
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg text-white" style={{ backgroundColor: theme.primary }}>
          <FileText size={24} />
        </div>
        <h2 className="text-2xl font-bold font-['Prompt'] text-slate-800">{t.historyTitle}</h2>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={40} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">{t.noHistory}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div 
              key={session.id}
              onClick={() => onSelectSession(session)}
              className="group bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 transition-colors" style={{ backgroundColor: theme.secondary }}></div>
              
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-slate-800 font-['Prompt']">
                       {session.config.persona.topic}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                      {session.config.model}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(session.timestamp).toLocaleDateString(language === 'TH' ? 'th-TH' : 'en-US', { 
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {formatDuration(session.durationSeconds)}
                    </div>
                    <div className="flex items-center gap-1.5">
                       {session.config.userRole === 'Coach' ? <User size={14} /> : <Bot size={14} />}
                       {session.config.userRole}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => handleDelete(e, session.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                    title={t.deleteBtn}
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 group-hover:bg-slate-100 transition-colors text-slate-400">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryList;
