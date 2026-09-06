import React, { useState } from 'react';
import { Shield, CheckCircle2, MessageSquare, Send, Mail, Phone } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { submitContactInquiry } from '../../utils/portalData';

export const ContactSection = () => {
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');
  const [submittedInquiry, setSubmittedInquiry] = useState(false);

  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryMsg) return;
    soundFx.playVictory();
    
    // Transmit inquiry to Admin & Superadmin Portal
    submitContactInquiry({
      name: inquiryName,
      email: inquiryEmail,
      message: inquiryMsg,
      squad: 'Direct Contact Form'
    });

    setSubmittedInquiry(true);
    setTimeout(() => {
      setSubmittedInquiry(false);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryMsg('');
    }, 4000);
  };

  return (
    <section id="contact" className="w-full mb-8">
      <div className="rounded-xl p-6 sm:p-7 bg-[#0C0F15] border border-[#1E2433]">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: CONTACT US (Chat Bubbles) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h3 className="font-montserrat font-extrabold text-base text-white uppercase tracking-wider mb-1">
                CONTACT US
              </h3>
              <p className="font-rajdhani text-xs text-[#788294]">
                Open Communications • All Inquiries, Feedback, Objections & Business Welcome
              </p>
            </div>

            {/* Bright Mint Green Chat Bubble Card */}
            <div className="p-4 rounded-lg bg-[#0E2E25] border border-[#1BE7A3]/50 text-xs font-rajdhani text-[#1BE7A3]">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-full bg-[#1BE7A3] text-black font-bold text-[10px] flex items-center justify-center">
                  🤝
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1BE7A3] block">Encouragement, Feedback & Business</span>
                  <span className="text-[10px] opacity-75 font-mono">Public Liaison & Growth</span>
                </div>
                <span className="text-[10px] opacity-80 ml-auto font-mono bg-[#1BE7A3]/20 px-1.5 py-0.5 rounded uppercase">
                  ALL WELCOME
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#8EECCE] pl-8">
                "Whether you want to share words of encouragement, offer valuable feedback, pitch an exciting business idea, or collaborate on brand sponsorships — any kind of enquiry is heartily welcome!"
              </p>
            </div>

            {/* Dark Gray Chat Bubble Card */}
            <div className="p-4 rounded-lg bg-[#11151E] border border-[#1E2536] text-xs font-rajdhani text-[#94A3B8]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#2B3448] text-[#E5C05B] font-bold text-[10px] flex items-center justify-center">
                    ⚖️
                  </div>
                  <span className="text-[#E5C05B] font-bold text-xs">Objections, Obligations & Grievances</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">DIRECT REVIEW</span>
              </div>
              <p className="text-xs text-[#CBD5E1] pl-7 mb-2 leading-relaxed">
                Have any objections, rule obligations, match disputes, points table clarifications, or administrative concerns? Drop your message and our team will review and resolve it promptly.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#1E2536] text-[10px] pl-7">
                <span className="text-[#64748B]">Transparent Response: Fast & Dedicated</span>
                <span className="text-[#E5C05B] font-bold">100% Addressed</span>
              </div>
            </div>
          </div>

          {/* Right Column: ENQUIRIES Form */}
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-lg bg-[#11151E] border border-[#1E2536] flex flex-col justify-between">
            <div>
              <h3 className="font-montserrat font-extrabold text-base text-white uppercase tracking-wider mb-1">
                ENQUIRIES
              </h3>
              <p className="font-rajdhani text-xs text-[#788294] mb-4">
                Sponsorships, Clan Scrim Licensing, Creator Invites & Official Queries
              </p>

              {submittedInquiry ? (
                <div className="py-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-center text-xs font-rajdhani text-emerald-300 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <span className="font-montserrat font-bold text-sm text-white block">Enquiry Dispatched Successfully!</span>
                  <p className="text-xs text-[#CBD5E1]">Our tournament management desk will respond to {inquiryEmail || 'your contact'} shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-rajdhani font-bold text-[#CBD5E1] uppercase mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Name"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-[#0C0F15] border border-[#1E2536] focus:border-[#E5C05B] text-white font-sans text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-rajdhani font-bold text-[#CBD5E1] uppercase mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Email"
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-[#0C0F15] border border-[#1E2536] focus:border-[#E5C05B] text-white font-sans text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-rajdhani font-bold text-[#CBD5E1] uppercase mb-1">
                      Message / Proposal *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Write your enquiry message or competitive query..."
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-[#0C0F15] border border-[#1E2536] focus:border-[#E5C05B] text-white font-sans text-xs focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-md bg-[#E5C05B] hover:bg-[#F3CF7A] text-[#0A0D12] font-montserrat font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_12px_rgba(229,192,91,0.25)] transition-all"
                  >
                    SUBMIT ENQUIRY
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};