import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const TournamentsSection = ({ onOpenTournamentModal }) => {
  const [activeTab, setActiveTab] = useState('ACTIVE');

  return (
    <div id="tournaments" className="rounded-xl p-5 bg-[#0C0F15] border border-[#1E2433] mb-5">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-montserrat font-extrabold text-sm sm:text-base text-white uppercase tracking-wider">
          TOURNAMENTS
        </h3>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => soundFx.playClick()}
            className="w-6 h-6 rounded bg-[#131722] border border-[#222A3A] flex items-center justify-center text-[#788294] hover:text-[#E5C05B] cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => soundFx.playClick()}
            className="w-6 h-6 rounded bg-[#131722] border border-[#222A3A] flex items-center justify-center text-[#788294] hover:text-[#E5C05B] cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#1A202C] mb-4">
        <button
          onClick={() => {
            soundFx.playClick();
            setActiveTab('ACTIVE');
          }}
          className={`pb-2 text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'ACTIVE'
              ? 'text-[#E5C05B] border-b-2 border-[#E5C05B]'
              : 'text-[#64748B] hover:text-[#CBD5E1]'
          }`}
        >
          ACTIVE
        </button>
        <button
          onClick={() => {
            soundFx.playClick();
            setActiveTab('HISTORIC');
          }}
          className={`pb-2 text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'HISTORIC'
              ? 'text-[#E5C05B] border-b-2 border-[#E5C05B]'
              : 'text-[#64748B] hover:text-[#CBD5E1]'
          }`}
        >
          HISTORIC
        </button>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        
        {/* Left Sub-column: Tournament Cards */}
        <div className="md:col-span-7 space-y-3">
          
          {/* Card 1: Active Tournament */}
          <div className="p-3.5 rounded-lg bg-[#11151E] border border-[#1E2536] flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#E5C05B]/40 p-0.5 bg-black/60 flex items-center justify-center shrink-0">
                <img src="/assets/conqueror_badge.jpg" alt="Crest" className="w-full h-full object-cover rounded" />
              </div>
              <div>
                <h4 className="font-montserrat font-bold text-xs sm:text-sm text-white">
                  Active Esports Upcoming Tournament
                </h4>
                <p className="font-rajdhani text-[11px] text-[#788294] font-medium">
                  Active 16 — June 19, 2026
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playModalOpen();
                onOpenTournamentModal?.();
              }}
              onMouseEnter={() => soundFx.playHover()}
              className="w-full py-2 rounded-md bg-[#E5C05B] hover:bg-[#F3CF7A] text-[#0A0D12] font-montserrat font-extrabold text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_12px_rgba(229,192,91,0.25)]"
            >
              REGISTER FOR UPCOMING TOURNAMENTS
            </button>
          </div>

          {/* Card 2: Historic Tournament */}
          <div className="p-3.5 rounded-lg bg-[#11151E] border border-[#1E2536] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#E5C05B]/30 p-0.5 bg-black/40 flex items-center justify-center shrink-0">
                <img src="/assets/conqueror_badge.jpg" alt="Crest" className="w-full h-full object-cover rounded" />
              </div>
              <div>
                <h4 className="font-montserrat font-bold text-xs text-[#E2E8F0]">
                  Historic Esport Upcoming Tournament
                </h4>
                <p className="font-rajdhani text-[11px] text-[#788294]">
                  Active 16 — June 17, 2026 • Erangel Bot Squad War
                </p>
              </div>
            </div>
            <span className="text-[9px] font-montserrat font-bold text-[#E5C05B] px-2 py-0.5 rounded bg-black/40 border border-[#2B3448]">
              BOTSQUADWAR
            </span>
          </div>

        </div>

        {/* Right Sub-column: Crest Image + Live Countdown Box */}
        <div className="md:col-span-5 grid grid-cols-1 gap-3">
          
          {/* Golden Badge Box */}
          <div className="rounded-lg overflow-hidden bg-[#11151E] border border-[#1E2536] aspect-[16/7] flex items-center justify-center relative">
            <img
              src="/assets/conqueror_badge.jpg"
              alt="Conqueror Badge"
              className="w-full h-full object-cover opacity-90"
            />
          </div>

          {/* ONLY 25 SLOTS FOR SQUAD LIMITED Box */}
          <div className="p-3.5 rounded-lg bg-[#11151E] border border-[#1E2536] text-center flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#E5C05B]/50 transition-all shadow-md">
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#E5C05B] to-transparent" />

            <div className="inline-flex items-center gap-1.5 text-[9px] font-montserrat font-bold text-[#E5C05B] uppercase tracking-widest mb-1 bg-[#E5C05B]/10 px-2 py-0.5 rounded-full border border-[#E5C05B]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5C05B] animate-ping" />
              <span>• LIMITED REGISTRATION</span>
            </div>

            <div className="font-montserrat font-black text-xl sm:text-2xl text-white tracking-tight uppercase">
              ONLY <span className="text-[#E5C05B]">25</span> SLOTS
            </div>

            <div className="text-xs font-montserrat font-extrabold text-[#E2E8F0] tracking-wider uppercase mt-0.5">
              FOR SQUAD LIMITED
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[9px] font-rajdhani text-[#788294] font-bold uppercase mt-1.5 pt-1.5 border-t border-[#1E2536] w-full">
              <span className="text-emerald-400 font-mono">● SLOTS 01 – 25</span>
              <span>•</span>
              <span>FIRST COME FIRST SERVED</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};