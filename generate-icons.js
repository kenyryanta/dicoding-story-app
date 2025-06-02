const fs = require("fs");
const path = require("path");

// Fungsi untuk membuat SVG icon
const createSVGIcon = (size) => {
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
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
</svg>
  `.trim();
};

// Membuat folder icons jika belum ada
const iconsDir = path.join(__dirname, "icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate semua ukuran icon
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach((size) => {
  const svgContent = createSVGIcon(size);
  const fileName = `icon-${size}x${size}.svg`;
  const filePath = path.join(iconsDir, fileName);

  fs.writeFileSync(filePath, svgContent);
  console.log(`Generated: ${fileName}`);
});

console.log("All icons generated successfully!");
