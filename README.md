# Learnial

Learnial adalah web application berbasis AI untuk membantu mahasiswa memahami materi kuliah lebih cepat, mengubah materi menjadi flashcard, dan mengelola jadwal belajar dalam satu alur yang bisa langsung didemokan di browser.

Dokumen PRD lengkap tersedia di [PRD.md](./PRD.md).

## Tim Developer

- Amelia Riski Kurniawati `(24.01.55.0013)`
- J3R-Design

## Problem Statement

Mahasiswa sering menghadapi tiga masalah yang saling terkait:

1. Materi kuliah panjang dan padat, sehingga sulit diringkas dengan cepat sebelum kelas, kuis, atau ujian.
2. Proses belajar ulang masih manual, terutama saat membuat flashcard atau poin hafalan dari dokumen kuliah.
3. Jadwal kuliah, deadline, dan agenda belajar sering tersebar di banyak tempat sehingga mudah terlewat.

Learnial dirancang untuk menyelesaikan masalah tersebut melalui AI yang benar-benar dipakai di alur utama aplikasi, bukan sekadar fitur tambahan dekoratif.

## Solusi Yang Dibangun

Learnial menyediakan tiga fitur inti:

- `AI Study Assistant`: upload atau tempel materi untuk menghasilkan ringkasan, poin penting, kata kunci, mindmap, dan quiz belajar.
- `Flashcard Generator`: mengubah dokumen atau teks materi menjadi flashcard interaktif.
- `Smart Schedule Planner`: menyimpan agenda belajar/kuliah dan riwayat aktivitas secara terstruktur.

Fitur pendukung:

- Login Google melalui Supabase Auth
- History hasil generate untuk study, flashcard, dan schedule
- Dashboard ringkas untuk memantau aktivitas belajar
- Floating chat assistant untuk interaksi tambahan

## Kesesuaian Dengan Briefing UTS

Project ini disusun agar selaras dengan poin briefing `UTS_AI_Briefing.pptx`.

### Wajib Dipenuhi

- Web-based application yang responsif dan bisa diakses via browser
- Memiliki minimal 1 fitur AI yang fungsional
- Tim terdiri dari 2 anggota dan nama tim dicantumkan di project
- Aplikasi bisa didemokan, bukan hanya mockup
- Problem statement dan solusi dijelaskan secara eksplisit

### Strategi Nilai Maksimal

- `30% Problem Solving`
  Learnial fokus pada masalah nyata mahasiswa: memahami materi, mengulang belajar, dan mengelola jadwal akademik.
- `25% AI Integration`
  AI dipakai langsung untuk summary, key points, keyword extraction, mindmap, quiz, flashcard, dan chat assistant.
- `20% Technical Implementation`
  Aplikasi dibangun sebagai Next.js app dengan route API, auth, penyimpanan riwayat, dan UI responsif.
- `15% Presentasi Youtube`
  Flow demo sederhana dan mudah divisualkan: login, upload materi, generate hasil, buat flashcard, simpan jadwal, buka history.
- `10% Kelengkapan & Dokumentasi`
  Repo ini memiliki README, PRD, struktur project yang jelas, dan panduan setup.

## Tech Stack

- `Frontend`: Next.js 16, React 19, Tailwind CSS 4
- `Auth`: Supabase Auth dengan Google OAuth
- `AI Provider`: Google AI Studio API
- `Model`: `gemini-3.1-flash-lite`
- `Database/Storage`: Supabase dan `localStorage` untuk history/schedule lokal
- `Document Parsing`: `pdf-parse`, `mammoth`, `jszip`
- `Icons/UI`: `lucide-react`

## Struktur Fitur

- [D:\WEB\learnial\app\study\page.tsx](D:\WEB\learnial\app\study\page.tsx): halaman AI Study Assistant
- [D:\WEB\learnial\app\flashcard\page.tsx](D:\WEB\learnial\app\flashcard\page.tsx): halaman flashcard generator
- [D:\WEB\learnial\app\schedule\page.tsx](D:\WEB\learnial\app\schedule\page.tsx): halaman schedule planner
- [D:\WEB\learnial\app\history\page.tsx](D:\WEB\learnial\app\history\page.tsx): halaman riwayat hasil generate
- [D:\WEB\learnial\app\dashboard\page.tsx](D:\WEB\learnial\app\dashboard\page.tsx): dashboard utama
- [D:\WEB\learnial\app\api\study\route.js](D:\WEB\learnial\app\api\study\route.js): AI processing untuk study assistant
- [D:\WEB\learnial\app\api\flashcard\route.js](D:\WEB\learnial\app\api\flashcard\route.js): AI processing untuk flashcard
- [D:\WEB\learnial\app\api\chat\route.ts](D:\WEB\learnial\app\api\chat\route.ts): AI chat route

## Menjalankan Project

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Environment Variables

Buat `.env.local` dan isi minimal variabel berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-3.1-flash-lite
```

## Demo Flow Yang Disarankan

1. Login dengan Google
2. Masuk ke dashboard
3. Upload materi kuliah di `AI Study Assistant`
4. Tunjukkan hasil ringkasan, poin penting, keyword, mindmap, dan quiz
5. Masuk ke `Flashcard Generator` dan buat kartu dari materi yang sama
6. Simpan satu agenda di `Smart Schedule Planner`
7. Buka `History` untuk menunjukkan semua hasil tersimpan

## Catatan Akademik

- Project ini mengacu pada arahan UTS berbasis project untuk membangun solusi AI yang nyata dan dapat didemokan.
- Briefing UTS mencontohkan penggunaan `Groq` atau `OpenRouter` sebagai provider AI. Implementasi aktif project ini memakai Google AI Studio, jadi bila dosen mewajibkan provider yang sama persis dengan briefing, provider perlu dikonfirmasi atau disesuaikan kembali.
- API key harus tetap disimpan di `.env.local` atau environment variable, bukan di source code yang dibagikan.
- Jika memakai referensi eksternal, sumber harus dicantumkan dengan jelas dan implementasi harus sudah dimodifikasi secara signifikan.
