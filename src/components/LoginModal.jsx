import React, { useState } from 'react';
import { X, Lock, Mail, Shield, CheckCircle2, AlertCircle, Eye, EyeOff, Key, Crown, Swords, Ticket } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { authenticateUser } from '../utils/auth';
import { authenticateTeam } from '../utils/portalData';
import confetti from 'canvas-confetti';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [loginType, setLoginType] = useState('admin'); // 'admin' | 'team'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [teamIdentifier, setTeamIdentifier] = useState('');
  const [teamPasscode, setTeamPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    soundFx.playClick();

    try {
      // Secure Cryptographic Hashing + JWT Token Authentication
      const result = await authenticateUser(email, password);

      setIsLoading(false);

      if (result.success && result.user) {
        soundFx.playVictory();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#2DD4BF', '#14B8A6', '#0D9488', '#0F172A']
        });

        onLoginSuccess(result.user, result.token, 'admin');
        onClose();
      } else {
        soundFx.playClick();
        setErrorMessage(result.message || 'Invalid username or password. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      soundFx.playClick();
      setErrorMessage('Authentication error. Please try again.');
    }
  };

  const handleTeamLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    soundFx.playClick();

    const result = authenticateTeam(teamIdentifier, teamPasscode);
    setIsLoading(false);

    if (result.success && result.team) {
      soundFx.playVictory();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E5C05B', '#2DD4BF', '#10B981']
      });

      onLoginSuccess(result.team, 'team-session-token', 'team');
      onClose();
    } else {
      soundFx.playClick();
      setErrorMessage(result.message || 'Invalid Ticket ID / Squad Name or Passcode.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-md bg-[#EEF2F6] border border-[#DCE2E9] rounded-[28px] p-6 sm:p-7 shadow-[0_25px_60px_rgba(15,23,42,0.2)] text-[#1E293B]">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            setErrorMessage('');
            onClose();
          }}
          className="absolute top-5 right-5 w-7 h-7 rounded-full bg-white hover:bg-slate-100 border border-[#CBD5E1] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-all cursor-pointer shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Crest */}
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-teal-500/40 p-0.5 bg-white mx-auto mb-2 shadow-[0_4px_16px_rgba(20,184,166,0.25)] flex items-center justify-center">
            <img
              src="/assets/conqueror_badge.jpg"
              alt="Crest"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <h3 className="font-extrabold text-base sm:text-lg text-[#0F172A] uppercase tracking-tight">
            AUTHENTICATED ACCESS
          </h3>
          <p className="text-[11px] text-[#64748B]">
            Match Ops Admin Console & Registered Team Portal
          </p>
        </div>

        {/* Tab Switcher: Admin Access vs Team Portal */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-white border border-[#CBD5E1] mb-4 shadow-inner">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setLoginType('admin');
              setErrorMessage('');
            }}
            className={`py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              loginType === 'admin'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Console</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setLoginType('team');
              setErrorMessage('');
            }}
            className={`py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              loginType === 'team'
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-[#E5C05B]" />
            <span>Team Portal</span>
          </button>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* FORM 1: ADMIN & SUPER ADMIN */}
        {loginType === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-[#0F172A] font-sans text-xs focus:outline-none transition-colors shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-[#0F172A] font-sans text-xs focus:outline-none transition-colors shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                {isLoading ? (
                  <span>AUTHENTICATING SHA-256...</span>
                ) : (
                  <>
                    <Key className="w-3.5 h-3.5 text-teal-400" />
                    <span>LOGIN TO ADMIN DESK</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* FORM 2: TEAM / CAPTAIN PORTAL */}
        {loginType === 'team' && (
          <form onSubmit={handleTeamLogin} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                Registration Ticket ID / Squad Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Ticket className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. MC-849201 or Team Soul"
                  value={teamIdentifier}
                  onChange={(e) => setTeamIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-[#0F172A] font-sans text-xs focus:outline-none transition-colors shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">
                Team Passcode (PIN)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="e.g. 778899"
                  value={teamPasscode}
                  onChange={(e) => setTeamPasscode(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 rounded-xl bg-white border border-[#CBD5E1] focus:border-teal-500 text-[#0F172A] font-sans text-xs focus:outline-none transition-colors shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
              >
                {isLoading ? (
                  <span>CONNECTING TO LOBBY...</span>
                ) : (
                  <>
                    <Swords className="w-3.5 h-3.5 text-white" />
                    <span>OPEN TEAM ROOM DISPATCHER</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-[#64748B] text-center font-mono pt-1">
              Need credentials? Register via <strong>JOIN NOW</strong> to get your instant Ticket ID & Passcode.
            </p>
          </form>
        )}

      </div>
    </div>
  );
};

export default LoginModal;

