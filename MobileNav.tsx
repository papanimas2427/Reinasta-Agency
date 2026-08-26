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
  Calculator,
  Brain,
  Users,
  Trophy
} from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: User;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange, currentUser }) => {
  const canAccessFinance = currentUser.role === 'owner' || currentUser.role === 'secretary';
  const isAgent = currentUser.role === 'agent';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'kontes', label: 'Kontes', icon: Trophy },
    { id: 'kalkulator', label: 'Kalkulator', icon: Calculator },
    { id: 'pitch_coach', label: 'AI Pitch', icon: Brain },
    { id: 'rekrutmen', label: 'Rekrutmen', icon: UserPlus },
    { id: 'agents', label: 'Data Agent', icon: Users },
    { id: 'training', label: 'Materi', icon: BookOpen },
    { id: 'closing', label: 'Closing', icon: FileCheck2 },
    { id: 'evaluasi', label: 'Performa', icon: BarChart3 },
    ...(canAccessFinance ? [{ id: 'keuangan', label: 'Keuangan', icon: Wallet }] : []),
    ...(!isAgent ? [{ id: 'meeting', label: 'Meeting', icon: Video }] : []),
    ...(!isAgent ? [{ id: 'whatsapp', label: 'Broadcast', icon: MessageSquare }] : []),
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around overflow-x-auto no-scrollbar py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-xl text-[10px] font-medium transition-all ${
                isActive ? 'text-red-600 font-bold bg-red-50' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-red-600' : 'text-gray-500'}`} />
              <span className="truncate max-w-[60px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
