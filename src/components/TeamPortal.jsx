import React, { useState, useEffect, useRef } from 'react';
import { Swords, Shield, Radio, Copy, Check, Lock, Users, Upload, Trash2, ArrowLeft, LogOut, CheckCircle2, AlertCircle, Sparkles, MapPin, Clock, Trophy, Eye, EyeOff, Save, Loader2, RefreshCw } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { getStoredRoomBroadcast, updateTeamDetails, getStoredRegistrations } from '../utils/portalData';
import { uploadToCloudinary } from '../utils/cloudinary';
import confetti from 'canvas-confetti';

export const TeamPortal = ({ team: initialTeam, onLogout, onBackToPortal }) => {
  const [team, setTeam] = useState(initialTeam);
  const [broadcast, setBroadcast] = useState(getStoredRoomBroadcast());
  const [copiedField, setCopiedField] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);

  // Editable Form State
  const [teamName, setTeamName] = useState(team?.teamName || team?.name || '');
  const [clanLogo, setClanLogo] = useState(team?.clanLogo || '');
  const [iglName, setIglName] = useState(team?.iglName || team?.captainName || '');
  const [iglPhone, setIglPhone] = useState(team?.iglPhone || team?.captainPhone || '');
  const [players, setPlayers] = useState(team?.players || [
    { name: team?.iglName || 'Player 1', id: team?.igids?.split(',')[0]?.trim() || '', role: 'Leader' }
  ]);

  // Listen to live updates
  useEffect(() => {
    const handleBroadcastUpdate = (e) => {
      if (e.detail) setBroadcast(e.detail);
    };

    const handleTeamUpdate = () => {
      const all = getStoredRegistrations();
      const updated = all.find(t => t.id === team?.id || t.ticketId === team?.ticketId);
      if (updated) {
        setTeam(updated);
        setTeamName(updated.teamName || updated.name || '');
        setClanLogo(updated.clanLogo || '');
        setPlayers(updated.players || []);
      }
    };

    window.addEventListener('portal_room_broadcast_updated', handleBroadcastUpdate);
    window.addEventListener('portal_registrations_updated', handleTeamUpdate);

    return () => {
      window.removeEventListener('portal_room_broadcast_updated', handleBroadcastUpdate);
      window.removeEventListener('portal_registrations_updated', handleTeamUpdate);
    };
  }, [team]);

  const handleCopy = (text, field) => {
    soundFx.playClick();
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2500);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    soundFx.playClick();

    // Local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setClanLogo(event.target.result);
    };
    reader.readAsDataURL(file);

    try {
      const uploadRes = await uploadToCloudinary(file, { folder: 'madan_clan_logos' });
      if (uploadRes.success && uploadRes.secure_url) {
        setClanLogo(uploadRes.secure_url);
      }
    } catch (err) {
      console.warn('Upload error:', err);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handlePlayerChange = (index, field, value) => {
    const updated = [...players];
    if (field === 'id') {
      // Numeric only for IGID
      value = value.replace(/\D/g, '');
    }
    updated[index] = { ...updated[index], [field]: value };
    setPlayers(updated);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setIsSaving(true);
    soundFx.playClick();

    const igidList = players.map(p => p.id).filter(Boolean).join(', ');

    const updated = updateTeamDetails(team.id, {
      teamName,
      name: teamName,
      clanLogo,
      iglName,
      iglPhone,
      players,
      igids: igidList
    });

    setIsSaving(false);
    setSaveSuccess(true);
    soundFx.playVictory();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-[#E2E8F0] font-sans">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0C0F16]/90 backdrop-blur-md border-b border-[#1E2536] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#E5C05B]/40 bg-black/60 p-0.5 flex items-center justify-center">
              <img src={clanLogo || '/assets/conqueror_badge.jpg'} alt="Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-montserrat font-extrabold text-sm sm:text-base text-white truncate max-w-[200px] sm:max-w-xs">
                  {teamName || team?.teamName || 'Player Team'}
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 font-bold uppercase">
                  {team?.matchType || 'SQUAD'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E5C05B]/10 border border-[#E5C05B]/30 text-[#E5C05B] font-bold">
                  {team?.slot || 'SLOT-01'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#788294]">
                Ticket ID: {team?.ticketId || 'MC-000000'} • Status: <strong className="text-emerald-400">{team?.status || 'VERIFIED'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                onBackToPortal?.();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#131722] hover:bg-[#1C2333] border border-[#222A3A] text-[#CBD5E1] text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
              <span>Portal</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onLogout?.();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#131722] hover:bg-rose-950/40 border border-[#222A3A] hover:border-rose-500/40 text-[#CBD5E1] hover:text-rose-400 text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Save Notification */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Team roster & profile successfully updated and synchronized to MongoDB!</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">SAVED</span>
          </div>
        )}

        {/* 1. ROOM MATCH DISPATCHER HERO (HIGHEST PRIORITY) */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#121824] via-[#0D121B] to-[#0A0D14] border-2 border-teal-500/40 relative overflow-hidden shadow-[0_0_35px_rgba(45,212,191,0.12)]">
          {/* Top glowing accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-[#E5C05B] to-teal-400" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 font-mono text-xs font-bold uppercase">
                  <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                  <span>OFFICIAL ROOM DISPATCHER</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold uppercase">
                  ACTIVE LIVE
                </span>
              </div>

              <h2 className="font-montserrat font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                MATCH ROOM CREDENTIALS
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] font-rajdhani">
                Broadcasted directly by Match Ops Desk for your assigned slot: <strong className="text-teal-400 font-mono">{team?.slot}</strong>. Anti-cheat character ID matching is enforced upon room entry.
              </p>

              {broadcast?.broadcastNotice && (
                <div className="p-3 rounded-xl bg-black/40 border border-[#1E2536] text-xs text-[#E5C05B] font-mono">
                  📢 <strong>Admin Announcement:</strong> {broadcast.broadcastNotice}
                </div>
              )}
            </div>

            {/* Room Credentials Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:w-96 shrink-0">
              
              {/* Room ID Box */}
              <div className="p-4 rounded-2xl bg-[#090C12] border border-[#1E2536] hover:border-teal-500/50 transition-all flex flex-col justify-between">
                <span className="text-[10px] font-mono text-[#788294] uppercase font-bold block mb-1">
                  Custom Room ID:
                </span>
                <span className="font-montserrat font-black text-2xl text-white tracking-widest font-mono">
                  {broadcast?.roomId || '9482103'}
                </span>
                <button
                  onClick={() => handleCopy(broadcast?.roomId || '9482103', 'roomId')}
                  className="mt-3 w-full py-1.5 rounded-xl bg-[#131722] hover:bg-teal-500/20 border border-[#222A3A] hover:border-teal-500/40 text-xs font-mono font-bold text-teal-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  {copiedField === 'roomId' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'roomId' ? 'Copied Room ID!' : 'Copy Room ID'}</span>
                </button>
              </div>

              {/* Room Password Box */}
              <div className="p-4 rounded-2xl bg-[#090C12] border border-[#1E2536] hover:border-teal-500/50 transition-all flex flex-col justify-between">
                <span className="text-[10px] font-mono text-[#788294] uppercase font-bold block mb-1">
                  Room Password:
                </span>
                <span className="font-montserrat font-black text-xl text-amber-300 tracking-wider font-mono truncate">
                  {broadcast?.password || 'CONQUEROR2026'}
                </span>
                <button
                  onClick={() => handleCopy(broadcast?.password || 'CONQUEROR2026', 'password')}
                  className="mt-3 w-full py-1.5 rounded-xl bg-[#131722] hover:bg-amber-500/20 border border-[#222A3A] hover:border-amber-500/40 text-xs font-mono font-bold text-amber-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  {copiedField === 'password' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'password' ? 'Copied Password!' : 'Copy Password'}</span>
                </button>
              </div>

            </div>

          </div>

          {/* Match Parameters Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#1E2536] text-xs font-mono">
            <div>
              <span className="text-[#64748B] block text-[10px] uppercase font-bold">Map Target:</span>
              <strong className="text-white">{broadcast?.map || 'Erangel (Day)'}</strong>
            </div>
            <div>
              <span className="text-[#64748B] block text-[10px] uppercase font-bold">Match Time:</span>
              <strong className="text-white">{broadcast?.matchTime || 'Tonight @ 09:00 PM'}</strong>
            </div>
            <div>
              <span className="text-[#64748B] block text-[10px] uppercase font-bold">Lobby Mode:</span>
              <strong className="text-white">{broadcast?.mode || 'TPP Squad War'}</strong>
            </div>
            <div>
              <span className="text-[#64748B] block text-[10px] uppercase font-bold">Your Match Passcode:</span>
              <strong className="text-teal-400">{team?.passcode || '778899'}</strong>
            </div>
          </div>
        </div>

        {/* 2. TWO-COLUMN GRID: TEAM PROFILE & ROSTER MANAGER */}
        <form onSubmit={handleSaveChanges} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Team Profile & Logo (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Profile Card */}
            <div className="rounded-3xl p-6 bg-[#0C0F16] border border-[#1E2536] space-y-4">
              <h3 className="font-montserrat font-bold text-base text-white uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#E5C05B]" />
                <span>Team Profile & Clan Logo</span>
              </h3>

              {/* Clan Logo Upload Area */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Clan Logo / Avatar
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                {isUploadingLogo ? (
                  <div className="flex items-center justify-center gap-2.5 p-6 rounded-2xl bg-black/50 border border-teal-500/50 text-teal-300 text-xs font-mono">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Uploading to Cloudinary CDN...</span>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-5 rounded-2xl bg-black/40 border border-dashed border-[#222A3A] hover:border-[#E5C05B]/60 transition-all cursor-pointer group text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#E5C05B]/50 bg-slate-900 p-1 mb-2">
                      <img src={clanLogo || '/assets/conqueror_badge.jpg'} alt="Team Logo" className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <span className="text-xs font-montserrat font-bold text-white group-hover:text-[#E5C05B] transition-colors">
                      Change Clan Logo
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B] mt-0.5">
                      Cloudinary CDN Sync (PNG/JPG up to 10MB)
                    </span>
                  </div>
                )}
              </div>

              {/* Team Name Input */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  Team / Squad Name
                </label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#11151E] border border-[#1E2536] focus:border-teal-500 text-white text-xs font-sans focus:outline-none"
                />
              </div>

              {/* IGL Name & Phone */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                    Leader / IGL Name
                  </label>
                  <input
                    type="text"
                    required
                    value={iglName}
                    onChange={(e) => setIglName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#11151E] border border-[#1E2536] focus:border-teal-500 text-white text-xs font-sans focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                    WhatsApp Contact
                  </label>
                  <input
                    type="text"
                    required
                    value={iglPhone}
                    onChange={(e) => setIglPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#11151E] border border-[#1E2536] focus:border-teal-500 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Player Roster & Numeric In-Game IDs (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="rounded-3xl p-6 bg-[#0C0F16] border border-[#1E2536] space-y-4">
              
              <div className="flex items-center justify-between border-b border-[#1E2536] pb-3">
                <div>
                  <h3 className="font-montserrat font-bold text-base text-white uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-400" />
                    <span>Active Players & BGMI In-Game IDs (IGIDs)</span>
                  </h3>
                  <p className="text-xs font-rajdhani text-[#788294]">
                    Only numeric Character IDs are accepted for anti-cheat lobby verification.
                  </p>
                </div>
              </div>

              {/* Players Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {players.map((player, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#11151E] border border-[#1E2536] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-montserrat font-bold text-teal-300">
                        Player {idx + 1} ({player.role || 'Member'})
                      </span>
                      <span className="text-[10px] font-mono text-[#64748B]">
                        #{idx + 1}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">
                        In-Game Nickname:
                      </label>
                      <input
                        type="text"
                        required
                        value={player.name || ''}
                        onChange={(e) => handlePlayerChange(idx, 'name', e.target.value)}
                        placeholder={`Player ${idx + 1} Name`}
                        className="w-full px-3 py-2 rounded-xl bg-[#090C12] border border-[#1E2536] focus:border-teal-500 text-white text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">
                        Character IGID (Numeric):
                      </label>
                      <input
                        type="text"
                        required
                        value={player.id || ''}
                        onChange={(e) => handlePlayerChange(idx, 'id', e.target.value)}
                        placeholder="e.g. 5182940291"
                        className="w-full px-3 py-2 rounded-xl bg-[#090C12] border border-[#1E2536] focus:border-teal-500 text-teal-300 font-mono text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Save Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-montserrat font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Team & Roster Updates</span>
                </button>
              </div>

            </div>

          </div>

        </form>

      </main>

    </div>
  );
};

export default TeamPortal;
