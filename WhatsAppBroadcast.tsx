import React, { useState } from 'react';
import { User, WhatsAppTemplate, ClosingCase, Recruit } from '../types';
import {
  MessageSquare,
  Send,
  Copy,
  Check,
  Sparkles,
  UserCheck,
  PhoneCall,
  Plus,
  Trash2,
  Cake,
  RefreshCw,
  Clock,
  Heart,
  Calendar,
  X,
  Search,
  Filter,
  Users,
  BellRing,
  Award
} from 'lucide-react';

interface WhatsAppBroadcastProps {
  currentUser: User;
  templates: WhatsAppTemplate[];
  cases: ClosingCase[];
  recruits: Recruit[];
}

export const WhatsAppBroadcast: React.FC<WhatsAppBroadcastProps> = ({
  currentUser,
  templates: initialTemplates,
  cases,
  recruits,
}) => {
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate>(
    initialTemplates[0] || {
      id: 'wa-ultah-1',
      title: '🎂 Ucapan Selamat Ulang Tahun Nasabah (Spesial Doa & Apresiasi)',
      category: 'Greeting & Ultah',
      content: 'Selamat Ulang Tahun yang ke-{USIA} Bapak/Ibu {NAMA_NASABAH}! 🎉'
    }
  );

  // Parameter State
  const [recipientName, setRecipientName] = useState('Bapak Irfan Hakim');
  const [recipientPhone, setRecipientPhone] = useState('08123456789');
  const [productName, setProductName] = useState('PRUCinta Syariah');
  const [clientAge, setClientAge] = useState('38');
  const [dueDate, setDueDate] = useState('15 Agustus 2026');
  const [eventDate, setEventDate] = useState('Rabu, 12 Agustus 2026');
  const [copied, setCopied] = useState(false);

  // Category & Search Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State for Creating Custom Template
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState<WhatsAppTemplate['category']>('Greeting & Ultah');
  const [newTemplateContent, setNewTemplateContent] = useState('');

  // Substitute Placeholders in Template Content
  const compiledMessage = selectedTemplate.content
    .replace(/{NAMA_NASABAH}/g, recipientName)
    .replace(/{NAMA_PROSPEK}/g, recipientName)
    .replace(/{PRODUK_PRUDENTIAL}/g, productName)
    .replace(/{USIA}/g, clientAge)
    .replace(/{NAMA_AGEN}/g, currentUser.name)
    .replace(/{PRU_CODE}/g, currentUser.pruCode || '00123456')
    .replace(/{TELEPON_AGEN}/g, currentUser.phone)
    .replace(/{TANGGAL_JATUH_TEMPO}/g, dueDate)
    .replace(/{TANGGAL_EVENT}/g, eventDate)
    .replace(/{JAM_EVENT}/g, '19:00');

  const formattedPhone = recipientPhone.replace(/[^0-9]/g, '').replace(/^0/, '62');
  const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(compiledMessage)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1-Click Action Handlers
  const handle1ClickBirthday = (clientName?: string, phone?: string, age?: string, product?: string) => {
    const ultahTemplate = templates.find(t => t.category === 'Greeting & Ultah' || t.title.includes('Ulang Tahun')) || templates[0];
    setSelectedTemplate(ultahTemplate);
    if (clientName) setRecipientName(clientName);
    if (phone) setRecipientPhone(phone);
    if (age) setClientAge(age);
    if (product) setProductName(product);
  };

  const handle1ClickFollowUp = (clientName?: string, phone?: string, product?: string) => {
    const followupTemplate = templates.find(t => t.id === 'wa-followup-berkala' || t.category === 'Follow Up Client') || templates[0];
    setSelectedTemplate(followupTemplate);
    if (clientName) setRecipientName(clientName);
    if (phone) setRecipientPhone(phone);
    if (product) setProductName(product);
  };

  const handle1ClickPaymentReminder = (clientName?: string, phone?: string, product?: string) => {
    const reminderTemplate = templates.find(t => t.category === 'Reminder Jatuh Tempo') || templates[0];
    setSelectedTemplate(reminderTemplate);
    if (clientName) setRecipientName(clientName);
    if (phone) setRecipientPhone(phone);
    if (product) setProductName(product);
  };

  const handle1ClickWelcome = (clientName?: string, phone?: string, product?: string) => {
    const welcomeTemplate = templates.find(t => t.id === 'wa-welcome-1') || templates[0];
    setSelectedTemplate(welcomeTemplate);
    if (clientName) setRecipientName(clientName);
    if (phone) setRecipientPhone(phone);
    if (product) setProductName(product);
  };

  // Add Custom Template
  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateTitle.trim() || !newTemplateContent.trim()) return;

    const newTpl: WhatsAppTemplate = {
      id: `custom-wa-${Date.now()}`,
      title: newTemplateTitle.trim(),
      category: newTemplateCategory,
      content: newTemplateContent.trim()
    };

    setTemplates([newTpl, ...templates]);
    setSelectedTemplate(newTpl);
    setIsModalOpen(false);

    // Reset Form
    setNewTemplateTitle('');
    setNewTemplateContent('');
  };

  // Delete Custom Template
  const handleDeleteTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus template pesan ini?')) {
      const updated = templates.filter(t => t.id !== templateId);
      setTemplates(updated);
      if (selectedTemplate.id === templateId && updated.length > 0) {
        setSelectedTemplate(updated[0]);
      }
    }
  };

  // Insert Variable Tag into Custom Template Textarea
  const insertTag = (tag: string) => {
    setNewTemplateContent(prev => prev + ' ' + tag);
  };

  // Filter Templates
  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-6 rounded-2xl shadow-lg text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#25D366] rounded-xl text-white shadow-md">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">
              WhatsApp Outreach & Pembuat Template Pesan Otomatis
            </h1>
          </div>
          <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
            Kirim ucapan ulang tahun nasabah, follow-up berkala, reminder jatuh tempo, dan pesan rekrutmen dalam 1-klik dengan parameter variabel dinamis terformat otomatis.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Template Pesan Baru</span>
        </button>
      </div>

      {/* 1-CLICK QUICK ACTION BANNER FOR AGENTS */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Mode Aksi Cepat 1-Klik (Instant Outreach Agent)
            </h2>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Auto-Format Parameter
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {/* 1-Click Ultah */}
          <button
            onClick={() => handle1ClickBirthday('Bapak Irfan Hakim', '08123456789', '38', 'PRUCinta Syariah')}
            className="p-3 bg-gradient-to-br from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 border border-pink-200 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Cake className="w-5 h-5 text-pink-600 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-black bg-pink-200 text-pink-800 px-1.5 py-0.5 rounded">1-KLIK</span>
            </div>
            <h3 className="text-xs font-bold text-pink-950">Ucapan Ultah</h3>
            <p className="text-[10px] text-pink-700 mt-0.5">Spesial Doa & Apresiasi</p>
          </button>

          {/* 1-Click Follow Up Berkala */}
          <button
            onClick={() => handle1ClickFollowUp('Ibu Susanti Dewi', '08198765432', 'PRUPrime Healthcare')}
            className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <RefreshCw className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-black bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded">1-KLIK</span>
            </div>
            <h3 className="text-xs font-bold text-blue-950">Follow-Up Berkala</h3>
            <p className="text-[10px] text-blue-700 mt-0.5">Evaluasi & Review Polis</p>
          </button>

          {/* 1-Click Reminder Jatuh Tempo */}
          <button
            onClick={() => handle1ClickPaymentReminder('Bapak Dr. Hendra', '08112233445', 'PRULink Syariah')}
            className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border border-amber-200 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <BellRing className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-black bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">1-KLIK</span>
            </div>
            <h3 className="text-xs font-bold text-amber-950">Pengingat Premi</h3>
            <p className="text-[10px] text-amber-700 mt-0.5">Jatuh Tempo Polis</p>
          </button>

          {/* 1-Click Welcome Closing */}
          <button
            onClick={() => handle1ClickWelcome('Bapak Ahmad Yani', '08137788990', 'PRUAnugerah Syariah')}
            className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Award className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-black bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded">1-KLIK</span>
            </div>
            <h3 className="text-xs font-bold text-emerald-950">Welcome Closing</h3>
            <p className="text-[10px] text-emerald-700 mt-0.5">Apresiasi Nasabah Baru</p>
          </button>

          {/* 1-Click BOP Invitation */}
          <button
            onClick={() => {
              const bopTpl = templates.find(t => t.category === 'Undangan BOP Rekrutmen') || templates[0];
              setSelectedTemplate(bopTpl);
            }}
            className="p-3 bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 border border-purple-200 rounded-xl text-left transition-all group cursor-pointer col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Users className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-black bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded">1-KLIK</span>
            </div>
            <h3 className="text-xs font-bold text-purple-950">Undangan BOP</h3>
            <p className="text-[10px] text-purple-700 mt-0.5">Karir Agency Prudential</p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Template Selector & Client Contacts */}
        <div className="lg:col-span-5 space-y-4">
          {/* Template List Box */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Pilih Template Pesan ({filteredTemplates.length})
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-[11px] font-bold text-[#ED1C24] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Baru</span>
              </button>
            </div>

            {/* Filter Categories */}
            <div className="flex items-center space-x-1 overflow-x-auto text-[10px] pb-1 no-scrollbar">
              {['all', 'Greeting & Ultah', 'Follow Up Client', 'Reminder Jatuh Tempo', 'Undangan BOP Rekrutmen', 'Motivasi Tim Agen'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'Semua Template' : cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari template pesan..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 bg-gray-50"
              />
            </div>

            {/* Template Buttons List */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredTemplates.map((tpl) => {
                const isSelected = tpl.id === selectedTemplate.id;
                const isCustom = tpl.id.startsWith('custom-wa-');

                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl)}
                    className={`p-3.5 rounded-xl border text-xs transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-emerald-50/90 border-emerald-500 border-l-4 font-bold text-emerald-950 shadow-xs'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold pr-6">{tpl.title}</span>
                      {isCustom && (
                        <button
                          onClick={(e) => handleDeleteTemplate(tpl.id, e)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors opacity-0 group-hover:opacity-100 absolute top-2 right-2"
                          title="Hapus template kustom"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-black bg-gray-100 text-gray-600 rounded inline-block mb-1.5">
                      {tpl.category}
                    </span>
                    <p className="text-[10px] text-gray-500 font-normal line-clamp-2 leading-relaxed">
                      {tpl.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Recipient Fill from Client Cases */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
            <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Pilih Kontak Nasabah / Prospek</span>
              <span className="text-[10px] text-gray-400">Klik untuk Auto-Fill</span>
            </h2>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              <p className="text-[10px] font-bold text-pink-600 uppercase flex items-center space-x-1">
                <Cake className="w-3 h-3" />
                <span>Nasabah Berulang Tahun Bulan Ini:</span>
              </p>

              {cases.map((c, index) => {
                const mockAge = 30 + index * 4;
                const isUltah = index % 2 === 0;

                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setRecipientName(c.clientName);
                      setRecipientPhone(c.clientPhone);
                      setProductName(c.productName);
                      setClientAge(String(mockAge));

                      if (isUltah) {
                        handle1ClickBirthday(c.clientName, c.clientPhone, String(mockAge), c.productName);
                      } else {
                        handle1ClickFollowUp(c.clientName, c.clientPhone, c.productName);
                      }
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50/80 border border-gray-200 text-xs flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div className="truncate">
                      <div className="flex items-center space-x-1.5">
                        <p className="font-black text-slate-900">{c.clientName}</p>
                        {isUltah && (
                          <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-pink-100 text-pink-700 rounded-full flex items-center space-x-0.5">
                            <Cake className="w-2.5 h-2.5" />
                            <span>Ultah (Usia {mockAge})</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-500 truncate mt-0.5">
                        {c.productName} • {c.clientPhone}
                      </p>
                    </div>
                    <UserCheck className="w-4 h-4 text-emerald-600 shrink-0 ml-2 group-hover:scale-110 transition-transform" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Parameter Inputs & Compiled Live Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-sm font-black text-slate-900">Parameter Kustomisasi Pesan</h2>
                <p className="text-[11px] text-gray-500">Ubah variabel untuk memperbarui pratinjau pesan WhatsApp secara real-time.</p>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-black bg-emerald-100 text-emerald-800 rounded-lg">
                {selectedTemplate.category}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Nasabah / Prospek</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nomor WhatsApp (62/08...)</label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Produk Prudential</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Usia Nasabah (Tahun)</label>
                <input
                  type="text"
                  value={clientAge}
                  onChange={(e) => setClientAge(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium bg-gray-50"
                  placeholder="38"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal Jatuh Tempo / Review</label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal Event BOP / Zoom</label>
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium bg-gray-50"
                />
              </div>
            </div>

            {/* Compiled Live WhatsApp Preview Box */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-slate-800 flex items-center space-x-1.5">
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>Pratinjau Pesan Terkompilasi (Siap Kirim WA)</span>
                </label>
                <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Agen: {currentUser.name} ({currentUser.pruCode || '00123456'})
                </span>
              </div>

              {/* WhatsApp UI Simulation Box */}
              <div className="p-4 rounded-2xl bg-[#E5DDD5] border border-emerald-300 shadow-inner relative font-sans text-xs text-slate-900 leading-relaxed">
                <div className="bg-white p-3.5 rounded-xl shadow-sm border border-emerald-100 whitespace-pre-wrap font-sans text-slate-800">
                  {compiledMessage}
                </div>
                <div className="text-[10px] text-gray-500 text-right mt-1.5 font-bold flex items-center justify-end space-x-1">
                  <span>Siap dikirim ke {formattedPhone}</span>
                  <Check className="w-3 h-3 text-emerald-600 inline" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={handleCopy}
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer border border-gray-200"
              >
                {copied ? <Check className="w-4 h-4 text-[#25D366]" /> : <Copy className="w-4 h-4 text-gray-600" />}
                <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Pesan WA'}</span>
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black rounded-xl flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Buka WhatsApp & Kirim Sekarang</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE CUSTOM TEMPLATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-100 rounded-lg text-[#ED1C24]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Buat Template Pesan WhatsApp Kustom</h3>
                  <p className="text-[11px] text-gray-500">Gunakan tag variabel agar otomatis terisi saat memilih nasabah.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-slate-900 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Judul Template</label>
                <input
                  type="text"
                  required
                  value={newTemplateTitle}
                  onChange={(e) => setNewTemplateTitle(e.target.value)}
                  placeholder="Contoh: Ucapan Selamat Ulang Tahun Spesial Syariah"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kategori Template</label>
                <select
                  value={newTemplateCategory}
                  onChange={(e) => setNewTemplateCategory(e.target.value as WhatsAppTemplate['category'])}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                >
                  <option value="Greeting & Ultah">Greeting & Ultah</option>
                  <option value="Follow Up Client">Follow Up Client</option>
                  <option value="Reminder Jatuh Tempo">Reminder Jatuh Tempo</option>
                  <option value="Undangan BOP Rekrutmen">Undangan BOP Rekrutmen</option>
                  <option value="Motivasi Tim Agen">Motivasi Tim Agen</option>
                </select>
              </div>

              {/* Tag Quick Buttons */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Klik Tag Variabel di bawah untuk disisipkan ke isi pesan:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '{NAMA_NASABAH}',
                    '{USIA}',
                    '{PRODUK_PRUDENTIAL}',
                    '{TANGGAL_JATUH_TEMPO}',
                    '{NAMA_AGEN}',
                    '{TELEPON_AGEN}',
                    '{PRU_CODE}'
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => insertTag(tag)}
                      className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded-lg border border-emerald-200 cursor-pointer transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Isi Pesan Template</label>
                <textarea
                  required
                  rows={6}
                  value={newTemplateContent}
                  onChange={(e) => setNewTemplateContent(e.target.value)}
                  placeholder="Ketik isi pesan template di sini..."
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-sans leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Template</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
