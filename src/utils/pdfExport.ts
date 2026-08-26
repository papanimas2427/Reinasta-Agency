// Lazy PDF export entry points.
// Keeps the heavy jsPDF bundle out of the initial app load — it is fetched
// only when the user actually clicks an export/cetak button.

import type {
  User,
  ClosingCase,
  Recruit,
  PerformanceRecord,
  MeetingSchedule,
  TrainingModule,
  FinanceRecord,
  Contest,
} from '../types';

export const exportFinancePDF = async (
  records: FinanceRecord[],
  totalIncome: number,
  totalExpense: number,
  currentUser: User
): Promise<void> => {
  const { generateFinancePDF } = await import('./pdfGenerator');
  return generateFinancePDF(records, totalIncome, totalExpense, currentUser);
};

export const exportPerformancePDF = async (
  records: PerformanceRecord[],
  periodLabel: string,
  currentUser: User
): Promise<void> => {
  const { generatePerformancePDF } = await import('./pdfGenerator');
  return generatePerformancePDF(records, periodLabel, currentUser);
};

export const exportDashboardPDF = async (
  currentUser: User,
  cases: ClosingCase[],
  recruits: Recruit[],
  performance: PerformanceRecord[],
  meetings: MeetingSchedule[],
  finance: FinanceRecord[],
  modules: TrainingModule[],
  contests: Contest[],
  allUsers: User[]
): Promise<void> => {
  const { generateDashboardSummaryPDF } = await import('./pdfGenerator');
  return generateDashboardSummaryPDF(currentUser, cases, recruits, performance, meetings, finance, modules, contests, allUsers);
};
