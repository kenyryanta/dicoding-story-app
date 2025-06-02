const fs = require("fs");
const path = require("path");

// Membuat folder screenshots jika belum ada
const screenshotsDir = path.join(__dirname, "screenshots");
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Buat placeholder screenshot
const createPlaceholderImage = (width, height, filename) => {
  const svgContent = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#f9f9f9"/>
  <rect x="0" y="0" width="${width}" height="60" fill="#3498db"/>
  <text x="20" y="35" font-family="Arial" font-size="18" fill="white">Dicoding Story App</text>
  <rect x="20" y="80" width="${
    width - 40
  }" height="200" fill="white" stroke="#ddd"/>
  <text x="${width / 2}" y="${
    height / 2
  }" font-family="Arial" font-size="24" text-anchor="middle" fill="#666">App Screenshot</text>
  <text x="${width / 2}" y="${
    height / 2 + 30
  }" font-family="Arial" font-size="16" text-anchor="middle" fill="#999">${width}x${height}</text>
</svg>
  `.trim();

  const filePath = path.join(screenshotsDir, filename);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Generated: ${filename}`);
};

// Generate screenshots
createPlaceholderImage(1280, 720, "screenshot-desktop-1.svg");
createPlaceholderImage(750, 1334, "screenshot-mobile-1.svg");

console.log("Screenshots generated successfully!");
