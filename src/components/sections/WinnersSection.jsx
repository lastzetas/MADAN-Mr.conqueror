import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Award, Flame, Zap, Shield, Crown, Swords, Users, User, Radio, Sparkles, Star, Medal } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { getStoredHallOfFame } from '../../utils/portalData';

export const WinnersSection = ({ onOpenTournamentModal }) => {
  const [activeCategory, setActiveCategory] = useState('SQUAD');
  const [hofData, setHofData] = useState(() => getStoredHallOfFame());

  // Listen for real-time Hall of Fame updates from Admin / SuperAdmin
  useEffect(() => {
    const handleHofUpdate = (e) => {
      if (e.detail?.all) {
        setHofData(e.detail.all);
      } else if (e.detail?.format && e.detail?.teams) {
        setHofData(prev => ({ ...prev, [e.detail.format]: e.detail.teams }));
      } else {
        setHofData(getStoredHallOfFame());
      }
    };

    window.addEventListener('portal_hof_updated', handleHofUpdate);
    return () => window.removeEventListener('portal_hof_updated', handleHofUpdate);
  }, []);

  const categories = [
    { id: 'SQUAD', label: 'Squad Top 10', subtitle: 'BOTSQUADWAR', icon: Shield },
    { id: 'DUO', label: 'Duo Top 10', subtitle: 'Dynamic Duo Clash', icon: Users },
    { id: 'SOLO', label: 'Solo Top 10', subtitle: 'Bootcamp Deathmatch', icon: User },
    { id: 'SEASONAL', label: 'Seasonal 6x Legends', subtitle: 'OG-BTS Era', icon: Trophy },
  ];

  const currentTeams = hofData[activeCategory] || getStoredHallOfFame(activeCategory) || [];
  const top1 = currentTeams[0] || {};
  const top2 = currentTeams[1] || {};
  const top3 = currentTeams[2] || {};

  // Seasonal hardcoded legacy data
  const seasonalLegends = [
    { season: 'Season 6 Grand Arena', prize: '₹1,50,000 INR', kills: '64 Kills (Record)', edition: 'S6 Champion' },
    { season: 'Season 5 Grand Arena', prize: '₹1,20,000 INR', kills: '59 Kills', edition: 'S5 Champion' },
    { season: 'Season 4 Grand Arena', prize: '₹1,00,000 INR', kills: '55 Kills', edition: 'S4 Champion' },
    { season: 'Season 3 Grand Arena', prize: '₹80,000 INR', kills: '51 Kills', edition: 'S3 Champion' },
    { season: 'Season 2 Grand Arena', prize: '₹60,000 INR', kills: '48 Kills', edition: 'S2 Champion' },
    { season: 'Season 1 Grand Arena', prize: '₹50,000 INR', kills: '44 Kills', edition: 'Inaugural S1' },
  ];

  return (
    <section id="winners" className="space-y-6 pt-4">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2536] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-[#E5C05B]" />
            <h2 className="font-montserrat font-black text-xl sm:text-2xl text-white tracking-wider uppercase">
              HALL OF FAME & OFFICIAL TOP 10 STANDINGS
            </h2>
          </div>
          <p className="font-rajdhani text-xs sm:text-sm text-[#94A3B8]">
            Verified official points tables, kill records, and championship standings managed by Match Ops.
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141822] border border-[#E5C05B]/30 text-[#E5C05B] text-xs font-mono font-bold shadow-[0_0_15px_rgba(229,192,91,0.15)] self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-[#E5C05B] animate-pulse" />
          <span>OFFICIAL STANDINGS: SYNCED LIVE</span>
        </div>
      </div>

      {/* Category Tabs: SQUAD TOP 10 | DUO TOP 10 | SOLO TOP 10 | SEASONAL */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                soundFx.playClick();
                setActiveCategory(cat.id);
              }}
              onMouseEnter={() => soundFx.playHover()}
              className={`p-3 sm:p-4 rounded-2xl border transition-all text-left cursor-pointer flex flex-col justify-between group ${
                active
                  ? 'bg-gradient-to-br from-[#262010] to-[#121620] border-[#E5C05B] shadow-[0_0_20px_rgba(229,192,91,0.25)]'
                  : 'bg-[#0B0E14] border-[#1E2536] hover:border-[#334155] hover:bg-[#10141D]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Icon className={`w-4 h-4 ${active ? 'text-[#E5C05B]' : 'text-[#64748B] group-hover:text-[#94A3B8]'}`} />
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                  active ? 'bg-[#E5C05B] text-black' : 'bg-[#1E2536] text-[#94A3B8]'
                }`}>
                  {cat.id === 'SEASONAL' ? '6X UNDISPUTED' : 'TOP 10 TABLE'}
                </span>
              </div>
              <div>
                <span className={`font-montserrat font-extrabold text-xs sm:text-sm block tracking-wide uppercase ${
                  active ? 'text-white' : 'text-[#CBD5E1]'
                }`}>
                  {cat.label}
                </span>
                <span className="font-rajdhani text-[11px] text-[#788294] font-medium block truncate">
                  {cat.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* TOP 10 LEADERBOARD VIEW (SQUAD, DUO, SOLO) */}
      {activeCategory !== 'SEASONAL' ? (
        <div className="space-y-6">
          
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 🥈 Rank 2 - Silver Podium */}
            <div className="order-2 md:order-1 rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#1E293B]/40 via-[#0E131C] to-[#090C12] border border-[#94A3B8]/40 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[#CBD5E1] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-slate-700/60 border border-slate-500/40 text-slate-200 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                  <Medal className="w-3.5 h-3.5 text-slate-300" />
                  <span>2ND RUNNER UP</span>
                </span>
                <span className="font-mono text-xs font-bold text-slate-300">#2 RANK</span>
              </div>

              <div className="text-center py-2 space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-600 to-slate-400 mx-auto flex items-center justify-center text-white font-black text-lg border border-slate-300 shadow-md">
                  {top2.clanTag || (top2.name ? top2.name.slice(0, 2).toUpperCase() : '2')}
                </div>
                <h4 className="font-montserrat font-black text-sm sm:text-base text-white truncate pt-1">
                  {top2.teamName || top2.name || 'Runner Up'}
                </h4>
                <span className="text-[11px] font-mono text-slate-400 block font-bold">
                  TAG: {top2.clanTag || 'OFFICIAL'}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-3 gap-1 text-center font-mono">
                <div className="p-1.5 rounded-lg bg-black/40">
                  <span className="text-[9px] text-[#64748B] block">WWCD</span>
                  <span className="text-xs font-bold text-white">{top2.wwcd || 0} 👑</span>
                </div>
                <div className="p-1.5 rounded-lg bg-black/40">
                  <span className="text-[9px] text-[#64748B] block">KILLS</span>
                  <span className="text-xs font-bold text-white">{top2.kills || 0} 🎯</span>
                </div>
                <div className="p-1.5 rounded-lg bg-black/40">
                  <span className="text-[9px] text-[#64748B] block">TOTAL</span>
                  <span className="text-xs font-black text-slate-300">{top2.totalPts || top2.total || 0} PTS</span>
                </div>
              </div>
            </div>

            {/* 👑 Rank 1 - Gold Champion Podium */}
            <div className="order-1 md:order-2 rounded-2xl p-5 sm:p-6 bg-gradient-to-b from-[#3D2C0C]/80 via-[#1F1706] to-[#0A0D13] border-2 border-[#E5C05B] flex flex-col justify-between shadow-[0_0_30px_rgba(229,192,91,0.3)] relative overflow-hidden transform md:-translate-y-2 group hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5C05B]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-3 z-10">
                <span className="px-3 py-1 rounded-lg bg-[#E5C05B] text-black text-[10px] font-montserrat font-black uppercase flex items-center gap-1 shadow-[0_0_10px_rgba(229,192,91,0.5)]">
                  <Crown className="w-3.5 h-3.5 fill-black" />
                  <span>UNDISPUTED CHAMPION</span>
                </span>
                <span className="font-mono text-xs font-black text-[#E5C05B]">#1 RANK</span>
              </div>

              <div className="text-center py-2 space-y-1 z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FFD700] via-[#E5C05B] to-[#8E752D] mx-auto flex items-center justify-center text-black font-black text-2xl border-2 border-[#FFF0A0] shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                  {top1.clanTag || (top1.name ? top1.name.slice(0, 2).toUpperCase() : '1')}
                </div>
                <h4 className="font-montserrat font-black text-base sm:text-lg text-white truncate pt-1">
                  {top1.teamName || top1.name || 'Champion Team'}
                </h4>
                <span className="text-xs font-mono text-[#E5C05B] block font-bold">
                  TAG: {top1.clanTag || 'CHAMPION'}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-[#E5C05B]/20 grid grid-cols-3 gap-1.5 text-center font-mono z-10">
                <div className="p-2 rounded-lg bg-black/50 border border-[#E5C05B]/20">
                  <span className="text-[9px] text-[#E5C05B] block font-bold">WWCD</span>
                  <span className="text-sm font-black text-white">{top1.wwcd || 0} 👑</span>
                </div>
                <div className="p-2 rounded-lg bg-black/50 border border-[#E5C05B]/20">
                  <span className="text-[9px] text-[#E5C05B] block font-bold">KILLS</span>
                  <span className="text-sm font-black text-white">{top1.kills || 0} 🎯</span>
                </div>
                <div className="p-2 rounded-lg bg-black/50 border border-[#E5C05B]/20">
                  <span className="text-[9px] text-[#E5C05B] block font-bold">TOTAL</span>
                  <span className="text-sm font-black text-[#FFD700]">{top1.totalPts || top1.total || 0} PTS</span>
                </div>
              </div>
            </div>

            {/* 🥉 Rank 3 - Bronze Podium */}
            <div className="order-3 md:order-3 rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-[#2E1D13]/40 via-[#140F0D] to-[#090C12] border border-[#CD7F32]/40 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:border-[#CD7F32] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-[#CD7F32]/40 text-amber-300 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                  <Medal className="w-3.5 h-3.5 text-amber-400" />
                  <span>3RD PLACE</span>
                </span>
                <span className="font-mono text-xs font-bold text-amber-400">#3 RANK</span>
              </div>

              <div className="text-center py-2 space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 mx-auto flex items-center justify-center text-white font-black text-lg border border-amber-400 shadow-md">
                  {top3.clanTag || (top3.name ? top3.name.slice(0, 2).toUpperCase() : '3')}
                </div>
                <h4 className="font-montserrat font-black text-sm sm:text-base text-white truncate pt-1">
                  {top3.teamName || top3.name || '3rd Place Team'}
                </h4>
                <span className="text-[11px] font-mono text-amber-400/80 block font-bold">
                  TAG: {top3.clanTag || 'OFFICIAL'}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-amber-950/80 grid grid-cols-3 gap-1 text-center font-mono">
                <div className="p-1.5 rounded-lg bg-black/40">
                  <span className="text-[9px] text-[#64748B] block">WWCD</span>
                  <span className="text-xs font-bold text-white">{top3.wwcd || 0} 👑</span>
                </div>
                <div className="p-1.5 rounded-lg bg-black/40">
                  <span className="text-[9px] text-[#64748B] block">KILLS</span>
                  <span className="text-xs font-bold text-white">{top3.kills || 0} 🎯</span>
                </div>
                <div className="p-1.5 rounded-lg bg-black/40">
                  <span className="text-[9px] text-[#64748B] block">TOTAL</span>
                  <span className="text-xs font-black text-amber-400">{top3.totalPts || top3.total || 0} PTS</span>
                </div>
              </div>
            </div>

          </div>

          {/* Full Top 10 Standings Table (#1 through #10) */}
          <div className="rounded-2xl bg-[#0B0E14] border border-[#1E2536] p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E2536] pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#E5C05B]" />
                <h3 className="font-montserrat font-extrabold text-sm sm:text-base text-white uppercase tracking-wider">
                  {activeCategory} COMPLETE TOP 10 LEADERBOARD
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#788294]">
                10 TEAMS OFFICIALLY RANKED
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-[#121722] border-y border-[#1E2536] text-[10px] font-mono text-[#94A3B8] uppercase">
                    <th className="py-2.5 px-3">Position</th>
                    <th className="py-2.5 px-3">Team / In-Game Player</th>
                    <th className="py-2.5 px-3">Clan Tag</th>
                    <th className="py-2.5 px-3 text-center">WWCD 👑</th>
                    <th className="py-2.5 px-3 text-center">Kills 🎯</th>
                    <th className="py-2.5 px-3 text-center">Placement Pts</th>
                    <th className="py-2.5 px-3 text-center font-bold text-[#E5C05B]">Total Points 🔥</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A202C] font-mono">
                  {currentTeams.map((team, idx) => {
                    const isTop1 = idx === 0;
                    const isTop2 = idx === 1;
                    const isTop3 = idx === 2;
                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          isTop1
                            ? 'bg-[#E5C05B]/10 hover:bg-[#E5C05B]/15 text-white font-bold'
                            : isTop2
                            ? 'bg-slate-800/30 hover:bg-slate-800/50 text-slate-200'
                            : isTop3
                            ? 'bg-amber-950/20 hover:bg-amber-950/30 text-amber-200'
                            : 'hover:bg-[#121620] text-[#CBD5E1]'
                        }`}
                      >
                        {/* Position Badge */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {isTop1 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#E5C05B] text-black font-black text-xs shadow-sm">
                              👑 #1
                            </span>
                          ) : isTop2 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-400 text-black font-black text-xs">
                              🥈 #2
                            </span>
                          ) : isTop3 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-600 text-white font-black text-xs">
                              🥉 #3
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded bg-[#161D2A] text-[#94A3B8] font-bold text-xs border border-[#232D40]">
                              #{team.rank || idx + 1}
                            </span>
                          )}
                        </td>

                        {/* Team Name */}
                        <td className="py-3 px-3 font-sans font-bold text-xs sm:text-sm text-white">
                          <div className="flex items-center gap-2">
                            <span>{team.teamName || team.name || `Team Position #${idx + 1}`}</span>
                            {team.badge && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-[#E5C05B] font-mono font-normal">
                                {team.badge}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Clan Tag */}
                        <td className="py-3 px-3 font-mono font-bold text-xs text-[#94A3B8] uppercase">
                          {team.clanTag || '—'}
                        </td>

                        {/* WWCD */}
                        <td className="py-3 px-3 text-center font-bold text-white">
                          {team.wwcd || 0}
                        </td>

                        {/* Kills */}
                        <td className="py-3 px-3 text-center font-bold text-white">
                          {team.kills || 0}
                        </td>

                        {/* Placement Pts */}
                        <td className="py-3 px-3 text-center text-[#94A3B8]">
                          {team.placementPts || 0}
                        </td>

                        {/* Total Points */}
                        <td className="py-3 px-3 text-center font-black text-sm text-[#FFD700]">
                          {team.totalPts !== undefined ? team.totalPts : (team.total !== undefined ? team.total : ((Number(team.kills) || 0) + (Number(team.placementPts) || 0)))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      ) : (
        /* SEASONAL LEGENDS VIEW (OG-BTS 6X CHAMPIONS & SEASON 7 WAR) */
        <div className="space-y-5">
          
          {/* 7th Seasonal War Live Registration Banner */}
          <div className="relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-[#2A1E08] via-[#1A1408] to-[#0D1017] border-2 border-[#E5C05B] shadow-[0_0_30px_rgba(229,192,91,0.3)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-red-600 text-white font-montserrat font-black text-[10px] uppercase flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" />
                  LIVE NOW
                </span>
                <span className="font-montserrat font-extrabold text-xs text-[#E5C05B] tracking-wider uppercase">
                  CONQUEROR ARENA SEASON 7
                </span>
              </div>
              <h3 className="font-montserrat font-black text-xl sm:text-2xl text-white uppercase">
                SEASON 7 GRAND WAR REGISTRATION IS LIVE
              </h3>
              <p className="font-rajdhani text-xs sm:text-sm text-[#CBD5E1] max-w-xl">
                OG-BTS conquered the last 6 Seasons undisputed! Register your squad now to battle for the ₹2,50,000 INR prize pool and 7th Seasonal Crown.
              </p>
            </div>

            <div className="z-10 shrink-0">
              <button
                onClick={() => {
                  soundFx.playModalOpen();
                  onOpenTournamentModal?.({
                    title: "SEASON 7 GRAND WAR: CONQUEROR ARENA",
                    prizePool: "₹2,50,000 INR",
                    format: "TPP Squads • Season 7 Official Championship"
                  });
                }}
                onMouseEnter={() => soundFx.playHover()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#E5C05B] to-[#D4AF37] hover:brightness-110 text-[#090B0E] font-montserrat font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.6)] cursor-pointer transition-all transform hover:scale-105 active:scale-95"
              >
                <Swords className="w-4 h-4 text-[#090B0E]" />
                <span>JOIN 7TH SEASONAL WAR</span>
              </button>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* OG-BTS 6X Legacy Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {seasonalLegends.map((item, idx) => (
              <div
                key={idx}
                onMouseEnter={() => soundFx.playHover()}
                className="rounded-2xl p-4 bg-gradient-to-b from-[#1C1708] to-[#0A0D13] border border-[#E5C05B]/40 hover:border-[#E5C05B] transition-all flex flex-col justify-between text-center group shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E5C05B]/10 border border-[#E5C05B]/40 mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Trophy className="w-5 h-5 text-[#E5C05B]" />
                </div>
                <div>
                  <span className="font-montserrat font-black text-xs text-white block">
                    OG-BTS
                  </span>
                  <span className="text-[10px] text-[#E5C05B] font-mono font-bold block">
                    {item.edition}
                  </span>
                  <p className="text-[10px] text-[#788294] font-rajdhani line-clamp-1 mt-1">
                    {item.season}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-white/5 text-[9px] font-mono">
                  <span className="text-white font-bold block">{item.prize}</span>
                  <span className="text-[#94A3B8] block">{item.kills}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </section>
  );
};

export default WinnersSection;
