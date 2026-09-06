import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const WinnersGallery = () => {
  const [activeWinner, setActiveWinner] = useState(1);

  const winnersList = [
    {
      id: 0,
      name: 'Cheonnorianam',
      title: 'Ploom/City',
      date: 'March 14, 2026',
      prize: '₹720 INR',
    },
    {
      id: 1,
      name: 'Sarvanth',
      title: 'Qualifying conqueror championchip',
      date: 'March 11, 2026',
      prize: '₹1,200 INR',
    },
    {
      id: 2,
      name: 'Saktishari',
      title: 'Prxotitcs ossanarr with counting boors that vorn',
      date: 'March 08, 2026',
      prize: '₹850 INR',
    },
  ];

  const squadCards = [
    {
      id: 1,
      title: 'Playstronbroan’s Championship',
      img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 2,
      title: 'Playstronbroan’s Championship',
      img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 3,
      title: 'Playstronbroan’s Championship Teams',
      img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 4,
      title: 'Playstronbroan’s Championship',
      img: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 5,
      title: 'Playstronbroan’s Championship Teams',
      img: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
      id: 6,
      title: 'Playstronbroan’s Championship',
      img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5">
      
      {/* Left Card: WINNERS */}
      <div className="md:col-span-4 rounded-xl p-5 bg-[#0C0F15] border border-[#1E2433] flex flex-col justify-between">
        <div>
          <h3 className="font-montserrat font-extrabold text-sm sm:text-base text-white uppercase tracking-wider mb-4">
            WINNERS
          </h3>

          <div className="space-y-2.5">
            {winnersList.map((w) => (
              <div
                key={w.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveWinner(w.id);
                }}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                  activeWinner === w.id
                    ? 'bg-[#262010] border-[#8E752D] text-[#E5C05B]'
                    : 'bg-[#11151E] border-[#1E2536]'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#1E2433] border border-[#2B3448] flex items-center justify-center text-[10px] font-bold text-[#E5C05B]">
                      {w.name[0]}
                    </div>
                    <span className="font-montserrat font-bold text-xs text-white">
                      {w.name}
                    </span>
                  </div>
                  {w.prize && (
                    <span className="font-mono text-xs font-bold text-[#E5C05B]">
                      {w.prize}
                    </span>
                  )}
                </div>
                <p className="font-rajdhani text-[11px] text-[#788294] pl-7 line-clamp-1">
                  {w.title}
                </p>
                {activeWinner === w.id && (
                  <span className="font-mono text-[10px] text-[#64748B] pl-7 block mt-0.5">
                    {w.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => soundFx.playClick()}
          className="mt-4 text-xs font-rajdhani font-bold text-[#788294] hover:text-[#E5C05B] flex items-center gap-1 transition-colors self-start cursor-pointer"
        >
          <span>Show All</span>
          <ChevronRightIcon className="w-3 h-3" />
        </button>
      </div>

      {/* Right Card: TROPHIES & WINNERS (Hall of Fame) */}
      <div className="md:col-span-8 rounded-xl p-5 bg-[#0C0F15] border border-[#1E2433]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-montserrat font-extrabold text-sm sm:text-base text-white uppercase tracking-wider">
              TROPHIES & WINNERS
            </h3>
            <p className="font-rajdhani text-[11px] text-[#788294] font-medium">
              Hall of Fame & Hall of Fame
            </p>
          </div>

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

        {/* 6 Squad Photo Cards Grid */}
        <div className="grid grid-cols-3 gap-3">
          {squadCards.map((card) => (
            <div
              key={card.id}
              className="rounded-lg overflow-hidden bg-[#11151E] border border-[#1E2536] flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/10] bg-gray-900 overflow-hidden">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-2 flex items-center justify-between gap-1 bg-[#0E121A]">
                <span className="font-rajdhani font-semibold text-[10px] text-[#CBD5E1] truncate">
                  {card.title}
                </span>
                <div className="w-4 h-4 rounded-full bg-[#E5C05B]/20 border border-[#E5C05B]/40 flex items-center justify-center text-[9px] text-[#E5C05B] shrink-0">
                  👑
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};