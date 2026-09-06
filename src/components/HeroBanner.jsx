import React from 'react';
import { soundFx } from '../utils/audio';

export const HeroBanner = ({ onOpenTournamentModal }) => {
  return (
    <div className="relative rounded-xl overflow-hidden bg-[#0C0F15] border border-[#1E2433] mb-5">
      
      {/* Background dark gradient & smoke */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-[#0B0E14]/90 to-transparent z-10" />

      <div className="grid grid-cols-1 md:grid-cols-12 items-center relative z-20 min-h-[220px] sm:min-h-[260px]">
        
        {/* Left Column: Typography & Join Now CTA */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-center items-start">
          
          {/* Top Small Golden Emblem */}
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#E5C05B]/60 p-0.5 bg-black/60 mb-3 shadow-[0_0_12px_rgba(229,192,91,0.2)]">
            <img
              src="/assets/conqueror_badge.jpg"
              alt="Emblem"
              className="w-full h-full object-cover rounded"
            />
          </div>

          {/* Main Title: MADAN */}
          <h1 className="font-montserrat font-black text-3xl sm:text-4xl lg:text-4xl text-gold-bright tracking-wider uppercase leading-tight">
            MADAN
          </h1>

          {/* Subtitle: MR. CONQUEROR */}
          <h2 className="font-montserrat font-bold text-xs sm:text-sm text-[#F1F5F9] tracking-widest uppercase mt-1 mb-5">
            MR. CONQUEROR
          </h2>

          {/* Join Now Button */}
          <button
            onClick={() => {
              soundFx.playModalOpen();
              onOpenTournamentModal?.();
            }}
            onMouseEnter={() => soundFx.playHover()}
            className="px-6 py-2 rounded-md bg-[#E5C05B] hover:bg-[#F3CF7A] text-[#0A0D12] font-montserrat font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(229,192,91,0.35)]"
          >
            JOIN NOW
          </button>

        </div>

        {/* Right Column: Hero Conqueror Emblem Image */}
        <div className="md:col-span-6 h-full flex items-center justify-center p-4 relative">
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[16/10] flex items-center justify-center">
            <img
              src="/assets/conqueror_badge.jpg"
              alt="PUBG Conqueror Emblem"
              className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
            />
          </div>

          {/* Watermark Logo bottom right */}
          <div className="absolute bottom-2.5 right-4 text-[9px] font-montserrat font-black tracking-widest text-[#94A3B8] bg-black/70 px-2 py-0.5 rounded border border-[#222938]">
            PLAYERUNKNOWN'S BATTLEGROUNDS
          </div>
        </div>

      </div>

    </div>
  );
};