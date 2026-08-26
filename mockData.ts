import { User, InsuranceProduct, ClosingCase, Recruit, TrainingModule, PerformanceRecord, MeetingSchedule, FinanceRecord, WhatsAppTemplate, Contest } from '../types';

export const initialUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Budi Santoso, CFP',
    email: 'budi.santoso@reinasta.co.id',
    role: 'owner',
    pruCode: '00128941',
    unitName: 'Reinasta Agency Headquarters',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    phone: '081234567890',
    aaliCertified: true,
    syariahCertified: true,
    joinDate: '2015-03-12',
  },
  {
    id: 'usr-2',
    name: 'Siti Rahmawati, AAK',
    email: 'siti.rahmawati@reinasta.co.id',
    role: 'unit_manager',
    pruCode: '00341092',
    unitName: 'Elang Syariah Team',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '081398765432',
    aaliCertified: true,
    syariahCertified: true,
    joinDate: '2018-07-20',
  },
  {
    id: 'usr-3',
    name: 'Hendra Wijaya',
    email: 'hendra.wijaya@reinasta.co.id',
    role: 'unit_manager',
    pruCode: '00295811',
    unitName: 'Garuda Champions',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    phone: '081122334455',
    aaliCertified: true,
    syariahCertified: true,
    joinDate: '2017-01-10',
  },
  {
    id: 'usr-4',
    name: 'Rian Hidayat',
    email: 'rian.hidayat@reinasta.co.id',
    role: 'agent',
    pruCode: '00512039',
    unitName: 'Elang Syariah Team',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '081566778899',
    aaliCertified: true,
    syariahCertified: true,
    joinDate: '2022-09-01',
  },
  {
    id: 'usr-5',
    name: 'Maya Putri',
    email: 'maya.putri@reinasta.co.id',
    role: 'agent',
    pruCode: '00623812',
    unitName: 'Elang Syariah Team',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '081899001122',
    aaliCertified: true,
    syariahCertified: false,
    joinDate: '2023-02-15',
  },
  {
    id: 'usr-6',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@reinasta.co.id',
    role: 'agent',
    pruCode: '00492810',
    unitName: 'Garuda Champions',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '081733445566',
    aaliCertified: true,
    syariahCertified: true,
    joinDate: '2021-11-05',
  },
  {
    id: 'usr-7',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@reinasta.co.id',
    role: 'secretary',
    unitName: 'Reinasta Admin & Sekretariat',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '081299887766',
    aaliCertified: false,
    syariahCertified: false,
    joinDate: '2019-05-18',
  }
];

export const insuranceProducts: InsuranceProduct[] = [
  {
    id: 'prd-1',
    name: 'PRUCritical Benefit 88',
    code: 'PCB88',
    type: 'konvensional',
    category: 'Penyakit Kritis',
    description: 'Perlindungan penyakit kritis tahap akhir hingga usia 88 tahun dengan jaminan 100% premi kembali.',
    minPremium: 6000000,
  },
  {
    id: 'prd-2',
    name: 'PRUPrime Healthcare Plus',
    code: 'PPH+',
    type: 'konvensional',
    category: 'Kesehatan',
    description: 'Asuransi kesehatan rawat inap komprehensif dengan sistem cashless & pembatas wilayah fleksibel.',
    minPremium: 9000000,
  },
  {
    id: 'prd-3',
    name: 'PRUCinta Syariah',
    code: 'PRUCinta',
    type: 'syariah',
    category: 'Jiwa',
    description: 'Asuransi jiwa syariah dengan perlindungan meninggal dunia & meninggal dunia akibat kecelakaan, 100% pengembalian dana kontribusi.',
    minPremium: 5000000,
  },
  {
    id: 'prd-4',
    name: 'PRU Solusi Sehat Syariah',
    code: 'PSSS',
    type: 'syariah',
    category: 'Kesehatan',
    description: 'Solusi perlindungan kesehatan berbasis syariah dengan akad Tabarru\' & Mudharabah.',
    minPremium: 8400000,
  },
  {
    id: 'prd-5',
    name: 'PRU Pyramida Syariah',
    code: 'PRUPyramida',
    type: 'syariah',
    category: 'Investasi',
    description: 'Perencanaan warisan dan investasi berbasis syariah untuk kepastian masa depan keluarga.',
    minPremium: 12000000,
  },
  {
    id: 'prd-6',
    name: 'PRULink Next Gen',
    code: 'PNG',
    type: 'konvensional',
    category: 'Investasi',
    description: 'Asuransi jiwa yang dikaitkan dengan investasi (Unit Link) dengan fleksibilitas alokasi dana.',
    minPremium: 10000000,
  }
];

export const initialCases: ClosingCase[] = [
  {
    id: 'case-101',
    clientName: 'Bapak Irfan Hakim',
    clientPhone: '081211112222',
    agentId: 'usr-4',
    agentName: 'Rian Hidayat',
    pruCode: '00512039',
    unitName: 'Elang Syariah Team',
    productName: 'PRUCinta Syariah',
    productType: 'syariah',
    annualPremium: 18000000,
    paymentFrequency: 'Tahunan',
    stage: 'Issued & Paid',
    submittedDate: '2026-06-15',
    issuedDate: '2026-06-20',
    notes: 'Polis sudah aktif, bukti pembayaran & buku polis telah diterima nasabah.'
  },
  {
    id: 'case-102',
    clientName: 'Ibu Ratna Sari',
    clientPhone: '081333334444',
    agentId: 'usr-4',
    agentName: 'Rian Hidayat',
    pruCode: '00512039',
    unitName: 'Elang Syariah Team',
    productName: 'PRU Solusi Sehat Syariah',
    productType: 'syariah',
    annualPremium: 14400000,
    paymentFrequency: 'Bulanan',
    stage: 'Underwriting / Medical',
    submittedDate: '2026-07-28',
    notes: 'Sedang menunggu hasil medical check-up dari Siloam Hospital.'
  },
  {
    id: 'case-103',
    clientName: 'PT Mandiri Jaya (Karyawan)',
    clientPhone: '081855556666',
    agentId: 'usr-5',
    agentName: 'Maya Putri',
    pruCode: '00623812',
    unitName: 'Elang Syariah Team',
    productName: 'PRUPrime Healthcare Plus',
    productType: 'konvensional',
    annualPremium: 42000000,
    paymentFrequency: 'Tahunan',
    stage: 'SPAJ Submitted',
    submittedDate: '2026-08-01',
    notes: 'Dokumen e-SPAJ lengkap, menunggu persetujuan pusat.'
  },
  {
    id: 'case-104',
    clientName: 'Dr. Anita Wijaya',
    clientPhone: '081977778888',
    agentId: 'usr-6',
    agentName: 'Ahmad Fauzi',
    pruCode: '00492810',
    unitName: 'Garuda Champions',
    productName: 'PRUCritical Benefit 88',
    productType: 'konvensional',
    annualPremium: 25000000,
    paymentFrequency: 'Tahunan',
    stage: 'Issued & Paid',
    submittedDate: '2026-07-10',
    issuedDate: '2026-07-14',
    notes: 'Polis terbit tepat waktu. Recommends kawan sejawat.'
  },
  {
    id: 'case-105',
    clientName: 'H. Lukman Hakim',
    clientPhone: '081100001111',
    agentId: 'usr-2',
    agentName: 'Siti Rahmawati, AAK',
    pruCode: '00341092',
    unitName: 'Elang Syariah Team',
    productName: 'PRU Pyramida Syariah',
    productType: 'syariah',
    annualPremium: 120000000,
    paymentFrequency: 'Tahunan',
    stage: 'Issued & Paid',
    submittedDate: '2026-05-18',
    issuedDate: '2026-05-22',
    notes: 'Kasus besar perancangan warisan syariah.'
  },
  {
    id: 'case-106',
    clientName: 'Ibu Dian Sastro',
    clientPhone: '081222223333',
    agentId: 'usr-4',
    agentName: 'Rian Hidayat',
    pruCode: '00512039',
    unitName: 'Elang Syariah Team',
    productName: 'PRUCritical Benefit 88',
    productType: 'konvensional',
    annualPremium: 12000000,
    paymentFrequency: 'Bulanan',
    stage: 'Ilustrasi Terkirim',
    submittedDate: '2026-08-02',
    notes: 'Prospek tertarik perlindungan kanker & stroke stage 1.'
  }
];

export const initialRecruits: Recruit[] = [
  {
    id: 'rec-1',
    name: 'Andi Kurniawan, S.E.',
    phone: '081388889999',
    email: 'andi.kurniawan@gmail.com',
    sponsorAgentId: 'usr-4',
    sponsorAgentName: 'Rian Hidayat',
    unitName: 'Elang Syariah Team',
    stage: 'Fast Track Training',
    aaliScore: 88,
    applyDate: '2026-07-12',
    targetAppointDate: '2026-08-15',
    notes: 'Latar belakang ex-perbankan, potensi agen berprestasi.'
  },
  {
    id: 'rec-2',
    name: 'Nadia Safitri',
    phone: '081277776666',
    email: 'nadia.safitri@yahoo.com',
    sponsorAgentId: 'usr-2',
    sponsorAgentName: 'Siti Rahmawati, AAK',
    unitName: 'Elang Syariah Team',
    stage: 'Ujian AALI',
    aaliScore: 92,
    pruCodeCandidate: '00781299-PROS',
    applyDate: '2026-07-01',
    targetAppointDate: '2026-08-10',
    notes: 'Lulus ujian AALI Syariah & Konvensional. Menunggu penerbitan Kode Pru.'
  },
  {
    id: 'rec-3',
    name: 'Bambang Soeprapto',
    phone: '081544443333',
    email: 'bambang.s@hotmail.com',
    sponsorAgentId: 'usr-3',
    sponsorAgentName: 'Hendra Wijaya',
    unitName: 'Garuda Champions',
    stage: 'Interview',
    applyDate: '2026-07-25',
    targetAppointDate: '2026-09-01',
    notes: 'Jadwal interview tahap 2 dengan Agency Owner minggu depan.'
  },
  {
    id: 'rec-4',
    name: 'Reza Rahardian',
    phone: '081912345678',
    email: 'reza.rahardian@gmail.com',
    sponsorAgentId: 'usr-6',
    sponsorAgentName: 'Ahmad Fauzi',
    unitName: 'Garuda Champions',
    stage: 'Kode Appointed / Resmi',
    aaliScore: 95,
    pruCodeCandidate: '00719283',
    applyDate: '2026-05-10',
    targetAppointDate: '2026-06-01',
    notes: 'Resmi terdaftar sebagai Agent Prudential, sudah closing 1 kasus pertama.'
  }
];

export const initialModules: TrainingModule[] = [
  {
    id: 'mod-1',
    title: 'PruFastStart: Basic Agent Onboarding 2026',
    category: 'PruFastStart',
    description: 'Panduan mendasar langkah demi langkah 90 hari pertama bagi Agen Baru Prudential.',
    author: 'Prudential Academy & Reinasta Agency',
    format: 'PDF',
    fileSize: '4.2 MB',
    durationMinutes: 45,
    downloadUrl: '#download-prufaststart',
    isMandatory: true,
    targetRole: 'all',
    uploadDate: '2026-01-10',
    completedByAgentIds: ['usr-4', 'usr-5', 'usr-6']
  },
  {
    id: 'mod-2',
    title: 'Akad Syariah & Product Mastery PRUCinta',
    category: 'Syariah Academy',
    description: 'Memahami akad Tabarru\', Mudharabah, Hibah, dan keunggulan produk PRUCinta Syariah.',
    author: 'Dewan Pengawas Syariah & Siti Rahmawati, AAK',
    format: 'Modul Interaktif',
    fileSize: '8.1 MB',
    durationMinutes: 60,
    downloadUrl: '#download-syariah-prucinta',
    isMandatory: true,
    targetRole: 'all',
    uploadDate: '2026-02-14',
    completedByAgentIds: ['usr-4', 'usr-6']
  },
  {
    id: 'mod-3',
    title: 'Teknik Closing Prospek High Net Worth Individual (HNWI)',
    category: 'Handling Objection',
    description: 'Strategi komunikasi dan presentasi perencanaan warisan untuk nasabah berkecukupan tinggi.',
    author: 'Budi Santoso, CFP',
    format: 'PDF',
    fileSize: '2.8 MB',
    durationMinutes: 30,
    downloadUrl: '#download-hnwi-closing',
    isMandatory: false,
    targetRole: ['agent', 'unit_manager'],
    uploadDate: '2026-03-20',
    completedByAgentIds: ['usr-4']
  },
  {
    id: 'mod-4',
    title: 'Pedoman Dan Kualifikasi Unit Manager Prudential',
    category: 'Unit Manager Development',
    description: 'Syarat promosi UM, kalkulasi Overriding, dan pengelolaan dinamika tim agen.',
    author: 'Reinasta Management',
    format: 'PDF',
    fileSize: '3.5 MB',
    durationMinutes: 50,
    downloadUrl: '#download-um-guide',
    isMandatory: true,
    targetRole: ['unit_manager', 'owner'],
    uploadDate: '2026-04-05',
    completedByAgentIds: ['usr-2', 'usr-3']
  },
  {
    id: 'mod-5',
    title: 'Sertifikasi Anti-Money Laundering (AML) & Know Your Customer',
    category: 'PruFastStart',
    description: 'Modul kepatuhan regulasi OJK & Prudential terkait pencegahan pencucian uang.',
    author: 'Compliance Team Prudential',
    format: 'PDF',
    fileSize: '3.1 MB',
    durationMinutes: 35,
    downloadUrl: '#download-aml-compliance',
    isMandatory: true,
    targetRole: 'all',
    uploadDate: '2026-07-15',
    completedByAgentIds: ['usr-1']
  },
  {
    id: 'mod-6',
    title: 'Update Produk & Rider PRUPrime Healthcare Plus 2026',
    category: 'Product Knowledge',
    description: 'Rincian fitur terbaru limit tahunan dan opsi kamar rawat inap cashless.',
    author: 'Product Development Prudential',
    format: 'PDF',
    fileSize: '2.5 MB',
    durationMinutes: 25,
    downloadUrl: '#download-pruprime-update',
    isMandatory: true,
    targetRole: 'all',
    uploadDate: '2026-07-31',
    completedByAgentIds: []
  }
];

export const initialPerformance: PerformanceRecord[] = [
  // 2026 Performance
  {
    agentId: 'usr-4',
    agentName: 'Rian Hidayat',
    pruCode: '00512039',
    unitName: 'Elang Syariah Team',
    role: 'agent',
    agentLevel: 'Junior',
    year: 2026,
    quarter: 'Q2',
    semester: 'S1',
    apiKonvensional: 12000000,
    apiSyariah: 85000000,
    totalApi: 97000000,
    caseCount: 8,
    persistencyRate: 97.2,
    activeMonths: 6,
    clubLevel: 'Star Club',
    coachingNotes: 'Performa konsisten di sektor Syariah. Fokus mengejar kualifikasi MDRT di Q3/Q4.'
  },
  {
    agentId: 'usr-5',
    agentName: 'Maya Putri',
    pruCode: '00623812',
    unitName: 'Elang Syariah Team',
    role: 'agent',
    agentLevel: 'Trainee',
    year: 2026,
    quarter: 'Q2',
    semester: 'S1',
    apiKonvensional: 52000000,
    apiSyariah: 18000000,
    totalApi: 70000000,
    caseCount: 5,
    persistencyRate: 94.8,
    activeMonths: 5,
    clubLevel: 'Rookie Star',
    coachingNotes: 'Disiplin aktivitas mingguan cukup baik. Perlu ditingkatkan jumlah janji temu baru.'
  },
  {
    agentId: 'usr-6',
    agentName: 'Ahmad Fauzi',
    pruCode: '00492810',
    unitName: 'Garuda Champions',
    role: 'agent',
    agentLevel: 'Senior',
    year: 2026,
    quarter: 'Q2',
    semester: 'S1',
    apiKonvensional: 65000000,
    apiSyariah: 45000000,
    totalApi: 110000000,
    caseCount: 9,
    persistencyRate: 98.1,
    activeMonths: 6,
    clubLevel: 'Star Club',
    coachingNotes: 'Sangat baik dalam cross-selling produk kesehatan dan penyakit kritis.'
  },
  {
    agentId: 'usr-2',
    agentName: 'Siti Rahmawati, AAK',
    pruCode: '00341092',
    unitName: 'Elang Syariah Team',
    role: 'unit_manager',
    agentLevel: 'Master',
    year: 2026,
    quarter: 'Q2',
    semester: 'S1',
    apiKonvensional: 40000000,
    apiSyariah: 210000000,
    totalApi: 250000000,
    caseCount: 14,
    persistencyRate: 98.9,
    activeMonths: 6,
    clubLevel: 'MDRT',
    coachingNotes: 'Pencapaian Unit luar biasa. Menjadi percontohan Unit Syariah terbaik di kawasan.'
  },
  {
    agentId: 'usr-3',
    agentName: 'Hendra Wijaya',
    pruCode: '00295811',
    unitName: 'Garuda Champions',
    role: 'unit_manager',
    agentLevel: 'Senior',
    year: 2026,
    quarter: 'Q2',
    semester: 'S1',
    apiKonvensional: 150000000,
    apiSyariah: 60000000,
    totalApi: 210000000,
    caseCount: 12,
    persistencyRate: 96.0,
    activeMonths: 6,
    clubLevel: 'President Club',
    coachingNotes: 'Memiliki pertumbuhan rekrutmen agen baru yang tinggi.'
  }
];

export const initialMeetings: MeetingSchedule[] = [
  {
    id: 'meet-1',
    title: 'Reinasta Agency Morning Kickoff & MDRT Booster',
    type: 'Morning Briefing',
    dateTime: '2026-08-03T08:00',
    hostName: 'Budi Santoso, CFP',
    linkUrl: 'https://meet.google.com/rns-brfg-mnd',
    meetingPlatform: 'Google Meet',
    targetAudience: 'Semua Agen',
    description: 'Briefing awal minggu membahas strategi pencapaian target Triwulan 3 dan motivasi harian.',
    attendeesCount: 28,
    isLive: true
  },
  {
    id: 'meet-2',
    title: 'BOP Syariah Reinasta: Peluang Karir Prudential 2026',
    type: 'BOP (Business Opportunity)',
    dateTime: '2026-08-05T19:00',
    hostName: 'Siti Rahmawati, AAK',
    linkUrl: 'https://zoom.us/j/9876543210',
    meetingPlatform: 'Zoom',
    targetAudience: 'Publik Prospek',
    description: 'Presentasi Peluang Bisnis Agency Prudential Syariah untuk calon agen baru dan mitra rekrutmen.',
    attendeesCount: 42,
    isLive: false
  },
  {
    id: 'meet-3',
    title: 'Clinical Case & Handling Objection PRUPrime Healthcare Plus',
    type: 'Product Clinic',
    dateTime: '2026-08-07T14:00',
    hostName: 'Dewi Lestari & Trainer Prudential',
    linkUrl: 'https://meet.google.com/pru-hcplus-clinic',
    meetingPlatform: 'Google Meet',
    targetAudience: 'Agen Baru',
    description: 'Sesi kupas tuntas fitur klaim cashless, limit tahunan, dan cara menjawab keraguan nasabah.',
    attendeesCount: 15,
    isLive: false
  }
];

export const initialFinance: FinanceRecord[] = [
  {
    id: 'fin-1',
    date: '2026-07-02',
    type: 'Income',
    category: 'Overriding Commission',
    description: 'Penerimaan Overriding Komisi Prudential Periode Juni 2026',
    amount: 145000000,
    recordedBy: 'Dewi Lestari',
    receiptNumber: 'REC-202607-001'
  },
  {
    id: 'fin-2',
    date: '2026-07-05',
    type: 'Income',
    category: 'Operational Allowance',
    description: 'Subsidi Operasional Kantor Agency dari Prudential Center',
    amount: 35000000,
    recordedBy: 'Dewi Lestari',
    receiptNumber: 'REC-202607-002'
  },
  {
    id: 'fin-3',
    date: '2026-07-10',
    type: 'Expense',
    category: 'Sewa Kantor',
    description: 'Pembayaran Sewa Gedung Kantor Reinasta Agency & Wi-Fi Dedicated',
    amount: 22500000,
    recordedBy: 'Dewi Lestari',
    receiptNumber: 'EXP-202607-001'
  },
  {
    id: 'fin-4',
    date: '2026-07-15',
    type: 'Expense',
    category: 'Event Agency & BOP',
    description: 'Sewa Hall Hotel Aston untuk Acara Business Opportunity Presentation (BOP)',
    amount: 12800000,
    recordedBy: 'Dewi Lestari',
    receiptNumber: 'EXP-202607-002'
  },
  {
    id: 'fin-5',
    date: '2026-07-20',
    type: 'Expense',
    category: 'Rewards Agent',
    description: 'Pemberian Reward Laptop & Tablet untuk Top Producer Q2 2026',
    amount: 28000000,
    recordedBy: 'Budi Santoso, CFP',
    receiptNumber: 'EXP-202607-003'
  },
  {
    id: 'fin-6',
    date: '2026-07-25',
    type: 'Expense',
    category: 'Admin & Training',
    description: 'Pengadaan Modul Cetak Fast Track & Konsumsi Training AALI',
    amount: 6500000,
    recordedBy: 'Dewi Lestari',
    receiptNumber: 'EXP-202607-004'
  },
  {
    id: 'fin-7',
    date: '2026-08-01',
    type: 'Income',
    category: 'Bonus Kontes Agency',
    description: 'Bonus Kontes Agency Syariah Champion Regional Jakarta 2026',
    amount: 50000000,
    recordedBy: 'Dewi Lestari',
    receiptNumber: 'REC-202608-001'
  }
];

export const initialWhatsAppTemplates: WhatsAppTemplate[] = [
  {
    id: 'wa-ultah-1',
    title: '🎂 Ucapan Selamat Ulang Tahun Nasabah (Spesial Doa & Apresiasi)',
    category: 'Greeting & Ultah',
    content: `Selamat Ulang Tahun yang ke-{USIA} Bapak/Ibu {NAMA_NASABAH}! 🎉🎂

Barakallah fii umrik / Semoga di usiamu yang baru ini senantiasa diberikan kesehatan melimpah, kebahagiaan bersama keluarga tercinta, serta kelancaran rezeki yang penuh berkah.

Terima kasih atas kepercayaan Bapak/Ibu menjadi bagian dari keluarga besar Prudential melalui perlindungan {PRODUK_PRUDENTIAL}. Saya {NAMA_AGEN} berkomitmen untuk selalu memberikan pendampingan layanan finansial & kesehatan terbaik untuk Bapak/Ibu.

Semoga hari spesial ini dipenuhi dengan rasa syukur dan kebahagiaan! 🎈🎁

Salam hangat & doa terbaik,
{NAMA_AGEN}
Prudential Financial Consultant - Reinasta Agency
PruCode: {PRU_CODE} | WA: {TELEPON_AGEN}`
  },
  {
    id: 'wa-followup-berkala',
    title: '🔄 Follow-Up Berkala Evaluasi Polis & Review Proteksi',
    category: 'Follow Up Client',
    content: `Assalamu'alaikum / Selamat Pagi Bapak/Ibu {NAMA_NASABAH},

Semoga Bapak/Ibu dan keluarga senantiasa sehat wal'afiat.

Sebagai bentuk komitmen layanan purna jual dari saya ({NAMA_AGEN}) di Reinasta Agency Prudential, saya rutin melakukan review berkala untuk memastikan polis {PRODUK_PRUDENTIAL} Bapak/Ibu tetap optimal dan sesuai dengan tahapan kehidupan saat ini.

Apakah ada pembaruan data (alamat/kontak/rekening) atau pertanyaan terkait manfaat perlindungan kesehatan PMN & investasi polis Bapak/Ibu?

Jika Bapak/Ibu ada waktu luang minggu ini, saya sangat senang bisa bersilaturahmi singkat via WhatsApp Call/Zoom untuk menyelaraskan proteksi keluarga.

Terima kasih atas kepercayaannya,
{NAMA_AGEN} ({TELEPON_AGEN})`
  },
  {
    id: 'wa-1',
    title: 'Follow Up Prospek Nasabah (Review Perlindungan)',
    category: 'Follow Up Client',
    content: `Assalamu'alaikum / Selamat Pagi Bapak/Ibu {NAMA_NASABAH},

Saya {NAMA_AGEN} dari Reinasta Agency Prudential. Semoga Bapak/Ibu dalam keadaan sehat wal'afiat.

Menindaklanjuti diskusi kita mengenai perencanaan perlindungan keluarga & kesehatan {PRODUK_PRUDENTIAL}, saya telah menyiapkan ilustrasi khusus yang disesuaikan dengan kebutuhan Bapak/Ibu.

Apakah ada waktu luang esok hari pukul 10.00 atau 14.00 WIB untuk kita review singkat via Zoom/Kopi Santai?

Terima kasih,
{NAMA_AGEN} - Prudential Financial Consultant
PruCode: {PRU_CODE}`
  },
  {
    id: 'wa-2',
    title: 'Reminder Jatuh Tempo Pembayaran Kontribusi / Premi',
    category: 'Reminder Jatuh Tempo',
    content: `Yth. Bapak/Ibu {NAMA_NASABAH},

Pengingat ramah dari Reinasta Agency Prudential:
Polis Prudential Anda ({PRODUK_PRUDENTIAL}) akan jatuh tempo pada tanggal {TANGGAL_JATUH_TEMPO}.

Untuk memastikan manfaat perlindungan kesehatan & jiwa keluarga Anda tetap senantiasa aktif tanpa terputus, mohon dapat melakukan pembayaran melalui aplikasi PRUServices / OVO / M-Banking mitra Prudential.

Silakan hubungi saya jika memerlukan bantuan teknis pembayaran.

Salam hangat,
{NAMA_AGEN} ({TELEPON_AGEN})`
  },
  {
    id: 'wa-welcome-1',
    title: '🎉 Apresiasi Closing & Ucapan Selamat Datang Nasabah Baru',
    category: 'Greeting & Ultah',
    content: `Selamat & Terima Kasih Banyak Bapak/Ibu {NAMA_NASABAH}! 🎊

Selamat telah resmi menjadi bagian dari nasabah terproteksi Prudential bersama Reinasta Agency melalui produk {PRODUK_PRUDENTIAL}. Keputusan Bapak/Ibu hari ini adalah wujud cinta nyata bagi perlindungan masa depan keluarga.

Buku/e-Polis Anda telah terbit. Anda dapat mengakses informasi polis secara real-time kapan saja melalui aplikasi resmi PRUServices.

Jika memerlukan bantuan pengajuan klaim RS PMN Cashless atau informasi kartu kesehatan digital, jangan ragu untuk menghubungi saya di {TELEPON_AGEN}.

Salam hangat,
{NAMA_AGEN} (PruCode: {PRU_CODE})`
  },
  {
    id: 'wa-3',
    title: 'Undangan BOP (Peluang Karir Agency Prudential)',
    category: 'Undangan BOP Rekrutmen',
    content: `Halo {NAMA_PROSPEK},

Ingin memiliki bisnis keuangan pribadi beromset tinggi dengan waktu kerja yang fleksibel & pelatihan bersertifikat resmi?

Reinasta Agency Prudential mengundang Anda hadir dalam:
*Business Opportunity Presentation (BOP) 2026*
🗓️ Hari/Tgl: {TANGGAL_EVENT}
⏰ Pukul: {JAM_EVENT} WIB
📍 Venue: Zoom Virtual Room / Reinasta Agency HQ

Acara ini GRATIS & terbatas. Dapatkan wawasan berkarir menjadi Tenaga Pemasar Asuransi Jiwa Profesional (Konvensional & Syariah).

Konfirmasi kehadiran silakan balasa pesan ini dengan ketik: HADIR_NAMA_KOTA.

Salam Sukses,
{NAMA_AGEN}`
  },
  {
    id: 'wa-4',
    title: 'Motivasi & Target Q3 untuk Tim Agen Reinasta',
    category: 'Motivasi Tim Agen',
    content: `Semangat Pagi Tim Hebat Reinasta Agency! 🚀

Memasuki Triwulan 3 ini, mari tingkatkan irama aktivitas harian kita:
Target Min. 3 Janji Temu Baru / Hari, 1 Closing / Minggu.

Ingat kualifikasi Star Club & MDRT 2026 menanti kita di depan!
Tetap syiar kebaikan perlindungan syariah & konvensional dengan penuh rasa bangga.

"Keberhasilan bukan milik orang cerdas, tapi milik mereka yang konsisten berjuang."

Salam MDRT,
{NAMA_AGEN} - Unit Leader Reinasta Agency`
  }
];

export const initialContests: Contest[] = [
  {
    id: 'cnt-101',
    title: 'Kontes MDRT Sprint Q3 2026 - Trip Singapore & Cash Bonus',
    description: 'Kontes percepatan produksi API Q3 untuk seluruh Agen & Unit Manager. Raih kualifikasi perjalanan dinas eksklusif ke Singapore dan bonus cash tunai.',
    reward: 'Tiket Liburan Singapore 3D2N + Cash Bonus Rp 10.000.000 + Tropi Kehormatan Agency',
    targetApi: 100000000,
    targetAgentCriteria: {
      roleFilter: 'all',
      unitFilter: 'all',
      productTypeFilter: 'all',
      productCategoryFilter: 'all',
      allowedProductIds: ['prd-1', 'prd-2', 'prd-3', 'prd-4', 'prd-5', 'prd-6'],
      minCases: 4,
      minPersistency: 90
    },
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    status: 'Aktif',
    createdBy: 'Budi Santoso, CFP (Owner)',
    createdAt: '2026-07-01',
    bannerColor: 'from-red-600 to-rose-700'
  },
  {
    id: 'cnt-102',
    title: 'Syariah Leadership Challenge - Special Reward Umroh / Cash',
    description: 'Kontes khusus pencapaian polis berbasis Syariah untuk memperkuat kepemimpinan unit Syariah di kawasan Jabodetabek.',
    reward: 'Voucher Subsidi Umroh Rp 25.000.000 / Cash Rp 20.000.000 + Sertifikat Distinction',
    targetApi: 75000000,
    targetAgentCriteria: {
      roleFilter: 'all',
      unitFilter: 'Elang Syariah Team',
      productTypeFilter: 'syariah',
      productCategoryFilter: 'all',
      allowedProductIds: ['prd-3', 'prd-4', 'prd-5'],
      minCases: 3,
      minPersistency: 92
    },
    startDate: '2026-08-01',
    endDate: '2026-10-31',
    status: 'Aktif',
    createdBy: 'Budi Santoso, CFP (Owner)',
    createdAt: '2026-08-01',
    bannerColor: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'cnt-103',
    title: 'Rookie Star Accelerator 2026 - Gadget Premium',
    description: 'Kontes bagi Agen Baru (Rookie) yang bergabung kurang dari 12 bulan untuk meningkatkan aktivitas produksi & penulisan polis.',
    reward: 'iPad Pro 11 Inch M2 + Pen Selling Kit Leather + Banner Champion',
    targetApi: 50000000,
    targetAgentCriteria: {
      roleFilter: 'agent',
      unitFilter: 'all',
      productTypeFilter: 'all',
      productCategoryFilter: 'all',
      allowedProductIds: ['prd-1', 'prd-2', 'prd-3', 'prd-4', 'prd-5', 'prd-6'],
      minCases: 3,
      minPersistency: 85
    },
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    status: 'Aktif',
    createdBy: 'Budi Santoso, CFP (Owner)',
    createdAt: '2026-06-01',
    bannerColor: 'from-amber-500 to-orange-600'
  }
];

