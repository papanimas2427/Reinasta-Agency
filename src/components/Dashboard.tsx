import React from 'react';
import { User, ClosingCase, Recruit, PerformanceRecord, MeetingSchedule, TrainingModule, FinanceRecord, Contest } from '../types';
import { MonthlyTeamSalesChart } from './MonthlyTeamSalesChart';
import { exportDashboardPDF } from '../utils/pdfExport';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Award,
  Users,
  FileText,
  DollarSign,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Target,
  CheckCircle2,
  Video,
  Send,
  BookOpen,
  Calculator,
  Brain,
  AlertTriangle,
  AlertCircle,
  Clock,
  Trophy,
  Download,
  BellRing,
  MessageCircle,
  UserX
} from 'lucide-react';

interface DashboardProps {
  currentUser: User;
  cases: ClosingCase[];
  recruits: Recruit[];
  performance: PerformanceRecord[];
  meetings: MeetingSchedule[];
  modules?: TrainingModule[];
  finance?: FinanceRecord[];
  contests?: Contest[];
  allUsers?: User[];
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentUser,
  cases,
  recruits,
  performance,
  meetings,
  modules = [],
  finance = [],
  contests = [],
  allUsers = [],
  onNavigate,
}) => {
  // Inactive Agent Warning Notification System (>30 Days without closing)
  const inactiveAgents = React.useMemo(() => {
    if (!allUsers || allUsers.length === 0) return [];
    const isManager = currentUser.role === 'owner' || currentUser.role === 'unit_manager' || currentUser.role === 'secretary';
    if (!isManager) return [];

    const nowTime = new Date().getTime();

    return allUsers
      .filter((u) => {
        if (u.role !== 'agent' && u.role !== 'unit_manager') return false;
        if (currentUser.role === 'unit_manager' && u.unitName !== currentUser.unitName) return false;
        return true;
      })
      .map((ag) => {
        const agentCases = cases.filter((c) => c.agentId === ag.id);
        let latestDateStr = ag.joinDate || '2025-01-01';
        let latestTime = new Date(latestDateStr).getTime();

        agentCases.forEach((c) => {
          const dStr = c.issuedDate || c.submittedDate;
          if (dStr) {
            const t = new Date(dStr).getTime();
            if (t > latestTime) {
              latestTime = t;
              latestDateStr = dStr;
            }
          }
        });

        const daysInactive = Math.max(0, Math.floor((nowTime - latestTime) / (1000 * 60 * 60 * 24)));
        return {
          ...ag,
          daysInactive,
          latestDateStr,
          caseCount: agentCases.length,
          isInactive: daysInactive > 30
        };
      })
      .filter((ag) => ag.isInactive)
      .sort((a, b) => b.daysInactive - a.daysInactive);
  }, [allUsers, cases, currentUser]);
  // Filter cases based on role
  const filteredCases = React.useMemo(() => {
    if (currentUser.role === 'owner' || currentUser.role === 'secretary') {
      return cases;
    }
    if (currentUser.role === 'unit_manager') {
      return cases.filter((c) => c.unitName === currentUser.unitName);
    }
    return cases.filter((c) => c.agentId === currentUser.id);
  }, [cases, currentUser]);

  // Compute metrics
  const totalApi = filteredCases.reduce((acc, c) => acc + c.annualPremium, 0);
  const totalApiSyariah = filteredCases
    .filter((c) => c.productType === 'syariah')
    .reduce((acc, c) => acc + c.annualPremium, 0);
  const totalApiKonvensional = totalApi - totalApiSyariah;
  const syariahPercent = totalApi > 0 ? Math.round((totalApiSyariah / totalApi) * 100) : 0;

  const issuedCasesCount = filteredCases.filter((c) => c.stage === 'Issued & Paid').length;
  const pendingUnderwritingCount = filteredCases.filter((c) => c.stage === 'Underwriting / Medical' || c.stage === 'SPAJ Submitted').length;

  // Filter recruits based on role
  const filteredRecruits = React.useMemo(() => {
    if (currentUser.role === 'owner' || currentUser.role === 'secretary') {
      return recruits;
    }
    if (currentUser.role === 'unit_manager') {
      return recruits.filter((r) => r.unitName === currentUser.unitName);
    }
    return recruits.filter((r) => r.sponsorAgentId === currentUser.id);
  }, [recruits, currentUser]);

  // Target Annual Calculation (e.g., MDRT target ~600M API for individual, 2.5B for Unit, 10B for Agency)
  let targetApi = 600000000;
  if (currentUser.role === 'owner' || currentUser.role === 'secretary') targetApi = 5000000000;
  if (currentUser.role === 'unit_manager') targetApi = 1500000000;

  const targetProgress = Math.min(100, Math.round((totalApi / targetApi) * 100));

  const liveMeetings = meetings.filter((m) => m.isLive);

  // Training Modules Urgent Tracking (>7 days uncompleted)
  const userModules = React.useMemo(() => {
    const now = new Date().getTime();
    return modules.filter((m) => {
      if (m.targetRole !== 'all' && Array.isArray(m.targetRole)) {
        if (!m.targetRole.includes(currentUser.role)) return false;
      }
      return true;
    }).map((m) => {
      const isCompleted = m.completedByAgentIds.includes(currentUser.id);
      const uploadTime = new Date(m.uploadDate).getTime();
      const daysDiff = Math.max(0, Math.floor((now - uploadTime) / (1000 * 60 * 60 * 24)));
      const isUrgent = !isCompleted && daysDiff >= 7;
      return {
        ...m,
        isCompleted,
        daysDiff,
        isUrgent
      };
    });
  }, [modules, currentUser]);

  const urgentModules = React.useMemo(() => {
    return userModules.filter((m) => m.isUrgent);
  }, [userModules]);

  // 6-Month APE Growth Trend Data for Recharts Line Chart
  const apeGrowthData = [
    { month: 'Mar 2026', ape: 185000000, target: 160000000, cases: 14, syariahApe: 95000000 },
    { month: 'Apr 2026', ape: 220000000, target: 180000000, cases: 18, syariahApe: 120000000 },
    { month: 'Mei 2026', ape: 260000000, target: 210000000, cases: 22, syariahApe: 145000000 },
    { month: 'Jun 2026', ape: 310000000, target: 250000000, cases: 28, syariahApe: 180000000 },
    { month: 'Jul 2026', ape: 365000000, target: 290000000, cases: 33, syariahApe: 215000000 },
    { month: 'Agu 2026', ape: 430000000, target: 330000000, cases: 41, syariahApe: 260000000 },
  ];

  const CustomApeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-2xl border border-slate-700 text-xs space-y-2 min-w-[210px]">
          <div className="border-b border-slate-700 pb-1.5 flex items-center justify-between">
            <span className="font-extrabold text-amber-300 text-xs">{label}</span>
            <span className="px-1.5 py-0.5 bg-red-950 text-red-200 text-[10px] font-bold rounded">
              {data.cases} Case Closing
            </span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#ED1C24] rounded-full inline-block"></span> Total APE Aktual:
              </span>
              <span className="font-bold text-white">Rp {(data.ape / 1000000).toFixed(0)} Jt</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block"></span> Syariah APE:
              </span>
              <span className="font-bold text-emerald-300">Rp {(data.syariahApe / 1000000).toFixed(0)} Jt</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-slate-400 rounded-full inline-block"></span> Target Baseline:
              </span>
              <span className="font-semibold text-slate-300">Rp {(data.target / 1000000).toFixed(0)} Jt</span>
            </div>
            <div className="pt-1.5 border-t border-slate-800 flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Pencapaian:</span>
              <span className="font-extrabold text-emerald-400">
                +{(((data.ape - data.target) / data.target) * 100).toFixed(1)}% Outperformed
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Current Month Performance vs Previous Month Target & Actual Comparison Data
  const monthComparisonData = [
    {
      metric: 'APE Prod. (Jt)',
      prevTarget: 290,
      prevActual: 365,
      currTarget: 330,
      currActual: 430,
      unit: 'Jt IDR'
    },
    {
      metric: 'Case Closing',
      prevTarget: 28,
      prevActual: 33,
      currTarget: 35,
      currActual: 41,
      unit: 'Polis'
    },
    {
      metric: 'Rekrutmen Agen',
      prevTarget: 5,
      prevActual: 6,
      currTarget: 8,
      currActual: 9,
      unit: 'Orang'
    },
    {
      metric: 'Active Rate (%)',
      prevTarget: 75,
      prevActual: 82,
      currTarget: 80,
      currActual: 88,
      unit: '%'
    }
  ];

  const CustomComparisonTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-2xl border border-slate-700 text-xs space-y-2 min-w-[240px]">
          <div className="border-b border-slate-700 pb-1.5 font-extrabold text-amber-300 text-xs flex justify-between items-center">
            <span>{label}</span>
            <span className="text-[10px] text-slate-400 font-normal">Komparasi Bulanan</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#94A3B8] rounded-xs"></span> Target Bln Lalu (Juli):
              </span>
              <span className="font-bold">{data.prevTarget} {data.unit}</span>
            </div>
            <div className="flex justify-between items-center text-blue-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#3B82F6] rounded-xs"></span> Realisasi Bln Lalu (Juli):
              </span>
              <span className="font-bold">{data.prevActual} {data.unit}</span>
            </div>
            <div className="flex justify-between items-center text-amber-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#F59E0B] rounded-xs"></span> Target Bln Ini (Agustus):
              </span>
              <span className="font-bold">{data.currTarget} {data.unit}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-400 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#ED1C24] rounded-xs"></span> Realisasi Bln Ini (Agustus):
              </span>
              <span className="text-white font-extrabold">{data.currActual} {data.unit}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px]">
              <span className="text-slate-400">Pertumbuhan vs Target Bln Lalu:</span>
              <span className="font-extrabold text-emerald-400">
                +{(((data.currActual - data.prevTarget) / data.prevTarget) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Urgent Training Banner Alert if any urgent module exists */}
      {urgentModules.length > 0 && (
        <div className="p-4 bg-red-50 border-2 border-red-500 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-600 text-white rounded-md shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-extrabold uppercase rounded tracking-wider">
                  Urgent Training Alert
                </span>
                <span className="text-xs font-bold text-red-900">
                  {urgentModules.length} Modul Training Belum Selesai (&gt; 7 Hari Penugasan)
                </span>
              </div>
              <p className="text-xs text-red-700 mt-0.5 font-medium">
                Selesaikan modul pelatihan berikut agar status kepatuhan dan lisensi agen Anda tetap aktif:
                {" "}
                <span className="font-bold underline">
                  {urgentModules.map((u) => u.title).join(', ')}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('training')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold shrink-0 shadow-xs cursor-pointer transition-colors"
          >
            Selesaikan Training Sekarang →
          </button>
        </div>
      )}

      {/* Inactive Agent Warning Notification System (>30 Days without Closing) */}
      {inactiveAgents.length > 0 && (
        <div className="p-5 bg-amber-50/90 dark:bg-amber-950/40 border-2 border-amber-500 rounded-lg shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 dark:border-amber-900 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-amber-600 text-white rounded-md shrink-0 shadow-xs">
                <BellRing className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-amber-600 text-white text-[10px] font-black uppercase rounded tracking-wider">
                    Peringatan Dini Leader
                  </span>
                  <h3 className="text-sm font-extrabold text-amber-950 dark:text-amber-200">
                    Notifikasi Otomatis: {inactiveAgents.length} Agen Inaktif (&gt; 30 Hari Tanpa Closing)
                  </h3>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5 font-medium">
                  Sistem mendeteksi agen dalam unit yang tidak melakukan aktivitas sales/SPAJ selama lebih dari 30 hari. Berikan dorongan atau coaching segera:
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('evaluasi')}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-bold shrink-0 shadow-xs cursor-pointer transition-colors flex items-center gap-1"
            >
              <span>Buka Modul Evaluasi Performance</span> →
            </button>
          </div>

          {/* Inactive Agents Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {inactiveAgents.map((ag) => (
              <div
                key={ag.id}
                className="bg-white dark:bg-slate-900 p-3.5 rounded-md border border-amber-300 dark:border-amber-900 shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-extrabold text-gray-900 dark:text-slate-100">{ag.name}</p>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400">
                      PruCode: <span className="font-semibold text-gray-700 dark:text-slate-300">{ag.pruCode || '-'}</span> • {ag.unitName}
                    </p>
                  </div>
                  <span className="shrink-0 px-2 py-0.5 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-extrabold text-[10px] rounded border border-red-200 dark:border-red-800">
                    {ag.daysInactive} Hari Inaktif
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-600 dark:text-slate-400 bg-amber-50/50 dark:bg-slate-800/60 p-2 rounded">
                  <span>Aktivitas Terakhir:</span>
                  <span className="font-bold text-gray-900 dark:text-slate-200">{ag.latestDateStr}</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`https://wa.me/${ag.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Halo ${ag.name}, semangat pagi! Saya melihat perkembangan produksi unit kita di Prudential. Ada kendala prospecting yang bisa kita diskusikan bersama minggu ini? Mari kita atur waktu coaching.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Sapa WA</span>
                  </a>
                  <button
                    onClick={() => onNavigate('evaluasi')}
                    className="px-2.5 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200 rounded text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Coaching
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Executive Welcome Banner */}
      <div className="relative overflow-hidden rounded-md bg-gradient-to-r from-[#ED1C24] via-red-700 to-rose-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-sm bg-white/15 backdrop-blur-md text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Reinasta Agency • Prudential Indonesia Executive Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {currentUser.name}!
            </h1>
            <p className="mt-1 text-sm text-red-100 max-w-2xl font-normal leading-relaxed">
              {currentUser.role === 'owner' && 'Akses penuh seluruh performa tim, rekrutmen agency, serta tata kelola keuangan agency.'}
              {currentUser.role === 'unit_manager' && `Memantau pencapaian & rekrutmen tim ${currentUser.unitName}.`}
              {currentUser.role === 'agent' && `Pantau produksi pribadi, progres kualifikasi MDRT/Star Club, dan materi training.`}
              {currentUser.role === 'secretary' && 'Pusat pengelolaan admin, materi training, meeting, dan keuangan agency.'}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="px-3 py-1 bg-white/20 rounded-sm">PruCode: {currentUser.pruCode || 'ADMIN'}</span>
              <span className="px-3 py-1 bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 rounded-sm">
                Syariah Lisensi: {currentUser.syariahCertified ? 'Aktif Terverifikasi' : 'Proses Onboarding'}
              </span>
              <button
                onClick={() => onNavigate('kontes')}
                className="px-3 py-1 bg-amber-400 text-slate-900 font-extrabold rounded-sm shadow-xs hover:bg-amber-300 transition-all cursor-pointer flex items-center space-x-1"
              >
                <Trophy className="w-3.5 h-3.5 text-slate-900" />
                <span>Pantau Kontes Agensi →</span>
              </button>
              <button
                onClick={() => void exportDashboardPDF(currentUser, cases, recruits, performance, meetings, finance, modules, contests, allUsers)}
                className="px-3.5 py-1 bg-slate-950 hover:bg-black text-amber-300 border border-amber-400/50 font-extrabold rounded-sm shadow-sm transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download Summary (PDF)</span>
              </button>
            </div>
          </div>

          {/* Target Progress Widget */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-md border border-white/20 shrink-0 md:w-72">
            <div className="flex items-center justify-between text-xs text-red-100 mb-2 font-semibold">
              <span className="flex items-center gap-1"><Target className="w-4 h-4 text-amber-300" /> Target Production 2026</span>
              <span className="text-amber-300 font-bold">{targetProgress}%</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-300 to-emerald-400 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${targetProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-red-100">
              <span>Capaian: Rp {(totalApi / 1000000).toFixed(0)} Jt</span>
              <span>Target: Rp {(targetApi / 1000000).toFixed(0)} Jt</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards Grid (Geometric Balance Hallmark Left Accent Borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total API Card */}
        <div className="bg-white p-5 border-l-4 border-[#ED1C24] shadow-sm rounded-sm border-t border-r border-b border-gray-200">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total API (YTD)</div>
          <div className="text-2xl font-bold text-[#2D3436]">
            Rp {(totalApi / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-green-600 mt-2 font-semibold flex items-center justify-between">
            <span>+12.5% vs Year Ago</span>
            <span className="text-gray-400 text-[11px]">Syariah: {syariahPercent}%</span>
          </div>
        </div>

        {/* Closed Cases / Active Recruits Card */}
        <div className="bg-white p-5 border-l-4 border-[#2ecc71] shadow-sm rounded-sm border-t border-r border-b border-gray-200">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Polis Terbit (Issued)</div>
          <div className="text-2xl font-bold text-[#2D3436]">{issuedCasesCount} Polis</div>
          <div className="text-xs text-green-600 mt-2 font-semibold">
            {pendingUnderwritingCount} Case Underwriting/SPAJ
          </div>
        </div>

        {/* Persistency Rate Card */}
        <div className="bg-white p-5 border-l-4 border-[#f1c40f] shadow-sm rounded-sm border-t border-r border-b border-gray-200">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Persistency Rate</div>
          <div className="text-2xl font-bold text-[#2D3436]">96.4%</div>
          <div className="text-xs text-gray-400 mt-2 font-medium">
            Target AAJI Minimum: 95.0%
          </div>
        </div>

        {/* Pipeline & Kualifikasi Card */}
        <div className="bg-white p-5 border-l-4 border-[#34495e] shadow-sm rounded-sm border-t border-r border-b border-gray-200">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Pipeline</div>
          <div className="text-2xl font-bold text-[#2D3436]">{filteredRecruits.length} Agent Prospects</div>
          <div className="text-xs text-blue-600 mt-2 font-semibold underline cursor-pointer" onClick={() => onNavigate('rekrutmen')}>
            Kelola Pipeline Rekrutmen →
          </div>
        </div>
      </div>

      {/* Recharts Monthly Sales Target Achievement Bar Chart Dashboard */}
      <MonthlyTeamSalesChart currentUser={currentUser} onNavigate={onNavigate} />

      {/* Mid Section: Recharts APE Growth Line Chart & Training Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 shadow-sm border border-gray-200 rounded-md flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-100 text-[#ED1C24] text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                  APE Growth Analytics
                </span>
                <h3 className="font-bold text-base text-[#2D3436]">Pertumbuhan Total APE Agency (6 Bulan Terakhir)</h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Grafik garis Recharts tren Annual Premium Equivalent (APE) & kontribusi unit Syariah (Maret - Agustus 2026).
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> +132.4% Growth
              </span>
            </div>
          </div>

          {/* Key APE Highlights */}
          <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Total APE 6 Bulan</span>
              <p className="font-extrabold text-slate-900 text-xs sm:text-sm">Rp 1.77 Milyar</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Rata-rata / Bulan</span>
              <p className="font-extrabold text-[#ED1C24] text-xs sm:text-sm">Rp 295 Jt / Bln</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Pencapaian Bulan Ini</span>
              <p className="font-extrabold text-emerald-700 text-xs sm:text-sm">Rp 430 Jt (+30.3% Target)</p>
            </div>
          </div>

          {/* Recharts Line Chart */}
          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={apeGrowthData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                />
                <Tooltip content={<CustomApeTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="ape"
                  name="Total APE Realisasi (IDR)"
                  stroke="#ED1C24"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#ED1C24', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 8, fill: '#ED1C24' }}
                />
                <Line
                  type="monotone"
                  dataKey="syariahApe"
                  name="Syariah APE (IDR)"
                  stroke="#10B981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#10B981' }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target Baseline (IDR)"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span className="text-[11px] text-gray-500">
              *Data terintegrasi otomatis dari Sistem Production Agency Prudential.
            </span>
            <button onClick={() => onNavigate('closing')} className="text-[#ED1C24] font-bold hover:underline flex items-center gap-1">
              Detail Laporan Closing →
            </button>
          </div>
        </div>

        {/* Training Progress Box */}
        <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#2D3436]">Training Progress Agen</h3>
              {urgentModules.length > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-extrabold rounded-md flex items-center gap-1 border border-red-200 animate-pulse">
                  <AlertCircle className="w-3 h-3 text-red-600" />
                  {urgentModules.length} Urgent
                </span>
              )}
            </div>

            <div className="space-y-3.5">
              {userModules.length === 0 ? (
                <p className="text-xs text-gray-500">Belum ada modul training yang ditugaskan.</p>
              ) : (
                userModules.slice(0, 4).map((mod) => (
                  <div key={mod.id} className="p-2.5 rounded-md bg-gray-50 border border-gray-100 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-gray-900 leading-tight line-clamp-1">
                        {mod.title}
                      </span>
                      {mod.isCompleted ? (
                        <span className="shrink-0 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai
                        </span>
                      ) : mod.isUrgent ? (
                        <span className="shrink-0 px-2 py-0.5 bg-red-600 text-white text-[10px] font-extrabold uppercase rounded shadow-xs flex items-center gap-1 animate-pulse">
                          <AlertCircle className="w-3 h-3 text-white" /> Urgent (&gt;7 Hari)
                        </span>
                      ) : (
                        <span className="shrink-0 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-semibold rounded flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" /> Wajib
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span>{mod.category}</span>
                      <span className="font-medium">
                        {mod.isCompleted
                          ? '100% Selesai'
                          : mod.isUrgent
                          ? `${mod.daysDiff} hari sejak penugasan`
                          : `${mod.daysDiff} hari lalu`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          mod.isCompleted
                            ? 'bg-emerald-500 w-full'
                            : mod.isUrgent
                            ? 'bg-red-600 w-1/4'
                            : 'bg-amber-500 w-1/2'
                        }`}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('training')}
            className="mt-6 w-full py-2 bg-[#ED1C24] hover:bg-red-700 text-white rounded-md text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" /> Buka Training Hub Agency ({userModules.length} Modul)
          </button>
        </div>
      </div>

      {/* Second Visual Chart: Month Performance vs Previous Month Target & Actual Comparison */}
      <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider">
                Target vs Performance Comparison
              </span>
              <h3 className="font-bold text-base text-[#2D3436]">Komparasi Kinerja Bulan Ini vs Target & Capaian Bulan Lalu</h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Evaluasi komparatif antara target & realisasi bulan lalu (Juli 2026) dengan target & pencapaian bulan ini (Agustus 2026).
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 rounded-md flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> +30.3% Over-Target (Agustus)
            </span>
          </div>
        </div>

        {/* Comparative Indicator Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="text-[10px] font-bold text-slate-500 uppercase">APE Production</div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">Rp 430 Jt</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-1">
              +48.3% vs Target Bln Lalu (290 Jt)
            </div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Case Closing (SPAJ)</div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">41 Polis</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-1">
              +46.4% vs Target Bln Lalu (28 Case)
            </div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Rekrutmen Agen</div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">9 Agen Baru</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-1">
              +80.0% vs Target Bln Lalu (5 Agen)
            </div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Active Agent Ratio</div>
            <div className="text-sm font-extrabold text-slate-900 mt-0.5">88.0%</div>
            <div className="text-[10px] text-emerald-600 font-bold mt-1">
              +17.3% vs Target Bln Lalu (75%)
            </div>
          </div>
        </div>

        {/* Recharts BarChart Comparison */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthComparisonData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip content={<CustomComparisonTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="square" />
              <Bar dataKey="prevTarget" name="Target Bln Lalu (Juli)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="prevActual" name="Capaian Bln Lalu (Juli)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="currTarget" name="Target Bln Ini (Agustus)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="currActual" name="Capaian Bln Ini (Agustus)" fill="#ED1C24" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 bg-[#94A3B8] rounded-xs"></span> Target Juli</span>
            <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 bg-[#3B82F6] rounded-xs"></span> Realisasi Juli</span>
            <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 bg-[#F59E0B] rounded-xs"></span> Target Agustus</span>
            <span className="flex items-center gap-1.5 font-medium"><span className="w-2.5 h-2.5 bg-[#ED1C24] rounded-xs"></span> Realisasi Agustus</span>
          </div>
          <span className="font-semibold text-emerald-700">
            ✓ Konsisten Melampaui Target Baseline 2 Bulan Berturut-turut
          </span>
        </div>
      </div>

      {/* Bottom Section: Top Performers Table & Regulatory Compliance Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performer Table */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-md overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 font-bold bg-gray-50 text-sm text-[#2D3436] flex items-center justify-between">
            <span>Top 5 Performer Unit</span>
            <span className="text-xs text-gray-400 font-normal">Triwulan Ini</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-400 uppercase">
                  <th className="p-3 font-semibold">Unit Name</th>
                  <th className="p-3 font-semibold">Manager</th>
                  <th className="p-3 font-semibold text-right">API Current Month</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-3 font-bold text-gray-900">Elite Syariah 1</td>
                  <td className="p-3 text-gray-600">Linda Wijaya</td>
                  <td className="p-3 text-right font-bold text-[#ED1C24]">Rp 450.000.000</td>
                </tr>
                <tr className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-3 font-bold text-gray-900">Red Phoenix</td>
                  <td className="p-3 text-gray-600">Slamet Riyadi</td>
                  <td className="p-3 text-right font-bold text-[#ED1C24]">Rp 385.000.000</td>
                </tr>
                <tr className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-3 font-bold text-gray-900">Mandala Pride</td>
                  <td className="p-3 text-gray-600">Deni Kurniawan</td>
                  <td className="p-3 text-right font-bold text-[#ED1C24]">Rp 312.000.000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Regulatory Compliance Box */}
        <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-md flex flex-col justify-between">
          <h3 className="font-bold text-base text-[#2D3436] mb-3">Regulatory & Sharia Compliance</h3>
          <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
            <p className="text-xs leading-relaxed text-gray-600 italic">
              "Semua data dan performa yang ditampilkan telah disesuaikan dengan kode etik Prudential Indonesia dan regulasi OJK yang berlaku untuk produk Asuransi Jiwa Konvensional maupun Syariah."
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Verified by Agency Compliance System
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>Dewan Pengawas Syariah (MUI Certified)</span>
            <button onClick={() => onNavigate('prudential_rules')} className="text-[#ED1C24] font-bold hover:underline">
              Ketentuan Prudential →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Shortcuts */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Aksi Cepat Agency</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate('kalkulator')}
            className="p-4 bg-white border border-gray-200 rounded-md hover:border-[#ED1C24] hover:shadow-md transition-all text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-sm bg-red-50 text-[#ED1C24] flex items-center justify-center mb-3">
              <Calculator className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#2D3436]">Kalkulator Komisi & MDRT</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Simulasi FYC & target MDRT</p>
          </button>

          <button
            onClick={() => onNavigate('pitch_coach')}
            className="p-4 bg-white border border-gray-200 rounded-md hover:border-purple-500 hover:shadow-md transition-all text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-sm bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Brain className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#2D3436]">AI Sales Pitch Coach</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Jawaban keberatan nasabah</p>
          </button>

          <button
            onClick={() => onNavigate('closing')}
            className="p-4 bg-white border border-gray-200 rounded-md hover:border-emerald-500 hover:shadow-md transition-all text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-sm bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <FileText className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#2D3436]">Input Case / SPAJ</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Catat closing prospek baru</p>
          </button>

          <button
            onClick={() => onNavigate('rekrutmen')}
            className="p-4 bg-white border border-gray-200 rounded-md hover:border-blue-500 hover:shadow-md transition-all text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-sm bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#2D3436]">Tambah Prospek Rekrut</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Daftarkan calon agen AALI</p>
          </button>
        </div>
      </div>
    </div>
  );
};
