import React, { useState } from 'react';
import { Crown, Heart, Sparkles, Flame, Shield, Award, Send, Volume2, CheckCircle2, MessageSquare } from 'lucide-react';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

export const WallOfLegends = () => {
  const [supporters, setSupporters] = useState([
    { id: 1, name: 'Karthik_Conqueror', amount: '₹10,000', tier: 'Mythic Conqueror', badge: '👑', message: 'Madan Anna that AWM no-scope headshot in Bootcamp was absolute god-level! Love from Madurai ❤️', time: '5m ago' },
    { id: 2, name: 'Vignesh_TamilGamer', amount: '₹5,000', tier: 'Elite Diamond', badge: '💎', message: 'Waiting for the 40-kill lobby stream tonight! Pure Tamil pride.', time: '18m ago' },
    { id: 3, name: 'Selva_Esports', amount: '₹3,500', tier: 'Elite Diamond', badge: '💎', message: 'Best tournament organizer in South India. Keep inspiring grassroots teams.', time: '34m ago' },
    { id: 4, name: 'Dinesh_KGF', amount: '₹2,000', tier: 'Gold Squad', badge: '🥇', message: 'Tamil Nadu gaming scene rule pandra ore aal Mr. Conqueror Madan!', time: '1h ago' },
    { id: 5, name: 'Aravind_Sniper', amount: '₹1,500', tier: 'Gold Squad', badge: '🥇', message: 'Copied your 4-finger gyro settings, gained 2.5 K/D in two days!', time: '2h ago' },
  ]);

  const [donorName, setDonorName] = useState('');
  const [donorAmount, setDonorAmount] = useState('1000');
  const [donorMessage, setDonorMessage] = useState('');
  const [alertShowing, setAlertShowing] = useState(false);
  const [recentSuperchat, setRecentSuperchat] = useState(null);

  const presetAmounts = ['100', '500', '1000', '2000', '5000', '10000'];

  const handleSendSuperchat = (e) => {
    e.preventDefault();
    if (!donorName.trim() || !donorMessage.trim()) return;

    soundFx.playSuperchat();

    const amtNum = parseInt(donorAmount, 10);
    let tierName = 'Gold Squad';
    let badgeIcon = '🥇';
    if (amtNum >= 5000) {
      tierName = 'Mythic Conqueror';
      badgeIcon = '👑';
    } else if (amtNum >= 2000) {
      tierName = 'Elite Diamond';
      badgeIcon = '💎';
    }

    const newSuperchat = {
      id: Date.now(),
      name: donorName.trim(),
      amount: `₹${amtNum.toLocaleString('en-IN')}`,
      tier: tierName,
      badge: badgeIcon,
      message: donorMessage.trim(),
      time: 'Just now'
    };

    setSupporters([newSuperchat, ...supporters]);
    setRecentSuperchat(newSuperchat);
    setAlertShowing(true);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FFA500', '#FF4500', '#00F0FF']
    });

    setDonorName('');
    setDonorMessage('');

    setTimeout(() => {
      setAlertShowing(false);
    }, 6000);
  };

  return (
    <section id="superchat" className="py-20 md:py-28 relative bg-[#07090D] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-amber-300 text-xs font-rajdhani font-bold uppercase tracking-widest mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Wall of Legends & Stream Patrons</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight">
            COMMUNITY <span className="text-gold-gradient">LEGENDS</span>
          </h2>
          <p className="font-sans text-gray-400 text-sm sm:text-base mt-3">
            Celebrating the top superchats and relentless community supporters who fuel our esports tournaments and daily live broadcasts.
          </p>
        </div>

        {/* Live Stream Superchat Alert Simulation Popup */}
        {alertShowing && recentSuperchat && (
          <div className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-amber-950/90 via-[#1A1405] to-amber-950/90 border-2 border-gold-400 shadow-[0_0_40px_rgba(255,215,0,0.5)] animate-bounce text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-xs font-orbitron font-bold text-amber-300 uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>NEW LIVE STREAM SUPERCHAT ALERT</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-orbitron font-black text-2xl text-gold-bright">
              {recentSuperchat.name} sent {recentSuperchat.amount}!
            </div>
            <p className="font-sans text-sm text-gray-100 italic mt-2">
              "{recentSuperchat.message}"
            </p>
          </div>
        )}

        {/* Live Marquee Ticker */}
        <div className="mb-12 overflow-hidden rounded-2xl bg-[#0B0E15] border border-gold-500/30 p-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded bg-amber-500/20 text-amber-300 font-orbitron font-bold text-xs uppercase flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              LIVE TICKER
            </div>
            <div className="overflow-x-auto whitespace-nowrap flex gap-6 text-xs font-rajdhani text-gray-300 py-1 scrollbar-none">
              {supporters.map((item) => (
                <div key={item.id} className="flex items-center gap-2 shrink-0">
                  <span className="text-amber-400 font-bold">{item.badge} {item.name}:</span>
                  <span className="text-gold-bright font-mono font-bold">{item.amount}</span>
                  <span className="text-gray-400">"{item.message.slice(0, 35)}..."</span>
                  <span className="text-gray-600">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Top Tier Supporters Grid */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-orbitron font-bold text-xl text-white uppercase mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>Top Patron Hall of Fame</span>
            </h3>

            {supporters.map((sup, idx) => (
              <div
                key={sup.id}
                onMouseEnter={() => soundFx.playHover()}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  idx === 0
                    ? 'bg-gradient-to-r from-[#1C1605] via-[#100D04] to-[#1C1605] border-gold-400 shadow-[0_0_25px_rgba(212,175,55,0.25)]'
                    : 'bg-[#0B0E16]/80 border-gray-800/80 hover:border-gold-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-black/60 border border-gold-500/30 flex items-center justify-center font-orbitron font-black text-base text-amber-400">
                      {sup.badge}
                    </div>
                    <div>
                      <h4 className="font-orbitron font-bold text-sm text-white flex items-center gap-2">
                        <span>{sup.name}</span>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-gold-gradient text-black">
                            #1 SUPPORTER
                          </span>
                        )}
                      </h4>
                      <span className="text-xs font-rajdhani text-gray-400 font-semibold">{sup.tier}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-orbitron font-black text-base sm:text-lg text-gold-bright block">
                      {sup.amount}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">{sup.time}</span>
                  </div>
                </div>

                <p className="font-sans text-xs sm:text-sm text-gray-300 italic pl-12 border-l-2 border-amber-500/30 mt-2">
                  "{sup.message}"
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Send Superchat Simulator Form */}
          <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#111724] via-[#0D111A] to-[#07090E] border-2 border-gold-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2.5 mb-2">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h3 className="font-orbitron font-extrabold text-xl text-white uppercase">
                Support Stream & Cups
              </h3>
            </div>
            <p className="font-sans text-xs text-gray-400 leading-relaxed mb-6">
              Send a real-time stream cheer to Madan Anna. Your message will trigger an interactive on-screen alert and be highlighted in the Wall of Legends.
            </p>

            <form onSubmit={handleSendSuperchat} className="space-y-4">
              <div>
                <label className="block font-rajdhani text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Your Fan / Gamer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MadanArmy_Chennai"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-800 focus:border-gold-400 text-white font-sans text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-rajdhani text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Select Superchat Amount (₹ INR)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setDonorAmount(amt);
                      }}
                      className={`py-2 rounded-lg font-orbitron font-bold text-xs transition-all cursor-pointer ${
                        donorAmount === amt
                          ? 'bg-gold-gradient text-black shadow-[0_0_10px_rgba(255,215,0,0.4)]'
                          : 'bg-black/50 text-gray-400 border border-gray-800 hover:text-white'
                      }`}
                    >
                      ₹{parseInt(amt, 10).toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-rajdhani text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Stream Cheer Message *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Write your message to Madan Anna (e.g. Conqueror lobby mass! Next customs cup eppo?)"
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-800 focus:border-gold-400 text-white font-sans text-sm focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-black font-orbitron font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 group"
              >
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <span>Trigger Live Superchat Alert</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};