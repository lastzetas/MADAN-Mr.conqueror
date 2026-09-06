import React from 'react';
import { ChevronDown, ExternalLink, Users, PlaySquare, TrendingUp } from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const HeroSection = ({ onOpenTournamentModal }) => {
  return (
    <section id="hero" className="w-full relative min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Full-bleed Uploaded Golden Conqueror Background Image covering entire screen */}
      <img
        src="/assets/conqueror_badge.jpg"
        alt="Madan Mr. Conqueror Full Screen Background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 filter brightness-[0.85]"
      />

      {/* Cinematic Vignette Overlays for Maximum Title Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#090B0E] via-black/40 to-black/70 z-10" />
      <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/80 z-10 pointer-events-none" />

      {/* Official YouTube Channel Badge in Left Corner with Real Channel Stats */}
      <a
        href="https://www.youtube.com/@iammadan"
        target="_blank"
        rel="noreferrer"
        onClick={() => soundFx.playClick()}
        onMouseEnter={() => soundFx.playHover()}
        className="absolute bottom-6 left-6 sm:left-10 z-20 flex items-center gap-3.5 p-3 sm:px-4 sm:py-3 rounded-xl bg-black/85 hover:bg-black/95 border border-red-500/50 hover:border-red-500 backdrop-blur-md shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all cursor-pointer group transform hover:-translate-y-0.5 active:translate-y-0 max-w-[280px] sm:max-w-xs"
      >
        {/* YouTube Red Icon Box */}
        <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(220,38,38,0.7)] group-hover:scale-110 transition-transform shrink-0">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        
        {/* Channel Details & Live Stats */}
        <div className="flex flex-col text-left truncate">
          <div className="flex items-center gap-1.5">
            <span className="font-montserrat font-black text-xs sm:text-sm text-white group-hover:text-red-400 transition-colors truncate">
              M A D A N
            </span>
            <ExternalLink className="w-3 h-3 text-red-400 opacity-80 shrink-0" />
          </div>
          
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-rajdhani text-gray-300 font-bold mt-0.5">
            <span className="text-red-400">513K subs</span>
            <span>•</span>
            <span className="text-[#E5C05B]">93.2M+ views</span>
          </div>
        </div>
      </a>

      {/* Centered Main Title, Subtitle, and CTA Button */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-8 max-w-4xl mx-auto py-16">
        
        {/* Top Golden Emblem Icon Badge */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-[#E5C05B] p-0.5 bg-black/80 mb-5 shadow-[0_0_30px_rgba(229,192,91,0.5)] backdrop-blur-md">
          <img
            src="/assets/conqueror_badge.jpg"
            alt="Emblem Icon"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* Giant Main Display Title: MADAN (Centered) */}
        <h1 className="font-montserrat font-black text-5xl sm:text-7xl lg:text-8xl text-gold-bright tracking-wider uppercase leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]">
          MADAN
        </h1>

        {/* Tagline / Subtitle: MR. CONQUEROR (Centered) */}
        <h2 className="font-montserrat font-extrabold text-base sm:text-2xl lg:text-3xl text-[#F1F5F9] tracking-[0.3em] uppercase mt-3 mb-10 drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]">
          MR. CONQUEROR
        </h2>

        {/* Center Join Now Button */}
        <div>
          <button
            onClick={() => {
              soundFx.playModalOpen();
              onOpenTournamentModal?.();
            }}
            onMouseEnter={() => soundFx.playHover()}
            className="px-12 py-4 rounded-xl bg-[#E5C05B] hover:bg-[#F3CF7A] text-[#0A0D12] font-montserrat font-black text-sm sm:text-base uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_35px_rgba(229,192,91,0.6)] hover:shadow-[0_0_50px_rgba(255,215,0,0.9)] transform hover:-translate-y-1 active:translate-y-0"
          >
            JOIN NOW
          </button>
        </div>

      </div>

      {/* Bottom Right Watermark */}
      <div className="absolute bottom-6 right-6 sm:right-10 z-20 text-[10px] sm:text-xs font-montserrat font-black tracking-widest text-[#CBD5E1] bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#2B3448]">
        BATTLEGROUNDS MOBILE INDIA
      </div>

      {/* Scroll Down Indicator */}
      <a
        href="#records"
        onClick={() => soundFx.playClick()}
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex-col items-center text-[#788294] hover:text-[#E5C05B] transition-colors cursor-pointer"
      >
        <span className="text-[10px] font-montserrat font-bold tracking-widest uppercase mb-1">
          EXPLORE ARENA
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#E5C05B]" />
      </a>

    </section>
  );
};