
import React, { useState } from 'react';
import { Theme, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { authService } from '../services/authService';
import { User as UserIcon, Lock, ArrowRight, CheckCircle, BarChart2, Hash } from 'lucide-react';

interface Props {
  theme: Theme;
  language: Language;
  onLoginSuccess: (user: any) => void;
}

const AuthPage: React.FC<Props> = ({ theme, language, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const t = TRANSLATIONS[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login Logic
        if (!username || !password) throw new Error(t.fillAllFields);
        const user = await authService.login(username, password);
        onLoginSuccess(user);
      } else {
        // Signup Logic
        if (!username || !name || !password) throw new Error(t.fillAllFields);
        const user = await authService.signup(username, name, password);
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || t.authFailed);
      setIsLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all text-slate-800";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8" 
         style={{ background: theme.background }}>
      
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Branding / Info */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden"
             style={{ background: theme.gradient }}>
          
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white opacity-5"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-white opacity-5"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold font-['Prompt'] mb-2">{t.title}</h1>
            <p className="text-lg opacity-80 font-['Inter'] tracking-wide">{t.subtitle}</p>
          </div>

          <div className="relative z-10 space-y-6 my-8">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Real-time Simulation</h3>
                <p className="opacity-80 text-sm">Practice with AI that reacts to your tone and method.</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Deep Analytics</h3>
                <p className="opacity-80 text-sm">Get detailed scores on empathy, questioning, and more.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs opacity-60">
            {t.footerCopyright}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 font-['Prompt']">
              {isLogin ? t.loginTitle : t.signupTitle}
            </h2>
            <div className="w-16 h-1 rounded-full mx-auto" style={{ backgroundColor: theme.secondary }}></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto w-full">
            
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100 animate-fade-in">
                {error}
              </div>
            )}

            {/* Username Field */}
            <div className="relative">
              <UserIcon className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t.username}
                className={inputClass}
                style={{ '--tw-ring-color': theme.secondary } as React.CSSProperties}
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
              />
            </div>

            {/* Display Name Field (Signup Only) */}
            {!isLogin && (
              <div className="relative animate-fade-in-up">
                <Hash className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t.name}
                  className={inputClass}
                  style={{ '--tw-ring-color': theme.secondary } as React.CSSProperties}
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            )}

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
              <input
                type="password"
                placeholder={t.password}
                className={inputClass}
                style={{ '--tw-ring-color': theme.secondary } as React.CSSProperties}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-lg text-white font-bold text-lg shadow-lg hover:brightness-110 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ background: theme.gradient }}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? t.loginBtn : t.signupBtn}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setUsername('');
                setPassword('');
                setName('');
              }}
              className="text-sm font-medium hover:underline transition-colors"
              style={{ color: theme.primary }}
            >
              {isLogin ? t.switchSignup : t.switchLogin}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AuthPage;
