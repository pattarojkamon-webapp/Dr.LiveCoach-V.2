
import React, { useState } from 'react';
import { AppConfig, CoachingModel, Role, Persona, Theme, Language, InteractionType } from '../types';
import { TRANSLATIONS } from '../constants';
import { User, Briefcase, MessageSquare, PlayCircle, Settings, Mic, MessageCircle } from 'lucide-react';

interface Props {
  onStart: (config: AppConfig) => void;
  theme: Theme;
  language: Language;
}

const Configuration: React.FC<Props> = ({ onStart, theme, language }) => {
  const [userRole, setUserRole] = useState<Role>(Role.COACH);
  const [interactionType, setInteractionType] = useState<InteractionType>('TEXT');
  const [model, setModel] = useState<CoachingModel>(CoachingModel.GROW);
  
  // Updated Default Values
  const [persona, setPersona] = useState<Persona>({
    gender: 'Male', // Default: Male
    age: '26-35',   // Default: 26-35
    profession: 'ครู', // Teacher
    position: 'หัวหน้ากลุ่มสาระ', // Head of Department
    topic: 'หมดไฟกับงาน จนแบ่งเวลาชีวิตส่วนตัวไม่ถูก', // Burnout context
  });

  const t = TRANSLATIONS[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({ userRole, persona, model, language, interactionType });
  };

  // Input common style
  const inputClass = "w-full p-3 border border-slate-200 rounded-lg bg-slate-50/50 focus:bg-white focus:ring-2 outline-none transition-all shadow-inner text-slate-800";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        
        {/* Header with Gradient */}
        <div className="p-8 text-white relative overflow-hidden" style={{ background: theme.gradient }}>
           <div className="relative z-10 flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-['Prompt'] leading-tight">{t.setupTitle}</h2>
              <p className="opacity-80 font-['Inter'] text-sm mt-1">{t.setupDesc}</p>
            </div>
          </div>
          {/* Abstract decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          {/* Interaction Mode Selection */}
          <div className="space-y-4">
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <span className="w-1 h-6 rounded-full" style={{ backgroundColor: theme.secondary }}></span>
               {t.modeTitle}
             </h3>
             <div className="grid grid-cols-2 gap-4">
               <button
                 type="button"
                 onClick={() => setInteractionType('TEXT')}
                 className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all group ${
                   interactionType === 'TEXT' ? 'bg-slate-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'
                 }`}
                 style={{ borderColor: interactionType === 'TEXT' ? theme.secondary : undefined }}
               >
                 <div className={`p-2 rounded-full transition-colors ${interactionType === 'TEXT' ? 'text-white' : 'bg-slate-100 text-slate-500'}`} style={{ backgroundColor: interactionType === 'TEXT' ? theme.secondary : undefined }}>
                   <MessageCircle size={20} />
                 </div>
                 <span className={`font-bold ${interactionType === 'TEXT' ? 'text-slate-900' : 'text-slate-500'}`}>{t.modeText}</span>
               </button>

               <button
                 type="button"
                 onClick={() => setInteractionType('VOICE')}
                 className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all group ${
                   interactionType === 'VOICE' ? 'bg-slate-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'
                 }`}
                 style={{ borderColor: interactionType === 'VOICE' ? theme.secondary : undefined }}
               >
                 <div className={`p-2 rounded-full transition-colors ${interactionType === 'VOICE' ? 'text-white' : 'bg-slate-100 text-slate-500'}`} style={{ backgroundColor: interactionType === 'VOICE' ? theme.secondary : undefined }}>
                   <Mic size={20} />
                 </div>
                 <span className={`font-bold ${interactionType === 'VOICE' ? 'text-slate-900' : 'text-slate-500'}`}>{t.modeVoice}</span>
               </button>
             </div>
          </div>

          <hr className="border-slate-100/80" />

          {/* Role Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <span className="w-1 h-6 rounded-full" style={{ backgroundColor: theme.secondary }}></span>
               {t.roleTitle}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setUserRole(Role.COACH)}
                className={`p-5 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                  userRole === Role.COACH
                    ? 'bg-slate-50'
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
                style={{ borderColor: userRole === Role.COACH ? theme.secondary : undefined }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <User className={`w-5 h-5 ${userRole === Role.COACH ? 'text-slate-900' : 'text-slate-400'}`} />
                  <div className="font-bold text-slate-900">{t.roleCoach}</div>
                </div>
                <div className="text-sm text-slate-500 pl-8">{t.roleCoachDesc}</div>
              </button>

              <button
                type="button"
                onClick={() => setUserRole(Role.COACHEE)}
                className={`p-5 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                  userRole === Role.COACHEE
                    ? 'bg-slate-50'
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
                style={{ borderColor: userRole === Role.COACHEE ? theme.secondary : undefined }}
              >
                 <div className="flex items-center gap-3 mb-2">
                  <User className={`w-5 h-5 ${userRole === Role.COACHEE ? 'text-slate-900' : 'text-slate-400'}`} />
                  <div className="font-bold text-slate-900">{t.roleCoachee}</div>
                </div>
                <div className="text-sm text-slate-500 pl-8">{t.roleCoacheeDesc}</div>
              </button>
            </div>
          </div>

          <hr className="border-slate-100/80" />

          {/* Persona Context */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <span className="w-1 h-6 rounded-full" style={{ backgroundColor: theme.secondary }}></span>
               {t.profileTitle}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <label className={labelClass}>{t.gender}</label>
                <select
                  className={inputClass}
                  style={{ '--tw-ring-color': theme.secondary } as React.CSSProperties}
                  value={persona.gender}
                  onChange={(e) => setPersona({ ...persona, gender: e.target.value })}
                >
                  <option value="Male">ชาย (Male)</option>
                  <option value="Female">หญิง (Female)</option>
                  <option value="LGBTQ+">LGBTQ+</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>{t.age}</label>
                <select
                  className={inputClass}
                  style={{ '--tw-ring-color': theme.secondary } as React.CSSProperties}
                  value={persona.age}
                  onChange={(e) => setPersona({ ...persona, age: e.target.value })}
                >
                  <option>20-25</option>
                  <option>26-35</option>
                  <option>36-45</option>
                  <option>46+</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>{t.profession}</label>
                <input
                  type="text"
                  required
                  className={inputClass}
                  style={{ '--tw-ring-color': theme.secondary } as React.CSSProperties}
                  placeholder="e.g. ครู, Engineer, HR"
                  value={persona.profession}
                  onChange={(e) => setPersona({ ...persona, profession: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>{t.position}</label>
                <input
                  type="text"
                  required
                  className={inputClass}
                  style={{ '--tw-ring-color': theme.secondary } as React.CSSProperties}
                  placeholder="e.g. หัวหน้ากลุ่มสาระ, Manager"
                  value={persona.position}
                  onChange={(e) => setPersona({ ...persona, position: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                {t.topic}
              </label>
              <textarea
                required
                rows={3}
                className={inputClass}
                style={{ '--tw-ring-color': theme.secondary } as React.CSSProperties}
                placeholder={t.topicPlaceholder}
                value={persona.topic}
                onChange={(e) => setPersona({ ...persona, topic: e.target.value })}
              />
            </div>
          </div>

          <hr className="border-slate-100/80" />

          {/* Framework */}
          <div className="space-y-4">
             <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <span className="w-1 h-6 rounded-full" style={{ backgroundColor: theme.secondary }}></span>
               {t.frameworkTitle}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.values(CoachingModel).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModel(m)}
                  className={`py-3 px-3 text-sm rounded-lg font-medium transition-all ${
                    model === m
                      ? 'text-white shadow-lg transform -translate-y-0.5'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  style={{ background: model === m ? theme.gradient : undefined }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-white font-bold text-lg shadow-xl shadow-slate-200 hover:brightness-110 hover:shadow-2xl transition-all active:scale-[0.99]"
              style={{ background: theme.gradient }}
            >
              <PlayCircle className="w-6 h-6" />
              {t.startBtn}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Configuration;
