// Genera los datos de escenas del modo VR a partir de tour.config.ts, que es la
// unica fuente de verdad, y los escribe dentro de public/vr.html entre marcas.
//
// Antes las escenas estaban copiadas a mano en vr.html: solo existia el Tipo B,
// le faltaba el boton de variante ("ver como alcoba") y los yaw se habian ido
// desincronizando del tour web. Generandolo se acaba esa clase de error.
//
// Uso:  bun scripts/generate-vr-scenes.ts
//       (correr tambien scripts/generate-vr-panoramas.mjs por cada tipo, para
//        tener las versiones 4096x2048 que el Quest si puede renderizar)

import { readFile, writeFile } from 'fs/promises';
import { valleAltoTipoA, valleAltoTipoB } from '../src/projects/melendez/valle-alto/tour.config';

const VR_HTML = 'public/vr.html';
const INICIO = '    // <<< ESCENAS GENERADAS — no editar a mano';
const FIN = '    // <<< FIN ESCENAS GENERADAS >>>';

/** '/projects/x/tipo-a/estudio.jpg' → 'projects/x/tipo-a/vr/estudio.jpg'
 *  Relativa (sin barra inicial) para que funcione con o sin basePath, y
 *  apuntando a la carpeta vr/ con los panoramas reducidos. */
function vrPath(p: string): string {
  const i = p.lastIndexOf('/');
  return (p.slice(0, i) + '/vr' + p.slice(i)).replace(/^\/+/, '');
}

/** Prefijo comun de los ids de escena ('va-ta-'), para poder usar claves
 *  cortas iguales en ambos apartamentos y saltar de uno a otro sin perder
 *  la habitacion en la que estabas. */
function commonPrefix(ids: string[]): string {
  if (ids.length < 2) return '';
  let p = ids[0];
  for (const id of ids.slice(1)) {
    while (!id.startsWith(p)) p = p.slice(0, -1);
  }
  return p;
}

function buildTour(cfg: any, key: string) {
  const apt = cfg.buildings[0].apartments[0];
  const scenes: any[] = apt.scenes;
  const prefix = commonPrefix(scenes.map((s) => s.id));
  const shortKey = (id: string) => id.slice(prefix.length);

  const out: Record<string, any> = {};
  for (const s of scenes) {
    const hotspots = s.hotspots
      .filter((h: any) => h.type === 'scene' && h.targetSceneId)
      .map((h: any) => ({
        label: h.label,
        yaw: h.yaw,
        pitch: h.pitch,
        to: shortKey(h.targetSceneId),
        kind: 'scene',
      }));

    // El boton de variante del tour web ("Ver como alcoba" / "Ver como espacio
    // multiple") se traduce a un hotspot mas, en la misma posicion que usa la
    // web (variantButton) y apuntando a la escena enlazada por la variante.
    const link = (s.variants ?? []).find((v: any) => v.linkSceneId);
    if (link && s.variantButton) {
      hotspots.push({
        label: 'Ver ' + link.label.charAt(0).toLowerCase() + link.label.slice(1),
        yaw: s.variantButton.yaw,
        pitch: s.variantButton.pitch,
        to: shortKey(link.linkSceneId),
        kind: 'variant',
      });
    }

    out[shortKey(s.id)] = { id: s.id, name: s.name, img: vrPath(s.panorama), hotspots };
  }

  return {
    id: key,
    name: apt.name,
    area: apt.area,
    areaPrivada: apt.areaPrivada,
    inicio: shortKey(scenes[0].id),
    scenes: out,
  };
}

const TOURS = {
  a: buildTour(valleAltoTipoA, 'a'),
  b: buildTour(valleAltoTipoB, 'b'),
};

const bloque =
  INICIO +
  '; sale de tour.config.ts.\n' +
  '    // Regenerar con:  bun scripts/generate-vr-scenes.ts >>>\n' +
  '    var TOURS = ' +
  JSON.stringify(TOURS, null, 2).split('\n').join('\n    ') +
  ';\n' +
  FIN;

const html = await readFile(VR_HTML, 'utf8');
const desde = html.indexOf(INICIO);
const hasta = html.indexOf(FIN);
if (desde === -1 || hasta === -1) {
  console.error(`No encuentro las marcas en ${VR_HTML}. Debe contener:\n${INICIO}...\n${FIN}`);
  process.exit(1);
}
await writeFile(VR_HTML, html.slice(0, desde) + bloque + html.slice(hasta + FIN.length), 'utf8');

for (const t of Object.values(TOURS)) {
  const n = Object.keys(t.scenes).length;
  const v = Object.values(t.scenes).filter((s: any) =>
    s.hotspots.some((h: any) => h.kind === 'variant'),
  ).length;
  console.log(`✓ ${t.name}: ${n} escenas, ${v} con boton de variante`);
}
console.log(`\nEscrito en ${VR_HTML}`);
