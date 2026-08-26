export type UserRole = 'owner' | 'unit_manager' | 'agent' | 'secretary';
export type AgentLevel = 'Trainee' | 'Junior' | 'Senior' | 'Master';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  agentLevel?: AgentLevel;
  pruCode?: string;
  unitName?: string;
  avatar: string;
  phone: string;
  aaliCertified: boolean;
  syariahCertified: boolean;
  joinDate: string;
}

export type ProductType = 'konvensional' | 'syariah';

export interface InsuranceProduct {
  id: string;
  name: string;
  code: string;
  type: ProductType;
  category: 'Kesehatan' | 'Jiwa' | 'Penyakit Kritis' | 'Investasi' | 'Pendidikan';
  description: string;
  minPremium: number;
}

export type CaseStage = 'Prospek' | 'Data Gathering' | 'Ilustrasi Terkirim' | 'SPAJ Submitted' | 'Underwriting / Medical' | 'Issued & Paid';

export interface ClosingCase {
  id: string;
  clientName: string;
  clientPhone: string;
  agentId: string;
  agentName: string;
  pruCode: string;
  unitName: string;
  productName: string;
  productType: ProductType;
  annualPremium: number; // API in IDR
  paymentFrequency: 'Bulanan' | 'Triwulan' | 'Semesteran' | 'Tahunan';
  stage: CaseStage;
  submittedDate: string;
  issuedDate?: string;
  notes?: string;
}

export type RecruitStage = 'Prospek' | 'Interview' | 'Fast Track Training' | 'Ujian AALI' | 'Kode Appointed / Resmi';

export interface Recruit {
  id: string;
  name: string;
  phone: string;
  email: string;
  sponsorAgentId: string;
  sponsorAgentName: string;
  unitName: string;
  stage: RecruitStage;
  aaliScore?: number;
  pruCodeCandidate?: string;
  applyDate: string;
  targetAppointDate: string;
  notes?: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  category: 'PruFastStart' | 'Syariah Academy' | 'Product Knowledge' | 'Handling Objection' | 'Unit Manager Development';
  description: string;
  author: string;
  format: 'PDF' | 'Video' | 'Modul Interaktif';
  fileSize: string;
  durationMinutes: number;
  downloadUrl: string;
  isMandatory: boolean;
  targetRole: UserRole[] | 'all';
  uploadDate: string;
  completedByAgentIds: string[];
}

export interface PerformanceRecord {
  agentId: string;
  agentName: string;
  pruCode: string;
  unitName: string;
  role: UserRole;
  agentLevel?: AgentLevel;
  year: number;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  semester: 'S1' | 'S2';
  apiKonvensional: number;
  apiSyariah: number;
  totalApi: number;
  caseCount: number;
  persistencyRate: number; // percentage e.g. 96.5
  activeMonths: number;
  clubLevel: 'MDRT' | 'Star Club' | 'President Club' | 'Rookie Star' | 'Regular Agent';
  coachingNotes?: string;
}

export interface MeetingSchedule {
  id: string;
  title: string;
  type: 'Morning Briefing' | 'Weekly Unit Meeting' | 'BOP (Business Opportunity)' | 'Product Clinic' | 'Coaching';
  dateTime: string;
  hostName: string;
  unitName?: string;
  linkUrl: string;
  meetingPlatform: 'Google Meet' | 'Zoom' | 'Prudential Virtual Room';
  targetAudience: 'Semua Agen' | 'Unit Manager' | 'Agen Baru' | 'Publik Prospek';
  description: string;
  attendeesCount: number;
  isLive: boolean;
}

export type FinanceType = 'Income' | 'Expense';

export interface FinanceRecord {
  id: string;
  date: string;
  type: FinanceType;
  category: 'Overriding Commission' | 'Bonus Kontes Agency' | 'Operational Allowance' | 'Sewa Kantor' | 'Event Agency & BOP' | 'Rewards Agent' | 'Admin & Training';
  description: string;
  amount: number;
  unitName?: string;
  recordedBy: string;
  receiptNumber: string;
}

export interface WhatsAppTemplate {
  id: string;
  title: string;
  category: 'Follow Up Client' | 'Reminder Jatuh Tempo' | 'Undangan BOP Rekrutmen' | 'Greeting & Ultah' | 'Motivasi Tim Agen';
  content: string;
}

export type ContestStatus = 'Aktif' | 'Mendatang' | 'Selesai';

export interface ContestTargetAgentCriteria {
  roleFilter: 'all' | 'agent' | 'unit_manager';
  unitFilter: string; // 'all' or specific unit name
  productTypeFilter?: 'all' | 'konvensional' | 'syariah';
  productCategoryFilter?: string; // 'all' or specific category
  allowedProductIds?: string[]; // specific product IDs or names counted
  minCases: number;
  minPersistency: number;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  reward: string;
  targetApi: number;
  targetAgentCriteria: ContestTargetAgentCriteria;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD" (Deadline)
  status: ContestStatus;
  createdBy: string;
  createdAt: string;
  bannerColor?: string;
}

export interface ContestAgentProgress {
  agentId: string;
  agentName: string;
  pruCode: string;
  unitName: string;
  role: UserRole;
  avatar: string;
  achievedApi: number;
  targetApi: number;
  percentage: number;
  caseCount: number;
  persistencyRate: number;
  isQualified: boolean;
  rank: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  category?: 'general' | 'faq_inquiry' | 'spaj_approval' | 'commission' | 'contest';
}

export interface AdminChatThread {
  agentId: string;
  agentName: string;
  agentAvatar: string;
  agentPruCode: string;
  unitName: string;
  unreadCount: number;
  lastMessage: string;
  lastTimestamp: string;
}

export interface FAQItem {
  id: string;
  question: string;
  category: string;
  answer: string;
  tags?: string[];
}

