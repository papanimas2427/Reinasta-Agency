import React from 'react';
import { User, UserRole } from '../types';
import { Shield, UserCheck, ChevronDown, Bell, Lock, Smartphone, Menu, PanelLeftClose, PanelLeftOpen, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  allUsers: User[];
  onSelectUser: (user: User) => void;
  activeTab: string;
  onOpenMobileMenu?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  onOpenMobileMenu,
  onToggleSidebar,
  isSidebarOpen = true,
  theme = 'light',
  onToggleTheme,
}) => {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'owner':
        return { label: 'Agency Owner / Director', bg: 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800' };
      case 'unit_manager':
        return { label: 'Unit Manager (AM)', bg: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
      case 'agent':
        return { label: 'Agent (FC)', bg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'secretary':
        return { label: 'Sekretaris Agency', bg: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
      default:
        return { label: role, bg: 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-slate-700' };
    }
  };

  const roleInfo = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Hamburger Menu Toggle & Brand Logo */}
          <div className="flex items-center space-x-3">
            {/* Hamburger Icon Toggle Button for Autohide Sidebar */}
            <button
              onClick={onToggleSidebar}
              title={isSidebarOpen ? 'Sembunyikan Menu Tab (Autohide)' : 'Tampilkan Menu Tab'}
              className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-slate-700 hover:text-[#ED1C24] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center justify-center shrink-0"
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-5 h-5 text-gray-700 dark:text-gray-200 hover:text-[#ED1C24]" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200 hover:text-[#ED1C24]" />
              )}
            </button>

            <div className="flex items-center space-x-2.5 shrink-0">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#ED1C24]">
                REINASTA Agency
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold bg-red-50 dark:bg-red-950/60 text-[#ED1C24] border border-red-200 dark:border-red-900 rounded-md shrink-0">
                PRUDENTIAL
              </span>
            </div>
          </div>

          {/* Quick Header Action Buttons & User Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle Button (Dark / Light Mode) */}
            <button
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Mode Gelap Aktif (Klik untuk Mode Terang)' : 'Mode Terang Aktif (Klik untuk Mode Gelap)'}
              className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <button
              onClick={() => onSelectUser(currentUser)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span>WA Broadcast</span>
            </button>

            <button
              onClick={() => onSelectUser(currentUser)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#2D8CFF] hover:bg-[#1a7ae6] text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Online Meeting</span>
            </button>

            {/* User Context & Switcher Dropdown */}
            <div className="relative group">
              <div className="flex items-center space-x-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-md border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 hover:border-gray-300 transition-all cursor-pointer">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#ED1C24]/30"
                />
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-[#2D3436] dark:text-slate-100 flex items-center space-x-1">
                    <span>{currentUser.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-slate-400 group-hover:text-gray-600" />
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-slate-400 font-medium flex items-center space-x-1">
                    <span>{currentUser.unitName}</span>
                    {currentUser.pruCode && <span>• Kode: {currentUser.pruCode}</span>}
                  </div>
                </div>
              </div>

              {/* User Switcher Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-gray-200 dark:border-slate-800 py-2 hidden group-hover:block transition-all z-50">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">Pilih User Credential (Simulasi Role)</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Filter data sesuai hak akses role login yang dipilih:</p>
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {allUsers.map((u) => {
                    const badge = getRoleBadge(u.role);
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => onSelectUser(u)}
                        className={`w-full text-left px-4 py-2.5 flex items-center space-x-3 hover:bg-red-50/60 dark:hover:bg-slate-800 transition-colors ${
                          isSelected ? 'bg-red-50/80 dark:bg-slate-800 border-l-4 border-[#ED1C24]' : ''
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 dark:text-slate-100 truncate">{u.name}</p>
                          <span className={`inline-block px-1.5 py-0.2 text-[9px] font-semibold rounded border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate">{u.unitName}</p>
                        </div>
                        {isSelected && <UserCheck className="w-4 h-4 text-[#ED1C24] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Current Active Role Badge */}
            <div className={`hidden lg:flex items-center px-3 py-1 rounded-md text-xs font-semibold border ${roleInfo.bg}`}>
              {currentUser.role === 'owner' || currentUser.role === 'secretary' ? (
                <Lock className="w-3.5 h-3.5 mr-1 text-[#ED1C24]" />
              ) : null}
              {roleInfo.label}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

