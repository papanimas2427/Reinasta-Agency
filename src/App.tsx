import React, { useState, useEffect, lazy, Suspense } from 'react';
import { User, ClosingCase, Recruit, TrainingModule, PerformanceRecord, MeetingSchedule, FinanceRecord, WhatsAppTemplate, Contest, CaseStage, RecruitStage } from './types';
import {
  initialUsers,
  insuranceProducts,
  initialCases,
  initialRecruits,
  initialModules,
  initialPerformance,
  initialMeetings,
  initialFinance,
  initialWhatsAppTemplates,
  initialContests
} from './data/mockData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { LoginModal } from './components/LoginModal';
import { AdminChatWidget } from './components/AdminChatWidget';
import { ErrorBoundary } from './components/ErrorBoundary';

// Heavy feature modules are lazy-loaded on demand (code splitting).
// Faster first paint + smaller initial bundle for production.
const Dashboard = lazy(() => import('./components/Dashboard').then((m) => ({ default: m.Dashboard })));
const Recruitment = lazy(() => import('./components/Recruitment').then((m) => ({ default: m.Recruitment })));
const TrainingHub = lazy(() => import('./components/TrainingHub').then((m) => ({ default: m.TrainingHub })));
const PerformanceEvaluation = lazy(() => import('./components/PerformanceEvaluation').then((m) => ({ default: m.PerformanceEvaluation })));
const ClosingProgress = lazy(() => import('./components/ClosingProgress').then((m) => ({ default: m.ClosingProgress })));
const AgencyFinance = lazy(() => import('./components/AgencyFinance').then((m) => ({ default: m.AgencyFinance })));
const OnlineMeeting = lazy(() => import('./components/OnlineMeeting').then((m) => ({ default: m.OnlineMeeting })));
const WhatsAppBroadcast = lazy(() => import('./components/WhatsAppBroadcast').then((m) => ({ default: m.WhatsAppBroadcast })));
const PrudentialRules = lazy(() => import('./components/PrudentialRules').then((m) => ({ default: m.PrudentialRules })));
const CommissionCalculatorMDRT = lazy(() => import('./components/CommissionCalculatorMDRT').then((m) => ({ default: m.CommissionCalculatorMDRT })));
const AISalesPitchCoach = lazy(() => import('./components/AISalesPitchCoach').then((m) => ({ default: m.AISalesPitchCoach })));
const AgentDirectory = lazy(() => import('./components/AgentDirectory').then((m) => ({ default: m.AgentDirectory })));
const ContestManager = lazy(() => import('./components/ContestManager').then((m) => ({ default: m.ContestManager })));

// Simple loading placeholder while a module chunk is fetched
const ModuleLoader = () => (
  <div className="p-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
    <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-[#ED1C24] animate-spin" />
    <p className="text-xs font-semibold">Memuat modul...</p>
  </div>
);

// Safely load persisted data from localStorage (never crashes on corrupted data)
function safeLoad<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  // Persistence key
  const STORAGE_KEY = 'reinasta_agency_v1';

  // Load initial state or localStorage
  const [allUsers, setAllUsers] = useState<User[]>(() =>
    safeLoad(`${STORAGE_KEY}_users`, initialUsers)
  );

  const [currentUser, setCurrentUser] = useState<User>(() =>
    safeLoad(`${STORAGE_KEY}_currentUser`, allUsers[0] || initialUsers[0])
  );

  const [cases, setCases] = useState<ClosingCase[]>(() =>
    safeLoad(`${STORAGE_KEY}_cases`, initialCases)
  );

  const [recruits, setRecruits] = useState<Recruit[]>(() =>
    safeLoad(`${STORAGE_KEY}_recruits`, initialRecruits)
  );

  const [modules, setModules] = useState<TrainingModule[]>(() =>
    safeLoad(`${STORAGE_KEY}_modules`, initialModules)
  );

  const [performance, setPerformance] = useState<PerformanceRecord[]>(() =>
    safeLoad(`${STORAGE_KEY}_performance`, initialPerformance)
  );

  const [meetings, setMeetings] = useState<MeetingSchedule[]>(() =>
    safeLoad(`${STORAGE_KEY}_meetings`, initialMeetings)
  );

  const [finance, setFinance] = useState<FinanceRecord[]>(() =>
    safeLoad(`${STORAGE_KEY}_finance`, initialFinance)
  );

  const [contests, setContests] = useState<Contest[]>(() =>
    safeLoad(`${STORAGE_KEY}_contests`, initialContests)
  );

  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(() =>
    safeLoad(`${STORAGE_KEY}_templates`, initialWhatsAppTemplates)
  );

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_theme`);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Sync theme to document element and localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_theme`, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(allUsers));
    localStorage.setItem(`${STORAGE_KEY}_currentUser`, JSON.stringify(currentUser));
    localStorage.setItem(`${STORAGE_KEY}_cases`, JSON.stringify(cases));
    localStorage.setItem(`${STORAGE_KEY}_recruits`, JSON.stringify(recruits));
    localStorage.setItem(`${STORAGE_KEY}_modules`, JSON.stringify(modules));
    localStorage.setItem(`${STORAGE_KEY}_performance`, JSON.stringify(performance));
    localStorage.setItem(`${STORAGE_KEY}_meetings`, JSON.stringify(meetings));
    localStorage.setItem(`${STORAGE_KEY}_finance`, JSON.stringify(finance));
    localStorage.setItem(`${STORAGE_KEY}_contests`, JSON.stringify(contests));
    localStorage.setItem(`${STORAGE_KEY}_templates`, JSON.stringify(templates));
  }, [allUsers, currentUser, cases, recruits, modules, performance, meetings, finance, contests, templates]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Handlers
  const handleSaveContest = (contestToSave: Contest) => {
    setContests((prev) => {
      const exists = prev.some((c) => c.id === contestToSave.id);
      if (exists) {
        return prev.map((c) => (c.id === contestToSave.id ? contestToSave : c));
      }
      return [contestToSave, ...prev];
    });
  };

  const handleDeleteContest = (id: string) => {
    setContests((prev) => prev.filter((c) => c.id !== id));
  };

  // Handlers
  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    // If agent tries to access restricted tabs (keuangan, meeting, whatsapp), redirect to dashboard
    if (user.role === 'agent' && (activeTab === 'keuangan' || activeTab === 'meeting' || activeTab === 'whatsapp')) {
      setActiveTab('dashboard');
    } else if (user.role === 'unit_manager' && activeTab === 'keuangan') {
      setActiveTab('dashboard');
    }
  };

  const handleAddRecruit = (newRecruit: Omit<Recruit, 'id'>) => {
    const created: Recruit = {
      ...newRecruit,
      id: `rec-${Date.now()}`
    };
    setRecruits((prev) => [created, ...prev]);
  };

  const handleUpdateRecruitStage = (id: string, stage: RecruitStage) => {
    setRecruits((prev) =>
      prev.map((r) => (r.id === id ? { ...r, stage } : r))
    );
  };

  const handleAddCase = (newCase: Omit<ClosingCase, 'id'>) => {
    const created: ClosingCase = {
      ...newCase,
      id: `case-${Date.now()}`
    };
    setCases((prev) => [created, ...prev]);
  };

  const handleUpdateCaseStage = (caseId: string, stage: CaseStage) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, stage } : c))
    );
  };

  const handleAddModule = (newMod: Omit<TrainingModule, 'id' | 'completedByAgentIds'>) => {
    const created: TrainingModule = {
      ...newMod,
      id: `mod-${Date.now()}`,
      completedByAgentIds: []
    };
    setModules((prev) => [created, ...prev]);
  };

  const handleToggleCompleteModule = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        const already = m.completedByAgentIds.includes(currentUser.id);
        const updated = already
          ? m.completedByAgentIds.filter((id) => id !== currentUser.id)
          : [...m.completedByAgentIds, currentUser.id];
        return { ...m, completedByAgentIds: updated };
      })
    );
  };

  const handleUpdateCoachingNotes = (agentId: string, notes: string) => {
    setPerformance((prev) =>
      prev.map((p) => (p.agentId === agentId ? { ...p, coachingNotes: notes } : p))
    );
  };

  const handleAddMeeting = (newMeeting: Omit<MeetingSchedule, 'id' | 'attendeesCount'>) => {
    const created: MeetingSchedule = {
      ...newMeeting,
      id: `meet-${Date.now()}`,
      attendeesCount: 10
    };
    setMeetings((prev) => [created, ...prev]);
  };

  const handleAddFinanceRecord = (newRec: Omit<FinanceRecord, 'id' | 'receiptNumber'>) => {
    const created: FinanceRecord = {
      ...newRec,
      id: `fin-${Date.now()}`,
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`
    };
    setFinance((prev) => [created, ...prev]);
  };

  const handleSaveTemplate = (template: WhatsAppTemplate) => {
    setTemplates((prev) => {
      const exists = prev.some((t) => t.id === template.id);
      return exists ? prev.map((t) => (t.id === template.id ? template : t)) : [template, ...prev];
    });
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  // Reset all persisted demo data back to initial mock data
  const handleResetData = () => {
    if (!window.confirm('Reset semua data demo kembali ke data awal? Semua perubahan yang Anda buat akan hilang.')) return;
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_KEY))
      .forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  };

  // Export all local data as a downloadable JSON backup
  const handleExportData = () => {
    try {
      const data: Record<string, unknown> = {};
      Object.keys(localStorage)
        .filter((key) => key.startsWith(STORAGE_KEY))
        .forEach((key) => {
          const raw = localStorage.getItem(key);
          if (!raw) return;
          try { data[key] = JSON.parse(raw); } catch { data[key] = raw; }
        });

      const backup = {
        app: 'reinasta-agency',
        version: 1,
        exportedAt: new Date().toISOString(),
        data,
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reinasta-agency-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export backup failed:', err);
      window.alert('Gagal membuat file backup. Coba lagi.');
    }
  };

  // Restore from a previously exported JSON backup
  const handleImportData = (backup: { app?: string; version?: number; data?: Record<string, unknown> }) => {
    try {
      const data = backup?.data;
      if (!backup?.app || !data || typeof data !== 'object') {
        window.alert('File backup tidak valid. Pastikan file berasal dari Reinasta Agency Portal.');
        return;
      }
      let count = 0;
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith(STORAGE_KEY) && value !== undefined && value !== null) {
          localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
          count += 1;
        }
      });
      if (count === 0) {
        window.alert('Backup tidak berisi data Reinasta Agency yang dikenali.');
        return;
      }
      window.alert(`Backup dipulihkan (${count} segmen data). Aplikasi akan dimuat ulang...`);
      window.location.reload();
    } catch (err) {
      console.error('Import backup failed:', err);
      window.alert('Gagal membaca file backup. Periksa kembali file Anda.');
    }
  };

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 text-[#2D3436] dark:text-slate-100 font-sans flex flex-col antialiased transition-colors">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        allUsers={allUsers}
        onSelectUser={handleSelectUser}
        activeTab={activeTab}
        onOpenMobileMenu={() => setShowLoginModal(true)}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentUser={currentUser}
          isOpen={isSidebarOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Suspense fallback={<ModuleLoader />}>
          {activeTab === 'dashboard' && (
            <Dashboard
              currentUser={currentUser}
              cases={cases}
              recruits={recruits}
              performance={performance}
              meetings={meetings}
              modules={modules}
              finance={finance}
              contests={contests}
              allUsers={allUsers}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'kontes' && (
            <ContestManager
              currentUser={currentUser}
              allUsers={allUsers}
              performanceList={performance}
              contests={contests}
              insuranceProducts={insuranceProducts}
              cases={cases}
              onSaveContest={handleSaveContest}
              onDeleteContest={handleDeleteContest}
            />
          )}

          {activeTab === 'kalkulator' && (
            <CommissionCalculatorMDRT
              currentUser={currentUser}
              performanceRecords={performance}
            />
          )}

          {activeTab === 'pitch_coach' && (
            <AISalesPitchCoach
              currentUser={currentUser}
            />
          )}

          {activeTab === 'rekrutmen' && (
            <Recruitment
              currentUser={currentUser}
              recruits={recruits}
              allUsers={allUsers}
              onAddRecruit={handleAddRecruit}
              onUpdateRecruitStage={handleUpdateRecruitStage}
            />
          )}

          {activeTab === 'agents' && (
            <AgentDirectory
              currentUser={currentUser}
              allUsers={allUsers}
              performanceRecords={performance}
            />
          )}

          {activeTab === 'training' && (
            <TrainingHub
              currentUser={currentUser}
              modules={modules}
              onAddModule={handleAddModule}
              onToggleCompleteModule={handleToggleCompleteModule}
            />
          )}

          {activeTab === 'evaluasi' && (
            <PerformanceEvaluation
              currentUser={currentUser}
              performanceRecords={performance}
              onUpdateCoachingNotes={handleUpdateCoachingNotes}
            />
          )}

          {activeTab === 'closing' && (
            <ClosingProgress
              currentUser={currentUser}
              cases={cases}
              products={insuranceProducts}
              allUsers={allUsers}
              onAddCase={handleAddCase}
              onUpdateCaseStage={handleUpdateCaseStage}
            />
          )}

          {activeTab === 'keuangan' && (
            <AgencyFinance
              currentUser={currentUser}
              financeRecords={finance}
              onAddFinanceRecord={handleAddFinanceRecord}
            />
          )}

          {activeTab === 'meeting' && (
            currentUser.role === 'agent' ? (
              <div className="p-8 bg-white rounded-lg border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-50 text-[#ED1C24] flex items-center justify-center mx-auto font-bold text-lg">!</div>
                <h2 className="text-base font-bold text-slate-900">Akses Terbatas</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Akses fitur Meeting Online tidak diberikan kepada Agent. Fitur ini khusus untuk Unit Manager & Owner Agency.
                </p>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="mt-2 px-4 py-2 bg-[#ED1C24] text-white text-xs font-bold rounded cursor-pointer"
                >
                  Kembali ke Dashboard
                </button>
              </div>
            ) : (
              <OnlineMeeting
                currentUser={currentUser}
                meetings={meetings}
                onAddMeeting={handleAddMeeting}
              />
            )
          )}

          {activeTab === 'whatsapp' && (
            <WhatsAppBroadcast
              currentUser={currentUser}
              templates={templates}
              cases={cases}
              recruits={recruits}
              onSaveTemplate={handleSaveTemplate}
              onDeleteTemplate={handleDeleteTemplate}
            />
          )}

          {activeTab === 'prudential_rules' && (
            <PrudentialRules currentUser={currentUser} />
          )}
          </Suspense>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
      />

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          allUsers={allUsers}
          currentUser={currentUser}
          onSelectUser={handleSelectUser}
          onClose={() => setShowLoginModal(false)}
          onResetData={handleResetData}
          onExportData={handleExportData}
          onImportData={handleImportData}
        />
      )}

      {/* Persistent Admin Chat Floating Widget on All Pages */}
      <AdminChatWidget
        currentUser={currentUser}
        allUsers={allUsers}
      />
    </div>
    </ErrorBoundary>
  );

}
