// ============================================================
//  POST-PROCESO: BUILD PORTABLE (cualquier subcarpeta)
//
//  Convierte las rutas de Next (/_next/...) a RELATIVAS, para que el
//  tour funcione publicado en CUALQUIER subcarpeta del servidor
//  (dominio.com/loquesea/) sin recompilar.
//
//  IMPORTANTE: NO se renombra la carpeta _next. El runtime de Turbopack
//  exige que la ruta del script contenga "/_next/" (hace
//  currentScript.src.indexOf("/_next/") y lanza error si no está), así
//  que renombrarla rompe el arranque (pantalla negra). Se conserva _next.
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

let html = 0, css = 0;
walk(OUT, (file) => {
  if (file.endsWith('.html')) {
    let s = fs.readFileSync(file, 'utf8');
    // Rutas internas de Next -> relativas al documento (conservando /_next/).
    // Cubre <script>, <link>, preloads y el payload embebido (\"/_next/...\").
    s = s.split('/_next/').join('./_next/');
    fs.writeFileSync(file, s);
    html++;
  } else if (file.endsWith('.css')) {
    let s = fs.readFileSync(file, 'utf8');
    // Los .css viven en _next/static/chunks/ y referencian fuentes en
    // _next/static/media/ -> ruta relativa desde chunks/ es ../media/.
    const before = s;
    s = s.split('/_next/static/media/').join('../media/');
    if (s !== before) { fs.writeFileSync(file, s); css++; }
  }
});

console.log(`✅ Portable listo (conservando _next). HTML: ${html}, CSS: ${css}`);
