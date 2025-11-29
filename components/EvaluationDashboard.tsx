
import React, { useState } from 'react';
import { EvaluationResult, AppConfig, Role, Theme, ChatMessage } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { RefreshCw, CheckCircle, AlertTriangle, Lightbulb, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { COLORS, TRANSLATIONS } from '../constants';

interface Props {
  result: EvaluationResult;
  config: AppConfig;
  messages?: ChatMessage[];
  onRestart: () => void;
  theme: Theme;
}

const EvaluationDashboard: React.FC<Props> = ({ result, config, messages, onRestart, theme }) => {
  const t = TRANSLATIONS[config.language];
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 pb-20 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-['Prompt'] text-slate-900">{t.evalTitle}</h1>
          <p className="text-slate-500 mt-1">
            {t.evalSub} <span className="font-semibold" style={{ color: theme.secondary }}>{config.userRole}</span>
          </p>
        </div>
        <button 
          onClick={onRestart}
          className="flex items-center gap-2 px-5 py-2.5 text-white rounded-lg hover:brightness-110 transition-all font-medium"
          style={{ backgroundColor: theme.primary }}
        >
          <RefreshCw className="w-4 h-4" />
          {t.newSession}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6 border-l-4 pl-3" style={{ borderColor: theme.secondary }}>{t.radarTitle}</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={result.metrics}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#cbd5e1" />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke={theme.secondary}
                  fill={theme.secondary}
                  fillOpacity={0.5}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-l-4 border-emerald-500 pl-3">{t.summaryTitle}</h3>
          <p className="text-slate-600 leading-relaxed flex-grow italic">
            "{result.summary}"
          </p>
          
          <div className="mt-6 pt-6 border-t border-slate-100">
             <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">{t.scoreBreakdown}</h4>
             <div className="space-y-3">
               {result.metrics.map((m) => (
                 <div key={m.category} className="flex items-center justify-between">
                   <span className="text-sm font-medium text-slate-700">{m.category}</span>
                   <div className="flex items-center gap-3 w-1/2">
                      <div className="h-2 flex-grow bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${(m.score / 10) * 100}%`, backgroundColor: m.score >= 8 ? COLORS.success : m.score >= 5 ? COLORS.warning : '#ef4444' }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-slate-800 w-6 text-right">{m.score}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

      </div>

      {/* Detailed Feedback Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Strengths */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-green-800">{t.strengths}</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {result.strengths.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span className="text-green-500 font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-amber-800">{t.improvements}</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {result.improvements.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span className="text-amber-500 font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-sky-50 px-6 py-4 border-b border-sky-100 flex items-center gap-2" style={{ backgroundColor: theme.accent + '33', borderColor: theme.accent }}>
            <Lightbulb className="w-5 h-5" style={{ color: theme.secondary }} />
            <h3 className="font-bold" style={{ color: theme.primary }}>{t.actions}</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {result.recommendedActions.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span className="font-bold" style={{ color: theme.secondary }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Transcript Toggle (If messages exist) */}
      {messages && messages.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <button 
            onClick={() => setShowTranscript(!showTranscript)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <MessageSquare className="w-5 h-5" style={{ color: theme.secondary }} />
              {t.transcript}
            </div>
            {showTranscript ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
          </button>
          
          {showTranscript && (
             <div className="p-6 border-t border-slate-100 bg-slate-50 max-h-96 overflow-y-auto space-y-4">
               {messages.map((msg) => (
                 <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.role === 'user' ? 'bg-white border border-slate-200 text-slate-800' : 'bg-slate-200 text-slate-800'}`}>
                     <p className="font-bold text-xs mb-1 opacity-70">{msg.role === 'user' ? 'You' : 'AI'}</p>
                     {msg.text}
                   </div>
                 </div>
               ))}
             </div>
          )}
        </div>
      )}

    </div>
  );
};

export default EvaluationDashboard;
