import React, { useState } from 'react';
import { User, Recruit, RecruitStage } from '../types';
import { UserPlus, Search, Filter, CheckCircle, Clock, Award, FileSpreadsheet, Plus, Edit2, ShieldAlert } from 'lucide-react';

interface RecruitmentProps {
  currentUser: User;
  recruits: Recruit[];
  allUsers: User[];
  onAddRecruit: (recruit: Omit<Recruit, 'id'>) => void;
  onUpdateRecruitStage: (id: string, stage: RecruitStage, notes?: string) => void;
}

export const Recruitment: React.FC<RecruitmentProps> = ({
  currentUser,
  recruits,
  allUsers,
  onAddRecruit,
  onUpdateRecruitStage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [sponsorId, setSponsorId] = useState(currentUser.id);
  const [notes, setNotes] = useState('');

  // Filter recruits based on user role
  const visibleRecruits = recruits.filter((r) => {
    if (currentUser.role === 'owner' || currentUser.role === 'secretary') return true;
    if (currentUser.role === 'unit_manager') return r.unitName === currentUser.unitName;
    return r.sponsorAgentId === currentUser.id;
  });

  const filteredRecruits = visibleRecruits.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.sponsorAgentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm);
    const matchesStage = filterStage === 'all' || r.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const stages: RecruitStage[] = ['Prospek', 'Interview', 'Fast Track Training', 'Ujian AALI', 'Kode Appointed / Resmi'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sponsor = allUsers.find((u) => u.id === sponsorId) || currentUser;

    onAddRecruit({
      name,
      phone,
      email,
      sponsorAgentId: sponsor.id,
      sponsorAgentName: sponsor.name,
      unitName: sponsor.unitName || 'Reinasta Team',
      stage: 'Prospek',
      applyDate: new Date().toISOString().slice(0, 10),
      targetAppointDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      notes: notes || 'Kandidat baru pendaftaran rekrutmen agency.',
    });

    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <UserPlus className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-900">Pipeline Rekrutmen Agen Prudential</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Proses rekrutmen dari pendaftaran, Fast Track Training, Sertifikasi AALI, hingga penerbitan Kode Prudential.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-200 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Tambah Kandidat Rekrut
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kandidat, nomor HP, atau sponsor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          >
            <option value="all">Semua Tahapan Stage</option>
            {stages.map((stg) => (
              <option key={stg} value={stg}>
                {stg}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pipeline Kanban Stage Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stages.map((stg) => {
          const count = visibleRecruits.filter((r) => r.stage === stg).length;
          return (
            <div
              key={stg}
              onClick={() => setFilterStage(filterStage === stg ? 'all' : stg)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                filterStage === stg
                  ? 'bg-purple-50 border-purple-400 shadow-xs'
                  : 'bg-white border-gray-200 hover:border-purple-200'
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 truncate">{stg}</p>
              <p className="text-xl font-extrabold text-gray-900 mt-1">{count} <span className="text-xs font-normal text-gray-500">orang</span></p>
            </div>
          );
        })}
      </div>

      {/* Recruits Data Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Daftar Kandidat Agen ({filteredRecruits.length})</h2>
          <span className="text-xs text-gray-500">
            Hak Akses: <strong className="text-gray-800">{currentUser.role.toUpperCase()}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Nama Kandidat</th>
                <th className="px-6 py-3">Sponsor / Unit</th>
                <th className="px-6 py-3">Tahapan Stage</th>
                <th className="px-6 py-3">AALI Score</th>
                <th className="px-6 py-3">Target Appointed</th>
                <th className="px-6 py-3 text-right">Aksi Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredRecruits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400 font-medium">
                    Belum ada data kandidat rekrutmen yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredRecruits.map((r) => (
                  <tr key={r.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{r.name}</p>
                      <p className="text-[11px] text-gray-500">{r.phone} • {r.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{r.sponsorAgentName}</p>
                      <p className="text-[10px] text-purple-700 font-medium">{r.unitName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          r.stage === 'Kode Appointed / Resmi'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : r.stage === 'Ujian AALI'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : r.stage === 'Fast Track Training'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {r.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {r.aaliScore ? (
                        <span className="font-bold text-emerald-700">{r.aaliScore} / 100</span>
                      ) : (
                        <span className="text-gray-400 font-normal">Belum Ujian</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {r.targetAppointDate}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={r.stage}
                        onChange={(e) => onUpdateRecruitStage(r.id, e.target.value as RecruitStage)}
                        className="px-2 py-1 bg-white border border-gray-300 rounded text-[11px] font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                      >
                        {stages.map((stg) => (
                          <option key={stg} value={stg}>
                            Pindah ke: {stg}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Recruit */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tambah Prospek Kandidat Rekrut</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap Kandidat</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Gunawan, S.Kom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nomor WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="08123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email Kandidat</label>
                  <input
                    type="email"
                    required
                    placeholder="kandidat@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {(currentUser.role === 'owner' || currentUser.role === 'secretary') && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Agen Sponsor / Leader</label>
                  <select
                    value={sponsorId}
                    onChange={(e) => setSponsorId(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                  >
                    {allUsers
                      .filter((u) => u.role !== 'secretary')
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.unitName})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Catatan Prospek</label>
                <textarea
                  rows={2}
                  placeholder="Latar belakang latar pekerjaan, minat syariah/konvensional..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-200"
                >
                  Simpan Kandidat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
