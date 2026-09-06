import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Radio, Users, MessageSquare, ThumbsUp, Heart, Flame, Sparkles, Send, ShieldCheck } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const LiveStreamModal = ({ isOpen, onClose }) => {
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Sanjay_Gamer', role: 'VIP', text: 'Anna live lobby mass!! 🔥', time: '12:45' },
    { id: 2, user: 'Praveen_YT', role: 'Member', text: 'That 6x M4 spray on moving vehicle was illegal 🤯', time: '12:45' },
    { id: 3, user: 'ConquerorFan99', role: 'Fan', text: 'Slot 84 registered for tonight cup!!', time: '12:46' },
    { id: 4, user: 'Karthik_R', role: 'MOD', text: 'Keep chat clean and respectful everyone! 🛡️', time: '12:46' },
  ]);

  const [inputChat, setInputChat] = useState('');
  const [reactions, setReactions] = useState([]);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollTop = chatBottomRef.current.scrollHeight;
    }
  }, [chatMessages]);

  if (!isOpen) return null;

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    soundFx.playClick();
    const newMsg = {
      id: Date.now(),
      user: 'You (Fan)',
      role: 'Fan',
      text: inputChat.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputChat('');
  };

  const handleTriggerReaction = (emoji) => {
    soundFx.playClick();
    const id = Date.now();
    setReactions((prev) => [...prev, { id, emoji, left: Math.random() * 80 + 10 }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#090C12] border-2 border-gold-500/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(212,175,55,0.3)] my-auto flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 bg-[#06080D] border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/50 text-red-400 text-xs font-rajdhani font-bold uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>LIVE BROADCAST</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-rajdhani text-gray-400">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-white font-mono font-bold">124,892</span>
              <span>Concurrent Viewers</span>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-black/60 border border-gray-800 text-gray-400 hover:text-white hover:border-gold-500 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body (Stream Player + Live Chat) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Stream Player Left Column */}
          <div className="lg:col-span-8 bg-black flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
            
            {/* Simulated Live Stream Video Box */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-gradient-to-br from-[#121824] via-[#080B10] to-black border border-gold-500/30 flex items-center justify-center group shadow-2xl">
              <img
                src="/assets/conqueror_badge.jpg"
                alt="Conqueror stream"
                className="absolute inset-0 w-full h-full object-cover opacity-35 filter blur-[2px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Floating Reaction Emojis */}
              {reactions.map((r) => (
                <div
                  key={r.id}
                  style={{ left: `${r.left}%` }}
                  className="absolute bottom-6 text-3xl animate-floatEmbers pointer-events-none z-20"
                >
                  {r.emoji}
                </div>
              ))}

              {/* Center Stream Overlay */}
              <div className="relative z-10 text-center p-4">
                <div className="w-16 h-16 rounded-full bg-gold-gradient text-black flex items-center justify-center mx-auto mb-3 shadow-[0_0_30px_rgba(255,215,0,0.6)] animate-pulse">
                  <Radio className="w-8 h-8" />
                </div>
                <h4 className="font-orbitron font-extrabold text-lg sm:text-xl text-white uppercase tracking-wider">
                  MADAN LIVE: CONQUEROR RANK PUSH
                </h4>
                <p className="font-rajdhani text-xs sm:text-sm text-amber-300 font-semibold mt-1">
                  Pochinki Squad Wipes & Custom Room Tournament Casting
                </p>
                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded bg-black/60 border border-gray-800 text-[11px] font-mono text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>1080p 60FPS • Ultra Low Latency</span>
                </div>
              </div>
            </div>

            {/* Reaction Bar */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-rajdhani font-bold text-gray-400">Cheer Anna:</span>
                {['🔥', '👑', '💥', '❤️', '🏆'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleTriggerReaction(emoji)}
                    className="p-2 rounded-lg bg-[#10141E] hover:bg-[#182030] border border-gray-800 text-lg transition-transform hover:scale-125 active:scale-95 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-rajdhani font-bold text-xs uppercase flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Watch on YouTube</span>
                </a>
              </div>
            </div>

          </div>

          {/* Live Chat Right Column */}
          <div className="lg:col-span-4 bg-[#080B10] border-t lg:border-t-0 lg:border-l border-gray-800 flex flex-col justify-between h-[360px] lg:h-auto">
            <div className="p-3.5 border-b border-gray-800 flex items-center justify-between text-xs font-rajdhani font-bold text-gray-300">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>LIVE STREAM CHAT</span>
              </div>
              <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" /> Auto-Mod Active
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div ref={chatBottomRef} className="p-3.5 space-y-3 overflow-y-auto flex-1 font-sans text-xs">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="p-2 rounded-lg bg-black/40 border border-gray-900">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-rajdhani font-bold text-amber-300 flex items-center gap-1">
                      {msg.role === 'VIP' && <span className="text-[10px] bg-amber-500/20 px-1 rounded text-amber-300">VIP</span>}
                      {msg.role === 'MOD' && <span className="text-[10px] bg-red-500/20 px-1 rounded text-red-300">MOD</span>}
                      {msg.user}
                    </span>
                    <span className="text-[10px] font-mono text-gray-600">{msg.time}</span>
                  </div>
                  <p className="text-gray-200 text-xs">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 border-t border-gray-800 bg-[#0A0D14] flex gap-2">
              <input
                type="text"
                placeholder="Say something to Madan Anna..."
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-black/60 border border-gray-800 focus:border-gold-400 text-white text-xs font-sans focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-gold-gradient text-black font-bold hover:bg-gold-gradient-hover cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};