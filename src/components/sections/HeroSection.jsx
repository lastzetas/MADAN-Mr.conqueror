import React, { useState, useEffect } from 'react';
import { ChevronDown, ExternalLink, Play, Sparkles } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { EmberCanvas } from '../EmberCanvas';

export const HeroSection = ({ onOpenTournamentModal }) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Smooth mouse parallax motion tracking
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full relative min-h-screen flex items-center justify-center overflow-hidden bg-[#090B0E] selection:bg-[#FFDE00]/30 selection:text-[#FFDE00]"
    >
      {/* 1. Full-Bleed Conqueror Background Image with subtle breathing depth */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <img
          src="/assets/conqueror_badge.jpg"
          alt="Madan Mr. Conqueror Background"
          className="w-full h-full object-cover object-center scale-[1.03] transition-transform duration-700 ease-out filter brightness-[0.88] contrast-[1.05]"
          style={{
            transform: `scale(1.03) translate(${mouseOffset.x * -12}px, ${mouseOffset.y * -12}px)`
          }}
        />
      </div>

      {/* 2. Floating Ambient Gold Spark Embers Canvas */}
      <EmberCanvas />

      {/* 3. Cinematic Vignette Gradients for Perfect Emblem & Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090B0E] via-black/40 to-black/75 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/25 to-black/85 z-10 pointer-events-none" />

      {/* 4. Official YouTube Channel Badge in Left Corner (Matching Uploaded Image) */}
      <a
        href="https://www.youtube.com/@iammadan"
        target="_blank"
        rel="noreferrer"
        onClick={() => soundFx.playClick()}
        onMouseEnter={() => soundFx.playHover()}
        className="absolute bottom-6 left-4 sm:left-8 z-30 flex items-center gap-3 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-black/80 hover:bg-black/95 border border-red-500/50 hover:border-red-500 backdrop-blur-md shadow-[0_0_28px_rgba(220,38,38,0.45)] transition-all cursor-pointer group transform hover:-translate-y-1 active:translate-y-0"
        title="Visit M A D A N on YouTube"
      >
        {/* YouTube Red Icon Box */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(220,38,38,0.7)] group-hover:scale-110 transition-transform shrink-0">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        
        {/* Channel Details & Live Stats */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-montserrat font-black text-xs sm:text-sm text-white group-hover:text-red-400 transition-colors tracking-wide">
              M A D A N
            </span>
            <ExternalLink className="w-3 h-3 text-red-400 opacity-80 shrink-0" />
          </div>
          
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-gray-300 font-bold mt-0.5">
            <span className="text-red-400">573K subs</span>
            <span className="text-gray-500">•</span>
            <span className="text-[#FFDE00]">93.2M+ views</span>
          </div>
        </div>
      </a>

      {/* 5. Centered Main Hero Section with 3D Parallax & Floating Motion */}
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-8 max-w-4xl mx-auto py-16 transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1000px) rotateY(${mouseOffset.x * 6}deg) rotateX(${-mouseOffset.y * 6}deg) translateZ(10px)`
        }}
      >
        {/* Radiant Pulsing Golden Light Ring behind title */}
        <div className="absolute w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] rounded-full bg-radial from-[#FFDE00]/25 via-[#FFD700]/5 to-transparent blur-3xl pointer-events-none animate-hero-glow -z-10" />

        {/* Top Gold Conqueror Crest Card Badge (Floating) */}
        <div className="animate-float-smooth mb-4 sm:mb-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-[#FFDE00] p-1 bg-black/90 shadow-[0_0_30px_rgba(255,222,0,0.55)] backdrop-blur-md hover:scale-110 transition-transform cursor-pointer">
            <img
              src="/assets/conqueror_badge.jpg"
              alt="Emblem Icon"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Giant Main Display Title: MADAN (Vibrant Yellow-Gold from Uploaded Image) */}
        <h1 className="font-montserrat font-black text-6xl sm:text-8xl md:text-9xl text-[#FFDE00] tracking-tight uppercase leading-none drop-shadow-[0_12px_45px_rgba(0,0,0,0.95)] select-none">
          MADAN
        </h1>

        {/* Tagline / Subtitle: MR. CONQUEROR (Centered Crisp White) */}
        <h2 className="font-montserrat font-black text-base sm:text-2xl md:text-3xl text-white tracking-[0.35em] uppercase mt-2 sm:mt-3 mb-8 sm:mb-10 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] select-none">
          MR. CONQUEROR
        </h2>

        {/* Golden Pill JOIN NOW Button */}
        <div>
          <button
            onClick={() => {
              soundFx.playModalOpen();
              onOpenTournamentModal?.();
            }}
            onMouseEnter={() => soundFx.playHover()}
            className="px-12 py-3.5 sm:px-14 sm:py-4 rounded-xl sm:rounded-2xl bg-[#FFDE00] hover:bg-[#FFE84D] text-[#090B0E] font-montserrat font-black text-sm sm:text-base uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_35px_rgba(255,222,0,0.6)] hover:shadow-[0_0_55px_rgba(255,222,0,0.9)] hover:scale-105 active:scale-95 flex items-center justify-center transform"
          >
            JOIN NOW
          </button>
        </div>

      </div>

      {/* 6. Bottom Right Watermark: BATTLEGROUNDS MOBILE INDIA */}
      <div className="absolute bottom-6 right-4 sm:right-8 z-30 text-[10px] sm:text-xs font-montserrat font-black tracking-widest text-[#CBD5E1] bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-[#2B3448] shadow-lg">
        BATTLEGROUNDS MOBILE INDIA
      </div>

      {/* 7. Bottom Center Scroll Down Indicator: EXPLORE ARENA */}
      <a
        href="#records"
        onClick={() => soundFx.playClick()}
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex-col items-center text-[#788294] hover:text-[#FFDE00] transition-colors cursor-pointer group"
      >
        <span className="text-[10px] font-montserrat font-bold tracking-widest uppercase mb-1 group-hover:tracking-[0.2em] transition-all">
          EXPLORE ARENA
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#FFDE00]" />
      </a>

    </section>
  );
};

export default HeroSection;