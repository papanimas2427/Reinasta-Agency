import React, { useState } from 'react';
import { User, ClosingCase, InsuranceProduct, CaseStage, ProductType } from '../types';
import {
  FileCheck2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  TrendingUp,
  PieChart,
  Target,
  BarChart2,
  Layers,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

interface ClosingProgressProps {
  currentUser: User;
  cases: ClosingCase[];
  products: InsuranceProduct[];
  allUsers: User[];
  onAddCase: (newCase: Omit<ClosingCase, 'id'>) => void;
  onUpdateCaseStage: (caseId: string, newStage: CaseStage) => void;
}

export const ClosingProgress: React.FC<ClosingProgressProps> = ({
  currentUser,
  cases,
  products,
  allUsers,
  onAddCase,
  onUpdateCaseStage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [annualPremium, setAnnualPremium] = useState<number>(12000000);
  const [paymentFrequency, setPaymentFrequency] = useState<ClosingCase['paymentFrequency']>('Tahunan');
  const [stage, setStage] = useState<CaseStage>('SPAJ Submitted');
  const [agentId, setAgentId] = useState(currentUser.id);
  const [notes, setNotes] = useState('');

  // Filter visible cases based on role
  const visibleCases = cases.filter((c) => {
    if (currentUser.role === 'owner' || currentUser.role === 'secretary') return true;
    if (currentUser.role === 'unit_manager') return c.unitName === currentUser.unitName;
    return c.agentId === currentUser.id;
  });

  const filteredCases = visibleCases.filter((c) => {
    const matchesSearch =
      c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.agentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProductType = productTypeFilter === 'all' || c.productType === productTypeFilter;
    const matchesStage = stageFilter === 'all' || c.stage === stageFilter;

    return matchesSearch && matchesProductType && matchesStage;
  });

  const caseStages: CaseStage[] = [
    'Prospek',
    'Data Gathering',
    'Ilustrasi Terkirim',
    'SPAJ Submitted',
    'Underwriting / Medical',
    'Issued & Paid'
  ];

  // Workload distribution calculations across sales phases
  const totalCasesCount = visibleCases.length;
  const totalApiValue = visibleCases.reduce((acc, c) => acc + c.annualPremium, 0);

  // Group 1: Prospecting (Prospek, Data Gathering)
  const prospectingCases = visibleCases.filter((c) => c.stage === 'Prospek' || c.stage === 'Data Gathering');
  const prospectingApi = prospectingCases.reduce((acc, c) => acc + c.annualPremium, 0);
  const prospectingPct = totalCasesCount > 0 ? (prospectingCases.length / totalCasesCount) * 100 : 0;

  // Group 2: Presentation (Ilustrasi Terkirim)
  const presentationCases = visibleCases.filter((c) => c.stage === 'Ilustrasi Terkirim');
  const presentationApi = presentationCases.reduce((acc, c) => acc + c.annualPremium, 0);
  const presentationPct = totalCasesCount > 0 ? (presentationCases.length / totalCasesCount) * 100 : 0;

  // Group 3: Closing (SPAJ Submitted, Underwriting / Medical, Issued & Paid)
  const closingCases = visibleCases.filter(
    (c) => c.stage === 'SPAJ Submitted' || c.stage === 'Underwriting / Medical' || c.stage === 'Issued & Paid'
  );
  const closingApi = closingCases.reduce((acc, c) => acc + c.annualPremium, 0);
  const closingPct = totalCasesCount > 0 ? (closingCases.length / totalCasesCount) * 100 : 0;

  // Per-Stage Stats breakdown
  const stageStats = caseStages.map((stg) => {
    const list = visibleCases.filter((c) => c.stage === stg);
    const count = list.length;
    const api = list.reduce((acc, c) => acc + c.annualPremium, 0);
    const pct = totalCasesCount > 0 ? (count / totalCasesCount) * 100 : 0;
    return { stage: stg, count, api, pct };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selProduct = products.find((p) => p.id === productId) || products[0];
    const selAgent = allUsers.find((u) => u.id === agentId) || currentUser;

    onAddCase({
      clientName,
      clientPhone,
      agentId: selAgent.id,
      agentName: selAgent.name,
      pruCode: selAgent.pruCode || '0000000',
      unitName: selAgent.unitName || 'Reinasta Agency',
      productName: selProduct.name,
      productType: selProduct.type,
      annualPremium: Number(annualPremium),
      paymentFrequency,
      stage,
      submittedDate: new Date().toISOString().slice(0, 10),
      notes: notes || 'Pendaftaran kasus baru di portal agency.',
    });

    setClientName('');
    setClientPhone('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-6 h-6 text-red-600" />
            <h1 className="text-xl font-bold text-gray-900">Progres Closing & Tracking e-SPAJ</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tracking siklus penjualan polis Prudential dari penyiapan ilustrasi, submisi e-SPAJ, proses underwriting medis, hingga polis terbit (issued).
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-200 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Input Closing Case Baru
        </button>
      </div>

      {/* Visual Workload Distribution & Stage Progress Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-red-100 text-[#ED1C24] rounded-lg">
                <BarChart2 className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-gray-900">Distribusi Beban Kerja Pipeline (Prospecting, Presentation, Closing)</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Visualisasi beban kerja di setiap tahapan penjualan untuk memantau kapasitas tim dan memprediksi konversi closing.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Pipeline API</span>
              <span className="text-sm font-extrabold text-gray-900">Rp {(totalApiValue / 1000000).toFixed(0)} Jt</span>
            </div>
            <div className="text-right pl-3 border-l border-gray-200">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Active Cases</span>
              <span className="text-sm font-extrabold text-[#ED1C24]">{totalCasesCount} Polis</span>
            </div>
          </div>
        </div>

        {/* Continuous Multi-segment Workload Distribution Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-gray-500" /> Ringkasan Proporsi Pipeline Workload
            </span>
            <span className="text-gray-500 font-medium text-[11px]">
              {prospectingPct.toFixed(0)}% Prospecting | {presentationPct.toFixed(0)}% Presentation | {closingPct.toFixed(0)}% Closing
            </span>
          </div>

          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex shadow-inner p-0.5 border border-gray-200">
            {/* Prospecting Segment */}
            <div
              style={{ width: `${prospectingPct}%` }}
              className="h-full bg-blue-500 transition-all duration-500 relative group cursor-pointer first:rounded-l-full"
              title={`Prospecting: ${prospectingCases.length} Case (${prospectingPct.toFixed(1)}%)`}
              onClick={() => setStageFilter('Prospek')}
            />
            {/* Presentation Segment */}
            <div
              style={{ width: `${presentationPct}%` }}
              className="h-full bg-amber-500 transition-all duration-500 relative group cursor-pointer"
              title={`Presentation: ${presentationCases.length} Case (${presentationPct.toFixed(1)}%)`}
              onClick={() => setStageFilter('Ilustrasi Terkirim')}
            />
            {/* Closing Segment */}
            <div
              style={{ width: `${closingPct}%` }}
              className="h-full bg-emerald-500 transition-all duration-500 relative group cursor-pointer last:rounded-r-full"
              title={`Closing: ${closingCases.length} Case (${closingPct.toFixed(1)}%)`}
              onClick={() => setStageFilter('SPAJ Submitted')}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-500 pt-1 gap-2">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1.5 font-semibold text-blue-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                1. Prospecting ({prospectingCases.length} Case)
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                2. Presentation ({presentationCases.length} Case)
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                3. Closing ({closingCases.length} Case)
              </span>
            </div>
            {stageFilter !== 'all' && (
              <button
                onClick={() => setStageFilter('all')}
                className="text-xs text-[#ED1C24] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset Filter Stage
              </button>
            )}
          </div>
        </div>

        {/* 3 Main Sales Phase Workload Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Phase 1: Prospecting */}
          <div
            onClick={() => setStageFilter('Prospek')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              stageFilter === 'Prospek' || stageFilter === 'Data Gathering'
                ? 'bg-blue-50/80 border-blue-400 shadow-md ring-2 ring-blue-300'
                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg font-bold text-xs">01</span>
                <div>
                  <h3 className="font-bold text-xs text-gray-900">Prospecting</h3>
                  <p className="text-[10px] text-gray-500">Prospek & Data Gathering</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-extrabold rounded-md">
                {prospectingCases.length} Case
              </span>
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Beban Workload:</span>
                <span className="font-bold text-blue-700">{prospectingPct.toFixed(1)}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(prospectingPct, 3)}%` }}
                />
              </div>

              <div className="pt-2 flex justify-between items-center text-[11px] border-t border-gray-100">
                <span className="text-gray-400">Total Potensi API:</span>
                <span className="font-extrabold text-gray-900">Rp {(prospectingApi / 1000000).toFixed(0)} Jt</span>
              </div>
            </div>
          </div>

          {/* Phase 2: Presentation */}
          <div
            onClick={() => setStageFilter('Ilustrasi Terkirim')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              stageFilter === 'Ilustrasi Terkirim'
                ? 'bg-amber-50/80 border-amber-400 shadow-md ring-2 ring-amber-300'
                : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg font-bold text-xs">02</span>
                <div>
                  <h3 className="font-bold text-xs text-gray-900">Presentation</h3>
                  <p className="text-[10px] text-gray-500">Ilustrasi Terkirim & Pitching</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-extrabold rounded-md">
                {presentationCases.length} Case
              </span>
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Beban Workload:</span>
                <span className="font-bold text-amber-700">{presentationPct.toFixed(1)}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(presentationPct, 3)}%` }}
                />
              </div>

              <div className="pt-2 flex justify-between items-center text-[11px] border-t border-gray-100">
                <span className="text-gray-400">Total Potensi API:</span>
                <span className="font-extrabold text-gray-900">Rp {(presentationApi / 1000000).toFixed(0)} Jt</span>
              </div>
            </div>
          </div>

          {/* Phase 3: Closing */}
          <div
            onClick={() => setStageFilter('SPAJ Submitted')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              stageFilter === 'SPAJ Submitted' || stageFilter === 'Underwriting / Medical' || stageFilter === 'Issued & Paid'
                ? 'bg-emerald-50/80 border-emerald-400 shadow-md ring-2 ring-emerald-300'
                : 'bg-white border-gray-200 hover:border-emerald-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg font-bold text-xs">03</span>
                <div>
                  <h3 className="font-bold text-xs text-gray-900">Closing</h3>
                  <p className="text-[10px] text-gray-500">e-SPAJ, Medical, Issued</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold rounded-md">
                {closingCases.length} Case
              </span>
            </div>

            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">Beban Workload:</span>
                <span className="font-bold text-emerald-700">{closingPct.toFixed(1)}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(closingPct, 3)}%` }}
                />
              </div>

              <div className="pt-2 flex justify-between items-center text-[11px] border-t border-gray-100">
                <span className="text-gray-400">Total API Closing:</span>
                <span className="font-extrabold text-emerald-700">Rp {(closingApi / 1000000).toFixed(0)} Jt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Individual Stage Breakdown with Progress Bars */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs font-bold text-gray-800 mb-3 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-[#ED1C24]" /> Rincian Beban Workload Per-Tahapan Stage
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stageStats.map((stg) => {
              const isSelected = stageFilter === stg.stage;
              return (
                <div
                  key={stg.stage}
                  onClick={() => setStageFilter(isSelected ? 'all' : stg.stage)}
                  className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-50 border-red-300 shadow-xs ring-1 ring-red-200'
                      : 'bg-gray-50/70 border-gray-200 hover:bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-900 truncate max-w-[160px]">{stg.stage}</span>
                    <span className="font-extrabold text-gray-800 px-1.5 py-0.5 bg-white rounded border border-gray-200 text-[10px]">
                      {stg.count} Case ({stg.pct.toFixed(0)}%)
                    </span>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden my-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stg.stage === 'Issued & Paid'
                          ? 'bg-emerald-600'
                          : stg.stage === 'Underwriting / Medical'
                          ? 'bg-amber-500'
                          : stg.stage === 'SPAJ Submitted'
                          ? 'bg-blue-600'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.max(stg.pct, 2)}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-gray-500 mt-1">
                    <span>Nilai API:</span>
                    <span className="font-bold text-gray-900">Rp {(stg.api / 1000000).toFixed(0)} Jt</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama nasabah, produk Prudential, atau nama agen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={productTypeFilter}
            onChange={(e) => setProductTypeFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none font-medium"
          >
            <option value="all">Semua Akad Produk</option>
            <option value="syariah">PRU Syariah Only</option>
            <option value="konvensional">Konvensional Only</option>
          </select>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:bg-white focus:outline-none font-medium"
          >
            <option value="all">Semua Status Stage</option>
            {caseStages.map((stg) => (
              <option key={stg} value={stg}>
                {stg}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Daftar Polis & Prospek Closing ({filteredCases.length})</h2>
          <span className="text-xs text-gray-500">
            Hak Akses: <strong className="text-gray-800">{currentUser.role.toUpperCase()}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Nama Nasabah</th>
                <th className="px-6 py-3">Produk Prudential</th>
                <th className="px-6 py-3">Annual Premium (API)</th>
                <th className="px-6 py-3">Agen Pemegang</th>
                <th className="px-6 py-3">Status Underwriting</th>
                <th className="px-6 py-3 text-right">Update Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400 font-medium">
                    Belum ada kasus closing yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-red-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{c.clientName}</p>
                      <p className="text-[10px] text-gray-500">HP: {c.clientPhone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-gray-800">{c.productName}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                            c.productType === 'syariah'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {c.productType.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400">Frekuensi: {c.paymentFrequency}</p>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900">
                      Rp {c.annualPremium.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{c.agentName}</p>
                      <p className="text-[10px] text-gray-500">{c.unitName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          c.stage === 'Issued & Paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : c.stage === 'Underwriting / Medical'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : c.stage === 'SPAJ Submitted'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {c.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={c.stage}
                        onChange={(e) => onUpdateCaseStage(c.id, e.target.value as CaseStage)}
                        className="px-2 py-1 bg-white border border-gray-300 rounded text-[11px] font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                      >
                        {caseStages.map((stg) => (
                          <option key={stg} value={stg}>
                            {stg}
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

      {/* Modal Add Case */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Input Data Closing Case Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap Nasabah</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bapak Ir. Ahmad Subagyo"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nomor Telepon Nasabah</label>
                  <input
                    type="tel"
                    required
                    placeholder="08123456789"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Produk Prudential</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.type.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Annual Premium / API (Rp)</label>
                  <input
                    type="number"
                    required
                    min={1000000}
                    step={500000}
                    value={annualPremium}
                    onChange={(e) => setAnnualPremium(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Frekuensi Bayar</label>
                  <select
                    value={paymentFrequency}
                    onChange={(e) => setPaymentFrequency(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
                  >
                    <option value="Bulanan">Bulanan</option>
                    <option value="Triwulan">Triwulan</option>
                    <option value="Semesteran">Semesteran</option>
                    <option value="Tahunan">Tahunan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Status Tahapan (Stage)</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as CaseStage)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
                >
                  {caseStages.map((stg) => (
                    <option key={stg} value={stg}>
                      {stg}
                    </option>
                  ))}
                </select>
              </div>

              {(currentUser.role === 'owner' || currentUser.role === 'secretary' || currentUser.role === 'unit_manager') && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Agen Pemegang Kasus</label>
                  <select
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
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
                <label className="block text-xs font-bold text-gray-700 mb-1">Catatan Tambahan Case</label>
                <textarea
                  rows={2}
                  placeholder="Informasi seputar medical history, klaim, atau kebutuhan khusus..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  Simpan Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
