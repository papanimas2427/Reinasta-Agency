import React, { useState } from 'react';
import { User, FinanceRecord, FinanceType } from '../types';
import { Wallet, Printer, Plus, Lock, TrendingUp, TrendingDown, DollarSign, ShieldAlert, Filter, Search, Calendar, Eye, Download, X, FileText, CheckCircle2 } from 'lucide-react';
import { generateFinancePDF } from '../utils/pdfGenerator';

interface AgencyFinanceProps {
  currentUser: User;
  financeRecords: FinanceRecord[];
  onAddFinanceRecord: (record: Omit<FinanceRecord, 'id' | 'receiptNumber'>) => void;
}

export const AgencyFinance: React.FC<AgencyFinanceProps> = ({
  currentUser,
  financeRecords,
  onAddFinanceRecord,
}) => {
  const canAccess = currentUser.role === 'owner' || currentUser.role === 'secretary';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Form State
  const [type, setType] = useState<FinanceType>('Income');
  const [category, setCategory] = useState<FinanceRecord['category']>('Overriding Commission');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(10000000);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // Access Security Check
  if (!canAccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Akses Keuangan Terproteksi</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Sesuai aturan keamanan Reinasta Agency, modul <strong>Keuangan Agency & Laporan Kas</strong> hanya dapat diakses oleh <strong className="text-red-700">Agency Owner / Director</strong> dan <strong className="text-purple-700">Sekretaris Agency</strong>.
          </p>
          <div className="p-3 bg-red-50 rounded-xl text-[11px] text-red-800 font-medium">
            Anda saat ini login sebagai: <strong>{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
          </div>
          <p className="text-[10px] text-gray-400">
            Gunakan tombol dropdown profil di pojok kanan atas header untuk beralih ke akun Agency Owner atau Sekretaris untuk pengujian.
          </p>
        </div>
      </div>
    );
  }

  const filteredRecords = financeRecords.filter((f) => {
    const matchesSearch =
      f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.recordedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || f.type === filterType;
    const matchesCategory = filterCategory === 'all' || f.category === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const totalIncome = financeRecords
    .filter((f) => f.type === 'Income')
    .reduce((acc, f) => acc + f.amount, 0);

  const totalExpense = financeRecords
    .filter((f) => f.type === 'Expense')
    .reduce((acc, f) => acc + f.amount, 0);

  const netProfit = totalIncome - totalExpense;

  const categoriesIncome = ['Overriding Commission', 'Bonus Kontes Agency', 'Operational Allowance'];
  const categoriesExpense = ['Sewa Kantor', 'Event Agency & BOP', 'Rewards Agent', 'Admin & Training'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFinanceRecord({
      date,
      type,
      category,
      description,
      amount: Number(amount),
      recordedBy: currentUser.name,
    });

    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Export PDF Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Wallet className="w-6 h-6 text-red-600" />
            <h1 className="text-xl font-bold text-gray-900">Keuangan & Kas Reinasta Agency</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Pengelolaan Overriding komisi Prudential, subsidi operasional, pengeluaran kantor, serta pratinjau dan cetak Laporan Keuangan.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-200 cursor-pointer"
          >
            <Eye className="w-4 h-4 mr-1.5" /> Pratinjau Lap. Keuangan
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Tambah Transaksi
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Pemasukan Overriding</p>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-3">
            Rp {totalIncome.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Overriding & Subsisdi Prudential</p>
        </div>

        {/* Total Expense */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Pengeluaran Agency</p>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-red-600 mt-3">
            Rp {totalExpense.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">Sewa, BOP, Reward Agen, Admin</p>
        </div>

        {/* Net Cash Flow / Surplus */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">Surplus / Laba Bersih</p>
            <div className="p-2 rounded-xl bg-white/10 text-white">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black mt-3">
            Rp {netProfit.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-gray-300 mt-1">Saldo Kas Operasional Siap Dipakai</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari deskripsi transaksi, nomor kwitansi, atau nama pencatat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none font-medium"
          >
            <option value="all">Semua Tipe Kas</option>
            <option value="Income">Pemasukan (Income)</option>
            <option value="Expense">Pengeluaran (Expense)</option>
          </select>
        </div>
      </div>

      {/* Finance Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Jurnal Transaksi Kas Agency ({filteredRecords.length})</h2>
          <span className="text-xs text-gray-500">
            Akses Spesial: <strong>{currentUser.name}</strong> ({currentUser.role})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Tanggal & No. Kwitansi</th>
                <th className="px-6 py-3">Tipe & Kategori</th>
                <th className="px-6 py-3">Keterangan Transaksi</th>
                <th className="px-6 py-3">Pencatat</th>
                <th className="px-6 py-3 text-right">Jumlah Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400 font-medium">
                    Belum ada transaksi kas yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{f.date}</p>
                      <p className="text-[10px] text-gray-400">{f.receiptNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border mb-1 ${
                          f.type === 'Income'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        {f.type === 'Income' ? 'Pemasukan' : 'Pengeluaran'}
                      </span>
                      <p className="text-[11px] font-medium text-gray-600">{f.category}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800 max-w-xs">
                      {f.description}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {f.recordedBy}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-black text-sm ${
                        f.type === 'Income' ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {f.type === 'Income' ? '+' : '-'} Rp {f.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Finance Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Input Catatan Kas Agency Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tipe Kas</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as FinanceType)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-bold"
                  >
                    <option value="Income">Pemasukan (Income)</option>
                    <option value="Expense">Pengeluaran (Expense)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kategori Transaksi</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
                >
                  {(type === 'Income' ? categoriesIncome : categoriesExpense).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  min={10000}
                  step={50000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi & Keterangan Kwitansi</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Rincian pembayaran, nomor invoice..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
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
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-200"
                >
                  Simpan Kas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pratinjau Laporan Keuangan Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-100 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl relative space-y-4 border border-slate-300">
            {/* Modal Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-red-100 text-red-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                    Document Preview
                  </span>
                  <h2 className="text-base font-extrabold text-slate-900">Pratinjau Laporan Keuangan Agency</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tinjau rincian kas & overriding sebelum mencetak atau mengunduh dokumen PDF.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => generateFinancePDF(filteredRecords, totalIncome, totalExpense, currentUser)}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-200 transition-colors"
                >
                  <Download className="w-4 h-4" /> Export Ke PDF
                </button>
                <button
                  onClick={() => {
                    generateFinancePDF(filteredRecords, totalIncome, totalExpense, currentUser);
                  }}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Printer className="w-4 h-4" /> Cetak Dokumen
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 text-slate-500 hover:bg-slate-200 rounded-full cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simulated Official Paper Document Preview */}
            <div id="financial-report-paper" className="bg-white p-6 sm:p-10 rounded-2xl shadow-md border border-slate-200 space-y-6 text-xs text-slate-800 font-sans max-w-3xl mx-auto">
              {/* Prudential Red Header Banner */}
              <div className="bg-[#ED1C24] text-white p-6 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight uppercase">Reinasta Agency - Prudential</h1>
                  <p className="text-xs text-red-100 mt-0.5 font-medium">
                    Laporan Keuangan & Kas Agency (Konvensional & Syariah)
                  </p>
                </div>
                <div className="text-right text-[11px] text-red-100 font-medium shrink-0">
                  <p className="font-bold text-white">REINASTA HEADQUARTERS</p>
                  <p>Jakarta, Indonesia</p>
                </div>
              </div>

              {/* Document Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs">
                <div>
                  <p><strong className="text-slate-900">Dipratinjau Oleh:</strong> {currentUser.name} ({currentUser.role.toUpperCase()})</p>
                  <p><strong className="text-slate-900">Tanggal Pratinjau:</strong> {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div>
                  <p><strong className="text-slate-900">PruCode Admin:</strong> {currentUser.pruCode || 'ADMIN-HQ'}</p>
                  <p><strong className="text-slate-900">Jumlah Transaksi:</strong> {filteredRecords.length} Catatan Jurnal</p>
                </div>
              </div>

              {/* Executive Financial Summary Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Ringkasan Eksekutif Keuangan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-[10px] text-emerald-800 font-bold uppercase">Total Pemasukan</p>
                    <p className="text-sm font-extrabold text-emerald-700 mt-1">
                      Rp {totalIncome.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-[10px] text-red-800 font-bold uppercase">Total Pengeluaran</p>
                    <p className="text-sm font-extrabold text-red-700 mt-1">
                      Rp {totalExpense.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 text-white rounded-lg">
                    <p className="text-[10px] text-slate-300 font-bold uppercase">Surplus / Laba Bersih</p>
                    <p className="text-sm font-extrabold mt-1">
                      Rp {netProfit.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Journal Table */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Rincian Jurnal Transaksi Kas</h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-[#ED1C24] text-white font-bold">
                        <th className="p-2.5 w-8">No</th>
                        <th className="p-2.5">Tanggal</th>
                        <th className="p-2.5">No. Kwitansi</th>
                        <th className="p-2.5">Tipe</th>
                        <th className="p-2.5">Kategori</th>
                        <th className="p-2.5">Keterangan</th>
                        <th className="p-2.5 text-right">Jumlah (IDR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {filteredRecords.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-4 text-center text-slate-400">
                            Tidak ada data transaksi kas.
                          </td>
                        </tr>
                      ) : (
                        filteredRecords.map((item, idx) => (
                          <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="p-2.5 font-bold">{idx + 1}</td>
                            <td className="p-2.5">{item.date}</td>
                            <td className="p-2.5 font-mono text-[10px] text-slate-500">{item.receiptNumber}</td>
                            <td className="p-2.5 font-bold">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] ${item.type === 'Income' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                {item.type === 'Income' ? 'Pemasukan' : 'Pengeluaran'}
                              </span>
                            </td>
                            <td className="p-2.5">{item.category}</td>
                            <td className="p-2.5 max-w-[180px] truncate">{item.description}</td>
                            <td className={`p-2.5 text-right font-bold ${item.type === 'Income' ? 'text-emerald-700' : 'text-red-600'}`}>
                              Rp {item.amount.toLocaleString('id-ID')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signatures Block */}
              <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-700">
                <div>
                  <p className="text-slate-500">Dibuat Oleh,</p>
                  <div className="h-14"></div>
                  <p className="font-extrabold text-slate-900 border-b border-slate-300 pb-1 inline-block min-w-[140px]">Dewi Lestari</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Sekretaris Agency</p>
                </div>
                <div>
                  <p className="text-slate-500">Disetujui Oleh,</p>
                  <div className="h-14"></div>
                  <p className="font-extrabold text-slate-900 border-b border-slate-300 pb-1 inline-block min-w-[140px]">Budi Santoso, CFP</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Agency Owner / Director</p>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="text-center pt-2 text-[10px] text-slate-400">
                Laporan ini dibuat secara otomatis oleh Sistem Manajemen Reinasta Agency Prudential Indonesia.
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Tutup Pratinjau
              </button>
              <button
                onClick={() => generateFinancePDF(filteredRecords, totalIncome, totalExpense, currentUser)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-200 cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download File PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
