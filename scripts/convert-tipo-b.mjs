import sharp from 'sharp';
import { readdir, rename } from 'fs/promises';
import { join } from 'path';

const DIR = 'public/projects/melendez/valle-alto/panoramas/tipo-b';

const MAP = {
  'CM_VALTO_APTO B_ACCESO.tiff':        'acceso.jpg',
  'CM_VALTO_APTOB_ALCOBA_AUX.tiff':     'alcoba-auxiliar.jpg',
  'CM_VALTO_APTOB_ALCOBA_OP2.tiff':     'alcoba-opcion-2.jpg',
  'CM_VALTO_APTOB_ALCOBA_PPAL.tiff':    'alcoba-principal.jpg',
  'CM_VALTO_APTOB_BAÑO_ALCOBA.tiff':    'bano.jpg',
  'CM_VALTO_APTOB_ESTUDIO.tiff':        'estudio.jpg',
  'CM_VALTO_APTOB_SALA.tiff':           'sala.jpg',
};

for (const [src, dest] of Object.entries(MAP)) {
  const srcPath  = join(DIR, src);
  const destPath = join(DIR, dest);
  process.stdout.write(`Convirtiendo ${src} → ${dest} ... `);
  try {
    const info = await sharp(srcPath)
      .resize({ width: 8192, withoutEnlargement: true })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(destPath);
    console.log(`OK (${(info.size / 1024 / 1024).toFixed(1)} MB)`);
  } catch (e) {
    console.log(`ERROR: ${e.message}`);
  }
}

console.log('\n¡Conversión completa!');
