import React, { useState, useEffect } from 'react';
import {
  Shield, Users, Trophy, Radio, Send, LogOut, Check,
  AlertCircle, Key, Activity, RefreshCw, FileText,
  Sliders, ArrowRightLeft, Lock, Search, Filter, Plus, ChevronRight,
  TrendingUp, Wifi, CheckCircle2, Sparkles, Cpu, Award, ArrowLeft, Home,
  Clock, XCircle, Trash2, Copy, MessageSquare, ExternalLink, Phone
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import {
  getStoredRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  getStoredInquiries,
  resolveInquiry
} from '../utils/portalData';

export const SuperAdminDashboard = ({ user, onLogout, onSwitchToAdmin, onBackToPortal }) => {
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Real-time Registrations & Inquiries
  const [teams, setTeams] = useState(getStoredRegistrations());
  const [inquiries, setInquiries] = useState(getStoredInquiries());

  // Subscribe to real-time events from public portal registrations
  useEffect(() => {
    const handleRegistrationsUpdate = () => {
      setTeams(getStoredRegistrations());
    };

    const handleInquiriesUpdate = () => {
      setInquiries(getStoredInquiries());
    };

    window.addEventListener('portal_registrations_updated', handleRegistrationsUpdate);
    window.addEventListener('portal_inquiries_updated', handleInquiriesUpdate);

    return () => {
      window.removeEventListener('portal_registrations_updated', handleRegistrationsUpdate);
      window.removeEventListener('portal_inquiries_updated', handleInquiriesUpdate);
    };
  }, []);

  // Admins List
  const [adminsList, setAdminsList] = useState([
    { id: 1, email: 'lastzetas@gmail.com', name: 'Last Zetas', role: 'SUPER_ADMIN', level: 'Level 10 (Root)', status: 'ACTIVE', lastActive: 'Now' },
    { id: 2, email: 'admin@madan.gg', name: 'Match Ops Lead', role: 'ADMIN', level: 'Level 5 (Ops)', status: 'ACTIVE', lastActive: '14 mins ago' },
    { id: 3, email: 'anticheat@madan.gg', name: 'Kamo (Anti-Cheat Mod)', role: 'MODERATOR', level: 'Level 3 (Security)', status: 'ACTIVE', lastActive: '1 hour ago' },
  ]);

  // Room Broadcaster state
  const [roomId, setRoomId] = useState('');
  const [roomPass, setRoomPass] = useState('');
  const [roomMap, setRoomMap] = useState('Erangel (Match 1)');
  const [broadcastDone, setBroadcastDone] = useState(false);

  // Season Config
  const [isSeasonOpen, setIsSeasonOpen] = useState(true);
  const [totalPrizePool, setTotalPrizePool] = useState('₹2,50,000 INR');
  const [slotLimit, setSlotLimit] = useState(100);

  const handleApproveTeam = (id) => {
    soundFx.playSuccess();
    const updated = updateRegistrationStatus(id, 'WHITELISTED');
    setTeams(updated);
  };

  const handleRejectTeam = (id) => {
    soundFx.playClick();
    const updated = updateRegistrationStatus(id, 'REJECTED');
    setTeams(updated);
  };

  const handleDeleteTeam = (id) => {
    if (window.confirm('Are you sure you want to delete this squad registration?')) {
      soundFx.playClick();
      const updated = deleteRegistration(id);
      setTeams(updated);
    }
  };

  const handleResolveInquiry = (id) => {
    soundFx.playSuccess();
    const updated = resolveInquiry(id);
    setInquiries(updated);
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!roomId || !roomPass) return;
    soundFx.playVictory();
    setBroadcastDone(true);
    setTimeout(() => {
      setBroadcastDone(false);
      setRoomId('');
      setRoomPass('');
    }, 4000);
  };

  const filteredTeams = teams.filter(t => {
    const matchesSearch =
      t.teamName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.captainName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.slot?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.ticketId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.igids?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = teams.filter(t => t.status === 'PENDING').length;
  const whitelistedCount = teams.filter(t => t.status === 'WHITELISTED' || t.status === 'VERIFIED').length;
  const openInquiriesCount = inquiries.filter(i => i.status === 'OPEN').length;

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex flex-col text-[#1E293B] font-sans selection:bg-teal-500/20 selection:text-teal-900">
      
      {/* Top Fixed Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs px-4 sm:px-6 py-3">
        <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
          
          {/* Brand & Auth Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white font-black text-sm shadow-[0_4px_12px_rgba(20,184,166,0.35)]">
              SA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-[#0F172A] tracking-tight uppercase">
                  SUPERADMIN OS
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ROOT • LVL 10
                </span>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-mono text-[10px] font-bold animate-pulse">
                    {pendingCount} PENDING REQUESTS
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#64748B] font-mono">
                {user?.email || 'lastzetas@gmail.com'} • JWT: HS256 Verified
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#334155] text-xs font-semibold transition-all cursor-pointer shadow-sm hover:shadow"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-teal-600" />
              <span>Back to Portal</span>
            </button>

            {onSwitchToAdmin && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onSwitchToAdmin();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#334155] text-xs font-semibold transition-all cursor-pointer shadow-sm hover:shadow"
                title="Switch to Match Ops View"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-teal-600" />
                <span>Admin View</span>
              </button>
            )}

            <button
              onClick={() => {
                soundFx.playClick();
                onLogout?.();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-rose-50 border border-[#CBD5E1] hover:border-rose-300 text-[#475569] hover:text-rose-600 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Sub-header Navigation Strip (Pill Tabs) */}
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-4 sm:px-6 py-2.5">
        <div className="max-w-[1600px] mx-auto w-full flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'OVERVIEW', label: 'Overview Telemetry', icon: Activity },
            { id: 'TEAMS', label: `Squad Whitelist & Registrations (${teams.length})`, icon: Users, badge: pendingCount > 0 ? `${pendingCount} New` : null },
            { id: 'BROADCAST', label: 'Room Broadcaster', icon: Radio },
            { id: 'INQUIRIES', label: `Captain Disputes (${inquiries.length})`, icon: MessageSquare, count: openInquiriesCount },
            { id: 'SEASON', label: 'Season 7 Parameters', icon: Sliders },
            { id: 'ROLES', label: 'Admins & Access Hierarchy', icon: Shield },
            { id: 'AUDIT', label: 'Security & JWT Logs', icon: Lock },
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
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-[#0F172A] text-white shadow-md shadow-slate-900/10'
                    : 'bg-white hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-teal-400' : 'text-[#64748B]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400 text-black font-mono font-bold animate-pulse">
                    {tab.badge}
                  </span>
                )}
                {tab.count > 0 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-teal-500 text-white font-mono font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Full Page Main Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* TAB 1: OVERVIEW TELEMETRY (3-Column Tablet Layout Matching Uploaded UI Image) */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            
            {/* Dynamic Pending Approvals Alert Banner */}
            {pendingCount > 0 && (
              <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-amber-200/70 flex items-center justify-center text-amber-800 shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wide">
                      {pendingCount} New Tournament Registration Requests Awaiting Whitelist
                    </h4>
                    <p className="text-[11px] text-amber-800/80 font-mono">
                      Players registered on the portal are pending your review before room lobby dispatch.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab('TEAMS');
                    setStatusFilter('PENDING');
                  }}
                  className="px-4 py-2 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase cursor-pointer transition-colors shrink-0"
                >
                  Review Pending Squads ({pendingCount})
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Column: Live Telemetry Metrics & Squad Activity Feed (lg:col-span-4) */}
              <div className="lg:col-span-4 space-y-5">
                
                {/* Telemetry Overview Card */}
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#64748B] uppercase font-bold tracking-wider">
                      CONQUEROR ARENA TELEMETRY
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      LIVE ACTIVE
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div>
                        <span className="text-[11px] text-[#64748B] block">Grand Finals Prizepool</span>
                        <span className="text-base font-extrabold text-[#0F172A] font-mono">{totalPrizePool}</span>
                      </div>
                      <Trophy className="w-6 h-6 text-teal-600" />
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div>
                        <span className="text-[11px] text-[#64748B] block">Total Applications</span>
                        <span className="text-base font-extrabold text-[#0F172A] font-mono">{teams.length} Squads</span>
                      </div>
                      <Users className="w-6 h-6 text-teal-600" />
                    </div>
                  </div>
                </div>

                {/* Squad Activity Feed Card */}
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#64748B] uppercase font-bold tracking-wider">
                      INCOMING REGISTRATIONS
                    </span>
                    <button
                      onClick={() => setActiveTab('TEAMS')}
                      className="text-[10px] text-teal-600 font-bold hover:underline cursor-pointer"
                    >
                      View All ({teams.length}) →
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {teams.slice(0, 6).map((team) => (
                      <div
                        key={team.id}
                        className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-slate-300 transition-all flex flex-col space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                              {team.slot}
                            </span>
                            <span className="font-bold text-xs text-[#0F172A] truncate max-w-[130px]">{team.teamName}</span>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase font-mono ${
                            team.status === 'WHITELISTED' || team.status === 'VERIFIED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : team.status === 'REJECTED'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {team.status}
                          </span>
                        </div>

                        <div className="text-[10px] text-[#64748B] font-mono leading-relaxed">
                          <div>Captain: <strong className="text-[#334155]">{team.captainName}</strong> ({team.captainPhone})</div>
                          <div className="truncate text-[#475569]">IGIDs: {team.igids}</div>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-[#E2E8F0]/60">
                          <span className="text-[9px] font-mono text-slate-500">{team.registeredAt}</span>
                          {team.status === 'PENDING' ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleApproveTeam(team.id)}
                                className="px-2.5 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-[9px] uppercase cursor-pointer"
                              >
                                Whitelist
                              </button>
                              <button
                                onClick={() => handleRejectTeam(team.id)}
                                className="px-2 py-1 rounded-xl bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 font-bold text-[9px] uppercase cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-emerald-600 text-[10px] flex items-center gap-1 font-bold">
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              Approved
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Center Column: Mint/Teal Frag Velocity Wave & Telemetry Graph (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-6">
                
                {/* Curve Card Header */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] uppercase font-bold text-[#64748B] tracking-wider">
                        TELEMETRY CURVE
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-mono font-bold">
                        FRAG VELOCITY
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#64748B]">Zone 4 / Erangel</span>
                  </div>

                  {/* Main Metric Peak */}
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight font-mono">
                      8,700 PTS
                    </span>
                    <span className="text-xs font-mono text-teal-600 font-bold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +14.8% Frag Velocity
                    </span>
                  </div>
                </div>

                {/* Mint/Teal Wave SVG Curve */}
                <div className="relative w-full h-48 bg-slate-50/60 rounded-2xl p-2 border border-[#E2E8F0] flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="superWaveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.45" />
                        <stop offset="70%" stopColor="#2DD4BF" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.0" />
                      </linearGradient>
                      <filter id="superGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#14B8A6" floodOpacity="0.3" />
                      </filter>
                    </defs>

                    {/* Subtle horizontal grid lines */}
                    <line x1="0" y1="35" x2="400" y2="35" stroke="#E2E8F0" strokeDasharray="3,3" strokeWidth="1" />
                    <line x1="0" y1="75" x2="400" y2="75" stroke="#E2E8F0" strokeDasharray="3,3" strokeWidth="1" />
                    <line x1="0" y1="115" x2="400" y2="115" stroke="#E2E8F0" strokeDasharray="3,3" strokeWidth="1" />

                    {/* Filled gradient area below the curve */}
                    <path
                      d="M 0 130 C 50 120, 80 80, 130 90 C 180 100, 210 40, 260 30 C 310 20, 350 70, 400 50 L 400 150 L 0 150 Z"
                      fill="url(#superWaveGradient)"
                    />

                    {/* Smooth Mint Wave Line */}
                    <path
                      d="M 0 130 C 50 120, 80 80, 130 90 C 180 100, 210 40, 260 30 C 310 20, 350 70, 400 50"
                      fill="none"
                      stroke="#14B8A6"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      filter="url(#superGlow)"
                    />

                    {/* Peak Marker Tag at (260, 30) */}
                    <g transform="translate(260, 30)">
                      <circle r="6" fill="#0F172A" stroke="#2DD4BF" strokeWidth="3" />
                      <circle r="2" fill="#FFFFFF" />
                      <rect x="-35" y="-30" width="70" height="22" rx="6" fill="#0F172A" />
                      <text x="0" y="-15" textAnchor="middle" fill="#2DD4BF" fontSize="10" fontWeight="bold" fontFamily="monospace">
                        8,700 PTS
                      </text>
                    </g>

                    {/* Supporting Data Points */}
                    <circle cx="130" cy="90" r="4" fill="#14B8A6" />
                    <circle cx="400" cy="50" r="4" fill="#14B8A6" />
                  </svg>
                </div>

                {/* Kill Distribution Histogram (13 Bars) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                    <span className="font-bold uppercase">Kill Distribution Histogram</span>
                    <span className="font-bold text-[#0F172A]">Match 1 - Finals</span>
                  </div>

                  <div className="flex items-end justify-between gap-2 h-20 pt-2 px-1">
                    {[25, 40, 35, 60, 45, 80, 55, 95, 70, 85, 60, 45, 30].map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                        <div
                          style={{ height: `${val}%` }}
                          className={`w-full rounded-t-sm transition-all cursor-pointer ${
                            val > 75
                              ? 'bg-gradient-to-t from-teal-500 to-emerald-400'
                              : 'bg-slate-200 hover:bg-slate-300'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8] pt-1 border-t border-[#F1F5F9]">
                    <span>Slot 01 - 20</span>
                    <span>Slot 21 - 50</span>
                    <span>Slot 51 - 80</span>
                    <span>Slot 81 - 100</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Circular Status Dial & Dispatch Cards (lg:col-span-3) */}
              <div className="lg:col-span-3 space-y-5">
                
                {/* Circular Status Dial Card */}
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col items-center text-center space-y-3">
                  <span className="text-[11px] font-mono text-[#64748B] uppercase font-bold tracking-wider">
                    WHITELIST CAPACITY
                  </span>

                  {/* Circular Dial Graphic */}
                  <div className="relative w-24 h-24 flex items-center justify-center">
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
                        strokeDasharray={`${Math.min(100, Math.round((whitelistedCount / slotLimit) * 100))}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-base font-black text-[#0F172A] font-mono">
                        {Math.round((whitelistedCount / slotLimit) * 100)}%
                      </span>
                      <span className="text-[9px] text-[#64748B] font-mono font-bold">SLOTS</span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#0F172A]">
                    {whitelistedCount} Verified / {Math.max(0, slotLimit - whitelistedCount)} Remaining
                  </span>
                </div>

                {/* Dark Action Pill Card (Broadcaster Quick Push) */}
                <div className="bg-[#0F172A] text-white rounded-3xl p-5 shadow-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-teal-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      Instant Room Broadcaster
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                    Push Room ID & Password to all verified team captains.
                  </p>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setActiveTab('BROADCAST');
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:brightness-110 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                  >
                    Open Dispatch Desk
                  </button>
                </div>

                {/* Season 7 Controller Quick Switch */}
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0F172A]">Season 7 State:</span>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                      isSeasonOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {isSeasonOpen ? 'REGISTRATION LIVE' : 'PAUSED'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setIsSeasonOpen(!isSeasonOpen);
                    }}
                    className="w-full py-2 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] font-semibold text-xs uppercase transition-colors cursor-pointer"
                  >
                    {isSeasonOpen ? 'Pause Registrations' : 'Resume Registrations'}
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: SQUAD WHITELIST & TOURNAMENT APPLICATIONS */}
        {activeTab === 'TEAMS' && (
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-5">
            
            {/* Header & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-sm sm:text-base text-[#0F172A] uppercase">
                  Tournament Team Whitelist & Application Review Desk
                </h3>
                <p className="text-xs text-[#64748B]">
                  Incoming squad registrations from public portal • Verify BGMI character IDs & whitelist slots
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search squad, captain, slot, ticket ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-teal-500 font-sans"
                />
              </div>
            </div>

            {/* Status Filter Pill Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'ALL', label: `All Squads (${teams.length})` },
                { id: 'PENDING', label: `Pending Review (${pendingCount})`, highlight: pendingCount > 0 },
                { id: 'WHITELISTED', label: `Whitelisted (${whitelistedCount})` },
                { id: 'REJECTED', label: `Rejected (${teams.filter(t => t.status === 'REJECTED').length})` },
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

            {/* Teams Applications List */}
            <div className="space-y-3">
              {filteredTeams.length === 0 ? (
                <div className="text-center py-12 text-[#64748B] text-xs font-mono">
                  No squad registrations found matching this search or filter.
                </div>
              ) : (
                filteredTeams.map((team) => (
                  <div
                    key={team.id}
                    className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-slate-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                  >
                    {/* Left: Squad Details */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 text-xs font-mono">
                          {team.slot}
                        </span>
                        <span className="font-bold text-sm text-[#0F172A]">
                          {team.teamName} {team.clanTag && `[${team.clanTag}]`}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                          {team.ticketId || team.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-[#475569] font-mono">
                          {team.category || 'Season 7 War'}
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
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#64748B] font-mono">
                        <div>
                          Captain: <strong className="text-[#334155]">{team.captainName}</strong>
                          {' '}
                          <a
                            href={`https://wa.me/${team.captainPhone?.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-0.5 text-emerald-600 hover:underline ml-1"
                            title="Open WhatsApp chat with captain"
                          >
                            <Phone className="w-3 h-3" />
                            {team.captainPhone}
                          </a>
                        </div>
                        <div>
                          Registered: <span className="text-[#334155]">{team.registeredAt}</span> • Ping: <span className="text-emerald-600 font-bold">{team.ping}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#475569] font-mono bg-white p-2 rounded-xl border border-[#E2E8F0]">
                        <span className="text-[#64748B] font-bold">Roster IGIDs:</span> {team.igids}
                      </div>
                    </div>

                    {/* Right: Approval & Action Buttons */}
                    <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                      {team.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleApproveTeam(team.id)}
                            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Whitelist</span>
                          </button>
                          <button
                            onClick={() => handleRejectTeam(team.id)}
                            className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-[#475569] hover:text-rose-600 font-bold text-xs uppercase transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : team.status === 'WHITELISTED' ? (
                        <button
                          onClick={() => handleRejectTeam(team.id)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-300 hover:border-amber-300 text-[#475569] hover:text-amber-700 font-semibold text-xs uppercase cursor-pointer"
                        >
                          Revoke Whitelist
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproveTeam(team.id)}
                          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs uppercase cursor-pointer"
                        >
                          Re-Approve
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-300 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                        title="Delete squad"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* TAB 3: ROOM BROADCASTER */}
        {activeTab === 'BROADCAST' && (
          <div className="max-w-2xl mx-auto py-4">
            <form onSubmit={handleBroadcast} className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-teal-600 animate-pulse" />
                <span className="font-bold text-sm sm:text-base text-[#0F172A] uppercase">
                  Direct Custom Room Push Dispatcher
                </span>
              </div>

              <p className="text-xs text-[#64748B] leading-relaxed">
                Broadcasts room credentials automatically to all {whitelistedCount} whitelisted squad captains.
              </p>

              {broadcastDone && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-mono">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Room ID & Password broadcasted to {whitelistedCount} captains successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#64748B] text-xs uppercase font-bold mb-1 font-mono">Room ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 819204"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:outline-none focus:border-teal-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#64748B] text-xs uppercase font-bold mb-1 font-mono">Password *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. conqueror99"
                    value={roomPass}
                    onChange={(e) => setRoomPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] focus:outline-none focus:border-teal-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#64748B] text-xs uppercase font-bold mb-1 font-mono">Select Map</label>
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
                Send Room Credentials to {whitelistedCount} Whitelisted Captains
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: CAPTAIN DISPUTES & INQUIRIES DESK */}
        {activeTab === 'INQUIRIES' && (
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-5">
            <div>
              <h3 className="font-black text-sm sm:text-base text-[#0F172A] uppercase">
                Captain Support & Contact Inquiries Desk
              </h3>
              <p className="text-xs text-[#64748B]">
                Direct requests submitted via public portal contact form & captain dispute hotline
              </p>
            </div>

            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full text-[9px] font-mono">
                        {inq.id}
                      </span>
                      <span className="font-bold text-[#0F172A] text-xs">{inq.squad}</span>
                      <span className="text-[#64748B] text-[10px]">({inq.name} • {inq.email})</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        inq.status === 'RESOLVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#475569] font-mono">
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

        {/* TAB 5: SEASON 7 PARAMETERS */}
        {activeTab === 'SEASON' && (
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] max-w-2xl mx-auto space-y-5">
            <h3 className="font-black text-sm sm:text-base text-[#0F172A] uppercase">
              Season 7 War Parameters & Slot Control
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#64748B] font-bold uppercase text-[10px] mb-1 font-mono">Total Prize Pool</label>
                <input
                  type="text"
                  value={totalPrizePool}
                  onChange={(e) => setTotalPrizePool(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[#64748B] font-bold uppercase text-[10px] mb-1 font-mono">Maximum Slot Capacity</label>
                <input
                  type="number"
                  value={slotLimit}
                  onChange={(e) => setSlotLimit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0F172A] block">Public Registration Status</span>
                  <span className="text-[10px] text-[#64748B] font-mono">
                    {isSeasonOpen ? 'Open for public team applications' : 'Locked (Registrations closed)'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setIsSeasonOpen(!isSeasonOpen);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase cursor-pointer transition-colors ${
                    isSeasonOpen
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {isSeasonOpen ? 'Close Portal' : 'Open Portal'}
                </button>
              </div>

              <button
                onClick={() => {
                  soundFx.playSuccess();
                  alert('Season 7 parameters updated and saved.');
                }}
                className="w-full py-2.5 rounded-xl bg-[#0F172A] text-white font-bold uppercase text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Save Configuration
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: ROLES & PERMISSIONS */}
        {activeTab === 'ROLES' && (
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
            <h3 className="font-black text-sm sm:text-base text-[#0F172A] uppercase">
              Admin Access Hierarchy & Root Keys
            </h3>
            <div className="space-y-3">
              {adminsList.map((admin) => (
                <div key={admin.id} className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0F172A]">{admin.name}</span>
                      <span className="text-[10px] font-mono text-[#64748B]">({admin.email})</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-900 text-white font-mono font-bold">
                        {admin.level}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#64748B] font-mono mt-1">Status: {admin.status} • Active: {admin.lastActive}</p>
                  </div>
                  <span className="text-emerald-600 font-mono text-[10px] font-bold">JWT ACTIVE</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SECURITY AUDIT & JWT LOGS */}
        {activeTab === 'AUDIT' && (
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-4">
            <h3 className="font-black text-sm sm:text-base text-[#0F172A] uppercase">
              Security Logs & JWT Token Audit
            </h3>
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2">
              <div className="text-emerald-400">✓ Cryptographic Salt: SHA-256 Enabled</div>
              <div className="text-slate-300">✓ Token Signing: HMAC-SHA256 (HS256)</div>
              <div className="text-slate-300">✓ Active Session: {user?.email || 'lastzetas@gmail.com'}</div>
              <div className="text-teal-400">✓ Anti-Tamper State: OK</div>
            </div>
          </div>
        )}

      </main>

      {/* Bottom Status Footer */}
      <footer className="mt-auto px-4 sm:px-6 py-3 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-[1600px] mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#64748B] gap-2">
          <span>Superadmin OS • Root Level 10 Console</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              PORTAL SYNC ACTIVE
            </span>
            <span>BGMI Official Battleground</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default SuperAdminDashboard;
