import React, { useState } from 'react';
import { User, MeetingSchedule } from '../types';
import { Video, Calendar, Clock, Users, Plus, ExternalLink, PlayCircle, CheckCircle, Sparkles } from 'lucide-react';

interface OnlineMeetingProps {
  currentUser: User;
  meetings: MeetingSchedule[];
  onAddMeeting: (meeting: Omit<MeetingSchedule, 'id' | 'attendeesCount'>) => void;
}

export const OnlineMeeting: React.FC<OnlineMeetingProps> = ({
  currentUser,
  meetings,
  onAddMeeting,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  // Form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MeetingSchedule['type']>('Morning Briefing');
  const [dateTime, setDateTime] = useState('');
  const [linkUrl, setLinkUrl] = useState('https://meet.google.com/rns-agency-room');
  const [meetingPlatform, setMeetingPlatform] = useState<MeetingSchedule['meetingPlatform']>('Google Meet');
  const [targetAudience, setTargetAudience] = useState<MeetingSchedule['targetAudience']>('Semua Agen');
  const [description, setDescription] = useState('');

  const meetingTypes = ['Morning Briefing', 'Weekly Unit Meeting', 'BOP (Business Opportunity)', 'Product Clinic', 'Coaching'];

  const filteredMeetings = meetings.filter((m) => filterType === 'all' || m.type === filterType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMeeting({
      title,
      type,
      dateTime: dateTime || new Date().toISOString().slice(0, 16),
      hostName: currentUser.name,
      unitName: currentUser.unitName,
      linkUrl,
      meetingPlatform,
      targetAudience,
      description,
      isLive: false,
    });

    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  const canCreate = currentUser.role === 'owner' || currentUser.role === 'secretary' || currentUser.role === 'unit_manager';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-md border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Video className="w-6 h-6 text-[#ED1C24]" />
            <h1 className="text-xl font-bold text-[#2D3436]">Virtual Meeting & BOP Hub Agency</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Jadwal Morning Briefing, BOP Rekrutmen, Product Clinic, dan Sesi Mentoring Online Reinasta Agency.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center px-4 py-2 bg-[#ED1C24] hover:bg-red-700 text-white rounded-md text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Jadwalkan Meeting Baru
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-md text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-[#ED1C24] text-white shadow-xs'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Semua Agenda
        </button>
        {meetingTypes.map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-4 py-2 rounded-md text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              filterType === t
                ? 'bg-[#ED1C24] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Meeting Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeetings.map((m) => (
          <div
            key={m.id}
            className={`bg-white rounded-md border p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
              m.isLive ? 'border-[#ED1C24] border-l-4' : 'border-gray-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-sm text-[10px] font-bold bg-red-50 text-[#ED1C24] border border-red-100">
                  {m.type}
                </span>
                {m.isLive ? (
                  <span className="px-2.5 py-0.5 rounded-sm bg-[#ED1C24] text-white text-[10px] font-extrabold animate-pulse">
                    • SEDANG BERLANGSUNG
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(m.dateTime).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-[#2D3436] leading-snug line-clamp-2">{m.title}</h3>
              <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">{m.description}</p>

              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1 text-[11px] text-gray-500">
                <p>Host: <strong className="text-gray-800">{m.hostName}</strong></p>
                <p>Platform: <span className="font-semibold text-[#2D8CFF]">{m.meetingPlatform}</span></p>
                <p>Target Peserta: <span className="font-semibold text-purple-700">{m.targetAudience}</span></p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <a
                href={m.linkUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-md bg-[#2D8CFF] hover:bg-[#1a7ae6] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Masuk Ruangan Virtual</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Meeting Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Buat Jadwal Meeting / BOP Online Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Judul Agenda Meeting</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: BOP Syariah Sektor Pebisnis & Profesional"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tipe Meeting</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
                  >
                    {meetingTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal & Waktu</label>
                  <input
                    type="datetime-local"
                    required
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Platform</label>
                  <select
                    value={meetingPlatform}
                    onChange={(e) => setMeetingPlatform(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Prudential Virtual Room">Prudential Virtual Room</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Peserta</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-medium"
                  >
                    <option value="Semua Agen">Semua Agen</option>
                    <option value="Unit Manager">Unit Manager</option>
                    <option value="Agen Baru">Agen Baru</option>
                    <option value="Publik Prospek">Publik Prospek (BOP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Link URL Meeting (Zoom / Meet)</label>
                <input
                  type="url"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Ringkas Agenda</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Informasi topik pembahasan, pembicara khusus..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
