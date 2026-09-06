import React, { useState } from 'react';
import { Trophy, Crosshair, Target, Users, Flame, Award, ShieldCheck, Zap, ArrowUpRight, Check, Copy, Sliders, Smartphone } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const CareerStats = () => {
  const [activeSeason, setActiveSeason] = useState(0);
  const [copiedSens, setCopiedSens] = useState(false);
  const [copiedLayout, setCopiedLayout] = useState(false);

  const stats = [
    {
      label: 'All-Time Ranked K/D',
      value: '9.84',
      subtext: '15,240+ Total Confirmed Kills',
      icon: Crosshair,
      color: 'from-amber-500/20 to-amber-900/10',
      border: 'border-amber-500/30',
      badge: 'TOP 0.01% GLOBAL',
    },
    {
      label: 'Ranked Win Rate',
      value: '68.4%',
      subtext: 'Over 1,200+ Chicken Dinners',
      icon: Target,
      color: 'from-gold-500/20 to-gold-900/10',
      border: 'border-gold-500/30',
      badge: 'SQUAD SPECIALIST',
    },
    {
      label: 'Conqueror Trophies',
      value: '18x',
      subtext: 'Consecutive Top 100 Asia Rank',
      icon: Trophy,
      color: 'from-yellow-500/20 to-yellow-900/10',
      border: 'border-yellow-500/30',
      badge: 'HALL OF FAME',
    },
    {
      label: 'Total Tournament Prizepool',
      value: '₹50,00,000+',
      subtext: 'Awarded Across 45+ Community Cups',
      icon: Award,
      color: 'from-emerald-500/20 to-emerald-900/10',
      border: 'border-emerald-500/30',
      badge: 'GRASSROOTS ESPORTS',
    },
    {
      label: 'Peak Concurrent Stream',
      value: '184,000+',
      subtext: '1.5M+ Registered Subscribers',
      icon: Users,
      color: 'from-red-500/20 to-red-900/10',
      border: 'border-red-500/30',
      badge: 'COMMUNITY TITAN',
    },
    {
      label: 'Headshot Accuracy',
      value: '42.3%',
      subtext: 'AWM & Bolt-Action Long Range',
      icon: Zap,
      color: 'from-cyan-500/20 to-cyan-900/10',
      border: 'border-cyan-500/30',
      badge: 'SNIPER KING',
    },
  ];

  const seasonMilestones = [
    {
      season: 'Season 8 & 9',
      title: 'The Rise to Asia Rank #1',
      period: 'Initial Reign',
      description:
        'Cemented dominance by breaking the Asia Server leaderboards, recording a 34-kill squad wipe in Erangel Pochinki and holding the #1 Conqueror title for 3 consecutive weeks.',
      highlights: ['34 Kills Squad Wipe', '9.4 K/D Season Finish', 'Asia Top 1 Rank'],
      weaponLoadout: 'M416 + Kar98k',
    },
    {
      season: 'Cycle 1 Season 1-3',
      title: 'Dawn of Madan Customs',
      period: 'Community Era',
      description:
        'Launched the premier Madan Conqueror Cup with ₹5,00,000 prizepool, elevating grassroots Tamil esports and scouting top semi-pro teams into tier-1 organizations.',
      highlights: ['400+ Teams Registered', '100K+ Peak Livestream', 'Fair-Play Anti-Cheat Init'],
      weaponLoadout: 'M416 + AWM (Glacier Max)',
    },
    {
      season: 'Cycle 3 Season 7-9',
      title: 'Championship Invitational',
      period: 'Esports Expansion',
      description:
        'Organized the Tamil Nadu Creators Mega Showdown with international guest squads, broadcast live to an audience of over 1.2M collective viewers across YouTube.',
      highlights: ['₹15,00,000 Grand Finale', 'MVP of Showmatch', '180K Peak Viewers'],
      weaponLoadout: 'M416 + DBS / Shotgun Meta',
    },
    {
      season: 'Current Era (Invictus)',
      title: 'The Undisputed Icon',
      period: 'Legacy & Tournaments',
      description:
        'Managing weekly high-stakes scrims, official tournament licenses, mentorship programs for budding mobile esports athletes, and daily conquest lobbies.',
      highlights: ['18x Conqueror Crest', '₹50L+ Career Distribution', '1.5M Community Army'],
      weaponLoadout: 'M416 + AWM + Groza',
    },
  ];

  const sensCode = "7238-9104-5829-3301-447";
  const layoutCode = "6983-4920-1184-7729-012";

  const handleCopySens = () => {
    navigator.clipboard.writeText(sensCode);
    setCopiedSens(true);
    soundFx.playSuccess();
    setTimeout(() => setCopiedSens(false), 2000);
  };

  const handleCopyLayout = () => {
    navigator.clipboard.writeText(layoutCode);
    setCopiedLayout(true);
    soundFx.playSuccess();
    setTimeout(() => setCopiedLayout(false), 2000);
  };

  return (
    <section id="stats" className="py-20 md:py-28 relative bg-[#07090D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-amber-300 text-xs font-rajdhani font-bold uppercase tracking-widest mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Hall of Metrics & Career Records</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight">
            THE CONQUEROR'S <span className="text-gold-gradient">LEGACY</span>
          </h2>
          <p className="font-sans text-gray-400 text-sm sm:text-base mt-4">
            Unrivaled stats forged in competitive lobbies, battle-tested across hundreds of tournament matches and millions of spectators.
          </p>
        </div>

        {/* Bento-Grid Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onMouseEnter={() => soundFx.playHover()}
                className={`relative rounded-2xl p-6 bg-gradient-to-b ${item.color} bg-[#0D1118]/90 border ${item.border} backdrop-blur-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:border-gold-400 transition-all duration-300 group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-black/60 border border-gold-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="text-[10px] font-orbitron font-bold text-amber-300/80 px-2.5 py-1 rounded bg-black/40 border border-gray-800">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-rajdhani text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {item.label}
                </h3>
                <div className="font-orbitron font-black text-3xl sm:text-4xl text-white group-hover:text-gold-gradient transition-all tracking-tight mb-2">
                  {item.value}
                </div>
                <p className="font-sans text-xs text-gray-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {item.subtext}
                </p>
              </div>
            );
          })}
        </div>

        {/* Conqueror Ascent Season Timeline */}
        <div className="rounded-3xl p-6 sm:p-8 md:p-10 bg-[#0A0E15] border border-gold-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-800">
            <div>
              <span className="text-xs font-rajdhani font-bold text-amber-400 uppercase tracking-widest">
                Career Progression
              </span>
              <h3 className="font-orbitron font-bold text-2xl text-white uppercase mt-1">
                Conqueror Ascent Timeline
              </h3>
            </div>
            
            {/* Season Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {seasonMilestones.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveSeason(idx);
                  }}
                  onMouseEnter={() => soundFx.playHover()}
                  className={`px-3 py-1.5 rounded-lg text-xs font-orbitron font-bold transition-all cursor-pointer ${
                    activeSeason === idx
                      ? 'bg-gold-gradient text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                      : 'bg-[#111620] text-gray-400 hover:text-white border border-gray-800'
                  }`}
                >
                  {item.season}
                </button>
              ))}
            </div>
          </div>

          {/* Active Season Details Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-rajdhani font-bold text-amber-400 uppercase px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                  {seasonMilestones[activeSeason].period}
                </span>
                <span className="text-xs font-mono text-gray-500">
                  {seasonMilestones[activeSeason].season}
                </span>
              </div>
              
              <h4 className="font-orbitron font-bold text-xl sm:text-2xl text-gold-bright mb-3">
                {seasonMilestones[activeSeason].title}
              </h4>
              
              <p className="font-sans text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                {seasonMilestones[activeSeason].description}
              </p>

              {/* Highlights pills */}
              <div className="flex flex-wrap gap-3 mb-4">
                {seasonMilestones[activeSeason].highlights.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-gold-500/20 text-xs font-rajdhani font-semibold text-gray-200"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weapon & Loadout Signature Box */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-black/70 border border-gold-500/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-orbitron font-bold text-gray-400 uppercase tracking-widest">
                  Season Signature Loadout
                </span>
                <h5 className="font-orbitron font-extrabold text-lg text-amber-300 mt-1 mb-2">
                  {seasonMilestones[activeSeason].weaponLoadout}
                </h5>
                <p className="font-sans text-xs text-gray-400 leading-relaxed mb-4">
                  Optimized for fast ADS recoil control, 6x-to-3x spray stability and lethal long-range precision.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-800 text-xs font-rajdhani font-bold text-gray-400">
                <span>Tactical Grip: Angled / Half</span>
                <span className="text-amber-400">Compensator AR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Sensitivity & 4-Finger Claw Controls Section */}
        <div id="loadouts" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Box */}
          <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#111722] to-[#0A0D14] border border-gold-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Sliders className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-orbitron font-bold text-lg text-white uppercase">
                  Official Pro Sensitivity Code
                </h4>
                <p className="font-rajdhani text-xs text-gray-400">
                  Full Gyroscope Always-On • High ADS Sensitivity
                </p>
              </div>
            </div>

            <p className="font-sans text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
              The exact BGMI sensitivity values used by Madan for laser-like M416 sprays up to 250 meters and swift reflex flick shots in CQC.
            </p>

            <div className="p-3.5 rounded-xl bg-black/60 border border-gray-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-orbitron font-bold text-gray-500 uppercase block">
                  BGMI Sensitivity Share Code
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-gold-bright tracking-wider">
                  {sensCode}
                </span>
              </div>
              <button
                onClick={handleCopySens}
                onMouseEnter={() => soundFx.playHover()}
                className="px-4 py-2 rounded-lg bg-gold-gradient text-black font-orbitron font-bold text-xs uppercase flex items-center gap-2 hover:bg-gold-gradient-hover transition-all cursor-pointer shadow-[0_0_10px_rgba(212,175,55,0.3)]"
              >
                {copiedSens ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 4-Finger Claw Box */}
          <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#111722] to-[#0A0D14] border border-gold-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="font-orbitron font-bold text-lg text-white uppercase">
                  4-Finger Claw Layout Code
                </h4>
                <p className="font-rajdhani text-xs text-gray-400">
                  Left-Thumb Crouch/Shoot • Right-Index Peek & ADS
                </p>
              </div>
            </div>

            <p className="font-sans text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
              Ergonomically tuned control layout designed for lightning-fast jiggle movements, pre-fire crouch spamming, and seamless scope transitions.
            </p>

            <div className="p-3.5 rounded-xl bg-black/60 border border-gray-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-orbitron font-bold text-gray-500 uppercase block">
                  Layout Share Code
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-gold-bright tracking-wider">
                  {layoutCode}
                </span>
              </div>
              <button
                onClick={handleCopyLayout}
                onMouseEnter={() => soundFx.playHover()}
                className="px-4 py-2 rounded-lg bg-gold-gradient text-black font-orbitron font-bold text-xs uppercase flex items-center gap-2 hover:bg-gold-gradient-hover transition-all cursor-pointer shadow-[0_0_10px_rgba(212,175,55,0.3)]"
              >
                {copiedLayout ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};