import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { RecordsSection } from './components/sections/RecordsSection';
import { TrophiesSection } from './components/sections/TrophiesSection';
import { TournamentsSection } from './components/sections/TournamentsSection';
import { WinnersSection } from './components/sections/WinnersSection';
import { PollSection } from './components/sections/PollSection';
import { CommunitySection } from './components/sections/CommunitySection';
import { SponsorsSection } from './components/sections/SponsorsSection';
import { ContactSection } from './components/sections/ContactSection';
import { TournamentRegistrationModal } from './components/TournamentRegistrationModal';
import { LiveStreamModal } from './components/LiveStreamModal';
import { LoginModal } from './components/LoginModal';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { TeamPortal } from './components/TeamPortal';
import { MobileDrawer } from './components/MobileDrawer';
import { getActiveSession, logoutUser } from './utils/auth';

export function App() {
  const [activeSection, setActiveSection] = useState('hero');
  // Full-page View Router: 'portal' | 'superadmin' | 'admin' | 'team'
  const [currentView, setCurrentView] = useState('portal');

  // Interactive Modals State
  const [isTournamentModalOpen, setIsTournamentModalOpen] = useState(false);
  const [isLiveStreamModalOpen, setIsLiveStreamModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);

  // Restore JWT session on app load
  useEffect(() => {
    const restoreSession = async () => {
      const session = await getActiveSession();
      if (session && session.user) {
        setCurrentUser(session.user);
      }
    };
    restoreSession();
  }, []);

  const handleOpenTournamentModal = (tournament) => {
    setSelectedTournament(tournament || null);
    setIsTournamentModalOpen(true);
  };

  const handleCloseTournamentModal = () => {
    setIsTournamentModalOpen(false);
  };

  const handleOpenLiveStreamModal = () => {
    setIsLiveStreamModalOpen(true);
  };

  const handleCloseLiveStreamModal = () => {
    setIsLiveStreamModalOpen(false);
  };

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleOpenSuperAdmin = () => {
    if (currentUser && currentUser.role === 'SUPER_ADMIN') {
      setCurrentView('superadmin');
    } else if (currentUser) {
      setCurrentView('admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleOpenAdmin = () => {
    if (currentUser) {
      setCurrentView('admin');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = (userOrTeam, token, type) => {
    setIsLoginModalOpen(false);

    if (type === 'team' || userOrTeam?.ticketId || userOrTeam?.passcode) {
      setCurrentTeam(userOrTeam);
      setCurrentView('team');
    } else {
      setCurrentUser(userOrTeam);
      if (userOrTeam?.role === 'SUPER_ADMIN') {
        setCurrentView('superadmin');
      } else {
        setCurrentView('admin');
      }
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setCurrentTeam(null);
    setCurrentView('portal');
  };

  // Scroll spy for public landing page
  useEffect(() => {
    if (currentView !== 'portal') return;

    const handleScroll = () => {
      const sections = ['hero', 'records', 'trophies', 'tournaments', 'winners', 'poll', 'community', 'sponsors', 'contact'];
      const scrollPosition = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // VIEW 1: SUPERADMIN FULL-PAGE DASHBOARD
  if (currentView === 'superadmin') {
    return (
      <>
        <SuperAdminDashboard
          user={currentUser}
          onLogout={handleLogout}
          onSwitchToAdmin={() => setCurrentView('admin')}
          onBackToPortal={() => setCurrentView('portal')}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={handleCloseLogin}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // VIEW 2: MATCH OPS ADMIN FULL-PAGE DASHBOARD
  if (currentView === 'admin') {
    return (
      <>
        <AdminDashboard
          user={currentUser}
          onLogout={handleLogout}
          onSwitchToSuperAdmin={currentUser?.role === 'SUPER_ADMIN' ? () => setCurrentView('superadmin') : undefined}
          onBackToPortal={() => setCurrentView('portal')}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={handleCloseLogin}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // VIEW 3: TEAM / PLAYER DEDICATED ROOM DISPATCHER PORTAL
  if (currentView === 'team') {
    return (
      <>
        <TeamPortal
          team={currentTeam}
          onLogout={handleLogout}
          onBackToPortal={() => setCurrentView('portal')}
        />
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={handleCloseLogin}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // VIEW 4: PUBLIC PORTAL (FULL SCREEN)
  return (
    <div className="min-h-screen bg-[#090B0E] text-[#E2E8F0] font-sans flex antialiased selection:bg-[#E5C05B]/30 selection:text-[#E5C05B]">
      
      {/* Left Slim Vertical Icon Sidebar (Desktop) */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        currentUser={currentUser}
        onOpenSuperAdmin={handleOpenSuperAdmin}
        onOpenAdmin={handleOpenAdmin}
        onOpenLogin={handleOpenLogin}
      />

      {/* Main App Canvas */}
      <div className="flex-1 lg:pl-14 flex flex-col min-h-screen w-full">
        
        {/* Top Navbar */}
        <Navbar
          currentUser={currentUser}
          onOpenLogin={handleOpenLogin}
          onOpenSuperAdmin={handleOpenSuperAdmin}
          onOpenAdmin={handleOpenAdmin}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        />

        {/* Full-Bleed Hero Landing Screen */}
        <HeroSection onOpenTournamentModal={handleOpenTournamentModal} />

        {/* Main Content Sections */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-[1500px] w-full mx-auto space-y-8">
          
          {/* Section 2: Records & Achievements + Connected Timeline */}
          <RecordsSection />

          {/* Section 3: Achievements & Championship Metrics */}
          <TrophiesSection />

          {/* Section 4: Tournaments Hub & Live Countdown */}
          <TournamentsSection onOpenTournamentModal={handleOpenTournamentModal} />

          {/* Section 5: Winners Cash List & Hall of Fame Squads (Seasonal, Solo, Duo, Squad) */}
          <WinnersSection onOpenTournamentModal={handleOpenTournamentModal} />

          {/* Section 6: Live Fan Poll Section */}
          <PollSection />

          {/* Section 7: Community Engagement & Superchat Feed */}
          <CommunitySection />

          {/* Section 8: Sponsors & Supporters Showcase (Replaced Reviews) */}
          <SponsorsSection />

          {/* Section 9: Contact Us & Official Inquiries Desk */}
          <ContactSection />

        </main>

        {/* Bottom Copyright Strip */}
        <footer className="py-6 px-6 border-t border-[#161C26] text-center text-xs font-rajdhani text-gray-500 bg-[#06080B]">
          © {new Date().getFullYear()} MADAN • Mr. Conqueror. Official Competitive Arena.
        </footer>

      </div>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onOpenSuperAdmin={handleOpenSuperAdmin}
        onOpenAdmin={handleOpenAdmin}
        onLogout={handleLogout}
      />

      {/* Interactive Registration Modal */}
      <TournamentRegistrationModal
        isOpen={isTournamentModalOpen}
        onClose={handleCloseTournamentModal}
        selectedTournament={selectedTournament}
      />

      {/* Live Stream Modal */}
      <LiveStreamModal
        isOpen={isLiveStreamModalOpen}
        onClose={handleCloseLiveStreamModal}
      />

      {/* Login Modal with SHA-256 Hashing & Signed JWT */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLogin}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}

export default App;