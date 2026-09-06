import React, { useState } from 'react';
import { Swords, Trophy, Calendar, Users, MapPin, Sparkles, ChevronRight, Shield, Award, Clock, ArrowRight } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const TournamentCenter = ({ onRegisterClick }) => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'hall-of-fame' | 'points-table'

  const tournaments = [
    {
      id: 'tourney-1',
      title: 'MADAN CONQUEROR CUP: S7 FINALE',
      category: 'BGMI SQUADS',
      prizePool: '₹2,50,000 INR',
      format: 'TPP Squads • 6 Matches (Erangel, Miramar, Sanhok)',
      date: 'Tonight • 7:00 PM IST',
      filledSlots: 88,
      totalSlots: 100,
      status: 'FILLING FAST',
      statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      prizes: { first: '₹1,25,000', second: '₹60,000', third: '₹35,000', mvp: '₹30,000' },
      badge: 'OFFICIAL TOURNAMENT'
    },
    {
      id: 'tourney-2',
      title: 'TAMIL CREATORS INVITATIONAL',
      category: 'INVITATIONAL',
      prizePool: '₹1,50,000 INR',
      format: 'TPP Squads • 4 Matches Special Showdown',
      date: 'Saturday • 8:00 PM IST',
      filledSlots: 64,
      totalSlots: 64,
      status: 'SLOTS FULL (WAITLIST)',
      statusColor: 'bg-red-500/20 text-red-400 border-red-500/40',
      prizes: { first: '₹80,000', second: '₹40,000', third: '₹20,000', mvp: '₹10,000' },
      badge: 'CREATOR SHOWDOWN'
    },
    {
      id: 'tourney-3',
      title: 'DAILY MIDNIGHT BOUNTY HUNT',
      category: 'CUSTOMS',
      prizePool: '₹50,000 INR',
      format: 'TPP Squads • Erangel High-Kill Scrim',
      date: 'Everyday • 10:30 PM IST',
      filledSlots: 74,
      totalSlots: 100,
      status: 'OPEN FOR ALL',
      statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      prizes: { first: '₹25,000', second: '₹15,000', third: '₹10,000', mvp: 'Per Kill Bonus' },
      badge: 'DAILY SCRIMS'
    },
    {
      id: 'tourney-4',
      title: 'SOLO CONQUEROR CLASH',
      category: 'SOLO',
      prizePool: '₹75,000 INR',
      format: 'TPP Solo • BootCamp Sanhok Deathmatch',
      date: 'Sunday • 5:00 PM IST',
      filledSlots: 46,
      totalSlots: 100,
      status: 'OPEN FOR ALL',
      statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      prizes: { first: '₹40,000', second: '₹20,000', third: '₹10,000', mvp: '₹5,000' },
      badge: 'SOLO KING'
    }
  ];

  const filteredTournaments = tournaments.filter(t => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'SQUADS' && t.category === 'BGMI SQUADS') return true;
    if (activeFilter === 'INVITATIONAL' && t.category === 'INVITATIONAL') return true;
    if (activeFilter === 'CUSTOMS' && t.category === 'CUSTOMS') return true;
    if (activeFilter === 'SOLO' && t.category === 'SOLO') return true;
    return true;
  });

  const pointsTableData = [
    { rank: 1, team: 'CONQUEROR ELITE SQUAD', matches: 6, wwcd: 3, placePts: 42, killPts: 48, total: 90 },
    { rank: 2, team: 'CHENNAI ASSASSINS', matches: 6, wwcd: 2, placePts: 36, killPts: 38, total: 74 },
    { rank: 3, team: 'MADURAI TITANS', matches: 6, wwcd: 1, placePts: 28, killPts: 34, total: 62 },
    { rank: 4, team: 'COIMBATORE CYCLONES', matches: 6, wwcd: 0, placePts: 22, killPts: 29, total: 51 },
    { rank: 5, team: 'VELLORE VIPERS', matches: 6, wwcd: 0, placePts: 18, killPts: 26, total: 44 },
    { rank: 6, team: 'TRICHY REAPERS', matches: 6, wwcd: 0, placePts: 14, killPts: 22, total: 36 },
  ];

  return (
    <section id="tournaments" className="py-20 md:py-28 relative bg-[#05070A]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-amber-300 text-xs font-rajdhani font-bold uppercase tracking-widest mb-3">
            <Swords className="w-3.5 h-3.5 text-amber-400" />
            <span>Tournament Command Center</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight">
            COMPETITIVE <span className="text-gold-gradient">ARENA</span>
          </h2>
          <p className="font-sans text-gray-400 text-sm sm:text-base mt-3">
            Register your squad, claim your slot, and compete in the most prestigious BGMI / PUBG Mobile cups organized in the South.
          </p>
        </div>

        {/* Navigation Tabs (Upcoming vs Hall of Fame vs Points Table) */}
        <div className="flex justify-center mb-10">
          <div className="p-1.5 rounded-2xl bg-[#0B0F17] border border-gray-800 flex gap-2">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('upcoming');
              }}
              className={`px-5 py-2.5 rounded-xl font-orbitron font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-gold-gradient text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Active & Upcoming
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('hall-of-fame');
              }}
              className={`px-5 py-2.5 rounded-xl font-orbitron font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'hall-of-fame'
                  ? 'bg-gold-gradient text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Hall of Champions
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveTab('points-table');
              }}
              className={`px-5 py-2.5 rounded-xl font-orbitron font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'points-table'
                  ? 'bg-gold-gradient text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Live Points Table
            </button>
          </div>
        </div>

        {/* TAB 1: Upcoming Tournaments */}
        {activeTab === 'upcoming' && (
          <div>
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {['ALL', 'SQUADS', 'INVITATIONAL', 'CUSTOMS', 'SOLO'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveFilter(cat);
                  }}
                  onMouseEnter={() => soundFx.playHover()}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-rajdhani font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeFilter === cat
                      ? 'bg-[#182230] text-amber-300 border border-gold-500/60 shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                      : 'bg-black/40 text-gray-500 hover:text-gray-300 border border-gray-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Match Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTournaments.map((t) => {
                const fillPercent = (t.filledSlots / t.totalSlots) * 100;
                return (
                  <div
                    key={t.id}
                    onMouseEnter={() => soundFx.playHover()}
                    className="rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#111622] via-[#0D1017] to-[#07090D] border border-gold-500/25 hover:border-gold-400 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-orbitron font-bold text-amber-300 bg-black/60 border border-gold-500/30">
                          {t.badge}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-orbitron font-bold border ${t.statusColor}`}>
                          {t.status}
                        </span>
                      </div>

                      {/* Tournament Title & Prize */}
                      <h3 className="font-orbitron font-extrabold text-xl sm:text-2xl text-white group-hover:text-gold-gradient transition-all mb-2">
                        {t.title}
                      </h3>

                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xs font-rajdhani font-bold text-gray-400 uppercase">Prize Pool:</span>
                        <span className="font-orbitron font-black text-2xl text-gold-bright">
                          {t.prizePool}
                        </span>
                      </div>

                      {/* Format & Schedule details */}
                      <div className="space-y-2 p-3.5 rounded-xl bg-black/50 border border-gray-800/80 text-xs font-rajdhani text-gray-300 mb-6">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Schedule: <strong className="text-white">{t.date}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span>Format: <strong className="text-gray-200">{t.format}</strong></span>
                        </div>
                      </div>

                      {/* Prize Distribution preview */}
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-rajdhani font-bold text-gray-400 mb-6">
                        <div className="p-2 rounded-lg bg-black/40 border border-gold-500/20">
                          <span className="text-amber-400 block">1ST PLACE</span>
                          <span className="text-white font-mono">{t.prizes.first}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-black/40 border border-gray-800">
                          <span className="text-gray-300 block">2ND PLACE</span>
                          <span className="text-white font-mono">{t.prizes.second}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-black/40 border border-gray-800">
                          <span className="text-amber-600 block">3RD PLACE</span>
                          <span className="text-white font-mono">{t.prizes.third}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-black/40 border border-gold-500/20">
                          <span className="text-emerald-400 block">MVP BONUS</span>
                          <span className="text-white font-mono">{t.prizes.mvp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Slot Fill Bar & CTA */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-rajdhani font-bold mb-1.5">
                        <span className="text-gray-400">SLOT CAPACITY</span>
                        <span className="text-amber-400 font-mono">
                          {t.filledSlots} / {t.totalSlots} FILLED
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-900 overflow-hidden mb-6">
                        <div
                          className="h-full bg-gold-gradient rounded-full transition-all duration-1000"
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>

                      <button
                        onClick={() => {
                          soundFx.playModalOpen();
                          onRegisterClick(t);
                        }}
                        className="w-full py-3.5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-black font-orbitron font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                      >
                        <Swords className="w-4 h-4" />
                        <span>Register Squad Slot</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Hall of Champions */}
        {activeTab === 'hall-of-fame' && (
          <div className="rounded-3xl p-6 sm:p-10 bg-[#0A0D14] border border-gold-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
            <div className="text-center mb-12">
              <span className="text-xs font-rajdhani font-bold text-amber-400 uppercase tracking-widest">
                Past Season Winners
              </span>
              <h3 className="font-orbitron font-bold text-2xl sm:text-3xl text-white uppercase mt-1">
                Season 6 Grand Champions Podium
              </h3>
            </div>

            {/* Winners Podium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* 2nd Place */}
              <div className="rounded-2xl p-6 bg-gradient-to-t from-[#141B26] to-[#0D121B] border border-gray-600 text-center flex flex-col items-center order-2 md:order-1">
                <div className="w-14 h-14 rounded-full bg-gray-800 border-2 border-gray-400 flex items-center justify-center font-orbitron font-black text-xl text-gray-200 mb-3">
                  #2
                </div>
                <h4 className="font-orbitron font-bold text-lg text-white">CHENNAI ASSASSINS</h4>
                <p className="text-xs font-rajdhani text-gray-400 font-semibold mb-4">Captain: @SilentHunter</p>
                <div className="w-full p-2.5 rounded-xl bg-black/60 border border-gray-800 text-xs font-rajdhani font-bold">
                  <span className="text-gray-400 block">PRIZE AWARDED</span>
                  <span className="text-white text-base font-mono">₹65,000 INR</span>
                </div>
              </div>

              {/* 1st Place (Gold Champion) */}
              <div className="rounded-2xl p-8 bg-gradient-to-t from-[#201908] via-[#151206] to-[#0E0C04] border-2 border-gold-400 text-center flex flex-col items-center shadow-[0_0_40px_rgba(255,215,0,0.3)] order-1 md:order-2 transform md:-translate-y-4">
                <div className="w-16 h-16 rounded-full bg-gold-gradient border-2 border-white flex items-center justify-center font-orbitron font-black text-2xl text-black mb-3 shadow-[0_0_20px_rgba(255,215,0,0.6)]">
                  <Trophy className="w-8 h-8 text-black fill-black" />
                </div>
                <span className="px-3 py-1 rounded-full bg-gold-500/20 text-amber-300 font-orbitron font-bold text-[10px] mb-2">
                  GRAND CHAMPION
                </span>
                <h4 className="font-orbitron font-black text-2xl text-gold-bright">CONQUEROR ELITE</h4>
                <p className="text-xs font-rajdhani text-gray-300 font-semibold mb-4">MVP: Madan (48 Kills Total)</p>
                <div className="w-full p-3 rounded-xl bg-black/70 border border-gold-500/40 text-xs font-rajdhani font-bold">
                  <span className="text-amber-400 block">CHAMPION PRIZE</span>
                  <span className="text-gold-bright text-xl font-mono">₹1,25,000 INR</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="rounded-2xl p-6 bg-gradient-to-t from-[#1A1208] to-[#0E0B07] border border-amber-700 text-center flex flex-col items-center order-3">
                <div className="w-14 h-14 rounded-full bg-amber-950 border-2 border-amber-600 flex items-center justify-center font-orbitron font-black text-xl text-amber-500 mb-3">
                  #3
                </div>
                <h4 className="font-orbitron font-bold text-lg text-white">MADURAI TITANS</h4>
                <p className="text-xs font-rajdhani text-gray-400 font-semibold mb-4">Captain: @MadanFanClub</p>
                <div className="w-full p-2.5 rounded-xl bg-black/60 border border-gray-800 text-xs font-rajdhani font-bold">
                  <span className="text-gray-400 block">PRIZE AWARDED</span>
                  <span className="text-white text-base font-mono">₹35,000 INR</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Points Table */}
        {activeTab === 'points-table' && (
          <div className="rounded-3xl p-6 sm:p-8 bg-[#0A0D14] border border-gold-500/30 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
              <div>
                <h3 className="font-orbitron font-bold text-xl text-white uppercase">
                  Official BGMI Tournament Standings
                </h3>
                <p className="font-rajdhani text-xs text-gray-400">
                  Standard Esports Scoring: 10-6-5-4-3-2-1 Placement Points + 1 Point Per Frag
                </p>
              </div>
              <span className="px-3 py-1 rounded bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-orbitron font-bold self-start sm:self-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                OFFICIAL SCRIMS V2
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-rajdhani">
                <thead>
                  <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase font-bold tracking-wider">
                    <th className="py-3 px-3"># Rank</th>
                    <th className="py-3 px-3">Squad Name</th>
                    <th className="py-3 px-3 text-center">Matches</th>
                    <th className="py-3 px-3 text-center">WWCD</th>
                    <th className="py-3 px-3 text-center">Place Pts</th>
                    <th className="py-3 px-3 text-center">Kill Pts</th>
                    <th className="py-3 px-3 text-right">Total Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 text-sm">
                  {pointsTableData.map((row) => (
                    <tr
                      key={row.rank}
                      className={`hover:bg-gold-500/5 transition-colors ${
                        row.rank === 1 ? 'bg-gold-500/10 font-bold text-amber-300' : 'text-gray-200'
                      }`}
                    >
                      <td className="py-3.5 px-3 font-orbitron font-bold">
                        {row.rank === 1 ? '🏆 #1' : `#${row.rank}`}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-white">
                        {row.team}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-gray-400">{row.matches}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-amber-400">{row.wwcd}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-gray-300">{row.placePts}</td>
                      <td className="py-3.5 px-3 text-center font-mono text-gray-300">{row.killPts}</td>
                      <td className="py-3.5 px-3 text-right font-orbitron font-black text-gold-bright text-base">
                        {row.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};