import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';

// Collect every console.error so tests fail loudly on runtime crashes.
const runtimeErrors: unknown[] = [];
beforeEach(() => {
  runtimeErrors.length = 0;
  vi.spyOn(console, 'error').mockImplementation((...args) => {
    runtimeErrors.push(args);
  });
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

// Stub the Gemini endpoint so the AI flow works offline (server not running in tests)
const fallbackAiResponse = {
  text: '### Skrip Test\n\n**1. Poin Empati**\n> *"Saya paham Bapak/Ibu."*',
  isFallback: true,
  model: 'gemini-3.6-flash',
};
beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      json: () => Promise.resolve(fallbackAiResponse),
    })
  );
});

function getSidebarNav() {
  const nav = document.querySelector('aside nav') as HTMLElement;
  expect(nav).toBeTruthy();
  return nav;
}

function clickSidebarTab(label: string) {
  const nav = getSidebarNav();
  const btn = within(nav).getByRole('button', { name: new RegExp(label, 'i') });
  return userEvent.click(btn);
}

describe('Reinasta Agency Portal — smoke test seluruh modul', () => {
  it('memuat Dashboard tanpa error runtime', async () => {
    render(<App />);
    // Lazy-loaded module: wait for the chunk to resolve
    expect(
      await screen.findByRole('heading', { level: 1, name: /selamat datang/i })
    ).toBeInTheDocument();
    expect(runtimeErrors).toHaveLength(0);
  });

  const modules: Array<[string, RegExp]> = [
    ['Kontes Agensi', /kontes agensi/i],
    ['Kalkulator Komisi', /kalkulator komisi/i],
    ['AI Sales Pitch Coach', /ai sales pitch coach/i],
    ['Rekrutmen Agen', /pipeline rekrutmen/i],
    ['Data Agent', /data & direktori agen/i],
    ['Materi Training', /pusat materi & modul training/i],
    ['Evaluasi & Performa', /analisa & evaluasi performa/i],
    ['Progres Closing', /progres closing/i],
    ['Keuangan Agency', /keuangan & kas reinasta/i],
    ['Meeting Online', /virtual meeting & bop hub/i],
    ['WhatsApp Broadcast', /whatsapp outreach/i],
    ['Aturan Prudential', /ketentuan & aturan prudential/i],
  ];

  it.each(modules)('merender modul "%s" tanpa error', async (_label, expected) => {
    const user = userEvent.setup();
    render(<App />);
    await clickSidebarTab(_label);
    await waitFor(() => {
      expect(document.body.textContent).toMatch(expected);
    });
    expect(runtimeErrors).toHaveLength(0);
    void user;
  });

  it('ganti peran ke Agent: keuangan & broadcast terkunci di sidebar', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Buka login modal lewat tombol baru di Header
    await user.click(screen.getByRole('button', { name: /ganti user \/ login/i }));
    await user.click(screen.getByRole('button', { name: /agent pemasar/i }));

    // Pilih agent Rian Hidayat pada kartu login
    const agentEntry = screen
      .getAllByText(/Rian Hidayat/i)
      .find((el) => el.closest('div[class*="cursor-pointer"]'));
    await user.click(agentEntry!.closest('div[class*="cursor-pointer"]') as HTMLElement);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /selamat datang, rian/i })).toBeInTheDocument();
    });

    const nav = getSidebarNav();
    const keuangan = within(nav).getByRole('button', { name: /keuangan agency/i });
    const broadcast = within(nav).getByRole('button', { name: /whatsapp broadcast/i });
    expect(keuangan).toBeDisabled();
    expect(broadcast).toBeDisabled();
    // Meeting juga terkunci untuk agent
    expect(within(nav).getByRole('button', { name: /meeting online/i })).toBeDisabled();
    expect(runtimeErrors).toHaveLength(0);
  });

  it('AI Pitch Coach: generate skrip via API stub dan menampilkan hasil', async () => {
    const user = userEvent.setup();
    render(<App />);
    await clickSidebarTab('AI Sales Pitch Coach');
    const generateBtn = screen.getByRole('button', { name: /buat skrip rekomendasi jawaban/i });
    await user.click(generateBtn);
    await screen.findByText(/skrip test/i);
    expect(screen.getByText(/mode cadangan/i)).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/sales-pitch-coach',
      expect.objectContaining({ method: 'POST' })
    );
    expect(runtimeErrors).toHaveLength(0);
  });

  it('WhatsApp: membuat template kustom & tersimpan ke localStorage', async () => {
    const user = userEvent.setup();
    render(<App />);
    await clickSidebarTab('WhatsApp Broadcast');

    await user.click(screen.getByRole('button', { name: /buat template pesan baru/i }));
    await user.type(
      screen.getByPlaceholderText(/contoh: ucapan selamat ulang tahun/i),
      'Template Uji Otomatis'
    );
    await user.type(
      screen.getByPlaceholderText(/ketik isi pesan template/i),
      'Halo {NAMA_NASABAH}, salam dari {NAMA_AGEN}!'
    );
    await user.click(screen.getByRole('button', { name: /simpan template/i }));

    expect(screen.getByText(/template uji otomatis/i)).toBeInTheDocument();
    await waitFor(() => {
      const stored = localStorage.getItem('reinasta_agency_v1_templates');
      expect(stored).toContain('Template Uji Otomatis');
    });
    expect(runtimeErrors).toHaveLength(0);
  });

  it('Admin Chat: agent kirim pesan dan terima auto-reply', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Login sebagai Agent agar alur auto-reply admin aktif
    await user.click(screen.getByRole('button', { name: /ganti user \/ login/i }));
    await user.click(screen.getByRole('button', { name: /agent pemasar/i }));
    const agentEntry = screen
      .getAllByText(/Rian Hidayat/i)
      .find((el) => el.closest('div[class*="cursor-pointer"]'));
    await user.click(agentEntry!.closest('div[class*="cursor-pointer"]') as HTMLElement);

    await user.click(screen.getByRole('button', { name: /chat admin/i }));
    const input = screen.getByPlaceholderText(/tanyakan ke admin agensi/i);
    await user.type(input, 'Halo admin, tes pesan{enter}');

    expect(await screen.findByText(/halo admin, tes pesan/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/terima kasih/i, undefined, { timeout: 4500 })
    ).toBeInTheDocument();
    expect(runtimeErrors).toHaveLength(0);
  });

  it('login modal: manajemen data (backup/restore/reset) tersedia', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /ganti user \/ login/i }));

    expect(screen.getByRole('button', { name: /backup data/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pulihkan dari backup/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset data demo/i })).toBeInTheDocument();

    const createSpy = vi.spyOn(URL, 'createObjectURL');
    await user.click(screen.getByRole('button', { name: /backup data/i }));
    expect(createSpy).toHaveBeenCalled();
    expect(runtimeErrors).toHaveLength(0);
  });

  it('dark mode toggle bekerja tanpa error', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    await user.click(screen.getByRole('button', { name: /toggle theme/i }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(runtimeErrors).toHaveLength(0);
  });
});
