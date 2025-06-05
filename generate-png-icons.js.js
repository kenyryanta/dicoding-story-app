const fs = require("fs");
const path = require("path");

// Buat folder icons jika belum ada
const iconsDir = path.join(__dirname, "src", "icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate PNG icons menggunakan Canvas (jika di Node.js environment)
// Atau buat SVG yang bisa dikonversi ke PNG
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach((size) => {
  // Buat SVG yang kompatibel untuk konversi PNG
  const svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3498db;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2980b9;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad1)" rx="${size * 0.1}"/>
  <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="${
    size * 0.2
  }" font-weight="bold" text-anchor="middle" fill="white">DS</text>
  <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="${
    size * 0.08
  }" text-anchor="middle" fill="white">Story</text>
</svg>`;

  const fileName = `icon-${size}x${size}.svg`;
  const filePath = path.join(iconsDir, fileName);

  fs.writeFileSync(filePath, svgContent);
  console.log(`Generated: ${fileName}`);
});

// Generate maskable icon (dengan padding untuk safe area)
const maskableSvg = `<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3498db;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2980b9;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Background yang mengisi seluruh area -->
  <rect width="192" height="192" fill="url(#grad1)"/>
  <!-- Content area dengan padding 20% untuk safe zone -->
  <g transform="translate(38.4, 38.4)">
    <rect width="115.2" height="115.2" fill="none"/>
    <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="30" font-weight="bold" text-anchor="middle" fill="white">DS</text>
    <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="white">Story</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(iconsDir, "icon-maskable-192x192.svg"), maskableSvg);

console.log("All icons generated successfully!");
console.log(
  "\nNote: Untuk production, convert SVG ini ke PNG menggunakan tool seperti:"
);
console.log("- Online: realfavicongenerator.net");
console.log("- CLI: svg2png, sharp, atau imagemagick");
console.log("- Design tool: Figma, Photoshop, GIMP");
