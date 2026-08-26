import React, { useState, useEffect } from 'react';
import {
  User,
  PerformanceRecord,
  Contest,
  ContestAgentProgress,
  ContestTargetAgentCriteria,
  InsuranceProduct,
  ClosingCase
} from '../types';
import { insuranceProducts as defaultInsuranceProducts, initialCases as defaultCases } from '../data/mockData';
import {
  Trophy,
  Award,
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Users,
  Building2,
  Target,
  Sparkles,
  Search,
  Filter,
  Check,
  ChevronRight,
  TrendingUp,
  Gift,
  X,
  Flame,
  Crown,
  FileText,
  ShieldCheck,
  Layers,
  Info,
  BarChart3,
  XCircle
} from 'lucide-react';

interface ContestManagerProps {
  currentUser: User;
  allUsers: User[];
  performanceList: PerformanceRecord[];
  contests: Contest[];
  insuranceProducts?: InsuranceProduct[];
  cases?: ClosingCase[];
  onSaveContest: (contest: Contest) => void;
  onDeleteContest: (id: string) => void;
}

export const ContestManager: React.FC<ContestManagerProps> = ({
  currentUser,
  allUsers,
  performanceList,
  contests,
  insuranceProducts,
  cases,
  onSaveContest,
  onDeleteContest
}) => {
  const isOwner = currentUser.role === 'owner';
  const isManagerOrOwner = currentUser.role === 'owner' || currentUser.role === 'unit_manager';

  const productsList = insuranceProducts && insuranceProducts.length > 0 ? insuranceProducts : defaultInsuranceProducts;
  const casesList = cases && cases.length > 0 ? cases : defaultCases;

  // Selected contest ID
  const [selectedContestId, setSelectedContestId] = useState<string>(
    contests[0]?.id || ''
  );

  // Modal Detail Kontes state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingContest, setEditingContest] = useState<Contest | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formReward, setFormReward] = useState('');
  const [formTargetApi, setFormTargetApi] = useState<number>(100000000);
  const [formRoleFilter, setFormRoleFilter] = useState<'all' | 'agent' | 'unit_manager'>('all');
  const [formUnitFilter, setFormUnitFilter] = useState<string>('all');
  const [formProductTypeFilter, setFormProductTypeFilter] = useState<'all' | 'konvensional' | 'syariah'>('all');
  const [formProductCategoryFilter, setFormProductCategoryFilter] = useState<string>('all');
  const [formAllowedProductIds, setFormAllowedProductIds] = useState<string[]>([]);
  const [formMinCases, setFormMinCases] = useState<number>(3);
  const [formMinPersistency, setFormMinPersistency] = useState<number>(85);
  const [formStartDate, setFormStartDate] = useState('2026-08-01');
  const [formEndDate, setFormEndDate] = useState('2026-09-30');
  const [formBannerColor, setFormBannerColor] = useState('from-red-600 to-rose-700');

  // Search and filter inside selected contest leaderboard
  const [searchQuery, setSearchQuery] = useState('');
  const [unitFilterTab, setUnitFilterTab] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'qualified' | 'in_progress'>('all');

  // Countdown timer calculation state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const activeContest = contests.find((c) => c.id === selectedContestId) || contests[0];

  // Unique unit names list for dropdown
  const availableUnits = Array.from(
    new Set(allUsers.map((u) => u.unitName).filter((u): u is string => Boolean(u)))
  );

  // Calculate eligible products and production for a contest
  const getEligibleProducts = (contest: Contest) => {
    const criteria = contest.targetAgentCriteria;
    const typeFilter = criteria.productTypeFilter || 'all';
    const categoryFilter = criteria.productCategoryFilter || 'all';
    const allowedIds = criteria.allowedProductIds || [];

    return productsList.map((prod) => {
      const isTypeMatch = typeFilter === 'all' || prod.type === typeFilter;
      const isCategoryMatch = categoryFilter === 'all' || prod.category === categoryFilter;
      const isAllowedId = allowedIds.length === 0 || allowedIds.includes(prod.id) || allowedIds.includes(prod.code);

      const isEligible = isTypeMatch && isCategoryMatch && isAllowedId;

      // Calculate production cases for this product
      const matchingCases = casesList.filter((cs) => {
        const prodNameLower = prod.name.toLowerCase();
        const prodCodeLower = prod.code.toLowerCase();
        const caseProdLower = cs.productName.toLowerCase();
        return caseProdLower.includes(prodNameLower) || caseProdLower.includes(prodCodeLower);
      });

      const totalCasesCount = matchingCases.length;
      const totalApiContributed = matchingCases.reduce((sum, item) => sum + item.annualPremium, 0);

      return {
        ...prod,
        isEligible,
        totalCasesCount,
        totalApiContributed
      };
    });
  };

  // Open modal for NEW contest
  const handleOpenCreateModal = () => {
    setEditingContest(null);
    setFormTitle('');
    setFormDescription('');
    setFormReward('');
    setFormTargetApi(100000000);
    setFormRoleFilter('all');
    setFormUnitFilter('all');
    setFormProductTypeFilter('all');
    setFormProductCategoryFilter('all');
    setFormAllowedProductIds(productsList.map((p) => p.id));
    setFormMinCases(3);
    setFormMinPersistency(85);
    setFormStartDate(new Date().toISOString().split('T')[0]);
    // Default deadline 2 months from now
    const future = new Date();
    future.setMonth(future.getMonth() + 2);
    setFormEndDate(future.toISOString().split('T')[0]);
    setFormBannerColor('from-red-600 to-rose-700');
    setIsModalOpen(true);
  };

  // Open modal for EDIT contest
  const handleOpenEditModal = (contest: Contest) => {
    setEditingContest(contest);
    setFormTitle(contest.title);
    setFormDescription(contest.description);
    setFormReward(contest.reward);
    setFormTargetApi(contest.targetApi);
    setFormRoleFilter(contest.targetAgentCriteria.roleFilter);
    setFormUnitFilter(contest.targetAgentCriteria.unitFilter);
    setFormProductTypeFilter(contest.targetAgentCriteria.productTypeFilter || 'all');
    setFormProductCategoryFilter(contest.targetAgentCriteria.productCategoryFilter || 'all');
    setFormAllowedProductIds(
      contest.targetAgentCriteria.allowedProductIds && contest.targetAgentCriteria.allowedProductIds.length > 0
        ? contest.targetAgentCriteria.allowedProductIds
        : productsList.map((p) => p.id)
    );
    setFormMinCases(contest.targetAgentCriteria.minCases);
    setFormMinPersistency(contest.targetAgentCriteria.minPersistency);
    setFormStartDate(contest.startDate);
    setFormEndDate(contest.endDate);
    setFormBannerColor(contest.bannerColor || 'from-red-600 to-rose-700');
    setIsModalOpen(true);
  };

  // Submit form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formReward || formTargetApi <= 0) {
      alert('Mohon lengkapi judul kontes, deskripsi hadiah, dan target API.');
      return;
    }

    const newContest: Contest = {
      id: editingContest ? editingContest.id : `cnt-${Date.now()}`,
      title: formTitle,
      description: formDescription,
      reward: formReward,
      targetApi: formTargetApi,
      targetAgentCriteria: {
        roleFilter: formRoleFilter,
        unitFilter: formUnitFilter,
        productTypeFilter: formProductTypeFilter,
        productCategoryFilter: formProductCategoryFilter,
        allowedProductIds: formAllowedProductIds,
        minCases: formMinCases,
        minPersistency: formMinPersistency
      },
      startDate: formStartDate,
      endDate: formEndDate,
      // Derive status from dates so editing a finished contest doesn't revive it.
      status:
        formEndDate < new Date().toISOString().split('T')[0]
          ? 'Selesai'
          : formStartDate > new Date().toISOString().split('T')[0]
            ? 'Mendatang'
            : 'Aktif',
      createdBy: `${currentUser.name} (${currentUser.role})`,
      createdAt: editingContest ? editingContest.createdAt : new Date().toISOString().split('T')[0],
      bannerColor: formBannerColor
    };

    onSaveContest(newContest);
    setSelectedContestId(newContest.id);
    setIsModalOpen(false);
  };

  // Countdown timer tick effect
  useEffect(() => {
    if (!activeContest) return;

    const calculateTimeLeft = () => {
      const deadline = new Date(`${activeContest.endDate}T23:59:59`).getTime();
      const now = new Date().getTime();
      const difference = deadline - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [activeContest]);

  // Compute Agent Progress & Rankings for current activeContest
  const calculateLeaderboard = (): ContestAgentProgress[] => {
    if (!activeContest) return [];

    const { roleFilter, unitFilter, minCases, minPersistency } = activeContest.targetAgentCriteria;

    // Filter eligible agents from allUsers (exclude secretaries or owners if not agent)
    const eligibleUsers = allUsers.filter((u) => {
      if (u.role === 'secretary' || u.role === 'owner') return false;
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (unitFilter !== 'all' && u.unitName !== unitFilter) return false;
      return true;
    });

    const results: ContestAgentProgress[] = eligibleUsers.map((u) => {
      // Find agent performance record
      const perf = performanceList.find((p) => p.agentId === u.id || p.pruCode === u.pruCode);

      const achievedApi = perf ? perf.totalApi : 0;
      const caseCount = perf ? perf.caseCount : 0;
      const persistencyRate = perf ? perf.persistencyRate : 100;

      const percentage = (achievedApi / activeContest.targetApi) * 100;

      // Qualified if achievedApi >= targetApi AND caseCount >= minCases AND persistencyRate >= minPersistency
      const isQualified =
        achievedApi >= activeContest.targetApi &&
        caseCount >= minCases &&
        persistencyRate >= minPersistency;

      return {
        agentId: u.id,
        agentName: u.name,
        pruCode: u.pruCode || 'N/A',
        unitName: u.unitName || 'Tanpa Unit',
        role: u.role,
        avatar: u.avatar,
        achievedApi,
        targetApi: activeContest.targetApi,
        percentage,
        caseCount,
        persistencyRate,
        isQualified,
        rank: 0
      };
    });

    // Sort descending by achievedApi
    results.sort((a, b) => b.achievedApi - a.achievedApi);

    // Assign rank
    return results.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  };

  const allAgentProgress = calculateLeaderboard();

  // Filtered leaderboard based on search query, unit tab, and status filter
  const filteredLeaderboard = allAgentProgress.filter((item) => {
    const matchesSearch =
      item.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pruCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUnit = unitFilterTab === 'all' || item.unitName === unitFilterTab;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'qualified' && item.isQualified) ||
      (statusFilter === 'in_progress' && !item.isQualified);

    return matchesSearch && matchesUnit && matchesStatus;
  });

  // Top 5 Qualified Agents (Overall Qualified sorted descending by achievedApi)
  const qualifiedAgents = allAgentProgress
    .filter((a) => a.isQualified)
    .sort((a, b) => b.achievedApi - a.achievedApi);

  // If fewer than 5 have reached 100% target, take the top 5 highest achievers who match criteria
  const top5QualifiedAgents =
    qualifiedAgents.length >= 5
      ? qualifiedAgents.slice(0, 5)
      : allAgentProgress.slice(0, 5);

  // Group Top 5 Qualified Agents by Unit Name
  const top5GroupedByUnit = top5QualifiedAgents.reduce<Record<string, ContestAgentProgress[]>>(
    (acc, agent) => {
      const unit = agent.unitName || 'Tanpa Unit';
      if (!acc[unit]) {
        acc[unit] = [];
      }
      acc[unit].push(agent);
      return acc;
    },
    {}
  );

  // Statistics
  const totalParticipants = allAgentProgress.length;
  const totalQualified = qualifiedAgents.length;
  const totalCollectiveApi = allAgentProgress.reduce((sum, item) => sum + item.achievedApi, 0);

  return (
    <div className="space-y-6">
      {/* Top Action & Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-md border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-[#ED1C24]" />
            <h1 className="text-xl font-black text-[#2D3436] tracking-tight uppercase">
              KONTES AGENSI REINASTA
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-red-100 text-[#ED1C24] rounded-md uppercase">
              INCENTIVE & TARGET
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Pantau syarat, ketentuan, deadline, dan kualifikasi target produksi API agen secara real-time.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setIsDetailModalOpen(true)}
            className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs rounded-md shadow-xs transition-all flex items-center space-x-2 cursor-pointer border border-slate-700"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Detail & Breakdown Produk</span>
          </button>
          {isOwner && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-[#ED1C24] text-white hover:bg-red-700 font-bold text-xs rounded-md shadow-xs transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Kontes Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Contest Selector Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {contests.map((c) => {
          const isSelected = c.id === activeContest?.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedContestId(c.id)}
              className={`px-4 py-2.5 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 border ${
                isSelected
                  ? 'bg-red-50 text-[#ED1C24] border-red-300 shadow-xs'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Trophy className={`w-4 h-4 ${isSelected ? 'text-[#ED1C24]' : 'text-gray-400'}`} />
              <span>{c.title}</span>
              {c.status === 'Aktif' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Contest Banner Card */}
      {activeContest && (
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white rounded-md p-6 shadow-md border border-gray-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 text-[10px] font-extrabold bg-[#ED1C24] text-white rounded-sm uppercase tracking-wider flex items-center space-x-1">
                  <Flame className="w-3 h-3 text-amber-300" />
                  <span>KONTES AKTIF OWNER</span>
                </span>
                <span className="px-2.5 py-1 text-[10px] font-bold bg-white/10 text-gray-200 rounded-sm">
                  Periode: {new Date(activeContest.startDate).toLocaleDateString('id-ID')} - {new Date(activeContest.endDate).toLocaleDateString('id-ID')}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight text-white">
                {activeContest.title}
              </h2>

              <p className="text-xs text-gray-300 leading-relaxed">
                {activeContest.description}
              </p>

              <div className="p-3 bg-white/10 backdrop-blur-xs rounded-md border border-white/15 flex items-start space-x-3 text-amber-200">
                <Gift className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">HADIAH & REWARD KONTES</div>
                  <div className="text-xs font-semibold text-white">{activeContest.reward}</div>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => setIsDetailModalOpen(true)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-md shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-slate-950" />
                  <span>Lihat Detail Kontes & Breakdown Produk</span>
                </button>
              </div>
            </div>

            {/* Countdown Box & Actions */}
            <div className="flex flex-col items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-md border border-white/20 min-w-[240px] text-center space-y-3">
              <div className="flex items-center space-x-1.5 text-xs font-extrabold text-amber-300 uppercase">
                <Clock className="w-4 h-4 animate-spin text-amber-300" style={{ animationDuration: '4s' }} />
                <span>COUNTDOWN DEADLINE</span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center w-full">
                <div className="bg-black/40 p-2 rounded-sm border border-white/10">
                  <span className="text-xl font-black text-white">{timeLeft.days}</span>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Hari</span>
                </div>
                <div className="bg-black/40 p-2 rounded-sm border border-white/10">
                  <span className="text-xl font-black text-white">{timeLeft.hours}</span>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Jam</span>
                </div>
                <div className="bg-black/40 p-2 rounded-sm border border-white/10">
                  <span className="text-xl font-black text-white">{timeLeft.minutes}</span>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Menit</span>
                </div>
                <div className="bg-black/40 p-2 rounded-sm border border-white/10">
                  <span className="text-xl font-black text-red-400">{timeLeft.seconds}</span>
                  <span className="block text-[9px] text-gray-400 font-bold uppercase">Detik</span>
                </div>
              </div>

              {isOwner && (
                <div className="flex items-center space-x-2 pt-1 w-full justify-center">
                  <button
                    onClick={() => handleOpenEditModal(activeContest)}
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] rounded-md transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Kontes</span>
                  </button>
                  {contests.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm('Apakah Anda yakin ingin menghapus kontes ini?')) {
                          onDeleteContest(activeContest.id);
                          setSelectedContestId(contests.find((c) => c.id !== activeContest.id)?.id || '');
                        }
                      }}
                      className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white font-bold text-[11px] rounded-md transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Target & Rules Cards Grid */}
      {activeContest && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-md border border-gray-200 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-md bg-red-50 text-[#ED1C24] flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">TARGET API KONTES</p>
              <p className="text-base font-black text-[#2D3436]">
                Rp {activeContest.targetApi.toLocaleString('id-ID')}
              </p>
              <p className="text-[10px] text-gray-400">{(activeContest.targetApi / 1000000).toFixed(0)} Juta per Agen</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-200 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">AGEN QUALIFIED</p>
              <p className="text-base font-black text-[#2D3436]">
                {totalQualified} <span className="text-xs font-normal text-gray-500">/ {totalParticipants} Agen</span>
              </p>
              <p className="text-[10px] text-emerald-600 font-semibold">
                {totalParticipants > 0 ? ((totalQualified / totalParticipants) * 100).toFixed(1) : 0}% Lolos
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-200 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">TOTAL API KOLEKTIF</p>
              <p className="text-base font-black text-[#2D3436]">
                Rp {(totalCollectiveApi / 1000000).toFixed(1)} Jt
              </p>
              <p className="text-[10px] text-gray-400">Total Akumulasi Peserta</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md border border-gray-200 shadow-xs flex items-center space-x-3">
            <div className="w-10 h-10 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">SYARAT TAMBAHAN</p>
              <p className="text-xs font-bold text-gray-800">
                Min {activeContest.targetAgentCriteria.minCases} Kasus | Persistency ≥ {activeContest.targetAgentCriteria.minPersistency}%
              </p>
              <p className="text-[10px] text-gray-400">Target Role: {activeContest.targetAgentCriteria.roleFilter.toUpperCase()}</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: TOP 5 AGEN QUALIFIED (DIKELOMPOKKAN BERDASARKAN UNIT) */}
      <div className="bg-white rounded-md border border-gray-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-black text-[#2D3436] tracking-tight uppercase">
                DAFTAR TOP 5 AGEN QUALIFIED (KELOMPOK UNIT)
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              5 Agen terbaik dengan pencapaian target API tertinggi, dikelompokkan sesuai Unit masing-masing.
            </p>
          </div>

          <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-md text-xs font-bold shrink-0">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Kualifikasi Target API Desending</span>
          </div>
        </div>

        {/* Grouped Cards by Unit */}
        {Object.keys(top5GroupedByUnit).length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300">
            <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-gray-600">Belum ada agen peserta yang memenuhi kriteria kontes ini.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(top5GroupedByUnit).map(([unitName, agents]) => (
              <div key={unitName} className="border border-gray-200 rounded-md overflow-hidden shadow-xs">
                {/* Unit Section Header */}
                <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-[#ED1C24]" />
                    <span className="font-extrabold text-xs sm:text-sm tracking-wide uppercase">
                      UNIT: {unitName}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-300 bg-white/10 px-2.5 py-0.5 rounded-sm">
                    {agents.length} Qualified / Top Achiever
                  </span>
                </div>

                {/* Agents List in this Unit */}
                <div className="divide-y divide-gray-100 bg-white">
                  {agents.map((agent) => {
                    const isQualified = agent.isQualified;
                    return (
                      <div
                        key={agent.agentId}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                      >
                        {/* Agent Left Info */}
                        <div className="flex items-center space-x-3 min-w-[240px]">
                          <div className="relative">
                            <img
                              src={agent.avatar}
                              alt={agent.agentName}
                              className="w-11 h-11 rounded-full object-cover border-2 border-gray-200 shrink-0"
                            />
                            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-500 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-xs">
                              #{agent.rank}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-[#2D3436]">{agent.agentName}</span>
                              {isQualified && (
                                <span className="px-2 py-0.5 text-[9px] font-extrabold bg-emerald-100 text-emerald-800 rounded-sm flex items-center space-x-1">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>QUALIFIED</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 font-mono">
                              PruCode: {agent.pruCode} • <span className="capitalize">{agent.role.replace('_', ' ')}</span>
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar & API Values */}
                        <div className="flex-1 max-w-md space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-gray-700">
                              Pencapaian: <strong className="text-[#ED1C24]">Rp {agent.achievedApi.toLocaleString('id-ID')}</strong>
                            </span>
                            <span className="font-black text-gray-900">{agent.percentage.toFixed(1)}% Target</span>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 rounded-full ${
                                isQualified ? 'bg-emerald-500' : 'bg-[#ED1C24]'
                              }`}
                              style={{ width: `${Math.min(agent.percentage, 100)}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-gray-500">
                            <span>Target: Rp {agent.targetApi.toLocaleString('id-ID')}</span>
                            <span>{agent.caseCount} Kasus • Persistency {agent.persistencyRate}%</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0 text-right">
                          {isQualified ? (
                            <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                              <Trophy className="w-4 h-4 text-emerald-600" />
                              <span>LOLOS KONTES</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                              <TrendingUp className="w-4 h-4 text-amber-600" />
                              <span>MENGEJAR TARGET</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION: FULL LEADERBOARD & PROGRESS PEMANTAUAN ALL AGENTS */}
      <div className="bg-white rounded-md border border-gray-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-black text-[#2D3436] tracking-tight uppercase flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#ED1C24]" />
              <span>TABEL PROGRESS SELURUH AGEN PESERTA KONTES</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Pantau peringkat dan detail perolehan API tiap agen sampai deadline berakhir.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[180px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari Agen / PruCode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
              />
            </div>

            <select
              value={unitFilterTab}
              onChange={(e) => setUnitFilterTab(e.target.value)}
              className="text-xs border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-red-500"
            >
              <option value="all">Semua Unit</option>
              {availableUnits.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs border border-gray-300 rounded-md px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-red-500"
            >
              <option value="all">Semua Status</option>
              <option value="qualified">Hanya Qualified</option>
              <option value="in_progress">Dalam Progres</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-md">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3 text-center">Rank</th>
                <th className="p-3">Nama Agen</th>
                <th className="p-3">Unit Name</th>
                <th className="p-3 text-right">Pencapaian API</th>
                <th className="p-3 text-center">% Target</th>
                <th className="p-3 text-center">Kasus</th>
                <th className="p-3 text-center">Persistency</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium">
              {filteredLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    Tidak ada data agen yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredLeaderboard.map((item) => (
                  <tr key={item.agentId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center font-black text-gray-700">
                      #{item.rank}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={item.avatar}
                          alt={item.agentName}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <div className="font-bold text-gray-900">{item.agentName}</div>
                          <div className="text-[10px] text-gray-500 font-mono">Code: {item.pruCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-gray-600">{item.unitName}</td>
                    <td className="p-3 text-right font-extrabold text-[#2D3436]">
                      Rp {item.achievedApi.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3 text-center">
                      <div className="inline-block min-w-[60px]">
                        <span className="font-black text-xs text-gray-800">{item.percentage.toFixed(1)}%</span>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className={`h-full ${item.isQualified ? 'bg-emerald-500' : 'bg-[#ED1C24]'}`}
                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-gray-700">{item.caseCount}</td>
                    <td className="p-3 text-center font-bold text-gray-700">{item.persistencyRate}%</td>
                    <td className="p-3 text-center">
                      {item.isQualified ? (
                        <span className="px-2.5 py-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-sm">
                          QUALIFIED
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[10px] font-extrabold bg-amber-100 text-amber-800 rounded-sm">
                          IN PROGRESS
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL: BUAT / EDIT KONTES (HANYA OWNER) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-md max-w-2xl w-full p-6 shadow-2xl border border-gray-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-2 text-[#ED1C24]">
                <Trophy className="w-5 h-5" />
                <h2 className="text-lg font-black tracking-tight text-[#2D3436]">
                  {editingContest ? 'EDIT KONTES OWNER' : 'BUAT KONTES AGENSI BARU'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 mt-4">
              {/* Judul Kontes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Judul Kontes <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kontes Trip Singapore Q3 2026"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Deskripsi & Syarat */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Deskripsi & Ketentuan Kontes
                </label>
                <textarea
                  rows={2}
                  placeholder="Rincian ketentuan kontes, jenis produk yang dihitung, dsb..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Hadiah / Reward */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Hadiah & Reward Kontes <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tiket Pesawat & Hotel Singapore 3D2N + Bonus Cash Rp 10 Juta"
                  value={formReward}
                  onChange={(e) => setFormReward(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Target API & Criteria Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Target API per Agen (Rp) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    min={1000000}
                    step={1000000}
                    required
                    value={formTargetApi}
                    onChange={(e) => setFormTargetApi(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-red-500 font-bold"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    = Rp {formTargetApi.toLocaleString('id-ID')} ({(formTargetApi / 1000000).toFixed(0)} Juta)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Kriteria Role Peserta
                  </label>
                  <select
                    value={formRoleFilter}
                    onChange={(e) => setFormRoleFilter(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-red-500 bg-white"
                  >
                    <option value="all">Semua (Agent & Unit Manager)</option>
                    <option value="agent">Khusus Agent</option>
                    <option value="unit_manager">Khusus Unit Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Target Unit
                  </label>
                  <select
                    value={formUnitFilter}
                    onChange={(e) => setFormUnitFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-red-500 bg-white"
                  >
                    <option value="all">Semua Unit dalam Agensi</option>
                    {availableUnits.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Syarat Minimal Jumlah Kasus
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formMinCases}
                    onChange={(e) => setFormMinCases(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Syarat Minimal Persistency Rate (%)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={formMinPersistency}
                    onChange={(e) => setFormMinPersistency(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Kriteria Produk Asuransi yang Dihitung */}
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-slate-800">
                  <Layers className="w-4 h-4 text-[#ED1C24]" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider">
                    KRITERIA PRODUK ASURANSI YANG DIHITUNG
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Filter Tipe Produk
                    </label>
                    <select
                      value={formProductTypeFilter}
                      onChange={(e) => setFormProductTypeFilter(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-red-500 bg-white"
                    >
                      <option value="all">Semua Tipe (Konvensional & Syariah)</option>
                      <option value="syariah">Khusus Syariah</option>
                      <option value="konvensional">Khusus Konvensional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Filter Kategori Produk
                    </label>
                    <select
                      value={formProductCategoryFilter}
                      onChange={(e) => setFormProductCategoryFilter(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-red-500 bg-white"
                    >
                      <option value="all">Semua Kategori (Kesehatan, Jiwa, Investasi, dll)</option>
                      <option value="Kesehatan">Kesehatan</option>
                      <option value="Penyakit Kritis">Penyakit Kritis</option>
                      <option value="Jiwa">Jiwa / Warisan</option>
                      <option value="Investasi">Investasi / Unit Link</option>
                    </select>
                  </div>
                </div>

                {/* Specific Products Checkbox Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Pilih Produk Asuransi Spesifik
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (formAllowedProductIds.length === productsList.length) {
                          setFormAllowedProductIds([]);
                        } else {
                          setFormAllowedProductIds(productsList.map((p) => p.id));
                        }
                      }}
                      className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      {formAllowedProductIds.length === productsList.length ? 'Kosongkan Semua' : 'Pilih Semua Produk'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto bg-white p-2.5 rounded border border-gray-300 text-xs">
                    {productsList.map((prod) => {
                      const isChecked = formAllowedProductIds.includes(prod.id);
                      return (
                        <label
                          key={prod.id}
                          className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormAllowedProductIds((prev) => [...prev, prod.id]);
                              } else {
                                setFormAllowedProductIds((prev) => prev.filter((id) => id !== prod.id));
                              }
                            }}
                            className="rounded text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                          />
                          <div className="truncate">
                            <span className="font-bold text-gray-800">{prod.code}</span> -{' '}
                            <span className="text-gray-600">{prod.name}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Periode Tanggal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tanggal Selesai (Deadline Kontes) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-red-500 font-bold text-red-600"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-md transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ED1C24] hover:bg-red-700 text-white font-bold text-xs rounded-md shadow-xs transition-all cursor-pointer flex items-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingContest ? 'Simpan Perubahan' : 'Terbitkan Kontes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETAIL KONTES & BREAKDOWN PRODUK */}
      {isDetailModalOpen && activeContest && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-md max-w-4xl w-full shadow-2xl border border-gray-200 my-8 overflow-hidden">
            {/* Modal Header */}
            <div className={`p-6 text-white bg-gradient-to-r ${activeContest.bannerColor || 'from-red-600 to-rose-700'} relative`}>
              <div className="flex items-start justify-between">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-extrabold bg-white/20 text-white rounded-sm uppercase tracking-wider backdrop-blur-xs flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                      <span>DETAIL & KETENTUAN KONTES</span>
                    </span>
                    <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-500/90 text-white rounded-sm uppercase">
                      STATUS: {activeContest.status}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {activeContest.title}
                  </h2>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {activeContest.description}
                  </p>
                </div>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Reward Ribbon */}
              <div className="mt-4 p-3 bg-black/30 backdrop-blur-sm rounded-md border border-white/20 flex items-center space-x-3 text-amber-200">
                <Gift className="w-6 h-6 text-amber-300 shrink-0" />
                <div>
                  <div className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">HADIAH & REWARD PEMENANG</div>
                  <div className="text-xs font-extrabold text-white">{activeContest.reward}</div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Grid Ketentuan Target & Deadline */}
              <div>
                <h3 className="text-xs font-black text-[#2D3436] uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                  <Target className="w-4 h-4 text-[#ED1C24]" />
                  <span>SYARAT & KRITERIA KUALIFIKASI KONTES</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Target API Agen</span>
                    <span className="text-sm font-black text-[#2D3436]">
                      Rp {activeContest.targetApi.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Min. Jumlah Kasus</span>
                    <span className="text-sm font-black text-[#2D3436]">
                      {activeContest.targetAgentCriteria.minCases} Polis Issued
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Min. Persistency</span>
                    <span className="text-sm font-black text-emerald-700">
                      {activeContest.targetAgentCriteria.minPersistency}%
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Target Peserta / Unit</span>
                    <span className="text-xs font-bold text-[#2D3436] truncate block">
                      {activeContest.targetAgentCriteria.unitFilter === 'all'
                        ? 'Semua Unit Agensi'
                        : activeContest.targetAgentCriteria.unitFilter}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rincian Breakdown Produk Asuransi */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h3 className="text-xs font-black text-[#2D3436] uppercase tracking-wider flex items-center space-x-1.5">
                    <Layers className="w-4 h-4 text-[#ED1C24]" />
                    <span>BREAKDOWN PRODUK ASURANSI YANG DIHITUNG</span>
                  </h3>
                  <div className="flex items-center space-x-2 text-[11px]">
                    <span className="px-2 py-0.5 bg-red-100 text-[#ED1C24] font-extrabold rounded">
                      Kriteria Tipe: {activeContest.targetAgentCriteria.productTypeFilter === 'syariah' ? 'Khusus Syariah' : activeContest.targetAgentCriteria.productTypeFilter === 'konvensional' ? 'Khusus Konvensional' : 'Semua (Konvensional & Syariah)'}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 font-bold rounded">
                      Kategori: {activeContest.targetAgentCriteria.productCategoryFilter === 'all' || !activeContest.targetAgentCriteria.productCategoryFilter ? 'Semua Kategori' : activeContest.targetAgentCriteria.productCategoryFilter}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-md">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">Kode & Produk Asuransi</th>
                        <th className="p-3 text-center">Tipe</th>
                        <th className="p-3">Kategori</th>
                        <th className="p-3 text-right">Min. Premi</th>
                        <th className="p-3 text-center">Status Dalam Kontes</th>
                        <th className="p-3 text-right">Produksi Terkumpul</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-medium">
                      {getEligibleProducts(activeContest).map((prod) => (
                        <tr
                          key={prod.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            prod.isEligible ? 'bg-white' : 'bg-gray-50/70 text-gray-400'
                          }`}
                        >
                          <td className="p-3">
                            <div className="font-extrabold text-[#2D3436]">
                              {prod.name}
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono">
                              Kode: {prod.code}
                            </div>
                            <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                              {prod.description}
                            </div>
                          </td>

                          <td className="p-3 text-center">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-extrabold rounded ${
                                prod.type === 'syariah'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {prod.type === 'syariah' ? 'SYARIAH' : 'KONVENSIONAL'}
                            </span>
                          </td>

                          <td className="p-3">
                            <span className="font-semibold text-gray-700">{prod.category}</span>
                          </td>

                          <td className="p-3 text-right font-semibold text-gray-700">
                            Rp {prod.minPremium.toLocaleString('id-ID')} /thn
                          </td>

                          <td className="p-3 text-center">
                            {prod.isEligible ? (
                              <span className="px-2.5 py-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-sm inline-flex items-center space-x-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>DIHITUNG 100% API</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 text-[10px] font-bold bg-gray-200 text-gray-500 rounded-sm inline-flex items-center space-x-1">
                                <XCircle className="w-3 h-3 text-gray-400" />
                                <span>TIDAK DIHITUNG</span>
                              </span>
                            )}
                          </td>

                          <td className="p-3 text-right">
                            <div className="font-extrabold text-[#2D3436]">
                              Rp {prod.totalApiContributed.toLocaleString('id-ID')}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {prod.totalCasesCount} Kasus Issued
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rincian Polis & Production Contributed */}
              <div>
                <h3 className="text-xs font-black text-[#2D3436] uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                  <BarChart3 className="w-4 h-4 text-[#ED1C24]" />
                  <span>DAFTAR POLIS / KASUS TERPENUHI DALAM PERIODE KONTES</span>
                </h3>

                <div className="overflow-x-auto border border-gray-200 rounded-md">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-2.5">Nasabah</th>
                        <th className="p-2.5">Agen Penulis</th>
                        <th className="p-2.5">Produk Asuransi</th>
                        <th className="p-2.5 text-right">Nilai API (Rp)</th>
                        <th className="p-2.5 text-center">Status Case</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 font-medium">
                      {casesList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-gray-500">
                            Belum ada transaksi polis terdaftar.
                          </td>
                        </tr>
                      ) : (
                        casesList.map((cs) => (
                          <tr key={cs.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-gray-900">{cs.clientName}</td>
                            <td className="p-2.5 font-semibold text-gray-700">{cs.agentName}</td>
                            <td className="p-2.5 text-gray-800 font-semibold">{cs.productName}</td>
                            <td className="p-2.5 text-right font-black text-[#2D3436]">
                              Rp {cs.annualPremium.toLocaleString('id-ID')}
                            </td>
                            <td className="p-2.5 text-center">
                              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-100 text-blue-800 rounded">
                                {cs.stage}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Kontes diterbitkan oleh <span className="font-bold text-gray-700">{activeContest.createdBy}</span>
              </div>
              <div className="flex items-center space-x-2">
                {isOwner && (
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleOpenEditModal(activeContest);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-md transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Kriteria Produk</span>
                  </button>
                )}
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-5 py-2 bg-[#ED1C24] hover:bg-red-700 text-white font-bold text-xs rounded-md transition-all cursor-pointer"
                >
                  Tutup Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
