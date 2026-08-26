import React from 'react';
import { User } from '../types';
import {
  LayoutDashboard,
  UserPlus,
  BookOpen,
  BarChart3,
  FileCheck2,
  Wallet,
  Video,
  MessageSquare,
  Scale,
  Lock,
  Sparkles,
  Calculator,
  Brain,
  Users,
  Trophy
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: User;
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, currentUser, isOpen = true }) => {
  const canAccessFinance = currentUser.role === 'owner' || currentUser.role === 'secretary';
  const isAgent = currentUser.role === 'agent';

  if (!isOpen) {
    return null;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'kontes', label: 'Kontes Agensi', icon: Trophy },
    { id: 'kalkulator', label: 'Kalkulator Komisi & MDRT', icon: Calculator },
    { id: 'pitch_coach', label: 'AI Sales Pitch Coach', icon: Brain },
    { id: 'rekrutmen', label: 'Rekrutmen Agen', icon: UserPlus },
    { id: 'agents', label: 'Data Agent', icon: Users },
    { id: 'training', label: 'Materi Training', icon: BookOpen },
    { id: 'evaluasi', label: 'Evaluasi & Performa', icon: BarChart3 },
    { id: 'closing', label: 'Progres Closing (SPAJ)', icon: FileCheck2 },
    {
      id: 'keuangan',
      label: 'Keuangan Agency',
      icon: Wallet,
      restricted: !canAccessFinance,
      restrictedLabel: 'Owner & Sekretaris Only'
    },
    {
      id: 'meeting',
      label: 'Meeting Online',
      icon: Video,
      restricted: isAgent,
      restrictedLabel: 'Unit Manager & Owner Only'
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Broadcast',
      icon: MessageSquare,
      restricted: isAgent,
      restrictedLabel: 'Unit Manager & Owner Only'
    },
    { id: 'prudential_rules', label: 'Aturan Prudential', icon: Scale },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 hidden md:block shrink-0 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between transition-colors">
      <div>
        {/* Role Notice Card */}
        <div className="mb-4 p-3 rounded-md bg-red-50/60 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#ED1C24] mb-1">
            <Sparkles className="w-4 h-4 text-[#ED1C24]" />
            <span>Akses Portal Logged-In</span>
          </div>
          <p className="text-[11px] text-gray-600 dark:text-slate-400 leading-relaxed">
            Tampilan disesuaikan untuk <strong className="text-gray-900 dark:text-slate-200">{currentUser.name}</strong> ({currentUser.role}).
          </p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isRestricted = item.restricted;

            return (
              <button
                key={item.id}
                disabled={isRestricted}
                onClick={() => !isRestricted && onTabChange(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  isRestricted
                    ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500'
                    : isActive
                    ? 'bg-red-50 dark:bg-red-950/60 text-[#ED1C24] font-bold'
                    : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#ED1C24]' : 'text-gray-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {isRestricted && <Lock className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info Bottom Box & Compliance Tag */}
      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-slate-800/80 rounded-md">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-[#2D3436] dark:text-slate-200 truncate">{currentUser.name}</div>
            <div className="text-[10px] text-gray-500 dark:text-slate-400 capitalize truncate">{currentUser.role.replace('_', ' ')}</div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-sm bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Prudential Syariah Verified</span>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1.5">© 2026 Reinasta Agency</p>
        </div>
      </div>
    </aside>
  );
};
