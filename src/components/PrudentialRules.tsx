import React from 'react';
import { User } from '../types';
import { Scale, ShieldCheck, HeartHandshake, Award, BookOpen, CheckCircle, FileText } from 'lucide-react';

interface PrudentialRulesProps {
  currentUser: User;
}

export const PrudentialRules: React.FC<PrudentialRulesProps> = ({ currentUser }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-md border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2">
          <Scale className="w-6 h-6 text-[#ED1C24]" />
          <h1 className="text-xl font-bold text-[#2D3436]">Ketentuan & Aturan Prudential (Konvensional & Syariah)</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Pedoman resmi OJK, Asosiasi Asuransi Jiwa Indonesia (AAJI/AALI), dan tata kelola Syariah Dewan Pengawas Syariah (DPS) Prudential Indonesia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prudential Syariah Framework Card */}
        <div className="bg-white p-6 rounded-md border border-emerald-200 shadow-sm space-y-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-sm bg-emerald-100 text-emerald-800">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-emerald-950">Prinsip & Akad Asuransi Syariah (PRU Syariah)</h2>
              <p className="text-xs text-emerald-700">Prinsip Tolong Menolong (Ta'awun) Tanpa Riba & Gharar</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-gray-700 leading-relaxed">
            <div className="p-3 rounded-md bg-emerald-50/50 border border-emerald-100">
              <p className="font-bold text-emerald-900">1. Akad Tabarru' (Hibah & Kebajikan)</p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Dana kontribusi dari para peserta dialokasikan ke dalam Rekening Kebajikan (Dana Tabarru') untuk saling menanggung musibah di antara sesama peserta.
              </p>
            </div>

            <div className="p-3 rounded-md bg-emerald-50/50 border border-emerald-100">
              <p className="font-bold text-emerald-900">2. Akad Wakalah bil Ujrah & Mudharabah</p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Prudential bertindak sebagai pengelola (Wakil/Mudarib) dan memperoleh ujrah (biaya jasa) atas pengelolaan investasi & risiko secara transparan.
              </p>
            </div>

            <div className="p-3 rounded-md bg-emerald-50/50 border border-emerald-100">
              <p className="font-bold text-emerald-900">3. Pengawasan Dewan Pengawas Syariah (DPS)</p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Setiap polis, alokasi dana investasi, dan skema klaim diawasi secara independen oleh Dewan Pengawas Syariah yang tersertifikasi Majelis Ulama Indonesia (MUI).
              </p>
            </div>
          </div>
        </div>

        {/* Prudential Agent Minimum Production & Standards */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-red-100 text-red-800">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Standar Minimum Performa & Kualifikasi Agency</h2>
              <p className="text-xs text-gray-500">Ketentuan Peraturan Keagenan Prudential 2026</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-gray-700 leading-relaxed">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <p className="font-bold text-gray-900">• Sertifikasi Lisensi AALI / AAJI</p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Setiap Agen Pemasar wajib lulus Ujian Lisensi AAJI (Konvensional) atau AALI (Syariah) sebelum melakukan pemasaran polis secara sah.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <p className="font-bold text-gray-900">• Batas Kualifikasi Active Agent (Agent Maintenance)</p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Agen wajib menghasilkan minimal 3 Kasus / Rp 36.000.000 API per tahun serta menjaga tingkat Persistency Polis di atas 90.0%.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <p className="font-bold text-gray-900">• Persyaratan Promosi Unit Manager (UM)</p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Pencapaian pribadi minimal Rp 300.000.000 API, memiliki minimal 4 Agen Direct Appointed aktif, dan lulus pelatihan Unit Manager Academy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
