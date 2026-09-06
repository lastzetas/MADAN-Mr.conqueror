import React, { useState, useEffect } from 'react';
import {
  Shield, Users, Radio, Send, LogOut, Check,
  AlertCircle, Trophy, Swords, Search, ArrowRightLeft,
  FileSpreadsheet, MessageSquare, Flame, CheckCircle2, RotateCcw,
  Sliders, Award, UserCheck, Activity, Wifi, ArrowLeft, Home,
  Clock, TrendingUp, Sparkles, Cpu, Phone, XCircle, Trash2, Copy
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import {
  getStoredRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  clearAllRegistrations,
  subscribeToLivePortalUpdates,
  getStoredInquiries,
  resolveInquiry
} from '../utils/portalData';

export const AdminDashboard = ({ user, onLogout, onSwitchToSuperAdmin, onBackToPortal }) => {
  const [activeTab, setActiveTab] = useState('ROSTER');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  // Real-time Registrations & Inquiries
  const [rosterTeams, setRosterTeams] = useState(getStoredRegistrations());
  const [inquiries, setInquiries] = useState(getStoredInquiries());

  // Connect to Zero-Latency Live Subscription Stream (SSE + Cloud + Local)
  useEffect(() => {
    const unsubscribe = subscribeToLivePortalUpdates((updatedList) => {
      setRosterTeams(updatedList);
    });

    const handleInquiriesUpdate = () => {
      setInquiries(getStoredInquiries());
    };

    window.addEventListener('portal_inquiries_updated', handleInquiriesUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('portal_inquiries_updated', handleInquiriesUpdate);
    };
  }, []);

  // Broadcaster state
  const [roomId, setRoomId] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [roomMap, setRoomMap] = useState('Erangel (Match 1)');
  const [broadcastDone, setBroadcastDone] = useState(false);

  // Scoring desk state
  const [matchScores, setMatchScores] = useState([
    { rank: 1, team: 'OG-BTS', kills: 14, placementPts: 10, total: 24, status: 'LOCKED' },
    { rank: 2, team: 'Tamil Titans', kills: 9, placementPts: 6, total: 15, status: 'LOCKED' },
    { rank: 3, team: 'Team Soul', kills: 8, placementPts: 5, total: 13, status: 'LOCKED' },
    { rank: 4, team: 'GodLike Arena', kills: 7, placementPts: 4, total: 11, status: 'DRAFT' },
    { rank: 5, team: 'Team 8Bit Pro', kills: 4, placementPts: 3, total: 7, status: 'DRAFT' },
  ]);

  const handleVerifySquad = (id) => {
    soundFx.playSuccess();
    const updated = updateRegistrationStatus(id, 'VERIFIED');
    setRosterTeams(updated);
  };

  const handleRejectSquad = (id) => {
    soundFx.playClick();
    const updated = updateRegistrationStatus(id, 'REJECTED');
    setRosterTeams(updated);
  };

  const handleDeleteSquad = (id) => {
    if (window.confirm('Are you sure you want to remove this squad registration?')) {
      soundFx.playClick();
      const updated = deleteRegistration(id);
      setRosterTeams(updated);
    }
  };

  const handleCopyIgids = (team) => {
    const igidsText = team.igids || team.players?.map(p => `${p.name}: ${p.id}`).join(', ') || 'N/A';
    navigator.clipboard.writeText(igidsText);
    soundFx.playSuccess();
    setCopiedId(team.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!roomId || !roomPassword) return;
    soundFx.playVictory();
    setBroadcastDone(true);
    setTimeout(() => {
      setBroadcastDone(false);
      setRoomId('');
      setRoomPassword('');
    }, 4000);
  };

  const handleResolveInquiry = (id) => {
    soundFx.playSuccess();
    const updated = resolveInquiry(id);
    setInquiries(updated);
  };

  const filteredTeams = rosterTeams.filter(t => {
    const teamName = t.teamName || t.name || '';
    const iglName = t.iglName || t.captainName || t.captain || '';
    const slot = t.slot || '';
    const ticketId = t.ticketId || '';
    const igids = t.igids || '';
    const clanTag = t.clanTag || '';

    const matchesSearch =
      teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iglName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      igids.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clanTag.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PENDING' && t.status === 'PENDING') ||
      (statusFilter === 'VERIFIED' && (t.status === 'VERIFIED' || t.status === 'WHITELISTED')) ||
      (statusFilter === 'REJECTED' && t.status === 'REJECTED');

    return matchesSearch && matchesStatus;
  });

  const pendingRostersCount = rosterTeams.filter(t => t.status === 'PENDING').length;
  const verifiedCount = rosterTeams.filter(t => t.status === 'VERIFIED' || t.status === 'WHITELISTED').length;
  const openInquiriesCount = inquiries.filter(i => i.status === 'OPEN').length;

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex flex-col text-[#1E293B] font-sans selection:bg-teal-500/20 selection:text-teal-900">
      
      {/* Top Sticky Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs px-4 sm:px-6 py-3">
        <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
          
          {/* Brand & Auth Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-[0_4px_12px_rgba(13,148,136,0.35)]">
              AD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-[#0F172A] tracking-tight uppercase">
                  MATCH OPS DESK
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-mono text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  OPS • LVL 5
                </span>
                {pendingRostersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-mono text-[10px] font-bold animate-pulse">
                    {pendingRostersCount} NEW SQUADS
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#64748B] font-mono">
                @{user?.username || 'admin'} • JWT: HS256 Verified
              </p>
            </div>
          </div>

          {/* Action Header Pills */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Back to Public Portal Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                onBackToPortal?.();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-[#CBD5E1] text-[#334155] text-xs font-bold transition-all cursor-pointer shadow-xs hover:shadow"
              title="Return to Public Portal"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-teal-600" />
              <span>Back to Portal</span>
            </button>

            {/* Switch to Super Admin (if authorized) */}
            {user?.role === 'SUPER_ADMIN' && onSwitchToSuperAdmin && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onSwitchToSuperAdmin();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-[#CBD5E1] text-[#334155] text-xs font-bold transition-all cursor-pointer shadow-xs hover:shadow"
                title="Switch to Super Admin View"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-teal-600" />
                <span>Super Admin</span>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                onLogout?.();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-rose-50 border border-[#CBD5E1] hover:border-rose-300 text-[#475569] hover:text-rose-600 text-xs font-bold transition-all cursor-pointer shadow-xs hover:shadow"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Subheader Navigation Strip (Pill Tabs) */}
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-4 sm:px-6 py-2.5">
        <div className="max-w-[1600px] mx-auto w-full flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'ROSTER', label: `Match Rosters & IGID Desk (${rosterTeams.length})`, icon: Users, badge: pendingRostersCount > 0 ? `${pendingRostersCount} Pending` : 'Live' },
            { id: 'LOBBY', label: 'Lobby Broadcaster', icon: Radio },
            { id: 'SCORES', label: 'Kill Points & Scoring Desk', icon: Award },
            { id: 'INQUIRIES', label: `Captain Dispute Desk (${inquiries.length})`, icon: MessageSquare, count: openInquiriesCount },
            { id: 'TELEMETRY', label: 'Server Ping Matrix', icon: Wifi },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-[#0F172A] text-white shadow-md shadow-slate-900/10'
                    : 'bg-white hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-teal-400' : 'text-[#64748B]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    active ? 'bg-teal-400/20 text-teal-300' : 'bg-teal-50 text-teal-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
                {tab.count > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    active ? 'bg-amber-400/20 text-amber-300' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* TAB 1: MATCH ROSTER & IGID VERIFICATION DESK */}
        {activeTab === 'ROSTER' && (
          <div className="space-y-6">
            
            {/* Top Quick Status Metric Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: 'MATCH STATUS', value: 'WAR LIVE', detail: 'Group A • Erangel', tag: 'ROUND 1' },
                { label: 'REGISTERED SQUADS', value: `${rosterTeams.length} Squads`, detail: `${verifiedCount} Verified Ready`, tag: `${Math.round((verifiedCount / Math.max(1, rosterTeams.length)) * 100)}% READY` },
                { label: 'AVG SERVER PING', value: '18ms', detail: 'Mumbai Direct Route', tag: 'OPTIMAL' },
                { label: 'PENDING REVIEWS', value: `${pendingRostersCount} Applications`, detail: 'Awaiting IGID Verification', tag: pendingRostersCount > 0 ? 'ACTION NEEDED' : 'CLEAN' },
              ].map((m, i) => (
                <div
                  key={i}
                  className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 sm:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] font-bold">
                    <span>{m.label}</span>
                    <span className={`px-1.5 py-0.5 rounded ${m.tag === 'ACTION NEEDED' ? 'bg-amber-100 text-amber-900 font-bold animate-pulse' : 'bg-slate-100 text-[#0F172A]'}`}>
                      {m.tag}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">{m.value}</span>
                    <p className="text-[10px] text-[#64748B] font-mono mt-0.5">{m.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Match Telemetry Strip */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Telemetry Frag Curve */}
              <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#64748B] tracking-wider">
                      TELEMETRY CURVE
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[9px] font-mono font-bold">
                      MATCH 1 VELOCITY
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#64748B]">Zone 4 / Erangel</span>
                </div>

                <div className="relative w-full h-36 bg-slate-50/60 rounded-2xl p-2 border border-[#E2E8F0] flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="adminWaveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.45" />
                        <stop offset="70%" stopColor="#2DD4BF" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.0" />
                      </linearGradient>
                      <filter id="adminGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#14B8A6" floodOpacity="0.3" />
                      </filter>
                    </defs>

                    <line x1="0" y1="35" x2="400" y2="35" stroke="#E2E8F0" strokeDasharray="3,3" strokeWidth="1" />
                    <line x1="0" y1="75" x2="400" y2="75" stroke="#E2E8F0" strokeDasharray="3,3" strokeWidth="1" />
                    <line x1="0" y1="115" x2="400" y2="115" stroke="#E2E8F0" strokeDasharray="3,3" strokeWidth="1" />

                    <path
                      d="M 0 130 C 50 120, 80 80, 130 90 C 180 100, 210 40, 260 30 C 310 20, 350 70, 400 50 L 400 150 L 0 150 Z"
                      fill="url(#adminWaveGradient)"
                    />
                    <path
                      d="M 0 130 C 50 120, 80 80, 130 90 C 180 100, 210 40, 260 30 C 310 20, 350 70, 400 50"
                      fill="none"
                      stroke="#14B8A6"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      filter="url(#adminGlow)"
                    />
                    <g transform="translate(260, 30)">
                      <circle r="5.5" fill="#0F172A" stroke="#2DD4BF" strokeWidth="3" />
                      <circle r="2" fill="#FFFFFF" />
                      <rect x="-32" y="-28" width="64" height="20" rx="6" fill="#0F172A" />
                      <text x="0" y="-14" textAnchor="middle" fill="#2DD4BF" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        8,700 PTS
                      </text>
                    </g>
                    <circle cx="130" cy="90" r="3.5" fill="#14B8A6" />
                    <circle cx="400" cy="50" r="3.5" fill="#14B8A6" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                  <span>Avg Ping: 18ms (Direct Mumbai Node)</span>
                  <span className="font-bold text-teal-700">64 Total Frags Recorded</span>
                </div>
              </div>

              {/* Lobby Readiness & Fast Dispatch Actions */}
              <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold tracking-wider">
                    LOBBY READINESS DIAL
                  </span>
                  <span className="text-[10px] font-mono text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    {verifiedCount}/{rosterTeams.length} OK
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-teal-500"
                        strokeDasharray={`${Math.min(100, Math.round((verifiedCount / Math.max(1, rosterTeams.length)) * 100))}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-sm font-black text-[#0F172A] font-mono">
                        {Math.round((verifiedCount / Math.max(1, rosterTeams.length)) * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#0F172A] block">Lobby Whitelist Status</span>
                    <p className="text-[10px] text-[#64748B] font-mono leading-tight">
                      {pendingRostersCount > 0 ? `${pendingRostersCount} squads pending review below` : 'All registered squads ready for match'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setActiveTab('LOBBY');
                    }}
                    className="py-2 px-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-[11px] uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5 text-teal-400" />
                    <span>Broadcast</span>
                  </button>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setActiveTab('SCORES');
                    }}
                    className="py-2 px-2.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-[#CBD5E1] text-[#0F172A] font-bold text-[11px] uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-teal-600" />
                    <span>Scoring</span>
                  </button>
                </div>
              </div>
            </div>

            {/* MAIN SQUAD APPLICATIONS & ROSTER DESK */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-5">
              
              {/* Desk Header & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm sm:text-base font-black text-[#0F172A] uppercase tracking-wider">
                      JOIN NOW Squad Registrations & IGID Desk
                    </h3>
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE ZERO-LATENCY FEED
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B]">
                    Full player roster, BGMI character ID anti-cheat verification, and WhatsApp IGL contact
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-72">
                    <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search squad, IGL, slot, ticket, IGID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-teal-500 font-sans"
                    />
                  </div>

                  {rosterTeams.length > 0 && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to reset and clear all squad registrations?')) {
                          soundFx.playClick();
                          clearAllRegistrations();
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-[10px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap border border-slate-200 hover:border-rose-200"
                      title="Clear all squad registrations"
                    >
                      Clear Queue
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'ALL', label: `All Squads (${rosterTeams.length})` },
                  { id: 'PENDING', label: `Pending Verification (${pendingRostersCount})`, highlight: pendingRostersCount > 0 },
                  { id: 'VERIFIED', label: `Verified / Whitelisted (${verifiedCount})` },
                  { id: 'REJECTED', label: `Rejected (${rosterTeams.filter(t => t.status === 'REJECTED').length})` },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => {
                      soundFx.playClick();
                      setStatusFilter(chip.id);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      statusFilter === chip.id
                        ? 'bg-[#0F172A] text-white'
                        : chip.highlight
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold'
                        : 'bg-[#F8FAFC] hover:bg-slate-200 text-[#64748B] border border-[#E2E8F0]'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Detailed Squad Applications Cards */}
              <div className="space-y-4">
                {filteredTeams.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto shadow-xs">
                      <Users className="w-6 h-6" />
                    </div>
                    <h4 className="font-extrabold text-sm text-[#0F172A] uppercase">
                      {searchQuery || statusFilter !== 'ALL' ? 'No Matching Squads Found' : 'No Squad Registrations in Queue'}
                    </h4>
                    <p className="text-xs text-[#64748B] max-w-md mx-auto font-mono">
                      {searchQuery || statusFilter !== 'ALL'
                        ? 'Try clearing your search query or filter chips above.'
                        : 'All demo data cleared. When any squad registers via the "JOIN NOW" button on the website, their complete 4-player roster and character IGIDs will appear here in real time with zero latency.'}
                    </p>
                    <div className="inline-flex items-center gap-2 text-[10px] font-mono text-emerald-700 font-bold pt-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>LIVE ZERO-LATENCY STREAM CONNECTED</span>
                    </div>
                  </div>
                ) : (
                  filteredTeams.map((team) => (
                    <div
                      key={team.id}
                      className="p-4 sm:p-5 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-slate-300 transition-all flex flex-col space-y-4 shadow-xs"
                    >
                      {/* Top Row: Squad Header, Category, and Action Buttons */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 text-xs font-mono">
                            {team.slot}
                          </span>
                          {team.clanLogo && (
                            <img src={team.clanLogo} alt="Clan Logo" className="w-7 h-7 rounded-lg object-cover border border-slate-300 shadow-xs" />
                          )}
                          <h4 className="font-extrabold text-sm sm:text-base text-[#0F172A]">
                            {team.teamName || team.name} {team.clanTag && <span className="text-slate-500 font-mono">[{team.clanTag}]</span>}
                          </h4>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-mono font-bold">
                            🎫 {team.ticketId || team.id}
                          </span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 font-mono font-bold border border-teal-200">
                            {team.category || 'Season 7 War Grand Finale'}
                          </span>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase font-mono ${
                            team.matchType === 'SOLO'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : team.matchType === 'DUO'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}>
                            {team.matchType || 'SQUAD'}
                          </span>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase font-mono ${
                            team.status === 'WHITELISTED' || team.status === 'VERIFIED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : team.status === 'REJECTED'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {team.status}
                          </span>
                          {team.ping && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold flex items-center gap-1 border border-emerald-200">
                              <Wifi className="w-3 h-3 text-emerald-500" />
                              {team.ping}
                            </span>
                          )}
                        </div>

                        {/* Approval Buttons */}
                        <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                          {team.status === 'PENDING' ? (
                            <>
                              <button
                                onClick={() => handleVerifySquad(team.id)}
                                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Verify & Pass</span>
                              </button>
                              <button
                                onClick={() => handleRejectSquad(team.id)}
                                className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-[#475569] hover:text-rose-600 font-bold text-xs uppercase transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          ) : team.status === 'VERIFIED' || team.status === 'WHITELISTED' ? (
                            <button
                              onClick={() => handleRejectSquad(team.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-300 hover:border-amber-300 text-[#475569] hover:text-amber-700 font-semibold text-xs uppercase cursor-pointer"
                            >
                              Revoke Pass
                            </button>
                          ) : (
                            <button
                              onClick={() => handleVerifySquad(team.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs uppercase cursor-pointer"
                            >
                              Re-Verify
                            </button>
                          )}

                          <button
                            onClick={() => handleCopyIgids(team)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-[#334155] font-semibold text-xs flex items-center gap-1 cursor-pointer"
                            title="Copy all player IGIDs for room invite/verification"
                          >
                            <Copy className="w-3 h-3 text-teal-600" />
                            <span>{copiedId === team.id ? 'Copied!' : 'Copy IGIDs'}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteSquad(team.id)}
                            className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-300 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                            title="Delete squad entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Middle: IGL Contact Details & Metadata */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono bg-white p-3.5 rounded-2xl border border-[#E2E8F0]">
                        <div>
                          <span className="text-[#64748B] block text-[10px] uppercase font-bold">
                            {team.matchType === 'SOLO' ? 'Solo Player Name:' : team.matchType === 'DUO' ? 'Duo Leader Name:' : 'Squad IGL (In Game Leader):'}
                          </span>
                          <strong className="text-[#0F172A] text-sm">{team.iglName || team.captainName || team.captain}</strong>
                        </div>
                        <div>
                          <span className="text-[#64748B] block text-[10px] uppercase font-bold">
                            {team.matchType === 'SOLO' ? 'Player Contact:' : 'Leader WhatsApp Contact:'}
                          </span>
                          <a
                            href={`https://wa.me/${(team.iglPhone || team.captainPhone || team.phone)?.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                            title="Click to message on WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{team.iglPhone || team.captainPhone || team.phone}</span>
                          </a>
                        </div>
                        <div>
                          <span className="text-[#64748B] block text-[10px] uppercase font-bold">Discord / Time:</span>
                          <span className="text-[#334155]">{team.iglDiscord || team.captainDiscord || 'N/A'} • {team.registeredAt}</span>
                        </div>
                      </div>

                      {/* Bottom: Dynamic Player Roster & IGIDs Breakdown Grid */}
                      <div>
                        <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold block mb-2">
                          Registered {team.matchType === 'SOLO' ? 'Solo Player' : team.matchType === 'DUO' ? '2-Player Duo Roster' : '4-Player Squad Roster'} & In-Game IDs (IGIDs):
                        </span>
                        <div className={`grid gap-2 text-xs font-mono ${
                          team.matchType === 'SOLO'
                            ? 'grid-cols-1 max-w-sm'
                            : team.matchType === 'DUO'
                            ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl'
                            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                        }`}>
                          {(team.players && team.players.length > 0 ? team.players : (
                            team.matchType === 'SOLO' ? [
                              { name: team.iglName || team.captainName || 'Solo Player', id: team.igids?.split(',')[0]?.trim() || 'N/A', role: 'Solo Player' }
                            ] : team.matchType === 'DUO' ? [
                              { name: team.iglName || team.captainName || 'Player 1 (Leader)', id: team.igids?.split(',')[0]?.trim() || 'N/A', role: 'Leader' },
                              { name: 'Player 2 (Partner)', id: team.igids?.split(',')[1]?.trim() || 'N/A', role: 'Partner' }
                            ] : [
                              { name: team.iglName || team.captainName || 'Player 1', id: team.igids?.split(',')[0]?.trim() || 'N/A', role: 'IGL (In Game Leader)' },
                              { name: 'Player 2', id: team.igids?.split(',')[1]?.trim() || 'N/A', role: 'Assaulter' },
                              { name: 'Player 3', id: team.igids?.split(',')[2]?.trim() || 'N/A', role: 'Fragger' },
                              { name: 'Player 4', id: team.igids?.split(',')[3]?.trim() || 'N/A', role: 'Support' }
                            ]
                          )).map((player, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] flex flex-col justify-between">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[#0F172A] truncate">{player.name}</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-[#475569]">{player.role || `P${idx+1}`}</span>
                              </div>
                              <div className="mt-1 text-[11px] text-teal-700 font-bold">
                                IGID: {player.id}
                              </div>
                            </div>
                          ))}
                        </div>
                        {team.substitute && (team.substitute.name || team.substitute.id) && (
                          <div className="mt-2 text-[11px] font-mono text-[#64748B] bg-slate-50 p-2 rounded-xl border border-slate-200">
                            <strong>Substitute Player:</strong> {team.substitute.name || 'Sub'} (IGID: {team.substitute.id || 'N/A'})
                          </div>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: LOBBY BROADCASTER */}
        {activeTab === 'LOBBY' && (
          <div className="max-w-2xl mx-auto py-4">
            <form onSubmit={handleBroadcast} className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#0F172A] uppercase">
                    Custom Room Push Dispatcher
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Dispatches room ID & password to all {verifiedCount} verified squad captains via portal notification
                  </p>
                </div>
              </div>

              {broadcastDone && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 font-mono">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">Lobby credentials broadcasted to all {verifiedCount} verified captains successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#64748B] text-[10px] uppercase font-bold mb-1.5 font-mono">
                    Room ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 910482"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:outline-none focus:border-teal-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#64748B] text-[10px] uppercase font-bold mb-1.5 font-mono">
                    Password *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. conqueror99"
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:outline-none focus:border-teal-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#64748B] text-[10px] uppercase font-bold mb-1.5 font-mono">
                  Select Map & Match Slot
                </label>
                <select
                  value={roomMap}
                  onChange={(e) => setRoomMap(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:outline-none focus:border-teal-500 text-xs font-sans"
                >
                  <option>Erangel (Match 1 - Group A)</option>
                  <option>Miramar (Match 2 - Group B)</option>
                  <option>Sanhok (Match 3 - Semi-Finals)</option>
                  <option>Vikendi (Match 4 - Grand Finals)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold uppercase text-xs cursor-pointer transition-colors shadow-md"
              >
                Send Lobby Credentials to {verifiedCount} Verified Captains
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: KILL POINTS & SCORING DESK */}
        {activeTab === 'SCORES' && (
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-[#0F172A] uppercase">
                  Live Match Results & Kill Points Scoring
                </h3>
                <p className="text-[10px] text-[#64748B]">
                  Official points distribution (Placement + Frag multiplier = Total Score)
                </p>
              </div>

              <button
                onClick={() => {
                  soundFx.playSuccess();
                  alert('Standings calculated and synced to public Hall of Fame leaderboard.');
                }}
                className="px-4 py-2 rounded-2xl bg-[#0F172A] text-white font-bold text-xs uppercase cursor-pointer hover:bg-slate-800 self-start sm:self-auto transition-colors"
              >
                Publish Standings to Portal
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B] text-[10px] uppercase">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Squad Name</th>
                    <th className="py-2.5 px-3">Kill Pts</th>
                    <th className="py-2.5 px-3">Place Pts</th>
                    <th className="py-2.5 px-3">Total Pts</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {matchScores.map((score) => (
                    <tr key={score.rank} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-3 font-bold text-[#0F172A]">#{score.rank}</td>
                      <td className="py-3 px-3 font-bold text-[#0F172A]">{score.team}</td>
                      <td className="py-3 px-3 text-[#475569]">{score.kills} kills</td>
                      <td className="py-3 px-3 text-[#475569]">+{score.placementPts} pts</td>
                      <td className="py-3 px-3 font-bold text-teal-700">{score.total} PTS</td>
                      <td className="py-3 px-3">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          score.status === 'LOCKED'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-[#475569]'
                        }`}>
                          {score.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CAPTAIN DISPUTES & SUPPORT */}
        {activeTab === 'INQUIRIES' && (
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
            <div>
              <h3 className="text-xs sm:text-sm font-black text-[#0F172A] uppercase">
                Captain Support & Dispute Desk
              </h3>
              <p className="text-[10px] text-[#64748B]">
                Direct requests regarding slot swaps, ping checks, and player IGID substitutions
              </p>
            </div>

            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full text-[9px] font-mono">
                        {inq.id}
                      </span>
                      <span className="font-bold text-[#0F172A] text-xs">{inq.squad}</span>
                      <span className="text-[#64748B] text-[10px]">({inq.captain} • {inq.email})</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        inq.status === 'RESOLVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#475569] mt-1.5 font-mono">
                      {inq.issue}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto font-mono">
                    <span className="text-[10px] text-[#64748B]">{inq.time}</span>
                    {inq.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleResolveInquiry(inq.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#0F172A] text-white font-bold text-[10px] uppercase hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TELEMETRY & PING MATRIX */}
        {activeTab === 'TELEMETRY' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
              <h3 className="text-xs sm:text-sm font-black text-[#0F172A] uppercase">
                Regional Server Ping Telemetry
              </h3>
              <div className="space-y-3 font-mono text-xs">
                {[
                  { region: 'Mumbai AWS Dedicated (ap-south-1)', ping: '16ms', jitter: '1.2ms', loss: '0.0%' },
                  { region: 'Chennai Edge Gateway (ap-south-2)', ping: '19ms', jitter: '1.8ms', loss: '0.0%' },
                  { region: 'Delhi NCR Router Node (in-del-01)', ping: '21ms', jitter: '2.4ms', loss: '0.01%' },
                  { region: 'Singapore Fallback (ap-southeast-1)', ping: '48ms', jitter: '3.1ms', loss: '0.0%' },
                ].map((s, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#0F172A] block">{s.region}</span>
                      <span className="text-[10px] text-[#64748B]">Jitter: {s.jitter} • Loss: {s.loss}</span>
                    </div>
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {s.ping}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-[#0F172A] uppercase">
                  Anti-Cheat Telemetry Engine
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Active monitoring for unauthorized config files, memory tampering, and emulator bypass tools.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-1.5">
                <div className="text-emerald-400 font-bold">✓ Kamo Anti-Cheat Driver: LOADED</div>
                <div className="text-slate-300">✓ BGMI v3.4 Integrity Hash: MATCHED</div>
                <div className="text-slate-300">✓ Packet Encryption: TLS 1.3 / DTLS Active</div>
                <div className="text-teal-300 font-bold">✓ 0 Disqualifications Flagged</div>
              </div>

              <button
                onClick={() => {
                  soundFx.playSuccess();
                  alert('Anti-Cheat deep sweep completed: 100% clean lobby.');
                }}
                className="w-full py-2.5 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold uppercase text-xs cursor-pointer transition-colors"
              >
                Run Anti-Cheat Sweep
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Bottom Status Footer */}
      <footer className="mt-auto px-4 sm:px-6 py-3 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-[1600px] mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#64748B] gap-2">
          <span>Madan Match Operations • Level 5 Operations Desk</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              TELEMETRY NOMINAL
            </span>
            <span>BGMI Official Battleground</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default AdminDashboard;
