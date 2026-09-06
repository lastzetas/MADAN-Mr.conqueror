import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Swords, Clock, MapPin, Trophy } from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const TournamentsSection = ({ onOpenTournamentModal }) => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '07',
    minutes: '33',
    seconds: '42'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let sec = parseInt(prev.seconds, 10) - 1;
        let min = parseInt(prev.minutes, 10);
        let hr = parseInt(prev.hours, 10);

        if (sec < 0) {
          sec = 59;
          min -= 1;
        }
        if (min < 0) {
          min = 59;
          hr -= 1;
        }

        return {
          days: '00',
          hours: hr < 10 ? `0${hr}` : `${hr}`,
          minutes: min < 10 ? `0${min}` : `${min}`,
          seconds: sec < 10 ? `0${sec}` : `${sec}`,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="tournaments" className="w-full mb-8">
      <div className="rounded-xl p-6 sm:p-7 bg-[#0C0F15] border border-[#1E2433]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-white uppercase tracking-wider">
              TOURNAMENTS
            </h3>
            <p className="font-rajdhani text-xs text-[#788294] font-medium">
              Competitive Battles & Live Countdown
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

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#1A202C] mb-5">
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

        {/* 2-Column Grid: Left Matches + Right Crest Box & Countdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Tournament Cards */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Card 1: Active Tournament */}
            <div className="p-4 sm:p-5 rounded-lg bg-[#11151E] border border-[#1E2536] flex flex-col justify-between">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E5C05B]/40 p-0.5 bg-black/60 flex items-center justify-center shrink-0">
                  <img src="/assets/conqueror_badge.jpg" alt="Crest" className="w-full h-full object-cover rounded" />
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-sm sm:text-base text-white">
                    Active Esports Upcoming Tournament
                  </h4>
                  <p className="font-rajdhani text-xs text-[#788294] font-medium mt-0.5">
                    Active 16 — June 19, 2026 • ₹2,50,000 Grand Prize Pool
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playModalOpen();
                  onOpenTournamentModal?.();
                }}
                onMouseEnter={() => soundFx.playHover()}
                className="w-full py-2.5 rounded-md bg-[#E5C05B] hover:bg-[#F3CF7A] text-[#0A0D12] font-montserrat font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(229,192,91,0.25)]"
              >
                REGISTER FOR UPCOMING TOURNAMENTS
              </button>
            </div>

            {/* Card 2: Historic / Secondary Tournament */}
            <div className="p-4 rounded-lg bg-[#11151E] border border-[#1E2536] flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#E5C05B]/30 p-0.5 bg-black/40 flex items-center justify-center shrink-0">
                  <img src="/assets/conqueror_badge.jpg" alt="Crest" className="w-full h-full object-cover rounded" />
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-xs sm:text-sm text-[#E2E8F0]">
                    Historic Esport Upcoming Tournament
                  </h4>
                  <p className="font-rajdhani text-xs text-[#788294]">
                    Active 16 — June 17, 2026 • Erangel Custom Scrim
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-montserrat font-bold text-[#E5C05B] px-2.5 py-1 rounded bg-black/40 border border-[#2B3448]">
                SCRIMS
              </span>
            </div>

          </div>

          {/* Right Column: Crest Image & Live Countdown */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            
            {/* Golden Badge Box */}
            <div className="rounded-lg overflow-hidden bg-[#11151E] border border-[#1E2536] aspect-[16/8] flex items-center justify-center relative">
              <img
                src="/assets/conqueror_badge.jpg"
                alt="Conqueror Badge"
                className="w-full h-full object-cover opacity-90"
              />
            </div>

            {/* Live Countdown Box */}
            <div className="p-4 rounded-lg bg-[#11151E] border border-[#1E2536] text-center flex flex-col items-center justify-center">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-montserrat font-bold text-[#EA3838] uppercase tracking-widest mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EA3838] animate-ping" />
                <span>• LIVE</span>
              </div>

              <div className="font-montserrat font-black text-2xl sm:text-3xl text-white tracking-widest font-mono">
                {timeLeft.days} : {timeLeft.hours} : {timeLeft.minutes} : {timeLeft.seconds}
              </div>

              <div className="flex items-center justify-between w-full max-w-[210px] text-[10px] font-rajdhani text-[#64748B] uppercase mt-1 font-bold">
                <span>Days</span>
                <span>Hours</span>
                <span>Mins</span>
                <span>Secs</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};