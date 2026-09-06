import React, { useState } from 'react';
import { Search, Menu, X, Crown, Key, UserCheck, Shield } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const Navbar = ({
  currentUser,
  onOpenLogin,
  onOpenSuperAdmin,
  onOpenAdmin,
  onOpenMobileDrawer
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAuthBadgeClick = () => {
    soundFx.playVictory();
    if (currentUser?.role === 'SUPER_ADMIN') {
      onOpenSuperAdmin?.();
    } else if (currentUser?.role === 'ADMIN') {
      onOpenAdmin?.();
    } else {
      onOpenLogin?.();
    }
  };

  const handleMenuClick = () => {
    soundFx.playClick();
    onOpenMobileDrawer?.();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#090B0E]/95 backdrop-blur-md border-b border-[#1B212D] px-3 sm:px-6 py-2.5">
      <div className="flex items-center justify-between max-w-[1500px] mx-auto w-full">
        
        {/* Left: Crest + Title MADAN & Tagline Mr. Conqueror */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 rounded-md overflow-hidden border border-[#E5C05B]/60 p-0.5 bg-[#11141B] flex items-center justify-center shadow-[0_0_10px_rgba(229,192,91,0.25)]">
            <img
              src="/assets/conqueror_badge.jpg"
              alt="Crest"
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-montserrat font-black text-xs sm:text-sm md:text-base tracking-wider text-[#EAECEF] uppercase">
              MADAN
            </span>
            <span className="font-rajdhani text-[10px] sm:text-[11px] tracking-widest text-[#E5C05B] font-bold uppercase -mt-0.5">
              Mr. Conqueror
            </span>
          </div>
        </div>

        {/* Right: Search, Super Admin Badge, and Menu */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {searchOpen ? (
            <div className="flex items-center bg-[#141822] border border-[#E5C05B]/40 rounded px-2.5 py-1">
              <Search className="w-3.5 h-3.5 text-[#788294] mr-2" />
              <input
                type="text"
                placeholder="Search portal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none w-28 sm:w-48 font-sans"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-[#788294] hover:text-white ml-1 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                soundFx.playClick();
                setSearchOpen(true);
              }}
              className="p-1.5 text-[#8A95A6] hover:text-[#E5C05B] transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Super Admin Status Pill or Login Button */}
          {currentUser ? (
            <button
              onClick={handleAuthBadgeClick}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#2A200B] to-[#161208] border border-[#E5C05B]/60 text-[#E5C05B] hover:border-[#E5C05B] text-[11px] sm:text-xs font-montserrat font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(229,192,91,0.25)] transition-all cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
              <span className="hidden sm:inline">
                {currentUser.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : 'MATCH OPS'}
              </span>
              <span className="sm:hidden">
                {currentUser.role === 'SUPER_ADMIN' ? 'SA' : 'OPS'}
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenLogin?.();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#141822] hover:bg-[#1E2536] border border-[#2B3448] text-[#CBD5E1] hover:text-[#E5C05B] text-[11px] sm:text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-[#E5C05B]" />
              <span>LOGIN</span>
            </button>
          )}

          {/* Mobile Navigation Drawer Toggle (visible on mobile, opens slide drawer) */}
          <button
            onClick={handleMenuClick}
            className="p-1.5 text-[#E5C05B] hover:text-[#FFD700] transition-colors cursor-pointer hover:scale-110 lg:hidden"
            title="Open Mobile Navigation Menu"
          >
            <Menu className="w-5 h-5 text-[#E5C05B]" />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;