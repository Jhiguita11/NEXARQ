const sharp = require('sharp');
const path = require('path');

const file = process.argv[2];

(async () => {
  const img = sharp(file, { limitInputPixels: false });
  const meta = await img.metadata();
  const W = meta.width, H = meta.height;
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;

  // Detectar pixeles cian: R bajo, G y B altos y parecidos
  const pts = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * ch;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r < 120 && g > 150 && b > 150 && Math.abs(g - b) < 80) {
        pts.push([x, y]);
      }
    }
  }

  // Clustering por union-find sobre rejilla (vecinos dentro de R px)
  const R = Math.max(8, Math.round(W * 0.02));
  const parent = pts.map((_, i) => i);
  function find(a) { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; }
  function uni(a, b) { parent[find(a)] = find(b); }

  // index espacial simple por celda
  const cell = R;
  const grid = new Map();
  const key = (cx, cy) => cx + ',' + cy;
  pts.forEach(([x, y], idx) => {
    const cx = Math.floor(x / cell), cy = Math.floor(y / cell);
    const k = key(cx, cy);
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push(idx);
  });
  pts.forEach(([x, y], idx) => {
    const cx = Math.floor(x / cell), cy = Math.floor(y / cell);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      const arr = grid.get(key(cx + dx, cy + dy));
      if (!arr) continue;
      for (const j of arr) {
        const dxp = pts[j][0] - x, dyp = pts[j][1] - y;
        if (dxp * dxp + dyp * dyp <= R * R) uni(idx, j);
      }
    }
  });

  const clusters = new Map();
  pts.forEach(([x, y], idx) => {
    const root = find(idx);
    if (!clusters.has(root)) clusters.set(root, { n: 0, sx: 0, sy: 0 });
    const c = clusters.get(root);
    c.n++; c.sx += x; c.sy += y;
  });

  const result = [...clusters.values()]
    .filter(c => c.n > 40) // descartar ruido
    .map(c => ({ x: c.sx / c.n, y: c.sy / c.n, n: c.n }))
    .sort((a, b) => a.y - b.y);

  console.log('Imagen: ' + W + 'x' + H + '  | pixeles cian: ' + pts.length + '  | burbujas: ' + result.length);
  console.log('---');
  result.forEach((c, i) => {
    const px = (c.x / W * 100).toFixed(1);
    const py = (c.y / H * 100).toFixed(1);
    console.log(`#${i + 1}  dotX: ${px},  dotY: ${py}   (px ${Math.round(c.x)},${Math.round(c.y)}  n=${c.n})`);
  });
})();
