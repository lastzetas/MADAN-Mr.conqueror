import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, CheckCircle2, Shield, Sparkles, ExternalLink, Globe, Briefcase } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: 'Brand Sponsorship & Ad Placement',
    budget: '₹2,00,000 - ₹5,00,000 INR',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const services = [
    'Brand Sponsorship & Ad Placement',
    'Custom Tournament Hosting & Casting',
    'Creator Showmatch & Squad Endorsement',
    'Esports Team Scouting & Management',
    'Media / Press & Event Appearances'
  ];

  const budgets = [
    '₹50,000 - ₹2,00,000 INR',
    '₹2,00,000 - ₹5,00,000 INR',
    '₹5,00,000 - ₹10,00,000 INR',
    '₹10,00,000+ Enterprise Tier'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    soundFx.playVictory();
    setSubmitted(true);
  };

  return (
    <section id="inquiries" className="py-20 md:py-28 relative bg-[#07090D]">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-amber-300 text-xs font-rajdhani font-bold uppercase tracking-widest mb-3">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Business & Brand Partnerships</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight">
            COMMAND <span className="text-gold-gradient">INQUIRIES</span>
          </h2>
          <p className="font-sans text-gray-400 text-sm sm:text-base mt-3">
            Partner with Tamil Nadu’s #1 gaming powerhouse. Scale your brand across 1.5M+ hardcore gaming fans, premier tournament broadcasts, and high-impact influencer marketing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Outreach & Social Media Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#111622] via-[#0D1017] to-[#07090D] border border-gold-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              <h3 className="font-orbitron font-bold text-xl text-white uppercase mb-2">
                Direct Management Desk
              </h3>
              <p className="font-sans text-xs sm:text-sm text-gray-400 mb-6">
                For urgent tournament licensing, major sponsorships, and official press inquiries, connect directly with our esports agency team.
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:partnerships@madanconqueror.com"
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-black/60 border border-gray-800 hover:border-gold-400 transition-all text-xs font-rajdhani font-semibold text-gray-300 hover:text-gold-bright group"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-mono">Official Email</span>
                    <span className="text-sm text-white font-sans">partnerships@madanconqueror.com</span>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-black/60 border border-gray-800 text-xs font-rajdhani font-semibold text-gray-300">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-mono">Business Desk (WhatsApp)</span>
                    <span className="text-sm text-white font-mono">+91 94440 XXXXX (Chennai HQ)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-black/60 border border-gray-800 text-xs font-rajdhani font-semibold text-gray-300">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-mono">Official Agency HQ</span>
                    <span className="text-sm text-white font-sans">Conqueror Esports Arena, Chennai, Tamil Nadu</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Community Channels */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => soundFx.playHover()}
                className="p-4 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/40 hover:bg-[#5865F2]/20 transition-all text-center group cursor-pointer"
              >
                <span className="font-orbitron font-bold text-xs text-[#5865F2] uppercase block mb-1">
                  Official Discord
                </span>
                <span className="text-[11px] font-rajdhani text-gray-300">45,000+ Members</span>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => soundFx.playHover()}
                className="p-4 rounded-2xl bg-red-600/10 border border-red-600/40 hover:bg-red-600/20 transition-all text-center group cursor-pointer"
              >
                <span className="font-orbitron font-bold text-xs text-red-400 uppercase block mb-1">
                  YouTube Channel
                </span>
                <span className="text-[11px] font-rajdhani text-gray-300">1.5M+ Subscribers</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Proposal Form */}
          <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 md:p-10 bg-gradient-to-b from-[#111724] via-[#0D111A] to-[#07090E] border border-gold-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-gold-gradient text-black flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,215,0,0.6)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-orbitron font-extrabold text-2xl text-gold-bright uppercase">
                  Proposal Dispatched!
                </h3>
                <p className="font-sans text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Our business management team will review your requirements for <strong className="text-amber-300">{formData.company || 'your brand'}</strong> and respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-[#151D2C] border border-gray-700 text-gray-300 hover:text-white font-orbitron font-bold text-xs uppercase"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Your Name / Representative *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-800 focus:border-gold-400 text-white font-sans text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Company / Brand / Esports Org *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. RedBull India / Gaming Brand"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-800 focus:border-gold-400 text-white font-sans text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="corporate@brand.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-800 focus:border-gold-400 text-white font-sans text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Contact WhatsApp / Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-800 focus:border-gold-400 text-white font-sans text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Collaboration Scope
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-800 focus:border-gold-400 text-white font-sans text-xs focus:outline-none"
                    >
                      {services.map((s) => (
                        <option key={s} value={s} className="bg-[#0D1118] text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-rajdhani text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Estimated Campaign Budget
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-800 focus:border-gold-400 text-white font-sans text-xs focus:outline-none"
                    >
                      {budgets.map((b) => (
                        <option key={b} value={b} className="bg-[#0D1118] text-white">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-rajdhani text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Campaign Scope / Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly describe your deliverables, campaign goals, target launch timeline, or tournament structure."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-800 focus:border-gold-400 text-white font-sans text-sm focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-black font-orbitron font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 group"
                >
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  <span>Submit Partnership Proposal</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};