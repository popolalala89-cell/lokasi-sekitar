#!/data/data/com.termux/files/usr/bin/bash

# Lokasi Sekitar - Quick Setup Script
# Jalankan di folder project: ./setup.sh

echo "📍 Lokasi Sekitar - Setup"
echo "========================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak terinstall"
    echo "   Install dengan: pkg install nodejs"
    exit 1
fi

echo "✅ Node.js: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Gagal install dependencies"
    exit 1
fi

echo ""
echo "🔄 Syncing Capacitor..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "❌ Gagal sync Capacitor"
    exit 1
fi

echo ""
echo "✅ Setup selesai!"
echo ""
echo "Langkah selanjutnya:"
echo "1. git init"
echo "2. git add ."
echo "3. git commit -m \"Initial commit\""
echo "4. git remote add origin https://github.com/USERNAME/REPO.git"
echo "5. git push -u origin main"
echo ""
echo "APK akan otomatis build di GitHub Actions!"
