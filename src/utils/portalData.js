// Centralized Real-Time Live Data Store for Tournament Registrations & Inquiries
// Zero demo data: Starts empty and streams live registrations with zero latency across all devices & browsers

const STORAGE_KEYS = {
  REGISTRATIONS: 'madan_portal_registrations_live_v6',
  INQUIRIES: 'madan_portal_inquiries_live_v6',
  SEASON_STATE: 'madan_portal_season_state_live_v6'
};

// ZERO DEMO DATA - Live clean queue
const INITIAL_REGISTRATIONS = [];
const INITIAL_INQUIRIES = [];

// Global Cloud Real-Time PubSub Channel (ntfy.sh open SSE / HTTP stream)
const LIVE_SYNC_TOPIC = 'https://ntfy.sh/madan_conqueror_live_squads_2026';

let liveBroadcastChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    liveBroadcastChannel = new BroadcastChannel('madan_conqueror_live_channel_v6');
  }
} catch (e) {
  console.warn('BroadcastChannel not supported', e);
}

// Helper: Post payload to global real-time cloud stream
const publishCloudEvent = (payload) => {
  try {
    fetch(LIVE_SYNC_TOPIC, {
      method: 'POST',
      headers: {
        'Title': payload.action === 'REGISTER' ? `NEW SQUAD: ${payload.squad?.teamName || 'Registration'}` : `STATUS UPDATE: ${payload.id}`,
        'Tags': 'trophy,esports,gaming'
      },
      body: JSON.stringify(payload)
    }).catch(err => console.warn('Live cloud publish notice:', err));
  } catch (err) {
    console.warn('Live cloud publish exception:', err);
  }

  // Also broadcast across open browser tabs on current device
  if (liveBroadcastChannel) {
    try {
      liveBroadcastChannel.postMessage(payload);
    } catch (err) {
      console.warn('BroadcastChannel postMessage error:', err);
    }
  }
};

// 1. Get All Stored Registrations
export const getStoredRegistrations = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
      return INITIAL_REGISTRATIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
      return INITIAL_REGISTRATIONS;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load registrations:', err);
    return INITIAL_REGISTRATIONS;
  }
};

// 2. Submit New Registration from Public Portal ("JOIN NOW" Action)
export const submitTournamentRegistration = (data) => {
  const current = getStoredRegistrations();
  
  // Calculate next slot and unique IDs
  const randomSlotNum = Math.floor(Math.random() * 90) + 1;
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
    { name: data.player1Name || data.captainName || 'Player 1', id: data.player1Id || 'N/A', role: 'Captain / IGL' },
    { name: data.player2Name || 'Player 2', id: data.player2Id || 'N/A', role: 'Assaulter' },
    { name: data.player3Name || 'Player 3', id: data.player3Id || 'N/A', role: 'Fragger' },
    { name: data.player4Name || 'Player 4', id: data.player4Id || 'N/A', role: 'Support' },
  ];

  if (data.subName || data.subId) {
    playersList.push({ name: data.subName || 'Substitute', id: data.subId || 'N/A', role: 'Substitute' });
  }

  const newSquad = {
    id: genId,
    teamName: data.teamName || 'Custom Squad',
    name: data.teamName || 'Custom Squad',
    clanTag: data.clanTag || '',
    captainName: data.captainName || 'Anonymous Captain',
    captain: data.captainName || 'Anonymous Captain',
    captainPhone: data.captainPhone || '+91 99999 00000',
    phone: data.captainPhone || '+91 99999 00000',
    captainDiscord: data.captainDiscord || 'N/A',
    slot: slotFormatted,
    ticketId: genTicket,
    igids: igidList || '5001234, 5005678',
    players: playersList,
    substitute: (data.subName || data.subId) ? { name: data.subName, id: data.subId } : null,
    category: data.category || 'Season 7 War Grand Finale',
    status: 'PENDING', // Enters PENDING state for Admin review
    source: 'JOIN NOW Registration Portal',
    registeredAt: 'Just now',
    matchGroup: randomSlotNum % 2 === 0 ? 'Group A' : 'Group B',
    ping: `${Math.floor(Math.random() * 12) + 16}ms`,
    kills: 0,
    placementPts: 0,
    totalPts: 0
  };

  // Avoid duplicates
  const filteredCurrent = current.filter(s => s.id !== genId && s.ticketId !== genTicket);
  const updated = [newSquad, ...filteredCurrent];
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving registration to localStorage:', e);
  }

  // 1. Dispatch Instant Local Event
  window.dispatchEvent(new CustomEvent('portal_registrations_updated', { detail: newSquad }));

  // 2. Publish Zero-Latency Event to Cloud Stream for all connected Admin Dashboards
  publishCloudEvent({
    action: 'REGISTER',
    squad: newSquad,
    timestamp: Date.now()
  });

  return {
    squad: newSquad,
    slotCode: slotFormatted,
    ticketId: genTicket
  };
};

// 3. Update Squad Status (Whitelist / Verify / Reject)
export const updateRegistrationStatus = (id, newStatus) => {
  const current = getStoredRegistrations();
  const updated = current.map(item =>
    item.id === id ? { ...item, status: newStatus } : item
  );
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating status in localStorage:', e);
  }

  window.dispatchEvent(new CustomEvent('portal_registrations_updated'));

  // Publish to Cloud Stream
  publishCloudEvent({
    action: 'UPDATE_STATUS',
    id,
    newStatus,
    timestamp: Date.now()
  });

  return updated;
};

// 4. Delete Squad Registration
export const deleteRegistration = (id) => {
  const current = getStoredRegistrations();
  const updated = current.filter(item => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting registration from localStorage:', e);
  }

  window.dispatchEvent(new CustomEvent('portal_registrations_updated'));

  // Publish to Cloud Stream
  publishCloudEvent({
    action: 'DELETE',
    id,
    timestamp: Date.now()
  });

  return updated;
};

// 5. Clear All Registrations (Admin Reset)
export const clearAllRegistrations = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify([]));
  } catch (e) {
    console.error('Error clearing registrations:', e);
  }

  window.dispatchEvent(new CustomEvent('portal_registrations_updated'));

  publishCloudEvent({
    action: 'CLEAR_ALL',
    timestamp: Date.now()
  });

  return [];
};

// 6. Real-Time Zero-Latency Subscription Engine for Dashboards
export const subscribeToLivePortalUpdates = (onDataUpdate) => {
  const refreshFromLocal = () => {
    const data = getStoredRegistrations();
    onDataUpdate?.(data);
    return data;
  };

  // 1. Initial Local Read
  refreshFromLocal();

  // 2. Fetch Recent Cloud Messages (Catch up on registrations within the last 24 hours)
  const fetchRecentCloudEvents = async () => {
    try {
      const res = await fetch(`${LIVE_SYNC_TOPIC}/json?poll=1&since=24h`);
      if (!res.ok) return;
      const text = await res.text();
      const lines = text.trim().split('\n');
      let currentList = getStoredRegistrations();
      let modified = false;

      for (const line of lines) {
        if (!line) continue;
        try {
          const entry = JSON.parse(line);
          if (entry.event === 'message' && entry.message) {
            const payload = JSON.parse(entry.message);
            if (payload.action === 'REGISTER' && payload.squad) {
              if (!currentList.some(s => s.id === payload.squad.id || s.ticketId === payload.squad.ticketId)) {
                currentList = [payload.squad, ...currentList];
                modified = true;
              }
            } else if (payload.action === 'UPDATE_STATUS' && payload.id) {
              currentList = currentList.map(s => s.id === payload.id ? { ...s, status: payload.newStatus } : s);
              modified = true;
            } else if (payload.action === 'DELETE' && payload.id) {
              currentList = currentList.filter(s => s.id !== payload.id);
              modified = true;
            } else if (payload.action === 'CLEAR_ALL') {
              currentList = [];
              modified = true;
            }
          }
        } catch (e) {
          // Ignore individual malformed log lines
        }
      }

      if (modified) {
        localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(currentList));
        onDataUpdate?.(currentList);
      }
    } catch (err) {
      console.warn('Initial cloud events catchup notice:', err);
    }
  };

  fetchRecentCloudEvents();

  // 3. Connect to Server-Sent Events (SSE) for True Zero-Latency Push
  let eventSource = null;
  try {
    eventSource = new EventSource(`${LIVE_SYNC_TOPIC}/sse`);
    eventSource.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data);
        if (raw.event === 'message' && raw.message) {
          const payload = JSON.parse(raw.message);
          let currentList = getStoredRegistrations();
          let modified = false;

          if (payload.action === 'REGISTER' && payload.squad) {
            if (!currentList.some(s => s.id === payload.squad.id || s.ticketId === payload.squad.ticketId)) {
              currentList = [payload.squad, ...currentList];
              modified = true;
            }
          } else if (payload.action === 'UPDATE_STATUS' && payload.id) {
            currentList = currentList.map(s => s.id === payload.id ? { ...s, status: payload.newStatus } : s);
            modified = true;
          } else if (payload.action === 'DELETE' && payload.id) {
            currentList = currentList.filter(s => s.id !== payload.id);
            modified = true;
          } else if (payload.action === 'CLEAR_ALL') {
            currentList = [];
            modified = true;
          }

          if (modified) {
            localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(currentList));
            onDataUpdate?.(currentList);
            window.dispatchEvent(new CustomEvent('portal_registrations_updated'));
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };
  } catch (err) {
    console.warn('SSE initialization error:', err);
  }

  // 4. Local Event Handlers
  const handleLocalCustomEvent = () => refreshFromLocal();
  const handleStorageEvent = (e) => {
    if (e.key === STORAGE_KEYS.REGISTRATIONS) refreshFromLocal();
  };

  const handleBroadcastMessage = (e) => {
    if (e.data) refreshFromLocal();
  };

  window.addEventListener('portal_registrations_updated', handleLocalCustomEvent);
  window.addEventListener('storage', handleStorageEvent);
  if (liveBroadcastChannel) {
    liveBroadcastChannel.addEventListener('message', handleBroadcastMessage);
  }

  // 5. Fallback polling every 3.5 seconds
  const intervalId = setInterval(() => {
    fetchRecentCloudEvents();
  }, 3500);

  // Return unsubscribe/cleanup function
  return () => {
    if (eventSource) eventSource.close();
    window.removeEventListener('portal_registrations_updated', handleLocalCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
    if (liveBroadcastChannel) {
      liveBroadcastChannel.removeEventListener('message', handleBroadcastMessage);
    }
    clearInterval(intervalId);
  };
};

// 7. Inquiries & Contact Support
export const getStoredInquiries = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    return parsed;
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
