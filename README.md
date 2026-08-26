# Reinasta Agency Portal

Aplikasi manajemen **Agency Asuransi Jiwa Prudential (Konvensional & Syariah)** — mencakup rekrutmen, training, evaluasi performa penjualan, keuangan agency, meeting online, kontes agensi, broadcast WhatsApp, dan AI Sales Pitch Coach berbasis Gemini.

## Fitur Utama

| Modul | Deskripsi |
|---|---|
| **Dashboard** | Ringkasan API, pipeline closing, rekrutmen, performa tim, dan aktivitas agency |
| **Closing Progress** | Pipeline kasus dari Prospek → SPAJ → Issued & Paid |
| **Rekrutmen** | Funnel kandidat agen hingga Ujian AALI & Kode Appointed |
| **Training Hub** | Modul PruFastStart, Syariah Academy, Product Knowledge, dst. |
| **Evaluasi Performa** | API per kuartal, persistency rate, level club, catatan coaching, export PDF |
| **Kontes Agensi** | Buat kontes, kriteria target, leaderboard, countdown deadline |
| **Keuangan Agency** | Pencatatan income/expense, laporan, export PDF |
| **Kalkulator Komisi & MDRT** | Simulasi komisi dan target MDRT |
| **Meeting Online** | Jadwal Morning Briefing, Weekly Unit Meeting, BOP, dll. |
| **WhatsApp Outreach** | Template pesan dengan variabel dinamis, 1-klik, buka WA langsung |
| **AI Sales Pitch Coach** | Skrip handling objection & ajakan rekrutmen via **Gemini API** |
| **Admin Chat & FAQ** | Widget chat persisten dengan FAQ operasional agency |

## Cara Menjalankan

**Prasyarat:** Node.js 18+

```bash
# 1. Install dependency
npm install

# 2. (Opsional) Set API key Gemini untuk AI Sales Pitch Coach
cp env.example .env.local
# isi GEMINI_API_KEY di .env.local  ← dibaca otomatis oleh server (dotenv)

# 3. Jalankan (development, dengan Vite HMR)
npm run dev
# Server: http://localhost:3000

# 4. Build & jalankan produksi
npm run build
npm start

# 5. Jalankan pengujian otomatis (smoke test seluruh modul)
npm test
```

> Tanpa `GEMINI_API_KEY`, AI Sales Pitch Coach tetap berfungsi menggunakan **skrip cadangan otomatis** (mode fallback) sehingga aplikasi tetap lengkap untuk demo.

## Siap Produksi

- **Code splitting / lazy loading** — modul fitur & pustaka berat (recharts, jsPDF) hanya diunduh saat dibutuhkan. Initial bundle: **~300 KB** (gzip ~90 KB), turun dari 1.4 MB monolitik.
- **Error Boundary global** — crash satu modul tidak membuat portal blank; ada layar pemulihan (muat ulang / reset data).
- **Backup & Restore data** — semua data tersimpan di `localStorage`; gunakan tombol **Backup Data (JSON)** dan **Pulihkan dari Backup** di dialog login (ikon login di header) untuk memindahkan/mengamankan data.
- **Keamanan server** — input divalidasi & dibatasi panjang, rate-limit endpoint AI (30 req/menit/IP), header `nosniff` + `Referrer-Policy`, body limit 256 KB. Endpoint sengaja tidak memblokir iframe (dibutuhkan AI Studio & live preview).
- **Type safety nyata** — `@types/react` + `@types/react-dom` terpasang; `tsc --noEmit` memeriksa seluruh kode.
- **CI (GitHub Actions)** — file `.github/workflows/ci.yml` siap (typecheck → test → build). Aktifkan setelah koneksi GitHub diizinkan menulis `workflows`.

## Konfigurasi

| Variabel | Deskripsi |
|---|---|
| `GEMINI_API_KEY` | API key Google AI Studio / Gemini (diinjeksi otomatis oleh AI Studio) |
| `GEMINI_MODEL` | (Opsional) Model Gemini yang dipakai, default `gemini-3.6-flash` |
| `PORT` | (Opsional) Port server, default `3000` |
| `APP_URL` | URL hosting aplikasi (untuk link self-referential) |

Pemuatan env: `.env.local` > `.env` > env runtime (AI Studio menyuntik langsung, tidak bisa di-override).

## Pengujian (Quality Assurance)

Suite tes integrasi (Vitest + jsdom + Testing Library) me-mount aplikasi penuh dan menguji:

- Render **13 modul utama** (Dashboard, Kontes, Kalkulator, AI Coach, Rekrutmen, Data Agent, Training, Evaluasi, Closing, Keuangan, Meeting, WhatsApp, Aturan Prudential)
- **Kontrol akses role** — Agent terkunci dari Keuangan/Meeting/Broadcast
- Alur **AI Sales Pitch Coach** (dengan stub API offline)
- Pembuatan template WA tersimpan ke `localStorage`
- **Chat Admin** (kirim pesan + auto-reply), **backup data**, dan **dark mode**

```bash
npm test          # jalankan sekali
npm run test:watch
```

## Struktur Proyek

```
├── server.ts                 # Express + Vite middleware + Gemini API (validasi, rate-limit, dotenv)
├── vite.config.ts            # Vite + Tailwind + manualChunks (vendor splitting)
├── vitest.config.ts          # Konfigurasi test (jsdom + Testing Library)
├── tests/                    # Suite smoke test aplikasi penuh
├── src/
│   ├── App.tsx               # Routing tab, state global, persistensi, backup/restore
│   ├── types.ts              # Tipe data domain
│   ├── data/mockData.ts      # Data demo awal
│   ├── utils/                # pdfGenerator (bespoke PDF) & pdfExport (lazy loader)
│   └── components/           # Modul fitur aplikasi (lazy-loaded)
└── public/favicon.svg
```

**Persistensi data:** Semua perubahan disimpan di `localStorage` (`reinasta_agency_v1`). Gunakan **Reset Data Demo** pada dialog login untuk mengembalikan data awal.

## AI Studio

Dibuat dari Google AI Studio: https://ai.studio/apps/2769379b-b884-43f9-801e-ac42ff147796
