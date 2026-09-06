import React, { useState } from 'react';
import { Trophy, Award, Shield, Users, Target, Zap, PlaySquare } from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const TrophiesSection = () => {
  const [achievementsTab, setAchievementsTab] = useState('ACTIVE');

  const activeMetrics = [
    { label: 'Recorded Wins', value: '364 Championship', desc: 'Official Scrim & Cup Victories', icon: Trophy },
    { label: 'YouTube Community', value: '513K Subscribers', desc: '93,275,031+ Lifetime Views', icon: Users },
    { label: 'Uploaded Battles', value: '1,091 Videos', desc: 'Customs, Scrims & Highlights', icon: PlaySquare },
    { label: 'Squads Registered', value: "Championship's Teams", desc: '400+ Verified Squad Rosters', icon: Shield },
    { label: 'Championship Team', value: '23 Winners Teams', desc: 'Trophy Holding Squads', icon: Award },
    { label: 'Elite Leaderboards', value: 'Championship-1 Tier', desc: 'Top 100 Asia Leaderboards', icon: Target },
  ];

  const historicMetrics = [
    { label: 'Career Tournaments', value: '45+ Major Cups', desc: 'Since Season 8 Inception', icon: Trophy },
    { label: 'All-Time Prizepool', value: '₹50,00,000+ INR', desc: 'Direct Community Payouts', icon: Award },
    { label: 'Conqueror Badges', value: '18x Top Rank', desc: 'Consecutive Asia Dominance', icon: Shield },
    { label: 'Lifetime Views', value: '93,275,031 Views', desc: 'Across 1,091 Uploaded Matches', icon: PlaySquare },
    { label: 'Total Frag Record', value: '15,240+ Kills', desc: 'Ranked & Scrim Average 9.84 K/D', icon: Target },
    { label: 'Mentored Teams', value: '60+ Semi-Pro Squads', desc: 'Grassroots Esports Pipeline', icon: Zap },
  ];

  const currentMetrics = achievementsTab === 'ACTIVE' ? activeMetrics : historicMetrics;

  return (
    <section id="trophies" className="w-full mb-8">
      <div className="rounded-xl p-6 sm:p-7 bg-[#0C0F15] border border-[#1E2433]">
        
        {/* Header & Overview Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-white uppercase tracking-wider">
              ACHIEVEMENTS
            </h3>
            <p className="font-rajdhani text-xs text-[#788294] font-medium">
              Championship Metrics & Competitive Milestones
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="flex items-center gap-4 border-b border-[#1A202C] pb-1">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setAchievementsTab('ACTIVE');
                }}
                className={`text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  achievementsTab === 'ACTIVE'
                    ? 'text-[#E5C05B] border-b-2 border-[#E5C05B] pb-1'
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
                className={`text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  achievementsTab === 'HISTORIC'
                    ? 'text-[#E5C05B] border-b-2 border-[#E5C05B] pb-1'
                    : 'text-[#64748B] hover:text-[#CBD5E1]'
                }`}
              >
                HISTORIC
              </button>
            </div>

            <button
              onClick={() => soundFx.playClick()}
              className="px-3 py-1.5 rounded-md bg-[#131722] border border-[#2B3448] text-[10px] font-montserrat font-bold text-[#E5C05B] uppercase hover:bg-[#E5C05B]/10 cursor-pointer transition-all"
            >
              DISCOVER TEAM
            </button>
          </div>
        </div>

        {/* 2x3 Metric Grid (3 cols on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-rajdhani">
          {currentMetrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                onMouseEnter={() => soundFx.playHover()}
                className="p-4 rounded-lg bg-[#11151E] border border-[#1E2536] hover:border-[#E5C05B]/40 transition-all flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-lg bg-[#E5C05B]/10 border border-[#E5C05B]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-[#E5C05B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] text-[#788294] uppercase block font-semibold">
                    {m.label}
                  </span>
                  <span className="font-montserrat font-bold text-sm sm:text-base text-[#E2E8F0] mt-0.5 block truncate">
                    {m.value}
                  </span>
                  <span className="text-[11px] text-[#64748B] font-sans block mt-1">
                    {m.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};