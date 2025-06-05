const fs = require("fs");
const path = require("path");

// Buat folder screenshots jika belum ada
const screenshotsDir = path.join(__dirname, "src", "screenshots");
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Desktop screenshot dengan ukuran yang tepat (1280x720)
const desktopSvg = `<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1280" height="720" fill="#f8f9fa"/>
  
  <!-- Header -->
  <rect x="0" y="0" width="1280" height="80" fill="#3498db"/>
  <text x="40" y="45" font-family="Arial, sans-serif" font-size="24" fill="white" font-weight="bold">📖 Dicoding Story</text>
  
  <!-- Navigation -->
  <rect x="800" y="20" width="450" height="40" fill="rgba(255,255,255,0.1)" rx="20"/>
  <text x="830" y="42" font-family="Arial, sans-serif" font-size="14" fill="white">🏠 Home</text>
  <text x="920" y="42" font-family="Arial, sans-serif" font-size="14" fill="white">➕ Add Story</text>
  <text x="1020" y="42" font-family="Arial, sans-serif" font-size="14" fill="white">💾 Offline</text>
  <text x="1120" y="42" font-family="Arial, sans-serif" font-size="14" fill="white">🔔 Notifications</text>
  
  <!-- Content area -->
  <rect x="40" y="100" width="1200" height="580" fill="white" stroke="#e9ecef" stroke-width="1" rx="12"/>
  
  <!-- Title -->
  <text x="80" y="140" font-family="Arial, sans-serif" font-size="28" fill="#2c3e50" font-weight="bold">Cerita Terbaru</text>
  <text x="80" y="170" font-family="Arial, sans-serif" font-size="16" fill="#6c757d">Berikut adalah cerita terbaru dari pengguna Dicoding Story</text>
  
  <!-- Story grid -->
  <rect x="80" y="200" width="360" height="200" fill="#fff" stroke="#dee2e6" stroke-width="1" rx="8"/>
  <rect x="80" y="200" width="360" height="140" fill="#e3f2fd"/>
  <text x="260" y="330" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#495057">📖 Story Card 1</text>
  <text x="260" y="350" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#6c757d">by John Doe</text>
  <text x="260" y="370" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#6c757d">📍 Jakarta • ⏰ 2 hours ago</text>
  
  <rect x="460" y="200" width="360" height="200" fill="#fff" stroke="#dee2e6" stroke-width="1" rx="8"/>
  <rect x="460" y="200" width="360" height="140" fill="#e8f5e8"/>
  <text x="640" y="330" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#495057">📸 Story Card 2</text>
  <text x="640" y="350" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#6c757d">by Jane Smith</text>
  <text x="640" y="370" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#6c757d">📍 Bandung • ⏰ 4 hours ago</text>
  
  <rect x="840" y="200" width="360" height="200" fill="#fff" stroke="#dee2e6" stroke-width="1" rx="8"/>
  <rect x="840" y="200" width="360" height="140" fill="#fff3e0"/>
  <text x="1020" y="330" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#495057">🌅 Story Card 3</text>
  <text x="1020" y="350" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#6c757d">by Bob Wilson</text>
  <text x="1020" y="370" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#6c757d">📍 Surabaya • ⏰ 6 hours ago</text>
  
  <!-- Map area -->
  <rect x="80" y="420" width="1120" height="220" fill="#e8f4f8" stroke="#81d4fa" stroke-width="2" rx="8"/>
  <text x="640" y="540" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#0277bd" font-weight="bold">🗺️ Interactive Story Map</text>
  <text x="640" y="565" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#0288d1">Klik pada marker untuk melihat cerita</text>
  
  <!-- Map markers simulation -->
  <circle cx="300" cy="500" r="8" fill="#e74c3c"/>
  <circle cx="500" cy="480" r="8" fill="#2ecc71"/>
  <circle cx="800" cy="520" r="8" fill="#f39c12"/>
  <circle cx="1000" cy="490" r="8" fill="#9b59b6"/>
</svg>`;

// Mobile screenshot dengan ukuran yang tepat (750x1334) - sesuai iPhone 6/7/8 Plus
const mobileSvg = `<svg width="750" height="1334" viewBox="0 0 750 1334" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="750" height="1334" fill="#f8f9fa"/>
  
  <!-- Status bar -->
  <rect x="0" y="0" width="750" height="44" fill="#2c3e50"/>
  <text x="30" y="28" font-family="Arial, sans-serif" font-size="16" fill="white" font-weight="bold">9:41</text>
  <text x="680" y="28" font-family="Arial, sans-serif" font-size="14" fill="white">100%</text>
  
  <!-- Header -->
  <rect x="0" y="44" width="750" height="88" fill="#3498db"/>
  <text x="30" y="95" font-family="Arial, sans-serif" font-size="24" fill="white" font-weight="bold">📖 Dicoding Story</text>
  
  <!-- Navigation bar -->
  <rect x="0" y="132" width="750" height="70" fill="#2980b9"/>
  <text x="80" y="170" font-family="Arial, sans-serif" font-size="16" fill="white">🏠</text>
  <text x="200" y="170" font-family="Arial, sans-serif" font-size="16" fill="white">➕</text>
  <text x="320" y="170" font-family="Arial, sans-serif" font-size="16" fill="white">💾</text>
  <text x="440" y="170" font-family="Arial, sans-serif" font-size="16" fill="white">🔔</text>
  <text x="560" y="170" font-family="Arial, sans-serif" font-size="16" fill="white">👤</text>
  
  <!-- Content area -->
  <rect x="20" y="220" width="710" height="1044" fill="white" stroke="#e9ecef" stroke-width="1" rx="12"/>
  
  <!-- Title -->
  <text x="40" y="260" font-family="Arial, sans-serif" font-size="24" fill="#2c3e50" font-weight="bold">Cerita Terbaru</text>
  <text x="40" y="285" font-family="Arial, sans-serif" font-size="14" fill="#6c757d">Cerita dari pengguna Dicoding Story</text>
  
  <!-- Story cards mobile layout -->
  <rect x="40" y="310" width="670" height="220" fill="#fff" stroke="#dee2e6" stroke-width="1" rx="8"/>
  <rect x="40" y="310" width="670" height="150" fill="#e3f2fd"/>
  <text x="375" y="420" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#495057" font-weight="bold">📖 Adventure in Bali</text>
  <text x="375" y="445" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#6c757d">by Sarah Johnson</text>
  <text x="375" y="465" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#6c757d">📍 Bali • ⏰ 1 hour ago</text>
  <text x="375" y="485" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#6c757d">Amazing sunset at Tanah Lot temple...</text>
  <rect x="600" y="500" width="80" height="20" fill="#3498db" rx="10"/>
  <text x="640" y="512" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle">Save Offline</text>
  
  <rect x="40" y="550" width="670" height="220" fill="#fff" stroke="#dee2e6" stroke-width="1" rx="8"/>
  <rect x="40" y="550" width="670" height="150" fill="#e8f5e8"/>
  <text x="375" y="660" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#495057" font-weight="bold">🏔️ Mountain Hiking</text>
  <text x="375" y="685" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#6c757d">by Mike Chen</text>
  <text x="375" y="705" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#6c757d">📍 Gunung Bromo • ⏰ 3 hours ago</text>
  <text x="375" y="725" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#6c757d">Incredible sunrise view from the crater...</text>
  <rect x="600" y="740" width="80" height="20" fill="#3498db" rx="10"/>
  <text x="640" y="752" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle">Save Offline</text>
  
  <rect x="40" y="790" width="670" height="220" fill="#fff" stroke="#dee2e6" stroke-width="1" rx="8"/>
  <rect x="40" y="790" width="670" height="150" fill="#fff3e0"/>
  <text x="375" y="900" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#495057" font-weight="bold">🏖️ Beach Vacation</text>
  <text x="375" y="925" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#6c757d">by Lisa Wong</text>
  <text x="375" y="945" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#6c757d">📍 Lombok • ⏰ 5 hours ago</text>
  <text x="375" y="965" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#6c757d">Perfect day at Pink Beach with crystal...</text>
  <rect x="600" y="980" width="80" height="20" fill="#3498db" rx="10"/>
  <text x="640" y="992" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle">Save Offline</text>
  
  <!-- Map preview -->
  <rect x="40" y="1030" width="670" height="200" fill="#e8f4f8" stroke="#81d4fa" stroke-width="2" rx="8"/>
  <text x="375" y="1140" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#0277bd" font-weight="bold">🗺️ Story Locations</text>
  <text x="375" y="1165" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#0288d1">Tap to explore on map</text>
  
  <!-- FAB Button -->
  <circle cx="650" cy="1180" r="35" fill="#3498db" stroke="white" stroke-width="3"/>
  <text x="650" y="1190" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" font-weight="bold">+</text>
</svg>`;

// Write files
fs.writeFileSync(
  path.join(screenshotsDir, "screenshot-desktop-1.svg"),
  desktopSvg
);
fs.writeFileSync(
  path.join(screenshotsDir, "screenshot-mobile-1.svg"),
  mobileSvg
);

console.log("Screenshots generated with correct dimensions:");
console.log("- Desktop: 1280x720px");
console.log("- Mobile: 750x1334px");
console.log(
  "\nNext: Convert SVG to PNG with exact dimensions for production use."
);
