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
  updateInquiryStatus,
  deleteInquiry,
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

export const AdminDashboard = ({ user, onLogout, onSwitchToSuperAdmin, onBackToPortal }) => {
  const [activeTab, setActiveTab] = useState('REGISTRATIONS');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [matchTypeFilter, setMatchTypeFilter] = useState('ALL'); // 'ALL' | 'SOLO' | 'DUO' | 'SQUAD'
  const [copiedId, setCopiedId] = useState(null);

  // Real-time Data Stores
  const [rosterTeams, setRosterTeams] = useState(getStoredRegistrations());
  const [inquiries, setInquiries] = useState(getStoredInquiries());
  const [inquirySearchQuery, setInquirySearchQuery] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('ALL');

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

  // Enquiries Handlers
  const handleToggleInquiryStatus = (id, currentStatus) => {
    soundFx.playClick();
    const newStatus = currentStatus === 'RESOLVED' ? 'OPEN' : 'RESOLVED';
    const updated = updateInquiryStatus(id, newStatus);
    setInquiries(updated);
  };

  const handleDeleteInquiry = (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      soundFx.playClick();
      const updated = deleteInquiry(id);
      setInquiries(updated);
    }
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

  const handleEditSponsor = (sponsor) => {
    setEditingSponsorId(sponsor.id);
    setSponsorForm({
      name: sponsor.name || '',
      category: sponsor.category || '',
      tier: sponsor.tier || 'TITLE',
      logo: sponsor.logo || '',
      link: sponsor.link || 'https://',
      tagline: sponsor.tagline || '',
      status: sponsor.status || 'ACTIVE'
    });
    setShowSponsorModal(true);
  };

  const handleDeleteSponsor = (id) => {
    if (window.confirm('Delete this sponsor from portal display?')) {
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

  // Filtered Enquiries list
  const filteredInquiries = inquiries.filter(enq => {
    const name = enq.name || enq.captain || '';
    const email = enq.email || '';
    const squad = enq.squad || '';
    const issue = enq.issue || enq.message || '';
    const status = enq.status || 'OPEN';

    const matchesSearch =
      name.toLowerCase().includes(inquirySearchQuery.toLowerCase()) ||
      email.toLowerCase().includes(inquirySearchQuery.toLowerCase()) ||
      squad.toLowerCase().includes(inquirySearchQuery.toLowerCase()) ||
      issue.toLowerCase().includes(inquirySearchQuery.toLowerCase());

    const matchesStatus =
      inquiryStatusFilter === 'ALL' ||
      (inquiryStatusFilter === 'OPEN' && status === 'OPEN') ||
      (inquiryStatusFilter === 'RESOLVED' && status === 'RESOLVED');

    return matchesSearch && matchesStatus;
  });

  const pendingRostersCount = rosterTeams.filter(t => t.status === 'PENDING').length;
  const pendingSponsorReqsCount = sponsorRequests.filter(r => r.status === 'PENDING').length;
  const openEnquiriesCount = inquiries.filter(i => (i.status || 'OPEN') === 'OPEN').length;

  const sidebarMenuItems = [
    { id: 'REGISTRATIONS', label: 'Registration Requests', icon: Swords, badge: pendingRostersCount > 0 ? ('' + pendingRostersCount) : null },
    { id: 'ENQUIRIES', label: 'User Enquiries', icon: Mail, badge: openEnquiriesCount > 0 ? (openEnquiriesCount + ' Open') : null },
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
              <div className={"w-9 h-9 rounded-xl bg-gradient-to-tr " + "from-teal-600 to-emerald-600" + " flex items-center justify-center text-white font-black text-sm shadow-md"}>
                AD
              </div>
              <div>
                <span className="font-extrabold text-sm text-white tracking-tight uppercase block font-montserrat">
                  MATCH OPS CONSOLE
                </span>
                <span className={"text-[10px] " + "text-teal-400" + " font-mono font-bold flex items-center gap-1"}>
                  <span className={"w-1.5 h-1.5 rounded-full " + "bg-teal-400" + " animate-pulse"} />
                  ADMIN OPERATOR
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
                      ? "bg-teal-600/20 text-teal-300 border border-teal-500/40"
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
          
          {user?.role === 'SUPER_ADMIN' && (
            <button
              onClick={onSwitchToSuperAdmin}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-[#222C3E] text-xs font-bold text-amber-400 flex items-center justify-between cursor-pointer"
            >
              <span>Switch to Super Admin</span>
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          )}

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeams.map((squad) => (
                  <div key={squad.id} className="bg-white border border-[#CBD5E1] rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                      {/* Top Header Card */}
                      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                            {squad.clanTag || squad.teamName?.substring(0, 2).toUpperCase() || 'SQ'}
                          </div>
                          <div>
                            <h4 className="font-montserrat font-bold text-sm text-[#0F172A] truncate">
                              {squad.teamName || squad.name}
                            </h4>
                            <span className="text-[10px] font-mono text-[#64748B] block">
                              {squad.matchType || 'SQUAD'} • {squad.slot || 'NO SLOT'}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className={"text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase " + (
                            squad.status === 'VERIFIED' || squad.status === 'WHITELISTED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : squad.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          )}>
                            {squad.status}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{squad.ticketId}</span>
                        </div>
                      </div>

                      {/* Captain & Players Details */}
                      <div className="space-y-2 text-xs">
                        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1 font-sans">
                          <div className="flex justify-between">
                            <span className="text-[#64748B]">Leader / IGL:</span>
                            <strong className="text-[#0F172A]">{squad.iglName || squad.captainName || 'N/A'}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#64748B]">WhatsApp:</span>
                            <span className="font-mono text-[#0F172A]">{squad.iglPhone || squad.captainPhone || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#64748B]">Passcode PIN:</span>
                            <span className="font-mono font-bold text-teal-700">{squad.passcode || '123456'}</span>
                          </div>
                        </div>

                        {/* Player IDs List */}
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Roster Players & IGIDs:
                          </span>
                          {squad.players && squad.players.length > 0 ? (
                            <div className="space-y-1">
                              {squad.players.map((p, pidx) => (
                                <div key={pidx} className="flex justify-between text-[11px]">
                                  <span className="text-[#0F172A] font-medium">{p.name} ({p.role || 'Player'})</span>
                                  <span className="font-mono text-slate-600 font-bold">{p.id}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="font-mono text-[11px] text-slate-700 truncate">{squad.igids || 'N/A'}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1">
                        {squad.status !== 'VERIFIED' && (
                          <button
                            onClick={() => handleVerifySquad(squad.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase flex items-center gap-1 cursor-pointer shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Verify</span>
                          </button>
                        )}
                        {squad.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleRejectSquad(squad.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold uppercase cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyText("Ticket: " + squad.ticketId + " | PIN: " + (squad.passcode || '123456') + " | Team: " + (squad.teamName || squad.name) + " | Slot: " + squad.slot, squad.id)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          title="Copy Pass Credentials"
                        >
                          {copiedId === squad.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteSquad(squad.id)}
                          className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer"
                          title="Delete Registration"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 2: USER ENQUIRIES (DEDICATED SECTION) */}
          {/* ==================================================== */}
          {activeTab === 'ENQUIRIES' && (
            <div className="space-y-6">
              
              {/* Top Header Card with Quick Stats */}
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-montserrat font-extrabold text-base text-[#0F172A] uppercase flex items-center gap-2">
                      <Mail className="w-5 h-5 text-teal-600" />
                      <span>User Enquiries Desk</span>
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Incoming messages, competitive inquiries, and queries submitted through the public Contact & Enquiries portal.
                    </p>
                  </div>
                </div>

                {/* 3 Metrics Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E2E8F0]">
                  <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#64748B] block">Total Enquiries</span>
                      <span className="font-montserrat font-black text-lg text-[#0F172A]">{inquiries.length}</span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-amber-700 block">Open & Pending</span>
                      <span className="font-montserrat font-black text-lg text-amber-900">{openEnquiriesCount}</span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-emerald-700 block">Resolved / Addressed</span>
                      <span className="font-montserrat font-black text-lg text-emerald-900">
                        {inquiries.filter(i => i.status === 'RESOLVED').length}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Search & Status Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search enquiry by sender name, email, subject, or message..."
                      value={inquirySearchQuery}
                      onChange={(e) => setInquirySearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] text-xs focus:border-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {['ALL', 'OPEN', 'RESOLVED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          soundFx.playClick();
                          setInquiryStatusFilter(st);
                        }}
                        className={"px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer " + (
                          inquiryStatusFilter === st
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

              {/* Enquiries Grid */}
              {filteredInquiries.length === 0 ? (
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-10 text-center space-y-2">
                  <Mail className="w-10 h-10 text-slate-400 mx-auto opacity-70" />
                  <h4 className="font-bold text-sm text-[#0F172A]">No Enquiries Found</h4>
                  <p className="text-xs text-[#64748B] max-w-md mx-auto">
                    When viewers, tournament participants, or partners submit messages via the public Contact & Enquiries section, they will instantly display here in real-time.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredInquiries.map((enq) => (
                    <div key={enq.id} className="bg-white border border-[#CBD5E1] rounded-3xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
                      <div>
                        {/* Card Top */}
                        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                              {(enq.name || 'U')[0].toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-montserrat font-bold text-sm text-[#0F172A]">
                                {enq.name || enq.captain || 'Anonymous User'}
                              </h4>
                              <span className="text-[11px] font-mono text-[#64748B]">
                                {enq.time || 'Recent'}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className={"text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase " + (
                              enq.status === 'RESOLVED'
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-amber-100 text-amber-800 border border-amber-300"
                            )}>
                              {enq.status || 'OPEN'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">{enq.id}</span>
                          </div>
                        </div>

                        {/* Sender Contact Info */}
                        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-xs font-sans mb-3">
                          <div className="flex justify-between">
                            <span className="text-[#64748B]">Email Address:</span>
                            <a href={"mailto:" + enq.email} className="text-teal-700 font-bold hover:underline">{enq.email || 'N/A'}</a>
                          </div>
                          {enq.phone && (
                            <div className="flex justify-between">
                              <span className="text-[#64748B]">Phone / WhatsApp:</span>
                              <span className="font-mono font-bold text-[#0F172A]">{enq.phone}</span>
                            </div>
                          )}
                          {enq.squad && (
                            <div className="flex justify-between">
                              <span className="text-[#64748B]">Category / Tag:</span>
                              <span className="font-bold text-slate-700">{enq.squad}</span>
                            </div>
                          )}
                        </div>

                        {/* Message Body */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#1E293B] space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Message Content:</span>
                          <p className="whitespace-pre-line leading-relaxed font-medium">
                            {enq.issue || enq.message || 'No message body provided.'}
                          </p>
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {enq.email && (
                            <a
                              href={"mailto:" + enq.email + "?subject=Re: Enquiry to Madan Conqueror Esports&body=Hi " + (enq.name || 'there') + ",%0D%0A%0D%0ARegarding your enquiry: " + encodeURIComponent(enq.issue || '')}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-black text-white text-xs font-bold uppercase flex items-center gap-1 cursor-pointer shadow-sm"
                            >
                              <Mail className="w-3.5 h-3.5 text-teal-400" />
                              <span>Reply Email</span>
                            </a>
                          )}

                          <button
                            onClick={() => handleToggleInquiryStatus(enq.id, enq.status)}
                            className={"px-3 py-1.5 rounded-xl text-xs font-bold uppercase flex items-center gap-1 cursor-pointer shadow-sm " + (
                              enq.status === 'RESOLVED'
                                ? "bg-amber-100 hover:bg-amber-200 text-amber-800"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            )}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{enq.status === 'RESOLVED' ? 'Re-open' : 'Mark Resolved'}</span>
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteInquiry(enq.id)}
                          className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer"
                          title="Delete Enquiry"
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

          {/* ==================================================== */}
          {/* VIEW 3: HALL OF FAME TOP 10s (SOLO, DUO, SQUAD) */}
          {/* ==================================================== */}
          {activeTab === 'HALL_OF_FAME' && (
            <div className="space-y-6">
              
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-montserrat font-extrabold text-base text-[#0F172A] uppercase flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      <span>Hall of Fame Top 10 Points Table Editor</span>
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Enter and manage all 10 positions for Solo, Duo, and Squad leaderboards. Updates instantly reflect in the public Hall of Fame.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetHof}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Standard</span>
                    </button>
                    <button
                      onClick={handleSaveHof}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 text-black font-extrabold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save {hofFormat} Top 10</span>
                    </button>
                  </div>
                </div>

                {/* Format Switcher (Squad / Duo / Solo) */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E2E8F0]">
                  {[
                    { id: 'SQUAD', label: 'Squad (Top 10 Teams)' },
                    { id: 'DUO', label: 'Duo (Top 10 Pairs)' },
                    { id: 'SOLO', label: 'Solo (Top 10 Warriors)' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        soundFx.playClick();
                        setHofFormat(f.id);
                      }}
                      className={"p-3 rounded-2xl border text-center transition-all cursor-pointer " + (
                        hofFormat === f.id
                          ? "bg-[#0F172A] text-white border-[#0F172A] shadow-sm font-bold text-xs"
                          : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:bg-slate-100 text-xs font-semibold"
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable 10-Row Table */}
              <div className="bg-white border border-[#CBD5E1] rounded-3xl p-5 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-[#64748B] font-mono uppercase text-[10px]">
                        <th className="py-2 px-2.5">Pos</th>
                        <th className="py-2 px-2.5">Team / Player Name *</th>
                        <th className="py-2 px-2.5">Tag</th>
                        <th className="py-2 px-2.5">WWCD (Wins)</th>
                        <th className="py-2 px-2.5">Kill Pts</th>
                        <th className="py-2 px-2.5">Place Pts</th>
                        <th className="py-2 px-2.5">Total Pts</th>
                        <th className="py-2 px-2.5">Honor Badge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {hofEditBuffer.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2 px-2.5 font-bold font-mono text-teal-700">
                            #{idx + 1}
                          </td>
                          <td className="py-2 px-2.5">
                            <input
                              type="text"
                              value={row.teamName || row.name || ''}
                              onChange={(e) => handleHofCellChange(idx, 'teamName', e.target.value)}
                              className="w-full px-2 py-1 rounded-lg border border-[#CBD5E1] font-bold text-[#0F172A]"
                            />
                          </td>
                          <td className="py-2 px-2.5">
                            <input
                              type="text"
                              value={row.clanTag || ''}
                              onChange={(e) => handleHofCellChange(idx, 'clanTag', e.target.value)}
                              className="w-16 px-2 py-1 rounded-lg border border-[#CBD5E1] font-mono text-xs uppercase"
                            />
                          </td>
                          <td className="py-2 px-2.5">
                            <input
                              type="number"
                              value={row.wwcd || 0}
                              onChange={(e) => handleHofCellChange(idx, 'wwcd', e.target.value)}
                              className="w-14 px-2 py-1 rounded-lg border border-[#CBD5E1] font-mono text-center"
                            />
                          </td>
                          <td className="py-2 px-2.5">
                            <input
                              type="number"
                              value={row.kills || 0}
                              onChange={(e) => handleHofCellChange(idx, 'kills', e.target.value)}
                              className="w-14 px-2 py-1 rounded-lg border border-[#CBD5E1] font-mono text-center"
                            />
                          </td>
                          <td className="py-2 px-2.5">
                            <input
                              type="number"
                              value={row.placementPts || 0}
                              onChange={(e) => handleHofCellChange(idx, 'placementPts', e.target.value)}
                              className="w-14 px-2 py-1 rounded-lg border border-[#CBD5E1] font-mono text-center"
                            />
                          </td>
                          <td className="py-2 px-2.5 font-mono font-black text-amber-600">
                            {row.totalPts || row.total || 0}
                          </td>
                          <td className="py-2 px-2.5">
                            <input
                              type="text"
                              value={row.badge || ''}
                              onChange={(e) => handleHofCellChange(idx, 'badge', e.target.value)}
                              className="w-28 px-2 py-1 rounded-lg border border-[#CBD5E1] text-[11px]"
                            />
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
          {/* VIEW 4: TOURNAMENTS MANAGER (POSTING & EDITING) */}
          {/* ==================================================== */}
          {activeTab === 'TOURNAMENTS' && (
            <div className="space-y-6">
              
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-montserrat font-extrabold text-base text-[#0F172A] uppercase flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-teal-600" />
                      <span>Tournaments & Scrims Manager</span>
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Post upcoming championships, modify prize pools, dates, and match rules live on the website.
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
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Post New Tournament</span>
                  </button>
                </div>
              </div>

              {/* Tournaments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tournaments.map((t) => (
                  <div key={t.id} className="bg-white border border-[#CBD5E1] rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold uppercase font-mono">
                          {t.category || 'BOTSQUADWAR'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 font-bold">{t.id}</span>
                      </div>

                      <h4 className="font-montserrat font-bold text-base text-[#0F172A]">
                        {t.title}
                      </h4>
                      <p className="text-xs text-[#64748B] mt-1">{t.description}</p>

                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E2E8F0] text-xs">
                        <div>
                          <span className="text-[10px] text-[#64748B] block">Prize Pool:</span>
                          <strong className="text-amber-700 font-mono">{t.prizePool || t.prize}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#64748B] block">Date:</span>
                          <strong className="text-[#0F172A]">{t.date}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#64748B] block">Format:</span>
                          <strong className="text-[#0F172A]">{t.format}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#64748B] block">Slots:</span>
                          <strong className="text-teal-700 font-mono">{t.filledSlots || 0} / {t.totalSlots || 25} (25 Limited)</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
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
                        {editingTourney ? 'Edit Tournament' : 'Post Upcoming Tournament'}
                      </h4>
                      <button type="button" onClick={() => setShowTourneyModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Tournament Title *</label>
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
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Category Code</label>
                          <input
                            type="text"
                            value={newTourney.category}
                            onChange={(e) => setNewTourney({ ...newTourney, category: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Prize Pool</label>
                          <input
                            type="text"
                            value={newTourney.prize}
                            onChange={(e) => setNewTourney({ ...newTourney, prize: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Date & Timing</label>
                          <input
                            type="text"
                            value={newTourney.date}
                            onChange={(e) => setNewTourney({ ...newTourney, date: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Slots Limit (Default 25)</label>
                          <input
                            type="number"
                            value={newTourney.totalSlots}
                            onChange={(e) => setNewTourney({ ...newTourney, totalSlots: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={newTourney.description}
                          onChange={(e) => setNewTourney({ ...newTourney, description: e.target.value })}
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
                        Save Tournament
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 5: LIVE FAN POLLS (ADMIN CREATION & VOTES) */}
          {/* ==================================================== */}
          {activeTab === 'POLLS' && (
            <div className="space-y-6">
              
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-montserrat font-extrabold text-base text-[#0F172A] uppercase flex items-center gap-2">
                      <BarChart2 className="w-5 h-5 text-teal-600" />
                      <span>Live Fan Polls Management</span>
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Create community polls that viewers and players can vote on directly from the homepage.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddPoll(!showAddPoll)}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showAddPoll ? 'Close Poll Form' : '+ Create New Poll'}</span>
                  </button>
                </div>

                {/* Create Poll Box */}
                {showAddPoll && (
                  <form onSubmit={handleCreatePoll} className="pt-4 border-t border-[#E2E8F0] space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Poll Question *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Which match format should be featured in next week's Mega Championship?"
                        value={newPoll.question}
                        onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-xs font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Option 1 *</label>
                        <input
                          type="text"
                          required
                          placeholder="Option 1"
                          value={newPoll.option1}
                          onChange={(e) => setNewPoll({ ...newPoll, option1: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Option 2 *</label>
                        <input
                          type="text"
                          required
                          placeholder="Option 2"
                          value={newPoll.option2}
                          onChange={(e) => setNewPoll({ ...newPoll, option2: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Option 3 (Optional)</label>
                        <input
                          type="text"
                          placeholder="Option 3"
                          value={newPoll.option3}
                          onChange={(e) => setNewPoll({ ...newPoll, option3: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Option 4 (Optional)</label>
                        <input
                          type="text"
                          placeholder="Option 4"
                          value={newPoll.option4}
                          onChange={(e) => setNewPoll({ ...newPoll, option4: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs uppercase shadow-md cursor-pointer"
                    >
                      Publish Live Poll
                    </button>
                  </form>
                )}
              </div>

              {/* Live Polls Results List */}
              <div className="space-y-4">
                {polls.map((poll) => {
                  const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
                  return (
                    <div key={poll.id} className="bg-white border border-[#CBD5E1] rounded-3xl p-6 shadow-xs space-y-4">
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
          {/* VIEW 6: SPONSORS & PARTNERSHIP REQUESTS (SEPARATE SECTION) */}
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
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Sponsorship Tier</label>
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
          {/* VIEW 7: CREATE TEAMS & ROOM MATCH DISPATCHER */}
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
                    <label className="block text-[10px] font-mono text-teal-400 uppercase font-bold mb-1">Match Timing</label>
                    <input
                      type="text"
                      value={broadcastForm.matchTime || ''}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, matchTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#121722] border border-[#222C3E] text-white"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-[10px] font-mono text-teal-400 uppercase font-bold mb-1">Admin Broadcast Notice</label>
                    <input
                      type="text"
                      value={broadcastForm.broadcastNotice || ''}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, broadcastNotice: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#121722] border border-[#222C3E] text-white"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:brightness-110 text-white font-bold uppercase cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Broadcast Live</span>
                    </button>
                  </div>
                </form>

                {broadcastSavedNotice && (
                  <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Credentials broadcasted live! All verified teams can now see this room in their Team Portal.</span>
                  </div>
                )}
              </div>

              {/* Verified Squad Credentials List */}
              <div className="bg-white border border-[#CBD5E1] rounded-3xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                  <h4 className="font-montserrat font-bold text-sm text-[#0F172A] uppercase">
                    Assigned Teams Roster & PIN Passes ({rosterTeams.length} Registered Teams)
                  </h4>
                  <span className="text-xs text-[#64748B]">Teams can login using their Ticket ID & PIN</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-[#64748B] font-mono uppercase text-[10px]">
                        <th className="py-2 px-3">Slot</th>
                        <th className="py-2 px-3">Team Name</th>
                        <th className="py-2 px-3">Ticket ID</th>
                        <th className="py-2 px-3">PIN Passcode</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {rosterTeams.map((team, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-teal-700">{team.slot || ("SLOT-" + (idx + 1))}</td>
                          <td className="py-2.5 px-3 font-sans font-bold text-[#0F172A]">{team.teamName || team.name}</td>
                          <td className="py-2.5 px-3 font-bold text-[#0F172A]">{team.ticketId}</td>
                          <td className="py-2.5 px-3 text-teal-700 font-bold">{team.passcode || '123456'}</td>
                          <td className="py-2.5 px-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-bold">{team.status}</span></td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleCopyText("Team: " + (team.teamName || team.name) + "\nTicket: " + team.ticketId + "\nPIN: " + (team.passcode || '123456') + "\nSlot: " + team.slot, team.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                            >
                              {copiedId === team.id ? 'Copied!' : 'Copy Pass'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Direct Team Creation Modal */}
              {showCreateTeamModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <form onSubmit={handleCreateTeamDirect} className="bg-white rounded-3xl border border-[#CBD5E1] p-6 max-w-md w-full space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                      <h4 className="font-montserrat font-bold text-base text-[#0F172A] uppercase">
                        Create New Team Credentials
                      </h4>
                      <button type="button" onClick={() => setShowCreateTeamModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Team Name *</label>
                        <input
                          type="text"
                          required
                          value={newTeamData.teamName}
                          onChange={(e) => setNewTeamData({ ...newTeamData, teamName: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Match Format</label>
                        <select
                          value={newTeamData.matchType}
                          onChange={(e) => setNewTeamData({ ...newTeamData, matchType: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                        >
                          <option value="SQUAD">Squad (4-5 Players)</option>
                          <option value="DUO">Duo (2 Players)</option>
                          <option value="SOLO">Solo (1 Player)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Leader / IGL Name</label>
                          <input
                            type="text"
                            value={newTeamData.iglName}
                            onChange={(e) => setNewTeamData({ ...newTeamData, iglName: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">WhatsApp Phone</label>
                          <input
                            type="text"
                            value={newTeamData.iglPhone}
                            onChange={(e) => setNewTeamData({ ...newTeamData, iglPhone: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Custom PIN Passcode (Optional)</label>
                        <input
                          type="text"
                          placeholder="Auto-generated if left blank"
                          value={newTeamData.passcode}
                          onChange={(e) => setNewTeamData({ ...newTeamData, passcode: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] font-mono"
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
                        className="px-5 py-2 rounded-xl bg-[#0F172A] text-white font-bold text-xs uppercase shadow-md"
                      >
                        Create Team Pass
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* ==================================================== */}
          {/* VIEW 8: SERVER TELEMETRY & PING MATRIX */}
          {/* ==================================================== */}
          {activeTab === 'TELEMETRY' && (
            <div className="space-y-6">
              <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                  <div>
                    <h3 className="font-montserrat font-black text-base text-[#0F172A] uppercase flex items-center gap-2">
                      <Wifi className="w-5 h-5 text-teal-600" />
                      <span>Lobby Infrastructure & Server Ping Matrix</span>
                    </h3>
                    <p className="text-xs text-[#64748B]">Real-time low latency nodes for South India & National custom scrims.</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    ALL SYSTEMS ONLINE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { node: 'Chennai Central 01', ping: '14ms', status: 'Optimal', load: '18%' },
                    { node: 'Mumbai Core Cluster', ping: '22ms', status: 'Optimal', load: '34%' },
                    { node: 'Bangalore Edge Node', ping: '16ms', status: 'Optimal', load: '21%' },
                    { node: 'Hyderabad Dedicated', ping: '19ms', status: 'Optimal', load: '28%' }
                  ].map((srv, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#0F172A]">{srv.node}</span>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">{srv.status}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[#64748B]">Latency:</span>
                        <span className="text-teal-700 font-bold">{srv.ping}</span>
                      </div>
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[#64748B]">Cluster Load:</span>
                        <span className="text-slate-700 font-bold">{srv.load}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;
