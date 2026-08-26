import React, { useState, useEffect } from 'react';
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
import { Dashboard } from './components/Dashboard';
import { Recruitment } from './components/Recruitment';
import { TrainingHub } from './components/TrainingHub';
import { PerformanceEvaluation } from './components/PerformanceEvaluation';
import { ClosingProgress } from './components/ClosingProgress';
import { AgencyFinance } from './components/AgencyFinance';
import { OnlineMeeting } from './components/OnlineMeeting';
import { WhatsAppBroadcast } from './components/WhatsAppBroadcast';
import { PrudentialRules } from './components/PrudentialRules';
import { LoginModal } from './components/LoginModal';
import { CommissionCalculatorMDRT } from './components/CommissionCalculatorMDRT';
import { AISalesPitchCoach } from './components/AISalesPitchCoach';
import { AgentDirectory } from './components/AgentDirectory';
import { ContestManager } from './components/ContestManager';
import { AdminChatWidget } from './components/AdminChatWidget';

export default function App() {
  // Persistence key
  const STORAGE_KEY = 'reinasta_agency_v1';

  // Load initial state or localStorage
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_currentUser`);
    return saved ? JSON.parse(saved) : allUsers[0] || initialUsers[0];
  });

  const [cases, setCases] = useState<ClosingCase[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_cases`);
    return saved ? JSON.parse(saved) : initialCases;
  });

  const [recruits, setRecruits] = useState<Recruit[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_recruits`);
    return saved ? JSON.parse(saved) : initialRecruits;
  });

  const [modules, setModules] = useState<TrainingModule[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_modules`);
    return saved ? JSON.parse(saved) : initialModules;
  });

  const [performance, setPerformance] = useState<PerformanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_performance`);
    return saved ? JSON.parse(saved) : initialPerformance;
  });

  const [meetings, setMeetings] = useState<MeetingSchedule[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_meetings`);
    return saved ? JSON.parse(saved) : initialMeetings;
  });

  const [finance, setFinance] = useState<FinanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_finance`);
    return saved ? JSON.parse(saved) : initialFinance;
  });

  const [contests, setContests] = useState<Contest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_contests`);
    return saved ? JSON.parse(saved) : initialContests;
  });

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
  }, [allUsers, currentUser, cases, recruits, modules, performance, meetings, finance, contests]);

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

  return (
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
              templates={initialWhatsAppTemplates}
              cases={cases}
              recruits={recruits}
            />
          )}

          {activeTab === 'prudential_rules' && (
            <PrudentialRules currentUser={currentUser} />
          )}
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
        />
      )}

      {/* Persistent Admin Chat Floating Widget on All Pages */}
      <AdminChatWidget
        currentUser={currentUser}
        allUsers={allUsers}
      />
    </div>
  );

}
