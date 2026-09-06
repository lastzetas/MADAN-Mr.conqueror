import React from 'react';
import { Shield, ChevronUp, Swords, Heart, Trophy, Radio, MessageSquare, Play, Flame } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const Footer = () => {
  const scrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#040507] border-t border-gold-600/20 pt-16 pb-12 overflow-hidden">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-gray-900">
          
          {/* Col 1: Brand & Legacy */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-gold-500/40 bg-[#0C1017]">
                <img
                  src="/assets/conqueror_badge.jpg"
                  alt="Madan Conqueror Crest"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-orbitron font-extrabold text-xl tracking-wider text-gold-gradient">
                  MADAN
                </span>
                <span className="font-rajdhani text-xs tracking-widest text-amber-400 font-bold uppercase -mt-1">
                  Mr. Conqueror
                </span>
              </div>
            </div>

            <p className="font-sans text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed">
              The premier battleground for Tamil mobile esports. Leading competitive tournaments, daily high-intensity live streams, and fostering the next generation of esports champions in South India.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {/* YouTube Link */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                title="YouTube Channel"
                className="w-9 h-9 rounded-lg bg-[#111622] border border-gray-800 hover:border-red-500 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Instagram Link */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                title="Instagram Handle"
                className="w-9 h-9 rounded-lg bg-[#111622] border border-gray-800 hover:border-pink-500 flex items-center justify-center text-gray-400 hover:text-pink-400 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Discord Link */}
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                title="Discord Community"
                className="w-9 h-9 rounded-lg bg-[#111622] border border-gray-800 hover:border-[#5865F2] flex items-center justify-center text-gray-400 hover:text-[#5865F2] transition-all"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div className="lg:col-span-3 space-y-3 font-rajdhani">
            <h4 className="font-orbitron font-bold text-xs uppercase tracking-widest text-gold-bright mb-3">
              Portal Sections
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-400">
              <li><a href="#hero" className="hover:text-amber-300 transition-colors">Overview Arena</a></li>
              <li><a href="#stats" className="hover:text-amber-300 transition-colors">Hall of Metrics & Records</a></li>
              <li><a href="#tournaments" className="hover:text-amber-300 transition-colors">Active Tournaments & Cups</a></li>
              <li><a href="#superchat" className="hover:text-amber-300 transition-colors">Wall of Legends (Superchats)</a></li>
              <li><a href="#loadouts" className="hover:text-amber-300 transition-colors">Gyro Sensitivity & Layouts</a></li>
              <li><a href="#testimonials" className="hover:text-amber-300 transition-colors">Community Testimonials</a></li>
              <li><a href="#inquiries" className="hover:text-amber-300 transition-colors">Brand Sponsorship Desk</a></li>
            </ul>
          </div>

          {/* Col 3: Tournament Status & Scrims */}
          <div className="lg:col-span-4 space-y-3 font-rajdhani">
            <h4 className="font-orbitron font-bold text-xs uppercase tracking-widest text-gold-bright mb-3">
              Live Scrims & Customs Desk
            </h4>
            <div className="p-4 rounded-2xl bg-[#090D14] border border-gold-500/20 text-xs text-gray-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tonight’s Grand Scrim:</span>
                <span className="text-amber-400 font-bold font-mono">7:00 PM IST</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Room Credentials Dispatch:</span>
                <span className="text-emerald-400 font-bold font-mono">WhatsApp Whitelist</span>
              </div>
              <div className="pt-2 border-t border-gray-800 text-[11px] text-gray-400">
                Official Anti-Cheat Fair Play Verified.
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-rajdhani text-gray-500">
          <p>
            © {new Date().getFullYear()} MADAN | Mr. Conqueror Esports. Crafted for the Tamil Gaming Community.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-gray-400 hover:text-gold-400 transition-colors cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <div className="w-6 h-6 rounded bg-black/60 border border-gray-800 flex items-center justify-center">
              <ChevronUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};