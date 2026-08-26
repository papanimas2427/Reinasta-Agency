import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Reinasta Agency Portal" });
  });

  // AI Sales Pitch Coach Endpoint (Gemini API Integration)
  app.post("/api/sales-pitch-coach", async (req, res) => {
    try {
      const { type, objection, product, clientProfile, customPrompt, recruitmentScenario } = req.body;

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

      let userPrompt = "";

      if (type === "objection") {
        userPrompt = `Mohon berikan skrip penanganan keberatan (handling objection) untuk situasi berikut:
- Keberatan Nasabah: "${objection || customPrompt}"
- Produk yang Ditawarkan: ${product || "PRUCinta Syariah / PRU Solusi Sehat Syariah"}
- Profil Nasabah: ${clientProfile || "Kepala Keluarga Usia 35 Tahun"}`;
      } else if (type === "recruitment") {
        userPrompt = `Mohon berikan skrip ajakan rekrutmen agen baru Prudential untuk skenario berikut:
- Skenario / Target Kandidat: "${recruitmentScenario || customPrompt}"
- Profil Kandidat: ${clientProfile || "Profesional / Karyawan Mendedikasikan Karir Baru"}`;
      } else {
        userPrompt = customPrompt || "Berikan tips sukses closing polis Prudential Syariah minggu ini.";
      }

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Fallback simulated intelligent response if API key is not configured in local environment
        const fallbackResponse = getFallbackPitchCoach(type, objection || customPrompt, recruitmentScenario, product);
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

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ text: response.text, isFallback: false });
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
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
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
