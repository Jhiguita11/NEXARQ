// ============================================================
//  GENERADOR DE PANORAMAS MOVILES (3000px)
//
//  Crea versiones reducidas a 3000px de ancho de cada panorama
//  equirectangular y las guarda en una subcarpeta `mobile/` junto
//  al original. El viewer carga estas versiones en dispositivos
//  moviles para un recorrido mas fluido; en PC se mantienen los
//  panoramas originales de 8000px.
//
//  Uso:  node scripts/generate-mobile-panoramas.js
//
//  Es idempotente: re-genera siempre desde el original 8000px.
// ============================================================
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const MOBILE_WIDTH = 3000; // 3000x1500 (ratio 2:1 equirectangular) — más liviano en móvil
const JPEG_QUALITY = 80;

// Carpetas que contienen panoramas equirectangulares de fuente.
const SOURCE_DIRS = [
  'public/projects/melendez/valle-alto/panoramas/tipo-a',
  'public/projects/melendez/valle-alto/panoramas/tipo-b',
  'public/projects/melendez/valle-alto/images/exterior',
];

async function processDir(relDir) {
  const dir = path.join(process.cwd(), relDir);
  if (!fs.existsSync(dir)) {
    console.log(`⚠ Saltando (no existe): ${relDir}`);
    return 0;
  }
  const mobileDir = path.join(dir, 'mobile');
  fs.mkdirSync(mobileDir, { recursive: true });

  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g)$/i.test(f) && fs.statSync(path.join(dir, f)).isFile());

  let count = 0;
  for (const file of files) {
    const src = path.join(dir, file);
    const out = path.join(mobileDir, file);
    const meta = await sharp(src).metadata();
    // Si el original ya es <= 4000px, lo copiamos tal cual.
    if ((meta.width ?? 0) <= MOBILE_WIDTH) {
      fs.copyFileSync(src, out);
      console.log(`  = ${file} (${meta.width}px, copiado sin reducir)`);
    } else {
      await sharp(src)
        .resize({ width: MOBILE_WIDTH })
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toFile(out);
      const kb = Math.round(fs.statSync(out).size / 1024);
      console.log(`  ✓ ${file} → ${MOBILE_WIDTH}px (${kb}KB)`);
    }
    count++;
  }
  return count;
}

async function main() {
  console.log(`Generando panoramas moviles (${MOBILE_WIDTH}px)…\n`);
  let total = 0;
  for (const relDir of SOURCE_DIRS) {
    console.log(`=== ${relDir}`);
    total += await processDir(relDir);
  }
  console.log(`\n✅ Listo. ${total} panoramas moviles generados.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
