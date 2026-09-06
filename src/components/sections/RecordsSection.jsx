import React from 'react';
import { Trophy, ChevronLeft, ChevronRight, Crown, Flame, ExternalLink, Play, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const RecordsSection = () => {
  const statCards = [
    { value: '236', label: 'Consecutive Wins (WR)', icon: Crown, highlight: true },
    { value: '397', label: 'Total Dominations', icon: Trophy, highlight: false },
    { value: '178', label: 'Trophies Won', icon: Trophy, highlight: false },
  ];

  const timelineNodes = [
    { value: '0', date: 'Start', hasTrophy: false },
    { value: '25', date: '25 Wins', hasTrophy: false },
    { value: '50', date: '50 Wins', hasTrophy: false },
    { value: '75', date: '75 Wins', hasTrophy: false },
    { value: '100', date: '100 Wins', hasTrophy: true },
    { value: '125', date: '125 Wins', hasTrophy: false },
    { value: '150', date: '150 Wins', hasTrophy: true },
    { value: '175', date: '175 Wins', hasTrophy: false },
    { value: '200', date: '200 Wins', hasTrophy: true },
    { value: '225', date: '225 Wins', hasTrophy: true },
    { value: '236 WR', date: 'Historic', hasTrophy: true, isRecord: true },
  ];

  return (
    <section id="records" className="w-full mb-8">
      <div className="rounded-xl p-6 sm:p-7 bg-[#0C0F15] border border-[#1E2433] space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-white uppercase tracking-wider">
              RECORDS & ACHIEVEMENTS
            </h3>
            <p className="font-rajdhani text-xs text-[#788294] font-medium">
              Dynamic Stats and Historic Milestones
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => soundFx.playClick()}
              className="w-7 h-7 rounded bg-[#131722] border border-[#222A3A] flex items-center justify-center text-[#788294] hover:text-[#E5C05B] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => soundFx.playClick()}
              className="w-7 h-7 rounded bg-[#131722] border border-[#222A3A] flex items-center justify-center text-[#788294] hover:text-[#E5C05B] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 🌟 MAJOR WORLD RECORD SPOTLIGHT BANNER: 236 WINS IN A ROW */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#2B2108] via-[#141005] to-[#2B2108] border-2 border-[#E5C05B] p-5 sm:p-6 shadow-[0_0_35px_rgba(229,192,91,0.35)]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Column: Thumbnail Showcase */}
            <div className="lg:col-span-5 rounded-xl overflow-hidden border border-[#E5C05B]/60 shadow-2xl relative group">
              <img
                src="/assets/world_record_236.png"
                alt="World Record 236 Wins in a Row - Madan"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-[#E5C05B] text-[10px] font-montserrat font-black text-[#E5C05B] flex items-center gap-1">
                <Crown className="w-3 h-3 text-[#E5C05B] fill-[#E5C05B]" />
                <span>OFFICIAL WORLD RECORD</span>
              </div>
            </div>

            {/* Right Column: World Record Details */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5C05B]/15 border border-[#E5C05B]/50 text-[#E5C05B] text-xs font-montserrat font-black uppercase tracking-widest mb-2.5 self-start">
                <Flame className="w-3.5 h-3.5 fill-[#E5C05B]" />
                <span>UNBROKEN GLOBAL FEAT</span>
              </div>

              <h4 className="font-montserrat font-black text-2xl sm:text-3xl text-gold-bright uppercase tracking-wide leading-tight">
                236 WINS IN A ROW
              </h4>
              <p className="font-montserrat font-extrabold text-xs sm:text-sm text-[#F1F5F9] uppercase tracking-wider mt-0.5 mb-3">
                236 CONSECUTIVE CHICKEN DINNERS IN BGMI
              </p>

              <p className="font-sans text-xs sm:text-sm text-[#CBD5E1] leading-relaxed mb-4">
                The most historic winning streak in Indian gaming history. Madan achieved <strong className="text-[#E5C05B]">236 consecutive victories without a single defeat</strong> live on stream, setting the official world benchmark in competitive Battlegrounds lobbies.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://www.youtube.com/@iammadan"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundFx.playClick()}
                  className="px-5 py-2.5 rounded-lg bg-[#E5C05B] hover:bg-[#F3CF7A] text-[#0A0D12] font-montserrat font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(229,192,91,0.4)]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Record Stream</span>
                </a>

                <div className="flex items-center gap-2 text-[11px] font-mono text-[#94A3B8] font-bold">
                  <span className="text-[#E5C05B]">#madanop</span>
                  <span>•</span>
                  <span>#bgmilive</span>
                  <span>•</span>
                  <span className="text-red-400">#worldrecord</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* 3 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onMouseEnter={() => soundFx.playHover()}
                className={`p-4 sm:p-5 rounded-lg border flex items-center gap-4 transition-all ${
                  item.highlight
                    ? 'bg-gradient-to-r from-[#241D09] to-[#12151E] border-[#E5C05B] shadow-[0_0_15px_rgba(229,192,91,0.2)]'
                    : 'bg-[#11151E] border-[#1E2536]'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-[#E5C05B]/15 border border-[#E5C05B]/40 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#E5C05B]" />
                </div>
                <div>
                  <div className="font-montserrat font-black text-xl sm:text-2xl text-white">
                    {item.value}
                  </div>
                  <div className="font-rajdhani text-xs text-[#788294] font-semibold uppercase tracking-wider">
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Conqueror's Timeline */}
        <div className="pt-2 border-t border-[#181D2A]">
          <h4 className="font-montserrat font-bold text-xs sm:text-sm text-[#EAECEF] uppercase mb-0.5">
            Conqueror's Timeline
          </h4>
          <p className="font-rajdhani text-xs text-[#788294] mb-6">
            Official 236 Consecutive Wins Streak Progression (0 to 236)
          </p>

          {/* Timeline Track & Nodes */}
          <div className="relative pt-6 pb-2 px-2 overflow-x-auto no-scrollbar">
            <div className="min-w-[650px] relative">
              {/* Gold Horizontal Track Line */}
              <div className="absolute top-[38px] left-4 right-4 h-[2px] bg-gradient-to-r from-[#B8860B] via-[#E5C05B] to-[#FFD700] z-0" />

              {/* 11 Milestone Nodes */}
              <div className="grid grid-cols-11 gap-1 text-center relative z-10">
                {timelineNodes.map((node, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    {/* Gold Trophy above node if applicable */}
                    <div className="h-5 flex items-center justify-center mb-1">
                      {node.hasTrophy && (
                        <Trophy className="w-3.5 h-3.5 text-[#E5C05B] fill-[#E5C05B]" />
                      )}
                    </div>

                    {/* Node Point dot */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 border-[#0C0F15] transition-transform ${
                        node.isRecord
                          ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse scale-125'
                          : node.hasTrophy
                          ? 'bg-[#FFD700] shadow-[0_0_8px_rgba(255,215,0,0.8)]'
                          : 'bg-[#E5C05B] shadow-[0_0_6px_rgba(229,192,91,0.6)]'
                      }`}
                    />

                    {/* Node Value */}
                    <span
                      className={`font-mono text-[11px] sm:text-xs font-bold mt-2 ${
                        node.isRecord ? 'text-[#FFD700] font-black' : 'text-[#EAECEF]'
                      }`}
                    >
                      {node.value}
                    </span>

                    {/* Node Label */}
                    <span className={`font-rajdhani text-[10px] sm:text-[11px] font-semibold truncate ${
                      node.isRecord ? 'text-amber-400 font-bold' : 'text-[#788294]'
                    }`}>
                      {node.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};