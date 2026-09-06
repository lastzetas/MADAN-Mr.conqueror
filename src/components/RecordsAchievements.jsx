import React from 'react';
import { Trophy, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const RecordsAchievements = () => {
  const statCards = [
    { value: '397', label: 'Dominations', icon: Trophy },
    { value: '178', label: 'Trophies', icon: Trophy },
    { value: '3.47%+', label: 'Conquerory', icon: Trophy },
  ];

  const timelineNodes = [
    { value: '525', date: 'Jan 2022', hasTrophy: false },
    { value: '706', date: 'Jan 2022', hasTrophy: false },
    { value: '970', date: 'Jan 2022', hasTrophy: false },
    { value: '789', date: '190', hasTrophy: true },
    { value: '792', date: '106', hasTrophy: true },
    { value: '893', date: '930', hasTrophy: true },
    { value: 'Hero', date: 'May 2021', hasTrophy: false },
  ];

  return (
    <div id="achievements" className="rounded-xl p-5 bg-[#0C0F15] border border-[#1E2433] mb-5">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-montserrat font-extrabold text-sm sm:text-base text-white uppercase tracking-wider">
            RECORDS & ACHIEVEMENTS
          </h3>
          <p className="font-rajdhani text-[11px] text-[#788294] font-medium">
            Dynamic Stats and Houric Stats
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

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {statCards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onMouseEnter={() => soundFx.playHover()}
              className="p-3 sm:p-4 rounded-lg bg-[#11151E] border border-[#1E2536] flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-[#E5C05B]/10 border border-[#E5C05B]/30 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#E5C05B]" />
              </div>
              <div>
                <div className="font-montserrat font-black text-base sm:text-lg text-white">
                  {item.value}
                </div>
                <div className="font-rajdhani text-[11px] text-[#788294] font-semibold uppercase">
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conqueror's Timeline */}
      <div className="pt-1">
        <h4 className="font-montserrat font-bold text-xs text-[#EAECEF] uppercase">
          Conqueror's Timeline
        </h4>
        <p className="font-rajdhani text-[11px] text-[#788294] mb-5">
          Conquerors meets Conquerer's Timeline
        </p>

        {/* Timeline Horizontal Line & Nodes */}
        <div className="relative pt-6 pb-2 px-2">
          {/* Gold Horizontal Track Line */}
          <div className="absolute top-[38px] left-5 right-5 h-[2px] bg-gradient-to-r from-[#B8860B] via-[#E5C05B] to-[#B8860B] z-0" />

          {/* 7 Nodes */}
          <div className="grid grid-cols-7 gap-1 text-center relative z-10">
            {timelineNodes.map((node, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {/* Gold Trophy above node if applicable */}
                <div className="h-5 flex items-center justify-center mb-1">
                  {node.hasTrophy && (
                    <Trophy className="w-3.5 h-3.5 text-[#E5C05B] fill-[#E5C05B]" />
                  )}
                </div>

                {/* Node Point dot */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#E5C05B] border-2 border-[#0C0F15] shadow-[0_0_6px_rgba(229,192,91,0.8)]" />

                {/* Node Value & Date */}
                <span className="font-mono text-[11px] font-bold text-[#EAECEF] mt-2">
                  {node.value}
                </span>
                <span className="font-rajdhani text-[10px] text-[#788294] font-semibold">
                  {node.date}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};