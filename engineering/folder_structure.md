# Folder Structure — Lokasi Sekitar

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026
>
> **PENTING:** Struktur ini adalah KONTRAK. Jangan pindahkan file tanpa update dokumen ini.

---

## Complete Project Tree

```
lokasi-sekitar/
│
├── 📄 README.md                       # Overview project + setup + build
├── 📄 QUICKSTART.md                   # Panduan singkat mulai development
├── 📄 .gitignore                      # Ignore node_modules, android/, .env
├── 📄 package.json                    # Dependencies npm
├── 📄 package-lock.json               # Lockfile (jangan edit manual)
├── 📄 capacitor.config.json           # Config Capacitor (appId, plugins)
├── 📄 setup.sh                        # Script setup Termux (chmod +x)
│
├── 📂 www/                            # 🌐 WEB APP SOURCE
│   ├── 📄 index.html                  # Single-file SPA (HTML+CSS+JS)
│   └── 📂 lib/                        # Library lokal (opsional)
│       ├── 📄 supabase.js             # Supabase CDN fallback
│       └── 📄 leaflet/                # Leaflet.js lokal (jika offline)
│
├── 📂 android/                        # 🤖 ANDROID (GENERATED)
│   │   ⚠️ JANGAN EDIT MANUAL!
│   │   ⚠️ Digenerate oleh: npx cap sync android
│   │
│   ├── 📂 app/
│   │   ├── 📂 src/main/
│   │   │   ├── 📂 assets/             # www/ hasil sync + capacitor plugins
│   │   │   ├── 📂 java/               # Capacitor bridge (Java)
│   │   │   └── 📄 AndroidManifest.xml # Generated
│   │   └── 📄 build.gradle
│   ├── 📄 gradlew                     # Gradle wrapper (Linux/Android)
│   ├── 📄 gradlew.bat                 # Gradle wrapper (Windows)
│   └── 📂 gradle/
│
├── 📂 .github/                        # 🔧 CI/CD CONFIG
│   └── 📂 workflows/
│       └── 📄 android-build.yml       # Build APK via GitHub Actions
│
├── 📂 supabase/                       # 🗄️ DATABASE MIGRATIONS
│   ├── 📄 supabase-setup.sql          # Full schema + RLS policies
│   ├── 📄 supabase-storage.sql        # Storage bucket + policies
│   └── 📄 supabase-poin.sql           # Poin trigger/function
│
├── 📂 docs/                           # 📋 DOKUMENTASI BISNIS
│   ├── 📄 business-vision.md          # Visi, model bisnis, target
│   ├── 📄 prd.md                      # User stories, requirements
│   ├── 📄 user_personas.md            # Persona pengguna
│   ├── 📄 business_rules.md           # Aturan bisnis (BR-001 s/d BR-100)
│   └── 📄 glossary.md                 # Istilah baku
│
├── 📂 architecture/                   # 🏗️ DOKUMENTASI ARSITEKTUR
│   ├── 📄 system_map.md               # Diagram high-level system
│   ├── 📄 architecture.md             # Keputusan arsitektur
│   ├── 📄 tech_stack.md               # Library + tools + versi
│   ├── 📄 module_map.md               # Mapping modul ke file
│   ├── 📄 data_flow.md                # Diagram alur data
│   └── 📄 sequence_diagrams.md        # Sequence diagram (mermaid)
│
├── 📂 engineering/                    # ⚙️ ATURAN TEKNIS
│   ├── 📄 coding_rules.md             # Konvensi kode (CR-001 s/d CR-100)
│   ├── 📄 folder_structure.md         # FILE INI
│   ├── 📄 api_contract.md             # Kontrak API (Supabase queries)
│   ├── 📄 database_schema.md          # Schema lengkap + relasi
│   ├── 📄 security_rules.md           # Aturan keamanan
│   ├── 📄 error_handling.md           # Strategi error handling
│   └── 📄 performance_rules.md        # Aturan performa
│
├── 📂 ai-context/                     # 🤖 KONTEKS UNTUK AI AGENT
│   ├── 📄 AGENTS.md                   # ⭐ WAJIB DIBACA oleh setiap AI agent
│   ├── 📄 PROJECT_MEMORY.md           # Sejarah project, pelajaran
│   ├── 📄 DECISIONS.md                # Log keputusan teknis + alasan
│   ├── 📄 CURRENT_STATE.md            # State project saat ini
│   └── 📄 TASK_BOARD.md               # Board task + progress
│
└── 📂 context/                        # 📊 RINGKASAN OTOMATIS
    ├── 📄 latest_schema_summary.md    # Ringkasan schema terbaru
    ├── 📄 latest_api_summary.md       # Ringkasan API queries
    ├── 📄 latest_feature_summary.md   # Ringkasan fitur terbaru
    └── 📄 dependency_graph.md         # Graph dependensi
```

---

## Rules

1. **JANGAN EDIT MANUAL folder `android/`** — selalu gunakan `npx cap sync android`
2. **JANGAN PINDAHKAN file** tanpa update dokumen ini
3. **JANGAN HAPUS folder** tanpa persetujuan (via clarify)
4. **Semua kode aplikasi** ada di `www/index.html` (single file)
5. **Semua SQL** ada di folder `supabase/`
6. **JANGAN TAMBAH package npm** tanpa update `tech_stack.md` dan record di `DECISIONS.md`

---

## Apa yang di-Git-Ignore?

```
node_modules/
android/            # Generated — tidak di-commit
.env                # Supabase keys (jangan commit!)
*.keystore          # Signing key
*.jks               # Java KeyStore
```

**Yang DICOMMIT ke git:**
- `www/` (source code)
- `supabase/` (SQL schema)
- Semua folder dokumentasi
- `package.json`, `package-lock.json`
- `capacitor.config.json`
- `.github/workflows/`

---

*Update file ini setiap kali struktur folder berubah.*
