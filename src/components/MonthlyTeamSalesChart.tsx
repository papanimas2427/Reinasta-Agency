import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Target,
  Award,
  Sparkles,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  ChevronRight,
  Info
} from 'lucide-react';
import { User } from '../types';

interface MonthlySalesData {
  month: string;
  shortMonth: string;
  targetApi: number;
  actualApi: number;
  syariahApi: number;
  konvensionalApi: number;
  casesCount: number;
  topAgent: string;
  status: 'achieved' | 'on_track' | 'under_target';
  unitFilter?: string;
}

interface MonthlyTeamSalesChartProps {
  currentUser?: User;
  onNavigate?: (tab: string) => void;
}

export const MonthlyTeamSalesChart: React.FC<MonthlyTeamSalesChartProps> = ({
  currentUser,
  onNavigate
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedSegment, setSelectedSegment] = useState<'all' | 'syariah' | 'konvensional'>('all');
  const [chartMode, setChartMode] = useState<'comparison' | 'percentage' | 'stacked'>('comparison');

  // Base monthly data per team for 2026
  const rawMonthlyData2026: MonthlySalesData[] = [
    {
      month: 'Januari 2026',
      shortMonth: 'Jan',
      targetApi: 180000000,
      actualApi: 195000000,
      syariahApi: 110000000,
      konvensionalApi: 85000000,
      casesCount: 15,
      topAgent: 'Siti Rahmawati, AAK',
      status: 'achieved'
    },
    {
      month: 'Februari 2026',
      shortMonth: 'Feb',
      targetApi: 200000000,
      actualApi: 215000000,
      syariahApi: 130000000,
      konvensionalApi: 85000000,
      casesCount: 17,
      topAgent: 'Rian Hidayat',
      status: 'achieved'
    },
    {
      month: 'Maret 2026',
      shortMonth: 'Mar',
      targetApi: 220000000,
      actualApi: 240000000,
      syariahApi: 140000000,
      konvensionalApi: 100000000,
      casesCount: 20,
      topAgent: 'Ahmad Fauzi',
      status: 'achieved'
    },
    {
      month: 'April 2026',
      shortMonth: 'Apr',
      targetApi: 240000000,
      actualApi: 265000000,
      syariahApi: 160000000,
      konvensionalApi: 105000000,
      casesCount: 22,
      topAgent: 'Maya Putri',
      status: 'achieved'
    },
    {
      month: 'Mei 2026',
      shortMonth: 'Mei',
      targetApi: 260000000,
      actualApi: 280000000,
      syariahApi: 175000000,
      konvensionalApi: 105000000,
      casesCount: 24,
      topAgent: 'Hendra Wijaya',
      status: 'achieved'
    },
    {
      month: 'Juni 2026',
      shortMonth: 'Jun',
      targetApi: 280000000,
      actualApi: 310000000,
      syariahApi: 190000000,
      konvensionalApi: 120000000,
      casesCount: 28,
      topAgent: 'Siti Rahmawati, AAK',
      status: 'achieved'
    },
    {
      month: 'Juli 2026',
      shortMonth: 'Jul',
      targetApi: 300000000,
      actualApi: 365000000,
      syariahApi: 220000000,
      konvensionalApi: 145000000,
      casesCount: 33,
      topAgent: 'Budi Santoso, CFP',
      status: 'achieved'
    },
    {
      month: 'Agustus 2026',
      shortMonth: 'Agu',
      targetApi: 330000000,
      actualApi: 430000000,
      syariahApi: 260000000,
      konvensionalApi: 170000000,
      casesCount: 41,
      topAgent: 'Rian Hidayat',
      status: 'achieved'
    },
    {
      month: 'September 2026 (Run-rate)',
      shortMonth: 'Sep',
      targetApi: 350000000,
      actualApi: 380000000,
      syariahApi: 230000000,
      konvensionalApi: 150000000,
      casesCount: 35,
      topAgent: 'Ahmad Fauzi',
      status: 'achieved'
    },
    {
      month: 'Oktober 2026 (Proyeksi)',
      shortMonth: 'Okt',
      targetApi: 380000000,
      actualApi: 410000000,
      syariahApi: 250000000,
      konvensionalApi: 160000000,
      casesCount: 38,
      topAgent: 'Maya Putri',
      status: 'achieved'
    },
    {
      month: 'November 2026 (Proyeksi)',
      shortMonth: 'Nov',
      targetApi: 400000000,
      actualApi: 450000000,
      syariahApi: 280000000,
      konvensionalApi: 170000000,
      casesCount: 42,
      topAgent: 'Siti Rahmawati, AAK',
      status: 'achieved'
    },
    {
      month: 'Desember 2026 (Proyeksi)',
      shortMonth: 'Des',
      targetApi: 450000000,
      actualApi: 520000000,
      syariahApi: 320000000,
      konvensionalApi: 200000000,
      casesCount: 48,
      topAgent: 'Budi Santoso, CFP',
      status: 'achieved'
    }
  ];

  // Base monthly data for 2025 Historical
  const rawMonthlyData2025: MonthlySalesData[] = [
    { month: 'Jan 2025', shortMonth: 'Jan', targetApi: 140000000, actualApi: 135000000, syariahApi: 75000000, konvensionalApi: 60000000, casesCount: 11, topAgent: 'Hendra Wijaya', status: 'under_target' },
    { month: 'Feb 2025', shortMonth: 'Feb', targetApi: 150000000, actualApi: 155000000, syariahApi: 85000000, konvensionalApi: 70000000, casesCount: 13, topAgent: 'Siti Rahmawati, AAK', status: 'achieved' },
    { month: 'Mar 2025', shortMonth: 'Mar', targetApi: 160000000, actualApi: 170000000, syariahApi: 95000000, konvensionalApi: 75000000, casesCount: 14, topAgent: 'Budi Santoso, CFP', status: 'achieved' },
    { month: 'Apr 2025', shortMonth: 'Apr', targetApi: 170000000, actualApi: 180000000, syariahApi: 100000000, konvensionalApi: 80000000, casesCount: 15, topAgent: 'Rian Hidayat', status: 'achieved' },
    { month: 'Mei 2025', shortMonth: 'Mei', targetApi: 180000000, actualApi: 195000000, syariahApi: 110000000, konvensionalApi: 85000000, casesCount: 16, topAgent: 'Ahmad Fauzi', status: 'achieved' },
    { month: 'Jun 2025', shortMonth: 'Jun', targetApi: 200000000, actualApi: 210000000, syariahApi: 120000000, konvensionalApi: 90000000, casesCount: 18, topAgent: 'Maya Putri', status: 'achieved' },
    { month: 'Jul 2025', shortMonth: 'Jul', targetApi: 220000000, actualApi: 235000000, syariahApi: 135000000, konvensionalApi: 100000000, casesCount: 20, topAgent: 'Siti Rahmawati, AAK', status: 'achieved' },
    { month: 'Agu 2025', shortMonth: 'Agu', targetApi: 240000000, actualApi: 260000000, syariahApi: 150000000, konvensionalApi: 110000000, casesCount: 22, topAgent: 'Budi Santoso, CFP', status: 'achieved' },
    { month: 'Sep 2025', shortMonth: 'Sep', targetApi: 250000000, actualApi: 270000000, syariahApi: 160000000, konvensionalApi: 110000000, casesCount: 23, topAgent: 'Hendra Wijaya', status: 'achieved' },
    { month: 'Okt 2025', shortMonth: 'Okt', targetApi: 270000000, actualApi: 290000000, syariahApi: 170000000, konvensionalApi: 120000000, casesCount: 25, topAgent: 'Rian Hidayat', status: 'achieved' },
    { month: 'Nov 2025', shortMonth: 'Nov', targetApi: 290000000, actualApi: 320000000, syariahApi: 190000000, konvensionalApi: 130000000, casesCount: 28, topAgent: 'Siti Rahmawati, AAK', status: 'achieved' },
    { month: 'Des 2025', shortMonth: 'Des', targetApi: 320000000, actualApi: 360000000, syariahApi: 220000000, konvensionalApi: 140000000, casesCount: 32, topAgent: 'Budi Santoso, CFP', status: 'achieved' }
  ];

  const sourceData = selectedYear === '2026' ? rawMonthlyData2026 : rawMonthlyData2025;

  // Process data with filters & unit adjustments
  const processedData = useMemo(() => {
    let unitMultiplier = 1.0;
    if (selectedUnit === 'Elang Syariah Team') unitMultiplier = 0.52;
    if (selectedUnit === 'Garuda Champions') unitMultiplier = 0.38;
    if (selectedUnit === 'Headquarters') unitMultiplier = 0.10;

    return sourceData.map((item) => {
      let target = Math.round(item.targetApi * unitMultiplier);
      let actual = Math.round(item.actualApi * unitMultiplier);
      let syariah = Math.round(item.syariahApi * unitMultiplier);
      let konvensional = Math.round(item.konvensionalApi * unitMultiplier);

      if (selectedSegment === 'syariah') {
        target = Math.round(target * 0.65);
        actual = syariah;
      } else if (selectedSegment === 'konvensional') {
        target = Math.round(target * 0.35);
        actual = konvensional;
      }

      const achievementRate = target > 0 ? Math.round((actual / target) * 100) : 0;
      const deltaApi = actual - target;

      return {
        ...item,
        targetApi: target,
        actualApi: actual,
        syariahApi: syariah,
        konvensionalApi: konvensional,
        achievementRate,
        deltaApi,
        targetJuta: Number((target / 1000000).toFixed(1)),
        actualJuta: Number((actual / 1000000).toFixed(1)),
        syariahJuta: Number((syariah / 1000000).toFixed(1)),
        konvensionalJuta: Number((konvensional / 1000000).toFixed(1))
      };
    });
  }, [sourceData, selectedUnit, selectedSegment]);

  // Aggregate Metrics
  const totalTargetYTD = processedData.reduce((sum, d) => sum + d.targetApi, 0);
  const totalActualYTD = processedData.reduce((sum, d) => sum + d.actualApi, 0);
  const avgAchievementPercent = Math.round((totalActualYTD / totalTargetYTD) * 100);

  const peakMonthObj = [...processedData].sort((a, b) => b.actualApi - a.actualApi)[0];
  const totalCasesYTD = processedData.reduce((sum, d) => sum + d.casesCount, 0);

  // Custom Recharts Tooltip
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isExceeded = data.actualApi >= data.targetApi;

      return (
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 text-xs space-y-2.5 min-w-[240px]">
          <div className="border-b border-slate-700 pb-2 flex items-center justify-between">
            <span className="font-extrabold text-amber-300 text-xs">{data.month}</span>
            <span
              className={`px-2 py-0.5 text-[10px] font-black rounded uppercase ${
                isExceeded ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'
              }`}
            >
              {data.achievementRate}% Target
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#ED1C24] rounded-full inline-block"></span> Realisasi Penjualan Tim:
              </span>
              <span className="font-extrabold text-white text-xs">
                Rp {data.actualApi.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-slate-400 rounded-full inline-block"></span> Target Bulanan Baseline:
              </span>
              <span className="font-semibold text-slate-300">
                Rp {data.targetApi.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span>Rincian Syariah:</span>
              <span className="font-bold text-emerald-400">
                Rp {data.syariahApi.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span>Rincian Konvensional:</span>
              <span className="font-bold text-blue-400">
                Rp {data.konvensionalApi.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Selisih Delta Target:</span>
                <span
                  className={`font-black ${
                    data.deltaApi >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {data.deltaApi >= 0 ? '+' : ''}Rp {data.deltaApi.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Polis Closing (SPAJ):</span>
                <span className="font-bold text-amber-300">{data.casesCount} Case</span>
              </div>
              <div className="flex justify-between items-center pt-1 text-[10px] text-slate-400">
                <span>Top Producer Bulan Ini:</span>
                <span className="font-bold text-white italic">{data.topAgent}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-lg space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 bg-red-100 text-[#ED1C24] text-[10px] font-black rounded-sm uppercase tracking-wider flex items-center space-x-1">
              <BarChart3 className="w-3.5 h-3.5 text-[#ED1C24]" />
              <span>DASHBOARD RECHARTS TIM</span>
            </span>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-sm uppercase">
              RERATA CAPAIAN: {avgAchievementPercent}%
            </span>
          </div>
          <h2 className="text-xl font-black text-[#2D3436] tracking-tight mt-1.5">
            Grafik Tren Pencapaian Target Penjualan Per Bulan (Seluruh Tim)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Visualisasi grafik batang interaktif membandingkan target bulanan baseline dengan realisasi produksi APE seluruh tim agensi Prudential.
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode View Buttons */}
          <div className="bg-gray-100 p-1 rounded-md flex items-center space-x-1 border border-gray-200 text-xs">
            <button
              onClick={() => setChartMode('comparison')}
              className={`px-3 py-1.5 rounded-sm font-bold transition-all cursor-pointer ${
                chartMode === 'comparison'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Target vs Realisasi
            </button>
            <button
              onClick={() => setChartMode('percentage')}
              className={`px-3 py-1.5 rounded-sm font-bold transition-all cursor-pointer ${
                chartMode === 'percentage'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              % Pencapaian Target
            </button>
            <button
              onClick={() => setChartMode('stacked')}
              className={`px-3 py-1.5 rounded-sm font-bold transition-all cursor-pointer ${
                chartMode === 'stacked'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Stack Syariah/Konv
            </button>
          </div>

          {/* Unit Filter Select */}
          <div className="flex items-center space-x-1.5 bg-gray-50 p-1.5 rounded-md border border-gray-200">
            <Filter className="w-3.5 h-3.5 text-gray-400 ml-1" />
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="text-xs font-bold text-gray-700 bg-transparent border-none focus:outline-none cursor-pointer pr-2"
            >
              <option value="all">Seluruh Tim Agensi</option>
              <option value="Elang Syariah Team">Elang Syariah Team</option>
              <option value="Garuda Champions">Garuda Champions</option>
              <option value="Headquarters">HQ Direct Unit</option>
            </select>
          </div>

          {/* Segment Filter Select */}
          <div className="flex items-center space-x-1.5 bg-gray-50 p-1.5 rounded-md border border-gray-200">
            <Layers className="w-3.5 h-3.5 text-gray-400 ml-1" />
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value as any)}
              className="text-xs font-bold text-gray-700 bg-transparent border-none focus:outline-none cursor-pointer pr-2"
            >
              <option value="all">Semua Produk</option>
              <option value="syariah">Khusus Syariah</option>
              <option value="konvensional">Khusus Konvensional</option>
            </select>
          </div>

          {/* Year Select */}
          <div className="flex items-center space-x-1.5 bg-gray-50 p-1.5 rounded-md border border-gray-200">
            <Calendar className="w-3.5 h-3.5 text-gray-400 ml-1" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-xs font-bold text-gray-700 bg-transparent border-none focus:outline-none cursor-pointer pr-2"
            >
              <option value="2026">Tahun 2026 (YTD)</option>
              <option value="2025">Tahun 2025 (Historis)</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Highlight Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Cum. Realisasi YTD</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-[#2D3436]">
            Rp {(totalActualYTD / 1000000000).toFixed(2)} Milyar
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">
            {avgAchievementPercent >= 100 ? '✓ Outperformed Target' : 'Di Bawah Baseline'} ({avgAchievementPercent}%)
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Cum. Target Baseline</span>
            <Target className="w-4 h-4 text-[#ED1C24]" />
          </div>
          <div className="text-lg font-black text-[#2D3436]">
            Rp {(totalTargetYTD / 1000000000).toFixed(2)} Milyar
          </div>
          <div className="text-[11px] text-gray-500 font-medium mt-1">
            Baseline Target Tim 12 Bulan
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Peak Production Month</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-black text-[#2D3436] truncate">
            {peakMonthObj?.shortMonth} ({peakMonthObj?.actualJuta} Jt)
          </div>
          <div className="text-[11px] text-amber-700 font-bold mt-1 truncate">
            Top Agent: {peakMonthObj?.topAgent.split(',')[0]}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Total Polis Issued</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg font-black text-[#2D3436]">
            {totalCasesYTD} Polis
          </div>
          <div className="text-[11px] text-blue-700 font-bold mt-1">
            Rerata {(totalCasesYTD / processedData.length).toFixed(0)} Case / Bulan
          </div>
        </div>
      </div>

      {/* Main Recharts Bar Chart Container */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#2D3436] uppercase tracking-wider flex items-center space-x-1.5">
            <BarChart3 className="w-4 h-4 text-[#ED1C24]" />
            <span>
              {chartMode === 'comparison' && 'Grafik Komparasi: Target API vs Realisasi Penjualan Tim Per Bulan'}
              {chartMode === 'percentage' && 'Grafik Batang: Persentase Capaian Target (%) Per Bulan'}
              {chartMode === 'stacked' && 'Grafik Stacked: Kontribusi Syariah vs Konvensional Per Bulan'}
            </span>
          </h3>
          <span className="text-[11px] font-semibold text-gray-500">
            Satuan: Rp (Dalam Juta IDR)
          </span>
        </div>

        <div className="h-80 w-full pt-3 bg-gradient-to-b from-gray-50/50 to-white p-2 rounded-lg border border-gray-100">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'comparison' ? (
              <BarChart data={processedData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="shortMonth" tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} />
                <YAxis tickFormatter={(val) => `${val} Jt`} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="targetJuta" name="Target Baseline (Juta Rp)" fill="#94A3B8" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="actualJuta" name="Realisasi Penjualan Tim (Juta Rp)" fill="#ED1C24" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            ) : chartMode === 'percentage' ? (
              <BarChart data={processedData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="shortMonth" tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} />
                <YAxis tickFormatter={(val) => `${val}%`} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip content={<CustomBarTooltip />} />
                <ReferenceLine y={100} stroke="#ED1C24" strokeDasharray="4 4" label={{ value: '100% Target Baseline', fill: '#ED1C24', fontSize: 10, fontWeight: 'bold' }} />
                <Bar dataKey="achievementRate" name="% Pencapaian Target" radius={[4, 4, 0, 0]} barSize={26}>
                  {processedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.achievementRate >= 100 ? '#10B981' : entry.achievementRate >= 85 ? '#F59E0B' : '#ED1C24'}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <BarChart data={processedData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="shortMonth" tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} />
                <YAxis tickFormatter={(val) => `${val} Jt`} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="syariahJuta" name="Syariah API (Juta Rp)" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} barSize={24} />
                <Bar dataKey="konvensionalJuta" name="Konvensional API (Juta Rp)" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rincian Tabular Data Per Bulan */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-[#2D3436] uppercase tracking-wider flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-[#ED1C24]" />
            <span>TABEL BREAKDOWN PERFORMANSI TARGET PENJUALAN PER BULAN TIM</span>
          </h3>
          {onNavigate && (
            <button
              onClick={() => onNavigate('evaluasi')}
              className="text-xs font-bold text-[#ED1C24] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>Laporan Evaluasi Lengkap</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-md">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Bulan</th>
                <th className="p-3 text-right">Target Baseline (Rp)</th>
                <th className="p-3 text-right">Realisasi Penjualan (Rp)</th>
                <th className="p-3 text-right">Syariah (Rp)</th>
                <th className="p-3 text-center">Status % Target</th>
                <th className="p-3 text-center">Case Closed</th>
                <th className="p-3 font-semibold">Top Agent Month</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium">
              {processedData.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-extrabold text-[#2D3436]">{row.month}</td>
                  <td className="p-3 text-right font-semibold text-gray-600">
                    Rp {row.targetApi.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3 text-right font-black text-[#2D3436]">
                    Rp {row.actualApi.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3 text-right font-bold text-emerald-700">
                    Rp {row.syariahApi.toLocaleString('id-ID')}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-sm inline-flex items-center space-x-1 ${
                        row.achievementRate >= 100
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.achievementRate >= 85
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <span>{row.achievementRate}% Target</span>
                    </span>
                  </td>
                  <td className="p-3 text-center font-extrabold text-slate-800">
                    {row.casesCount} Case
                  </td>
                  <td className="p-3 font-semibold text-gray-700">{row.topAgent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
