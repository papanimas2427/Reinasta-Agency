import React, { useState, useMemo } from 'react';
import { User, PerformanceRecord, AgentLevel } from '../types';
import { BarChart3, Award, Calendar, Download, Filter, MessageSquare, Save, Sparkles, TrendingUp, Search, Users, UserCheck, GraduationCap, BookOpen, ShieldCheck } from 'lucide-react';
import { generatePerformancePDF } from '../utils/pdfGenerator';
import { MonthlyTeamSalesChart } from './MonthlyTeamSalesChart';

interface PerformanceEvaluationProps {
  currentUser: User;
  performanceRecords: PerformanceRecord[];
  onUpdateCoachingNotes: (agentId: string, notes: string) => void;
}

export const PerformanceEvaluation: React.FC<PerformanceEvaluationProps> = ({
  currentUser,
  performanceRecords,
  onUpdateCoachingNotes,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [periodType, setPeriodType] = useState<'quarter' | 'semester' | 'year'>('quarter');
  const [selectedQuarter, setSelectedQuarter] = useState<'Q1' | 'Q2' | 'Q3' | 'Q4'>('Q2');
  const [selectedSemester, setSelectedSemester] = useState<'S1' | 'S2'>('S1');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<'all' | AgentLevel>('all');

  const [editingAgent, setEditingAgent] = useState<PerformanceRecord | null>(null);
  const [notesInput, setNotesInput] = useState('');

  const isManager = currentUser.role === 'owner' || currentUser.role === 'unit_manager' || currentUser.role === 'secretary';

  // Helper to determine or fallback agent level
  const getRecordLevel = (p: PerformanceRecord): AgentLevel => {
    if (p.agentLevel) return p.agentLevel;
    if (p.role === 'unit_manager' || p.role === 'owner') return 'Master';
    if (p.caseCount >= 8 || p.totalApi >= 100000000) return 'Senior';
    if (p.caseCount >= 5 || p.totalApi >= 50000000) return 'Junior';
    return 'Trainee';
  };

  // Helper badge styling for Agent Levels
  const getLevelBadge = (level: AgentLevel) => {
    switch (level) {
      case 'Trainee':
        return {
          label: 'Trainee (0-6 Bln)',
          bg: 'bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
        };
      case 'Junior':
        return {
          label: 'Junior (6-18 Bln)',
          bg: 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
        };
      case 'Senior':
        return {
          label: 'Senior (1.5-3 Thn)',
          bg: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
        };
      case 'Master':
        return {
          label: 'Master / Leader (>3 Thn)',
          bg: 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
        };
    }
  };

  // Training Needs Mapping Configuration per Level
  const trainingNeedsConfig = {
    Trainee: {
      title: 'Pemetaan Training Agent Trainee (0 - 6 Bulan)',
      focus: 'Fokus Onboarding Dasar, Prospecting, & Sertifikasi AALI/Syariah',
      recommendations: [
        'PruFastStart: Basic Agent Onboarding 90-Day Challenge',
        'Sertifikasi Regulasi OJK & Anti-Money Laundering (AML)',
        'Basic Scripting Prospek & Handling Objection Awal',
        'Pengenalan Produk Dasar PRUCinta & PRUPrime Healthcare'
      ],
      targetGoal: 'Mencapai Closing 3 Kasus Pertama & Kelulusan Ujian AALI'
    },
    Junior: {
      title: 'Pemetaan Training Agent Junior (6 - 18 Bulan)',
      focus: 'Fokus Pengetahuan Produk Mendalam & Teknik Closing Syariah',
      recommendations: [
        'Syariah Academy Level 2: Akad Tabarru & Mudharabah',
        'Product Clinic PRUPrime Healthcare Plus & Limit Kamar Cashless',
        'Teknik Fact-Finding Mendalam & Financial Needs Analysis (FNA)',
        'Strategi Referensi (Referral Gathering) dari Nasabah Existing'
      ],
      targetGoal: 'Konsistensi Produksi Bulanan & Kualifikasi Rookie Star Club'
    },
    Senior: {
      title: 'Pemetaan Training Agent Senior (1.5 - 3 Tahun)',
      focus: 'Fokus Market High-Net-Worth, Warisan, & Persiapan Calon Leader',
      recommendations: [
        'Syariah Estate Planning & Perencanaan Warisan PRUPyramida',
        'High-Net-Worth Prospecting & Key Decision Maker Engagement',
        'Unit Manager Development Program (UMDP) Batch 2026',
        'Coaching & Mentoring Agen Baru (Recruiter Buddy Program)'
      ],
      targetGoal: 'Kualifikasi MDRT / Star Club & Promosi Menjadi Unit Manager (AM)'
    },
    Master: {
      title: 'Pemetaan Training Unit Manager & Master (> 3 Tahun)',
      focus: 'Fokus Kepemimpinan Unit, Strategi Rekrutmen, & Financial Advisory',
      recommendations: [
        'Strategic Agency Recruiter Masterclass 2026',
        'Executive Coaching & Leadership Team Dynamics',
        'Analisa Retention Rate & Persistency Polis Level Unit',
        'Perencanaan Event BOP & Business Presentation Skills'
      ],
      targetGoal: 'Pengembangan Multi-Unit Downline & Pertumbuhan Agency Owner'
    }
  };

  // Filter records based on role and active period
  const visibleRecords = performanceRecords.filter((p) => {
    if (currentUser.role === 'owner' || currentUser.role === 'secretary') return true;
    if (currentUser.role === 'unit_manager') return p.unitName === currentUser.unitName;
    return p.agentId === currentUser.id;
  });

  // Unique downline list for managers
  const availableDownlines = useMemo(() => {
    const map = new Map<string, { id: string; name: string; pruCode: string; unitName: string }>();
    visibleRecords.forEach((r) => {
      if (!map.has(r.agentId)) {
        map.set(r.agentId, { id: r.agentId, name: r.agentName, pruCode: r.pruCode, unitName: r.unitName });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [visibleRecords]);

  const filteredRecords = visibleRecords.filter((p) => {
    if (p.year !== selectedYear) return false;
    if (periodType === 'quarter' && p.quarter !== selectedQuarter) return false;
    if (periodType === 'semester' && p.semester !== selectedSemester) return false;
    if (isManager && selectedAgentId !== 'all' && p.agentId !== selectedAgentId) return false;
    if (selectedLevel !== 'all' && getRecordLevel(p) !== selectedLevel) return false;
    if (searchTerm) {
      const match =
        p.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.pruCode.includes(searchTerm) ||
        p.unitName.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    return true;
  }).sort((a, b) => b.totalApi - a.totalApi);

  const totalApi = filteredRecords.reduce((acc, p) => acc + p.totalApi, 0);
  const totalCases = filteredRecords.reduce((acc, p) => acc + p.caseCount, 0);
  const avgPersistency = filteredRecords.length > 0
    ? (filteredRecords.reduce((acc, p) => acc + p.persistencyRate, 0) / filteredRecords.length).toFixed(1)
    : '100';

  const periodLabel =
    periodType === 'quarter'
      ? `${selectedQuarter} ${selectedYear}`
      : periodType === 'semester'
      ? `Semester ${selectedSemester} ${selectedYear}`
      : `Tahun ${selectedYear}`;

  const handleOpenCoaching = (p: PerformanceRecord) => {
    setEditingAgent(p);
    setNotesInput(p.coachingNotes || '');
  };

  const handleSaveCoaching = () => {
    if (editingAgent) {
      onUpdateCoachingNotes(editingAgent.agentId, notesInput);
      setEditingAgent(null);
    }
  };

  const canEditCoaching = currentUser.role === 'owner' || currentUser.role === 'unit_manager';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-amber-600 dark:text-amber-500" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Analisa & Evaluasi Performa Penjualan</h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            Evaluasi multi-periode & pemetaan kebutuhan training berdasarkan level pengalaman agen (Trainee, Junior, Senior, Master).
          </p>
        </div>

        <button
          onClick={() => generatePerformancePDF(filteredRecords, periodLabel, currentUser)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer border border-transparent dark:border-slate-700"
        >
          <Download className="w-4 h-4 mr-1.5" /> Export PDF Laporan
        </button>
      </div>

      {/* Monthly Team Sales Target Achievement Bar Chart */}
      <MonthlyTeamSalesChart currentUser={currentUser} />

      {/* Multi-Period & Level Filter Switcher Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 shadow-xs transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Period Type Selection */}
          <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setPeriodType('quarter')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                periodType === 'quarter' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-xs' : 'text-gray-600 dark:text-slate-400'
              }`}
            >
              Triwulan (Q1 - Q4)
            </button>
            <button
              onClick={() => setPeriodType('semester')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                periodType === 'semester' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-xs' : 'text-gray-600 dark:text-slate-400'
              }`}
            >
              Semester (S1 - S2)
            </button>
            <button
              onClick={() => setPeriodType('year')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                periodType === 'year' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-xs' : 'text-gray-600 dark:text-slate-400'
              }`}
            >
              Tahunan
            </button>
          </div>

          {/* Sub-period controls */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-bold text-gray-800 dark:text-slate-200 cursor-pointer"
            >
              <option value={2026}>Tahun 2026</option>
              <option value={2025}>Tahun 2025</option>
            </select>

            {periodType === 'quarter' && (
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value as any)}
                className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-bold text-gray-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="Q1">Triwulan 1 (Jan - Mar)</option>
                <option value="Q2">Triwulan 2 (Apr - Jun)</option>
                <option value="Q3">Triwulan 3 (Jul - Sep)</option>
                <option value="Q4">Triwulan 4 (Okt - Des)</option>
              </select>
            )}

            {periodType === 'semester' && (
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value as any)}
                className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-bold text-gray-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="S1">Semester 1 (Jan - Jun)</option>
                <option value="S2">Semester 2 (Jul - Des)</option>
              </select>
            )}
          </div>
        </div>

        {/* DROPDOWN FILTER: LEVEL AGEN (TRAINEE, JUNIOR, SENIOR, MASTER) */}
        <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-slate-800/80 dark:via-indigo-950/40 dark:to-slate-800/80 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-xs shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-indigo-950 dark:text-indigo-200 block">
                Filter Level Agen & Pemetaan Kebutuhan Training
              </span>
              <span className="text-[10px] text-indigo-700 dark:text-indigo-300">
                Gunakan dropdown untuk memetakan kebutuhan pelatihan tim berdasarkan tingkat pengalaman.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Main Dropdown Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-xl text-xs font-black text-indigo-950 dark:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs min-w-[230px]"
            >
              <option value="all">Semua Level Agen (Trainee - Master)</option>
              <option value="Trainee">🎓 Trainee (0 - 6 Bulan)</option>
              <option value="Junior">📘 Junior (6 - 18 Bulan)</option>
              <option value="Senior">🚀 Senior (1.5 - 3 Tahun)</option>
              <option value="Master">👑 Master / Leader (&gt; 3 Tahun)</option>
            </select>

            {/* Quick Pill Buttons */}
            <div className="hidden lg:flex items-center space-x-1">
              {(['all', 'Trainee', 'Junior', 'Senior', 'Master'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white/80 dark:bg-slate-800 text-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-slate-700 hover:bg-indigo-100'
                  }`}
                >
                  {lvl === 'all' ? 'Semua' : lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Manager Downline / Team Member Filter Dropdown */}
        {isManager && (
          <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/50">
            <div className="flex items-center space-x-2">
              <Users className="w-4.5 h-4.5 text-amber-700 dark:text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">Filter Performa Anggota Tim (Downline)</span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400">Pilih anggota tim secara spesifik untuk mengevaluasi hasil kinerjanya.</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-lg text-xs font-bold text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-xs min-w-[220px]"
              >
                <option value="all">Semua Anggota Tim ({availableDownlines.length} Agen)</option>
                {availableDownlines.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name} ({ag.pruCode})
                  </option>
                ))}
              </select>
              {selectedAgentId !== 'all' && (
                <button
                  onClick={() => setSelectedAgentId('all')}
                  className="px-2.5 py-1.5 text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 hover:bg-amber-200 dark:hover:bg-amber-800 rounded-lg border border-amber-300 dark:border-amber-700 transition-colors shrink-0 cursor-pointer"
                >
                  Lihat Semua Tim
                </button>
              )}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 absolute left-3 top-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari agen berdasarkan nama, PruCode, atau nama unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* TRAINING NEEDS MAPPING CARD (PEMETAAN KEBUTUHAN TRAINING) */}
      {selectedLevel !== 'all' && trainingNeedsConfig[selectedLevel] && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl shadow-lg border border-indigo-800/50 text-white space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/60 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-indigo-500 text-white rounded-xl shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-amber-400 tracking-wide uppercase">
                  {trainingNeedsConfig[selectedLevel].title}
                </h3>
                <p className="text-xs text-indigo-200 mt-0.5">
                  {trainingNeedsConfig[selectedLevel].focus}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black bg-indigo-800 text-indigo-100 border border-indigo-600">
                {filteredRecords.length} Agen Terdaftar pada Filter Ini
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Recommended Modules */}
            <div className="md:col-span-8 space-y-2">
              <p className="text-xs font-bold text-indigo-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Rekomendasi Modul & Kurikulum Wajib Disolusikan:</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {trainingNeedsConfig[selectedLevel].recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition-all text-xs font-medium flex items-center space-x-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-indigo-100 text-[11px] font-semibold">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Outcome / Goal */}
            <div className="md:col-span-4 bg-indigo-900/40 p-4 rounded-xl border border-indigo-700/50 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                  Target Outcome / Key Result:
                </span>
                <p className="text-xs font-black text-white mt-1 leading-relaxed">
                  {trainingNeedsConfig[selectedLevel].targetGoal}
                </p>
              </div>
              <div className="pt-2 border-t border-indigo-800/60 flex items-center justify-between text-[10px] text-indigo-300">
                <span>Rata-Rata API Level Ini:</span>
                <span className="font-extrabold text-amber-400">
                  Rp {(totalApi / (filteredRecords.length || 1) / 1000000).toFixed(1)} Jt
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aggregate Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 rounded-2xl shadow-md">
          <p className="text-xs font-bold text-amber-100 uppercase tracking-wider">Total Produksi ({periodLabel})</p>
          <p className="text-2xl font-black mt-2">Rp {(totalApi / 1000000).toFixed(1)} <span className="text-sm font-semibold">Juta</span></p>
          <p className="text-[11px] text-amber-100 mt-1">API Akumulasi ({filteredRecords.length} Agen)</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs transition-colors">
          <p className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Total Kasus / Polis Closed</p>
          <p className="text-2xl font-black text-gray-900 dark:text-slate-100 mt-2">{totalCases} <span className="text-sm font-semibold text-gray-500 dark:text-slate-400">Kasus</span></p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Diakui Prudential Center</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs transition-colors">
          <p className="text-xs font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">Rata-Rata Persistency Polis</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{avgPersistency}%</p>
          <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">Minimum standar Prudential: 90.0%</p>
        </div>
      </div>

      {/* Performance & Evaluation Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-gray-900 dark:text-slate-100">
              Tabel Pencapaian & Evaluasi Agen ({periodLabel})
            </h2>
            {selectedLevel !== 'all' && (
              <span className="px-2.5 py-0.5 text-[10px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800">
                Filter: Level {selectedLevel}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Diurutkan Berdasarkan Total Production</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-800 text-[11px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3">Nama Agen & PruCode</th>
                <th className="px-6 py-3">Level Agen</th>
                <th className="px-6 py-3">Unit Manager</th>
                <th className="px-6 py-3">Total API (IDR)</th>
                <th className="px-6 py-3">Porsi Syariah</th>
                <th className="px-6 py-3">Persistency</th>
                <th className="px-6 py-3">Kualifikasi Club</th>
                <th className="px-6 py-3 text-right">Catatan Coaching</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs text-gray-700 dark:text-slate-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-400 dark:text-slate-500 font-medium">
                    Tidak ada data performa untuk periode {periodLabel} dengan filter level ini.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((p) => {
                  const level = getRecordLevel(p);
                  const levelBadge = getLevelBadge(level);

                  return (
                    <tr key={p.agentId} className="hover:bg-amber-50/30 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 dark:text-slate-100">{p.agentName}</p>
                        <p className="text-[10px] text-gray-500 dark:text-slate-400">Kode: {p.pruCode}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 text-[10px] font-black rounded-lg border ${levelBadge.bg}`}>
                          {levelBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800 dark:text-slate-200">
                        {p.unitName}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-gray-900 dark:text-slate-100">
                        Rp {(p.totalApi / 1000000).toFixed(1)} Jt
                      </td>
                      <td className="px-6 py-4 font-semibold text-emerald-700 dark:text-emerald-400">
                        Rp {(p.apiSyariah / 1000000).toFixed(1)} Jt
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${p.persistencyRate >= 95 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {p.persistencyRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          {p.clubLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {p.coachingNotes ? (
                          <p className="text-[11px] text-gray-600 dark:text-slate-400 italic line-clamp-1 mb-1">{p.coachingNotes}</p>
                        ) : null}
                        {canEditCoaching && (
                          <button
                            onClick={() => handleOpenCoaching(p)}
                            className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 text-[11px] font-bold border border-gray-200 dark:border-slate-700 transition-colors cursor-pointer"
                          >
                            {p.coachingNotes ? 'Edit Evaluasi' : '+ Beri Coaching'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coaching Modal */}
      {editingAgent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Coaching & Catatan Evaluasi Agen</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">Agen: <strong className="text-gray-900 dark:text-slate-200">{editingAgent.agentName}</strong> ({editingAgent.unitName})</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">Feedback / Catatan Evaluasi Leader</label>
                <textarea
                  rows={4}
                  placeholder="Masukkan arahan pengembangan aktivitas, peningkatan prosentase syariah, atau target MDRT..."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-slate-700 rounded-xl text-xs bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={() => setEditingAgent(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveCoaching}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Simpan Evaluasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
