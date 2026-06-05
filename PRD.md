# Product Requirements Document

## 1. Informasi Dasar

- `Nama Produk`: Learnial
- `Jenis Produk`: Web-based AI academic productivity application
- `Mata Kuliah`: UTS Kecerdasan Buatan 2026
- `Tim Developer`:
  - Amelia Riski Kurniawati `(24.01.55.0013)`
  - J3R-Design

## 2. Latar Belakang

Mahasiswa membutuhkan alat yang dapat membantu mereka memahami materi lebih cepat, mengubah materi menjadi format belajar aktif, dan menjaga agenda akademik tetap tertata. Proses manual untuk merangkum dokumen, menyusun flashcard, dan mencatat jadwal sering memakan waktu, tidak konsisten, dan mudah membuat deadline atau konsep penting terlewat.

Learnial dibangun sebagai solusi problem-solving berbasis AI yang fokus pada satu domain nyata, yaitu produktivitas belajar mahasiswa.

## 3. Problem Statement

Mahasiswa mengalami kesulitan untuk:

1. Merangkum materi kuliah yang panjang menjadi inti pembelajaran yang mudah dipahami.
2. Mengubah materi menjadi alat belajar ulang yang efektif seperti flashcard dan quiz.
3. Mengelola agenda belajar dan kuliah dalam satu tempat yang terstruktur.

## 4. Tujuan Produk

### Tujuan Pengguna

- Membantu mahasiswa memahami materi lebih cepat
- Mempermudah review menjelang kuis, UTS, dan UAS
- Menyusun aktivitas akademik lebih rapi

### Tujuan Produk

- Menyediakan minimal satu fitur AI yang benar-benar dipakai di alur inti
- Menghadirkan aplikasi web yang dapat langsung didemokan saat presentasi
- Menunjukkan integrasi AI, UX, dan implementasi teknis yang matang

## 5. Target Pengguna

Target utama:

- Mahasiswa aktif

Target sekunder:

- Mahasiswa yang sedang mempersiapkan presentasi, ujian, atau review materi intensif

## 6. Scope Produk

### In Scope

- Login Google
- Upload file `PDF`, `DOCX`, `PPTX`
- Input materi dalam bentuk teks
- Generate ringkasan
- Generate poin penting
- Generate kata kunci
- Generate mindmap teks
- Generate quiz pilihan ganda dan essay
- Generate flashcard dari materi
- Simpan agenda belajar atau kuliah manual
- Tampilkan riwayat hasil aktivitas pengguna

### Out of Scope

- Kolaborasi multi-user real-time
- Kalender dua arah dengan Google Calendar
- Reminder email otomatis yang benar-benar terkirim
- OCR gambar jadwal kuliah
- Analitik belajar berbasis machine learning yang kompleks

## 7. Fitur Inti

### 7.1 AI Study Assistant

Input:

- file materi atau teks materi

Output:

- ringkasan terstruktur
- poin penting
- kata kunci
- mindmap teks
- quiz belajar

Value:

- membantu mahasiswa memahami inti materi dengan cepat

### 7.2 Flashcard Generator

Input:

- file atau teks materi

Output:

- 10 flashcard tanya-jawab

Value:

- membantu proses active recall dan hafalan konsep

### 7.3 Smart Schedule Planner

Input:

- nama kegiatan
- hari
- waktu
- email opsional

Output:

- agenda tersimpan dan tampil di daftar jadwal

Value:

- membantu pengguna menjaga ritme kuliah dan belajar

### 7.4 History Belajar

Output:

- daftar hasil AI Study Assistant
- daftar flashcard yang pernah dibuat
- daftar jadwal yang pernah disimpan

Value:

- memudahkan audit penggunaan fitur dan kontinuitas belajar

## 8. User Flow Utama

1. Pengguna login menggunakan Google
2. Pengguna masuk ke dashboard
3. Pengguna memilih salah satu fitur:
   - study assistant
   - flashcard generator
   - schedule planner
4. Sistem memproses input
5. Hasil ditampilkan dengan UI yang mudah dipindai
6. Aktivitas tersimpan ke history

## 9. Requirement Fungsional

- Sistem harus menyediakan web app yang bisa diakses melalui browser
- Sistem harus memiliki minimal satu fitur AI yang fungsional
- Sistem harus menerima input file `PDF`, `DOCX`, dan `PPTX`
- Sistem harus menerima input teks manual
- Sistem harus menampilkan hasil AI tanpa reload manual oleh pengguna
- Sistem harus menyimpan hasil aktivitas ke history lokal
- Sistem harus menampilkan jadwal yang telah disimpan
- Sistem harus membatasi akses halaman utama ke pengguna yang sudah login

## 10. Requirement Non-Fungsional

- UI harus responsif pada desktop dan laptop
- Demo harus bisa berjalan stabil di localhost
- Navigasi harus sederhana dan mudah dipahami dosen saat demo
- Waktu respons AI harus cukup cepat untuk presentasi
- API key tidak boleh diletakkan di source code publik

## 11. Arsitektur Solusi

### Frontend

- Next.js 16
- React 19
- Tailwind CSS 4

### Backend / Server Logic

- Next.js Route Handlers

### AI

- Google AI Studio API
- Model: `gemini-3.1-flash-lite`
- Catatan compliance: briefing UTS mencontohkan `Groq / OpenRouter`, sementara implementasi aktif project ini memakai Google AI Studio

### Auth

- Supabase Auth dengan Google OAuth

### Data

- Supabase untuk kebutuhan backend project
- `localStorage` untuk history lokal dan jadwal lokal

## 12. Acceptance Criteria

### AI Study Assistant

- pengguna bisa upload file atau tempel teks
- sistem menghasilkan ringkasan, poin penting, kata kunci, mindmap, dan quiz
- hasil tampil rapi dan terbaca

### Flashcard Generator

- pengguna bisa menghasilkan flashcard dari file atau teks
- pengguna dapat membalik dan menavigasi kartu

### Schedule Planner

- pengguna bisa menyimpan agenda baru
- agenda langsung muncul di daftar

### History

- hasil generate tersimpan dan bisa dibuka kembali

## 13. Kesesuaian Dengan Kriteria Penilaian UTS

### 30% Problem Solving

Learnial memiliki problem statement yang spesifik: mahasiswa kesulitan memahami materi, mengulang belajar, dan menjaga agenda akademik. Solusi yang diberikan langsung menargetkan masalah tersebut.

### 25% AI Integration

AI bukan fitur dekoratif. AI dipakai untuk:

- summarization
- keyword extraction
- key points
- quiz generation
- flashcard generation
- assistant chat

### 20% Technical Implementation

Implementasi teknis mencakup:

- arsitektur Next.js app router
- route API terpisah
- auth dengan Supabase
- UI responsif
- penyimpanan history
- struktur fitur yang jelas

### 15% Presentasi Youtube

Project memiliki flow demo yang mudah:

1. login
2. upload materi
3. lihat hasil AI
4. generate flashcard
5. simpan jadwal
6. buka history

### 10% Kelengkapan & Dokumentasi

Repo dilengkapi dengan:

- `README.md`
- `PRD.md`
- struktur kode yang jelas
- panduan setup lokal

## 14. Tahapan Pelaksanaan

Disesuaikan dengan briefing:

1. `22 Mei`  
   Briefing, brainstorming, define problem statement
2. `23-24 Mei`  
   Perancangan arsitektur, setup repo, setup AI API
3. `25-27 Mei`  
   Development fitur inti dan integrasi AI
4. `28 Mei`  
   Testing, bug fixing, polishing, dan persiapan demo
5. `29 Mei`  
   Penilaian project, submit repository dan link demo/presentasi

## 15. Risiko dan Mitigasi

- `Risiko`: AI provider gagal merespons saat demo  
  `Mitigasi`: siapkan materi pendek-menengah dan koneksi stabil

- `Risiko`: login Google belum terkonfigurasi  
  `Mitigasi`: selesaikan setup Supabase OAuth sebelum demo

- `Risiko`: hasil AI terlalu panjang atau tidak rapi  
  `Mitigasi`: gunakan prompt terstruktur dan UI hasil yang mudah dipindai

- `Risiko`: fitur terlalu banyak tapi tidak matang  
  `Mitigasi`: prioritaskan kualitas alur inti yang benar-benar jalan

## 16. Definition of Success

Project dianggap berhasil bila:

- aplikasi bisa dibuka dan dipakai saat demo
- AI feature utama berjalan nyata
- problem statement jelas dan relevan
- dosen dapat melihat kontribusi aplikasi pada kebutuhan mahasiswa
- dokumentasi cukup untuk menjelaskan setup, flow, dan value produk
