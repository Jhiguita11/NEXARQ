// ============================================================
//  POST-PROCESO: BUILD PORTABLE Y BLINDADO (cualquier subcarpeta)
//
//  1) Convierte las rutas de Next (/_next/...) a RELATIVAS, para que el
//     tour funcione en CUALQUIER subcarpeta del servidor sin recompilar.
//  2) Renombra la carpeta "_next" -> "assets" (sin guion bajo), porque
//     algunos hostings compartidos bloquean carpetas que empiezan por "_".
//
//  Requisitos del build:
//    - trailingSlash: true
//    - assetPath en modo relativo (NEXT_PUBLIC_RELATIVE=1)
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

// 1) Renombrar la carpeta _next -> assets (evita bloqueo del guion bajo).
const nextDir = path.join(OUT, '_next');
const assetsDir = path.join(OUT, 'assets');
if (fs.existsSync(nextDir)) {
  if (fs.existsSync(assetsDir)) fs.rmSync(assetsDir, { recursive: true, force: true });
  fs.renameSync(nextDir, assetsDir);
}

// 2) Reescribir referencias en HTML y CSS.
let html = 0, css = 0;
walk(OUT, (file) => {
  if (file.endsWith('.html')) {
    let s = fs.readFileSync(file, 'utf8');
    // Rutas internas de Next -> relativas al documento y con carpeta "assets".
    // Cubre <script>, <link>, preloads y el payload embebido (\"/_next/...\").
    s = s.split('/_next/').join('./assets/');
    fs.writeFileSync(file, s);
    html++;
  } else if (file.endsWith('.css')) {
    let s = fs.readFileSync(file, 'utf8');
    // Los .css viven en assets/static/chunks/ y referencian fuentes en
    // assets/static/media/ -> ruta relativa desde chunks/ es ../media/.
    const before = s;
    s = s.split('/_next/static/media/').join('../media/');
    if (s !== before) { fs.writeFileSync(file, s); css++; }
  }
});

console.log(`✅ Portable + blindado listo. _next->assets renombrado. HTML: ${html}, CSS: ${css}`);
