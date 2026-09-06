import React, { useState } from 'react';
import { Sparkles, MessageSquare, Heart, Shield, Users, PlaySquare, TrendingUp, ExternalLink } from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const CommunitySection = () => {
  const [superchats] = useState([
    { id: 1, name: 'Vesper Name', msg: 'Best tournament setup and admin communication! Madan Anna Mass ❤️', amount: '+1,500 INR', isGold: true, time: '2m ago' },
    { id: 2, name: 'Barlondhaert', msg: 'AWM Pochinki squad wipe was legendary', amount: '220 INR', isGold: false, time: '10m ago' },
    { id: 3, name: 'Raptal Chapel', msg: 'Love from Chennai squad, waiting for midnight customs', amount: '110 INR', isGold: false, time: '24m ago' },
    { id: 4, name: 'ShadowFriend', msg: 'Ready with 4-finger gyro controls tonight!', amount: '410 INR', isGold: false, time: '45m ago' },
    { id: 5, name: 'Rajamdmona', msg: 'Tamil gaming king Mr. Conqueror', amount: '120 INR', isGold: false, time: '1h ago' },
    { id: 6, name: 'Karthik_Conqueror', msg: 'Tamil Nadu gaming scene rule pandra ore aal Mr. Conqueror Madan!', amount: '+2,000 INR', isGold: true, time: '2h ago' },
  ]);

  const youtubeStats = [
    {
      id: 'subs',
      label: 'subscribers',
      value: '513K',
      icon: Users,
      color: 'text-red-400',
    },
    {
      id: 'vids',
      label: 'videos',
      value: '1,091',
      icon: PlaySquare,
      color: 'text-[#E5C05B]',
    },
    {
      id: 'views',
      label: 'views',
      value: '93,275,031',
      icon: TrendingUp,
      color: 'text-emerald-400',
    }
  ];

  return (
    <section id="community" className="w-full mb-8">
      <div className="rounded-xl p-6 sm:p-7 bg-[#0C0F15] border border-[#1E2433]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-white uppercase tracking-wider">
              COMMUNITY ENGAGEMENT & STREAM HUB
            </h3>
            <p className="font-rajdhani text-xs text-[#788294] font-medium">
              Official YouTube Channel Analytics & Live Superchat Feed
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#131722] border border-[#E5C05B]/50 text-xs font-montserrat font-bold text-[#E5C05B] uppercase shadow-[0_0_10px_rgba(229,192,91,0.15)]">
            <span>Superchat Feed</span>
            <span>▾</span>
          </div>
        </div>

        {/* Official YouTube Channel Stats Showcase Strip */}
        <div className="mb-7 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#141012] via-[#11151E] to-[#141012] border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] shrink-0">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <span className="font-montserrat font-black text-sm text-white uppercase flex items-center gap-1.5">
                <span>M A D A N</span>
                <span className="text-[10px] text-red-400 font-normal px-2 py-0.5 rounded bg-red-950/60 border border-red-500/40">VERIFIED CREATOR</span>
              </span>
              <span className="text-xs font-rajdhani text-[#94A3B8]">
                Tamil Nadu’s #1 Battlegrounds Live Streamer
              </span>
            </div>
          </div>

          {/* 3 Real YouTube Metrics from Screenshot */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full md:w-auto">
            {youtubeStats.map((st) => {
              const Icon = st.icon;
              return (
                <div key={st.id} className="p-2.5 sm:px-4 sm:py-2.5 rounded-lg bg-[#0C0F15] border border-[#1E2536] text-center min-w-[100px] sm:min-w-[120px]">
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <Icon className={`w-3.5 h-3.5 ${st.color}`} />
                    <span className="font-montserrat font-black text-xs sm:text-sm text-white">
                      {st.value}
                    </span>
                  </div>
                  <span className="font-rajdhani text-[11px] text-[#788294] font-semibold lowercase block">
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Visit Channel Button */}
          <a
            href="https://www.youtube.com/@iammadan"
            target="_blank"
            rel="noreferrer"
            onClick={() => soundFx.playClick()}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-montserrat font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 shadow-[0_0_12px_rgba(220,38,38,0.4)]"
          >
            <span>Visit Channel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Full-width Superchat Feed List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {superchats.map((sc) => (
            <div
              key={sc.id}
              onMouseEnter={() => soundFx.playHover()}
              className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition-all ${
                sc.isGold
                  ? 'bg-[#262010] border-[#8E752D] text-[#E5C05B] shadow-[0_0_15px_rgba(229,192,91,0.15)]'
                  : 'bg-[#11151E] border-[#1E2536]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-[#1E2433] border border-[#2B3448] flex items-center justify-center text-xs font-bold text-[#E5C05B] shrink-0">
                    {sc.name[0]}
                  </div>
                  <div className="truncate">
                    <span className="font-montserrat font-bold text-xs sm:text-sm text-white truncate block">
                      {sc.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B] block">
                      {sc.time}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold text-[#E5C05B] shrink-0 px-2 py-0.5 rounded bg-black/40 border border-[#2B3448]">
                  {sc.amount}
                </span>
              </div>

              {sc.msg && (
                <p className="text-xs text-[#94A3B8] font-sans line-clamp-2 pl-9.5">
                  "{sc.msg}"
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};