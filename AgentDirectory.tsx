import React, { useState, useMemo } from 'react';
import { User, PerformanceRecord } from '../types';
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  Building2,
  Award,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  ChevronRight,
  UserCheck,
  Sparkles,
  X
} from 'lucide-react';

interface AgentDirectoryProps {
  currentUser: User;
  allUsers: User[];
  performanceRecords?: PerformanceRecord[];
}

export const AgentDirectory: React.FC<AgentDirectoryProps> = ({
  currentUser,
  allUsers,
  performanceRecords = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedLicense, setSelectedLicense] = useState<string>('all');
  const [selectedAgentModal, setSelectedAgentModal] = useState<User | null>(null);

  // Extract unique units for filter
  const uniqueUnits = useMemo(() => {
    const set = new Set<string>();
    allUsers.forEach((u) => {
      if (u.unitName) set.add(u.unitName);
    });
    return Array.from(set).sort();
  }, [allUsers]);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      // Unit filter
      if (selectedUnit !== 'all' && u.unitName !== selectedUnit) {
        return false;
      }
      // Role filter
      if (selectedRole !== 'all' && u.role !== selectedRole) {
        return false;
      }
      // License filter
      if (selectedLicense === 'aasi' && !u.aaliCertified) return false;
      if (selectedLicense === 'syariah' && !u.syariahCertified) return false;

      // Search term (Nama, Kode, Unit, Telp, Email)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchName = u.name.toLowerCase().includes(query);
        const matchCode = u.pruCode ? u.pruCode.includes(query) : false;
        const matchUnit = u.unitName ? u.unitName.toLowerCase().includes(query) : false;
        const matchPhone = u.phone ? u.phone.includes(query) : false;
        const matchEmail = u.email ? u.email.toLowerCase().includes(query) : false;
        return matchName || matchCode || matchUnit || matchPhone || matchEmail;
      }

      return true;
    });
  }, [allUsers, selectedUnit, selectedRole, selectedLicense, searchTerm]);

  // Aggregate KPI stats
  const totalAgents = allUsers.length;
  const totalLeaders = allUsers.filter((u) => u.role === 'owner' || u.role === 'unit_manager').length;
  const totalAASI = allUsers.filter((u) => u.aaliCertified).length;
  const totalSyariah = allUsers.filter((u) => u.syariahCertified).length;

  // Calculate tenure length helper
  const getTenure = (joinDateStr?: string) => {
    if (!joinDateStr) return '-';
    const join = new Date(joinDateStr);
    const now = new Date();
    const diffMonths = (now.getFullYear() - join.getFullYear()) * 12 + (now.getMonth() - join.getMonth());
    if (diffMonths < 1) return 'Baru Bergabung';
    if (diffMonths < 12) return `${diffMonths} Bulan`;
    const years = (diffMonths / 12).toFixed(1);
    return `${years} Tahun`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return { label: 'Agency Owner / Director', bg: 'bg-red-100 text-red-800 border-red-200' };
      case 'unit_manager':
        return { label: 'Unit Manager (UM)', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'secretary':
        return { label: 'Admin / Sekretariat', bg: 'bg-slate-100 text-slate-800 border-slate-200' };
      case 'agent':
      default:
        return { label: 'Agen Asuransi', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-[#ED1C24]" />
            <h1 className="text-xl font-bold text-gray-900">Data & Direktori Agen Reinasta</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Informasi komprehensif seluruh agen terdaftar: nama, kode agent (PruCode), unit tim, kontak telepon & email, tanggal join, serta lisensi keagenan.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="px-3 py-1.5 bg-red-50 text-[#ED1C24] border border-red-200 text-xs font-bold rounded-xl flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#ED1C24]" /> Official Prudential Register
          </span>
        </div>
      </div>

      {/* KPI Cards Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Total Anggota Tim</span>
            <Users className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{totalAgents} <span className="text-xs font-normal text-gray-500">Personel</span></p>
          <p className="text-[11px] text-gray-500 mt-1">Aktif di Reinasta Agency</p>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold">
            <span>Unit Manager & Owner</span>
            <UserCheck className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{totalLeaders} <span className="text-xs font-normal text-gray-500">Leader</span></p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Struktur Kepemimpinan Tim</p>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-blue-700 text-xs font-semibold">
            <span>Lisensi AASI / Konvensional</span>
            <Award className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-blue-600 mt-2">{totalAASI} <span className="text-xs font-normal text-gray-500">Agen</span></p>
          <p className="text-[11px] text-blue-600 font-medium mt-1">{((totalAASI / totalAgents) * 100).toFixed(0)}% Lulus Sertifikasi</p>
        </div>

        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
            <span>Lisensi Syariah (AAJI)</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{totalSyariah} <span className="text-xs font-normal text-gray-500">Agen</span></p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Prudential Syariah Certified</p>
        </div>
      </div>

      {/* Search & Filter Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, PruCode, telp, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Unit Filter */}
          <div>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              <option value="all">Semua Unit ({uniqueUnits.length} Tim)</option>
              {uniqueUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              <option value="all">Semua Level / Jabatan</option>
              <option value="owner">Agency Owner</option>
              <option value="unit_manager">Unit Manager (UM)</option>
              <option value="agent">Agen Asuransi</option>
              <option value="secretary">Admin / Sekretariat</option>
            </select>
          </div>

          {/* License Filter */}
          <div>
            <select
              value={selectedLicense}
              onChange={(e) => setSelectedLicense(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              <option value="all">Semua Status Lisensi</option>
              <option value="aasi">Lisensi AASI / Konvensional</option>
              <option value="syariah">Lisensi Syariah Verified</option>
            </select>
          </div>
        </div>

        {/* Filter status row */}
        {(searchTerm || selectedUnit !== 'all' || selectedRole !== 'all' || selectedLicense !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
            <span>Menampilkan <strong>{filteredUsers.length}</strong> dari <strong>{allUsers.length}</strong> agen terdaftar.</span>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedUnit('all');
                setSelectedRole('all');
                setSelectedLicense('all');
              }}
              className="text-[#ED1C24] font-bold hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Main Agent Data Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Daftar Lengkap Agent & Tim Keagenan ({filteredUsers.length})</h2>
          <span className="text-xs text-gray-400 font-medium">Updated Realtime</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Nama & Profil Agen</th>
                <th className="px-6 py-3.5">Kode Agent (PruCode)</th>
                <th className="px-6 py-3.5">Unit / Tim</th>
                <th className="px-6 py-3.5">Kontak (Telp & Email)</th>
                <th className="px-6 py-3.5">Tanggal Join</th>
                <th className="px-6 py-3.5">Status Lisensi</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-medium">
                    Tidak ditemukan data agen sesuai kriteria pencarian/filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleBadge = getRoleLabel(user.role);
                  const cleanPhone = user.phone ? user.phone.replace(/[^0-9]/g, '') : '';
                  const waNumber = cleanPhone.startsWith('0') ? `62${cleanPhone.slice(1)}` : cleanPhone;

                  return (
                    <tr key={user.id} className="hover:bg-red-50/20 transition-colors">
                      {/* Name & Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-gray-900 text-xs">{user.name}</p>
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold border mt-0.5 ${roleBadge.bg}`}>
                              {roleBadge.label}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* PruCode */}
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">
                        {user.pruCode ? (
                          <span className="px-2 py-1 bg-slate-100 rounded text-slate-800 border border-slate-200">
                            {user.pruCode}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-sans italic text-[11px]">-</span>
                        )}
                      </td>

                      {/* Unit */}
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-800 font-semibold">
                          <Building2 className="w-3.5 h-3.5 mr-1.5 text-gray-400 shrink-0" />
                          <span>{user.unitName || 'Reinasta Headquarters'}</span>
                        </div>
                      </td>

                      {/* Phone & Email */}
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(user.name)},%20salam%20dari%20Reinasta%20Agency%20Prudential.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]"
                            title="Kirim Pesan WhatsApp Direct"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-600" />
                            <span>{user.phone}</span>
                          </a>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-[11px]">
                          <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                          <a href={`mailto:${user.email}`} className="hover:underline truncate max-w-[170px]">
                            {user.email}
                          </a>
                        </div>
                      </td>

                      {/* Join Date & Tenure */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{formatDate(user.joinDate)}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium">
                          Masa kerja: {getTenure(user.joinDate)}
                        </span>
                      </td>

                      {/* License Badges */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.aaliCertified ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <CheckCircle2 className={`w-3 h-3 mr-1 ${user.aaliCertified ? 'text-blue-600' : 'text-gray-400'}`} />
                            {user.aaliCertified ? 'AASI Certified' : 'Belum AASI'}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.syariahCertified ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Sparkles className={`w-3 h-3 mr-1 ${user.syariahCertified ? 'text-emerald-600' : 'text-gray-400'}`} />
                            {user.syariahCertified ? 'Syariah Verified' : 'Non-Syariah'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedAgentModal(user)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-red-50 hover:text-[#ED1C24] text-gray-800 text-xs font-bold rounded-lg border border-gray-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Detail Agent</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent Detail Pop-Up Modal */}
      {selectedAgentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative border border-gray-200">
            <button
              onClick={() => setSelectedAgentModal(null)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header Profile */}
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-4">
              <img
                src={selectedAgentModal.avatar}
                alt={selectedAgentModal.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#ED1C24] shadow-xs shrink-0"
              />
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedAgentModal.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${getRoleLabel(selectedAgentModal.role).bg}`}>
                    {getRoleLabel(selectedAgentModal.role).label}
                  </span>
                  {selectedAgentModal.pruCode && (
                    <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800 border border-slate-200">
                      PruCode: {selectedAgentModal.pruCode}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-semibold uppercase block">Unit & Tim</span>
                <span className="font-bold text-gray-900 mt-0.5 block">{selectedAgentModal.unitName || 'Reinasta Agency HQ'}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-semibold uppercase block">Tanggal Bergabung</span>
                <span className="font-bold text-gray-900 mt-0.5 block">{formatDate(selectedAgentModal.joinDate)}</span>
                <span className="text-[10px] text-gray-500 font-medium">({getTenure(selectedAgentModal.joinDate)})</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-semibold uppercase block">Nomor Telepon</span>
                <span className="font-bold text-gray-900 mt-0.5 block">{selectedAgentModal.phone}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] text-gray-400 font-semibold uppercase block">Email Resmi</span>
                <span className="font-bold text-gray-900 mt-0.5 block truncate">{selectedAgentModal.email}</span>
              </div>
            </div>

            {/* License Badges Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-slate-900 block">Sertifikasi & Lisensi Prudential</span>
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                  selectedAgentModal.aaliCertified ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-gray-100 border-gray-200 text-gray-400'
                }`}>
                  <Award className={`w-4 h-4 ${selectedAgentModal.aaliCertified ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span>{selectedAgentModal.aaliCertified ? 'Lisensi AASI Active' : 'Non-AASI'}</span>
                </div>

                <div className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                  selectedAgentModal.syariahCertified ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-gray-100 border-gray-200 text-gray-400'
                }`}>
                  <Sparkles className={`w-4 h-4 ${selectedAgentModal.syariahCertified ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span>{selectedAgentModal.syariahCertified ? 'Lisensi Syariah Active' : 'Non-Syariah'}</span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setSelectedAgentModal(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Tutup
              </button>
              <a
                href={`https://wa.me/${selectedAgentModal.phone ? selectedAgentModal.phone.replace(/[^0-9]/g, '').replace(/^0/, '62') : ''}?text=Halo%20${encodeURIComponent(selectedAgentModal.name)},%20salam%20rekan%20agen%20Prudential.`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-200 cursor-pointer flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> Chat via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
