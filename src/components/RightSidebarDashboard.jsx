import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Shield, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

export const RightSidebarDashboard = () => {
  const [achievementsTab, setAchievementsTab] = useState('ACTIVE');
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [submittedInquiry, setSubmittedInquiry] = useState(false);

  const [superchats, setSuperchats] = useState([
    { id: 1, name: 'Vesper Name', msg: 'Best tournament setup and admin communication!', amount: '+1,500 INR', isGold: true },
    { id: 2, name: 'Barlondhaert', msg: 'You', amount: '220 INR' },
    { id: 3, name: 'Raptal Chapel', msg: 'Mirror', amount: '110 INR' },
    { id: 4, name: 'ShadowFriend', msg: 'Seco', amount: '410 INR' },
    { id: 5, name: 'Rajamdmona', msg: '', amount: '120 INR' },
  ]);

  const achievementMetrics = [
    { label: 'Recorded Wins', value: '364 Championship' },
    { label: 'Latest Win', value: 'Action Events' },
    { label: 'Elite Players', value: 'Championship-1 Tier' },
    { label: 'Squads', value: "Championship's Teams" },
    { label: 'Championship Team', value: '23 Winners Teams' },
    { label: 'Championship Team', value: '355 KM Champions Teams' },
  ];

  const reviews = [
    {
      id: 1,
      rating: 5,
      text: 'True live esports free principle quality brand transparent!',
    },
    {
      id: 2,
      rating: 5,
      text: 'The best competitive organizer in South India, verified payout within 24h.',
    },
    {
      id: 3,
      rating: 5,
      text: 'Pro sensitivity and fair room anti-cheat makes this the #1 arena.',
    },
  ];

  const handleSendQuickSuperchat = () => {
    soundFx.playSuperchat();
    const newSC = {
      id: Date.now(),
      name: 'MadanArmy Fan',
      msg: 'Superchat cheer from dashboard!',
      amount: '+500 INR',
      isGold: true
    };
    setSuperchats([newSC, ...superchats]);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.4 },
      colors: ['#E5C05B', '#D4AF37', '#FFA500']
    });
  };

  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    soundFx.playVictory();
    setSubmittedInquiry(true);
    setTimeout(() => {
      setSubmittedInquiry(false);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMsg('');
    }, 4000);
  };

  return (
    <div className="space-y-5">
      
      {/* 1. TROPHIES & ACHIEVEMENTS Card */}
      <div className="rounded-xl p-5 bg-[#0C0F15] border border-[#1E2433]">
        
        {/* Header & Overview Button */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-montserrat font-extrabold text-xs sm:text-sm text-white uppercase tracking-wider">
            TROPHIES & ACHIEVEMENTS
          </h3>
          <button
            onClick={() => soundFx.playClick()}
            className="px-2 py-1 rounded bg-[#131722] border border-[#2B3448] text-[9px] font-montserrat font-bold text-[#E5C05B] uppercase hover:bg-[#E5C05B]/10 cursor-pointer"
          >
            DISCOVER TEAM
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-[#1A202C] mb-3">
          <button
            onClick={() => {
              soundFx.playClick();
              setAchievementsTab('ACTIVE');
            }}
            className={`pb-1.5 text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer ${
              achievementsTab === 'ACTIVE'
                ? 'text-[#E5C05B] border-b-2 border-[#E5C05B]'
                : 'text-[#64748B] hover:text-[#CBD5E1]'
            }`}
          >
            ACTIVE
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setAchievementsTab('HISTORIC');
            }}
            className={`pb-1.5 text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer ${
              achievementsTab === 'HISTORIC'
                ? 'text-[#E5C05B] border-b-2 border-[#E5C05B]'
                : 'text-[#64748B] hover:text-[#CBD5E1]'
            }`}
          >
            HISTORIC
          </button>
        </div>

        {/* 2x3 Metric Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-rajdhani">
          {achievementMetrics.map((m, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-[#11151E] border border-[#1E2536]">
              <span className="text-[10px] text-[#64748B] uppercase block font-semibold">
                {m.label}
              </span>
              <span className="font-montserrat font-bold text-xs text-[#E2E8F0] mt-0.5 block truncate">
                {m.value}
              </span>
            </div>
          ))}
        </div>

      </div>



      {/* 3. CURATED REVIEWS */}
      <div className="rounded-xl p-5 bg-[#0C0F15] border border-[#1E2433]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-montserrat font-extrabold text-xs sm:text-sm text-white uppercase tracking-wider">
            CURATED REVIEWS
          </h3>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveReviewIdx((idx) => (idx === 0 ? reviews.length - 1 : idx - 1));
              }}
              className="w-6 h-6 rounded bg-[#131722] border border-[#222A3A] flex items-center justify-center text-[#788294] hover:text-[#E5C05B] cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveReviewIdx((idx) => (idx === reviews.length - 1 ? 0 : idx + 1));
              }}
              className="w-6 h-6 rounded bg-[#131722] border border-[#222A3A] flex items-center justify-center text-[#788294] hover:text-[#E5C05B] cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3 Review Cards Grid (side by side as in screenshot) */}
        <div className="grid grid-cols-3 gap-2">
          {reviews.map((r, i) => (
            <div
              key={r.id}
              className={`p-2.5 rounded-lg bg-[#11151E] border ${
                activeReviewIdx === i ? 'border-[#E5C05B]/50' : 'border-[#1E2536]'
              } flex flex-col justify-between`}
            >
              <div className="flex items-center gap-0.5 mb-1.5 text-[#E5C05B]">
                {[...Array(5)].map((_, starI) => (
                  <Star key={starI} className="w-2.5 h-2.5 fill-[#E5C05B]" />
                ))}
              </div>
              <p className="font-sans text-[9px] text-[#94A3B8] leading-tight line-clamp-3">
                {r.text}
              </p>
            </div>
          ))}
        </div>

        {/* 4 Dots */}
        <div className="flex justify-center gap-1 mt-3">
          {[0, 1, 2, 3].map((dotI) => (
            <span
              key={dotI}
              className={`w-1 h-1 rounded-full ${
                activeReviewIdx === dotI ? 'bg-[#E5C05B]' : 'bg-[#334155]'
              }`}
            />
          ))}
        </div>

      </div>

      {/* 4. CONTACT US & ENQUIRIES */}
      <div id="enquiries" className="rounded-xl p-5 bg-[#0C0F15] border border-[#1E2433]">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          
          {/* Left Column: CONTACT US (Green & Gray Chat Bubbles) */}
          <div>
            <h4 className="font-montserrat font-bold text-xs text-white uppercase mb-2.5">
              CONTACT US
            </h4>
            
            {/* Bright Green Mint Chat Bubble Card */}
            <div className="p-2.5 rounded-lg bg-[#0E2E25] border border-[#1BE7A3]/50 text-xs font-rajdhani text-[#1BE7A3] mb-2">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-4 h-4 rounded-full bg-[#1BE7A3] text-black font-bold text-[8px] flex items-center justify-center">
                  🤝
                </div>
                <span className="text-[10px] font-bold">Encouragement & Business</span>
                <span className="text-[9px] opacity-80 ml-auto font-mono">ALL WELCOME</span>
              </div>
              <p className="text-[10px] leading-tight text-[#8EECCE]">
                Any kind of business enquiry, collaboration pitch, fan encouragement, or feedback is accepted!
              </p>
            </div>

            {/* Dark Gray Chat Bubble Card */}
            <div className="p-2.5 rounded-lg bg-[#11151E] border border-[#1E2536] text-[10px] font-rajdhani text-[#94A3B8]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#E5C05B] font-bold">⚖️ Objections & Obligations</span>
                <span className="text-[9px] text-emerald-400 font-mono">DIRECT REVIEW</span>
              </div>
              <p className="text-[10px] text-[#CBD5E1] mb-1">
                Have any objections, disputes, points clarification, or concerns? Send them for direct review.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-[#1E2536] text-[9px]">
                <span className="text-[#64748B]">Transparent Response SLA</span>
                <span className="text-[#E5C05B] font-bold">100% Addressed</span>
              </div>
            </div>
          </div>

          {/* Right Column: ENQUIRIES Form */}
          <div>
            <h4 className="font-montserrat font-bold text-xs text-white uppercase mb-2.5">
              ENQUIRIES
            </h4>

            {submittedInquiry ? (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-center text-xs font-rajdhani text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span>Enquiry Received!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-2">
                <input
                  type="text"
                  required
                  placeholder="Name"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md bg-[#11151E] border border-[#1E2536] focus:border-[#E5C05B] text-white font-sans text-xs focus:outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md bg-[#11151E] border border-[#1E2536] focus:border-[#E5C05B] text-white font-sans text-xs focus:outline-none"
                />
                <textarea
                  rows={2}
                  required
                  placeholder="Message / Enquiry"
                  value={inquiryMsg}
                  onChange={(e) => setInquiryMsg(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md bg-[#11151E] border border-[#1E2536] focus:border-[#E5C05B] text-white font-sans text-xs focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-md bg-[#E5C05B] hover:bg-[#F3CF7A] text-[#0A0D12] font-montserrat font-extrabold text-[10px] uppercase tracking-wider cursor-pointer shadow-[0_0_10px_rgba(229,192,91,0.25)]"
                >
                  SUBMIT ENQUIRY
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Partner Logos (OFFICIAL PUBG + PARTNER Conqueror) */}
        <div className="pt-3 border-t border-[#1E2536] flex items-center justify-between text-xs font-rajdhani text-[#64748B]">
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] uppercase font-bold text-[#64748B]">OFFICIAL</span>
            <span className="font-montserrat font-black text-xs text-white border border-[#2B3448] px-1.5 py-0.5 rounded">
              PUBG
            </span>
          </div>

          <div className="flex items-center gap-1 text-[9px] font-bold text-[#E5C05B] uppercase">
            <Shield className="w-3 h-3 text-[#E5C05B]" />
            <span>PARTNER Conqueror</span>
          </div>
        </div>

      </div>

    </div>
  );
};