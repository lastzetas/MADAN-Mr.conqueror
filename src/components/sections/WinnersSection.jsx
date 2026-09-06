import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon, Trophy, Award, Flame, Zap, Shield, Crown, Swords, Users, User, Radio, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const WinnersSection = ({ onOpenTournamentModal }) => {
  const [activeCategory, setActiveCategory] = useState('SEASONAL');
  const [activeWinner, setActiveWinner] = useState(0);

  // Category Tabs
  const categories = [
    { id: 'SEASONAL', label: 'Seasonal Trophies', icon: Trophy },
    { id: 'SOLO', label: 'Solo Trophies', icon: User },
    { id: 'DUO', label: 'Duo Trophies', icon: Users },
    { id: 'SQUAD', label: 'Squad Trophies', icon: Shield },
  ];

  // Data per category
  const winnersData = {
    SEASONAL: {
      leftList: [
        {
          id: 0,
          name: 'OG-BTS (OG Battle Squad)',
          title: 'Season 6 Seasonal Grand Champions',
          date: 'February 2026',
          prize: '₹1,50,000 INR',
        },
        {
          id: 1,
          name: 'OG-BTS (OG Battle Squad)',
          title: 'Season 5 Seasonal Champions',
          date: 'November 2025',
          prize: '₹1,20,000 INR',
        },
        {
          id: 2,
          name: 'OG-BTS (OG Battle Squad)',
          title: 'Season 4 Seasonal Champions',
          date: 'August 2025',
          prize: '₹1,00,000 INR',
        },
        {
          id: 3,
          name: 'OG-BTS (OG Battle Squad)',
          title: 'Season 3 Seasonal Champions',
          date: 'May 2025',
          prize: '₹80,000 INR',
        },
      ],
      cards: [
        {
          id: 1,
          name: 'OG-BTS',
          season: 'Season 6 Grand Champions',
          prize: '₹1,50,000',
          kills: '64 Kills (Record)',
          badgeColor: 'from-amber-500/25 via-[#181308] to-black',
          borderColor: 'border-amber-500/50',
          iconColor: 'text-amber-400',
          logoType: 'ogbts',
          edition: 'S6 Champion',
        },
        {
          id: 2,
          name: 'OG-BTS',
          season: 'Season 5 Grand Champions',
          prize: '₹1,20,000',
          kills: '59 Kills Total',
          badgeColor: 'from-amber-500/20 via-[#161208] to-black',
          borderColor: 'border-amber-500/40',
          iconColor: 'text-amber-400',
          logoType: 'ogbts',
          edition: 'S5 Champion',
        },
        {
          id: 3,
          name: 'OG-BTS',
          season: 'Season 4 Grand Champions',
          prize: '₹1,00,000',
          kills: '55 Kills Total',
          badgeColor: 'from-amber-500/20 via-[#161208] to-black',
          borderColor: 'border-amber-500/40',
          iconColor: 'text-amber-400',
          logoType: 'ogbts',
          edition: 'S4 Champion',
        },
        {
          id: 4,
          name: 'OG-BTS',
          season: 'Season 3 Grand Champions',
          prize: '₹80,000',
          kills: '51 Kills Total',
          badgeColor: 'from-amber-500/20 via-[#161208] to-black',
          borderColor: 'border-amber-500/40',
          iconColor: 'text-amber-400',
          logoType: 'ogbts',
          edition: 'S3 Champion',
        },
        {
          id: 5,
          name: 'OG-BTS',
          season: 'Season 2 Grand Champions',
          prize: '₹60,000',
          kills: '48 Kills Total',
          badgeColor: 'from-amber-500/20 via-[#161208] to-black',
          borderColor: 'border-amber-500/40',
          iconColor: 'text-amber-400',
          logoType: 'ogbts',
          edition: 'S2 Champion',
        },
        {
          id: 6,
          name: 'OG-BTS',
          season: 'Season 1 Grand Champions',
          prize: '₹50,000',
          kills: '44 Kills Total',
          badgeColor: 'from-amber-500/20 via-[#161208] to-black',
          borderColor: 'border-amber-500/40',
          iconColor: 'text-amber-400',
          logoType: 'ogbts',
          edition: 'Inaugural S1',
        },
      ],
    },
    SOLO: {
      leftList: [
        {
          id: 0,
          name: 'Madan / Mr. Conqueror',
          title: 'Solo Erangel Grand Slam King',
          date: 'March 2026',
          prize: '₹75,000 INR',
        },
        {
          id: 1,
          name: 'Jonathan / GodL_Jonathan',
          title: 'Solo Frag Slayer Championship',
          date: 'February 2026',
          prize: '₹50,000 INR',
        },
        {
          id: 2,
          name: 'Mortal / Soul_Mortal',
          title: 'Solo Tactical Survival Cup',
          date: 'January 2026',
          prize: '₹40,000 INR',
        },
      ],
      cards: [
        {
          id: 1,
          name: 'MADAN (MR. CONQUEROR)',
          season: 'Solo Erangel Grand Slam',
          prize: '₹75,000',
          kills: '28 Kills (Solo Record)',
          badgeColor: 'from-amber-500/25 via-[#181308] to-black',
          borderColor: 'border-amber-500/50',
          iconColor: 'text-amber-400',
          logoType: 'madan_solo',
          edition: 'Solo King',
        },
        {
          id: 2,
          name: 'JONATHAN GAMING',
          season: 'Solo Frag Slayer Cup',
          prize: '₹50,000',
          kills: '24 Kills Total',
          badgeColor: 'from-red-600/20 via-[#160B0D] to-black',
          borderColor: 'border-red-500/40',
          iconColor: 'text-red-400',
          logoType: 'godlike',
          edition: 'Solo Slayer',
        },
        {
          id: 3,
          name: 'MORTAL',
          season: 'Tactical Survival Cup',
          prize: '₹40,000',
          kills: '21 Kills Total',
          badgeColor: 'from-amber-500/20 via-[#181308] to-black',
          borderColor: 'border-amber-500/40',
          iconColor: 'text-amber-400',
          logoType: 'soul',
          edition: 'Survival MVP',
        },
        {
          id: 4,
          name: 'SCOUT OP',
          season: 'Miramar Solo Duel Clash',
          prize: '₹35,000',
          kills: '19 Kills Total',
          badgeColor: 'from-cyan-500/20 via-[#0B1418] to-black',
          borderColor: 'border-cyan-500/40',
          iconColor: 'text-cyan-400',
          logoType: 'ge',
          edition: 'Miramar Master',
        },
        {
          id: 5,
          name: 'MAVI',
          season: 'Solo IGL Survival War',
          prize: '₹30,000',
          kills: '18 Kills Total',
          badgeColor: 'from-purple-500/20 via-[#130B18] to-black',
          borderColor: 'border-purple-500/40',
          iconColor: 'text-purple-400',
          logoType: 'revenant',
          edition: 'Tactician MVP',
        },
        {
          id: 6,
          name: 'GOBLIN',
          season: 'Sanhok Solo Bounty',
          prize: '₹25,000',
          kills: '17 Kills Total',
          badgeColor: 'from-yellow-500/20 via-[#181508] to-black',
          borderColor: 'border-yellow-500/40',
          iconColor: 'text-yellow-400',
          logoType: '8bit',
          edition: 'Bootcamp MVP',
        },
      ],
    },
    DUO: {
      leftList: [
        {
          id: 0,
          name: 'Jonathan & Neyoo / GodLike Duo',
          title: 'Duo Apex Invitational Championship',
          date: 'March 2026',
          prize: '₹90,000 INR',
        },
        {
          id: 1,
          name: 'Mortal & Viper / Team Soul Duo',
          title: 'Duo Masters Scrim Clash',
          date: 'February 2026',
          prize: '₹70,000 INR',
        },
        {
          id: 2,
          name: 'Juicy & Madan / 8Bit-Conqueror',
          title: 'Duo Syndicate Showdown',
          date: 'January 2026',
          prize: '₹50,000 INR',
        },
      ],
      cards: [
        {
          id: 1,
          name: 'GODLIKE DUO',
          season: 'Jonathan & Neyoo (Apex Cup)',
          prize: '₹90,000',
          kills: '38 Kills Total',
          badgeColor: 'from-red-600/20 via-[#160B0D] to-black',
          borderColor: 'border-red-500/40',
          iconColor: 'text-red-400',
          logoType: 'godlike',
          edition: 'Duo Champions',
        },
        {
          id: 2,
          name: 'SOUL DUO',
          season: 'Mortal & Viper (Masters Clash)',
          prize: '₹70,000',
          kills: '34 Kills Total',
          badgeColor: 'from-amber-500/20 via-[#181308] to-black',
          borderColor: 'border-amber-500/40',
          iconColor: 'text-amber-400',
          logoType: 'soul',
          edition: 'Duo Runner-Up',
        },
        {
          id: 3,
          name: '8BIT CONQUEROR DUO',
          season: 'Juicy & Madan (Syndicate)',
          prize: '₹50,000',
          kills: '31 Kills Total',
          badgeColor: 'from-yellow-500/20 via-[#181508] to-black',
          borderColor: 'border-yellow-500/40',
          iconColor: 'text-yellow-400',
          logoType: '8bit',
          edition: 'Duo Finalist',
        },
        {
          id: 4,
          name: 'HYDRA DUO',
          season: 'Alpha & Dynamo (Erangel Bounty)',
          prize: '₹40,000',
          kills: '29 Kills Total',
          badgeColor: 'from-emerald-500/20 via-[#0B1611] to-black',
          borderColor: 'border-emerald-500/40',
          iconColor: 'text-emerald-400',
          logoType: 'hydra',
          edition: 'Bounty Duo',
        },
        {
          id: 5,
          name: 'GLOBAL DUO',
          season: 'Mavi & Mayavi (Strategic Cup)',
          prize: '₹35,000',
          kills: '27 Kills Total',
          badgeColor: 'from-cyan-500/20 via-[#0B1418] to-black',
          borderColor: 'border-cyan-500/40',
          iconColor: 'text-cyan-400',
          logoType: 'ge',
          edition: 'Strategy Duo',
        },
        {
          id: 6,
          name: 'REVENANT DUO',
          season: 'Sensei & Apollo (Bootcamp)',
          prize: '₹30,000',
          kills: '25 Kills Total',
          badgeColor: 'from-purple-500/20 via-[#130B18] to-black',
          borderColor: 'border-purple-500/40',
          iconColor: 'text-purple-400',
          logoType: 'revenant',
          edition: 'Bootcamp Duo',
        },
      ],
    },
    SQUAD: {
      leftList: [
        {
          id: 0,
          name: 'Soul_Mortal / Team Soul',
          title: 'Grand Finals Conqueror Scrims',
          date: 'March 14, 2026',
          prize: '₹1,25,000 INR',
        },
        {
          id: 1,
          name: 'GodL_Jonathan / GodLike',
          title: 'All-Stars Invitational Showdown',
          date: 'March 11, 2026',
          prize: '₹80,000 INR',
        },
        {
          id: 2,
          name: '8Bit_Juicy / Team 8Bit',
          title: 'Pro Invitational League #1',
          date: 'March 08, 2026',
          prize: '₹50,000 INR',
        },
      ],
      cards: [
        {
          id: 1,
          name: 'TEAM SOUL',
          season: 'Season 7 Grand Champions',
          prize: '₹1,25,000',
          kills: '52 Kills Total',
          badgeColor: 'from-amber-500/20 via-[#181308] to-black',
          borderColor: 'border-amber-500/40',
          iconColor: 'text-amber-400',
          logoType: 'soul',
          edition: 'Squad Champions',
        },
        {
          id: 2,
          name: 'GODLIKE ESPORTS',
          season: 'Masters Invitational Cup',
          prize: '₹80,000',
          kills: '48 Kills Total',
          badgeColor: 'from-red-600/20 via-[#160B0D] to-black',
          borderColor: 'border-red-500/40',
          iconColor: 'text-red-400',
          logoType: 'godlike',
          edition: 'Squad Runner-Up',
        },
        {
          id: 3,
          name: 'TEAM 8BIT',
          season: 'Pro Invitational League #1',
          prize: '₹50,000',
          kills: '41 Kills Total',
          badgeColor: 'from-yellow-500/20 via-[#181508] to-black',
          borderColor: 'border-yellow-500/40',
          iconColor: 'text-yellow-400',
          logoType: '8bit',
          edition: 'Squad Finalist',
        },
        {
          id: 4,
          name: 'HYDRA OFFICIALS',
          season: 'Erangel Bounty Clash',
          prize: '₹35,000',
          kills: '38 Kills Total',
          badgeColor: 'from-emerald-500/20 via-[#0B1611] to-black',
          borderColor: 'border-emerald-500/40',
          iconColor: 'text-emerald-400',
          logoType: 'hydra',
          edition: 'Bounty Champions',
        },
        {
          id: 5,
          name: 'GLOBAL ESPORTS',
          season: 'Championship Masters',
          prize: '₹30,000',
          kills: '36 Kills Total',
          badgeColor: 'from-cyan-500/20 via-[#0B1418] to-black',
          borderColor: 'border-cyan-500/40',
          iconColor: 'text-cyan-400',
          logoType: 'ge',
          edition: 'Masters Squad',
        },
        {
          id: 6,
          name: 'REVENANT ESPORTS',
          season: 'BootCamp Showdown Cup',
          prize: '₹25,000',
          kills: '34 Kills Total',
          badgeColor: 'from-purple-500/20 via-[#130B18] to-black',
          borderColor: 'border-purple-500/40',
          iconColor: 'text-purple-400',
          logoType: 'revenant',
          edition: 'Showdown Squad',
        },
      ],
    },
  };

  const currentCategoryData = winnersData[activeCategory];

  const renderTeamLogo = (type, color) => {
    switch (type) {
      case 'ogbts':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#FFD700] via-[#D4AF37] to-[#8E752D] p-0.5 shadow-[0_0_22px_rgba(255,215,0,0.7)]">
              <div className="w-full h-full bg-[#0E0C06] rounded-[14px] flex flex-col items-center justify-center">
                <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-[#FFD700] fill-[#FFD700]" />
                <span className="font-montserrat font-black text-[9px] text-[#FFD700] tracking-wider">OG-BTS</span>
              </div>
            </div>
          </div>
        );
      case 'madan_solo':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-300 to-yellow-600 p-0.5 shadow-[0_0_20px_rgba(251,191,36,0.6)]">
              <div className="w-full h-full bg-[#0E0C06] rounded-[14px] flex flex-col items-center justify-center">
                <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 fill-amber-400" />
                <span className="font-montserrat font-black text-[8px] text-amber-300 tracking-wider">MADAN</span>
              </div>
            </div>
          </div>
        );
      case 'soul':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-[0_0_20px_rgba(251,191,36,0.6)]">
              <div className="w-full h-full bg-[#0E0C06] rounded-[14px] flex flex-col items-center justify-center">
                <Flame className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 fill-amber-400" />
                <span className="font-montserrat font-black text-[9px] text-amber-300 tracking-wider">SOUL</span>
              </div>
            </div>
          </div>
        );
      case 'godlike':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-800 p-0.5 shadow-[0_0_20px_rgba(239,68,68,0.6)]">
              <div className="w-full h-full bg-[#100708] rounded-[14px] flex flex-col items-center justify-center">
                <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-red-400 fill-red-400" />
                <span className="font-montserrat font-black text-[9px] text-red-300 tracking-wider">GODL</span>
              </div>
            </div>
          </div>
        );
      case '8bit':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 p-0.5 shadow-[0_0_20px_rgba(234,179,8,0.6)]">
              <div className="w-full h-full bg-[#0F0E06] rounded-[14px] flex flex-col items-center justify-center">
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-400 fill-yellow-400" />
                <span className="font-montserrat font-black text-[10px] text-yellow-300 tracking-wider">8BIT</span>
              </div>
            </div>
          </div>
        );
      case 'hydra':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-700 p-0.5 shadow-[0_0_20px_rgba(168,85,247,0.6)]">
              <div className="w-full h-full bg-[#06100B] rounded-[14px] flex flex-col items-center justify-center">
                <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400 fill-emerald-400" />
                <span className="font-montserrat font-black text-[9px] text-emerald-300 tracking-wider">HYDRA</span>
              </div>
            </div>
          </div>
        );
      case 'ge':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-700 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.6)]">
              <div className="w-full h-full bg-[#060D12] rounded-[14px] flex flex-col items-center justify-center">
                <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400 fill-cyan-400" />
                <span className="font-montserrat font-black text-[9px] text-cyan-300 tracking-wider">GLOBAL</span>
              </div>
            </div>
          </div>
        );
      case 'revenant':
        return (
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-700 p-0.5 shadow-[0_0_20px_rgba(168,85,247,0.6)]">
              <div className="w-full h-full bg-[#0D0713] rounded-[14px] flex flex-col items-center justify-center">
                <Award className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400 fill-purple-400" />
                <span className="font-montserrat font-black text-[9px] text-purple-300 tracking-wider">REVENANT</span>
              </div>
            </div>
          </div>
        );
      default:
        return <Trophy className="w-8 h-8 text-[#E5C05B]" />;
    }
  };

  return (
    <section id="winners" className="w-full mb-8">
      {/* Category Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 p-2 rounded-xl bg-[#0C0F15] border border-[#1E2433]">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveCategory(cat.id);
                  setActiveWinner(0);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-montserrat font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E5C05B] text-[#090B0E] shadow-[0_0_15px_rgba(229,192,91,0.4)]'
                    : 'bg-[#11151E] text-[#788294] hover:text-[#E2E8F0] hover:bg-[#161C28] border border-[#1E2536]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#090B0E]' : 'text-[#E5C05B]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Season Status Tag */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400 text-xs font-rajdhani font-bold">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>SEASON 7 WAR: LIVE REGISTRATION</span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Card: WINNERS List */}
        <div className="lg:col-span-4 rounded-xl p-5 sm:p-6 bg-[#0C0F15] border border-[#1E2433] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-montserrat font-extrabold text-base text-white uppercase tracking-wider">
                {activeCategory} WINNERS
              </h3>
              <span className="text-[11px] font-mono text-[#E5C05B] bg-[#E5C05B]/10 px-2 py-0.5 rounded border border-[#E5C05B]/30">
                Hall of Fame
              </span>
            </div>

            <div className="space-y-3">
              {currentCategoryData.leftList.map((w) => (
                <div
                  key={w.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveWinner(w.id);
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    activeWinner === w.id
                      ? 'bg-[#262010] border-[#8E752D] text-[#E5C05B]'
                      : 'bg-[#11151E] border-[#1E2536]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-6 h-6 rounded-full bg-[#1E2433] border border-[#2B3448] flex items-center justify-center text-xs font-bold text-[#E5C05B] shrink-0">
                        {w.name[0]}
                      </div>
                      <span className="font-montserrat font-bold text-xs sm:text-sm text-white truncate">
                        {w.name}
                      </span>
                    </div>
                    {w.prize && (
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#E5C05B] shrink-0">
                        {w.prize}
                      </span>
                    )}
                  </div>
                  <p className="font-rajdhani text-xs text-[#788294] pl-8.5 line-clamp-1">
                    {w.title}
                  </p>
                  {activeWinner === w.id && (
                    <span className="font-mono text-[10px] text-[#64748B] pl-8.5 block mt-1">
                      {w.date}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => soundFx.playClick()}
            className="mt-5 text-xs font-rajdhani font-bold text-[#788294] hover:text-[#E5C05B] flex items-center gap-1 transition-colors self-start cursor-pointer"
          >
            <span>View All Records</span>
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Card: TROPHIES & WINNERS GALLERY */}
        <div className="lg:col-span-8 rounded-xl p-5 sm:p-6 bg-[#0C0F15] border border-[#1E2433] space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-montserrat font-extrabold text-base text-white uppercase tracking-wider">
                {activeCategory === 'SEASONAL' ? 'SEASONAL TROPHIES & 6X CHAMPIONS' : `${activeCategory} TROPHIES & WINNERS`}
              </h3>
              <p className="font-rajdhani text-xs text-[#788294] font-medium">
                {activeCategory === 'SEASONAL'
                  ? 'OG-BTS 6-Time Undisputed Champions & Season 7 Live War'
                  : `Elite BGMI ${activeCategory.toLowerCase()} tournament champions`}
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

          {/* 7th SEASONAL WAR LIVE REGISTRATION HERO BANNER (Shown in Seasonal Trophies tab) */}
          {activeCategory === 'SEASONAL' && (
            <div className="relative overflow-hidden rounded-xl p-4 sm:p-5 bg-gradient-to-r from-[#2A1E08] via-[#1A1408] to-[#0D1017] border-2 border-[#E5C05B] shadow-[0_0_30px_rgba(229,192,91,0.3)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="space-y-1 z-10">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-montserrat font-black text-[10px] uppercase flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse" />
                    LIVE NOW
                  </span>
                  <span className="font-montserrat font-extrabold text-xs text-[#E5C05B] tracking-wider uppercase">
                    7TH SEASONAL WAR
                  </span>
                </div>

                <h4 className="font-montserrat font-black text-lg sm:text-xl text-white uppercase">
                  CONQUEROR SEASON 7 GRAND ARENA
                </h4>

                <p className="font-rajdhani text-xs text-[#CBD5E1] max-w-xl">
                  OG-BTS conquered the last 6 Seasonal Trophies! Will your squad dethrone them in Season 7? Register now to claim the ₹2,50,000 INR prize pool and 7th Seasonal Crown.
                </p>
              </div>

              {/* Action Button */}
              <div className="z-10 shrink-0">
                <button
                  onClick={() => {
                    soundFx.playModalOpen();
                    onOpenTournamentModal?.({
                      title: "7TH SEASONAL WAR: CONQUEROR GRAND ARENA",
                      prizePool: "₹2,50,000 INR",
                      format: "TPP Squads • Season 7 Official Championship"
                    });
                  }}
                  onMouseEnter={() => soundFx.playHover()}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[#FFD700] via-[#E5C05B] to-[#D4AF37] hover:brightness-110 text-[#090B0E] font-montserrat font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.6)] cursor-pointer transition-all transform hover:scale-105 active:scale-95"
                >
                  <Swords className="w-4 h-4 text-[#090B0E]" />
                  <span>REGISTER FOR 7TH SEASONAL WAR</span>
                </button>
              </div>

              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          )}

          {/* 6 Champion Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {currentCategoryData.cards.map((team) => (
              <div
                key={team.id}
                onMouseEnter={() => soundFx.playHover()}
                className={`rounded-xl overflow-hidden bg-gradient-to-b ${team.badgeColor} border ${team.borderColor} hover:border-[#E5C05B] transition-all flex flex-col justify-between p-3.5 sm:p-4 group shadow-lg`}
              >
                {/* Center Team Emblem Logo */}
                <div className="flex items-center justify-center py-2 group-hover:scale-110 transition-transform duration-300">
                  {renderTeamLogo(team.logoType, team.iconColor)}
                </div>

                {/* Team Info & Tournament details */}
                <div className="pt-2 border-t border-[#1E2536]/80 text-center">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <span className="font-montserrat font-black text-xs sm:text-sm text-white tracking-wider group-hover:text-gold-bright transition-colors truncate">
                      {team.name}
                    </span>
                  </div>
                  
                  <span className="font-rajdhani text-[11px] text-[#CBD5E1] font-semibold block truncate">
                    {team.season}
                  </span>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-[10px] font-mono">
                    <span className="text-[#E5C05B] font-bold">{team.prize}</span>
                    <span className="text-[#94A3B8]">{team.kills}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};