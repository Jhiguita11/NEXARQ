// Genera versiones reducidas (4096x2048) de los panoramas para el modo VR.
// El Quest no renderiza texturas de 8000x4000 en WebXR estéreo (se ven negras).
// El tour 2D (Pannellum) sigue usando los originales en alta resolución.
//
// Uso: node scripts/generate-vr-panoramas.mjs <carpeta-de-panoramas>
// Genera las versiones en <carpeta>/vr/<archivo>.jpg

import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, extname } from 'path';

const VR_WIDTH = 4096;
const VR_HEIGHT = 2048;
const QUALITY = 82;

const dir = process.argv[2] || 'public/projects/melendez/valle-alto/panoramas/tipo-b';
const outDir = join(dir, 'vr');

const files = (await readdir(dir)).filter((f) => /\.(jpg|jpeg|png)$/i.test(f));
await mkdir(outDir, { recursive: true });

for (const file of files) {
  const out = join(outDir, file.replace(extname(file), '.jpg'));
  await sharp(join(dir, file))
    .resize(VR_WIDTH, VR_HEIGHT, { fit: 'fill' })
    .jpeg({ quality: QUALITY })
    .toFile(out);
  console.log(`✓ ${file} → vr/${file.replace(extname(file), '.jpg')} (${VR_WIDTH}x${VR_HEIGHT})`);
}
console.log(`\nListo: ${files.length} panoramas VR generados en ${outDir}`);
