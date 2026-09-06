// Centralized data store for Tournament Registrations, Squad Join Requests, and Inquiries
// Persisted in localStorage and synchronizes across all components in real-time

const STORAGE_KEYS = {
  REGISTRATIONS: 'madan_portal_registrations_v2',
  INQUIRIES: 'madan_portal_inquiries_v2',
  SEASON_STATE: 'madan_portal_season_state_v2'
};

// Initial Seed Data
const INITIAL_REGISTRATIONS = [
  {
    id: 'SQ-101',
    teamName: 'OG-BTS (OG Battle Squad)',
    clanTag: 'OG',
    captainName: 'OG_Viper',
    captainPhone: '+91 98401 23456',
    captainDiscord: 'viper#0001',
    slot: 'SLOT-01',
    ticketId: 'MC-819201',
    igids: '5129384, 5839201, 5729104, 5910293',
    players: [
      { name: 'OG_Viper', id: '5129384', role: 'Captain / IGL' },
      { name: 'OG_Shadow', id: '5839201', role: 'Assaulter' },
      { name: 'OG_Recon', id: '5729104', role: 'Sniper' },
      { name: 'OG_Blaze', id: '5910293', role: 'Support' }
    ],
    category: 'Season 7 War Grand Finale',
    status: 'WHITELISTED',
    registeredAt: '15 mins ago',
    matchGroup: 'Group A',
    ping: '18ms',
    kills: 64,
    placementPts: 10,
    totalPts: 74
  },
  {
    id: 'SQ-102',
    teamName: 'Tamil Titans Esports',
    clanTag: 'TTN',
    captainName: 'TTN_Vijay',
    captainPhone: '+91 94441 56789',
    captainDiscord: 'vijay#9921',
    slot: 'SLOT-02',
    ticketId: 'MC-729104',
    igids: '5482910, 5392019, 5719203, 5620194',
    players: [
      { name: 'TTN_Vijay', id: '5482910', role: 'Captain' },
      { name: 'TTN_Karna', id: '5392019', role: 'Assaulter' },
      { name: 'TTN_Surya', id: '5719203', role: 'Flanker' },
      { name: 'TTN_Vel', id: '5620194', role: 'Support' }
    ],
    category: 'Season 7 War Grand Finale',
    status: 'WHITELISTED',
    registeredAt: '30 mins ago',
    matchGroup: 'Group A',
    ping: '22ms',
    kills: 42,
    placementPts: 6,
    totalPts: 48
  },
  {
    id: 'SQ-103',
    teamName: 'Team Soul Esports',
    clanTag: 'SOUL',
    captainName: 'Soul_Mortal',
    captainPhone: '+91 98840 11223',
    captainDiscord: 'mortal#0007',
    slot: 'SLOT-03',
    ticketId: 'MC-902194',
    igids: '5110293, 5829104, 5392019, 5729102',
    players: [
      { name: 'Soul_Mortal', id: '5110293', role: 'Captain / IGL' },
      { name: 'Soul_Viper', id: '5829104', role: 'Assaulter' },
      { name: 'Soul_Regaltos', id: '5392019', role: 'Fragger' },
      { name: 'Soul_Aman', id: '5729102', role: 'Support' }
    ],
    category: 'Season 7 War Grand Finale',
    status: 'WHITELISTED',
    registeredAt: '45 mins ago',
    matchGroup: 'Group A',
    ping: '19ms',
    kills: 52,
    placementPts: 5,
    totalPts: 57
  },
  {
    id: 'SQ-104',
    teamName: 'GodLike Arena',
    clanTag: 'GODL',
    captainName: 'GodL_Jonathan',
    captainPhone: '+91 99620 44556',
    captainDiscord: 'jonathan#1010',
    slot: 'SLOT-04',
    ticketId: 'MC-482019',
    igids: '5992019, 5819203, 5302914, 5719200',
    players: [
      { name: 'GodL_Jonathan', id: '5992019', role: 'Captain' },
      { name: 'GodL_Neyoo', id: '5819203', role: 'Assaulter' },
      { name: 'GodL_Zgod', id: '5302914', role: 'Support' },
      { name: 'GodL_Shadow', id: '5719200', role: 'Fragger' }
    ],
    category: 'Season 7 War Grand Finale',
    status: 'PENDING',
    registeredAt: '1 hour ago',
    matchGroup: 'Group B',
    ping: '25ms',
    kills: 48,
    placementPts: 4,
    totalPts: 52
  },
  {
    id: 'SQ-105',
    teamName: 'Team 8Bit Pro',
    clanTag: '8BIT',
    captainName: '8Bit_Juicy',
    captainPhone: '+91 97900 77889',
    captainDiscord: 'juicy#8888',
    slot: 'SLOT-05',
    ticketId: 'MC-391029',
    igids: '5291029, 5719204, 5819201, 5392011',
    players: [
      { name: '8Bit_Juicy', id: '5291029', role: 'Captain' },
      { name: '8Bit_Mighty', id: '5719204', role: 'Assaulter' },
      { name: '8Bit_Beast', id: '5819201', role: 'Sniper' },
      { name: '8Bit_Clutch', id: '5392011', role: 'Support' }
    ],
    category: 'Season 7 War Grand Finale',
    status: 'WHITELISTED',
    registeredAt: '2 hours ago',
    matchGroup: 'Group B',
    ping: '20ms',
    kills: 39,
    placementPts: 3,
    totalPts: 42
  },
  {
    id: 'SQ-106',
    teamName: 'Hydra Clan Alpha',
    clanTag: 'HYDRA',
    captainName: 'Hydra_Alpha',
    captainPhone: '+91 98412 33445',
    captainDiscord: 'alpha#7777',
    slot: 'SLOT-06',
    ticketId: 'MC-192049',
    igids: '5401928, 5192039, 5820192, 5391029',
    players: [
      { name: 'Hydra_Alpha', id: '5401928', role: 'Captain' },
      { name: 'Hydra_Dynamo', id: '5192039', role: 'Assaulter' },
      { name: 'Hydra_Wraith', id: '5820192', role: 'Fragger' },
      { name: 'Hydra_Ghost', id: '5391029', role: 'Support' }
    ],
    category: 'Season 7 War Grand Finale',
    status: 'PENDING',
    registeredAt: '3 hours ago',
    matchGroup: 'Group B',
    ping: '28ms',
    kills: 35,
    placementPts: 2,
    totalPts: 37
  }
];

const INITIAL_INQUIRIES = [
  {
    id: 'INQ-801',
    name: 'OG_Viper',
    captain: 'OG_Viper',
    email: 'viper@ogbts.gg',
    squad: 'OG-BTS',
    issue: 'Slot change request to Slot 01 confirmed for Season 7 War finals',
    status: 'RESOLVED',
    time: '12m ago'
  },
  {
    id: 'INQ-802',
    name: 'GodL_Jonathan',
    captain: 'GodL_Jonathan',
    email: 'jonathan@godlike.in',
    squad: 'GodLike Arena',
    issue: 'Substitute player IGID update for Erangel Match 2',
    status: 'OPEN',
    time: '28m ago'
  },
  {
    id: 'INQ-803',
    name: 'Hydra_Alpha',
    captain: 'Hydra_Alpha',
    email: 'alpha@hydra.gg',
    squad: 'Hydra Clan',
    issue: 'Room ping verification from Chennai edge server',
    status: 'OPEN',
    time: '45m ago'
  }
];

// 1. Get All Registrations
export const getStoredRegistrations = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
      return INITIAL_REGISTRATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load registrations:', err);
    return INITIAL_REGISTRATIONS;
  }
};

// 2. Submit New Registration from Public Portal
export const submitTournamentRegistration = (data) => {
  const current = getStoredRegistrations();
  
  // Calculate next slot and IDs
  const randomSlotNum = Math.floor(Math.random() * 80) + 7;
  const slotFormatted = `SLOT-${randomSlotNum < 10 ? '0' + randomSlotNum : randomSlotNum}`;
  const genId = `SQ-${Math.floor(100 + Math.random() * 900)}`;
  const genTicket = `MC-${Math.floor(100000 + Math.random() * 900000)}`;

  const igidList = [
    data.player1Id,
    data.player2Id,
    data.player3Id,
    data.player4Id,
    data.subId
  ].filter(Boolean).join(', ');

  const playersList = [
    { name: data.player1Name || data.captainName, id: data.player1Id, role: 'Captain / IGL' },
    { name: data.player2Name || 'Player 2', id: data.player2Id, role: 'Assaulter' },
    { name: data.player3Name || 'Player 3', id: data.player3Id, role: 'Fragger' },
    { name: data.player4Name || 'Player 4', id: data.player4Id, role: 'Support' },
  ];

  if (data.subName && data.subId) {
    playersList.push({ name: data.subName, id: data.subId, role: 'Substitute' });
  }

  const newSquad = {
    id: genId,
    teamName: data.teamName || 'Custom Squad',
    clanTag: data.clanTag || '',
    captainName: data.captainName || 'Anonymous Captain',
    captainPhone: data.captainPhone || '+91 99999 00000',
    captainDiscord: data.captainDiscord || '',
    slot: slotFormatted,
    ticketId: genTicket,
    igids: igidList || '5001234, 5005678',
    players: playersList,
    category: data.category || 'Season 7 War Grand Finale',
    status: 'PENDING', // Submissions enter as PENDING for admin review
    registeredAt: 'Just now',
    matchGroup: randomSlotNum % 2 === 0 ? 'Group A' : 'Group B',
    ping: `${Math.floor(Math.random() * 12) + 16}ms`,
    kills: 0,
    placementPts: 0,
    totalPts: 0
  };

  const updated = [newSquad, ...current];
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving registration:', e);
  }

  // Notify all open admin dashboards / components
  window.dispatchEvent(new CustomEvent('portal_registrations_updated', { detail: newSquad }));

  return {
    squad: newSquad,
    slotCode: slotFormatted,
    ticketId: genTicket
  };
};

// 3. Update Squad Status (Whitelist, Reject, Verify)
export const updateRegistrationStatus = (id, newStatus) => {
  const current = getStoredRegistrations();
  const updated = current.map(item =>
    item.id === id ? { ...item, status: newStatus } : item
  );
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating status:', e);
  }

  window.dispatchEvent(new CustomEvent('portal_registrations_updated'));
  return updated;
};

// 4. Delete Squad
export const deleteRegistration = (id) => {
  const current = getStoredRegistrations();
  const updated = current.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting registration:', e);
  }

  window.dispatchEvent(new CustomEvent('portal_registrations_updated'));
  return updated;
};

// 5. Inquiries & Contact Requests
export const getStoredInquiries = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load inquiries:', err);
    return INITIAL_INQUIRIES;
  }
};

export const submitContactInquiry = ({ name, email, message, squad = 'Public Player' }) => {
  const current = getStoredInquiries();
  const genId = `INQ-${Math.floor(800 + Math.random() * 199)}`;
  const newInquiry = {
    id: genId,
    name: name || 'Anonymous',
    captain: name || 'Anonymous',
    email: email || '',
    squad: squad || 'Public Inquiry',
    issue: message || 'General match inquiries & sponsorship proposal',
    status: 'OPEN',
    time: 'Just now'
  };

  const updated = [newInquiry, ...current];
  try {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving inquiry:', e);
  }

  window.dispatchEvent(new CustomEvent('portal_inquiries_updated', { detail: newInquiry }));
  return newInquiry;
};

export const resolveInquiry = (id) => {
  const current = getStoredInquiries();
  const updated = current.map(item =>
    item.id === id ? { ...item, status: 'RESOLVED' } : item
  );
  try {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
  } catch (e) {
    console.error('Error resolving inquiry:', e);
  }

  window.dispatchEvent(new CustomEvent('portal_inquiries_updated'));
  return updated;
};
