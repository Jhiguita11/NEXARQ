import { TourConfig } from '@/lib/tour-types';
import { assetPath } from '@/lib/asset-path';

// ╔══════════════════════════════════════════════════════════════════════╗
// ║  TEMPLATE DE PROYECTO — NEXARQ 360 / MIESGROUP                       ║
// ║                                                                      ║
// ║  USO:                                                                ║
// ║  1. Copia esta carpeta _template/ a:                                 ║
// ║       src/projects/<constructora>/<nombre-proyecto>/                 ║
// ║  2. Renombra las referencias a _CONSTRUCTORA_ y _PROYECTO_           ║
// ║  3. Copia la carpeta de assets a:                                    ║
// ║       public/projects/<constructora>/<nombre-proyecto>/              ║
// ║  4. Llena los datos reales del proyecto                              ║
// ║                                                                      ║
// ║  MODO UN SOLO TOUR:                                                  ║
// ║    Usa el bloque templateConfig (un export default)                  ║
// ║                                                                      ║
// ║  MODO MULTI-TOUR (varias tipologias):                                ║
// ║    Usa el patron templateTipoA / templateTipoB que aparece           ║
// ║    comentado al final del archivo. Ver proyecto de referencia:       ║
// ║    src/projects/melendez/valle-alto/tour.config.ts                   ║
// ╚══════════════════════════════════════════════════════════════════════╝

// ─── CAMBIAR: reemplaza estas rutas base ──────────────────────────────
const CONSTRUCTORA = '_constructora_';    // ejemplo: 'melendez', 'ospinas', 'amarilo'
const PROYECTO     = '_proyecto_';        // ejemplo: 'valle-alto', 'san-pablo', 'reserva'

// ─── Modo un solo tour: una ruta de panoramas ─────────────────────────
const PANO  = (path: string) => assetPath(`/projects/${CONSTRUCTORA}/${PROYECTO}/panoramas/${path}`);
const BRAND = (path: string) => assetPath(`/projects/${CONSTRUCTORA}/branding/${path}`);

// ─── Modo multi-tour: una ruta por tipologia ─────────────────────────
// const PANO_A = (path: string) => assetPath(`/projects/${CONSTRUCTORA}/${PROYECTO}/panoramas/tipo-a/${path}`);
// const PANO_B = (path: string) => assetPath(`/projects/${CONSTRUCTORA}/${PROYECTO}/panoramas/tipo-b/${path}`);

// ─────────────────────────────────────────────────────────────────────
//  MODO UN SOLO TOUR
// ─────────────────────────────────────────────────────────────────────
const templateConfig: TourConfig = {

  brand: {
    name: '_NOMBRE DEL PROYECTO_',           // ejemplo: 'Valle Alto'
    tagline: '_NOMBRE DE LA CONSTRUCTORA_',  // ejemplo: 'Constructora Melendez'
    logo: BRAND('logo-constructora-white.png'),
    website: 'https://www.constructora.com',
  },

  theme: {
    primary: '#D4AF37',        // Color primario (dorado NEXARQ por defecto)
    secondary: '#B8962E',
    panelBg: 'rgba(0, 0, 0, 0.80)',
    textPrimary: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.45)',
    borderColor: 'rgba(212, 175, 55, 0.15)',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },

  buildings: [
    {
      id: 'torre-a',
      name: 'Torre A',
      floors: 1,               // ACTUALIZAR
      apartmentsPerFloor: 1,   // ACTUALIZAR
      apartments: [
        {
          id: `${PROYECTO}-101`,
          name: 'Apto 101',
          description: 'Sala · Cocina · Alcoba',
          floor: 0,
          position: 0,
          bedrooms: 2,
          bathrooms: 1,
          area: 60,
          scenes: [
            {
              id: `${PROYECTO}-101-sala`,
              name: 'Sala',
              description: 'Sala principal',
              panorama: PANO('torre-a/apto-101/sala.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              hotspots: [],
            },
            // ─── Agregar mas escenas aqui ───────────────────────
          ],
          floorPlan: {
            width: 300,
            height: 200,
            background: 'rgba(0, 0, 0, 0.6)',
            rooms: [
              {
                id: `fp-${PROYECTO}-101-sala`,
                sceneId: `${PROYECTO}-101-sala`,
                label: 'Sala',
                x: 10, y: 10, width: 100, height: 100,
                fill: 'rgba(255,255,255,0.08)',
                stroke: 'rgba(255,255,255,0.2)',
                adjacentTo: [],
              },
            ],
          },
        },
      ],
    },
  ],

  autoRotateSpeed: -0.5,
  showFloorPlan: true,
  showWelcome: true,
};

export default templateConfig;


// ─────────────────────────────────────────────────────────────────────
//  MODO MULTI-TOUR (varias tipologias de apartamento)
//  Descomenta este bloque, borra templateConfig de arriba y
//  activa PANO_A / PANO_B en lugar de PANO.
//
//  Referencia real: src/projects/melendez/valle-alto/tour.config.ts
// ─────────────────────────────────────────────────────────────────────

/*

const sharedBrand = {
  name: '_NOMBRE DEL PROYECTO_',
  tagline: '_NOMBRE DE LA CONSTRUCTORA_',
  logo: BRAND('logo-constructora-white.png'),
  website: 'https://www.constructora.com',
};

const sharedTheme = {
  primary: '#D4AF37',
  secondary: '#B8962E',
  panelBg: 'rgba(0, 0, 0, 0.80)',
  textPrimary: '#ffffff',
  textMuted: 'rgba(255, 255, 255, 0.45)',
  borderColor: 'rgba(212, 175, 55, 0.15)',
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
};

export const templateTipoA: TourConfig = {
  brand: sharedBrand,
  theme: sharedTheme,
  buildings: [
    {
      id: PROYECTO,
      name: '_NOMBRE DEL PROYECTO_',
      floors: 1,
      apartmentsPerFloor: 1,
      apartments: [
        {
          id: `${PROYECTO}-tipo-a`,
          name: 'Apartamento Tipo A',
          description: 'Sala · Cocina · Alcoba Principal · Bano · Balcon',
          floor: 0,
          position: 0,
          bedrooms: 2,
          bathrooms: 2,
          area: 72,
          scenes: [
            {
              id: `${PROYECTO}-ta-sala`,
              name: 'Sala',
              description: 'Sala principal',
              panorama: PANO_A('sala.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              hotspots: [],
            },
            // Agregar mas escenas...
          ],
          floorPlan: {
            width: 300,
            height: 200,
            background: 'rgba(0, 0, 0, 0.6)',
            rooms: [
              {
                id: `fp-${PROYECTO}-ta-sala`,
                sceneId: `${PROYECTO}-ta-sala`,
                label: 'Sala',
                x: 10, y: 10, width: 100, height: 100,
                fill: 'rgba(255,255,255,0.08)',
                stroke: 'rgba(255,255,255,0.2)',
                adjacentTo: [],
              },
            ],
          },
        },
      ],
    },
  ],
  autoRotateSpeed: -0.5,
  showFloorPlan: true,
  showWelcome: true,
};

export const templateTipoB: TourConfig = {
  brand: sharedBrand,
  theme: sharedTheme,
  buildings: [
    {
      id: PROYECTO,
      name: '_NOMBRE DEL PROYECTO_',
      floors: 1,
      apartmentsPerFloor: 1,
      apartments: [
        {
          id: `${PROYECTO}-tipo-b`,
          name: 'Apartamento Tipo B',
          description: 'Sala · Cocina · Alcoba Principal · Bano · Balcon',
          floor: 0,
          position: 0,
          bedrooms: 2,
          bathrooms: 1,
          area: 60,
          scenes: [
            {
              id: `${PROYECTO}-tb-sala`,
              name: 'Sala',
              description: 'Sala principal',
              panorama: PANO_B('sala.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              hotspots: [],
            },
            // Agregar mas escenas...
          ],
          floorPlan: {
            width: 300,
            height: 200,
            background: 'rgba(0, 0, 0, 0.6)',
            rooms: [
              {
                id: `fp-${PROYECTO}-tb-sala`,
                sceneId: `${PROYECTO}-tb-sala`,
                label: 'Sala',
                x: 10, y: 10, width: 100, height: 100,
                fill: 'rgba(255,255,255,0.08)',
                stroke: 'rgba(255,255,255,0.2)',
                adjacentTo: [],
              },
            ],
          },
        },
      ],
    },
  ],
  autoRotateSpeed: -0.5,
  showFloorPlan: true,
  showWelcome: true,
};

export default templateTipoA;

*/
