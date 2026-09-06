import React, { useState } from 'react';
import { Star, ShieldCheck, Quote, CheckCircle2, Trophy, Users, Heart } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const Testimonials = () => {
  const [filter, setFilter] = useState('ALL');

  const reviews = [
    {
      id: 1,
      name: 'Viper_Esports (Captain)',
      role: 'Semi-Pro BGMI Athlete',
      category: 'CAPTAINS',
      rating: 5,
      quote:
        'We participated in Season 5 and Season 6 of the Madan Conqueror Cup. The prize pool payout was instant within 24 hours of the grand finals, and the custom room anti-cheat monitoring was the strictest we have ever experienced in South India tournaments.',
      verified: true,
      achievement: 'Season 5 Runner Up (₹60,000 Prize)'
    },
    {
      id: 2,
      name: 'Dravid "SniperGod" Kumar',
      role: 'Tier-1 Esports Scrim Caster',
      category: 'PROS',
      rating: 5,
      quote:
        'Madan’s game sense and spray discipline on high ping are unmatched. But more than that, what he has done for Tamil gaming creators is historic. He single-handedly built an ecosystem where mobile gamers can dream of making esports a full-time career.',
      verified: true,
      achievement: 'Verified Official Scrim Partner'
    },
    {
      id: 3,
      name: 'Kavitha S.',
      role: 'Community Mod & Regular Viewer',
      category: 'FANS',
      rating: 5,
      quote:
        'Watching Madan Anna’s evening streams after college is a daily ritual for our entire squad. The energy, the Tamil commentary hype, and the relentless clutch gameplay are simply top-tier entertainment!',
      verified: true,
      achievement: '3-Year Channel Member'
    },
    {
      id: 4,
      name: 'Team Tamil Titans',
      role: 'Tournament Finalist Squad',
      category: 'CAPTAINS',
      rating: 5,
      quote:
        'The slot registration system is flawless. No favoritism, no delays, live points table updated right after every Erangel circle shrink. If you want real competitive exposure in Tamil Nadu, this is the only arena that matters.',
      verified: true,
      achievement: '3x Finalist Squad'
    },
    {
      id: 5,
      name: 'Rahul "Ghost" Nathan',
      role: 'Esports Content Creator',
      category: 'PROS',
      rating: 5,
      quote:
        'Collaborating with Madan on the Creator Royale Showdown brought over 150K live viewers to our channels. A true titan who elevates everyone around him.',
      verified: true,
      achievement: 'Creator Showdown Co-Host'
    },
    {
      id: 6,
      name: 'Saravanan M.',
      role: 'Competitive Mobile Player',
      category: 'FANS',
      rating: 5,
      quote:
        'His 4-finger gyro setup transformed my close-range spray. Went from 2.8 K/D to hitting Ace Master and Conqueror within two seasons. True mentor of the battlegrounds.',
      verified: true,
      achievement: 'Ranked Ace Dominator'
    }
  ];

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'ALL') return true;
    if (filter === 'PROS' && r.category === 'PROS') return true;
    if (filter === 'CAPTAINS' && r.category === 'CAPTAINS') return true;
    if (filter === 'FANS' && r.category === 'FANS') return true;
    return true;
  });

  return (
    <section id="testimonials" className="py-20 md:py-28 relative bg-[#05070A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-amber-300 text-xs font-rajdhani font-bold uppercase tracking-widest mb-3">
            <Quote className="w-3.5 h-3.5 text-amber-400" />
            <span>Voices of the Arena & Community Trust</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight">
            TESTIMONIALS & <span className="text-gold-gradient">VERIFIED REVIEWS</span>
          </h2>
          <p className="font-sans text-gray-400 text-sm sm:text-base mt-3">
            Trusted by top competitive squads, esports organizations, fellow creators, and over 1.5 million gaming enthusiasts.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { key: 'ALL', label: 'All Reviews' },
            { key: 'CAPTAINS', label: 'Tournament Captains' },
            { key: 'PROS', label: 'Esports Pros & Casters' },
            { key: 'FANS', label: 'Community Fans' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                soundFx.playClick();
                setFilter(tab.key);
              }}
              onMouseEnter={() => soundFx.playHover()}
              className={`px-4 py-2 rounded-xl text-xs font-orbitron font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filter === tab.key
                  ? 'bg-gold-gradient text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                  : 'bg-[#0B0F17] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredReviews.map((r) => (
            <div
              key={r.id}
              onMouseEnter={() => soundFx.playHover()}
              className="p-6 rounded-3xl bg-gradient-to-b from-[#0F141F] via-[#0A0D15] to-[#06080D] border border-gold-500/20 hover:border-gold-400/80 shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Rating & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  {r.verified && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-rajdhani font-bold">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED
                    </span>
                  )}
                </div>

                {/* Quote text */}
                <p className="font-sans text-xs sm:text-sm text-gray-300 italic leading-relaxed mb-6">
                  "{r.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-gray-800/80">
                <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-gold-bright transition-colors">
                  {r.name}
                </h4>
                <p className="font-rajdhani text-xs text-gray-400 font-semibold">{r.role}</p>
                <span className="text-[10px] font-mono text-amber-400/90 block mt-1">
                  {r.achievement}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Fair-play guarantee banner */}
        <div className="rounded-2xl p-6 bg-gradient-to-r from-amber-950/30 via-[#10141D] to-amber-950/30 border border-gold-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-base text-white uppercase">
                100% Fair Play & Anti-Cheat Protocol
              </h4>
              <p className="font-sans text-xs text-gray-400">
                All tournament custom lobbies are inspected via live spectator spectating, hardware device logs, and instant disqualification for unauthorized third-party apps.
              </p>
            </div>
          </div>
          <div className="shrink-0 px-4 py-2 rounded-xl bg-black/60 border border-gold-500/30 text-amber-300 font-orbitron font-bold text-xs">
            ESPORTS CERTIFIED
          </div>
        </div>

      </div>
    </section>
  );
};