import { TourConfig } from '@/lib/tour-types';
import { assetPath } from '@/lib/asset-path';

// ============================================================
//  VALLE ALTO — CONSTRUCTORA MELENDEZ
//  Producido por MIESGROUP para Constructora Melendez
//
//  TOURS DISPONIBLES:
//    valleAltoTipoA  — Apartamento Tipo A (modelo mayor)
//    valleAltoTipoB  — Apartamento Tipo B (modelo menor)
//
//  INSTRUCCIONES:
//  1. Coloca los panoramas en sus carpetas correspondientes:
//       public/projects/melendez/valle-alto/panoramas/tipo-a/
//       public/projects/melendez/valle-alto/panoramas/tipo-b/
//  2. Ajusta defaultView (pitch, yaw) probando en el viewer
//  3. Reconfigura hotspots: ubica pitch/yaw apuntando al cuarto destino
//  4. Ajusta rooms del floorPlan midiendo sobre el plano del arquitecto
//
//  ACTIVACION:
//    Importar valleAltoTipoA o valleAltoTipoB en tour-store.ts
// ============================================================

// --- Rutas base de assets ---
const PANO_A  = (path: string) => assetPath(`/projects/melendez/valle-alto/panoramas/tipo-a/${path}`);
const PANO_B  = (path: string) => assetPath(`/projects/melendez/valle-alto/panoramas/tipo-b/${path}`);
const BRAND   = (path: string) => assetPath(`/projects/melendez/branding/${path}`);
const PLAN    = (path: string) => assetPath(`/projects/melendez/valle-alto/floor-plans/${path}`);

// --- Bloque de marca compartido por ambos tours ---
const sharedBrand = {
  name: 'Valle Alto',
  tagline: 'Constructora Meléndez',
  logo: BRAND('LogoValleAltoSinFondo.png'),
  website: 'https://www.constructoramelendez.com',
};

// --- Tema visual compartido — Paleta Valle Alto ---
const sharedTheme = {
  primary: '#C8CF6A',
  secondary: '#E8D9B0',
  panelBg: 'rgba(58, 50, 43, 0.90)',
  textPrimary: '#F5EDD8',
  textMuted: 'rgba(232, 217, 176, 0.50)',
  borderColor: 'rgba(200, 207, 106, 0.18)',
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
};

// ============================================================
//  TOUR — APARTAMENTO TIPO A
//
//  Escenas: Entrada · Sala · Cocina · Alcoba Principal · Bano Principal · Balcon
//  Panoramas: public/projects/melendez/valle-alto/panoramas/tipo-a/
// ============================================================
export const valleAltoTipoA: TourConfig = {

  brand: sharedBrand,
  theme: sharedTheme,

  buildings: [
    {
      id: 'valle-alto',
      name: 'Valle Alto',
      floors: 1,
      apartmentsPerFloor: 1,

      apartments: [
        {
          id: 'va-tipo-a',
          name: 'Apartamento Tipo A',
          description: 'Entrada · Sala · Cocina · Alcoba Principal · Bano Principal · Balcon',
          floor: 0,
          position: 0,
          bedrooms: 2,
          bathrooms: 2,
          area: 72,

          scenes: [

            // --- ESCENA: ENTRADA ---
            {
              id: 'va-ta-entrada',
              name: 'Entrada',
              description: 'Hall de acceso',
              panorama: PANO_A('entrada.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              hotspots: [
                {
                  id: 'va-ta-ent-to-sala',
                  pitch: 0, yaw: 45,
                  type: 'scene',
                  label: 'Sala',
                  description: 'Ir a la sala',
                  targetSceneId: 'va-ta-sala',
                },
                {
                  id: 'va-ta-ent-to-cocina',
                  pitch: 0, yaw: -45,
                  type: 'scene',
                  label: 'Cocina',
                  description: 'Ir a la cocina',
                  targetSceneId: 'va-ta-cocina',
                },
              ],
            },

            // --- ESCENA: SALA ---
            {
              id: 'va-ta-sala',
              name: 'Sala',
              description: 'Sala y comedor',
              panorama: PANO_A('sala.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              hotspots: [
                {
                  id: 'va-ta-sala-to-ent',
                  pitch: 0, yaw: 180,
                  type: 'scene',
                  label: 'Entrada',
                  description: 'Ir a la entrada',
                  targetSceneId: 'va-ta-entrada',
                },
                {
                  id: 'va-ta-sala-to-cocina',
                  pitch: 0, yaw: 90,
                  type: 'scene',
                  label: 'Cocina',
                  description: 'Ir a la cocina',
                  targetSceneId: 'va-ta-cocina',
                },
                {
                  id: 'va-ta-sala-to-alcoba',
                  pitch: 0, yaw: -90,
                  type: 'scene',
                  label: 'Alcoba Principal',
                  description: 'Ir a la alcoba principal',
                  targetSceneId: 'va-ta-alcoba-principal',
                },
                {
                  id: 'va-ta-sala-to-balcon',
                  pitch: 0, yaw: 0,
                  type: 'scene',
                  label: 'Balcon',
                  description: 'Ir al balcon',
                  targetSceneId: 'va-ta-balcon',
                },
              ],
            },

            // --- ESCENA: COCINA ---
            {
              id: 'va-ta-cocina',
              name: 'Cocina',
              description: 'Cocina integral',
              panorama: PANO_A('cocina.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              hotspots: [
                {
                  id: 'va-ta-coc-to-sala',
                  pitch: 0, yaw: 0,
                  type: 'scene',
                  label: 'Sala',
                  description: 'Ir a la sala',
                  targetSceneId: 'va-ta-sala',
                },
              ],
            },

            // --- ESCENA: ALCOBA PRINCIPAL ---
            {
              id: 'va-ta-alcoba-principal',
              name: 'Alcoba Principal',
              description: 'Alcoba principal con closet',
              panorama: PANO_A('alcoba-principal.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              hotspots: [
                {
                  id: 'va-ta-alc-to-bano',
                  pitch: 0, yaw: 90,
                  type: 'scene',
                  label: 'Bano Principal',
                  description: 'Ir al bano principal',
                  targetSceneId: 'va-ta-bano-principal',
                },
                {
                  id: 'va-ta-alc-to-sala',
                  pitch: 0, yaw: 180,
                  type: 'scene',
                  label: 'Sala',
                  description: 'Volver a la sala',
                  targetSceneId: 'va-ta-sala',
                },
              ],
            },

            // --- ESCENA: BANO PRINCIPAL ---
            {
              id: 'va-ta-bano-principal',
              name: 'Bano Principal',
              description: 'Bano privado de la alcoba principal',
              panorama: PANO_A('bano-principal.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              hotspots: [
                {
                  id: 'va-ta-bano-to-alc',
                  pitch: 0, yaw: 0,
                  type: 'scene',
                  label: 'Alcoba Principal',
                  description: 'Volver a la alcoba',
                  targetSceneId: 'va-ta-alcoba-principal',
                },
              ],
            },

            // --- ESCENA: BALCON ---
            {
              id: 'va-ta-balcon',
              name: 'Balcon',
              description: 'Balcon con vista al conjunto',
              panorama: PANO_A('balcon.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              hotspots: [
                {
                  id: 'va-ta-bal-to-sala',
                  pitch: 0, yaw: 180,
                  type: 'scene',
                  label: 'Sala',
                  description: 'Volver a la sala',
                  targetSceneId: 'va-ta-sala',
                },
              ],
            },

          ],

          floorPlan: {
            width: 300,
            height: 200,
            background: 'rgba(0, 0, 0, 0.6)',
            rooms: [
              {
                id: 'fp-ta-entrada',
                sceneId: 'va-ta-entrada',
                label: 'Entrada',
                x: 120, y: 80, width: 60, height: 40,
                fill: 'rgba(255,255,255,0.08)',
                stroke: 'rgba(255,255,255,0.2)',
                adjacentTo: ['va-ta-sala'],
              },
              {
                id: 'fp-ta-sala',
                sceneId: 'va-ta-sala',
                label: 'Sala',
                x: 10, y: 10, width: 100, height: 100,
                fill: 'rgba(255,255,255,0.08)',
                stroke: 'rgba(255,255,255,0.2)',
                adjacentTo: ['va-ta-entrada', 'va-ta-cocina', 'va-ta-alcoba-principal', 'va-ta-balcon'],
              },
              {
                id: 'fp-ta-cocina',
                sceneId: 'va-ta-cocina',
                label: 'Cocina',
                x: 120, y: 10, width: 80, height: 60,
                fill: 'rgba(255,255,255,0.08)',
                stroke: 'rgba(255,255,255,0.2)',
                adjacentTo: ['va-ta-sala'],
              },
              {
                id: 'fp-ta-alcoba',
                sceneId: 'va-ta-alcoba-principal',
                label: 'Alc. Ppal',
                x: 210, y: 10, width: 80, height: 90,
                fill: 'rgba(255,255,255,0.08)',
                stroke: 'rgba(255,255,255,0.2)',
                adjacentTo: ['va-ta-sala', 'va-ta-bano-principal'],
              },
              {
                id: 'fp-ta-bano',
                sceneId: 'va-ta-bano-principal',
                label: 'Bano',
                x: 210, y: 110, width: 80, height: 50,
                fill: 'rgba(255,255,255,0.08)',
                stroke: 'rgba(255,255,255,0.2)',
                adjacentTo: ['va-ta-alcoba-principal'],
              },
              {
                id: 'fp-ta-balcon',
                sceneId: 'va-ta-balcon',
                label: 'Balcon',
                x: 10, y: 120, width: 100, height: 60,
                fill: 'rgba(255,255,255,0.08)',
                stroke: 'rgba(255,255,255,0.2)',
                adjacentTo: ['va-ta-sala'],
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


// ============================================================
//  TOUR — APARTAMENTO TIPO B
//
//  Escenas: Acceso · Sala Comedor · Espacio Multiple · Alcoba Principal
//           Alcoba Auxiliar · Espacio Multiple 2 · Bano
//  Panoramas: public/projects/melendez/valle-alto/panoramas/tipo-b/
//    acceso.jpg · sala.jpg · estudio.jpg · alcoba-principal.jpg
//    alcoba-auxiliar.jpg · alcoba-opcion-2.jpg · bano.jpg
// ============================================================
export const valleAltoTipoB: TourConfig = {

  brand: sharedBrand,
  theme: sharedTheme,

  buildings: [
    {
      id: 'valle-alto',
      name: 'Valle Alto',
      floors: 1,
      apartmentsPerFloor: 1,

      apartments: [
        {
          id: 'va-tipo-b',
          name: 'Apartamento Tipo B',
          description: 'Acceso · Sala Comedor · Espacio Multiple · 3 Alcobas · Bano',
          floor: 0,
          position: 1,
          bedrooms: 3,
          bathrooms: 1,
          area: 60,

          scenes: [

            // --- ESCENA: ACCESO ---
            {
              id: 'va-tb-acceso',
              name: 'Acceso',
              description: 'Hall de entrada',
              panorama: PANO_B('acceso.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              playbackAnimations: [
                { from: { pitch: -19.3, yaw: -143   }, to: { pitch: -15.5, yaw: -64.8 } },
                { from: { pitch:  -3.4, yaw:  -20.1 }, to: { pitch:  -3.2, yaw:  35.3 } },
                { from: { pitch:  -6.2, yaw:  128.7 }, to: { pitch:  -5.8, yaw:  45.3 } },
              ],
              hotspots: [
                {
                  id: 'va-tb-acc-to-sala',
                  pitch: 0, yaw: 9.6,
                  type: 'scene',
                  label: 'Sala Comedor',
                  description: 'Ir a la sala',
                  targetSceneId: 'va-tb-sala',
                },
                {
                  id: 'va-tb-acc-to-alc-aux',
                  pitch: -2.2, yaw: -35.6,
                  type: 'scene',
                  label: 'Alcoba Auxiliar',
                  description: 'Ir a la alcoba auxiliar',
                  targetSceneId: 'va-tb-alcoba-auxiliar',
                },
                {
                  id: 'va-tb-acc-to-alc-ppal',
                  pitch: -2.2, yaw: -45.8,
                  type: 'scene',
                  label: 'Alcoba Principal',
                  description: 'Ir a la alcoba principal',
                  targetSceneId: 'va-tb-alcoba-principal',
                },
                {
                  id: 'va-tb-acc-to-estudio',
                  pitch: -9.3, yaw: -55.3,
                  type: 'scene',
                  label: 'Espacio Multiple',
                  description: 'Ir al espacio multiple',
                  targetSceneId: 'va-tb-estudio',
                },
              ],
            },

            // --- ESCENA: SALA COMEDOR ---
            {
              id: 'va-tb-sala',
              name: 'Sala Comedor',
              description: 'Sala y comedor integrados',
              panorama: PANO_B('sala.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              playbackAnimations: [
                { from: { pitch: -12.7, yaw: 131.9 }, to: { pitch: -12.7, yaw: 131.9 } },
                { from: { pitch:  -5.5, yaw: -40.2 }, to: { pitch:  -6.5, yaw:  30.9 } },
              ],
              // Hotspots visibles desde la Sala Comedor (Alcoba Principal NO es visible).
              hotspots: [
                {
                  id: 'va-tb-sala-to-acceso',
                  pitch: 0, yaw: -172.6,
                  type: 'scene',
                  label: 'Acceso',
                  description: 'Ir al acceso',
                  targetSceneId: 'va-tb-acceso',
                },
                {
                  id: 'va-tb-sala-to-estudio',
                  pitch: 0, yaw: -146.4,
                  type: 'scene',
                  label: 'Espacio Multiple',
                  description: 'Ir al espacio multiple',
                  targetSceneId: 'va-tb-estudio',
                },
                {
                  id: 'va-tb-sala-to-alc-aux',
                  pitch: 0, yaw: -99,
                  type: 'scene',
                  label: 'Alcoba Auxiliar',
                  description: 'Ir a la alcoba auxiliar',
                  targetSceneId: 'va-tb-alcoba-auxiliar',
                },
              ],
            },

            // --- ESCENA: ESPACIO MULTIPLE ---
            {
              id: 'va-tb-estudio',
              name: 'Espacio Multiple',
              description: 'Zona flexible / espacio multiple',
              panorama: PANO_B('estudio.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              // Variantes: alternar render del mismo cuarto como estudio o como alcoba.
              // La variante "alcoba" reutiliza el render de "Espacio Multiple 2".
              // La "alcoba" en realidad esta en Espacio Multiple 2.
              // Al activarla NAVEGAMOS a esa escena: floor plan refleja el
              // cambio y cada cuarto tiene su propia calibracion de hotspots.
              variants: [
                {
                  id: 'estudio',
                  label: 'Como estudio',
                  panorama: PANO_B('estudio.jpg'),
                },
                {
                  id: 'alcoba',
                  label: 'Como alcoba',
                  linkSceneId: 'va-tb-alcoba-opcion-2',
                  linkVariantId: 'alcoba',
                },
              ],
              variantButton: { pitch: 3.4, yaw: -146.6 },
              playbackAnimations: [
                { from: { pitch: -2.1, yaw: -114.1 }, to: { pitch: -3.2, yaw: 149.6 } },
              ],
              hotspots: [
                {
                  id: 'va-tb-est-to-sala',
                  pitch: -1.8, yaw: 61.6,
                  type: 'scene',
                  label: 'Sala Comedor',
                  description: 'Volver a la sala',
                  targetSceneId: 'va-tb-sala',
                },
                {
                  id: 'va-tb-est-to-acceso',
                  pitch: -2.1, yaw: 142,
                  type: 'scene',
                  label: 'Acceso',
                  description: 'Ir al acceso',
                  targetSceneId: 'va-tb-acceso',
                },
                {
                  id: 'va-tb-est-to-alc-aux',
                  pitch: -1.7, yaw: -33.7,
                  type: 'scene',
                  label: 'Alcoba Auxiliar',
                  description: 'Ir a la alcoba auxiliar',
                  targetSceneId: 'va-tb-alcoba-auxiliar',
                },
                {
                  id: 'va-tb-est-to-alc-ppal',
                  pitch: -1.3, yaw: -57.1,
                  type: 'scene',
                  label: 'Alcoba Principal',
                  description: 'Ir a la alcoba principal',
                  targetSceneId: 'va-tb-alcoba-principal',
                },
              ],
            },

            // --- ESCENA: ALCOBA PRINCIPAL ---
            {
              id: 'va-tb-alcoba-principal',
              name: 'Alcoba Principal',
              description: 'Alcoba principal con closet',
              panorama: PANO_B('alcoba-principal.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              playbackAnimations: [
                { from: { pitch: -4.5, yaw: -128.8 }, to: { pitch: -3.6, yaw: 23.7 } },
              ],
              hotspots: [
                {
                  id: 'va-tb-alc-ppal-to-estudio',
                  pitch: -1.2, yaw: 149,
                  type: 'scene',
                  label: 'Espacio Multiple',
                  description: 'Ir al espacio multiple',
                  targetSceneId: 'va-tb-estudio',
                },
                {
                  id: 'va-tb-alc-ppal-to-bano',
                  pitch: -0.3, yaw: -118.4,
                  type: 'scene',
                  label: 'Baño Alcoba Principal',
                  description: 'Ir al baño',
                  targetSceneId: 'va-tb-bano',
                },
              ],
            },

            // --- ESCENA: ALCOBA AUXILIAR ---
            {
              id: 'va-tb-alcoba-auxiliar',
              name: 'Alcoba Auxiliar',
              description: 'Segunda alcoba',
              panorama: PANO_B('alcoba-auxiliar.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              playbackAnimations: [
                { from: { pitch: -11.7, yaw: 78.3 }, to: { pitch: -11.2, yaw: -17.8 } },
              ],
              // Sala Comedor NO es visible desde la Alcoba Auxiliar.
              hotspots: [
                {
                  id: 'va-tb-alc-aux-to-estudio',
                  pitch: -1.5, yaw: 176.9,
                  type: 'scene',
                  label: 'Espacio Multiple',
                  description: 'Ir al espacio multiple',
                  targetSceneId: 'va-tb-estudio',
                },
              ],
            },

            // --- ESCENA: ESPACIO MULTIPLE 2 ---
            {
              id: 'va-tb-alcoba-opcion-2',
              name: 'Espacio Multiple 2',
              description: 'Alcoba adicional / cuarto flexible',
              panorama: PANO_B('alcoba-opcion-2.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              // El "espacio multiple" en realidad esta en la escena principal
              // de Espacio Multiple (estudio). Al activarlo NAVEGAMOS alli.
              variants: [
                {
                  id: 'alcoba',
                  label: 'Como alcoba',
                  panorama: PANO_B('alcoba-opcion-2.jpg'),
                },
                {
                  id: 'multiple',
                  label: 'Como espacio multiple',
                  linkSceneId: 'va-tb-estudio',
                  linkVariantId: 'estudio',
                },
              ],
              variantButton: { pitch: 0.8, yaw: 140.1 },
              playbackAnimations: [
                { from: { pitch: -13, yaw: 139.8 }, to: { pitch: -13, yaw: 85.4 } },
              ],
              // Sala Comedor NO es visible desde Espacio Multiple 2.
              hotspots: [
                {
                  id: 'va-tb-op2-to-aux',
                  pitch: -1, yaw: 1,
                  type: 'scene',
                  label: 'Alcoba Auxiliar',
                  description: 'Ir a la alcoba auxiliar',
                  targetSceneId: 'va-tb-alcoba-auxiliar',
                },
              ],
            },

            // --- ESCENA: BAÑO ALCOBA PRINCIPAL ---
            {
              id: 'va-tb-bano',
              name: 'Baño Alcoba Principal',
              description: 'Baño de la alcoba principal',
              panorama: PANO_B('bano.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              playbackAnimations: [
                { from: { pitch: -18.9, yaw: 163.2 }, to: { pitch: -21.5, yaw: -124.3 } },
              ],
              hotspots: [
                {
                  id: 'va-tb-bano-to-alc-ppal',
                  pitch: -0.4, yaw: 7.6,
                  type: 'scene',
                  label: 'Alcoba Principal',
                  description: 'Volver a la alcoba principal',
                  targetSceneId: 'va-tb-alcoba-principal',
                },
              ],
            },

          ],

          // --- PLANO DE PLANTA TIPO B ---
          // Imagen real: CM_VA_Plantas Ambientadas_Piso 1_Obra Blanca_APTO B LUPA_Final_T.jpg
          // dotX/dotY en % del area total de la imagen (basados en marcacion de burbujas cyan)
          // Los rects son areas de click centradas en el dot (no se renderizan visualmente en modo imagen)
          floorPlan: {
            width: 1000,
            height: 800,
            background: 'transparent',
            backgroundImage: PLAN('CM_VA_Plantas Ambientadas_Piso 1_Obra Blanca_APTO B LUPA_Final_T.jpg'),
            rooms: [
              // Acceso — entrada principal (parte inferior derecha)
              {
                id: 'fp-tb-acceso',
                sceneId: 'va-tb-acceso',
                label: 'Acceso',
                x: 720, y: 620, width: 40, height: 40,
                dotX: 74.3, dotY: 65.3,
                adjacentTo: ['va-tb-sala'],
              },
              // Sala Comedor
              {
                id: 'fp-tb-sala',
                sceneId: 'va-tb-sala',
                label: 'Sala Comedor',
                x: 760, y: 210, width: 40, height: 40,
                dotX: 78.4, dotY: 23.6,
                adjacentTo: ['va-tb-acceso', 'va-tb-estudio', 'va-tb-alcoba-auxiliar'],
              },
              // Espacio Multiple — habitacion central con la mesa redonda
              {
                id: 'fp-tb-estudio',
                sceneId: 'va-tb-estudio',
                label: 'Espacio Multiple',
                x: 640, y: 480, width: 40, height: 40,
                dotX: 66.5, dotY: 53.8,
                adjacentTo: ['va-tb-sala', 'va-tb-alcoba-principal', 'va-tb-alcoba-auxiliar'],
              },
              // Alcoba Principal
              {
                id: 'fp-tb-alc-ppal',
                sceneId: 'va-tb-alcoba-principal',
                label: 'Alcoba Principal',
                x: 510, y: 230, width: 40, height: 40,
                dotX: 52.8, dotY: 26.7,
                adjacentTo: ['va-tb-estudio', 'va-tb-bano'],
                // Nota: la conexion con el bano se mantiene aunque solo es bidireccional via hotspots.
              },
              // Alcoba Auxiliar
              {
                id: 'fp-tb-alc-aux',
                sceneId: 'va-tb-alcoba-auxiliar',
                label: 'Alcoba Auxiliar',
                x: 590, y: 210, width: 40, height: 40,
                dotX: 61, dotY: 24.2,
                adjacentTo: ['va-tb-sala', 'va-tb-estudio', 'va-tb-alcoba-opcion-2'],
              },
              // Espacio Multiple 2 — pieza separada izquierda
              {
                id: 'fp-tb-alc-op2',
                sceneId: 'va-tb-alcoba-opcion-2',
                label: 'Espacio Multiple 2',
                x: 170, y: 410, width: 40, height: 40,
                dotX: 18.6, dotY: 53.2,
                adjacentTo: ['va-tb-alcoba-auxiliar'],
              },
              // Bano Alcoba Principal — zona central
              {
                id: 'fp-tb-bano',
                sceneId: 'va-tb-bano',
                label: 'Baño Alcoba Principal',
                x: 440, y: 330, width: 40, height: 40,
                dotX: 46.1, dotY: 39.2,
                adjacentTo: ['va-tb-alcoba-principal'],
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

// --- Config combinado: ambas tipologias en un solo edificio ---
// Este es el export por defecto — muestra Tipo A y Tipo B en el selector.
const valleAlto: TourConfig = {
  brand: sharedBrand,
  theme: sharedTheme,
  buildings: [
    {
      id: 'valle-alto',
      name: 'Valle Alto',
      floors: 1,
      apartmentsPerFloor: 2,
      apartments: [
        ...valleAltoTipoA.buildings[0].apartments,
        ...valleAltoTipoB.buildings[0].apartments,
      ],
    },
  ],
  autoRotateSpeed: -0.5,
  showFloorPlan: true,
  showWelcome: true,

  // ─── Galeria de renders del proyecto ────────────────────────────
  // Agregar aqui los renders de gimnasio, piscina, zonas comunes, etc.
  // Las imagenes deben estar en public/projects/melendez/valle-alto/images/renders/
  gallery: [
    // Ejemplo:
    // { id: 'gym',      src: assetPath('/projects/melendez/valle-alto/images/renders/gimnasio.jpg'),  title: 'Gimnasio' },
    // { id: 'pool',     src: assetPath('/projects/melendez/valle-alto/images/renders/piscina.jpg'),   title: 'Piscina' },
    // { id: 'lobby',    src: assetPath('/projects/melendez/valle-alto/images/renders/lobby.jpg'),     title: 'Lobby' },
    // { id: 'fachada',  src: assetPath('/projects/melendez/valle-alto/images/exterior/fachada.jpg'),  title: 'Fachada' },
  ],

  // ─── Plantas arquitectonicas (sin burbujas) ─────────────────────
  plantas: [
    {
      id: 'planta-tipo-b',
      src: assetPath('/projects/melendez/valle-alto/floor-plans/CM_VA_Plantas Ambientadas_Piso 1_Obra Blanca_APTO B LUPA_Final_T.jpg'),
      title: 'Apartamento Tipo B',
      caption: 'Área construida 60 m² · Área privada 55 m²',
    },
    // Cuando este la planta del Tipo A, agregar aqui:
    // {
    //   id: 'planta-tipo-a',
    //   src: assetPath('/projects/melendez/valle-alto/floor-plans/<archivo-tipo-a>.jpg'),
    //   title: 'Apartamento Tipo A',
    //   caption: 'Área construida XX m² · Área privada XX m²',
    // },
  ],
};

export default valleAlto;
