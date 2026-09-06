import React, { useState } from 'react';
import { X, Crown, Shield, CheckCircle2, Swords, Radio, Send, Users, Trophy, Award, LogOut, Check, AlertCircle, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const SuperAdminPanel = ({ isOpen, onClose, user, onLogout }) => {
  const [adminTab, setAdminTab] = useState('TEAMS');
  const [roomId, setRoomId] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [roomMap, setRoomMap] = useState('Erangel (Battle Royale)');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const [registeredTeams, setRegisteredTeams] = useState([
    { id: 1, name: 'OG-BTS (OG Battle Squad)', captain: 'OG_Viper', phone: '+91 98401 23456', status: 'APPROVED', slot: 'SLOT-01', igids: '5129384, 5839201, 5729104, 5910293' },
    { id: 2, name: 'Tamil Titans Esports', captain: 'TTN_Vijay', phone: '+91 94441 56789', status: 'APPROVED', slot: 'SLOT-02', igids: '5482910, 5392019, 5719203, 5620194' },
    { id: 3, name: 'Soul Conqueror Roster', captain: 'Soul_Mortal', phone: '+91 98840 11223', status: 'APPROVED', slot: 'SLOT-03', igids: '5110293, 5829104, 5392019, 5729102' },
    { id: 4, name: 'GodLike Arena Squad', captain: 'GodL_Jonathan', phone: '+91 99620 44556', status: 'PENDING_WHITELIST', slot: 'SLOT-04', igids: '5992019, 5819203, 5302914, 5719200' },
    { id: 5, name: '8Bit Pro Lineup', captain: '8Bit_Juicy', phone: '+91 97900 77889', status: 'APPROVED', slot: 'SLOT-05', igids: '5291029, 5719204, 5819201, 5392011' },
  ]);

  const [seasonWarStatus, setSeasonWarStatus] = useState('ACTIVE');
  const [maxSlots, setMaxSlots] = useState(100);

  if (!isOpen) return null;

  const handleBroadcastRoom = (e) => {
    e.preventDefault();
    if (!roomId || !roomPassword) return;
    soundFx.playVictory();
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setRoomId('');
      setRoomPassword('');
    }, 4000);
  };

  const handleApproveTeam = (id) => {
    soundFx.playSuccess();
    setRegisteredTeams(teams =>
      teams.map(t => t.id === id ? { ...t, status: 'APPROVED' } : t)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#090C12] border-2 border-[#E5C05B] rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(229,192,91,0.35)] my-8">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-black/60 border border-[#1E2536] text-[#788294] hover:text-white hover:border-[#E5C05B]/50 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Super Admin Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E2433] mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD700] via-[#E5C05B] to-[#8E752D] p-0.5 shadow-[0_0_20px_rgba(255,215,0,0.5)] flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0E0C06] rounded-[14px] flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#FFD700] fill-[#FFD700]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-montserrat font-black text-lg text-white tracking-wider uppercase">
                  SUPER ADMIN CONTROL CENTER
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 font-mono text-[10px] font-bold">
                  LEVEL 10
                </span>
              </div>
              <p className="font-rajdhani text-xs text-[#CBD5E1]">
                Logged in as: <strong className="text-[#E5C05B]">@{user?.username || 'lastzetas'}</strong> ({user?.name || 'Last Zetas'})
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onLogout();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-montserrat font-bold text-xs uppercase cursor-pointer transition-all self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mb-6 pb-2 border-b border-[#1E2433]">
          <button
            onClick={() => {
              soundFx.playClick();
              setAdminTab('TEAMS');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-montserrat font-bold uppercase transition-all cursor-pointer ${
              adminTab === 'TEAMS'
                ? 'bg-[#E5C05B] text-[#090B0E] shadow-[0_0_15px_rgba(229,192,91,0.3)]'
                : 'bg-[#11151E] text-[#788294] hover:text-white border border-[#1E2536]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Registered Squads ({registeredTeams.length})</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setAdminTab('BROADCAST');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-montserrat font-bold uppercase transition-all cursor-pointer ${
              adminTab === 'BROADCAST'
                ? 'bg-[#E5C05B] text-[#090B0E] shadow-[0_0_15px_rgba(229,192,91,0.3)]'
                : 'bg-[#11151E] text-[#788294] hover:text-white border border-[#1E2536]'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Broadcast Custom Room</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setAdminTab('SEASON');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-montserrat font-bold uppercase transition-all cursor-pointer ${
              adminTab === 'SEASON'
                ? 'bg-[#E5C05B] text-[#090B0E] shadow-[0_0_15px_rgba(229,192,91,0.3)]'
                : 'bg-[#11151E] text-[#788294] hover:text-white border border-[#1E2536]'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>7th Seasonal War Config</span>
          </button>
        </div>

        {/* Tab 1: Registered Squads & IGID Whitelist Desk */}
        {adminTab === 'TEAMS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-montserrat font-bold text-sm text-white uppercase">
                Tournament Roster & Anti-Cheat Whitelist
              </h4>
              <span className="text-xs font-rajdhani text-[#CBD5E1]">
                Slots Filled: <strong className="text-[#E5C05B]">{registeredTeams.length} / 100</strong>
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {registeredTeams.map((team) => (
                <div
                  key={team.id}
                  className="p-4 rounded-xl bg-[#11151E] border border-[#1E2536] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-[#E5C05B] bg-[#E5C05B]/10 px-2 py-0.5 rounded border border-[#E5C05B]/30">
                        {team.slot}
                      </span>
                      <span className="font-montserrat font-bold text-sm text-white">
                        {team.name}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        team.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                      }`}>
                        {team.status}
                      </span>
                    </div>

                    <p className="font-rajdhani text-xs text-[#788294] mt-1">
                      IGL: <span className="text-[#CBD5E1]">{team.captain}</span> ({team.phone}) • IGIDs: <span className="font-mono text-[11px] text-[#94A3B8]">{team.igids}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {team.status !== 'APPROVED' ? (
                      <button
                        onClick={() => handleApproveTeam(team.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-montserrat font-bold text-xs uppercase cursor-pointer transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Whitelist</span>
                      </button>
                    ) : (
                      <span className="text-xs font-rajdhani font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Custom Room Broadcaster */}
        {adminTab === 'BROADCAST' && (
          <form onSubmit={handleBroadcastRoom} className="space-y-4 max-w-xl mx-auto py-2">
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-black border border-red-500/40 text-xs font-rajdhani text-red-300 flex items-start gap-3">
              <Radio className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <strong className="text-white block font-montserrat text-xs uppercase">Live Scrims Dispatch Desk</strong>
                <span>Submitting credentials will instantly push custom room credentials to all verified captains via automated SMS/WhatsApp portal.</span>
              </div>
            </div>

            {broadcastSent && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-rajdhani text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Custom room details successfully broadcasted to all 100 squad captains!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-rajdhani font-bold text-[#CBD5E1] uppercase mb-1">
                  Custom Room ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7829104"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0C0F15] border border-[#1E2536] text-white font-mono text-sm focus:border-[#E5C05B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-rajdhani font-bold text-[#CBD5E1] uppercase mb-1">
                  Room Password *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. conqueror77"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0C0F15] border border-[#1E2536] text-white font-mono text-sm focus:border-[#E5C05B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-rajdhani font-bold text-[#CBD5E1] uppercase mb-1">
                Tournament Map & Mode
              </label>
              <select
                value={roomMap}
                onChange={(e) => setRoomMap(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0C0F15] border border-[#1E2536] text-white font-sans text-xs focus:border-[#E5C05B] focus:outline-none"
              >
                <option>Erangel (Match 1 - TPP Squads)</option>
                <option>Miramar (Match 2 - TPP Squads)</option>
                <option>Sanhok (Match 3 - TPP Squads)</option>
                <option>Vikendi (Grand Finals Showdown)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 hover:brightness-110 text-black font-montserrat font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(239,68,68,0.5)] transition-all"
            >
              <Send className="w-4 h-4 text-black" />
              <span>Broadcast Room Credentials Instantly</span>
            </button>
          </form>
        )}

        {/* Tab 3: Season 7 Configuration */}
        {adminTab === 'SEASON' && (
          <div className="space-y-4 max-w-xl mx-auto py-2">
            <div className="p-4 rounded-xl bg-[#11151E] border border-[#1E2536] space-y-3">
              <h4 className="font-montserrat font-bold text-sm text-white uppercase">
                Season 7 Status & Prizepool Controls
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-rajdhani font-bold text-[#CBD5E1] uppercase mb-1">
                    Registration State
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setSeasonWarStatus(s => s === 'ACTIVE' ? 'PAUSED' : 'ACTIVE');
                    }}
                    className={`w-full py-2.5 rounded-lg font-montserrat font-bold text-xs uppercase cursor-pointer transition-all border ${
                      seasonWarStatus === 'ACTIVE'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400'
                        : 'bg-red-950/60 border-red-500 text-red-400'
                    }`}
                  >
                    {seasonWarStatus === 'ACTIVE' ? '● REGISTRATION OPEN' : '○ REGISTRATION PAUSED'}
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-rajdhani font-bold text-[#CBD5E1] uppercase mb-1">
                    Total Slot Limit
                  </label>
                  <input
                    type="number"
                    value={maxSlots}
                    onChange={(e) => setMaxSlots(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#0C0F15] border border-[#1E2536] text-white font-mono text-xs focus:border-[#E5C05B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playSuccess();
                    alert('Season 7 settings saved successfully!');
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#E5C05B] hover:bg-[#F3CF7A] text-[#090B0E] font-montserrat font-extrabold text-xs uppercase cursor-pointer transition-all"
                >
                  Save Season Configuration
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
