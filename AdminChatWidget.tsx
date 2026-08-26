import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage, AdminChatThread, FAQItem } from '../types';
import {
  MessageSquare,
  X,
  Send,
  HelpCircle,
  Bell,
  CheckCheck,
  Search,
  ChevronRight,
  UserCheck,
  Sparkles,
  Paperclip,
  Shield,
  PhoneCall,
  Info,
  ChevronDown,
  Clock,
  ThumbsUp,
  MessageCircle,
  AlertCircle
} from 'lucide-react';

interface AdminChatWidgetProps {
  currentUser: User;
  allUsers: User[];
}

// Initial FAQ Questions for Insurance Agents
const initialFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Bagaimana prosedur submit SPAJ & upload dokumen pendukung?',
    category: 'Operational SPAJ',
    answer: 'Pengajuan SPAJ dilakukan via aplikasi PRUForce/e-SPAJ. Pastikan dokumen KTP, NPWP, Ringkasan Produk, dan Form Kesehatan telah diisi lengkap serta ditandatangani secara digital oleh Calon Pemegang Polis sebelum jam cut-off 17:00 WIB.',
    tags: ['SPAJ', 'e-SPAJ', 'Submit Polis']
  },
  {
    id: 'faq-2',
    question: 'Kapan jadwal cut-off produksi API & pembayaran komisi bulanan?',
    category: 'Keuangan & Komisi',
    answer: 'Cut-off produksi bulanan jatuh pada hari kerja terakhir setiap bulan pukul 17:00 WIB. Pembayaran Komisi Agen cair 2 kali dalam sebulan pada setiap tanggal 10 dan 25 via transfer bank terdaftar.',
    tags: ['Cut-off', 'Komisi', 'API']
  },
  {
    id: 'faq-3',
    question: 'Apa syarat kualifikasi Kontes Agensi (Star Club & Trip)?',
    category: 'Kontes & Incentive',
    answer: 'Kualifikasi kontes dihitung berdasarkan akumulasi minimal API (contoh Rp 100.000.000), minimum 3-4 Case Issued, dan Persistency Rate (K3) minimal 85% selama periode kontes. Detail lengkap dapat dicek di menu "Kontes Agensi".',
    tags: ['Kontes', 'Star Club', 'Trip']
  },
  {
    id: 'faq-4',
    question: 'Bagaimana cara perhitungan Persistency Rate (K3) Polis?',
    category: 'Kualitas Bisnis',
    answer: 'Persistency Rate (K3) dihitung dari persentase polis yang tetap aktif membayar premi (in-force) pada bulan ke-13 hingga ke-24. Pastikan melakukan follow-up rutin agar rasio kelangsungan polis agen tetap di atas 85%.',
    tags: ['Persistency', 'K3', 'In-Force']
  },
  {
    id: 'faq-5',
    question: 'Prosedur pengajuan klaim kesehatan PRUMedical Network (PMN)?',
    category: 'Klaim & Layanan',
    answer: 'Untuk klaim cashless PMN di Rumah Sakit Rekanan, nasabah cukup menunjukkan e-Card PRUForce & KTP di RS. Jika reimbursement, kumpulkan resume medis dan kuitansi asli lalu submit via e-Claim PRUForce maksimal 30 hari pasca perawatan.',
    tags: ['Klaim', 'PMN', 'Cashless']
  },
  {
    id: 'faq-6',
    question: 'Bagaimana ketentuan komisi Overriding bagi Unit Manager?',
    category: 'Keuangan & Komisi',
    answer: 'Overriding (OR) Unit Manager dihitung dari total produksi direct agent di bawah unit-nya, dengan syarat Unit mencapai minimal 75% dari target produksi unit bulanan yang ditetapkan.',
    tags: ['Overriding', 'Unit Manager', 'Bonus']
  }
];

// Mock initial chat history
const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'usr-4',
    senderName: 'Rian Hidayat',
    senderRole: 'agent',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    recipientId: 'usr-1',
    recipientName: 'Admin Agensi (Budi Santoso)',
    message: 'Halo Pak Admin, mau menanyakan status kelengkapan dokumen SPAJ nasabah Bpk. Ahmad (Syariah Critical Illness). Apakah sudah di-approve pusat?',
    timestamp: '10:15 WIB',
    isRead: true,
    category: 'spaj_approval'
  },
  {
    id: 'msg-2',
    senderId: 'usr-1',
    senderName: 'Budi Santoso, CFP (Admin Owner)',
    senderRole: 'owner',
    senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    recipientId: 'usr-4',
    recipientName: 'Rian Hidayat',
    message: 'Selamat pagi Mas Rian, SPAJ Bpk. Ahmad sudah verified Underwriting pusat. Estimasi polis issued sore ini pukul 16.00 WIB ya.',
    timestamp: '10:20 WIB',
    isRead: true,
    category: 'spaj_approval'
  },
  {
    id: 'msg-3',
    senderId: 'usr-5',
    senderName: 'Maya Putri',
    senderRole: 'agent',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    recipientId: 'usr-1',
    recipientName: 'Admin Agensi (Budi Santoso)',
    message: 'Pak Admin, mohon bantuan cek perhitungan poin Kontes Singapore Trip saya bulan ini.',
    timestamp: '11:05 WIB',
    isRead: false,
    category: 'contest'
  }
];

export const AdminChatWidget: React.FC<AdminChatWidgetProps> = ({
  currentUser,
  allUsers
}) => {
  const isAdmin = currentUser.role === 'owner' || currentUser.role === 'unit_manager';

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'faq' | 'threads'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('usr-4'); // Default agent thread for admin
  const [pushNotification, setPushNotification] = useState<{
    show: boolean;
    senderName: string;
    message: string;
    timestamp: string;
    agentId: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom when message updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isOpen, activeTab, selectedAgentId]);

  // Handle Push Notification timer auto dismissal
  useEffect(() => {
    if (pushNotification?.show) {
      const timer = setTimeout(() => {
        setPushNotification(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [pushNotification]);

  // Compute unread count for current user
  const unreadCount = messages.filter(
    (m) => m.recipientId === currentUser.id && !m.isRead
  ).length;

  // Filter messages for agent view vs admin thread view
  const conversationMessages = messages.filter((m) => {
    if (isAdmin) {
      // In Admin mode, show conversation with selected agent
      return (
        (m.senderId === selectedAgentId && (m.recipientId === currentUser.id || m.recipientId === 'usr-1')) ||
        (m.senderId === currentUser.id && m.recipientId === selectedAgentId) ||
        (m.senderId === 'usr-1' && m.recipientId === selectedAgentId)
      );
    } else {
      // In Agent mode, show conversation between current agent and admin
      return m.senderId === currentUser.id || m.recipientId === currentUser.id;
    }
  });

  // Extract thread list for Admin view
  const agentThreads: AdminChatThread[] = allUsers
    .filter((u) => u.role === 'agent')
    .map((agent) => {
      const agentMsgs = messages.filter(
        (m) => m.senderId === agent.id || m.recipientId === agent.id
      );
      const lastMsg = agentMsgs[agentMsgs.length - 1];
      const unread = agentMsgs.filter(
        (m) => m.recipientId === currentUser.id && m.senderId === agent.id && !m.isRead
      ).length;

      return {
        agentId: agent.id,
        agentName: agent.name,
        agentAvatar: agent.avatar,
        agentPruCode: agent.pruCode,
        unitName: agent.unitName,
        unreadCount: unread,
        lastMessage: lastMsg ? lastMsg.message : 'Belum ada pesan',
        lastTimestamp: lastMsg ? lastMsg.timestamp : '-'
      };
    });

  // Filter FAQs based on search & category
  const filteredFAQs = initialFAQs.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.tags?.some((t) => t.toLowerCase().includes(faqSearch.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(initialFAQs.map((f) => f.category)));

  // Send a new message
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB';

    const recipientId = isAdmin ? selectedAgentId : 'usr-1'; // Default to admin Budi Santoso
    const recipientUser = allUsers.find((u) => u.id === recipientId);

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      recipientId: recipientId,
      recipientName: recipientUser ? recipientUser.name : 'Admin Agensi',
      message: text.trim(),
      timestamp: timeStr,
      isRead: false,
      category: 'general'
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // If sent by an Agent, trigger Push Notification for Admin!
    if (!isAdmin) {
      setPushNotification({
        show: true,
        senderName: currentUser.name,
        message: text.trim(),
        timestamp: timeStr,
        agentId: currentUser.id
      });

      // Simulate automated Admin bot response after 1.5 seconds if admin hasn't replied
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          senderId: 'usr-1',
          senderName: 'Admin Agensi Prudential (Auto-Response)',
          senderRole: 'owner',
          senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
          recipientId: currentUser.id,
          recipientName: currentUser.name,
          message: `Terima kasih ${currentUser.name.split(' ')[0]}, pesan Anda telah diterima Tim Admin Agensi Reinasta. Admin/Unit Manager kami akan segera memberikan respon lanjutan.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          isRead: true,
          category: 'general'
        };
        setMessages((prev) => [...prev, autoReply]);
      }, 1500);
    }
  };

  // Click an FAQ item to ask Admin or insert into chat
  const handleAskFAQ = (faq: FAQItem) => {
    const questionText = `[Tanya FAQ] ${faq.question}`;
    setActiveTab('chat');
    handleSendMessage(questionText);

    // Provide the immediate official answer back into the chat
    setTimeout(() => {
      const answerMsg: ChatMessage = {
        id: `faq-reply-${Date.now()}`,
        senderId: 'usr-1',
        senderName: 'Admin Agensi (Jawaban Resmi FAQ)',
        senderRole: 'owner',
        senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        recipientId: currentUser.id,
        recipientName: currentUser.name,
        message: `📌 ${faq.answer}`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        isRead: true,
        category: 'faq_inquiry'
      };
      setMessages((prev) => [...prev, answerMsg]);
    }, 800);
  };

  // Mark messages as read when drawer opens or thread changes
  const handleMarkThreadAsRead = (agentId: string) => {
    setSelectedAgentId(agentId);
    setMessages((prev) =>
      prev.map((m) =>
        m.senderId === agentId && m.recipientId === currentUser.id
          ? { ...m, isRead: true }
          : m
      )
    );
  };

  return (
    <>
      {/* 1. FLOATING PUSH NOTIFICATION POPUP FOR ADMIN (Top-Right) */}
      {isAdmin && pushNotification && pushNotification.show && (
        <div className="fixed top-20 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-xl shadow-2xl border border-amber-400 p-4 transition-all transform animate-bounce-short">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-red-600 rounded-full text-white animate-pulse">
                <Bell className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block">
                  PUSH NOTIFIKASI CHAT AGEN BARU
                </span>
                <h4 className="text-xs font-black text-white">{pushNotification.senderName}</h4>
              </div>
            </div>
            <button
              onClick={() => setPushNotification(null)}
              className="text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-200 mt-2 line-clamp-2 italic bg-slate-800 p-2 rounded border border-slate-700">
            "{pushNotification.message}"
          </p>

          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-gray-400 text-[10px]">{pushNotification.timestamp}</span>
            <button
              onClick={() => {
                handleMarkThreadAsRead(pushNotification.agentId);
                setIsOpen(true);
                setActiveTab('chat');
                setPushNotification(null);
              }}
              className="px-3 py-1 bg-[#ED1C24] hover:bg-red-700 text-white font-extrabold text-[11px] rounded transition-all flex items-center space-x-1 cursor-pointer"
            >
              <span>Buka & Balas Chat</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. FLOATING HOVER ICON BUTTON (BOTTOM RIGHT ON ALL PAGES) */}
      <div className="fixed bottom-6 right-6 z-40 group">
        {/* Hover Tooltip Badge */}
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:flex items-center space-x-1.5 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-slate-700 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Chat Admin & Pusat FAQ Agensi</span>
        </div>

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen && isAdmin && activeTab === 'threads') {
              handleMarkThreadAsRead(selectedAgentId);
            }
          }}
          className="relative w-14 h-14 bg-gradient-to-r from-[#ED1C24] to-rose-700 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/40 cursor-pointer"
          aria-label="Chat Admin"
        >
          {isOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <>
              <MessageSquare className="w-7 h-7" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 text-slate-950 font-black text-xs rounded-full flex items-center justify-center shadow-md animate-pulse border border-slate-950">
                  {unreadCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* 3. CHAT & FAQ DRAWER MODAL */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header Bar */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-sm border-2 border-white/30">
                  <Shield className="w-5 h-5 text-amber-300" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-sm font-black text-white tracking-tight">
                    {isAdmin ? 'Admin Agensi Dashboard Chat' : 'Chat Admin Agensi'}
                  </h3>
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-amber-400 text-slate-950 rounded uppercase">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-gray-300">
                  {isAdmin
                    ? `Mode Admin (${currentUser.name})`
                    : 'Pusat Bantuan, SPAJ & Layanan Komisi Agen'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs Header */}
          <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-600">
            {isAdmin && (
              <button
                onClick={() => setActiveTab('threads')}
                className={`flex-1 py-2.5 text-center flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                  activeTab === 'threads'
                    ? 'border-b-2 border-[#ED1C24] text-[#ED1C24] bg-white font-black'
                    : 'hover:text-gray-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Thread Agen ({agentThreads.length})</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 text-center flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                activeTab === 'chat'
                  ? 'border-b-2 border-[#ED1C24] text-[#ED1C24] bg-white font-black'
                  : 'hover:text-gray-900'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Ruang Pesan' : 'Percakapan Admin'}</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 py-2.5 text-center flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                activeTab === 'faq'
                  ? 'border-b-2 border-[#ED1C24] text-[#ED1C24] bg-white font-black'
                  : 'hover:text-gray-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Info FAQ</span>
            </button>
          </div>

          {/* TAB 1: THREAD LIST (For Admin User) */}
          {activeTab === 'threads' && isAdmin && (
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                Daftar Chat Masuk dari Agen
              </div>
              {agentThreads.map((thread) => (
                <div
                  key={thread.agentId}
                  onClick={() => {
                    handleMarkThreadAsRead(thread.agentId);
                    setActiveTab('chat');
                  }}
                  className={`p-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                    selectedAgentId === thread.agentId
                      ? 'bg-red-50 border border-red-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <img
                      src={thread.agentAvatar}
                      alt={thread.agentName}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-xs text-gray-900">
                          {thread.agentName}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          ({thread.agentPruCode})
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {thread.lastMessage}
                      </p>
                      <span className="text-[9px] text-gray-400 block mt-0.5">
                        {thread.unitName}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 ml-2 space-y-1">
                    <span className="text-[10px] text-gray-400">{thread.lastTimestamp}</span>
                    {thread.unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-red-600 text-white font-extrabold text-[10px] rounded-full animate-pulse">
                        {thread.unreadCount} baru
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: CHAT CONVERSATION */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
              {/* Active Recipient Bar */}
              <div className="px-4 py-2 bg-white border-b border-gray-200 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-gray-800">
                    {isAdmin
                      ? `Chatting dengan: ${
                          allUsers.find((u) => u.id === selectedAgentId)?.name || 'Agen'
                        }`
                      : 'Admin Agensi Prudential Reinasta'}
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('faq')}
                  className="text-[10px] font-extrabold text-[#ED1C24] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Lihat FAQ</span>
                </button>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {conversationMessages.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs space-y-2">
                    <MessageCircle className="w-8 h-8 text-gray-300 mx-auto" />
                    <p>Belum ada riwayat pesan.</p>
                    <p className="text-[10px]">Ketik pesan atau pilih FAQ di bawah untuk memulai!</p>
                  </div>
                ) : (
                  conversationMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className="text-[10px] font-bold text-gray-500">
                            {msg.senderName}
                          </span>
                          <span className="text-[9px] text-gray-400">{msg.timestamp}</span>
                        </div>

                        <div
                          className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                            isMe
                              ? 'bg-[#ED1C24] text-white rounded-tr-none font-medium'
                              : 'bg-white text-slate-800 rounded-tl-none border border-gray-200 font-medium'
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick FAQ Suggestion Pill */}
              <div className="px-3 py-1.5 bg-white border-t border-gray-100 flex items-center space-x-2 overflow-x-auto text-[10px] no-scrollbar">
                <span className="font-extrabold text-gray-400 uppercase shrink-0">FAQ Cepat:</span>
                {initialFAQs.slice(0, 3).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleAskFAQ(f)}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-full whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {f.question.substring(0, 26)}...
                  </button>
                ))}
              </div>

              {/* Input Footer */}
              <div className="p-3 bg-white border-t border-gray-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      isAdmin
                        ? 'Ketik balasan resmi admin...'
                        : 'Tanyakan ke Admin Agensi...'
                    }
                    className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#ED1C24] bg-gray-50"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="p-2 bg-[#ED1C24] hover:bg-red-700 disabled:opacity-40 text-white rounded-lg transition-all shadow-sm cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: FAQ INFO SECTION */}
          {activeTab === 'faq' && (
            <div className="flex-1 flex flex-col bg-white overflow-hidden p-4 space-y-3">
              <div className="space-y-1">
                <h4 className="text-xs font-black text-[#2D3436] uppercase tracking-wider flex items-center space-x-1.5">
                  <HelpCircle className="w-4 h-4 text-[#ED1C24]" />
                  <span>Pusat Informasi & FAQ Sering Ditanyakan</span>
                </h4>
                <p className="text-[11px] text-gray-500">
                  Klik pertanyaan untuk langsung menanyakan ke Admin atau membaca solusi resmi.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Cari FAQ (SPAJ, Komisi, Cut-off, Kontes)..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#ED1C24] bg-gray-50"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-1 overflow-x-auto text-[10px] pb-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Semua ({initialFAQs.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* FAQ Accordion List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    Tidak ditemukan FAQ yang sesuai kata kunci.
                  </div>
                ) : (
                  filteredFAQs.map((faq) => (
                    <div
                      key={faq.id}
                      className="p-3 bg-gray-50 hover:bg-red-50/50 rounded-xl border border-gray-200 space-y-2 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-extrabold text-xs text-slate-900">
                          {faq.question}
                        </span>
                        <span className="px-2 py-0.5 text-[9px] font-black bg-red-100 text-[#ED1C24] rounded shrink-0">
                          {faq.category}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-600 leading-relaxed bg-white p-2.5 rounded-lg border border-gray-100">
                        {faq.answer}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center space-x-1">
                          {faq.tags?.map((t) => (
                            <span key={t} className="text-[9px] text-gray-400">
                              #{t}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => handleAskFAQ(faq)}
                          className="px-2.5 py-1 bg-[#ED1C24] hover:bg-red-700 text-white text-[10px] font-bold rounded flex items-center space-x-1 cursor-pointer transition-all shadow-2xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>Kirim ke Chat Admin</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
