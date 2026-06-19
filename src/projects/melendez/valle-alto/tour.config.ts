import { TourConfig, ApartmentConfig } from '@/lib/tour-types';
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
const AMENITY = (path: string) => assetPath(`/projects/melendez/valle-alto/images/exterior/${path}`);

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
//  Escenas: Acceso · Sala Comedor · Espacio Multiple · Alcoba Principal
//           Alcoba Auxiliar · Espacio Multiple 2 · Bano
//  Panoramas: public/projects/melendez/valle-alto/panoramas/tipo-a/
//    acceso.jpg · sala.jpg · estudio.jpg · alcoba-principal.jpg
//    alcoba-auxiliar.jpg · alcoba-opcion-2.jpg · bano.jpg
//
//  NOTA: estructura espejada del Tipo B. Los angulos de hotspots
//  y playbackAnimations son un PUNTO DE PARTIDA — recalibrar con ?debug=1
//  ya que los renders del Tipo A tienen encuadres propios.
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
          description: 'Acceso · Sala Comedor · Espacio Multiple · 2 Alcobas · Bano',
          floor: 0,
          position: 0,
          bedrooms: 2,
          bathrooms: 2,
          area: 72,
          hotspotX: 92.3, hotspotY: 12.6,
          cardDir: 'left',

          scenes: [

            // --- ESCENA: ACCESO ---
            {
              id: 'va-ta-acceso',
              name: 'Acceso',
              description: 'Hall de entrada',
              panorama: PANO_A('acceso.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              hotspots: [
                {
                  id: 'va-ta-acc-to-sala',
                  pitch: -1, yaw: -59.4,
                  type: 'scene',
                  label: 'Sala Comedor',
                  description: 'Ir a la sala',
                  targetSceneId: 'va-ta-sala',
                },
                {
                  id: 'va-ta-acc-to-alc-aux',
                  pitch: -0.9, yaw: -26.3,
                  type: 'scene',
                  label: 'Alcoba Auxiliar',
                  description: 'Ir a la alcoba auxiliar',
                  targetSceneId: 'va-ta-alcoba-auxiliar',
                },
                {
                  id: 'va-ta-acc-to-estudio',
                  pitch: -0.4, yaw: -7.1,
                  type: 'scene',
                  label: 'Espacio Multiple',
                  description: 'Ir al espacio multiple',
                  targetSceneId: 'va-ta-estudio',
                },
              ],
            },

            // --- ESCENA: SALA COMEDOR ---
            {
              id: 'va-ta-sala',
              name: 'Sala Comedor',
              description: 'Sala y comedor integrados',
              panorama: PANO_A('sala.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              hotspots: [
                {
                  id: 'va-ta-sala-to-acceso',
                  pitch: -0.8, yaw: 121.1,
                  type: 'scene',
                  label: 'Acceso',
                  description: 'Ir al acceso',
                  targetSceneId: 'va-ta-acceso',
                },
                {
                  id: 'va-ta-sala-to-alc-ppal',
                  pitch: -0.8, yaw: 65.8,
                  type: 'scene',
                  label: 'Alcoba Principal',
                  description: 'Ir a la alcoba principal',
                  targetSceneId: 'va-ta-alcoba-principal',
                },
                {
                  id: 'va-ta-sala-to-estudio',
                  pitch: -1.4, yaw: 42.8,
                  type: 'scene',
                  label: 'Espacio Multiple',
                  description: 'Ir al espacio multiple',
                  targetSceneId: 'va-ta-estudio',
                },
              ],
            },

            // --- ESCENA: ESPACIO MULTIPLE ---
            {
              id: 'va-ta-estudio',
              name: 'Espacio Multiple',
              description: 'Zona flexible / espacio multiple',
              panorama: PANO_A('estudio.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              variants: [
                {
                  id: 'estudio',
                  label: 'Como estudio',
                  panorama: PANO_A('estudio.jpg'),
                },
                {
                  id: 'alcoba',
                  label: 'Como alcoba',
                  linkSceneId: 'va-ta-alcoba-opcion-2',
                  linkVariantId: 'alcoba',
                },
              ],
              variantButton: { pitch: -1.3, yaw: -24.1 },
              hotspots: [
                {
                  id: 'va-ta-est-to-sala',
                  pitch: -5.2, yaw: -144.1,
                  type: 'scene',
                  label: 'Sala Comedor',
                  description: 'Volver a la sala',
                  targetSceneId: 'va-ta-sala',
                },
                {
                  id: 'va-ta-est-to-acceso',
                  pitch: -1.4, yaw: 171.7,
                  type: 'scene',
                  label: 'Acceso',
                  description: 'Ir al acceso',
                  targetSceneId: 'va-ta-acceso',
                },
                {
                  id: 'va-ta-est-to-alc-aux',
                  pitch: -2, yaw: -117.5,
                  type: 'scene',
                  label: 'Alcoba Auxiliar',
                  description: 'Ir a la alcoba auxiliar',
                  targetSceneId: 'va-ta-alcoba-auxiliar',
                },
                {
                  id: 'va-ta-est-to-alc-ppal',
                  pitch: -1, yaw: 138.6,
                  type: 'scene',
                  label: 'Alcoba Principal',
                  description: 'Ir a la alcoba principal',
                  targetSceneId: 'va-ta-alcoba-principal',
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
                  id: 'va-ta-alc-ppal-to-bano',
                  pitch: -1.7, yaw: 121.6,
                  type: 'scene',
                  label: 'Baño Alcoba Principal',
                  description: 'Ir al baño',
                  targetSceneId: 'va-ta-bano',
                },
                {
                  id: 'va-ta-alc-ppal-to-acceso',
                  pitch: -1.7, yaw: -151.5,
                  type: 'scene',
                  label: 'Acceso',
                  description: 'Ir al acceso',
                  targetSceneId: 'va-ta-acceso',
                },
              ],
            },

            // --- ESCENA: ALCOBA AUXILIAR ---
            {
              id: 'va-ta-alcoba-auxiliar',
              name: 'Alcoba Auxiliar',
              description: 'Segunda alcoba',
              panorama: PANO_A('alcoba-auxiliar.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              hotspots: [
                {
                  id: 'va-ta-alc-aux-to-estudio',
                  pitch: -17.8, yaw: 110.5,
                  type: 'scene',
                  label: 'Espacio Multiple',
                  description: 'Ir al espacio multiple',
                  targetSceneId: 'va-ta-estudio',
                },
                {
                  id: 'va-ta-alc-aux-to-alc-ppal',
                  pitch: -2.6, yaw: 111.2,
                  type: 'scene',
                  label: 'Alcoba Principal',
                  description: 'Ir a la alcoba principal',
                  targetSceneId: 'va-ta-alcoba-principal',
                },
              ],
            },

            // --- ESCENA: ESPACIO MULTIPLE 2 ---
            {
              id: 'va-ta-alcoba-opcion-2',
              name: 'Espacio Multiple 2',
              description: 'Alcoba adicional / cuarto flexible',
              panorama: PANO_A('alcoba-opcion-2.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              variants: [
                {
                  id: 'alcoba',
                  label: 'Como alcoba',
                  panorama: PANO_A('alcoba-opcion-2.jpg'),
                },
                {
                  id: 'multiple',
                  label: 'Como espacio multiple',
                  linkSceneId: 'va-ta-estudio',
                  linkVariantId: 'estudio',
                },
              ],
              variantButton: { pitch: -1.3, yaw: -24.1 },
              // Sin hotspots de escena: desde aqui solo se sale con el boton
              // de variante "ver como espacio multiple" (navega de vuelta al estudio).
              hotspots: [],
            },

            // --- ESCENA: BAÑO ALCOBA PRINCIPAL ---
            {
              id: 'va-ta-bano',
              name: 'Baño Alcoba Principal',
              description: 'Baño de la alcoba principal',
              panorama: PANO_A('bano.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              hotspots: [
                {
                  id: 'va-ta-bano-to-alc-ppal',
                  pitch: 0.8, yaw: -5.4,
                  type: 'scene',
                  label: 'Alcoba Principal',
                  description: 'Volver a la alcoba principal',
                  targetSceneId: 'va-ta-alcoba-principal',
                },
              ],
            },

          ],

          // --- PLANO DE PLANTA TIPO A ---
          // Imagen real: CM_VA_Plantas Ambientadas_Piso 1_Obra Blanca_APTO A LUPA_Final_T.jpg
          // dotX/dotY en % del area total de la imagen (detectados de la marcacion de burbujas cian)
          // Los rects son areas de click centradas en el dot (no se renderizan en modo imagen)
          floorPlan: {
            width: 1000,
            height: 800,
            background: 'transparent',
            backgroundImage: PLAN('CM_VA_Plantas Ambientadas_Piso 1_Obra Blanca_APTO A LUPA_Final_T.jpg'),
            rooms: [
              // Acceso — entrada principal (parte inferior)
              {
                id: 'fp-ta-acceso',
                sceneId: 'va-ta-acceso',
                label: 'Acceso',
                x: 637, y: 647, width: 40, height: 40,
                dotX: 65.7, dotY: 83.4,
                adjacentTo: ['va-ta-sala', 'va-ta-alcoba-auxiliar', 'va-ta-estudio', 'va-ta-alcoba-principal'],
              },
              // Sala Comedor — centro
              {
                id: 'fp-ta-sala',
                sceneId: 'va-ta-sala',
                label: 'Sala Comedor',
                x: 461, y: 513, width: 40, height: 40,
                dotX: 48.1, dotY: 66.6,
                adjacentTo: ['va-ta-acceso', 'va-ta-alcoba-principal', 'va-ta-estudio'],
              },
              // Espacio Multiple — habitacion central con la mesa redonda
              {
                id: 'fp-ta-estudio',
                sceneId: 'va-ta-estudio',
                label: 'Espacio Multiple',
                x: 582, y: 288, width: 40, height: 40,
                dotX: 60.2, dotY: 38.5,
                adjacentTo: ['va-ta-sala', 'va-ta-acceso', 'va-ta-alcoba-principal', 'va-ta-alcoba-auxiliar', 'va-ta-alcoba-opcion-2'],
              },
              // Alcoba Principal — derecha
              {
                id: 'fp-ta-alc-ppal',
                sceneId: 'va-ta-alcoba-principal',
                label: 'Alcoba Principal',
                x: 712, y: 346, width: 40, height: 40,
                dotX: 73.2, dotY: 45.8,
                adjacentTo: ['va-ta-estudio', 'va-ta-bano', 'va-ta-sala', 'va-ta-acceso', 'va-ta-alcoba-auxiliar'],
              },
              // Alcoba Auxiliar — centro superior
              {
                id: 'fp-ta-alc-aux',
                sceneId: 'va-ta-alcoba-auxiliar',
                label: 'Alcoba Auxiliar',
                x: 488, y: 336, width: 40, height: 40,
                dotX: 50.8, dotY: 44.5,
                adjacentTo: ['va-ta-acceso', 'va-ta-estudio', 'va-ta-alcoba-principal'],
              },
              // Espacio Multiple 2 — pieza separada izquierda
              {
                id: 'fp-ta-alc-op2',
                sceneId: 'va-ta-alcoba-opcion-2',
                label: 'Espacio Multiple 2',
                x: 184, y: 315, width: 40, height: 40,
                dotX: 20.4, dotY: 41.9,
                adjacentTo: ['va-ta-estudio'],
              },
              // Bano Alcoba Principal — derecha (vestier/wc alcoba)
              {
                id: 'fp-ta-bano',
                sceneId: 'va-ta-bano',
                label: 'Baño Alcoba Principal',
                x: 784, y: 451, width: 40, height: 40,
                dotX: 78.4, dotY: 61.4,
                adjacentTo: ['va-ta-alcoba-principal'],
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
          hotspotX: 60.6, hotspotY: 19.3,
          cardDir: 'down',

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
                  // Estudio -> Espacio Multiple 2: alinea el norte de ambos renders
                  linkYawOffset: -166.5,
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
                  // Espacio Multiple 2 -> Estudio: alinea el norte de ambos renders
                  linkYawOffset: 166.5,
                },
              ],
              variantButton: { pitch: -2.2, yaw: -33.8 },
              playbackAnimations: [
                { from: { pitch: -13, yaw: 139.8 }, to: { pitch: -13, yaw: 85.4 } },
              ],
              // Sala Comedor NO es visible desde Espacio Multiple 2.
              hotspots: [
                {
                  id: 'va-tb-op2-to-aux',
                  pitch: -3.1, yaw: -178.2,
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
                // El render nuevo de op2 quedo girado respecto al plano
                radarYawOffset: -153.5,
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

// ============================================================
//  AMENITIES — recorridos 360 de zonas comunes
//
//  Se modela como un "apartamento" especial (id: 'amenities') para
//  reutilizar el motor de escenas. Cada amenity es una escena
//  independiente (sin hotspots): se navega entre ellas desde el sidebar o desde las burbujas si tiene.
//  Panoramas: public/projects/melendez/valle-alto/images/exterior/
// ============================================================
const amenities: ApartmentConfig = {
  id: 'amenities',
  name: 'Amenities',
  description: 'Zonas comunes · Car Lobby · Piscina · BBQ · Circuito Patinaje · Mascotas',
  floor: 0,
  position: 0,
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  available: true,
  // Posición del ojo de Amenities en el hero (reposicionable en ?debug=1).
  hotspotX: 38.7, hotspotY: 46.2,
  scenes: [
    {
      id: 'va-am-lobby',
      name: 'Car Lobby',
      description: 'Car Lobby de acceso',
      panorama: AMENITY('CM_VALLE ALTO_LOBBY.jpg'),
      defaultView: { pitch: 0, yaw: 0, hfov: 100 },
      hotspots: [
        {
          id: 'va-am-lobby-to-piscina',
          pitch: 3.2, yaw: -38.5,
          type: 'scene',
          label: 'Piscina',
          description: 'Ir a la piscina',
          targetSceneId: 'va-am-piscina',
        },
        {
          id: 'va-am-lobby-to-patinaje',
          pitch: 2, yaw: 1.3,
          type: 'scene',
          label: 'Circuito Patinaje',
          description: 'Ir al circuito de patinaje',
          targetSceneId: 'va-am-parqueadero',
        },
        {
          id: 'va-am-lobby-to-mascotas',
          pitch: 2.6, yaw: -6.3,
          type: 'scene',
          label: 'Zona de Mascotas',
          description: 'Ir a la zona de mascotas',
          targetSceneId: 'va-am-mascotas',
        },
      ],
    },
    {
      id: 'va-am-piscina',
      name: 'Piscina',
      description: 'Zona de piscina',
      panorama: AMENITY('CM_VALLE ALTO_PISCINA.jpg'),
      defaultView: { pitch: 0, yaw: 0, hfov: 100 },
      hotspots: [
        {
          id: 'va-am-piscina-to-bbq',
          pitch: 0.4, yaw: 29.4,
          type: 'scene',
          label: 'Zona BBQ',
          description: 'Ir a la zona BBQ',
          targetSceneId: 'va-am-bbq',
        },
        {
          id: 'va-am-piscina-to-lobby',
          pitch: 1.2, yaw: -54.5,
          type: 'scene',
          label: 'Car Lobby',
          description: 'Ir al Car Lobby',
          targetSceneId: 'va-am-lobby',
        },
      ],
    },
    {
      id: 'va-am-bbq',
      name: 'Zona BBQ',
      description: 'Zona de BBQ',
      panorama: AMENITY('CM_VALLE ALTO_BBQ.jpg'),
      defaultView: { pitch: 0, yaw: 0, hfov: 100 },
      hotspots: [
        {
          id: 'va-am-bbq-to-piscina',
          pitch: 3.6, yaw: -158.8,
          type: 'scene',
          label: 'Piscina',
          description: 'Ir a la piscina',
          targetSceneId: 'va-am-piscina',
        },
        {
          id: 'va-am-bbq-to-lobby',
          pitch: 3.3, yaw: -64.5,
          type: 'scene',
          label: 'Car Lobby',
          description: 'Ir al Car Lobby',
          targetSceneId: 'va-am-lobby',
        },
      ],
    },
    {
      id: 'va-am-parqueadero',
      name: 'Circuito Patinaje',
      description: 'Circuito de patinaje',
      panorama: AMENITY('CM_VALLE ALTO_PARQUEADERO.jpg'),
      defaultView: { pitch: 0, yaw: 0, hfov: 100 },
      hotspots: [
        {
          id: 'va-am-patinaje-to-mascotas',
          pitch: -1, yaw: 173.8,
          type: 'scene',
          label: 'Zona de Mascotas',
          description: 'Ir a la zona de mascotas',
          targetSceneId: 'va-am-mascotas',
        },
        {
          id: 'va-am-patinaje-to-lobby',
          pitch: 1, yaw: 5.8,
          type: 'scene',
          label: 'Car Lobby',
          description: 'Ir al Car Lobby',
          targetSceneId: 'va-am-lobby',
        },
        {
          id: 'va-am-patinaje-to-piscina',
          pitch: -0.2, yaw: 90.2,
          type: 'scene',
          label: 'Piscina',
          description: 'Ir a la piscina',
          targetSceneId: 'va-am-piscina',
        },
      ],
    },
    {
      id: 'va-am-mascotas',
      name: 'Zona de Mascotas',
      description: 'Zona para mascotas',
      panorama: AMENITY('CM_VALLE ALTO_MASCOTAS.jpg'),
      defaultView: { pitch: 0, yaw: 0, hfov: 100 },
      hotspots: [
        {
          id: 'va-am-mascotas-to-patinaje',
          pitch: -0.3, yaw: -8.3,
          type: 'scene',
          label: 'Circuito Patinaje',
          description: 'Ir al circuito de patinaje',
          targetSceneId: 'va-am-parqueadero',
        },
        {
          id: 'va-am-mascotas-to-lobby',
          pitch: 0.6, yaw: 2.7,
          type: 'scene',
          label: 'Car Lobby',
          description: 'Ir al Car Lobby',
          targetSceneId: 'va-am-lobby',
        },
        {
          id: 'va-am-mascotas-to-piscina',
          pitch: 1.2, yaw: 39.6,
          type: 'scene',
          label: 'Piscina',
          description: 'Ir a la piscina',
          targetSceneId: 'va-am-piscina',
        },
      ],
    },
  ],
  // Las amenities no tienen plano de planta.
  floorPlan: { width: 1000, height: 800, background: 'transparent', rooms: [] },
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

  // ─── Amenities (recorridos 360 de zonas comunes) ────────────────
  amenities,

  // ─── Galeria de renders del proyecto ────────────────────────────
  // Agregar aqui los renders de gimnasio, piscina, zonas comunes, etc.
  // Las imagenes deben estar en public/projects/melendez/valle-alto/images/renders/
  gallery: [
    { id: 'aereo-dia',     src: assetPath('/projects/melendez/valle-alto/images/renders/aereo-dia.jpg'),     title: 'Vista Aérea · Día' },
    { id: 'aereo-noche',   src: assetPath('/projects/melendez/valle-alto/images/renders/aereo-noche.jpg'),   title: 'Vista Aérea · Noche' },
    { id: 'sala',          src: assetPath('/projects/melendez/valle-alto/images/renders/sala.jpg'),          title: 'Sala' },
    { id: 'cocina',        src: assetPath('/projects/melendez/valle-alto/images/renders/cocina.jpg'),        title: 'Cocina' },
    { id: 'estudio',       src: assetPath('/projects/melendez/valle-alto/images/renders/estudio.jpg'),       title: 'Estudio' },
    { id: 'hab-principal', src: assetPath('/projects/melendez/valle-alto/images/renders/hab-principal.jpg'), title: 'Habitación Principal' },
    { id: 'hab-auxiliar',  src: assetPath('/projects/melendez/valle-alto/images/renders/hab-auxiliar.jpg'),  title: 'Habitación Auxiliar' },
    { id: 'bano',          src: assetPath('/projects/melendez/valle-alto/images/renders/bano.jpg'),          title: 'Baño' },
    { id: 'balcon',        src: assetPath('/projects/melendez/valle-alto/images/renders/balcon.jpg'),        title: 'Balcón' },
    { id: 'zona-ropas',    src: assetPath('/projects/melendez/valle-alto/images/renders/zona-ropas.jpg'),    title: 'Zona de Ropas' },
    { id: 'gimnasio',      src: assetPath('/projects/melendez/valle-alto/images/renders/gimnasio.jpg'),      title: 'Gimnasio' },
    { id: 'lobby',         src: assetPath('/projects/melendez/valle-alto/images/renders/lobby.jpg'),         title: 'Lobby' },
    { id: 'piscina',       src: assetPath('/projects/melendez/valle-alto/images/renders/piscina.jpg'),       title: 'Piscina' },
  ],

  // ─── Plantas arquitectonicas (sin burbujas) ─────────────────────
  plantas: [
    {
      id: 'planta-tipo-a',
      src: assetPath('/projects/melendez/valle-alto/floor-plans/CM_VA_Plantas Ambientadas_Piso 1_Obra Blanca_APTO A LUPA_Final_T.jpg'),
      title: 'Apartamento Tipo A',
      caption: 'Área construida 72 m²',
    },
    {
      id: 'planta-tipo-b',
      src: assetPath('/projects/melendez/valle-alto/floor-plans/CM_VA_Plantas Ambientadas_Piso 1_Obra Blanca_APTO B LUPA_Final_T.jpg'),
      title: 'Apartamento Tipo B',
      caption: 'Área construida 60 m² · Área privada 55 m²',
    },
  ],
};

export default valleAlto;
