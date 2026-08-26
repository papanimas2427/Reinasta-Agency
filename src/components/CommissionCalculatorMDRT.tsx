import React, { useState } from 'react';
import { User, PerformanceRecord } from '../types';
import {
  Calculator,
  Award,
  TrendingUp,
  Target,
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Calendar,
  Sparkles,
  DollarSign,
  Info
} from 'lucide-react';

interface CommissionCalculatorMDRTProps {
  currentUser: User;
  performanceRecords: PerformanceRecord[];
}

export const CommissionCalculatorMDRT: React.FC<CommissionCalculatorMDRTProps> = ({
  currentUser,
  performanceRecords
}) => {
  // Find current user's performance or default
  const myRecord = performanceRecords.find((p) => p.agentId === currentUser.id) || {
    totalApi: 185000000,
    apiSyariah: 125000000,
    apiKonvensional: 60000000,
    caseCount: 14,
    persistencyRate: 96.5,
    clubLevel: 'Star Club'
  };

  // Calculator State Inputs
  const [targetApe, setTargetApe] = useState<number>(400000000); // 400 Juta default APE
  const [syariahRatio, setSyariahRatio] = useState<number>(70); // 70% Syariah
  const [fycPercentage, setFycPercentage] = useState<number>(30); // 30% Base FYC
  const [productionBonusRate, setProductionBonusRate] = useState<number>(15); // 15% Bonus of FYC
  const [overrideRate, setOverrideRate] = useState<number>(12); // 12% Manager Override
  const [agentCountInUnit, setAgentCountInUnit] = useState<number>(5); // 5 agents for UM

  // MDRT Tracker State Inputs
  const [customCurrentApe, setCustomCurrentApe] = useState<number>(myRecord.totalApi);

  // MDRT Milestones (2026 Prudential Standards)
  const MDRT_TARGETS = {
    starClub: 250000000,   // Rp 250 Juta
    mdrt: 624000000,       // Rp 624 Juta
    cot: 1872000000,       // Rp 1.872 Miliar (Court of the Table)
    tot: 3744000000        // Rp 3.744 Miliar (Top of the Table)
  };

  // Commission Calculations
  const calculatedFyc = (targetApe * fycPercentage) / 100;
  const calculatedBonus = (calculatedFyc * productionBonusRate) / 100;
  
  // Manager Override (If UM, Owner, or Secretary)
  const isLeader = currentUser.role === 'unit_manager' || currentUser.role === 'owner' || currentUser.role === 'secretary';
  const unitTotalProduction = targetApe * (isLeader ? agentCountInUnit : 1);
  const calculatedOverride = isLeader ? (unitTotalProduction * overrideRate) / 100 : 0;

  const totalEstimatedIncome = calculatedFyc + calculatedBonus + calculatedOverride;
  const monthlyAverageIncome = totalEstimatedIncome / 12;

  // MDRT Tracker Calculations
  const remainingForMdrt = Math.max(0, MDRT_TARGETS.mdrt - customCurrentApe);
  const mdrtProgressPercent = Math.min(100, Math.round((customCurrentApe / MDRT_TARGETS.mdrt) * 100));

  const remainingForStarClub = Math.max(0, MDRT_TARGETS.starClub - customCurrentApe);
  const starClubProgressPercent = Math.min(100, Math.round((customCurrentApe / MDRT_TARGETS.starClub) * 100));

  // Time remaining in 2026, derived from today's date (full months until Dec 31)
  const remainingMonths = Math.max(1, 12 - new Date().getMonth());
  const monthlyRequiredApe = remainingForMdrt > 0 ? Math.ceil(remainingForMdrt / remainingMonths) : 0;
  const weeklyRequiredApe = Math.ceil(monthlyRequiredApe / 4);
  const estCasesNeeded = Math.ceil(remainingForMdrt / 25000000); // Assuming avg case premium 25 Juta/year

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-md bg-red-50 text-[#ED1C24]">
              <Calculator className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Kalkulator Komisi & Tracker MDRT 2026</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Simulasi pendapatan komisi tahun pertama (FYC), bonus tahunan, manager override, dan tracker kualifikasi MDRT (Million Dollar Round Table).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
            Role: <span className="text-[#ED1C24] uppercase font-bold">{currentUser.role.replace('_', ' ')}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            MDRT Year 2026
          </div>
        </div>
      </div>

      {/* Grid: Commission Calculator (Left) & MDRT Tracker (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Commission Simulator */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" /> Simulasi Pendapatan Komisi (FYC & Bonus)
              </h2>
              <span className="text-xs text-slate-400 font-medium">Standard Prudential FY1</span>
            </div>

            {/* Target APE Input Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <label className="text-slate-700">Target Produksi Tahunan (APE / API):</label>
                <span className="text-base font-bold text-[#ED1C24]">
                  Rp {targetApe.toLocaleString('id-ID')}
                </span>
              </div>
              <input
                type="range"
                min={50000000}
                max={1500000000}
                step={25000000}
                value={targetApe}
                onChange={(e) => setTargetApe(Number(e.target.value))}
                className="w-full accent-[#ED1C24] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>Rp 50 Juta</span>
                <span>Rp 624 Jt (MDRT)</span>
                <span>Rp 1.5 Miliar</span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs text-slate-500 self-center font-medium mr-1">Preset Quick Target:</span>
              <button
                onClick={() => setTargetApe(150000000)}
                className={`px-3 py-1 rounded text-xs font-semibold border transition-all ${
                  targetApe === 150000000
                    ? 'bg-[#ED1C24] text-white border-[#ED1C24]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                150 Jt (Rookie)
              </button>
              <button
                onClick={() => setTargetApe(250000000)}
                className={`px-3 py-1 rounded text-xs font-semibold border transition-all ${
                  targetApe === 250000000
                    ? 'bg-[#ED1C24] text-white border-[#ED1C24]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                250 Jt (Star Club)
              </button>
              <button
                onClick={() => setTargetApe(624000000)}
                className={`px-3 py-1 rounded text-xs font-semibold border transition-all ${
                  targetApe === 624000000
                    ? 'bg-[#ED1C24] text-white border-[#ED1C24]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                624 Jt (MDRT)
              </button>
              <button
                onClick={() => setTargetApe(1000000000)}
                className={`px-3 py-1 rounded text-xs font-semibold border transition-all ${
                  targetApe === 1000000000
                    ? 'bg-[#ED1C24] text-white border-[#ED1C24]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                1 Miliar
              </button>
            </div>

            {/* Parameters Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Persentase Komisi Dasar (FYC Rate):
                </label>
                <select
                  value={fycPercentage}
                  onChange={(e) => setFycPercentage(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm font-medium focus:ring-2 focus:ring-[#ED1C24] focus:outline-none"
                >
                  <option value={30}>30% (Standard Unit Link / Traditional)</option>
                  <option value={35}>35% (PRU Solusi Sehat Syariah / Health)</option>
                  <option value={40}>40% (PRUCinta Syariah Term Life)</option>
                  <option value={45}>45% (Special Promotion / Top Tier Product)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Bonus Persistensi & Produksi Tahunan:
                </label>
                <select
                  value={productionBonusRate}
                  onChange={(e) => setProductionBonusRate(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm font-medium focus:ring-2 focus:ring-[#ED1C24] focus:outline-none"
                >
                  <option value={10}>10% dari Total FYC</option>
                  <option value={15}>15% dari Total FYC (Tier Star Club)</option>
                  <option value={20}>20% dari Total FYC (Tier MDRT)</option>
                  <option value={25}>25% dari Total FYC (Tier Top Performer)</option>
                </select>
              </div>
            </div>

            {/* Manager Override Section (If Leader) */}
            {isLeader && (
              <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" /> Manager Overriding (OR) Team
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold">Khusus Unit Manager & Leader</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Jumlah Agen Aktif di Unit:</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={agentCountInUnit}
                      onChange={(e) => setAgentCountInUnit(Math.max(1, Number(e.target.value)))}
                      className="w-full p-2 bg-white border border-slate-300 rounded text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">Persentase Overriding (OR):</label>
                    <select
                      value={overrideRate}
                      onChange={(e) => setOverrideRate(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-300 rounded text-sm font-medium"
                    >
                      <option value={8}>8% dari Produksi Unit</option>
                      <option value={12}>12% dari Produksi Unit (Unit Manager)</option>
                      <option value={15}>15% dari Produksi Unit (Senior UM)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Calculation Result Cards */}
            <div className="p-5 rounded-md bg-slate-900 text-white space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Proyeksi Pendapatan Komisi Tahun Pertama (FY1)
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-slate-400">Total Proyeksi Pendapatan:</span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                    Rp {totalEstimatedIncome.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400">Rata-rata Per Bulan:</span>
                  <div className="text-lg font-bold text-amber-300">
                    Rp {Math.round(monthlyAverageIncome).toLocaleString('id-ID')} /bln
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block mb-0.5">Komisi Langsung (FYC):</span>
                  <span className="font-bold text-white text-sm">
                    Rp {calculatedFyc.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block mb-0.5">Bonus Produksi Tahunan:</span>
                  <span className="font-bold text-amber-300 text-sm">
                    Rp {calculatedBonus.toLocaleString('id-ID')}
                  </span>
                </div>
                {isLeader ? (
                  <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 block mb-0.5">Manager Override (OR):</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      Rp {calculatedOverride.toLocaleString('id-ID')}
                    </span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 block mb-0.5">Potensi Jenjang Karir:</span>
                    <span className="font-bold text-purple-300 text-sm">Unit Manager Fast Track</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: MDRT 2026 Qualification Tracker */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#ED1C24]" /> MDRT 2026 Qualification Tracker
              </h2>
              <span className="px-2.5 py-0.5 bg-red-50 text-[#ED1C24] border border-red-100 font-bold text-xs rounded">
                Prudential ID
              </span>
            </div>

            {/* Current Production Input Adjustment */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Pencapaian Produksi APE Anda Saat Ini (YTD 2026):
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">Rp</span>
                  <input
                    type="number"
                    step={5000000}
                    value={customCurrentApe}
                    onChange={(e) => setCustomCurrentApe(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#ED1C24] focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setCustomCurrentApe(myRecord.totalApi)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded cursor-pointer"
                >
                  Reset Real
                </button>
              </div>
            </div>

            {/* Progress to MDRT Main Bar */}
            <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">MDRT Member (Rp 624 Juta APE)</span>
                <span className="font-bold text-[#ED1C24]">{mdrtProgressPercent}% Achieved</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#ED1C24] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${mdrtProgressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 font-medium pt-1">
                <span>Tercapai: Rp {(customCurrentApe / 1000000).toFixed(1)} Jt</span>
                <span>Sisa Target: <strong className="text-[#ED1C24]">Rp {(remainingForMdrt / 1000000).toFixed(1)} Jt</strong></span>
              </div>
            </div>

            {/* Action Plan Needed to Reach MDRT */}
            <div className="border border-slate-200 rounded p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-600" /> Action Plan Menuju MDRT 2026
              </h3>

              {remainingForMdrt > 0 ? (
                <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <div className="flex justify-between p-2 bg-slate-50 rounded border border-slate-100">
                    <span>Target Closing / Bulan (Sisa {remainingMonths} Bulan):</span>
                    <strong className="text-slate-900">Rp {(monthlyRequiredApe / 1000000).toFixed(1)} Jt / bln</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded border border-slate-100">
                    <span>Target Closing / Minggu:</span>
                    <strong className="text-slate-900">Rp {(weeklyRequiredApe / 1000000).toFixed(1)} Jt / minggu</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded border border-slate-100">
                    <span>Estimasi Kasus Closing (Avg Rp 25Jt APE):</span>
                    <strong className="text-[#ED1C24]">{estCasesNeeded} SPAJ Polis Baru</strong>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Selamat! Anda telah resmi mencapai Kualifikasi MDRT 2026! Target selanjutnya: Court of the Table (COT).</span>
                </div>
              )}
            </div>

            {/* Milestones Hierarchy List */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Jenjang Kualifikasi Club Prudential 2026:
              </span>

              {/* Star Club */}
              <div className="flex items-center justify-between p-3 rounded border border-slate-200 bg-slate-50">
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded ${customCurrentApe >= MDRT_TARGETS.starClub ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Star Club Qualifier</div>
                    <div className="text-[11px] text-slate-500">Target: Rp 250 Juta APE</div>
                  </div>
                </div>
                <span className={`text-xs font-bold ${customCurrentApe >= MDRT_TARGETS.starClub ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {customCurrentApe >= MDRT_TARGETS.starClub ? 'QUALIFIED' : `${starClubProgressPercent}%`}
                </span>
              </div>

              {/* MDRT */}
              <div className="flex items-center justify-between p-3 rounded border border-slate-200 bg-slate-50">
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded ${customCurrentApe >= MDRT_TARGETS.mdrt ? 'bg-red-100 text-[#ED1C24]' : 'bg-slate-200 text-slate-500'}`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">MDRT Member</div>
                    <div className="text-[11px] text-slate-500">Target: Rp 624 Juta APE</div>
                  </div>
                </div>
                <span className={`text-xs font-bold ${customCurrentApe >= MDRT_TARGETS.mdrt ? 'text-[#ED1C24]' : 'text-slate-400'}`}>
                  {customCurrentApe >= MDRT_TARGETS.mdrt ? 'QUALIFIED' : `${mdrtProgressPercent}%`}
                </span>
              </div>

              {/* COT */}
              <div className="flex items-center justify-between p-3 rounded border border-slate-200 bg-slate-50">
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded ${customCurrentApe >= MDRT_TARGETS.cot ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500'}`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">COT (Court of the Table)</div>
                    <div className="text-[11px] text-slate-500">Target: Rp 1.872 Miliar APE (3x MDRT)</div>
                  </div>
                </div>
                <span className={`text-xs font-bold ${customCurrentApe >= MDRT_TARGETS.cot ? 'text-amber-700' : 'text-slate-400'}`}>
                  {customCurrentApe >= MDRT_TARGETS.cot ? 'QUALIFIED' : `${Math.min(100, Math.round((customCurrentApe / MDRT_TARGETS.cot) * 100))}%`}
                </span>
              </div>

              {/* TOT */}
              <div className="flex items-center justify-between p-3 rounded border border-slate-200 bg-slate-50">
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded ${customCurrentApe >= MDRT_TARGETS.tot ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-500'}`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">TOT (Top of the Table)</div>
                    <div className="text-[11px] text-slate-500">Target: Rp 3.744 Miliar APE (6x MDRT)</div>
                  </div>
                </div>
                <span className={`text-xs font-bold ${customCurrentApe >= MDRT_TARGETS.tot ? 'text-purple-700' : 'text-slate-400'}`}>
                  {customCurrentApe >= MDRT_TARGETS.tot ? 'QUALIFIED' : `${Math.min(100, Math.round((customCurrentApe / MDRT_TARGETS.tot) * 100))}%`}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
