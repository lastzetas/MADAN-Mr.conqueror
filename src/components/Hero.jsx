import React, { useState, useRef } from 'react';
import { Play, Swords, Copy, Check, Shield, Flame, Radio, Sparkles, ChevronDown, ExternalLink } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const Hero = ({ onOpenTournamentModal, onOpenLiveStreamModal }) => {
  const [copied, setCopied] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const ign = "Madan_Conqueror";
  const uid = "512894021";

  const handleCopyUid = () => {
    navigator.clipboard.writeText(uid);
    setCopied(true);
    soundFx.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 flex items-center justify-center overflow-hidden"
    >
      {/* Background Ambience & Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[400px] md:h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[300px] h-[300px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-amber-400/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Tactical Background Grid overlay */}
      <div className="absolute inset-0 tactical-grid opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Conqueror Status Header Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#11161F] border border-gold-500/30 text-amber-300 text-xs md:text-sm font-rajdhani font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.15)] mb-6 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Conquering Tamil Esports • PUBG / BGMI Pioneer</span>
            </div>

            {/* Giant Esports Headline */}
            <div className="relative mb-3">
              <h1 className="font-orbitron font-black text-5xl sm:text-7xl md:text-8xl tracking-tight uppercase">
                <span className="text-gold-bright drop-shadow-[0_10px_30px_rgba(212,175,55,0.4)]">
                  MADAN
                </span>
              </h1>
              <div className="font-orbitron font-extrabold text-2xl sm:text-3xl md:text-4xl text-gray-200 tracking-wider flex items-center justify-center lg:justify-start gap-3 mt-1">
                <span className="text-amber-400/80 tracking-widest uppercase">MR. CONQUEROR</span>
                <span className="hidden sm:inline-block w-8 h-[2px] bg-gradient-to-r from-amber-500 to-transparent" />
              </div>
            </div>

            {/* Subtitle / Positioning statement */}
            <p className="font-sans text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl font-normal leading-relaxed mb-6">
              The apex champion and undisputed tournament icon of Tamil Nadu. Setting the benchmark in high-tier competitive battlegrounds, record-breaking live streams, and multi-lakh prize pool tournaments.
            </p>

            {/* In-Game ID & Quick Copy Strip */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 p-2.5 rounded-xl bg-[#0D121A] border border-gold-600/20 backdrop-blur-md mb-8 max-w-md w-full">
              <div className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-lg border border-gray-800 text-xs font-rajdhani font-semibold text-gray-400">
                <span className="text-amber-400 font-bold">IGN:</span>
                <span className="text-white font-mono">{ign}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-lg border border-gray-800 text-xs font-rajdhani font-semibold text-gray-400 flex-1 justify-between">
                <div>
                  <span className="text-amber-400 font-bold">UID:</span>
                  <span className="text-white font-mono ml-1">{uid}</span>
                </div>
                <button
                  onClick={handleCopyUid}
                  onMouseEnter={() => soundFx.playHover()}
                  title="Copy In-Game UID"
                  className="p-1 rounded hover:bg-gold-500/20 text-gray-400 hover:text-gold-400 transition-all cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              {/* Register CTA */}
              <button
                onClick={() => {
                  soundFx.playModalOpen();
                  onOpenTournamentModal();
                }}
                onMouseEnter={() => soundFx.playHover()}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-black font-orbitron font-bold text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:shadow-[0_0_45px_rgba(255,215,0,0.7)] transition-all flex items-center justify-center gap-3 cursor-pointer group transform hover:-translate-y-1 active:translate-y-0"
              >
                <Swords className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Register for Tournament</span>
              </button>

              {/* Watch Live Stream CTA */}
              <button
                onClick={() => {
                  soundFx.playModalOpen();
                  onOpenLiveStreamModal();
                }}
                onMouseEnter={() => soundFx.playHover()}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#0D121C]/80 hover:bg-[#151D2C] border border-gold-500/30 hover:border-gold-400 text-gray-100 font-orbitron font-semibold text-sm tracking-wider uppercase backdrop-blur-md transition-all flex items-center justify-center gap-3 cursor-pointer group shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              >
                <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-3.5 h-3.5 text-red-400 fill-red-400 ml-0.5" />
                </div>
                <span>Watch Live Feed</span>
              </button>
            </div>

            {/* Quick Micro-Metrics */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-10 pt-8 border-t border-gray-800/80 w-full">
              <div className="flex flex-col">
                <span className="font-orbitron font-bold text-xl sm:text-2xl text-gold-gradient">
                  18x
                </span>
                <span className="font-rajdhani text-xs sm:text-sm text-gray-400 uppercase tracking-wider">
                  Conqueror Tier
                </span>
              </div>
              <div className="flex flex-col border-x border-gray-800/80 px-2 sm:px-4">
                <span className="font-orbitron font-bold text-xl sm:text-2xl text-gold-gradient">
                  ₹50L+
                </span>
                <span className="font-rajdhani text-xs sm:text-sm text-gray-400 uppercase tracking-wider">
                  Prizepool Awarded
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-orbitron font-bold text-xl sm:text-2xl text-gold-gradient">
                  1.5M+
                </span>
                <span className="font-rajdhani text-xs sm:text-sm text-gray-400 uppercase tracking-wider">
                  Army of Champions
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Parallax Golden Conqueror Emblem */}
          <div className="lg:col-span-5 flex justify-center relative">
            
            {/* Outer Aura and Glow Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Rotating outer dash ring */}
              <div className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border border-dashed border-gold-500/20 animate-spin-slow" />
              {/* Counter-rotating inner ring */}
              <div className="w-[290px] h-[290px] sm:w-[360px] sm:h-[360px] rounded-full border border-gold-500/25 animate-spin-reverse-slow" />
              {/* Ambient Radial Golden Flare */}
              <div className="w-[240px] h-[240px] bg-amber-500/20 rounded-full blur-3xl animate-pulse-glow" />
            </div>

            {/* 3D Interactive Card Container */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                setMousePosition({ x: 0, y: 0 });
              }}
              style={{
                transform: isHovered
                  ? `perspective(1000px) rotateY(${mousePosition.x * 24}deg) rotateX(${-mousePosition.y * 24}deg) scale3d(1.04, 1.04, 1.04)`
                  : 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)',
                transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s ease-out',
              }}
              className="relative z-10 w-[300px] sm:w-[380px] rounded-3xl p-3 bg-gradient-to-b from-[#161D27] via-[#0C1017] to-[#06080C] border border-gold-500/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.25)] group cursor-pointer"
            >
              {/* Top Banner Tag */}
              <div className="flex items-center justify-between px-3 py-1.5 mb-2 border-b border-gold-600/20 text-xs font-rajdhani font-bold text-gray-300">
                <span className="flex items-center gap-1.5 text-gold-400">
                  <Shield className="w-3.5 h-3.5 fill-gold-500/30" />
                  RANK #1 CONQUEROR
                </span>
                <span className="text-gray-400 font-mono">SEASON VETERAN</span>
              </div>

              {/* Main Golden Emblem Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black/80 flex items-center justify-center border border-gold-500/30 shadow-inner">
                <img
                  src="/assets/conqueror_badge.jpg"
                  alt="Golden Conqueror PUBG Emblem"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Shiny Sheen overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Floating Emblem Tag */}
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/80 border border-gold-500/40 backdrop-blur-md text-[10px] font-orbitron font-bold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>TIER-1 EMBLEM</span>
                </div>
              </div>

              {/* Emblem Footer Details */}
              <div className="mt-3 p-3 rounded-xl bg-black/50 border border-gray-800/80 flex items-center justify-between">
                <div>
                  <h4 className="font-orbitron font-bold text-sm text-gold-bright">
                    HALL OF GLORY
                  </h4>
                  <p className="font-rajdhani text-xs text-gray-400">
                    Highest Kill Record: <span className="text-amber-400 font-bold">34 Kills / Match</span>
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded bg-gold-500/10 border border-gold-500/30 text-amber-300 text-xs font-rajdhani font-bold">
                  ASIA TOP 100
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Scroll Down Hint */}
      <a
        href="#stats"
        onClick={() => soundFx.playClick()}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-500 hover:text-gold-400 transition-colors z-10"
      >
        <span className="text-[10px] font-rajdhani font-bold uppercase tracking-widest mb-1">
          Explore Records
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce text-amber-400" />
      </a>
    </section>
  );
};