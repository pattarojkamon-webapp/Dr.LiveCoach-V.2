
import React from 'react';
import { Language, Theme } from '../types';
import { GUIDE_CONTENT } from '../constants';
import { X, Target, BookOpen, BarChart2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  theme: Theme;
}

const GuideModal: React.FC<Props> = ({ isOpen, onClose, language, theme }) => {
  if (!isOpen) return null;

  const content = GUIDE_CONTENT[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100"
             style={{ background: theme.gradient }}>
          <h2 className="text-xl font-bold text-white font-['Prompt'] flex items-center gap-2">
            <BookOpen size={24} />
            {content.title}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-white/80 hover:bg-white/20 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          
          {/* Objectives */}
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <div className="p-1.5 rounded-lg text-white" style={{ backgroundColor: theme.secondary }}>
                <Target size={18} />
              </div>
              {content.objectives.title}
            </h3>
            <p className="text-slate-600 leading-relaxed pl-10 text-justify">
              {content.objectives.content}
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* How To */}
          <section className="space-y-4">
             <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
               <div className="p-1.5 rounded-lg text-white" style={{ backgroundColor: theme.secondary }}>
                 <BookOpen size={18} />
               </div>
               {content.howTo.title}
             </h3>
             <ul className="space-y-3 pl-10">
               {content.howTo.steps.map((step: string, idx: number) => (
                 <li key={idx} className="flex gap-3 text-slate-600">
                   <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-slate-100 text-slate-600">
                     {idx + 1}
                   </span>
                   <span>{step}</span>
                 </li>
               ))}
             </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Evaluation Metrics */}
          <section className="space-y-4">
             <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
               <div className="p-1.5 rounded-lg text-white" style={{ backgroundColor: theme.secondary }}>
                 <BarChart2 size={18} />
               </div>
               {content.metrics.title}
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-0 md:pl-10">
                {content.metrics.items.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-200 transition-colors">
                    <h4 className="font-bold text-slate-800 mb-1" style={{ color: theme.primary }}>{item.name}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                ))}
             </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-white font-bold transition-all hover:brightness-110 shadow-lg"
            style={{ backgroundColor: theme.primary }}
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};

export default GuideModal;
