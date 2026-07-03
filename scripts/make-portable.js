// ============================================================
//  POST-PROCESO: BUILD PORTABLE (cualquier subcarpeta)
//
//  Convierte las rutas absolutas de Next (/_next/...) del export
//  estático (out/) a rutas RELATIVAS al documento, para que el tour
//  funcione publicado en CUALQUIER subcarpeta del servidor
//  (dominio.com/loquesea/) sin recompilar.
//
//  Requisitos previos del build:
//    - trailingSlash: true  (el documento se sirve como carpeta/)
//    - assetPath en modo relativo (NEXT_PUBLIC_RELATIVE=1) para los
//      assets de la app (panoramas, hero, logos). Este script solo
//      arregla los assets internos de Next (/_next/...).
//
//  Uso:  node scripts/make-portable.js   (después de `next build`)
// ============================================================
const fs = require('fs');
const path = require('path');

const OUT = path.join(process.cwd(), 'out');

function walk(dir, cb) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, cb);
    else cb(p);
  }
}

if (!fs.existsSync(OUT)) {
  console.error('❌ No existe out/. Ejecuta primero: next build');
  process.exit(1);
}

let html = 0, css = 0;
walk(OUT, (file) => {
  if (file.endsWith('.html')) {
    let s = fs.readFileSync(file, 'utf8');
    // Todas las referencias internas de Next a rutas relativas al documento.
    // Cubre <script>, <link>, preloads y el payload embebido (\"/_next/...\").
    s = s.split('/_next/').join('./_next/');
    fs.writeFileSync(file, s);
    html++;
  } else if (file.endsWith('.css')) {
    let s = fs.readFileSync(file, 'utf8');
    // Los .css viven en /_next/static/chunks/ y referencian fuentes en
    // /_next/static/media/ → ruta relativa desde chunks/ es ../media/.
    const before = s;
    s = s.split('/_next/static/media/').join('../media/');
    if (s !== before) { fs.writeFileSync(file, s); css++; }
  }
});

console.log(`✅ Portable listo. HTML procesados: ${html}, CSS con fuentes ajustadas: ${css}`);
