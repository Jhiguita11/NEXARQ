import { TourConfig } from './tour-types';
import { assetPath } from './asset-path';

// ╔══════════════════════════════════════════════════════════════════════╗
// ║  NEXARQ 360 — CONFIGURACIÓN DEL RECORRIDO VIRTUAL                    ║
// ║                                                                    ║
// ║  📋 INSTRUCCIONES:                                                 ║
// ║  1. Edita los edificios y apartamentos en la sección "buildings"   ║
// ║  2. Reemplaza las imágenes de panorama con tus fotos 360°          ║
// ║  3. Configura los hotspots (posición, tipo, destino)               ║
// ║  4. Ajusta el plano interactivo en cada apartamento                ║
// ║                                                                    ║
// ║  📁 RUTA DE IMÁGENES: public/panoramas/                            ║
// ║     → Las imágenes deben ser equirectangulares (2:1 ratio)         ║
// ║     → Formatos soportados: JPG, PNG, WebP                          ║
// ║                                                                    ║
// ╚══════════════════════════════════════════════════════════════════════╝

const tourConfig: TourConfig = {
  // ─────────────────────────────────────────────────────────────────
  //  MARCA / BRAND
  // ─────────────────────────────────────────────────────────────────
  brand: {
    name: 'NEXARQ 360',
    tagline: 'Recorrido Virtual Arquitectónico',
    logo: '',
    website: '',
  },

  // ─────────────────────────────────────────────────────────────────
  //  TEMA VISUAL — Negro y Dorado Premium
  // ─────────────────────────────────────────────────────────────────
  theme: {
    primary: '#D4AF37',
    secondary: '#B8962E',
    panelBg: 'rgba(0, 0, 0, 0.80)',
    textPrimary: '#ffffff',
    textMuted: 'rgba(255, 255, 255, 0.45)',
    borderColor: 'rgba(212, 175, 55, 0.15)',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },

  // ─────────────────────────────────────────────────────────────────
  //  EDIFICIOS Y APARTAMENTOS
  //
  //  Cada edificio tiene múltiples apartamentos.
  //  Cada apartamento tiene sus propias escenas 360° y plano.
  //
  //  Para agregar más apartamentos, copia un bloque de apartment
  //  y cambia id, name, floor, position, y scenes.
  // ─────────────────────────────────────────────────────────────────
  buildings: [
    // ═══════════════════════════════════════════════════════════════
    //  PROYECTO: LOS GUAYACANES
    // ═══════════════════════════════════════════════════════════════
    {
      id: 'guayacanes',
      name: 'Los Guayacanes',
      floors: 1,
      apartmentsPerFloor: 1,
      apartments: [
        {
          id: 'apto-tipo-a',
          name: 'Apartamento Tipo A',
          description: 'Acceso · Sala · Alcoba Principal',
          floor: 0,
          position: 0,
          bedrooms: 1,
          bathrooms: 1,
          area: 0,
          hotspotX: 68,
          hotspotY: 27,
          scenes: [
            {
              id: 'acceso-a',
              name: 'Acceso',
              description: 'Hall de acceso principal',
              panorama: assetPath('/panoramas/guayacanes/acceso.jpg'),
              defaultView: { pitch: 0, yaw: -18, hfov: 100 },
              hotspots: [
                { id: 'ac-sala',   pitch: 0, yaw: -35.0, type: 'scene', label: 'Sala',            description: 'Ir a la sala',            targetSceneId: 'sala-a'       },
                { id: 'ac-alcoba', pitch: 0, yaw: -1.1,  type: 'scene', label: 'Alcoba Principal', description: 'Ir a la alcoba principal', targetSceneId: 'alcoba-ppl-a' },
              ],
            },
            {
              id: 'sala-a',
              name: 'Sala',
              description: 'Sala principal',
              panorama: assetPath('/panoramas/guayacanes/sala.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              hotspots: [
                { id: 'sa-acceso', pitch: 0, yaw: -25.7,  type: 'scene', label: 'Acceso',          description: 'Ir al acceso',            targetSceneId: 'acceso-a'     },
                { id: 'sa-alcoba', pitch: 0, yaw: -150.0, type: 'scene', label: 'Alcoba Principal', description: 'Ir a la alcoba principal', targetSceneId: 'alcoba-ppl-a' },
              ],
            },
            {
              id: 'alcoba-ppl-a',
              name: 'Alcoba Principal',
              description: 'Alcoba principal',
              panorama: assetPath('/panoramas/guayacanes/alcoba-principal.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              hotspots: [
                { id: 'ap-sala',   pitch: 0, yaw: -140.0, type: 'scene', label: 'Sala',   description: 'Ir a la sala',   targetSceneId: 'sala-a'   },
                { id: 'ap-acceso', pitch: 0, yaw: -169.0, type: 'scene', label: 'Acceso', description: 'Ir al acceso',   targetSceneId: 'acceso-a' },
              ],
            },
            {
              id: 'zona-pet-a',
              name: 'Zona Mascotas',
              description: 'Área recreativa para mascotas',
              panorama: assetPath('/panoramas/guayacanes/zona-pet.jpg'),
              defaultView: { pitch: 0, yaw: 0, hfov: 100 },
              hotspots: [
                { id: 'zp-acceso', pitch: 16.8, yaw: -46.5, type: 'scene', label: 'Volver al Apartamento', description: 'Volver al apartamento', targetSceneId: 'acceso-a' },
              ],
            },
          ],
          floorPlan: {
            width: 300,
            height: 200,
            background: 'rgba(0, 0, 0, 0.6)',
            rooms: [
              { id: 'fp-acceso-a',   sceneId: 'acceso-a',     label: 'Acceso',    x: 110, y: 75,  width: 80,  height: 50,  fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-a'] },
              { id: 'fp-sala-a',     sceneId: 'sala-a',       label: 'Sala',      x: 15,  y: 20,  width: 90,  height: 160, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['acceso-a', 'alcoba-ppl-a'] },
              { id: 'fp-alcoba-a',   sceneId: 'alcoba-ppl-a', label: 'Alc. Ppal', x: 195, y: 20,  width: 90,  height: 160, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-a'] },
            ],
          },
        },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────
  //  CONFIGURACIÓN GENERAL
  // ─────────────────────────────────────────────────────────────────
  autoRotateSpeed: -0.5,
  showFloorPlan: true,
  showWelcome: true,
};

export default tourConfig;
