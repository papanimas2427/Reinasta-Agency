import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';
import { Shield, Lock, ArrowRight, UserCheck, CheckCircle2, Download, Upload, HardDriveDownload } from 'lucide-react';

interface LoginModalProps {
  allUsers: User[];
  currentUser: User;
  onSelectUser: (user: User) => void;
  onClose: () => void;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (backup: { app?: string; version?: number; data?: Record<string, unknown> }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  allUsers,
  currentUser,
  onSelectUser,
  onClose,
  onResetData,
  onExportData,
  onImportData,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        onImportData(parsed);
      } catch {
        window.alert('File backup tidak valid (bukan JSON).');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredUsers = allUsers.filter((u) => u.role === selectedRole);

  const getRoleTitle = (r: UserRole) => {
    switch (r) {
      case 'owner':
        return 'Agency Owner / Director';
      case 'unit_manager':
        return 'Unit Manager (Agency Manager)';
      case 'agent':
        return 'Agent Pemasar (Financial Consultant)';
      case 'secretary':
        return 'Sekretaris Agency (Admin & Keuangan)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-md max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200">
        <div className="text-center space-y-1.5 mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#ED1C24] tracking-tight">
            REINASTA Agency
          </h2>
          <p className="text-xs font-bold text-gray-700 tracking-wider uppercase">PRUDENTIAL AGENCY PORTAL</p>
          <p className="text-xs text-gray-500">Pilih Role Credential Login untuk Pengujian Sistem Portal</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {(['owner', 'unit_manager', 'agent', 'secretary'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`p-2.5 rounded-md border text-xs font-bold transition-all text-center cursor-pointer ${
                selectedRole === r
                  ? 'bg-[#ED1C24] text-white border-[#ED1C24] shadow-xs'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {r === 'owner' && 'Owner / Director'}
              {r === 'unit_manager' && 'Unit Manager'}
              {r === 'agent' && 'Agent Pemasar'}
              {r === 'secretary' && 'Sekretaris'}
            </button>
          ))}
        </div>

        {/* User Card Selection List */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {filteredUsers.map((u) => {
            const isSelected = u.id === currentUser.id;
            return (
              <div
                key={u.id}
                onClick={() => {
                  onSelectUser(u);
                  onClose();
                }}
                className={`p-3.5 rounded-md border cursor-pointer flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-red-50/80 border-[#ED1C24] border-l-4 font-bold text-[#ED1C24]'
                    : 'bg-white border-gray-200 hover:border-red-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-red-500/20" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">{u.name}</p>
                    <p className="text-[11px] text-gray-500">{u.unitName} {u.pruCode ? `• Kode: ${u.pruCode}` : ''}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isSelected ? (
                    <span className="flex items-center text-[10px] font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Aktif
                    </span>
                  ) : (
                    <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs">
                      Masuk
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Management: Backup / Restore / Reset */}
        <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <HardDriveDownload className="w-3.5 h-3.5 text-gray-400" />
            Manajemen Data
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={onExportData}
              className="px-3 py-1.5 text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Backup Data (JSON)
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-[11px] font-bold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Pulihkan dari Backup
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleFileSelected}
            />
          </div>
          <div className="pt-3 border-t border-gray-100 flex flex-col items-center gap-2">
            <button
              onClick={onClose}
              className="text-xs font-bold text-gray-500 hover:text-gray-900"
            >
              Tutup Windows Login
            </button>
            <button
              onClick={onResetData}
              className="text-[11px] font-semibold text-red-500 hover:text-red-700 hover:underline"
            >
              ↺ Reset Data Demo ke Kondisi Awal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
