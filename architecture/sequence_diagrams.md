# Sequence Diagrams — Lokasi Sekitar

> **Versi:** 1.0 | **Terakhir diupdate:** 31 Mei 2026
>
> Diagram sekuens untuk interaksi kritis. Format: mermaid (bisa dirender di GitHub).

---

## SD-001: Registrasi User Baru

```mermaid
sequenceDiagram
    actor User
    participant App as WebView
    participant Supabase as Supabase Auth
    participant DB as Supabase DB

    User->>App: Isi form: email, password, role
    App->>App: Validasi email format
    App->>Supabase: supabase.auth.signUp({email, password})
    Supabase-->>App: {user, session}
    App->>DB: INSERT INTO users (id, email, role)
    DB-->>App: OK
    App->>User: Redirect ke dashboard
```

---

## SD-002: Informan Kirim Laporan

```mermaid
sequenceDiagram
    actor Informan
    participant App as WebView
    participant Camera as Capacitor Camera
    participant GPS as Capacitor Geolocation
    participant Storage as Supabase Storage
    participant DB as Supabase DB

    Informan->>App: Tap "Lapor Sekarang"
    App->>Camera: Camera.getPhoto()
    Camera-->>App: {base64, format}
    App->>GPS: Geolocation.getCurrentPosition()
    GPS-->>App: {lat, lng}
    App->>App: validateGPS(lat, lng)
    App->>Storage: upload('foto.jpg', base64Data)
    Storage-->>App: {publicUrl}
    App->>DB: INSERT submissions (foto_url, lat, lng, user_id, status='pending')
    DB-->>App: {id, created_at}
    App->>Informan: Toast: "Laporan terkirim! Menunggu verifikasi"
```

---

## SD-003: Admin Verifikasi Laporan (Approve)

```mermaid
sequenceDiagram
    actor Admin
    participant App as WebView
    participant DB as Supabase DB

    Admin->>App: Buka Dashboard Admin
    App->>DB: SELECT * FROM submissions WHERE status='pending'
    DB-->>App: [{id, foto_url, lat, lng, ...}]
    App->>Admin: Tampilkan list laporan
    Admin->>App: Klik "Verifikasi" di laporan #42
    App->>DB: UPDATE submissions SET status='verified' WHERE id=42
    App->>DB: UPDATE users SET balance = balance + 10 WHERE id=user_id
    App->>DB: INSERT INTO transactions (user_id, type='reward', amount=10, ref_id=42)
    DB-->>App: OK
    App->>Admin: Toast: "Laporan diverifikasi! +10 poin ke informan"
```

---

## SD-004: Pedagang Lihat Peta + Laporan

```mermaid
sequenceDiagram
    actor Pedagang
    participant App as WebView
    participant Maps as Leaflet.js
    participant DB as Supabase DB

    Pedagang->>App: Buka tab "Peta"
    App->>Maps: L.map('map').setView([lokasi])
    Maps-->>App: Peta ditampilkan
    App->>DB: SELECT lat, lng, foto_url, catatan FROM submissions WHERE status='verified'
    DB-->>App: [{lat, lng, foto_url, catatan}, ...]
    loop Setiap laporan verified
        App->>App: offsetGPS(lat, lng) → random 50-200m
        App->>Maps: L.marker([lat, lng]).bindPopup(html_detail)
    end
    Maps-->>Pedagang: Tampilkan marker di peta
    Pedagang->>App: Klik marker
    App->>Pedagang: Popup: foto thumbnail + catatan
```

---

## SD-005: CI/CD Build & Release APK

```mermaid
sequenceDiagram
    actor Dev as Pa Popo (via Termux)
    participant GitHub
    participant Actions as GitHub Actions
    participant Artifacts

    Dev->>GitHub: git push origin main
    GitHub->>Actions: Trigger workflow (push)
    Actions->>Actions: Setup JDK 17 + Android SDK
    Actions->>Actions: npm ci
    Actions->>Actions: npx cap sync android
    Actions->>Actions: ./gradlew assembleDebug
    Actions->>Artifacts: Upload APK debug
    Note over Dev,Artifacts: Dev download dari tab Artifacts

    Dev->>GitHub: git tag v1.5.6 && git push origin v1.5.6
    GitHub->>Actions: Trigger workflow (tag v*)
    Actions->>Actions: ./gradlew assembleRelease
    Actions->>Actions: Sign APK with keystore
    Actions->>Artifacts: Upload APK release (signed)
    Note over Dev,Artifacts: Dev download release APK
```

---

## SD-006: Offline → Online Sync

```mermaid
sequenceDiagram
    actor Informan
    participant App as WebView (offline)
    participant LS as localStorage
    participant DB as Supabase DB

    Informan->>App: Kirim laporan (offline)
    App->>App: isOnline() → false
    App->>LS: Simpan laporan di pending_reports[]
    App->>Informan: "Laporan disimpan. Akan dikirim saat online"

    Note over App: ... beberapa saat kemudian ...

    App->>App: window 'online' event fired
    App->>LS: Ambil pending_reports[]
    loop Setiap pending report (FIFO)
        App->>DB: submitReport(data)
        DB-->>App: OK
        App->>LS: Hapus dari pending_reports[]
    end
    App->>Informan: Toast: "3 laporan terkirim!"
```

---

*Tambahkan sequence diagram baru untuk setiap interaksi kompleks (>3 langkah).*
