import sharp from "sharp";
import fs from "fs";
import path from "path";

const outDir = path.join("public", "icons");
fs.mkdirSync(outDir, { recursive: true });

function svg(size) {
  const r = Math.round(size * 0.22);
  const pad = Math.round(size * 0.18);
  const stroke = Math.max(2, Math.round(size * 0.045));
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a1f"/>
      <stop offset="100%" stop-color="#050506"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.28}" fill="none" stroke="#b8ff3c" stroke-width="${stroke}"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.14}" fill="#b8ff3c"/>
  <path d="M ${pad} ${size*0.72} Q ${size/2} ${size*0.42} ${size-pad} ${size*0.72}" fill="none" stroke="#b8ff3c" stroke-width="${stroke}" stroke-linecap="round" opacity="0.85"/>
</svg>`);
}

for (const size of [180, 192, 512]) {
  await sharp(svg(size)).png().toFile(path.join(outDir, `icon-${size}.png`));
  console.log("wrote", size);
}

const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#050506"/>
  <circle cx="256" cy="256" r="118" fill="none" stroke="#b8ff3c" stroke-width="22"/>
  <circle cx="256" cy="256" r="58" fill="#b8ff3c"/>
  <path d="M 110 360 Q 256 220 402 360" fill="none" stroke="#b8ff3c" stroke-width="22" stroke-linecap="round" opacity="0.85"/>
</svg>`);
await sharp(mask).png().toFile(path.join(outDir, "maskable-512.png"));
console.log("maskable ok");
