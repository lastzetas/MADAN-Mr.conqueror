import React from 'react';
import {
  X, Home, Trophy, Swords, MessageSquare, BarChart2, Star, Mail,
  Shield, Crown, Key, LogOut, ArrowRight, ExternalLink
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export const MobileDrawer = ({
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
  currentUser,
  onOpenLogin,
  onOpenSuperAdmin,
  onOpenAdmin,
  onLogout
}) => {
  if (!isOpen) return null;

  const navLinks = [
    { id: 'hero', icon: Home, label: 'Hero Overview', badge: 'Live' },
    { id: 'records', icon: BarChart2, label: 'Career Records & Timeline' },
    { id: 'trophies', icon: Trophy, label: 'Achievements & Milestones' },
    { id: 'tournaments', icon: Swords, label: 'Tournaments Hub', badge: 'S7 War' },
    { id: 'winners', icon: Shield, label: 'Winners & Hall of Fame', highlight: 'OG-BTS 6x' },
    { id: 'community', icon: MessageSquare, label: 'Superchat Feed' },
    { id: 'reviews', icon: Star, label: 'Curated 5-Star Reviews' },
    { id: 'contact', icon: Mail, label: 'Contact & Official Inquiries' },
  ];

  const handleNavClick = (sectionId) => {
    soundFx.playClick();
    onSelectSection?.(sectionId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        onClick={() => {
          soundFx.playClick();
          onClose();
        }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-[85%] max-w-xs bg-[#090C12] border-r border-[#1E2536] text-[#E2E8F0] h-full flex flex-col justify-between shadow-2xl z-10 overflow-y-auto font-sans">
        
        {/* Top Header */}
        <div>
          <div className="p-4 border-b border-[#1E2536] flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#E5C05B]/60 p-0.5 bg-[#11141B]">
                <img
                  src="/assets/conqueror_badge.jpg"
                  alt="Crest"
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-montserrat font-black text-sm text-white tracking-wider uppercase">
                  MADAN
                </span>
                <span className="font-rajdhani text-[10px] tracking-widest text-[#E5C05B] font-bold uppercase -mt-0.5">
                  MR. CONQUEROR
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-[#141822] text-[#788294] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Auth Quick Card */}
          <div className="p-3 mx-3 mt-3 rounded-xl bg-[#0F131C] border border-[#1E2536]">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-[#FFD700]" />
                    <span className="font-montserrat font-bold text-xs text-white uppercase">
                      {currentUser.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : 'MATCH OPS ADMIN'}
                    </span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white text-black font-mono font-bold">
                    JWT ACTIVE
                  </span>
                </div>
                <p className="text-[10px] text-[#94A3B8] font-mono truncate">
                  @{currentUser.username || currentUser.name || (currentUser.role === 'SUPER_ADMIN' ? 'lastzetas' : 'admin')}
                </p>

                <div className="flex items-center gap-1.5 pt-1">
                  {currentUser.role === 'SUPER_ADMIN' ? (
                    <button
                      onClick={() => {
                        soundFx.playVictory();
                        onOpenSuperAdmin?.();
                        onClose();
                      }}
                      className="flex-1 py-1.5 rounded bg-white hover:bg-[#E5E5E5] text-black font-mono font-bold text-[10px] uppercase text-center cursor-pointer transition-colors"
                    >
                      Super Admin Console
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        soundFx.playVictory();
                        onOpenAdmin?.();
                        onClose();
                      }}
                      className="flex-1 py-1.5 rounded bg-white hover:bg-[#E5E5E5] text-black font-mono font-bold text-[10px] uppercase text-center cursor-pointer transition-colors"
                    >
                      Match Ops Desk
                    </button>
                  )}

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onLogout?.();
                      onClose();
                    }}
                    className="p-1.5 rounded bg-[#1A1A1A] border border-[#333] text-[#A3A3A3] hover:text-white cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-montserrat font-bold text-xs text-white uppercase block">
                    COMPETITIVE ACCESS
                  </span>
                  <span className="text-[10px] text-[#788294] font-rajdhani block">
                    Admin & Captain Portal
                  </span>
                </div>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    onOpenLogin?.();
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#E5E5E5] text-black font-mono font-bold text-[10px] uppercase cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Key className="w-3 h-3 text-black" />
                  <span>LOGIN</span>
                </button>
              </div>
            )}
          </div>

          {/* Section Navigation Links */}
          <nav className="p-3 space-y-1">
            <span className="text-[9px] font-mono uppercase text-[#737373] tracking-wider px-2 py-1 block">
              PORTAL NAVIGATION
            </span>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-montserrat transition-all ${
                    active
                      ? 'bg-[#E5C05B]/15 border border-[#E5C05B]/40 text-[#E5C05B] font-bold shadow-[0_0_10px_rgba(229,192,91,0.15)]'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#121620]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </div>

                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950 border border-red-500/40 text-red-300 font-mono font-bold">
                      {link.badge}
                    </span>
                  )}
                  {link.highlight && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E5C05B]/20 text-[#E5C05B] font-mono font-bold">
                      {link.highlight}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom Social & Community Links */}
        <div className="p-3 border-t border-[#1E2536] bg-black/50 space-y-2">
          <span className="text-[9px] font-mono uppercase text-[#737373] tracking-wider block px-1">
            OFFICIAL CHANNELS
          </span>

          <div className="grid grid-cols-5 gap-1.5">
            {/* WhatsApp */}
            <a
              href="https://whatsapp.com/channel/0029Vb3JXh2BlHphOZiCM62W"
              target="_blank"
              rel="noreferrer"
              title="WhatsApp Channel"
              className="h-8 rounded-lg bg-[#25D366] flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.158-.545-1.745-.724-2.883-2.493-2.97-2.609-.088-.116-.708-.941-.708-1.793 0-.852.447-1.272.607-1.446.16-.175.349-.219.465-.219.117 0 .233.001.335.006.107.005.251-.041.393.299.144.349.49 1.194.534 1.281.043.088.072.19.014.305-.058.117-.087.19-.174.29-.087.102-.183.228-.262.306-.087.087-.178.182-.077.355.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.088.277.073.379-.044.102-.116.436-.508.552-.682.117-.174.233-.146.393-.087.16.058 1.018.479 1.193.567.175.087.291.131.335.204.043.072.043.419-.101.824zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.174L2 22l4.98-1.397A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
              </svg>
            </a>

            {/* Discord */}
            <a
              href="https://discord.com/invite/madan"
              target="_blank"
              rel="noreferrer"
              title="Discord"
              className="h-8 rounded-lg bg-[#5865F2] flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/therealmadan/"
              target="_blank"
              rel="noreferrer"
              title="Instagram"
              className="h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* YouTube Channel */}
            <a
              href="https://www.youtube.com/@iammadan"
              target="_blank"
              rel="noreferrer"
              title="YouTube Channel"
              className="h-8 rounded-lg bg-red-600 flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

            {/* YouTube Membership */}
            <a
              href="https://www.youtube.com/channel/UCvtIoElh8qwKV9oOeoCn_pw/join"
              target="_blank"
              rel="noreferrer"
              title="YouTube VIP Membership"
              className="h-8 rounded-lg bg-gradient-to-tr from-[#FFD700] via-[#E5C05B] to-[#8E752D] flex items-center justify-center text-black cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Crown className="w-3.5 h-3.5 text-black fill-black" />
            </a>
          </div>

          <div className="pt-2 text-center text-[10px] font-mono text-[#525252]">
            © {new Date().getFullYear()} MADAN • BGMI Arena
          </div>
        </div>

      </div>
    </div>
  );
};

export default MobileDrawer;
