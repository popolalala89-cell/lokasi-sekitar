# TASK_BOARD.md — Board Task & Progress

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026
>
> **Cara pakai:** Setiap task punya status: `todo`, `in_progress`, `done`, `blocked`.
> Hanya SATU task `in_progress` dalam satu waktu.
> Update status setiap kali ganti task.

---

## Current Sprint: Dokumentasi Fondasi

| ID | Task | Status | Assignee | Target |
|----|------|--------|----------|--------|
| DOC-01 | Buat struktur folder (docs/, architecture/, dll.) | ✅ done | Hermes Agent | 31 Mei |
| DOC-02 | Isi /docs (5 file) | ✅ done | Hermes Agent | 31 Mei |
| DOC-03 | Isi /architecture (6 file) | ✅ done | Hermes Agent | 31 Mei |
| DOC-04 | Isi /engineering (7 file) | ✅ done | Hermes Agent | 31 Mei |
| DOC-05 | Isi /ai-context (5 file) | 🚧 in_progress | Hermes Agent | 31 Mei |
| DOC-06 | Isi /context (4 file) | ⬜ todo | Hermes Agent | 31 Mei |
| DOC-07 | Buat CHECKLIST.md | ⬜ todo | Hermes Agent | 31 Mei |
| DOC-08 | Final review & commit | ⬜ todo | Hermes Agent | 31 Mei |

---

## Backlog: v2.1 — Misi & Paket

| ID | Task | Priority | Status | Dependency |
|----|------|----------|--------|------------|
| MSI-01 | Buat tabel `missions` di Supabase | P0 | ⬜ todo | — |
| MSI-02 | Buat tabel `packages` di Supabase | P0 | ⬜ todo | — |
| MSI-03 | Buat UI Pedagang: Buat Misi | P0 | ⬜ todo | MSI-01 |
| MSI-04 | Buat UI Informan: Lihat Misi Terdekat | P0 | ⬜ todo | MSI-01 |
| MSI-05 | Integrasi laporan dgn misi (mission_id FK) | P0 | ⬜ todo | MSI-03, MSI-04 |
| MSI-06 | Buat UI Pedagog: Beli Paket | P0 | ⬜ todo | MSI-02 |
| MSI-07 | Logika kuota paket (quota_used++) | P0 | ⬜ todo | MSI-02, MSI-06 |
| MSI-08 | Payment integration (QRIS/transfer) | P1 | ⬜ todo | MSI-06 |
| MSI-09 | Halaman riwayat misi (pedagang) | P1 | ⬜ todo | MSI-03 |
| MSI-10 | Halaman riwayat partisipasi misi (informan) | P1 | ⬜ todo | MSI-04 |

---

## Backlog: v2.2 — Gamifikasi & Notifikasi

| ID | Task | Priority | Status | Dependency |
|----|------|----------|--------|------------|
| GAM-01 | Leaderboard informan (bulanan) | P2 | ⬜ todo | — |
| GAM-02 | Badge/achievement system | P2 | ⬜ todo | GAM-01 |
| GAM-03 | Notifikasi real-time (Supabase Realtime) | P1 | ⬜ todo | — |
| GAM-04 | Broadcast notifikasi ke semua user | P1 | ⬜ todo | GAM-03 |

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
| — | (tidak ada bug outstanding) | — | — |

---

## Cara Update

```markdown
| MSI-03 | Buat UI Pedagang: Buat Misi | P0 | 🚧 in_progress | Assignee | Target |
```

**Status emoji:** ⬜ todo | 🚧 in_progress | ✅ done | ❌ blocked | 🗑️ cancelled

---

*Update board setiap kali mulai/selesai task.*
