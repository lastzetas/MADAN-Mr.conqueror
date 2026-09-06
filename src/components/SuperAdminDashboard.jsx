import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, Users, Trophy, Radio, Send, LogOut, Check,
  AlertCircle, Key, Activity, RefreshCw, FileText,
  Sliders, ArrowRightLeft, Lock, Search, Filter, Plus, ChevronRight,
  TrendingUp, Wifi, CheckCircle2, Sparkles, Cpu, Award, ArrowLeft, Home,
  Clock, XCircle, Trash2, Copy, MessageSquare, ExternalLink, Phone,
  UserCheck, Swords, User, BarChart2, DollarSign, Menu, X, Save, Upload
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import {
  getStoredRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  clearAllRegistrations,
  subscribeToLivePortalUpdates,
  getStoredInquiries,
  resolveInquiry,
  getStoredTournaments,
  saveTournament,
  deleteTournament,
  getStoredHallOfFame,
  saveHallOfFame,
  resetHallOfFameToDefault,
  getStoredPolls,
  savePoll,
  getStoredSponsors,
  saveSponsor,
  deleteSponsor,
  getStoredRoomBroadcast,
  saveRoomBroadcast,
  createTeamWithCredentials
} from '../utils/portalData';
import { uploadToCloudinary } from '../utils/cloudinary';
import confetti from 'canvas-confetti';

export const SuperAdminDashboard = ({ user, onLogout, onSwitchToAdmin, onBackToPortal }) => {
  const [activeTab, setActiveTab] = useState('REGISTRATIONS');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [matchTypeFilter, setMatchTypeFilter] = useState('ALL'); // 'ALL' | 'SOLO' | 'DUO' | 'SQUAD'
  const [copiedId, setCopiedId] = useState(null);

  // Real-time Registrations & Inquiries
  const [teams, setTeams] = useState(getStoredRegistrations());
  const [inquiries, setInquiries] = useState(getStoredInquiries());

  // Dynamic modules state
  const [tournaments, setTournaments] = useState(getStoredTournaments());
  const [hallOfFame, setHallOfFame] = useState(getStoredHallOfFame());
  const [hofFormat, setHofFormat] = useState('SQUAD'); // 'SOLO' | 'DUO' | 'SQUAD'
  const [polls, setPolls] = useState(getStoredPolls());
  const [sponsors, setSponsors] = useState(getStoredSponsors());
  const [roomBroadcast, setRoomBroadcast] = useState(getStoredRoomBroadcast());

  // Admins List
  const [adminsList, setAdminsList] = useState([
    { id: 1, email: 'lastzetas@gmail.com', name: 'Last Zetas (Root)', role: 'SUPER_ADMIN', level: 'Level 10 (Root)', status: 'ACTIVE', lastActive: 'Now' },
    { id: 2, email: 'admin@madan.in', name: 'Match Ops Lead', role: 'ADMIN', level: 'Level 5 (Ops)', status: 'ACTIVE', lastActive: '14 mins ago' },
    { id: 3, email: 'anticheat@madan.gg', name: 'Anti-Cheat Sentinel', role: 'MODERATOR', level: 'Level 3 (Security)', status: 'ACTIVE', lastActive: '1 hour ago' },
  ]);

  // Forms State
  const [newTourney, setNewTourney] = useState({
    title: '',
    format: 'Squad War',
    map: 'Erangel',
    date: 'June 20, 2026',
    prize: '₹2,50,000 INR',
    slots: '25 Squads Limit',
    status: 'ACTIVE',
    tag: 'BOTSQUADWAR'
  });
  const [showAddTourney, setShowAddTourney] = useState(false);

  const [newPoll, setNewPoll] = useState({
    question: '',
    description: '',
    option1: '',
    option2: '',
    option3: '',
    option4: ''
  });
  const [showAddPoll, setShowAddPoll] = useState(false);

  const [newSponsor, setNewSponsor] = useState({
    name: '',
    category: 'Title Energy Partner',
    tier: 'TITLE',
    logo: '',
    link: 'https://',
    tagline: 'Official Competitive Partner',
    status: 'ACTIVE'
  });
  const [showAddSponsor, setShowAddSponsor] = useState(false);
  const [isUploadingSponsorLogo, setIsUploadingSponsorLogo] = useState(false);
  const sponsorFileRef = useRef(null);

  // Team Direct Creation State
  const [newTeamData, setNewTeamData] = useState({
    teamName: '',
    iglName: '',
    iglPhone: '',
    matchType: 'SQUAD',
    passcode: ''
  });
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);

  // Room Broadcast State
  const [broadcastForm, setBroadcastForm] = useState(roomBroadcast);
  const [broadcastSavedNotice, setBroadcastSavedNotice] = useState(false);

  // Hall of Fame temporary edit buffer
  const [hofEditBuffer, setHofEditBuffer] = useState(() => getStoredHallOfFame('SQUAD'));

  useEffect(() => {
    setHofEditBuffer(getStoredHallOfFame(hofFormat));
  }, [hofFormat]);

  // Connect to Live Subscription Stream (SSE + Cloud + Local)
  useEffect(() => {
    const unsubscribe = subscribeToLivePortalUpdates((updatedList) => {
      setTeams(updatedList);
    });

    const handleInquiriesUpdate = () => setInquiries(getStoredInquiries());
    const handleTourneysUpdate = () => setTournaments(getStoredTournaments());
    const handleHofUpdate = () => setHallOfFame(getStoredHallOfFame());
    const handlePollsUpdate = () => setPolls(getStoredPolls());
    const handleSponsorsUpdate = () => setSponsors(getStoredSponsors());
    const handleBroadcastUpdate = () => setRoomBroadcast(getStoredRoomBroadcast());

    window.addEventListener('portal_inquiries_updated', handleInquiriesUpdate);
    window.addEventListener('portal_tournaments_updated', handleTourneysUpdate);
    window.addEventListener('portal_hof_updated', handleHofUpdate);
    window.addEventListener('portal_polls_updated', handlePollsUpdate);
    window.addEventListener('portal_sponsors_updated', handleSponsorsUpdate);
    window.addEventListener('portal_room_broadcast_updated', handleBroadcastUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('portal_inquiries_updated', handleInquiriesUpdate);
      window.removeEventListener('portal_tournaments_updated', handleTourneysUpdate);
      window.removeEventListener('portal_hof_updated', handleHofUpdate);
      window.removeEventListener('portal_polls_updated', handlePollsUpdate);
      window.removeEventListener('portal_sponsors_updated', handleSponsorsUpdate);
      window.removeEventListener('portal_room_broadcast_updated', handleBroadcastUpdate);
    };
  }, []);

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

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    soundFx.playSuccess();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Hall of Fame Save
  const handleSaveHof = () => {
    soundFx.playVictory();
    saveHallOfFame(hofFormat, hofEditBuffer);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    alert(`Top 10 Points Table for ${hofFormat} successfully saved and synced to public Hall of Fame!`);
  };

  const handleHofCellChange = (index, field, value) => {
    const updated = [...hofEditBuffer];
    const isNum = ['wwcd', 'kills', 'placementPts', 'totalPts', 'total', 'rank'].includes(field);
    const cleanVal = isNum ? (Number(value) || 0) : value;

    updated[index] = {
      ...updated[index],
      [field]: cleanVal
    };

    if (field === 'teamName') {
      updated[index].name = value;
    } else if (field === 'name') {
      updated[index].teamName = value;
    }

    if (field === 'kills' || field === 'placementPts') {
      const calcTotal = (Number(updated[index].kills) || 0) + (Number(updated[index].placementPts) || 0);
      updated[index].total = calcTotal;
      updated[index].totalPts = calcTotal;
    }
    setHofEditBuffer(updated);
  };

  const handleResetHof = () => {
    if (window.confirm(`Reset ${hofFormat} Top 10 to official default standings?`)) {
      soundFx.playClick();
      const updated = resetHallOfFameToDefault(hofFormat);
      if (updated && updated[hofFormat]) {
        setHofEditBuffer(updated[hofFormat]);
      } else {
        setHofEditBuffer(getStoredHallOfFame(hofFormat));
      }
    }
  };

  // Tournaments Handler
  const handleCreateTournament = (e) => {
    e.preventDefault();
    soundFx.playVictory();
    saveTournament(newTourney);
    setShowAddTourney(false);
    setNewTourney({
      title: '',
      format: 'Squad War',
      map: 'Erangel',
      date: 'June 20, 2026',
      prize: '₹2,50,000 INR',
      slots: '25 Squads Limit',
      status: 'ACTIVE',
      tag: 'BOTSQUADWAR'
    });
  };

  const handleDeleteTournament = (id) => {
    if (window.confirm('Delete this tournament?')) {
      soundFx.playClick();
      deleteTournament(id);
    }
  };

  // Polls Handler
  const handleCreatePoll = (e) => {
    e.preventDefault();
    soundFx.playVictory();
    const options = [newPoll.option1, newPoll.option2, newPoll.option3, newPoll.option4].filter(Boolean);
    savePoll({
      question: newPoll.question,
      description: newPoll.description,
      options: options.map(opt => ({ text: opt, votes: 0 }))
    });
    setShowAddPoll(false);
    setNewPoll({ question: '', description: '', option1: '', option2: '', option3: '', option4: '' });
  };

  // Sponsors Handler
  const handleSponsorLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingSponsorLogo(true);
    try {
      const res = await uploadToCloudinary(file, { folder: 'madan_sponsors' });
      if (res.success && res.secure_url) {
        setNewSponsor(prev => ({ ...prev, logo: res.secure_url }));
      }
    } catch (err) {
      console.warn('Upload error:', err);
    } finally {
      setIsUploadingSponsorLogo(false);
    }
  };

  const handleCreateSponsor = (e) => {
    e.preventDefault();
    soundFx.playVictory();
    saveSponsor(newSponsor);
    setShowAddSponsor(false);
    setNewSponsor({
      name: '',
      category: 'Title Energy Partner',
      tier: 'TITLE',
      logo: '',
      link: 'https://',
      tagline: 'Official Competitive Partner',
      status: 'ACTIVE'
    });
  };

  // Create Team Direct
  const handleCreateTeamDirect = (e) => {
    e.preventDefault();
    soundFx.playVictory();
    const result = createTeamWithCredentials(newTeamData);
    setShowCreateTeamModal(false);
    setNewTeamData({ teamName: '', iglName: '', iglPhone: '', matchType: 'SQUAD', passcode: '' });
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    alert(`Team created successfully!
Ticket ID: ${result.team.ticketId}
Passcode: ${result.team.passcode}
Slot: ${result.team.slot}`);
  };

  // Broadcast Handler
  const handleSaveBroadcast = (e) => {
    e.preventDefault();
    soundFx.playVictory();
    saveRoomBroadcast(broadcastForm);
    setBroadcastSavedNotice(true);
    setTimeout(() => setBroadcastSavedNotice(false), 4000);
  };

  // Filtered teams list
  const filteredTeams = teams.filter(t => {
    const teamName = t.teamName || t.name || '';
    const iglName = t.iglName || t.captainName || t.captain || '';
    const slot = t.slot || '';
    const ticketId = t.ticketId || '';
    const igids = t.igids || '';
    const matchType = (t.matchType || 'SQUAD').toUpperCase();

    const matchesSearch =
      teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iglName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      igids.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'PENDING' && t.status === 'PENDING') ||
      (statusFilter === 'VERIFIED' && (t.status === 'VERIFIED' || t.status === 'WHITELISTED')) ||
      (statusFilter === 'REJECTED' && t.status === 'REJECTED');

    const matchesType = matchTypeFilter === 'ALL' || matchType === matchTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingCount = teams.filter(t => t.status === 'PENDING').length;
  const whitelistedCount = teams.filter(t => t.status === 'WHITELISTED' || t.status === 'VERIFIED').length;

  const sidebarMenuItems = [
    { id: 'REGISTRATIONS', label: 'Registration Requests', icon: Swords, badge: pendingCount > 0 ? `${pendingCount}` : null },
    { id: 'HALL_OF_FAME', label: 'Hall of Fame (Top 10s)', icon: Trophy },
    { id: 'TOURNAMENTS', label: 'Tournaments Manager', icon: Sliders },
    { id: 'POLLS', label: 'Live Fan Polls', icon: BarChart2 },
    { id: 'SPONSORS', label: 'Sponsors & Supporters', icon: DollarSign },
    { id: 'TEAMS_DISPATCH', label: 'Create Teams & Dispatcher', icon: Radio },
    { id: 'ROLES', label: 'Admin Security Hierarchy', icon: Shield },
    { id: 'TELEMETRY', label: 'Server Ping Matrix', icon: Wifi }
  ];

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex text-[#1E293B] font-sans selection:bg-teal-500/20 selection:text-teal-900">
      
      {/* 1. DEDICATED LEFT DESKTOP SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#070A10] text-[#E2E8F0] border-r border-[#1E2536] flex flex-col justify-between transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Top Brand Logo Strip */}
        <div>
          <div className="p-4 border-b border-[#1E2536] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-400 to-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-[0_4px_12px_rgba(20,184,166,0.35)]">
                SA
              </div>
              <div>
                <span className="font-extrabold text-sm text-white tracking-tight uppercase block font-montserrat">
                  SUPERADMIN OS
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ROOT • LEVEL 10
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items List */}
          <nav className="p-3 space-y-1.5">
            <span className="text-[9px] font-mono uppercase text-[#64748B] tracking-wider px-2 py-1 block">
              SUPERADMIN MODULES
            </span>

            {sidebarMenuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-montserrat font-bold tracking-tight transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md shadow-teal-900/30'
                      : 'text-[#94A3B8] hover:bg-[#141A26] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#64748B]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono text-[9px] font-extrabold animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Auth Profile Box */}
        <div className="p-4 border-t border-[#1E2536] bg-[#04060A] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-white font-bold block">@{user?.username || 'lastzetas'}</span>
              <span className="text-[10px] text-emerald-400">Root Access • SHA-256</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-bold">
              ROOT
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundFx.playClick();
                onBackToPortal?.();
              }}
              className="py-1.5 px-2 rounded-xl bg-[#141A26] hover:bg-[#1E2536] text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
              <span>Portal</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onLogout?.();
              }}
              className="py-1.5 px-2 rounded-xl bg-[#141A26] hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

      </aside>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      {/* 2. MAIN WORKSPACE CONTAINER (OFFSET BY SIDEBAR ON DESKTOP) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-[#0F172A] tracking-tight uppercase">
                {sidebarMenuItems.find(i => i.id === activeTab)?.label || 'SUPERADMIN OS'}
              </h2>
              <p className="text-[11px] text-[#64748B] font-mono">
                Full Root Authority & Zero-Latency Real-Time Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateTeamModal(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Create Team</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onBackToPortal?.();
              }}
              className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-[#CBD5E1] text-[#334155] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Back to Portal</span>
            </button>
          </div>
        </header>

        {/* 3. MAIN DESK WORKSPACE CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
          
          {/* ==================================================== */}
          {/* VIEW 1: REGISTRATION REQUESTS (SOLO, DUO, SQUAD) */}
          {/* ==================================================== */}
          {activeTab === 'REGISTRATIONS' && (
            <div className="space-y-6">
              
              {/* Metric Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { label: 'ALL APPLICATIONS', value: `${teams.length}`, tag: 'ROOT FEED' },
                  { label: 'SOLO REQUESTS', value: `${teams.filter(t => t.matchType === 'SOLO').length}`, tag: 'SOLO' },
                  { label: 'DUO REQUESTS', value: `${teams.filter(t => t.matchType === 'DUO').length}`, tag: 'DUO' },
                  { label: 'SQUAD REQUESTS', value: `${teams.filter(t => (t.matchType || 'SQUAD') === 'SQUAD').length}`, tag: 'SQUAD' }
                ].map((m, i) => (
                  <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs">
                    <span className="text-[10px] font-mono text-[#64748B] font-bold block mb-1">{m.label}</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-[#0F172A] font-mono">{m.value}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-bold font-mono">
                        {m.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Card with Format Tabs & Search */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Format Filter Tabs */}
                  <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#F1F5F9] border border-[#CBD5E1]">
                    {[
                      { id: 'ALL', label: `All (${teams.length})` },
                      { id: 'SOLO', label: `Solo (${teams.filter(t => t.matchType === 'SOLO').length})` },
                      { id: 'DUO', label: `Duo (${teams.filter(t => t.matchType === 'DUO').length})` },
                      { id: 'SQUAD', label: `Squad (${teams.filter(t => (t.matchType || 'SQUAD') === 'SQUAD').length})` },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          soundFx.playClick();
                          setMatchTypeFilter(tab.id);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                          matchTypeFilter === tab.id
                            ? 'bg-[#0F172A] text-white shadow-sm'
                            : 'text-[#64748B] hover:text-[#0F172A]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar */}
                  <div className="relative sm:w-72">
                    <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search squad, IGL, slot, ticket, IGID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-teal-500 font-sans"
                    />
                  </div>
                </div>

                {/* Status Chips */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {[
                    { id: 'ALL', label: `All Status` },
                    { id: 'PENDING', label: `Pending (${pendingCount})`, highlight: pendingCount > 0 },
                    { id: 'WHITELISTED', label: `Whitelisted (${whitelistedCount})` },
                    { id: 'REJECTED', label: `Rejected` },
                  ].map((chip) => (
                    <button
                      key={chip.id}
                      onClick={() => {
                        soundFx.playClick();
                        setStatusFilter(chip.id);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
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

                {/* Teams List Cards */}
                <div className="space-y-4">
                  {filteredTeams.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto shadow-xs">
                        <Users className="w-6 h-6" />
                      </div>
                      <h4 className="font-extrabold text-sm text-[#0F172A] uppercase">
                        No Registrations in Queue
                      </h4>
                      <p className="text-xs text-[#64748B] max-w-md mx-auto font-mono">
                        Live registrations from public JOIN NOW portal will display here instantly.
                      </p>
                    </div>
                  ) : (
                    filteredTeams.map((team) => (
                      <div
                        key={team.id}
                        className="p-4 sm:p-5 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-slate-300 transition-all flex flex-col space-y-4 shadow-xs"
                      >
                        {/* Header Row */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 text-xs font-mono">
                              {team.slot}
                            </span>
                            {team.clanLogo && (
                              <img src={team.clanLogo} alt="Logo" className="w-7 h-7 rounded-lg object-cover border border-slate-300" />
                            )}
                            <h4 className="font-extrabold text-sm sm:text-base text-[#0F172A]">
                              {team.teamName || team.name} {team.clanTag && <span className="text-slate-500 font-mono">[{team.clanTag}]</span>}
                            </h4>
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-mono font-bold">
                              🎫 {team.ticketId || team.id}
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
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold">
                              PIN: {team.passcode || '778899'}
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

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                            {team.status === 'PENDING' ? (
                              <>
                                <button
                                  onClick={() => handleApproveTeam(team.id)}
                                  className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Whitelist</span>
                                </button>
                                <button
                                  onClick={() => handleRejectTeam(team.id)}
                                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-slate-300 text-rose-600 font-bold text-xs uppercase cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleApproveTeam(team.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 font-bold text-xs uppercase cursor-pointer"
                              >
                                Whitelisted ✓
                              </button>
                            )}

                            <button
                              onClick={() => handleCopyText(team.igids, team.id)}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-[#334155] font-semibold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3 text-teal-600" />
                              <span>{copiedId === team.id ? 'Copied!' : 'Copy IGIDs'}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteTeam(team.id)}
                              className="p-1.5 rounded-xl bg-white hover:bg-rose-50 border border-slate-300 text-slate-400 hover:text-rose-600 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Leader Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono bg-white p-3 rounded-2xl border border-[#E2E8F0]">
                          <div>
                            <span className="text-[#64748B] block text-[10px] uppercase font-bold">
                              Leader / IGL:
                            </span>
                            <strong className="text-[#0F172A]">{team.iglName || team.captainName}</strong>
                          </div>
                          <div>
                            <span className="text-[#64748B] block text-[10px] uppercase font-bold">
                              WhatsApp:
                            </span>
                            <a
                              href={`https://wa.me/${(team.iglPhone || team.captainPhone)?.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-emerald-600 font-bold hover:underline"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{team.iglPhone || team.captainPhone}</span>
                            </a>
                          </div>
                          <div>
                            <span className="text-[#64748B] block text-[10px] uppercase font-bold">Category:</span>
                            <span className="text-[#334155]">{team.category || 'Official Tournament'}</span>
                          </div>
                        </div>

                        {/* Roster & Numeric IGIDs */}
                        <div>
                          <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold block mb-1.5">
                            Roster & Character In-Game IDs:
                          </span>
                          <div className={`grid gap-2 text-xs font-mono ${
                            team.matchType === 'SOLO'
                              ? 'grid-cols-1 max-w-xs'
                              : team.matchType === 'DUO'
                              ? 'grid-cols-1 sm:grid-cols-2 max-w-xl'
                              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                          }`}>
                            {(team.players || []).map((player, idx) => (
                              <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#E2E8F0]">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-[#0F172A] truncate">{player.name}</span>
                                  <span className="text-[9px] px-1 rounded bg-slate-100 text-[#475569]">{player.role}</span>
                                </div>
                                <div className="mt-1 text-[11px] text-teal-700 font-bold">
                                  IGID: {player.id}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 2: HALL OF FAME TOP 10 POINTS TABLES (SOLO, DUO, SQUAD) */}
          {/* ==================================================== */}
          {activeTab === 'HALL_OF_FAME' && (
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
                <div>
                  <h3 className="font-montserrat font-extrabold text-base text-[#0F172A] uppercase flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#E5C05B]" />
                    <span>Hall of Fame Top 10 Points Table Editor</span>
                  </h3>
                  <p className="text-xs text-[#64748B] font-rajdhani">
                    Edit and sync official rankings for Solo, Duo, and Squad leaderboards across the portal.
                  </p>
                </div>

                {/* Format Switcher */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center p-1 rounded-2xl bg-[#F1F5F9] border border-[#CBD5E1]">
                    {['SQUAD', 'DUO', 'SOLO'].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => {
                          soundFx.playClick();
                          setHofFormat(fmt);
                        }}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                          hofFormat === fmt
                            ? 'bg-[#0F172A] text-white shadow-sm'
                            : 'text-[#64748B] hover:text-[#0F172A]'
                        }`}
                      >
                        {fmt} TOP 10
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleResetHof}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer transition-all border border-slate-300"
                    title="Reset to default 10 rankings"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>

                  <button
                    onClick={handleSaveHof}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save {hofFormat} Table</span>
                  </button>
                </div>
              </div>

              {/* 10-Row Points Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[10px] font-mono text-[#64748B] uppercase">
                      <th className="py-2.5 px-3">Rank</th>
                      <th className="py-2.5 px-3">Team / Player Name</th>
                      <th className="py-2.5 px-3">Clan Tag</th>
                      <th className="py-2.5 px-3 text-center">WWCD 👑</th>
                      <th className="py-2.5 px-3 text-center">Kills 🎯</th>
                      <th className="py-2.5 px-3 text-center">Placement Pts</th>
                      <th className="py-2.5 px-3 text-center font-bold text-teal-700">Total Pts 🔥</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] font-mono">
                    {hofEditBuffer.map((team, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-[#0F172A]">
                          #{team.rank || idx + 1}
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={team.teamName || team.name || ''}
                            onChange={(e) => handleHofCellChange(idx, 'teamName', e.target.value)}
                            className="w-full max-w-xs px-2.5 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] font-sans text-xs focus:border-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={team.clanTag || ''}
                            onChange={(e) => handleHofCellChange(idx, 'clanTag', e.target.value)}
                            className="w-24 px-2 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-xs focus:border-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            value={team.wwcd || 0}
                            onChange={(e) => handleHofCellChange(idx, 'wwcd', e.target.value)}
                            className="w-16 text-center px-2 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-xs focus:border-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            value={team.kills || 0}
                            onChange={(e) => handleHofCellChange(idx, 'kills', e.target.value)}
                            className="w-16 text-center px-2 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-xs focus:border-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            value={team.placementPts || 0}
                            onChange={(e) => handleHofCellChange(idx, 'placementPts', e.target.value)}
                            className="w-16 text-center px-2 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-xs focus:border-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-teal-700 text-sm">
                          {team.total || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 3: TOURNAMENTS MANAGER */}
          {/* ==================================================== */}
          {activeTab === 'TOURNAMENTS' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs">
                <div>
                  <h3 className="font-montserrat font-extrabold text-base text-[#0F172A] uppercase">
                    Upcoming Tournaments Portal Manager
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Post, update, and schedule competitive events visible on the public landing page.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddTourney(!showAddTourney)}
                  className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4 text-teal-400" />
                  <span>{showAddTourney ? 'Cancel' : 'Post New Tournament'}</span>
                </button>
              </div>

              {/* Add Tournament Form Modal/Accordion */}
              {showAddTourney && (
                <form onSubmit={handleCreateTournament} className="bg-white border border-[#CBD5E1] rounded-3xl p-6 shadow-md space-y-4">
                  <h4 className="font-extrabold text-sm text-[#0F172A] uppercase">Create & Post Tournament</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tournament Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Conqueror Season 7 Bot Squad War"
                        value={newTourney.title}
                        onChange={(e) => setNewTourney({ ...newTourney, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Prize Pool *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ₹2,50,000 INR"
                        value={newTourney.prize}
                        onChange={(e) => setNewTourney({ ...newTourney, prize: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Match Map</label>
                      <select
                        value={newTourney.map}
                        onChange={(e) => setNewTourney({ ...newTourney, map: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none"
                      >
                        <option>Erangel</option>
                        <option>Miramar</option>
                        <option>Sanhok</option>
                        <option>Vikendi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Format & Tag</label>
                      <input
                        type="text"
                        placeholder="e.g. BOTSQUADWAR"
                        value={newTourney.tag}
                        onChange={(e) => setNewTourney({ ...newTourney, tag: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase cursor-pointer transition-all"
                  >
                    Publish to Public Website
                  </button>
                </form>
              )}

              {/* Tournaments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tournaments.map((t) => (
                  <div key={t.id} className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 border border-teal-200 text-teal-700 font-bold uppercase">
                          {t.tag || 'BOTSQUADWAR'}
                        </span>
                        <h4 className="font-extrabold text-sm sm:text-base text-[#0F172A] mt-1">{t.title}</h4>
                        <p className="text-xs text-[#64748B] font-mono mt-0.5">{t.date} • {t.prize}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteTournament(t.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                        title="Delete Tournament"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                      <div>
                        <span className="text-[#64748B] block text-[9px] uppercase">Map</span>
                        <strong>{t.map}</strong>
                      </div>
                      <div>
                        <span className="text-[#64748B] block text-[9px] uppercase">Format</span>
                        <strong>{t.format}</strong>
                      </div>
                      <div>
                        <span className="text-[#64748B] block text-[9px] uppercase">Slots</span>
                        <strong>{t.slots}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 4: LIVE FAN POLLS */}
          {/* ==================================================== */}
          {activeTab === 'POLLS' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs">
                <div>
                  <h3 className="font-montserrat font-extrabold text-base text-[#0F172A] uppercase">
                    Live Community & Fan Polls
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Active polls are displayed directly on the public portal for viewers and gamers to cast votes.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddPoll(!showAddPoll)}
                  className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 text-teal-400" />
                  <span>{showAddPoll ? 'Cancel' : 'Create New Poll'}</span>
                </button>
              </div>

              {/* Create Poll Form */}
              {showAddPoll && (
                <form onSubmit={handleCreatePoll} className="bg-white border border-[#CBD5E1] rounded-3xl p-6 shadow-md space-y-4 text-xs font-sans">
                  <h4 className="font-extrabold text-sm text-[#0F172A] uppercase">Create Live Poll</h4>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Poll Question *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Which match format should we host next weekend?"
                      value={newPoll.question}
                      onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Short Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Vote now to determine the upcoming prizepool distribution"
                      value={newPoll.description}
                      onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['option1', 'option2', 'option3', 'option4'].map((optKey, idx) => (
                      <div key={optKey}>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Option {idx + 1}</label>
                        <input
                          type="text"
                          required={idx < 2}
                          placeholder={`Option ${idx + 1} text`}
                          value={newPoll[optKey]}
                          onChange={(e) => setNewPoll({ ...newPoll, [optKey]: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase cursor-pointer"
                  >
                    Publish Poll to Landing Page
                  </button>
                </form>
              )}

              {/* Polls Cards List */}
              <div className="space-y-4">
                {polls.map((p) => {
                  const totalVotes = p.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
                  return (
                    <div key={p.id} className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold uppercase border border-emerald-200">
                            {p.status || 'ACTIVE'}
                          </span>
                          <h4 className="font-extrabold text-sm sm:text-base text-[#0F172A] mt-1">{p.question}</h4>
                          <p className="text-xs text-[#64748B]">{p.description}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                          {totalVotes.toLocaleString()} Total Votes
                        </span>
                      </div>

                      <div className="space-y-2">
                        {p.options.map((opt, idx) => {
                          const pct = totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0;
                          return (
                            <div key={idx} className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-[#0F172A]">{opt.text}</span>
                                <span className="font-mono text-[#64748B]">{opt.votes || 0} votes ({pct}%)</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                                <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 5: SPONSORS & SUPPORTERS DESK */}
          {/* ==================================================== */}
          {activeTab === 'SPONSORS' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs">
                <div>
                  <h3 className="font-montserrat font-extrabold text-base text-[#0F172A] uppercase">
                    Sponsors & Official Supporters Desk
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Manage and showcase official brand partners and esports sponsors on the homepage.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddSponsor(!showAddSponsor)}
                  className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4 text-teal-400" />
                  <span>{showAddSponsor ? 'Cancel' : 'Add New Sponsor'}</span>
                </button>
              </div>

              {/* Add Sponsor Form */}
              {showAddSponsor && (
                <form onSubmit={handleCreateSponsor} className="bg-white border border-[#CBD5E1] rounded-3xl p-6 shadow-md space-y-4 text-xs font-sans">
                  <h4 className="font-extrabold text-sm text-[#0F172A] uppercase">Add Sponsor Partner</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Brand / Sponsor Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Red Bull Gaming"
                        value={newSponsor.name}
                        onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Partnership Category / Tier</label>
                      <select
                        value={newSponsor.tier}
                        onChange={(e) => setNewSponsor({ ...newSponsor, tier: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none"
                      >
                        <option value="TITLE">Title Sponsor</option>
                        <option value="PLATINUM">Platinum Partner</option>
                        <option value="GOLD">Gold Supporter</option>
                        <option value="SILVER">Silver Supporter</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Official Website Link</label>
                      <input
                        type="text"
                        placeholder="https://sponsor.com"
                        value={newSponsor.link}
                        onChange={(e) => setNewSponsor({ ...newSponsor, link: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tagline</label>
                      <input
                        type="text"
                        placeholder="e.g. Gives you wings for the final circle"
                        value={newSponsor.tagline}
                        onChange={(e) => setNewSponsor({ ...newSponsor, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Brand Logo (Cloudinary CDN)</label>
                    <input
                      type="file"
                      ref={sponsorFileRef}
                      accept="image/*"
                      onChange={handleSponsorLogoUpload}
                      className="hidden"
                    />
                    <div
                      onClick={() => sponsorFileRef.current?.click()}
                      className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 hover:border-teal-500 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-teal-600" />
                      <span>{isUploadingSponsorLogo ? 'Uploading to Cloudinary...' : newSponsor.logo ? 'Logo Uploaded ✓ (Click to change)' : 'Upload Brand Logo PNG/JPG'}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase cursor-pointer"
                  >
                    Save & Display Sponsor
                  </button>
                </form>
              )}

              {/* Sponsors Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sponsors.map((s) => (
                  <div key={s.id} className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col justify-between space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 p-2 flex items-center justify-center overflow-hidden border border-slate-200">
                        <img src={s.logo || '/assets/conqueror_badge.jpg'} alt="Logo" className="w-full h-full object-contain" />
                      </div>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 uppercase">
                        {s.tier}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm text-[#0F172A]">{s.name}</h4>
                      <p className="text-xs text-[#64748B] mt-0.5">{s.tagline}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-xs">
                      <a href={s.link} target="_blank" rel="noreferrer" className="text-teal-600 font-bold hover:underline inline-flex items-center gap-1">
                        <span>Visit Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this sponsor?')) {
                            deleteSponsor(s.id);
                          }
                        }}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 6: CREATE TEAMS & ROOM DISPATCHER DESK */}
          {/* ==================================================== */}
          {activeTab === 'TEAMS_DISPATCH' && (
            <div className="space-y-6">
              
              {/* Room Broadcaster Form */}
              <form onSubmit={handleSaveBroadcast} className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                      <Radio className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-extrabold text-sm sm:text-base text-[#0F172A] uppercase">
                        Room Match Credentials Broadcaster
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        Broadcasted instantly to all registered squads inside their private Team Portal.
                      </p>
                    </div>
                  </div>

                  {broadcastSavedNotice && (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200">
                      Broadcast Live Synced! ✓
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Custom Room ID *</label>
                    <input
                      type="text"
                      required
                      value={broadcastForm.roomId}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, roomId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Room Password *</label>
                    <input
                      type="text"
                      required
                      value={broadcastForm.password}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, password: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Target Map</label>
                    <input
                      type="text"
                      value={broadcastForm.map}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, map: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Match Schedule Time</label>
                    <input
                      type="text"
                      value={broadcastForm.matchTime}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, matchTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Admin Announcement / Room Instructions</label>
                  <input
                    type="text"
                    value={broadcastForm.broadcastNotice}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, broadcastNotice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase cursor-pointer transition-colors shadow-sm"
                >
                  Push Room Credentials to All Team Portals
                </button>
              </form>

              {/* Team Credentials Table */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-montserrat font-extrabold text-sm sm:text-base text-[#0F172A] uppercase">
                      Registered Teams & Access Credentials
                    </h4>
                    <p className="text-xs text-[#64748B]">
                      Teams can log in to the Team Portal using their Ticket ID / Squad Name and 6-digit PIN.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowCreateTeamModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Team</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[10px] font-mono text-[#64748B] uppercase">
                        <th className="py-2.5 px-3">Slot</th>
                        <th className="py-2.5 px-3">Team Name</th>
                        <th className="py-2.5 px-3">Ticket ID</th>
                        <th className="py-2.5 px-3">Login Passcode (PIN)</th>
                        <th className="py-2.5 px-3">Format</th>
                        <th className="py-2.5 px-3">Leader WhatsApp</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] font-mono">
                      {rosterTeams.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-bold text-teal-700">{t.slot}</td>
                          <td className="py-3 px-3 font-bold text-[#0F172A]">{t.teamName || t.name}</td>
                          <td className="py-3 px-3 text-[#334155]">{t.ticketId || t.id}</td>
                          <td className="py-3 px-3 font-bold text-amber-700">{t.passcode || '778899'}</td>
                          <td className="py-3 px-3">{t.matchType || 'SQUAD'}</td>
                          <td className="py-3 px-3">{t.iglPhone || t.captainPhone}</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleCopyText(`Ticket: ${t.ticketId || t.id} | PIN: ${t.passcode || '778899'}`, t.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-[11px] font-bold cursor-pointer inline-flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3 text-teal-600" />
                              <span>{copiedId === t.id ? 'Copied!' : 'Copy Login'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 7: SERVER TELEMETRY */}
          {/* ==================================================== */}
          {activeTab === 'TELEMETRY' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs space-y-4">
                <h4 className="font-extrabold text-sm text-[#0F172A] uppercase">Direct Server Node Matrix</h4>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span>Mumbai Central Primary Node</span>
                    <span className="font-bold text-emerald-600">18ms (Optimal)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span>Chennai Backup Transit Node</span>
                    <span className="font-bold text-emerald-600">22ms (Optimal)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span>MongoDB Atlas Sync Stream</span>
                    <span className="font-bold text-teal-600">Active (Zero Latency)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs space-y-4">
                <h4 className="font-extrabold text-sm text-[#0F172A] uppercase">Anti-Cheat Character ID Engine</h4>
                <p className="text-xs text-[#64748B]">
                  Character IGID validation enforces strict numeric parsing and blacklists duplicate IDs across all lobby entries.
                </p>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
                  ✓ Character ID Validator Active • No strings permitted in IGID field.
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* MODAL: DIRECT TEAM CREATION */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white border border-[#DCE2E9] rounded-3xl p-6 shadow-2xl text-[#1E293B]">
            <button
              onClick={() => setShowCreateTeamModal(false)}
              className="absolute top-5 right-5 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-extrabold text-base text-[#0F172A] uppercase mb-1">Create Team & Generate Passcode</h3>
            <p className="text-xs text-[#64748B] mb-4">Credentials will be generated instantly for Team Portal login.</p>

            <form onSubmit={handleCreateTeamDirect} className="space-y-3.5 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Team / Squad Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Team Hydra"
                  value={newTeamData.teamName}
                  onChange={(e) => setNewTeamData({ ...newTeamData, teamName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Leader / IGL Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dynam0"
                  value={newTeamData.iglName}
                  onChange={(e) => setNewTeamData({ ...newTeamData, iglName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Leader WhatsApp Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 9876543210"
                  value={newTeamData.iglPhone}
                  onChange={(e) => setNewTeamData({ ...newTeamData, iglPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Match Format</label>
                  <select
                    value={newTeamData.matchType}
                    onChange={(e) => setNewTeamData({ ...newTeamData, matchType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none"
                  >
                    <option value="SQUAD">Squad</option>
                    <option value="DUO">Duo</option>
                    <option value="SOLO">Solo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Custom Passcode (PIN)</label>
                  <input
                    type="text"
                    placeholder="Auto-generated"
                    value={newTeamData.passcode}
                    onChange={(e) => setNewTeamData({ ...newTeamData, passcode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-teal-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase cursor-pointer shadow-md"
              >
                Create Team & Issue Passcode
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SuperAdminDashboard;
