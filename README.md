# 🧠 Psychotest Frontend (React + Vite)

> Aplikasi Web Admin dan Portal Peserta untuk sistem Psikotes (DISC, MBTI, Kraepelin) berbasis React dan Vite. Terintegrasi dengan Backend Laravel milik Rangga.

## 📸 Preview (Sementara)
- **Login Page:** Role-based authentication (Admin / Candidate).
- **Dashboard Admin:** Manajemen data kandidat, paket tes, dan hasil.
- **Candidate Portal:** Halaman khusus peserta tes (dalam pengembangan).

---

## 🚀 Teknologi yang Digunakan

- **React 18** (Library UI)
- **Vite** (Build tool & Dev server super cepat)
- **Tailwind CSS** (Styling responsif)
- **React Router DOM v6** (Routing & Protected Route)
- **Axios** (HTTP Client untuk komunikasi API)
- **React Hook Form** (Manajemen form login & register)
- **React Hot Toast** (Notifikasi interaktif)
- **Lucide React** (Library ikon modern)

---

## 📁 Struktur Folder Utama

```bash
src/
├── api/                # Konfigurasi Axios & Interceptor
├── features/           # Fitur utama berdasarkan folder (Auth, Dashboard, Candidate)
├── layout/             # Layout Global (MainLayout, CandidateLayout)
├── routes/             # Routing (AppRoutes.jsx & Protected Route)
├── services/           # Fungsi pemanggilan API (authService, dll)
└── utils/              # Fungsi pembantu (opsional)
