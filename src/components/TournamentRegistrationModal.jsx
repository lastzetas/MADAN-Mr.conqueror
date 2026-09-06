import React, { useState } from 'react';
import { X, Swords, Shield, QrCode, CheckCircle2, Copy, Check, Download, AlertCircle, Sparkles, User, Users, Clock, Send } from 'lucide-react';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';
import { submitTournamentRegistration } from '../utils/portalData';

export const TournamentRegistrationModal = ({ isOpen, onClose, selectedTournament }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    teamName: '',
    clanTag: '',
    captainName: '',
    captainPhone: '',
    captainDiscord: '',
    player1Name: '',
    player1Id: '',
    player2Name: '',
    player2Id: '',
    player3Name: '',
    player3Id: '',
    player4Name: '',
    player4Id: '',
    subName: '',
    subId: '',
  });

  const [slotCode, setSlotCode] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [copiedPass, setCopiedPass] = useState(false);

  if (!isOpen) return null;

  const tournamentTitle = selectedTournament?.title || "MADAN CONQUEROR CUP: SEASON 7 GRAND FINALE";
  const prizePool = selectedTournament?.prizePool || "₹2,50,000 INR";
  const format = selectedTournament?.format || "TPP Squads (Erangel, Miramar, Sanhok)";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.teamName || !formData.captainName || !formData.captainPhone) {
        alert("Please complete the required Team and Captain details.");
        return;
      }
      soundFx.playClick();
      setStep(2);
    } else if (step === 2) {
      if (!formData.player1Id || !formData.player2Id || !formData.player3Id || !formData.player4Id) {
        alert("Please provide In-Game IDs for all 4 starting roster players.");
        return;
      }
      soundFx.playVictory();
      
      // Dispatch registration request directly to Admin & Superadmin Portal
      const result = submitTournamentRegistration({
        ...formData,
        category: tournamentTitle
      });

      setSlotCode(result.slotCode);
      setTicketId(result.ticketId);
      
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2DD4BF', '#14B8A6', '#FFD700', '#FFFFFF']
      });

      setStep(3);
    }
  };

  const handleCopyPass = () => {
    const passDetails = `MADAN CONQUEROR CUP APPLICATION TICKET\nTeam: ${formData.teamName}\nSlot: ${slotCode}\nTicket ID: ${ticketId}\nTournament: ${tournamentTitle}\nCaptain: ${formData.captainName} (${formData.captainPhone})\nStatus: PENDING ADMIN & SUPERADMIN VERIFICATION`;
    navigator.clipboard.writeText(passDetails);
    setCopiedPass(true);
    soundFx.playSuccess();
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const handleReset = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl bg-[#090C12] border border-[#E5C05B]/40 rounded-3xl p-5 sm:p-8 shadow-[0_0_50px_rgba(229,192,91,0.25)] my-6 text-[#E2E8F0]">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            handleReset();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-black/60 border border-gray-800 text-gray-400 hover:text-white hover:border-gold-500/50 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5C05B]/10 border border-[#E5C05B]/30 text-[#E5C05B] text-xs font-montserrat font-bold uppercase mb-2">
            <Swords className="w-3.5 h-3.5 text-[#E5C05B]" />
            <span>Official Esports Registration Portal</span>
          </div>
          <h3 className="font-montserrat font-extrabold text-lg sm:text-2xl text-white uppercase tracking-tight">
            {tournamentTitle}
          </h3>
          <p className="font-mono text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
            <span>Prize Pool: <strong className="text-[#E5C05B]">{prizePool}</strong></span>
            <span>•</span>
            <span>Format: <strong className="text-gray-300">{format}</strong></span>
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1E2536] text-xs font-montserrat font-bold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#E5C05B]' : 'text-gray-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-[#E5C05B] text-black font-black' : 'bg-gray-800'}`}>1</span>
            <span>Squad Info</span>
          </div>
          <div className={`h-[2px] flex-1 mx-3 ${step >= 2 ? 'bg-[#E5C05B]' : 'bg-gray-800'}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#E5C05B]' : 'text-gray-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-[#E5C05B] text-black font-black' : 'bg-gray-800'}`}>2</span>
            <span>Roster & IGIDs</span>
          </div>
          <div className={`h-[2px] flex-1 mx-3 ${step >= 3 ? 'bg-[#E5C05B]' : 'bg-gray-800'}`} />
          <div className={`flex items-center gap-2 ${step === 3 ? 'text-teal-400' : 'text-gray-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-teal-400 text-black font-black' : 'bg-gray-800'}`}>3</span>
            <span>Application Pass</span>
          </div>
        </div>

        {/* Step 1: Team Information */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Team / Clan Name *
                </label>
                <input
                  type="text"
                  name="teamName"
                  required
                  placeholder="e.g. Tamil Titans Esports"
                  value={formData.teamName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-800 focus:border-[#E5C05B] text-white font-sans text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Clan Tag / Acronym
                </label>
                <input
                  type="text"
                  name="clanTag"
                  placeholder="e.g. [TTN]"
                  value={formData.clanTag}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-800 focus:border-[#E5C05B] text-white font-sans text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Captain In-Game / Full Name *
                </label>
                <input
                  type="text"
                  name="captainName"
                  required
                  placeholder="e.g. Vijay / TTN_Alpha"
                  value={formData.captainName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-800 focus:border-[#E5C05B] text-white font-sans text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                  Captain WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  name="captainPhone"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.captainPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-800 focus:border-[#E5C05B] text-white font-sans text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                Captain Discord Tag (Optional)
              </label>
              <input
                type="text"
                name="captainDiscord"
                placeholder="captain#1234 or discord username"
                value={formData.captainDiscord}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-gray-800 focus:border-[#E5C05B] text-white font-sans text-xs focus:outline-none"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#E5C05B] to-[#8E752D] hover:brightness-110 text-black font-montserrat font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(229,192,91,0.3)] flex items-center justify-center gap-2"
              >
                <span>Proceed to Roster Entry</span>
                <Swords className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Roster & In-Game IDs */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-sans text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Ensure all 4 In-Game IDs (IGIDs) are 100% accurate. Requests are submitted to Admin & Superadmin Desk for anti-cheat verification.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Player 1 (Captain) IGN & IGID *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="player1Name"
                    required
                    placeholder="IGN"
                    value={formData.player1Name}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-lg bg-black/60 border border-gray-800 text-white font-sans text-xs focus:border-[#E5C05B] focus:outline-none"
                  />
                  <input
                    type="text"
                    name="player1Id"
                    required
                    placeholder="IGID (e.g. 51234567)"
                    value={formData.player1Id}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-lg bg-black/60 border border-gray-800 text-white font-mono text-xs focus:border-[#E5C05B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Player 2 IGN & IGID *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="player2Name"
                    required
                    placeholder="IGN"
                    value={formData.player2Name}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-lg bg-black/60 border border-gray-800 text-white font-sans text-xs focus:border-[#E5C05B] focus:outline-none"
                  />
                  <input
                    type="text"
                    name="player2Id"
                    required
                    placeholder="IGID"
                    value={formData.player2Id}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-lg bg-black/60 border border-gray-800 text-white font-mono text-xs focus:border-[#E5C05B] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Player 3 IGN & IGID *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="player3Name"
                    required
                    placeholder="IGN"
                    value={formData.player3Name}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-lg bg-black/60 border border-gray-800 text-white font-sans text-xs focus:border-[#E5C05B] focus:outline-none"
                  />
                  <input
                    type="text"
                    name="player3Id"
                    required
                    placeholder="IGID"
                    value={formData.player3Id}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-lg bg-black/60 border border-gray-800 text-white font-mono text-xs focus:border-[#E5C05B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Player 4 IGN & IGID *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="player4Name"
                    required
                    placeholder="IGN"
                    value={formData.player4Name}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-lg bg-black/60 border border-gray-800 text-white font-sans text-xs focus:border-[#E5C05B] focus:outline-none"
                  />
                  <input
                    type="text"
                    name="player4Id"
                    required
                    placeholder="IGID"
                    value={formData.player4Id}
                    onChange={handleChange}
                    className="px-3 py-2 rounded-lg bg-black/60 border border-gray-800 text-white font-mono text-xs focus:border-[#E5C05B] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
                Substitute Player (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="subName"
                  placeholder="Sub IGN (optional)"
                  value={formData.subName}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-lg bg-black/60 border border-gray-800 text-white font-sans text-xs focus:border-[#E5C05B] focus:outline-none"
                />
                <input
                  type="text"
                  name="subId"
                  placeholder="Sub IGID (optional)"
                  value={formData.subId}
                  onChange={handleChange}
                  className="px-3 py-2 rounded-lg bg-black/60 border border-gray-800 text-white font-mono text-xs focus:border-[#E5C05B] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 font-montserrat font-bold text-xs uppercase hover:bg-gray-800 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#E5C05B] to-[#8E752D] hover:brightness-110 text-black font-montserrat font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_20px_rgba(229,192,91,0.3)] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Application to Admin Desk</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Verified Tournament Pass / Ticket */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            {/* Notification Banner */}
            <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs flex items-center gap-2.5 font-mono">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                <strong>Application Transmitted!</strong> Your request is sent to the <strong>Admin & Super Admin Portal</strong> for slot whitelisting.
              </span>
            </div>

            {/* Pass Card */}
            <div className="relative rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-[#182130] via-[#0E131C] to-[#080B10] border-2 border-[#E5C05B] shadow-[0_0_35px_rgba(229,192,91,0.3)] overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-[#E5C05B]/30 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#E5C05B]">
                    <img src="/assets/conqueror_badge.jpg" alt="Badge" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#E5C05B] block">MADAN ESPORTS PASS</span>
                    <span className="font-mono font-black text-xs sm:text-sm text-white">{ticketId}</span>
                  </div>
                </div>
                <div className="px-3 py-1 rounded bg-[#E5C05B]/20 border border-[#E5C05B]/50 text-[#E5C05B] font-mono font-black text-xs sm:text-sm">
                  {slotCode}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] font-mono uppercase">REGISTERED SQUAD</span>
                  <span className="font-montserrat font-bold text-xs sm:text-sm text-white">{formData.teamName} {formData.clanTag && `[${formData.clanTag}]`}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] font-mono uppercase">CAPTAIN CONTACT</span>
                  <span className="font-mono text-white text-xs">{formData.captainName} ({formData.captainPhone})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0">
                    <QrCode className="w-8 h-8 text-black" />
                  </div>
                  <div className="text-xs">
                    <span className="text-amber-400 font-bold flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5" /> PENDING ADMIN WHITELIST
                    </span>
                    <span className="text-gray-400 text-[10px] block font-mono">
                      Room ID & Pass will be pushed automatically upon verification.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleCopyPass}
                className="w-full sm:w-1/2 py-2.5 rounded-xl bg-[#131923] hover:bg-[#1C2534] border border-[#E5C05B]/30 text-white font-montserrat font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {copiedPass ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Pass Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#E5C05B]" />
                    <span>Copy Pass Text</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  soundFx.playSuccess();
                  alert(`Tournament pass for ${formData.teamName} downloaded successfully! Application sent to Admin Desk.`);
                  onClose();
                }}
                className="w-full sm:w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#E5C05B] to-[#8E752D] hover:brightness-110 text-black font-montserrat font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(229,192,91,0.3)] transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Save Pass Ticket</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TournamentRegistrationModal;