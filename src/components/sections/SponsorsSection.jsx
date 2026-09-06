import React, { useState, useEffect } from 'react';
import { Shield, ExternalLink, Sparkles, Award, Star, HeartHandshake, ArrowRight } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { getStoredSponsors } from '../../utils/portalData';

export const SponsorsSection = ({ onOpenSponsorModal }) => {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const loadSponsors = () => {
      const all = getStoredSponsors();
      setSponsors(all.filter(s => s.status === 'ACTIVE'));
    };

    loadSponsors();

    const handleUpdate = () => loadSponsors();
    window.addEventListener('portal_sponsors_updated', handleUpdate);
    return () => window.removeEventListener('portal_sponsors_updated', handleUpdate);
  }, []);

  return (
    <section id="sponsors" className="w-full mb-8">
      <div className="rounded-2xl p-6 sm:p-8 bg-[#0C0F15] border border-[#1E2433] relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#E5C05B]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[#1E2536] pb-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E5C05B]/10 border border-[#E5C05B]/30 text-[#E5C05B] text-[10px] font-montserrat font-bold uppercase tracking-wider mb-2">
              <HeartHandshake className="w-3.5 h-3.5 text-[#E5C05B]" />
              <span>OFFICIAL PARTNERS</span>
            </div>
            <h3 className="font-montserrat font-extrabold text-base sm:text-xl text-white uppercase tracking-wider">
              SPONSORS & SUPPORTERS
            </h3>
            <p className="font-rajdhani text-xs text-[#788294] font-medium mt-0.5">
              Empowering High-Stakes Esports & The Madan Conqueror Community
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#E5C05B] bg-[#131722] px-3 py-1 rounded-full border border-[#222A3A]">
              {sponsors.length} Verified Partners
            </span>
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenSponsorModal?.();
              }}
              className="px-3 py-1 rounded-full bg-[#E5C05B]/15 hover:bg-[#E5C05B]/25 border border-[#E5C05B]/40 text-[#E5C05B] text-xs font-montserrat font-bold uppercase transition-all cursor-pointer"
            >
              + Partner With Us
            </button>
          </div>
        </div>

        {/* Sponsors Grid */}
        {sponsors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {sponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.link || '#'}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.playClick()}
                onMouseEnter={() => soundFx.playHover()}
                className="group p-4 rounded-xl bg-[#11151E] border border-[#1E2536] hover:border-[#E5C05B]/60 transition-all flex flex-col justify-between cursor-pointer hover:shadow-[0_0_20px_rgba(229,192,91,0.15)] transform hover:-translate-y-1"
              >
                <div>
                  {/* Logo & Tier Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-montserrat font-bold uppercase tracking-wider ${
                      sponsor.tier === 'TITLE'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : sponsor.tier === 'PLATINUM'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {sponsor.tier || 'OFFICIAL'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#E5C05B] transition-colors" />
                  </div>

                  {/* Sponsor Image / Logo */}
                  <div className="w-full h-24 rounded-lg bg-black/50 border border-[#1E2536] group-hover:border-[#E5C05B]/30 flex items-center justify-center p-3 mb-3 overflow-hidden">
                    {sponsor.logo ? (
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="max-h-full max-w-full object-contain filter group-hover:brightness-110 transition-all"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500 font-montserrat font-bold text-xs">
                        <Award className="w-5 h-5 text-[#E5C05B]" />
                        <span>{sponsor.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Company Name & Category */}
                  <h4 className="font-montserrat font-bold text-sm text-white group-hover:text-[#E5C05B] transition-colors truncate">
                    {sponsor.name}
                  </h4>
                  <p className="text-[11px] font-mono text-[#788294] mt-0.5 truncate">
                    {sponsor.category || 'Official Partner'}
                  </p>
                </div>

                {/* Tagline */}
                {sponsor.tagline && (
                  <div className="mt-3 pt-2 border-t border-[#1E2536] text-[10px] font-rajdhani text-gray-400 italic truncate">
                    "{sponsor.tagline}"
                  </div>
                )}
              </a>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-[#11151E] border border-[#1E2536] text-center space-y-2">
            <HeartHandshake className="w-8 h-8 text-[#E5C05B] mx-auto opacity-80" />
            <h4 className="font-montserrat font-bold text-sm text-white uppercase">
              Official Sponsorship Portal Open
            </h4>
            <p className="text-xs text-[#788294] font-rajdhani max-w-md mx-auto">
              Partner with the Madan Conqueror Arena. Verified sponsor slots are actively being onboarded by Match Ops.
            </p>
          </div>
        )}

        {/* Sponsor Call to Action Banner */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#11151E] via-[#161B26] to-[#11151E] border border-[#1E2536] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E5C05B]/10 border border-[#E5C05B]/30 flex items-center justify-center text-[#E5C05B] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-montserrat font-bold text-xs sm:text-sm text-white uppercase">
                Want to Sponsor the Madan Conqueror Arena?
              </h5>
              <p className="font-rajdhani text-[11px] text-[#788294]">
                Reach 570K+ passionate gamers and mobile esports athletes across India.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onOpenSponsorModal?.();
            }}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#FFD700] via-[#E5C05B] to-[#D4AF37] hover:brightness-110 text-[#0A0D12] font-montserrat font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(229,192,91,0.4)] shrink-0 cursor-pointer transform hover:scale-105"
          >
            Partner With Us
          </button>
        </div>

      </div>
    </section>
  );
};

export default SponsorsSection;
