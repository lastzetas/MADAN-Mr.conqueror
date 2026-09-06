import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { soundFx } from '../../utils/audio';

export const ReviewsSection = () => {
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  const reviews = [
    {
      id: 1,
      rating: 5,
      title: 'Competitive Integrity',
      text: 'True live esports free principle quality brand transparent! Best scrim environment in South India with zero latency custom rooms.',
      author: 'Karthik S. (Clan Captain)',
      role: 'Semi-Pro BGMI Athlete'
    },
    {
      id: 2,
      rating: 5,
      title: 'Prizepool Payout',
      text: 'The best competitive organizer in South India, verified payout within 24 hours of grand finals. Unmatched tournament management.',
      author: 'Team Viper Esports',
      role: 'Season 6 Finalist Squad'
    },
    {
      id: 3,
      rating: 5,
      title: 'Pro Settings & Anti-Cheat',
      text: 'Pro sensitivity and fair room anti-cheat makes this the #1 arena for serious mobile gaming athletes looking to go pro.',
      author: 'Dravid "SniperGod" K.',
      role: 'Esports Caster & Pro Player'
    },
  ];

  return (
    <section id="reviews" className="w-full mb-8">
      <div className="rounded-xl p-6 sm:p-7 bg-[#0C0F15] border border-[#1E2433]">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-white uppercase tracking-wider">
              CURATED REVIEWS
            </h3>
            <p className="font-rajdhani text-xs text-[#788294] font-medium">
              Verified Athlete Testimonials & Community Feedback
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveReviewIdx((idx) => (idx === 0 ? reviews.length - 1 : idx - 1));
              }}
              className="w-7 h-7 rounded bg-[#131722] border border-[#222A3A] flex items-center justify-center text-[#788294] hover:text-[#E5C05B] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveReviewIdx((idx) => (idx === reviews.length - 1 ? 0 : idx + 1));
              }}
              className="w-7 h-7 rounded bg-[#131722] border border-[#222A3A] flex items-center justify-center text-[#788294] hover:text-[#E5C05B] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((r, i) => (
            <div
              key={r.id}
              onMouseEnter={() => soundFx.playHover()}
              className={`p-5 rounded-lg bg-[#11151E] border ${
                activeReviewIdx === i ? 'border-[#E5C05B]/60 shadow-[0_0_15px_rgba(229,192,91,0.15)]' : 'border-[#1E2536]'
              } flex flex-col justify-between transition-all`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-[#E5C05B]">
                    {[...Array(r.rating)].map((_, starI) => (
                      <Star key={starI} className="w-3.5 h-3.5 fill-[#E5C05B]" />
                    ))}
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-rajdhani font-bold text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                </div>
                
                <h4 className="font-montserrat font-bold text-xs sm:text-sm text-white mb-2">
                  {r.title}
                </h4>
                
                <p className="font-sans text-xs text-[#94A3B8] leading-relaxed mb-4">
                  "{r.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#1E2536]">
                <span className="font-montserrat font-bold text-xs text-[#EAECEF] block">
                  {r.author}
                </span>
                <span className="font-rajdhani text-[11px] text-[#788294]">
                  {r.role}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Slider Indicator Dots */}
        <div className="flex justify-center gap-1.5 mt-5">
          {[0, 1, 2, 3].map((dotI) => (
            <span
              key={dotI}
              className={`w-1.5 h-1.5 rounded-full ${
                activeReviewIdx === dotI ? 'bg-[#E5C05B]' : 'bg-[#334155]'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};