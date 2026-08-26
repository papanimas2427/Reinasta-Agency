import React, { useState } from 'react';
import { User } from '../types';
import {
  Sparkles,
  Bot,
  MessageSquare,
  UserPlus,
  Send,
  Copy,
  Check,
  ShieldCheck,
  Lightbulb,
  AlertCircle,
  Brain,
  Zap,
  HelpCircle
} from 'lucide-react';

interface AISalesPitchCoachProps {
  currentUser: User;
}

export const AISalesPitchCoach: React.FC<AISalesPitchCoachProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'objection' | 'recruitment'>('objection');

  // Objection state
  const [selectedObjection, setSelectedObjection] = useState<string>('Sudah punya BPJS');
  const [customObjection, setCustomObjection] = useState<string>('');
  const [productFocus, setProductFocus] = useState<string>('PRU Solusi Sehat Syariah');
  const [clientProfile, setClientProfile] = useState<string>('Kepala Keluarga Usia 35 Tahun (Punya 2 Anak)');

  // Recruitment state
  const [recruitmentScenario, setRecruitmentScenario] = useState<string>(
    'Mengajak teman profesional / karyawan yang ingin bebas waktu & mencari side income'
  );
  const [customRecruitment, setCustomRecruitment] = useState<string>('');
  const [candidateProfile, setCandidateProfile] = useState<string>('Usia 28 Tahun, Latar Belakang Marketing / Admin');

  // Result & Loading State
  const [loading, setLoading] = useState<boolean>(false);
  const [responseMarkdown, setResponseMarkdown] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [usedModel, setUsedModel] = useState<string | null>(null);

  // Common Objections Presets
  const objectionPresets = [
    'Sudah punya BPJS',
    'Premi mahal / Anggaran terbatas',
    'Mau pikir-pikir dulu',
    'Trauma asuransi / Takut klaim susah',
    'Lebih memilih investasi deposito / emas',
    'Suami / Istri tidak setuju'
  ];

  // Common Recruitment Presets
  const recruitmentPresets = [
    'Mengajak teman profesional / karyawan yang ingin bebas waktu & mencari side income',
    'Mengajak Ibu Rumah Tangga / Mompreneur untuk mandiri secara finansial',
    'Mengajak Fresh Graduate & Millennial yang ambisius mencari karir cepat',
    'Mengajak mantan agen asuransi lain / pengusaha UMKM yang terintegrasi'
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);
    setResponseMarkdown(null);
    setIsFallback(false);
    setUsedModel(null);

    const payload = {
      type: activeTab,
      objection: selectedObjection === 'Lainnya' ? customObjection : selectedObjection,
      product: productFocus,
      // Each tab has its own "profile" input; send the one that is visible.
      clientProfile: activeTab === 'recruitment' ? candidateProfile : clientProfile,
      recruitmentScenario: recruitmentScenario === 'Lainnya' ? customRecruitment : recruitmentScenario,
      customPrompt: activeTab === 'objection' ? customObjection : customRecruitment
    };

    try {
      const res = await fetch('/api/sales-pitch-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.text) {
        setResponseMarkdown(data.text);
        setIsFallback(Boolean(data.isFallback));
        setUsedModel(data.model || null);
      } else {
        setErrorMsg('Gagal menerima respons dari server.');
      }
    } catch (err: any) {
      console.error('API Error:', err);
      setErrorMsg('Koneksi terputus. Pastikan server dev berjalan.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!responseMarkdown) return;
    try {
      navigator.clipboard.writeText(responseMarkdown);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = responseMarkdown;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Lightweight Markdown renderer tuned for the server's structured response
  const stripMd = (s: string) => s.replace(/\*\*/g, '').replace(/\*/g, '').replace(/^>\s?/gm, '').trim();

  const renderMarkdown = (md: string) => {
    return md.split('\n\n').map((block, i) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Heading: "### Title"
      if (trimmed.startsWith('###')) {
        return (
          <h3 key={i} className="text-base font-bold text-slate-900 border-b border-slate-200 pb-1 mt-2">
            {stripMd(trimmed.replace(/^#+\s*/, ''))}
          </h3>
        );
      }

      // Blockquote: "> ..." possibly with "> - bullet" lines
      if (trimmed.startsWith('>')) {
        const lines = trimmed.split('\n').map((l) => l.replace(/^\s*>\s?/, ''));
        return (
          <blockquote key={i} className="p-3 bg-white border-l-4 border-[#ED1C24] rounded-r text-slate-800 text-sm font-medium my-2 shadow-xs space-y-1.5">
            {lines.map((line, j) => {
              const isBullet = line.trim().startsWith('- ');
              const text = stripMd(line.trim().replace(/^- /, ''));
              return isBullet ? (
                <div key={j} className="flex items-start gap-2 text-slate-800">
                  <span className="text-[#ED1C24] mt-0.5">•</span>
                  <span className="italic">{text}</span>
                </div>
              ) : (
                <p key={j} className="italic">{text}</p>
              );
            })}
          </blockquote>
        );
      }

      // Bold section label: "**1. Poin Empati ...**"
      if (/^\*\*.*\*\*$/.test(trimmed)) {
        return (
          <p key={i} className="font-bold text-slate-900 text-sm mt-3">
            {stripMd(trimmed)}
          </p>
        );
      }

      // Bullet list
      if (/^[-*] /.test(trimmed)) {
        return (
          <ul key={i} className="list-disc pl-5 space-y-1 text-slate-700 text-sm">
            {trimmed.split('\n').map((line, j) => (
              <li key={j} className="leading-relaxed">{stripMd(line.replace(/^[-*]\s+/, ''))}</li>
            ))}
          </ul>
        );
      }

      return (
        <p key={i} className="text-slate-700 text-sm leading-relaxed">
          {stripMd(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-md bg-red-50 text-[#ED1C24]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                AI Sales Pitch Coach <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-[#ED1C24] font-bold">Gemini AI</span>
              </h1>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Asisten AI cerdas terhubung langsung dengan Gemini untuk membantu Anda menyusun skrip jawaban keberatan nasabah dan kalimat rekrutmen persuasif.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isFallback ? (
            <div className="px-3 py-1.5 rounded-md bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Mode Cadangan (API Key Gemini belum dikonfigurasi)</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{usedModel ? `${usedModel} Aktif` : 'Gemini AI Aktif'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-lg px-4 pt-2">
        <button
          onClick={() => {
            setActiveTab('objection');
            setResponseMarkdown(null);
          }}
          className={`px-5 py-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'objection'
              ? 'border-[#ED1C24] text-[#ED1C24]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Handling Objection (Keberatan Nasabah)
        </button>

        <button
          onClick={() => {
            setActiveTab('recruitment');
            setResponseMarkdown(null);
          }}
          className={`px-5 py-3 text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'recruitment'
              ? 'border-[#ED1C24] text-[#ED1C24]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserPlus className="w-4 h-4" /> Skrip Ajakan Rekrutmen Agent
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-b-lg lg:rounded-lg border border-slate-200 shadow-xs space-y-5">
            
            {activeTab === 'objection' ? (
              <>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                  Pilih Skenario Keberatan
                </h2>

                {/* Objection Presets */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Pernyataan / Alasan Nasabah:</label>
                  <div className="flex flex-wrap gap-2">
                    {objectionPresets.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => {
                          setSelectedObjection(preset);
                          setCustomObjection('');
                        }}
                        className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all cursor-pointer ${
                          selectedObjection === preset
                            ? 'bg-[#ED1C24] text-white border-[#ED1C24] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        "{preset}"
                      </button>
                    ))}
                    <button
                      onClick={() => setSelectedObjection('Lainnya')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all cursor-pointer ${
                        selectedObjection === 'Lainnya'
                          ? 'bg-[#ED1C24] text-white border-[#ED1C24]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      + Keberatan Lainnya
                    </button>
                  </div>
                </div>

                {/* Custom objection text if selected */}
                {selectedObjection === 'Lainnya' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ketikkan Keberatan Spesifik Nasabah:
                    </label>
                    <textarea
                      rows={3}
                      value={customObjection}
                      onChange={(e) => setCustomObjection(e.target.value)}
                      placeholder="Contoh: Saya mau tanya ustadz dulu apakah produk ini halal atau haram..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-[#ED1C24] focus:outline-none"
                    />
                  </div>
                )}

                {/* Product Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Produk Prudential yang Ditawarkan:</label>
                  <select
                    value={productFocus}
                    onChange={(e) => setProductFocus(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm font-medium focus:ring-2 focus:ring-[#ED1C24] focus:outline-none"
                  >
                    <option value="PRU Solusi Sehat Syariah">PRU Solusi Sehat Syariah (Kesehatan VIP Cashless)</option>
                    <option value="PRUCinta Syariah">PRUCinta Syariah (Asuransi Jiwa & Warisan 100% Cash Back)</option>
                    <option value="PRU Total Critical Protection">PRU Total Critical Protection (Penyakit Kritis)</option>
                    <option value="PRU Link NextGen">PRU Link NextGen (Proteksi & Investasi Unit Link)</option>
                  </select>
                </div>

                {/* Client Profile */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Profil Target Nasabah:</label>
                  <input
                    type="text"
                    value={clientProfile}
                    onChange={(e) => setClientProfile(e.target.value)}
                    placeholder="Contoh: Kepala Keluarga 35th, Pemilik Usaha, Anak 2"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm font-medium focus:ring-2 focus:ring-[#ED1C24] focus:outline-none"
                  />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                  Skenario Ajakan Rekrutmen
                </h2>

                {/* Recruitment Presets */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">Pilih Target Skenario Kandidat:</label>
                  <div className="space-y-2">
                    {recruitmentPresets.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => {
                          setRecruitmentScenario(preset);
                          setCustomRecruitment('');
                        }}
                        className={`w-full text-left p-3 rounded text-xs font-semibold border transition-all cursor-pointer ${
                          recruitmentScenario === preset
                            ? 'bg-[#ED1C24] text-white border-[#ED1C24] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                    <button
                      onClick={() => setRecruitmentScenario('Lainnya')}
                      className={`w-full text-left p-2.5 rounded text-xs font-semibold border transition-all cursor-pointer ${
                        recruitmentScenario === 'Lainnya'
                          ? 'bg-[#ED1C24] text-white border-[#ED1C24]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      + Skenario Rekrutmen Lainnya
                    </button>
                  </div>
                </div>

                {/* Custom recruitment scenario */}
                {recruitmentScenario === 'Lainnya' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ketikkan Kebutuhan Skenario Rekrutmen Spesifik:
                    </label>
                    <textarea
                      rows={3}
                      value={customRecruitment}
                      onChange={(e) => setCustomRecruitment(e.target.value)}
                      placeholder="Contoh: Mengajak teman dekat yang baru terkena PHK agar punya semangat bangkit..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-[#ED1C24] focus:outline-none"
                    />
                  </div>
                )}

                {/* Candidate Profile */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Profil Calon Agen (Kandidat):</label>
                  <input
                    type="text"
                    value={candidateProfile}
                    onChange={(e) => setCandidateProfile(e.target.value)}
                    placeholder="Contoh: Karyawan BUMN 30th, Ingin Cari Passive Income"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded text-sm font-medium focus:ring-2 focus:ring-[#ED1C24] focus:outline-none"
                  />
                </div>
              </>
            )}

            {/* Action Submit Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 px-4 bg-[#ED1C24] hover:bg-red-700 text-white font-bold text-sm rounded shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Gemini AI Sedang Menyusun Skrip...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Buat Skrip Rekomendasi Jawaban</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Area (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs min-h-[420px] flex flex-col justify-between space-y-4">
            
            {/* Top Bar inside Output Box */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <Brain className="w-5 h-5 text-[#ED1C24]" />
                <span>Hasil Skrip & Rekomendasi Gemini AI</span>
              </div>

              {responseMarkdown && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Skrip</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Body Output Content */}
            <div className="flex-1">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-[#ED1C24] flex items-center justify-center animate-pulse">
                    <Sparkles className="w-6 h-6 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Sedang Menganalisis Psikologi Nasabah...</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Gemini AI sedang memformulasikan sudut pandang empati dan skrip closing terbaik untuk Anda.
                    </p>
                  </div>
                </div>
              ) : errorMsg ? (
                <div className="p-4 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              ) : responseMarkdown ? (
                <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4 p-4 rounded bg-slate-50/80 border border-slate-200/80">
                  {renderMarkdown(responseMarkdown)}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 space-y-3">
                  <Bot className="w-10 h-10 text-slate-300" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-700">Belum Ada Skrip Tergenerasi</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md">
                      Pilih skenario keberatan atau ajakan rekrutmen di panel sebelah kiri, lalu klik <strong>"Buat Skrip Rekomendasi Jawaban"</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Tip Footer */}
            <div className="p-3 rounded bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Tips Etika Sales Prudential:</strong> Selalu dengarkan keluhan nasabah dengan penuh empati tanpa memotong pembicaraan. Gunakan teknik <em>Feel-Felt-Found</em> agar nasabah merasa dihargai.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
