import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, Users, Radio, Send, LogOut, Check,
  AlertCircle, Trophy, Swords, Search, ArrowRightLeft,
  FileSpreadsheet, MessageSquare, Flame, CheckCircle2, RotateCcw,
  Sliders, Award, UserCheck, Activity, Wifi, ArrowLeft, Home,
  Clock, TrendingUp, Sparkles, Cpu, Phone, XCircle, Trash2, Copy,
  BarChart2, Plus, Edit2, Save, ExternalLink, Ticket, Key, Upload, DollarSign, Tag, Menu, X,
  Building2, Mail, MapPin, HeartHandshake, Eye, EyeOff, Loader2
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import {
  getStoredRegistrations,
  updateRegistrationStatus,
  updateTeamDetails,
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
  updateSponsor,
  deleteSponsor,
  getStoredSponsorRequests,
  saveSponsorRequest,
  updateSponsorRequestStatus,
  deleteSponsorRequest,
  convertSponsorRequestToSponsor,
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

  // Real-time Data Stores
  const [rosterTeams, setRosterTeams] = useState(getStoredRegistrations());
  const [inquiries, setInquiries] = useState(getStoredInquiries());
  const [tournaments, setTournaments] = useState(getStoredTournaments());
  const [hofFormat, setHofFormat] = useState('SQUAD');
  const [hofEditBuffer, setHofEditBuffer] = useState(() => getStoredHallOfFame('SQUAD'));
  const [polls, setPolls] = useState(getStoredPolls());
  const [sponsors, setSponsors] = useState(getStoredSponsors());
  const [sponsorRequests, setSponsorRequests] = useState(getStoredSponsorRequests());
  const [sponsorSubTab, setSponsorSubTab] = useState('REQUESTS'); // 'REQUESTS' | 'LIVE_SPONSORS'
  const [roomBroadcast, setRoomBroadcast] = useState(getStoredRoomBroadcast());

  // Forms State - Tournaments
  const [newTourney, setNewTourney] = useState({
    title: '',
    format: 'Squad War',
    map: 'Erangel',
    date: 'June 20, 2026',
    prize: '₹2,50,000 INR',
    totalSlots: 25,
    status: 'OPEN',
    category: 'BOTSQUADWAR',
    banner: '/assets/conqueror_badge.jpg',
    description: 'Official BGMI Tournament'
  });
  const [editingTourney, setEditingTourney] = useState(null);
  const [showTourneyModal, setShowTourneyModal] = useState(false);

  // Forms State - Polls
  const [newPoll, setNewPoll] = useState({
    question: '',
    description: '',
    option1: '',
    option2: '',
    option3: '',
    option4: ''
  });
  const [showAddPoll, setShowAddPoll] = useState(false);

  // Forms State - Sponsors (Live Display)
  const [sponsorForm, setSponsorForm] = useState({
    name: '',
    category: 'Title Energy Partner',
    tier: 'TITLE',
    logo: '',
    link: 'https://',
    tagline: 'Official Competitive Partner',
    status: 'ACTIVE'
  });
  const [editingSponsorId, setEditingSponsorId] = useState(null);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const sponsorLogoInputRef = useRef(null);

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

  // Update HOF buffer on format change
  useEffect(() => {
    setHofEditBuffer(getStoredHallOfFame(hofFormat));
  }, [hofFormat]);

  // Connect to Live Subscription Stream & Events
  useEffect(() => {
    const unsubscribe = subscribeToLivePortalUpdates((updatedList) => {
      setRosterTeams(updatedList);
    });

    const handleInquiriesUpdate = () => setInquiries(getStoredInquiries());
    const handleTourneysUpdate = () => setTournaments(getStoredTournaments());
    const handleHofUpdate = () => setHofEditBuffer(getStoredHallOfFame(hofFormat));
    const handlePollsUpdate = () => setPolls(getStoredPolls());
    const handleSponsorsUpdate = () => setSponsors(getStoredSponsors());
    const handleSponsorRequestsUpdate = () => setSponsorRequests(getStoredSponsorRequests());
    const handleBroadcastUpdate = (e) => {
      if (e.detail) {
        setRoomBroadcast(e.detail);
        setBroadcastForm(e.detail);
      }
    };

    window.addEventListener('portal_inquiries_updated', handleInquiriesUpdate);
    window.addEventListener('portal_tournaments_updated', handleTourneysUpdate);
    window.addEventListener('portal_hof_updated', handleHofUpdate);
    window.addEventListener('portal_polls_updated', handlePollsUpdate);
    window.addEventListener('portal_sponsors_updated', handleSponsorsUpdate);
    window.addEventListener('portal_sponsor_requests_updated', handleSponsorRequestsUpdate);
    window.addEventListener('portal_room_broadcast_updated', handleBroadcastUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('portal_inquiries_updated', handleInquiriesUpdate);
      window.removeEventListener('portal_tournaments_updated', handleTourneysUpdate);
      window.removeEventListener('portal_hof_updated', handleHofUpdate);
      window.removeEventListener('portal_polls_updated', handlePollsUpdate);
      window.removeEventListener('portal_sponsors_updated', handleSponsorsUpdate);
      window.removeEventListener('portal_sponsor_requests_updated', handleSponsorRequestsUpdate);
      window.removeEventListener('portal_room_broadcast_updated', handleBroadcastUpdate);
    };
  }, [hofFormat]);

  // Registration Handlers
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
    if (window.confirm('Are you sure you want to remove this registration?')) {
      soundFx.playClick();
      const updated = deleteRegistration(id);
      setRosterTeams(updated);
    }
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    soundFx.playSuccess();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Hall of Fame Handlers
  const handleSaveHof = () => {
    soundFx.playVictory();
    saveHallOfFame(hofFormat, hofEditBuffer);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    alert("Top 10 Points Table for " + hofFormat + " successfully saved and synced to public Hall of Fame!");
  };

  const handleResetHof = () => {
    if (window.confirm("Reset " + hofFormat + " Top 10 to official default standings?")) {
      soundFx.playClick();
      const updated = resetHallOfFameToDefault(hofFormat);
      if (updated && updated[hofFormat]) {
        setHofEditBuffer(updated[hofFormat]);
      } else {
        setHofEditBuffer(getStoredHallOfFame(hofFormat));
      }
    }
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

  // Tournaments Handlers
  const handleSaveTournament = (e) => {
    e.preventDefault();
    soundFx.playVictory();
    if (editingTourney) {
      saveTournament({ ...editingTourney, ...newTourney });
    } else {
      saveTournament(newTourney);
    }
    setShowTourneyModal(false);
    setEditingTourney(null);
    setNewTourney({
      title: '',
      format: 'Squad War',
      map: 'Erangel',
      date: 'June 20, 2026',
      prize: '₹2,50,000 INR',
      totalSlots: 25,
      status: 'OPEN',
      category: 'BOTSQUADWAR',
      banner: '/assets/conqueror_badge.jpg',
      description: 'Official BGMI Tournament'
    });
  };

  const handleEditTournament = (tourney) => {
    setEditingTourney(tourney);
    setNewTourney({
      title: tourney.title,
      format: tourney.format || 'Squad War',
      map: tourney.map || 'Erangel',
      date: tourney.date,
      prize: tourney.prizePool || tourney.prize || '₹2,50,000 INR',
      totalSlots: tourney.totalSlots || 25,
      status: tourney.status || 'OPEN',
      category: tourney.category || 'BOTSQUADWAR',
      banner: tourney.banner || '/assets/conqueror_badge.jpg',
      description: tourney.description || ''
    });
    setShowTourneyModal(true);
  };

  const handleDeleteTournament = (id) => {
    if (window.confirm('Delete this tournament from the portal?')) {
      soundFx.playClick();
      deleteTournament(id);
    }
  };

  // Polls Handlers
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

  // Sponsors & Requests Handlers
  const handleSponsorLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const res = await uploadToCloudinary(file, { folder: 'madan_sponsors' });
      if (res.success && res.secure_url) {
        setSponsorForm(prev => ({ ...prev, logo: res.secure_url }));
      }
    } catch (err) {
      console.warn('Upload error:', err);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSaveSponsorForm = (e) => {
    e.preventDefault();
    soundFx.playVictory();
    if (editingSponsorId) {
      updateSponsor(editingSponsorId, sponsorForm);
    } else {
      saveSponsor(sponsorForm);
    }
    setShowSponsorModal(false);
    setEditingSponsorId(null);
    setSponsorForm({
      name: '',
      category: 'Title Energy Partner',
      tier: 'TITLE',
      logo: '',
      link: 'https://',
      tagline: 'Official Competitive Partner',
      status: 'ACTIVE'
    });
  };

  const handleEditSponsor = (s) => {
    setEditingSponsorId(s.id);
    setSponsorForm({
      name: s.name,
      category: s.category || 'Official Partner',
      tier: s.tier || 'TITLE',
      logo: s.logo || '',
      link: s.link || 'https://',
      tagline: s.tagline || '',
      status: s.status || 'ACTIVE'
    });
    setShowSponsorModal(true);
  };

  const handleDeleteSponsor = (id) => {
    if (window.confirm('Delete this sponsor from the public portal?')) {
      soundFx.playClick();
      deleteSponsor(id);
    }
  };

  const handleApproveSponsorRequest = (req) => {
    soundFx.playVictory();
    convertSponsorRequestToSponsor(req.id, {
      name: req.business || req.name,
      category: (req.tierInterest || 'Official') + " Arena Partner",
      tier: req.tierInterest || 'TITLE',
      link: req.notes && req.notes.startsWith('http') ? req.notes : 'https://',
      tagline: "Official Partner from " + req.city
    });
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    alert("Sponsor partnership for \"" + req.business + "\" approved and added to active public sponsors!");
  };

  const handleUpdateReqStatus = (id, status) => {
    soundFx.playClick();
    updateSponsorRequestStatus(id, status);
  };

  const handleDeleteReq = (id) => {
    if (window.confirm('Delete this partnership request?')) {
      soundFx.playClick();
      deleteSponsorRequest(id);
    }
  };

  // Team Direct Creation
  const handleCreateTeamDirect = (e) => {
    e.preventDefault();
    soundFx.playVictory();
    const result = createTeamWithCredentials(newTeamData);
    setShowCreateTeamModal(false);
    setNewTeamData({ teamName: '', iglName: '', iglPhone: '', matchType: 'SQUAD', passcode: '' });
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    alert("Team created successfully!\nTicket ID: " + result.team.ticketId + "\nPasscode: " + result.team.passcode + "\nSlot: " + result.team.slot);
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
  const filteredTeams = rosterTeams.filter(t => {
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

  const pendingRostersCount = rosterTeams.filter(t => t.status === 'PENDING').length;
  const pendingSponsorReqsCount = sponsorRequests.filter(r => r.status === 'PENDING').length;

  const sidebarMenuItems = [
    { id: 'REGISTRATIONS', label: 'Registration Requests', icon: Swords, badge: pendingRostersCount > 0 ? ('' + pendingRostersCount) : null },
    { id: 'HALL_OF_FAME', label: 'Hall of Fame (Top 10s)', icon: Trophy },
    { id: 'TOURNAMENTS', label: 'Tournaments Manager', icon: Sliders },
    { id: 'POLLS', label: 'Live Fan Polls', icon: BarChart2 },
    { id: 'SPONSORS', label: 'Sponsors & Requests', icon: DollarSign, badge: pendingSponsorReqsCount > 0 ? (pendingSponsorReqsCount + ' New') : null },
    { id: 'TEAMS_DISPATCH', label: 'Create Teams & Dispatcher', icon: Radio },
    { id: 'TELEMETRY', label: 'Server Ping Matrix', icon: Wifi }
  ];

  return (
    <div className="min-h-screen bg-[#EEF2F6] flex text-[#1E293B] font-sans selection:bg-teal-500/20 selection:text-teal-900">
      
      {/* 1. DEDICATED LEFT DESKTOP SIDEBAR */}
      <aside className={"fixed inset-y-0 left-0 z-50 w-64 bg-[#0B0F17] text-[#E2E8F0] border-r border-[#1E2536] flex flex-col justify-between transition-transform duration-300 " + (sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        
        {/* Top Brand Logo Strip */}
        <div>
          <div className="p-4 border-b border-[#1E2536] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={"w-9 h-9 rounded-xl bg-gradient-to-tr " + "from-amber-500 to-yellow-600" + " flex items-center justify-center text-white font-black text-sm shadow-md"}>
                SA
              </div>
              <div>
                <span className="font-extrabold text-sm text-white tracking-tight uppercase block font-montserrat">
                  SUPER ADMIN CONSOLE
                </span>
                <span className={"text-[10px] " + "text-amber-400" + " font-mono font-bold flex items-center gap-1"}>
                  <span className={"w-1.5 h-1.5 rounded-full " + "bg-amber-400" + " animate-pulse"} />
                  LEVEL 9 ROOT SECURITY
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
              OPERATIONS DESKS
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
                  className={"w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-montserrat font-bold tracking-tight transition-all cursor-pointer " + (
                    active
                      ? "bg-[#1C1708] border border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                      : "text-[#94A3B8] hover:text-white hover:bg-[#121722]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={"text-[10px] px-2 py-0.5 rounded-full font-mono font-bold " + (
                      active
                        ? "bg-white text-black"
                        : "bg-red-500/20 text-red-400 border border-red-500/40"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switcher & Logout */}
        <div className="p-3 border-t border-[#1E2536] space-y-2 bg-[#080B10]">
          <button
        onClick={onSwitchToAdmin}
        className="w-full py-2 px-3 rounded-xl bg-[#121722] hover:bg-[#1A2232] border border-[#232D40] text-xs font-bold text-teal-400 flex items-center justify-center gap-2 cursor-pointer transition-all"
      >
        <Users className="w-3.5 h-3.5" />
        <span>Switch to Match Ops</span>
      </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToPortal}
              className="flex-1 py-2 px-3 rounded-xl bg-[#121722] hover:bg-[#1A2232] border border-[#232D40] text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Portal</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-400 cursor-pointer"
              title="Logout Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* 2. MAIN CONTENT DESK WRAPPER */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-montserrat font-black text-sm sm:text-base text-[#0F172A] uppercase">
                {sidebarMenuItems.find(i => i.id === activeTab)?.label || 'OPERATIONS'}
              </h2>
              <span className="text-[11px] text-[#64748B] font-mono">
                Active Session: {user?.username || user?.email || (user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Match Ops')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToPortal}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Website</span>
            </button>
          </div>
        </header>

        {/* Dynamic Desk View Container */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {/* ==================================================== */}
          {/* VIEW 1: REGISTRATION REQUESTS (SOLO, DUO, SQUAD) */}
          {/* ==================================================== */}
          {activeTab === 'REGISTRATIONS' && (
            <div className="space-y-6">
              
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-montserrat font-extrabold text-base text-[#0F172A] uppercase">
                      Live Tournament Registrations Queue
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Manage, verify, and contact captains for Solo, Duo, and Squad lobbies.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowCreateTeamModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-sm transition-all self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4 text-teal-400" />
                    <span>Create Team / Pass</span>
                  </button>
                </div>

                {/* Match Type Sub-Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E2E8F0]">
                  {[
                    { id: 'ALL', label: 'All Formats', count: rosterTeams.length },
                    { id: 'SQUAD', label: 'Squad (4-5P)', count: rosterTeams.filter(t => (t.matchType || 'SQUAD').toUpperCase() === 'SQUAD').length },
                    { id: 'DUO', label: 'Duo (2P)', count: rosterTeams.filter(t => (t.matchType || '').toUpperCase() === 'DUO').length },
                    { id: 'SOLO', label: 'Solo (1P)', count: rosterTeams.filter(t => (t.matchType || '').toUpperCase() === 'SOLO').length },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        soundFx.playClick();
                        setMatchTypeFilter(tab.id);
                      }}
                      className={"p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between " + (
                        matchTypeFilter === tab.id
                          ? "bg-[#0F172A] text-white border-[#0F172A] shadow-sm"
                          : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:bg-slate-100"
                      )}
                    >
                      <span className="font-montserrat font-bold text-xs">{tab.label}</span>
                      <span className={"text-xs font-mono font-bold px-2 py-0.5 rounded-full " + (
                        matchTypeFilter === tab.id ? "bg-white/20 text-white" : "bg-slate-200 text-[#0F172A]"
                      )}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Search Bar & Status Filter */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search squad name, IGL, IGID, slot, or ticket ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] text-xs focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {['ALL', 'PENDING', 'VERIFIED', 'REJECTED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          soundFx.playClick();
                          setStatusFilter(st);
                        }}
                        className={"px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer " + (
                          statusFilter === st
                            ? "bg-teal-600 text-white"
                            : "bg-[#F1F5F9] text-[#64748B] hover:bg-slate-200"
                        )}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Roster Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTeams.length === 0 ? (
                  <div className="col-span-full bg-white border border-[#E2E8F0] rounded-3xl p-8 text-center space-y-2">
                    <Swords className="w-8 h-8 text-slate-400 mx-auto" />
                    <h4 className="font-bold text-sm text-[#0F172A]">No Registrations Found</h4>
                    <p className="text-xs text-[#64748B]">
                      {searchQuery ? 'Try adjusting your search query.' : 'New squad submissions from the portal will appear here in real-time.'}
                    </p>
                  </div>
                ) : (
                  filteredTeams.map((team) => (
                    <div
                      key={team.id || team.ticketId}
                      className="bg-white border border-[#CBD5E1] rounded-3xl p-5 shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Card Header */}
                        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm overflow-hidden border border-slate-300">
                              {team.clanLogo ? (
                                <img src={team.clanLogo} alt="Logo" className="w-full h-full object-cover" />
                              ) : (
                                (team.teamName || team.name || 'SQ')[0]
                              )}
                            </div>
                            <div>
                              <h4 className="font-montserrat font-bold text-sm text-[#0F172A] truncate">
                                {team.teamName || team.name || 'Unnamed Squad'}
                              </h4>
                              <div className="flex items-center gap-2 text-[11px] font-mono text-[#64748B]">
                                <span className="text-teal-700 font-bold">{team.slot || 'SLOT-OPEN'}</span>
                                <span>•</span>
                                <span>{team.matchType || 'SQUAD'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className={"text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase " + (
                              team.status === 'VERIFIED'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : team.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            )}>
                              {team.status || 'PENDING'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">{team.ticketId || team.id}</span>
                          </div>
                        </div>

                        {/* IGL & Players Roster */}
                        <div className="space-y-2 text-xs">
                          <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                            <div>
                              <span className="text-[10px] text-[#64748B] block font-bold uppercase">IGL / Leader</span>
                              <span className="font-bold text-[#0F172A]">{team.iglName || team.captainName || 'Leader'}</span>
                            </div>

                            {team.iglPhone && (
                              <a
                                href={"https://wa.me/" + team.iglPhone.replace(/\D/g, '')}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              >
                                <Phone className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            )}
                          </div>

                          {/* Players List */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-[#64748B] uppercase font-bold block">
                              Players & In-Game IDs (Numeric)
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {team.players && team.players.length > 0 ? (
                                team.players.map((p, pidx) => (
                                  <div key={pidx} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
                                    <span className="font-bold text-[#0F172A] block truncate">{p.name}</span>
                                    <span className="text-[10px] font-mono text-teal-700 font-bold">ID: {p.id}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="col-span-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-500 truncate">
                                  {team.igids || 'Numeric IGIDs registered on ticket'}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleVerifySquad(team.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Verify</span>
                          </button>
                          <button
                            onClick={() => handleRejectSquad(team.id)}
                            className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteSquad(team.id)}
                          className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer"
                          title="Delete Registration"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 2: HALL OF FAME TOP 10 POINTS TABLES */}
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
                    Edit and sync all 10 positions for Solo, Duo, and Squad leaderboards displayed to viewers.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center p-1 rounded-2xl bg-[#F1F5F9] border border-[#CBD5E1]">
                    {['SQUAD', 'DUO', 'SOLO'].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => {
                          soundFx.playClick();
                          setHofFormat(fmt);
                        }}
                        className={"px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer " + (
                          hofFormat === fmt
                            ? 'bg-[#0F172A] text-white shadow-sm'
                            : 'text-[#64748B] hover:text-[#0F172A]'
                        )}
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
                    <span className="hidden sm:inline">Reset Default</span>
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

              {/* 10-Row Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[10px] font-mono text-[#64748B] uppercase">
                      <th className="py-2.5 px-3">Position</th>
                      <th className="py-2.5 px-3">Team / In-Game Name</th>
                      <th className="py-2.5 px-3">Clan Tag</th>
                      <th className="py-2.5 px-3 text-center">WWCD 👑</th>
                      <th className="py-2.5 px-3 text-center">Kills 🎯</th>
                      <th className="py-2.5 px-3 text-center">Placement Pts</th>
                      <th className="py-2.5 px-3 text-center font-bold text-teal-700">Total Points 🔥</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] font-mono">
                    {hofEditBuffer.map((team, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-[#0F172A] whitespace-nowrap">
                          {idx === 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black">
                              👑 #1
                            </span>
                          ) : idx === 1 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold">
                              🥈 #2
                            </span>
                          ) : idx === 2 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-900/10 text-amber-800 border border-amber-700/30 text-xs font-bold">
                              🥉 #3
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold">
                              #{idx + 1}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={team.teamName || team.name || ''}
                            placeholder={"Team / Player " + (idx + 1)}
                            onChange={(e) => handleHofCellChange(idx, 'teamName', e.target.value)}
                            className="w-full max-w-xs px-2.5 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] font-sans text-xs font-bold focus:border-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={team.clanTag || ''}
                            placeholder="TAG"
                            onChange={(e) => handleHofCellChange(idx, 'clanTag', e.target.value)}
                            className="w-24 px-2 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-mono font-bold focus:border-teal-500 focus:outline-none uppercase"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={team.wwcd || 0}
                            onChange={(e) => handleHofCellChange(idx, 'wwcd', e.target.value)}
                            className="w-16 text-center px-2 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-bold focus:border-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={team.kills || 0}
                            onChange={(e) => handleHofCellChange(idx, 'kills', e.target.value)}
                            className="w-16 text-center px-2 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-bold focus:border-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={team.placementPts || 0}
                            onChange={(e) => handleHofCellChange(idx, 'placementPts', e.target.value)}
                            className="w-16 text-center px-2 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-bold focus:border-teal-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-2 px-3 text-center font-black text-teal-700 text-sm">
                          {team.totalPts !== undefined ? team.totalPts : (team.total !== undefined ? team.total : ((Number(team.kills) || 0) + (Number(team.placementPts) || 0)))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 3: TOURNAMENTS MANAGER (FULL CRUD) */}
          {/* ==================================================== */}
          {activeTab === 'TOURNAMENTS' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs">
                <div>
                  <h3 className="font-montserrat font-extrabold text-base text-[#0F172A] uppercase">
                    Tournaments & Events Management
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Post, update, schedule, and edit tournament prizes & slot limits in real time.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingTourney(null);
                    setNewTourney({
                      title: '',
                      format: 'Squad War',
                      map: 'Erangel',
                      date: 'June 20, 2026',
                      prize: '₹2,50,000 INR',
                      totalSlots: 25,
                      status: 'OPEN',
                      category: 'BOTSQUADWAR',
                      banner: '/assets/conqueror_badge.jpg',
                      description: 'Official BGMI Tournament'
                    });
                    setShowTourneyModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4 text-teal-400" />
                  <span>Post New Tournament</span>
                </button>
              </div>

              {/* Tournaments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tournaments.map((t) => (
                  <div key={t.id} className="bg-white border border-[#CBD5E1] rounded-3xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold uppercase">
                          {t.category || 'TOURNAMENT'}
                        </span>
                        <span className={"text-[10px] px-2 py-0.5 rounded-full font-bold uppercase " + (
                          t.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        )}>
                          {t.status}
                        </span>
                      </div>

                      <h4 className="font-montserrat font-bold text-sm text-[#0F172A] line-clamp-1">
                        {t.title}
                      </h4>
                      <p className="text-xs text-[#64748B]">{t.format} • {t.map || 'Erangel'}</p>

                      <div className="mt-3 p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#64748B]">Prize Pool:</span>
                          <span className="font-bold text-teal-700">{t.prizePool || t.prize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748B]">Slots:</span>
                          <span className="font-bold text-[#0F172A]">{t.totalSlots || 25} Limit</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748B]">Date:</span>
                          <span className="text-[#0F172A] font-mono">{t.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                      <button
                        onClick={() => handleEditTournament(t)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteTournament(t.id)}
                        className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer"
                        title="Delete Tournament"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tournament Create/Edit Modal */}
              {showTourneyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <form onSubmit={handleSaveTournament} className="bg-white rounded-3xl border border-[#CBD5E1] p-6 max-w-lg w-full space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                      <h4 className="font-montserrat font-bold text-base text-[#0F172A] uppercase">
                        {editingTourney ? 'Edit Tournament Details' : 'Post New Upcoming Tournament'}
                      </h4>
                      <button type="button" onClick={() => setShowTourneyModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Title *</label>
                        <input
                          type="text"
                          required
                          value={newTourney.title}
                          onChange={(e) => setNewTourney({ ...newTourney, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Prize Pool *</label>
                          <input
                            type="text"
                            required
                            value={newTourney.prize}
                            onChange={(e) => setNewTourney({ ...newTourney, prize: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Slot Limit *</label>
                          <input
                            type="number"
                            required
                            value={newTourney.totalSlots}
                            onChange={(e) => setNewTourney({ ...newTourney, totalSlots: Number(e.target.value) || 25 })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Match Map</label>
                          <select
                            value={newTourney.map}
                            onChange={(e) => setNewTourney({ ...newTourney, map: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          >
                            <option>Erangel</option>
                            <option>Miramar</option>
                            <option>Sanhok</option>
                            <option>Vikendi</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Date & Time</label>
                          <input
                            type="text"
                            value={newTourney.date}
                            onChange={(e) => setNewTourney({ ...newTourney, date: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Category Tag</label>
                        <input
                          type="text"
                          value={newTourney.category}
                          onChange={(e) => setNewTourney({ ...newTourney, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowTourneyModal(false)}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs uppercase shadow-md"
                      >
                        {editingTourney ? 'Update Tournament' : 'Post Tournament'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 4: LIVE FAN POLLS (FULL CRUD) */}
          {/* ==================================================== */}
          {activeTab === 'POLLS' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between bg-white p-5 rounded-3xl border border-[#E2E8F0] shadow-xs">
                <div>
                  <h3 className="font-montserrat font-extrabold text-base text-[#0F172A] uppercase">
                    Live Fan Polls & Community Voting
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Create interactive polls displayed live on the public landing page for fans to vote.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddPoll(!showAddPoll)}
                  className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4 text-teal-400" />
                  <span>{showAddPoll ? 'Cancel' : 'Create New Poll'}</span>
                </button>
              </div>

              {showAddPoll && (
                <form onSubmit={handleCreatePoll} className="bg-white border border-[#CBD5E1] rounded-3xl p-6 shadow-md space-y-4">
                  <h4 className="font-bold text-sm text-[#0F172A] uppercase">Create Community Fan Poll</h4>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Poll Question *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Which match format should we host next weekend?"
                        value={newPoll.question}
                        onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Option 1 *</label>
                        <input
                          type="text"
                          required
                          placeholder="Option 1"
                          value={newPoll.option1}
                          onChange={(e) => setNewPoll({ ...newPoll, option1: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Option 2 *</label>
                        <input
                          type="text"
                          required
                          placeholder="Option 2"
                          value={newPoll.option2}
                          onChange={(e) => setNewPoll({ ...newPoll, option2: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Option 3 (Optional)</label>
                        <input
                          type="text"
                          placeholder="Option 3"
                          value={newPoll.option3}
                          onChange={(e) => setNewPoll({ ...newPoll, option3: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Option 4 (Optional)</label>
                        <input
                          type="text"
                          placeholder="Option 4"
                          value={newPoll.option4}
                          onChange={(e) => setNewPoll({ ...newPoll, option4: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase shadow-md"
                  >
                    Publish Poll to Landing Page
                  </button>
                </form>
              )}

              {/* Polls List */}
              <div className="space-y-4">
                {polls.map((poll) => {
                  const totalVotes = (poll.options || []).reduce((acc, opt) => acc + (opt.votes || 0), 0);
                  return (
                    <div key={poll.id} className="bg-white border border-[#CBD5E1] rounded-3xl p-5 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {poll.status}
                          </span>
                          <h4 className="font-montserrat font-bold text-base text-[#0F172A] mt-1">
                            {poll.question}
                          </h4>
                        </div>
                        <span className="font-mono font-bold text-xs text-teal-700">
                          {totalVotes} Total Votes
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {poll.options.map((opt, oidx) => {
                          const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                          return (
                            <div key={oidx} className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                              <div className="flex justify-between text-xs font-bold">
                                <span className="text-[#0F172A]">{opt.text}</span>
                                <span className="font-mono text-teal-700">{opt.votes || 0} ({pct}%)</span>
                              </div>
                              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-teal-600 h-full rounded-full transition-all" style={{ width: pct + "%" }} />
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
          {/* VIEW 5: SPONSORS & PARTNERSHIP REQUESTS (SEPARATE SECTION) */}
          {/* ==================================================== */}
          {activeTab === 'SPONSORS' && (
            <div className="space-y-6">
              
              {/* Header with Sub-tab Switcher */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-montserrat font-extrabold text-base text-[#0F172A] uppercase flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-amber-500" />
                      <span>Sponsors & Partnership Management</span>
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Manage incoming brand partnership proposals and active displayed sponsors on the portal.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingSponsorId(null);
                      setSponsorForm({
                        name: '',
                        category: 'Title Energy Partner',
                        tier: 'TITLE',
                        logo: '',
                        link: 'https://',
                        tagline: 'Official Competitive Partner',
                        status: 'ACTIVE'
                      });
                      setShowSponsorModal(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-sm transition-all self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>+ Add Official Sponsor</span>
                  </button>
                </div>

                {/* Sub Tabs: Incoming Requests vs Active Public Sponsors */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setSponsorSubTab('REQUESTS');
                    }}
                    className={"p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between " + (
                      sponsorSubTab === 'REQUESTS'
                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:bg-slate-100'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-amber-400" />
                      <span className="font-montserrat font-bold text-xs sm:text-sm">Incoming Sponsor Requests</span>
                    </div>
                    <span className={"text-xs font-mono font-bold px-2 py-0.5 rounded-full " + (
                      sponsorSubTab === 'REQUESTS' ? 'bg-amber-400 text-black' : 'bg-slate-200 text-[#0F172A]'
                    )}>
                      {sponsorRequests.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setSponsorSubTab('LIVE_SPONSORS');
                    }}
                    className={"p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between " + (
                      sponsorSubTab === 'LIVE_SPONSORS'
                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:bg-slate-100'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-teal-400" />
                      <span className="font-montserrat font-bold text-xs sm:text-sm">Live Displayed Sponsors</span>
                    </div>
                    <span className={"text-xs font-mono font-bold px-2 py-0.5 rounded-full " + (
                      sponsorSubTab === 'LIVE_SPONSORS' ? 'bg-teal-400 text-black' : 'bg-slate-200 text-[#0F172A]'
                    )}>
                      {sponsors.length}
                    </span>
                  </button>
                </div>
              </div>

              {/* SUB-VIEW 1: INCOMING SPONSOR PARTNERSHIP REQUESTS */}
              {sponsorSubTab === 'REQUESTS' && (
                <div className="space-y-4">
                  {sponsorRequests.length === 0 ? (
                    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 text-center space-y-2">
                      <HeartHandshake className="w-8 h-8 text-slate-400 mx-auto" />
                      <h4 className="font-bold text-sm text-[#0F172A]">No Partnership Requests Yet</h4>
                      <p className="text-xs text-[#64748B]">
                        When brands click "PARTNER WITH US" on the website and submit their information, they will appear here in real-time.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sponsorRequests.map((req) => (
                        <div key={req.id} className="bg-white border border-[#CBD5E1] rounded-3xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
                          <div>
                            {/* Card Header */}
                            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 text-black flex items-center justify-center font-black text-sm shadow-sm">
                                  <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="font-montserrat font-bold text-sm text-[#0F172A] truncate">
                                    {req.business}
                                  </h4>
                                  <span className="text-[11px] font-mono text-[#64748B] flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-amber-600" />
                                    <span>{req.city}</span>
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-1">
                                <span className={"text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase " + (
                                  req.status === 'APPROVED'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : req.status === 'CONTACTED'
                                    ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                                    : req.status === 'REJECTED'
                                    ? 'bg-red-100 text-red-800 border border-red-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                                )}>
                                  {req.status}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">{req.ticketId}</span>
                              </div>
                            </div>

                            {/* Contact Details Grid */}
                            <div className="space-y-2 text-xs">
                              <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 font-sans">
                                <div className="flex justify-between">
                                  <span className="text-[#64748B]">Contact Person:</span>
                                  <strong className="text-[#0F172A]">{req.name}</strong>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#64748B]">Tier Interest:</span>
                                  <span className="font-bold text-amber-700 font-mono">{req.tierInterest || 'TITLE'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#64748B]">Email:</span>
                                  <a href={"mailto:" + req.email} className="text-teal-700 font-bold hover:underline">{req.email}</a>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#64748B]">Mobile / WA:</span>
                                  <span className="font-mono font-bold text-[#0F172A]">{req.phone}</span>
                                </div>
                              </div>

                              {req.notes && (
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                                  <strong>Brand Link/Notes:</strong> {req.notes}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              {/* Direct WhatsApp button */}
                              {req.phone && (
                                <a
                                  href={"https://wa.me/" + req.phone.replace(/\D/g, '')}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={() => handleUpdateReqStatus(req.id, 'CONTACTED')}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase flex items-center gap-1 cursor-pointer shadow-sm"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                              )}

                              {/* 1-Click Convert to Live Sponsor */}
                              <button
                                onClick={() => handleApproveSponsorRequest(req)}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-xs font-bold uppercase flex items-center gap-1 cursor-pointer shadow-sm"
                              >
                                <Sparkles className="w-3.5 h-3.5 fill-black" />
                                <span>Approve as Live Sponsor</span>
                              </button>
                            </div>

                            <button
                              onClick={() => handleDeleteReq(req.id)}
                              className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer"
                              title="Delete Request"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUB-VIEW 2: LIVE DISPLAYED SPONSORS (FULL CRUD) */}
              {sponsorSubTab === 'LIVE_SPONSORS' && (
                <div className="space-y-4">
                  {sponsors.length === 0 ? (
                    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 text-center space-y-2">
                      <Award className="w-8 h-8 text-slate-400 mx-auto" />
                      <h4 className="font-bold text-sm text-[#0F172A]">No Live Sponsors Displayed</h4>
                      <p className="text-xs text-[#64748B] max-w-md mx-auto">
                        No demo sponsors are loaded. Click "+ Add Official Sponsor" above to add partners directly, or approve proposals from "Incoming Sponsor Requests".
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sponsors.map((s) => (
                        <div key={s.id} className="bg-white border border-[#CBD5E1] rounded-3xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase">
                                {s.tier || 'OFFICIAL'}
                              </span>
                              <span className={"text-[10px] px-2 py-0.5 rounded-full font-bold uppercase " + (
                                s.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                              )}>
                                {s.status}
                              </span>
                            </div>

                            <div className="w-full h-24 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center p-3 mb-2 overflow-hidden">
                              {s.logo ? (
                                <img src={s.logo} alt={s.name} className="max-h-full max-w-full object-contain" />
                              ) : (
                                <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs">
                                  <Award className="w-5 h-5 text-amber-500" />
                                  <span>{s.name}</span>
                                </div>
                              )}
                            </div>

                            <h4 className="font-montserrat font-bold text-sm text-[#0F172A] truncate">
                              {s.name}
                            </h4>
                            <p className="text-xs text-[#64748B]">{s.category || 'Official Partner'}</p>
                            {s.tagline && <p className="text-[11px] text-slate-500 italic truncate">"{s.tagline}"</p>}
                          </div>

                          <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                            <button
                              onClick={() => handleEditSponsor(s)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteSponsor(s.id)}
                              className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer"
                              title="Delete Sponsor"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Sponsor Create/Edit Modal */}
              {showSponsorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <form onSubmit={handleSaveSponsorForm} className="bg-white rounded-3xl border border-[#CBD5E1] p-6 max-w-lg w-full space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                      <h4 className="font-montserrat font-bold text-base text-[#0F172A] uppercase">
                        {editingSponsorId ? 'Edit Sponsor Details' : 'Add Official Sponsor to Portal'}
                      </h4>
                      <button type="button" onClick={() => setShowSponsorModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Sponsor / Brand Name *</label>
                        <input
                          type="text"
                          required
                          value={sponsorForm.name}
                          onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Tier *</label>
                          <select
                            value={sponsorForm.tier}
                            onChange={(e) => setSponsorForm({ ...sponsorForm, tier: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          >
                            <option value="TITLE">Title Energy Partner</option>
                            <option value="PLATINUM">Official Device / Hardware</option>
                            <option value="GOLD">Streaming / Tournament Sponsor</option>
                            <option value="COMMUNITY">Community Supporter</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Category Title</label>
                          <input
                            type="text"
                            value={sponsorForm.category}
                            onChange={(e) => setSponsorForm({ ...sponsorForm, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          />
                        </div>
                      </div>

                      {/* Cloudinary Logo Upload */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Logo URL or Upload to Cloudinary CDN</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="https://..."
                            value={sponsorForm.logo}
                            onChange={(e) => setSponsorForm({ ...sponsorForm, logo: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          />
                          <input
                            type="file"
                            ref={sponsorLogoInputRef}
                            onChange={handleSponsorLogoUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => sponsorLogoInputRef.current?.click()}
                            disabled={isUploadingLogo}
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isUploadingLogo ? 'Uploading...' : 'Upload'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Website Link</label>
                          <input
                            type="text"
                            value={sponsorForm.link}
                            onChange={(e) => setSponsorForm({ ...sponsorForm, link: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Tagline</label>
                          <input
                            type="text"
                            value={sponsorForm.tagline}
                            onChange={(e) => setSponsorForm({ ...sponsorForm, tagline: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowSponsorModal(false)}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs uppercase shadow-md"
                      >
                        {editingSponsorId ? 'Save Changes' : 'Publish Sponsor'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 6: CREATE TEAMS & ROOM MATCH DISPATCHER */}
          {/* ==================================================== */}
          {activeTab === 'TEAMS_DISPATCH' && (
            <div className="space-y-6">
              
              <div className="bg-[#0B0F17] text-white border border-[#1E2536] rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2536] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
                      <Radio className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-black text-base uppercase">
                        Live Room Match Dispatcher & Credentials Desk
                      </h3>
                      <p className="text-xs text-[#94A3B8]">
                        Push Room ID and Password directly to all verified player portals in real time.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCreateTeamModal(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:brightness-110 text-white font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Generate Squad Credentials</span>
                  </button>
                </div>

                <form onSubmit={handleSaveBroadcast} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-mono text-teal-400 uppercase font-bold mb-1">Room ID *</label>
                    <input
                      type="text"
                      required
                      value={broadcastForm.roomId || ''}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, roomId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#121722] border border-[#222C3E] text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-teal-400 uppercase font-bold mb-1">Room Password *</label>
                    <input
                      type="text"
                      required
                      value={broadcastForm.password || ''}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, password: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#121722] border border-[#222C3E] text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-teal-400 uppercase font-bold mb-1">Map</label>
                    <input
                      type="text"
                      value={broadcastForm.map || ''}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, map: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#121722] border border-[#222C3E] text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-teal-400 uppercase font-bold mb-1">Match Time</label>
                    <input
                      type="text"
                      value={broadcastForm.matchTime || ''}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, matchTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#121722] border border-[#222C3E] text-white font-mono"
                    />
                  </div>

                  <div className="col-span-full pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-[#94A3B8]">
                      {broadcastSavedNotice ? '✅ Live Room details pushed to all player portals!' : 'Pushing details updates active team sessions instantly.'}
                    </span>

                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase shadow-md cursor-pointer"
                    >
                      Broadcast Room to All Teams
                    </button>
                  </div>
                </form>
              </div>

              {/* Team Credentials List */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                  <h4 className="font-montserrat font-bold text-sm text-[#0F172A] uppercase">
                    Active Squad Credentials & Portal Passcodes
                  </h4>
                  <span className="text-xs font-mono text-[#64748B]">{rosterTeams.length} Registered Teams</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[10px] font-mono text-[#64748B] uppercase">
                        <th className="py-2.5 px-3">Slot</th>
                        <th className="py-2.5 px-3">Team Name</th>
                        <th className="py-2.5 px-3">Ticket ID</th>
                        <th className="py-2.5 px-3">PIN Passcode</th>
                        <th className="py-2.5 px-3">IGL & Phone</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] font-mono">
                      {rosterTeams.map((team, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-teal-700">{team.slot || ("SLOT-" + (idx + 1))}</td>
                          <td className="py-2.5 px-3 font-sans font-bold text-[#0F172A]">{team.teamName || team.name}</td>
                          <td className="py-2.5 px-3 font-bold text-[#0F172A]">{team.ticketId}</td>
                          <td className="py-2.5 px-3 font-bold text-amber-700">{team.passcode || '123456'}</td>
                          <td className="py-2.5 px-3 font-sans text-[#64748B]">{team.iglName || 'Leader'} ({team.iglPhone || 'N/A'})</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleCopyText("Team: " + (team.teamName || team.name) + "\nTicket: " + team.ticketId + "\nPIN: " + (team.passcode || '123456') + "\nSlot: " + team.slot, team.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                            >
                              {copiedId === team.id ? 'Copied!' : 'Copy Credentials'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Create Team Direct Modal */}
              {showCreateTeamModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <form onSubmit={handleCreateTeamDirect} className="bg-white rounded-3xl border border-[#CBD5E1] p-6 max-w-md w-full space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                      <h4 className="font-montserrat font-bold text-base text-[#0F172A] uppercase">
                        Generate Squad Pass & Credentials
                      </h4>
                      <button type="button" onClick={() => setShowCreateTeamModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs font-sans">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Squad Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Tamil Warriors"
                          value={newTeamData.teamName}
                          onChange={(e) => setNewTeamData({ ...newTeamData, teamName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">IGL Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Captain OP"
                            value={newTeamData.iglName}
                            onChange={(e) => setNewTeamData({ ...newTeamData, iglName: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Match Type</label>
                          <select
                            value={newTeamData.matchType}
                            onChange={(e) => setNewTeamData({ ...newTeamData, matchType: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          >
                            <option value="SQUAD">Squad (4P)</option>
                            <option value="DUO">Duo (2P)</option>
                            <option value="SOLO">Solo (1P)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">IGL Phone / WhatsApp</label>
                        <input
                          type="text"
                          placeholder="+91 99999 00000"
                          value={newTeamData.iglPhone}
                          onChange={(e) => setNewTeamData({ ...newTeamData, iglPhone: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCreateTeamModal(false)}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs uppercase shadow-md"
                      >
                        Generate & Save Pass
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 7: TELEMETRY & NETWORK MONITOR */}
          {/* ==================================================== */}
          {activeTab === 'TELEMETRY' && (
            <div className="bg-[#0B0F17] text-[#E2E8F0] border border-[#1E2536] rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-[#1E2536] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-montserrat font-black text-base text-white uppercase">
                      Server Cluster & Telemetry Matrix
                    </h3>
                    <p className="text-xs text-[#94A3B8]">
                      Real-time latency monitor across Indian esports routing nodes.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  ALL NODES OPERATIONAL
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { node: 'Chennai Central Hub', ping: '8ms', status: 'Optimal', ip: '103.142.84.1' },
                  { node: 'Mumbai Core Gateway', ping: '16ms', status: 'Optimal', ip: '103.142.84.2' },
                  { node: 'Bangalore Cloud Relay', ping: '12ms', status: 'Optimal', ip: '103.142.84.3' },
                  { node: 'Delhi Anti-Cheat Node', ping: '24ms', status: 'Active', ip: '103.142.84.4' },
                ].map((n, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#121722] border border-[#1E2536] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{n.node}</span>
                      <span className="text-emerald-400 font-mono font-bold text-xs">{n.ping}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                      <span>{n.ip}</span>
                      <span className="text-emerald-500">{n.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;
