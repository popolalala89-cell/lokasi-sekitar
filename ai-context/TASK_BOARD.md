# TASK_BOARD.md — Board Task & Progress

> **Versi:** 2.0 | **Terakhir diupdate:** 1 Juni 2026
>
> **Cara pakai:** Setiap task punya status: `todo`, `in_progress`, `done`, `blocked`.
> Hanya SATU task `in_progress` dalam satu waktu.
> Update status setiap kali ganti task.

---

## Completed: Fase 1 — Maintenance & Dokumentasi ✅

| ID | Task | Status | Assignee | Target |
|----|------|--------|----------|--------|
| DOC-01 | Buat struktur folder (docs/, architecture/, dll.) | ✅ done | AI Agent | 31 Mei |
| DOC-02 | Isi /docs (5 file) | ✅ done | AI Agent | 31 Mei |
| DOC-03 | Isi /architecture (6 file) | ✅ done | AI Agent | 31 Mei |
| DOC-04 | Isi /engineering (7 file) | ✅ done | AI Agent | 31 Mei |
| DOC-05 | Isi /ai-context (5 file) | ✅ done | AI Agent | 31 Mei |
| DOC-06 | Isi /context (4 file) | ✅ done | AI Agent | 31 Mei |
| DOC-07 | Buat CHECKLIST.md | ✅ done | AI Agent | 31 Mei |
| DOC-08 | Final review & commit | ✅ done | AI Agent | 31 Mei |
| DOC-09 | Code review + refactor index.html | ✅ done | AI Agent | 31 Mei |
| DOC-10 | Completion Gate di AGENTS.md + DEC-008 | ✅ done | AI Agent | 1 Juni |

---

## Completed: v2.1 — Misi & Paket ✅

| ID | Task | Priority | Status |
|----|------|----------|--------|
| MSI-01 | Buat tabel `missions` di Supabase | P0 | ✅ done |
| MSI-02 | Buat tabel `packages` di Supabase | P0 | ✅ done |
| MSI-03 | Buat UI Pedagang: Buat Misi | P0 | ✅ done |
| MSI-04 | Buat UI Informan: Lihat Misi Terdekat | P0 | ✅ done |
| MSI-05 | Integrasi laporan dgn misi (mission_id FK) | P0 | ✅ done |
| MSI-06 | Buat UI Pedagang: Beli Paket | P0 | ✅ done |
| MSI-07 | Logika kuota paket (quota_used++) | P0 | ✅ done |

---

## Completed: v2.2 — Gamifikasi & Notifikasi ✅

| ID | Task | Priority | Status |
|----|------|----------|--------|
| GAM-01 | Leaderboard informan (bulanan) | P2 | ✅ done |
| GAM-02 | Badge/achievement system | P2 | ✅ done |
| GAM-03 | Notifikasi real-time (Supabase Realtime) | P1 | ✅ done |
| GAM-04 | Halaman profil + statistik | P2 | ✅ done |

---

## Backlog: v2.3 — Auth & Monetisasi

| ID | Task | Priority | Status | Dependency |
|----|------|----------|--------|------------|
| AUT-01 | Google Login OAuth + deep link Capacitor | P1 | ⬜ todo | — |
| PAY-01 | Payment integration (QRIS/transfer) | P1 | ⬜ todo | MSI-06 |

---

## Backlog: v3.0 — Scale

| ID | Task | Priority | Status |
|----|------|----------|--------|
| SCL-01 | AI auto-verifikasi foto + GPS | P2 | ⬜ todo |
| SCL-02 | Multi-kota support + filter kota | P2 | ⬜ todo |
| SCL-03 | Dashboard statistik lanjutan (pedagang) | P2 | ⬜ todo |
| SCL-04 | Export data CSV | P2 | ⬜ todo |
| SCL-05 | Referral system | P2 | ⬜ todo |

---

## Bug Queue

| ID | Bug | Severity | Status |
|----|-----|----------|--------|
| ERR-005 | Leaderboard gagal load (join syntax) | High | ✅ Fixed (31 Mei) |
| ERR-006 | Kirim laporan misi error (tabel missions) | High | ✅ Fixed (31 Mei) |

---

## Cara Update

```markdown
| AUT-01 | Google Login OAuth | P1 | 🚧 in_progress | AI Agent | 1 Juni |
```

**Status emoji:** ⬜ todo | 🚧 in_progress | ✅ done | ❌ blocked | 🗑️ cancelled

---

*Update board setiap kali mulai/selesai task.*
