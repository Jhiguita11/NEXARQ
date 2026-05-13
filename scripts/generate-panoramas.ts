import sharp from 'sharp';
import path from 'path';

const ROOMS = [
  { id: 'entrada', name: 'Entrada', subtitle: 'Hall Principal', bg1: '#1a1a2e', bg2: '#16213e', accent: '#e2e8f0' },
  { id: 'sala', name: 'Sala de Estar', subtitle: 'Zona Social', bg1: '#1e3a5f', bg2: '#0f2847', accent: '#fbbf24' },
  { id: 'cocina', name: 'Cocina', subtitle: 'Área de Preparación', bg1: '#1a2f1a', bg2: '#0d1f0d', accent: '#34d399' },
  { id: 'dormitorio', name: 'Dormitorio', subtitle: 'Suite Principal', bg1: '#2d1b4e', bg2: '#1a0f2e', accent: '#a78bfa' },
  { id: 'bano', name: 'Baño', subtitle: 'Baño Principal', bg1: '#0c3547', bg2: '#071e2b', accent: '#67e8f9' },
  { id: 'terraza', name: 'Terraza', subtitle: 'Área Exterior', bg1: '#4a2040', bg2: '#2d1028', accent: '#fb923c' },
];

function createEquirectangularSVG(room: typeof ROOMS[0]): string {
  const W = 2048;
  const H = 1024;

  const vLines = Array.from({ length: 17 }, (_, i) => {
    const x = (i / 16) * W;
    return `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>`;
  }).join('');

  const hLines = Array.from({ length: 9 }, (_, i) => {
    const y = (i / 8) * H;
    return `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>`;
  }).join('');

  const roomW = 900;
  const roomH = 400;
  const roomX = (W - roomW) / 2;
  const roomY = (H - roomH) / 2 + 20;
  const ceilY = roomY + roomH * 0.35;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${room.bg1}"/>
        <stop offset="50%" stop-color="${room.bg2}"/>
        <stop offset="100%" stop-color="${room.bg1}"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="45%" r="40%">
        <stop offset="0%" stop-color="${room.accent}" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="${room.accent}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(255,255,255,0.08)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
      </linearGradient>
      <linearGradient id="wallLeft" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="rgba(255,255,255,0.04)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.01)"/>
      </linearGradient>
      <linearGradient id="wallRight" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0%" stop-color="rgba(255,255,255,0.04)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.01)"/>
      </linearGradient>
      <linearGradient id="wallBack" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="rgba(255,255,255,0.06)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    ${vLines}${hLines}
    <path d="M${roomX} ${ceilY} L${roomX + roomW} ${ceilY} L${W} ${H} L0 ${H} Z" fill="url(#floor)" opacity="0.6"/>
    <path d="M${roomX} ${roomY} L${roomX} ${ceilY} L0 ${H} L0 ${roomY + roomH * 0.2} Z" fill="url(#wallLeft)"/>
    <path d="M${roomX + roomW} ${roomY} L${roomX + roomW} ${ceilY} L${W} ${H} L${W} ${roomY + roomH * 0.2} Z" fill="url(#wallRight)"/>
    <rect x="${roomX}" y="${roomY}" width="${roomW}" height="${ceilY - roomY}" fill="url(#wallBack)" rx="2"/>
    <line x1="${roomX + 40}" y1="${ceilY}" x2="${roomX + roomW - 40}" y2="${ceilY}" stroke="${room.accent}" stroke-width="1.5" opacity="0.15"/>
    <rect x="${W/2 - 120}" y="${roomY + 30}" width="240" height="${ceilY - roomY - 50}" rx="4" fill="${room.accent}" opacity="0.06"/>
    <rect x="${W/2 - 115}" y="${roomY + 35}" width="230" height="${ceilY - roomY - 60}" rx="2" fill="none" stroke="${room.accent}" stroke-width="0.5" opacity="0.1"/>
    <text x="${W/2}" y="${H/2 + 10}" text-anchor="middle" dominant-baseline="middle" fill="${room.accent}" font-family="system-ui, sans-serif" font-size="56" font-weight="700" letter-spacing="4" opacity="0.25">${room.name}</text>
    <text x="${W/2}" y="${H/2 + 60}" text-anchor="middle" dominant-baseline="middle" fill="rgba(255,255,255,0.15)" font-family="system-ui, sans-serif" font-size="18" font-weight="400" letter-spacing="6">${room.subtitle}</text>
    <text x="30" y="${H - 20}" fill="rgba(255,255,255,0.12)" font-family="monospace" font-size="11">360° PLACEHOLDER</text>
    <text x="${W - 200}" y="${H - 20}" fill="rgba(255,255,255,0.08)" font-family="monospace" font-size="11">MIES 360</text>
  </svg>`;
}

async function main() {
  const outDir = path.join(process.cwd(), 'public', 'panoramas');
  
  for (const room of ROOMS) {
    const svg = createEquirectangularSVG(room);
    const outPath = path.join(outDir, `${room.id}.png`);
    await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(outPath);
    console.log(`✓ Generated: ${room.id}.png`);
  }
  
  console.log(`\n✅ All ${ROOMS.length} placeholder panoramas generated!`);
}

main().catch(console.error);
