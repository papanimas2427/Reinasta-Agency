import React, { useState } from 'react';
import { User, TrainingModule } from '../types';
import { BookOpen, Download, Eye, Plus, CheckCircle, Clock, FileText, Sparkles, Filter, X, AlertCircle } from 'lucide-react';

interface TrainingHubProps {
  currentUser: User;
  modules: TrainingModule[];
  onAddModule: (module: Omit<TrainingModule, 'id' | 'completedByAgentIds'>) => void;
  onToggleCompleteModule: (moduleId: string) => void;
}

export const TrainingHub: React.FC<TrainingHubProps> = ({
  currentUser,
  modules,
  onAddModule,
  onToggleCompleteModule,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewModule, setPreviewModule] = useState<TrainingModule | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TrainingModule['category']>('PruFastStart');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState(currentUser.name);
  const [duration, setDuration] = useState(30);

  const categories = ['PruFastStart', 'Syariah Academy', 'Product Knowledge', 'Handling Objection', 'Unit Manager Development'];

  const filteredModules = modules.filter((m) => {
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    // Filter target roles
    if (m.targetRole !== 'all' && Array.isArray(m.targetRole)) {
      if (!m.targetRole.includes(currentUser.role)) return false;
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddModule({
      title,
      category,
      description,
      author,
      format: 'PDF',
      fileSize: '3.8 MB',
      durationMinutes: Number(duration),
      downloadUrl: `#download-${title.toLowerCase().replace(/\s+/g, '-')}`,
      isMandatory: true,
      targetRole: 'all',
      uploadDate: new Date().toISOString().slice(0, 10),
    });

    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  const handleDownload = (mod: TrainingModule) => {
    // Generate a downloadable text/pdf placeholder simulation
    const content = `MATERI TRAINING REINASTA AGENCY - PRUDENTIAL\nTitle: ${mod.title}\nCategory: ${mod.category}\nAuthor: ${mod.author}\n\nDeskripsi:\n${mod.description}\n\n© 2026 Reinasta Agency All Rights Reserved.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mod.title.replace(/[^a-zA-Z0-9]/g, '_')}_Reinasta_Modul.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const canUpload = currentUser.role === 'owner' || currentUser.role === 'secretary' || currentUser.role === 'unit_manager';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Pusat Materi & Modul Training Agency</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Modul pelatihan resmi Prudential, materi Syariah Academy, dan materi penanganan keberatan prospek (handling objection).
          </p>
        </div>

        {canUpload && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-200 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Upload Modul Training
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Semua Modul
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((mod) => {
          const isCompleted = mod.completedByAgentIds.includes(currentUser.id);
          const daysDiff = Math.max(0, Math.floor((new Date().getTime() - new Date(mod.uploadDate).getTime()) / (1000 * 60 * 60 * 24)));
          const isUrgent = !isCompleted && daysDiff >= 7;

          return (
            <div
              key={mod.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                isUrgent ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-100">
                    {mod.category}
                  </span>
                  {isCompleted ? (
                    <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Selesai
                    </span>
                  ) : isUrgent ? (
                    <span className="flex items-center text-[10px] font-extrabold text-white bg-red-600 px-2 py-0.5 rounded-md shadow-xs animate-pulse uppercase tracking-wider">
                      <AlertCircle className="w-3.5 h-3.5 mr-1 text-white" /> Urgent (&gt;7 Hari)
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      Wajib
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">{mod.title}</h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">{mod.description}</p>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {mod.durationMinutes} menit</span>
                  <span>{mod.format} • {mod.fileSize}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2">
                <button
                  onClick={() => setPreviewModule(mod)}
                  className="flex-1 py-2 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-bold border border-gray-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-4 h-4 text-gray-500" /> View Online
                </button>
                <button
                  onClick={() => handleDownload(mod)}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Online Viewer Modal */}
      {previewModule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setPreviewModule(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {previewModule.category}
            </span>

            <h2 className="text-xl font-extrabold text-gray-900 mt-3">{previewModule.title}</h2>
            <p className="text-xs text-gray-500 mt-1">Oleh: {previewModule.author} • Diupload: {previewModule.uploadDate}</p>

            <div className="mt-6 p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4 text-xs text-gray-700 leading-relaxed">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                <span className="font-bold text-blue-900">Status Pembelajaran Anda:</span>
                <button
                  onClick={() => onToggleCompleteModule(previewModule.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    previewModule.completedByAgentIds.includes(currentUser.id)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {previewModule.completedByAgentIds.includes(currentUser.id)
                    ? '✓ Sudah Selesai'
                    : 'Tandai Selesai Dibaca'}
                </button>
              </div>

              <h4 className="font-bold text-gray-900 text-sm">Ringkasan Materi Training:</h4>
              <p>{previewModule.description}</p>

              <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-2">
                <p className="font-bold text-gray-900">Poin Kunci Produk & Prinsip Prudential:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Pahami betul profil risiko nasabah sebelum merekomendasikan produk unit link/tradisional.</li>
                  <li>Untuk Syariah, jelaskan konsep Tolong-Menolong (Ta'awun) dan Dana Tabarru'.</li>
                  <li>Disiplin pendaftaran e-SPAJ melalui PRUForce untuk mempercepat proses penerbitan polis (underwriting).</li>
                  <li>Selalu sertakan form fakta material & riwayat medis nasabah secara terpercaya.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => handleDownload(previewModule)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-blue-200"
              >
                <Download className="w-4 h-4" /> Download File Materi PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload New Training Material Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Modul / Materi Training</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Judul Materi Training</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modul PRUCinta Syariah Masterclass"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kategori Training</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Estimasi Durasi (Menit)</label>
                <input
                  type="number"
                  required
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Ringkas</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Isi ringkasan modul..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-200"
                >
                  Publikasikan Modul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
