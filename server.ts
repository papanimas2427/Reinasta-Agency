import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load .env.local first (dev secrets), then .env — dotenv never overrides
// already-set vars, so runtime-injected env (AI Studio) takes precedence.
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), quiet: true });
dotenv.config({ quiet: true });

const PORT = Number(process.env.PORT) || 3000;
const MODELS = [
  process.env.GEMINI_MODEL || "gemini-3.6-flash",
  "gemini-2.5-flash",
].filter(Boolean) as string[];

// ---- Simple in-memory rate limiter (anti-abuse for the AI endpoint) ----
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function rateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  bucket.count += 1;
  if (bucket.count > RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      error: "Terlalu banyak permintaan. Silakan coba lagi dalam beberapa menit.",
    });
  }
  next();
}

// ---- Input guard for the Gemini endpoint ----
const MAX_TEXT = 3000;
function cleanField(value: unknown, max = MAX_TEXT): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function startServer() {
  const app = express();
  app.set("trust proxy", true);
  app.use(express.json({ limit: "256kb" }));

  // Basic security headers (no X-Frame-Options/CSP frame-ancestors on purpose:
  // the app is embedded as an iframe by AI Studio & Arena live preview).
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Powered-By", "Reinasta Agency");
    next();
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      app: "Reinasta Agency Portal",
      model: MODELS[0],
      version: "1.0.0",
      uptimeSeconds: Math.floor(process.uptime()),
    });
  });

  // AI Sales Pitch Coach Endpoint (Gemini API Integration)
  app.post("/api/sales-pitch-coach", rateLimit, async (req, res) => {
    try {
      const { type, objection, product, clientProfile, customPrompt, recruitmentScenario } = req.body;

      const validTypes = ["objection", "recruitment", "general"];
      const safeType = validTypes.includes(type) ? type : "general";
      const apiKey = process.env.GEMINI_API_KEY;

      let systemInstruction = `Anda adalah Lead Sales Coach & Agency Director berpengalaman 15+ tahun di Prudential Indonesia & Prudential Syariah.
Tugas Anda adalah memberikan rekomendasi jawaban/skrip terbaik untuk agen asuransi jiwa Prudential.

Gunakan prinsip:
1. Empati & Validasi (Teknik Feel-Felt-Found)
2. Edukasi Manfaat Asuransi Jiwa & Syariah (Konsep Tabarru', Proteksi Income, Dana Darurat, Warisan)
3. Jawaban Tegas, Sopan, dan Persuasif
4. Pertanyaan Penutup (Closing Question) untuk melanjutkan percakapan.

Format Jawaban:
Berikan respons terstruktur dalam format Markdown yang mencakup:
- **Poin Empati / Acknowledgment**: Cara merespons dengan tenang tanpa mendebat nasabah.
- **Skrip Jawaban Langsung**: Kata-kata spesifik yang bisa diucapkan agen.
- **Konteks Produk & Syariah**: Mengapa solusi Prudential/PRU Syariah sangat tepat untuk situasi ini.
- **Pertanyaan Penutup (Closing Hook)**: Pertanyaan untuk memicu komitmen nasabah.`;

      const objectionText = cleanField(objection || customPrompt);
      const recruitmentText = cleanField(recruitmentScenario || customPrompt);
      const productText = cleanField(product, 300) || "PRUCinta Syariah / PRU Solusi Sehat Syariah";
      const profileText = cleanField(clientProfile, 500) || "Kepala Keluarga Usia 35 Tahun";

      let userPrompt = "";
      if (safeType === "objection") {
        userPrompt = `Mohon berikan skrip penanganan keberatan (handling objection) untuk situasi berikut:
- Keberatan Nasabah: "${objectionText || "Mau pikir-pikir dulu"}"
- Produk yang Ditawarkan: ${productText}
- Profil Nasabah: ${profileText}`;
      } else if (safeType === "recruitment") {
        userPrompt = `Mohon berikan skrip ajakan rekrutmen agen baru Prudential untuk skenario berikut:
- Skenario / Target Kandidat: "${recruitmentText || "Profesional yang mencari side income"}"
- Profil Kandidat: ${profileText}`;
      } else {
        userPrompt = cleanField(customPrompt, MAX_TEXT) || "Berikan tips sukses closing polis Prudential Syariah minggu ini.";
      }

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Fallback simulated intelligent response if API key is not configured in local environment
        const fallbackResponse = getFallbackPitchCoach(safeType, objectionText || recruitmentText, recruitmentText, productText);
        return res.json({ text: fallbackResponse, isFallback: true });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Try configured model first, then fall back to a known-stable model
      let lastError: any = null;
      for (const model of MODELS) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: userPrompt,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          const text = response.text?.trim() || "";
          if (!text) throw new Error("Empty response from model");
          return res.json({ text, isFallback: false, model });
        } catch (error: any) {
          lastError = error;
          console.warn(`Model ${model} failed, trying next:`, error?.message || error);
        }
      }

      throw lastError || new Error("All models failed");
    } catch (error: any) {
      console.error("Error in /api/sales-pitch-coach:", error);
      // Return helpful response if error occurs
      const fallbackResponse = getFallbackPitchCoach(
        req.body?.type,
        req.body?.objection || req.body?.customPrompt,
        req.body?.recruitmentScenario,
        req.body?.product
      );
      return res.json({
        text: fallbackResponse,
        isFallback: true,
        error: error.message || "Intermittent server error",
      });
    }
  });

  // Vite middleware for development vs static production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        // Allow sandbox/preview hosts (e.g. *.e2b.app) to reach the app
        allowedHosts: true as const,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { maxAge: "1h", index: "index.html" }));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (${process.env.NODE_ENV || "development"})`);
  });
}

function getFallbackPitchCoach(type?: string, objection?: string, recruitmentScenario?: string, product?: string) {
  if (type === "objection") {
    if (objection?.includes("BPJS")) {
      return `### 🛡️ Skrip Penanganan Keberatan: "Sudah Punya BPJS"

**1. Poin Empati & Acknowledgment**
> *"Bagus sekali Bapak/Ibu! Saya sangat mengapresiasi Bapak/Ibu sudah memiliki BPJS Kesehatan. Itu artinya Bapak/Ibu sudah sadar betul pentingnya memiliki perlindungan kesehatan keluarga."*

**2. Skrip Jawaban Langsung**
> *"Namun izinkan saya menyampaikan, BPJS Kesehatan dan Asuransi Swasta Prudential itu sifatnya **Saling Melengkapi (Co-exist)**, bukan saling menggantikan. BPJS menangani perawatan dasar sesuai faskes berejenjang. Sedangkan Prudential memberikan 3 kenyamanan ekstra:*
> - **Kamar Rawat Inap Private (VIP/VVIP)** single bed untuk kenyamanan & privasi istirahat keluarga.
> - **Sistem Cashless Internasional** untuk perawatan rumah sakit swasta terkemuka di Indonesia & Asia.
> - **Penggantian Biaya Obat & Terapi Khusus** yang mungkin tidak tercakup dalam formularium standar."*

**3. Konteks Produk (${product || "PRU Solusi Sehat Syariah"})**
> *"Dengan akad Tabarru' Syariah, kontribusi yang Bapak/Ibu sisihkan juga bernilai ibadah karena membantu sesama peserta yang tertimpa musibah kesehatan."*

**4. Pertanyaan Penutup (Closing Hook)**
> *"Bagaimana kalau saya buatkan simulasi ringkas proteksi kenyamanan VIP Rumah Sakit ini untuk keluarga Bapak/Ibu sore ini?"*;`;
    }

    if (objection?.includes("mahal") || objection?.includes("Anggaran")) {
      return `### 💰 Skrip Penanganan Keberatan: "Premi Terlalu Mahal / Anggaran Terbatas"

**1. Poin Empati & Acknowledgment**
> *"Saya sangat memahami Bapak/Ibu, di kondisi saat ini mengatur arus kas keuangan keluarga memang jadi prioritas utama."*

**2. Skrip Jawaban Langsung**
> *"Sebenarnya, yang mahal itu bukan preminya Bapak/Ibu, tetapi **biaya berobat jika musibah kesehatan tiba-tiba terjadi tanpa persiapan**. Bayangkan jika harus mengeluarkan puluhan atau ratusan juta tunai dari tabungan keluarga saat krisis."*
> *"Prudential hadir dengan konsep menyisihkan sebagian kecil penghasilan (misal 5-10%), agar 90% sisa tabungan Bapak/Ibu tetap aman dan terlindungi."*

**3. Konteks Produk (${product || "PRUCinta Syariah"})**
> *"Apalagi di PRUCinta Syariah, jika tidak ada klaim hingga akhir masa kepesertaan, 100% total kontribusi yang disetorkan akan dikembalikan penuh kepada Bapak/Ibu. Jadi tidak ada dana yang hangus!"*

**4. Pertanyaan Penutup (Closing Hook)**
> *"Menurut Bapak/Ibu, berapa besaran dana bulanan yang paling nyaman disisihkan tanpa mengganggu dapur keluarga saat ini? Biar saya sesuaikan koverernya."*;`;
    }

    return `### 🎯 Skrip Penanganan Keberatan: "${objection || 'Mau Pikir-pikir Dulu'}"

**1. Poin Empati & Acknowledgment**
> *"Tentu Bapak/Ibu, mengambil keputusan proteksi masa depan keluarga memang perlu pertimbangan matang. Saya sangat mendukung Bapak/Ibu berhati-hati."*

**2. Skrip Jawaban Langsung**
> *"Biasanya dari pengalaman nasabah saya, ada dua hal utama yang dipikirkan: apakah besaran preminya sudah pas, atau apakah manfaat polisnya sudah mencakup kebutuhan utama keluarga?"*

**3. Konteks Produk Prudential**
> *"Risiko kesehatan dan musibah tidak menunggu kita selesai berpikir. Semakin muda dan sehat kita mendaftar hari ini, semakin murah kontribusinya dan semakin cepat polis berlaku aktif."*

**4. Pertanyaan Penutup (Closing Hook)**
> *"Dari rancangan manfaat yang saya paparkan tadi, bagian mana yang menurut Bapak/Ibu paling krusial untuk segera dilindungi?"*;`;
  }

  return `### 🚀 Skrip Ajakan Rekrutmen Agen Baru (Prudential Career Opportunity)

**1. Skenario & Pendekatan awal**
> *"Halo! Saya melihat potensi luar biasa dalam diri kamu. Industri asuransi jiwa Prudential saat ini sedang berkembang pesat, khususnya produk Prudential Syariah."*

**2. Nilai Tambah Karir di Reinasta Agency**
> - **Flexibility**: Bebas mengatur jam kerja sendiri tanpa terikat jam kantor.
> - **Unlimited Income**: Pendapatan komisi, bonus tahunan, dan jenjang karir manajerial yang jelas.
> - **Impact**: Membantu keluarga Indonesia terhindar dari kebangkrutan finansial akibat risiko sakit kritis.
> - **Full System Support**: Didampingi mentor senior & platform pelatihan digital lengkap.

**3. Pertanyaan Penutup (Closing Hook)**
> *"Bagaimana kalau kita ngopi santai 20 menit besok untuk bedah potensi pendapatan di Prudential?"*;`;
}

startServer();
