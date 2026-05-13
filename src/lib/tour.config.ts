import { TourConfig } from './tour-types';

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
    {
      id: 'torre-a',
      name: 'Torre A',
      floors: 3,
      apartmentsPerFloor: 2,
      apartments: [
        // ═══════════════════════════════════════════════════════════
        //  APARTAMENTO 101 — Piso 1
        // ═══════════════════════════════════════════════════════════
        {
          id: 'apto-101',
          name: 'Apto 101',
          description: '2 Habitaciones · 1 Baño · 65m²',
          floor: 0,
          position: 0,
          bedrooms: 2,
          bathrooms: 1,
          area: 65,
          scenes: [
            {
              id: 'entrada-101',
              name: 'Entrada',
              description: 'Hall de acceso principal',
              panorama: '/panoramas/entrada.png',
              defaultView: { pitch: 0, yaw: 180, hfov: 75 },
              hotspots: [
                { id: 'ent-sala', pitch: 0, yaw: -30, type: 'scene', label: 'Sala', description: 'Ir a la sala', targetSceneId: 'sala-101' },
                { id: 'ent-dorm', pitch: 0, yaw: 90, type: 'scene', label: 'Dormitorio 1', description: 'Ir al dormitorio principal', targetSceneId: 'dorm1-101' },
                { id: 'ent-info', pitch: -5, yaw: 170, type: 'info', label: 'Bienvenido', description: 'Bienvenido al Apto 101. Use los puntos de navegación o la barra lateral para explorar cada espacio.' },
              ],
            },
            {
              id: 'sala-101',
              name: 'Sala de Estar',
              description: 'Amplia sala con iluminación natural',
              panorama: '/panoramas/sala.png',
              defaultView: { pitch: 0, yaw: 0, hfov: 75 },
              hotspots: [
                { id: 'sal-coc', pitch: 0, yaw: -60, type: 'scene', label: 'Cocina', description: 'Ir a la cocina', targetSceneId: 'cocina-101' },
                { id: 'sal-ter', pitch: 5, yaw: 30, type: 'scene', label: 'Terraza', description: 'Ir a la terraza', targetSceneId: 'terraza-101' },
                { id: 'sal-ent', pitch: 0, yaw: 160, type: 'scene', label: 'Entrada', description: 'Volver a la entrada', targetSceneId: 'entrada-101' },
                { id: 'sal-info', pitch: -10, yaw: -90, type: 'info', label: 'Sobre la Sala', description: 'Espacio principal de 45m² con acabados premium y vistas panorámicas.' },
              ],
            },
            {
              id: 'cocina-101',
              name: 'Cocina',
              description: 'Cocina moderna equipada',
              panorama: '/panoramas/cocina.png',
              defaultView: { pitch: 0, yaw: 90, hfov: 75 },
              hotspots: [
                { id: 'coc-sal', pitch: 0, yaw: -120, type: 'scene', label: 'Sala', description: 'Volver a la sala', targetSceneId: 'sala-101' },
                { id: 'coc-info', pitch: -5, yaw: 0, type: 'info', label: 'Sobre la Cocina', description: 'Cocina integral con isla central y electrodomésticos de alta gama.' },
              ],
            },
            {
              id: 'dorm1-101',
              name: 'Dormitorio 1',
              description: 'Suite principal con vestidor',
              panorama: '/panoramas/dormitorio.png',
              defaultView: { pitch: 0, yaw: 0, hfov: 75 },
              hotspots: [
                { id: 'dor-ban', pitch: 0, yaw: -90, type: 'scene', label: 'Baño', description: 'Ir al baño', targetSceneId: 'bano-101' },
                { id: 'dor-ent', pitch: 0, yaw: 160, type: 'scene', label: 'Entrada', description: 'Volver a la entrada', targetSceneId: 'entrada-101' },
                { id: 'dor-info', pitch: -8, yaw: 45, type: 'info', label: 'Sobre el Dormitorio', description: 'Suite de 35m² con vestidor walk-in, baño en suite y amplios ventanales.' },
              ],
            },
            {
              id: 'dorm2-101',
              name: 'Dormitorio 2',
              description: 'Segundo dormitorio',
              panorama: '/panoramas/dormitorio.png',
              defaultView: { pitch: 0, yaw: 45, hfov: 75 },
              hotspots: [
                { id: 'd2-sala', pitch: 0, yaw: -90, type: 'scene', label: 'Sala', description: 'Ir a la sala', targetSceneId: 'sala-101' },
                { id: 'd2-info', pitch: -5, yaw: 0, type: 'info', label: 'Sobre el Dormitorio 2', description: 'Dormitorio secundario de 14m² con closet integrado y ventanales amplios.' },
              ],
            },
            {
              id: 'bano-101',
              name: 'Baño',
              description: 'Baño principal',
              panorama: '/panoramas/bano.png',
              defaultView: { pitch: 0, yaw: 90, hfov: 75 },
              hotspots: [
                { id: 'ban-dor', pitch: 0, yaw: 90, type: 'scene', label: 'Dormitorio 1', description: 'Volver al dormitorio', targetSceneId: 'dorm1-101' },
                { id: 'ban-info', pitch: -5, yaw: -45, type: 'info', label: 'Sobre el Baño', description: 'Baño principal con acabados en mármol, bañera de diseño y ducha de cristal.' },
              ],
            },
            {
              id: 'terraza-101',
              name: 'Terraza',
              description: 'Terraza con vista panorámica',
              panorama: '/panoramas/terraza.png',
              defaultView: { pitch: 5, yaw: 0, hfov: 90 },
              hotspots: [
                { id: 'ter-sal', pitch: 0, yaw: 180, type: 'scene', label: 'Sala', description: 'Volver a la sala', targetSceneId: 'sala-101' },
                { id: 'ter-info', pitch: -15, yaw: 0, type: 'info', label: 'Sobre la Terraza', description: 'Terraza de 30m² con vista panorámica de 270°.' },
              ],
            },
          ],
          floorPlan: {
            width: 300,
            height: 260,
            background: 'rgba(0, 0, 0, 0.6)',
            rooms: [
              { id: 'fp-ent-101', sceneId: 'entrada-101', label: 'Entrada', x: 100, y: 100, width: 70, height: 50, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-101', 'dorm1-101'] },
              { id: 'fp-sala-101', sceneId: 'sala-101', label: 'Sala', x: 90, y: 30, width: 90, height: 65, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['entrada-101', 'cocina-101', 'terraza-101'] },
              { id: 'fp-coc-101', sceneId: 'cocina-101', label: 'Cocina', x: 5, y: 25, width: 80, height: 65, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-101'] },
              { id: 'fp-d1-101', sceneId: 'dorm1-101', label: 'Dorm. 1', x: 90, y: 165, width: 55, height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['entrada-101', 'bano-101'] },
              { id: 'fp-d2-101', sceneId: 'dorm2-101', label: 'Dorm. 2', x: 155, y: 165, width: 55, height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['entrada-101'] },
              { id: 'fp-ban-101', sceneId: 'bano-101', label: 'Baño', x: 220, y: 165, width: 50, height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['dorm1-101'] },
              { id: 'fp-ter-101', sceneId: 'terraza-101', label: 'Terraza', x: 190, y: 30, width: 75, height: 65, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-101'] },
            ],
          },
        },

        // ═══════════════════════════════════════════════════════════
        //  APARTAMENTO 102 — Piso 1
        // ═══════════════════════════════════════════════════════════
        {
          id: 'apto-102',
          name: 'Apto 102',
          description: '3 Habitaciones · 2 Baños · 85m²',
          floor: 0,
          position: 1,
          bedrooms: 3,
          bathrooms: 2,
          area: 85,
          scenes: [
            {
              id: 'entrada-102',
              name: 'Entrada',
              description: 'Hall de acceso principal',
              panorama: '/panoramas/entrada.png',
              defaultView: { pitch: 0, yaw: 180, hfov: 75 },
              hotspots: [
                { id: 'ent-sala', pitch: 0, yaw: -30, type: 'scene', label: 'Sala', targetSceneId: 'sala-102' },
                { id: 'ent-info', pitch: -5, yaw: 170, type: 'info', label: 'Bienvenido', description: 'Bienvenido al Apto 102, una unidad más espaciosa con 3 habitaciones.' },
              ],
            },
            {
              id: 'sala-102',
              name: 'Sala de Estar',
              description: 'Sala amplia con comedor integrado',
              panorama: '/panoramas/sala.png',
              defaultView: { pitch: 0, yaw: 0, hfov: 75 },
              hotspots: [
                { id: 'sal-coc', pitch: 0, yaw: -60, type: 'scene', label: 'Cocina', targetSceneId: 'cocina-102' },
                { id: 'sal-ent', pitch: 0, yaw: 160, type: 'scene', label: 'Entrada', targetSceneId: 'entrada-102' },
                { id: 'sal-d1', pitch: 5, yaw: 90, type: 'scene', label: 'Dormitorio 1', targetSceneId: 'dorm1-102' },
                { id: 'sal-info', pitch: -10, yaw: -90, type: 'info', label: 'Sobre la Sala', description: 'Sala-comedor de 55m² con balcón y acabados de lujo.' },
              ],
            },
            {
              id: 'cocina-102',
              name: 'Cocina',
              description: 'Cocina amplia con isla',
              panorama: '/panoramas/cocina.png',
              defaultView: { pitch: 0, yaw: 90, hfov: 75 },
              hotspots: [
                { id: 'coc-sal', pitch: 0, yaw: -120, type: 'scene', label: 'Sala', targetSceneId: 'sala-102' },
                { id: 'coc-info', pitch: -5, yaw: 0, type: 'info', label: 'Sobre la Cocina', description: 'Cocina de 12m² con isla de mármol y zona de desayuno.' },
              ],
            },
            {
              id: 'dorm1-102',
              name: 'Dormitorio 1',
              description: 'Suite principal',
              panorama: '/panoramas/dormitorio.png',
              defaultView: { pitch: 0, yaw: 0, hfov: 75 },
              hotspots: [
                { id: 'd1-sala', pitch: 0, yaw: 180, type: 'scene', label: 'Sala', targetSceneId: 'sala-102' },
                { id: 'd1-d2', pitch: 0, yaw: -90, type: 'scene', label: 'Dormitorio 2', targetSceneId: 'dorm2-102' },
                { id: 'd1-ban', pitch: 0, yaw: 90, type: 'scene', label: 'Baño Principal', targetSceneId: 'bano1-102' },
                { id: 'd1-info', pitch: -8, yaw: 45, type: 'info', label: 'Suite Principal', description: 'Master suite de 20m² con vestidor y baño en suite.' },
              ],
            },
            {
              id: 'dorm2-102',
              name: 'Dormitorio 2',
              description: 'Segundo dormitorio',
              panorama: '/panoramas/dormitorio.png',
              defaultView: { pitch: 0, yaw: 45, hfov: 75 },
              hotspots: [
                { id: 'd2-sala', pitch: 0, yaw: -90, type: 'scene', label: 'Sala', targetSceneId: 'sala-102' },
                { id: 'd2-info', pitch: -5, yaw: 0, type: 'info', label: 'Dormitorio 2', description: 'Dormitorio de 14m² con closet de 3m lineales.' },
              ],
            },
            {
              id: 'dorm3-102',
              name: 'Dormitorio 3',
              description: 'Tercer dormitorio / Estudio',
              panorama: '/panoramas/dormitorio.png',
              defaultView: { pitch: 0, yaw: -45, hfov: 75 },
              hotspots: [
                { id: 'd3-sala', pitch: 0, yaw: 90, type: 'scene', label: 'Sala', targetSceneId: 'sala-102' },
                { id: 'd3-info', pitch: -5, yaw: 0, type: 'info', label: 'Dormitorio 3', description: 'Dormitorio de 11m² ideal como estudio o cuarto de huéspedes.' },
              ],
            },
            {
              id: 'bano1-102',
              name: 'Baño Principal',
              description: 'Baño en suite',
              panorama: '/panoramas/bano.png',
              defaultView: { pitch: 0, yaw: 90, hfov: 75 },
              hotspots: [
                { id: 'b1-dor', pitch: 0, yaw: -90, type: 'scene', label: 'Dormitorio 1', targetSceneId: 'dorm1-102' },
                { id: 'b1-info', pitch: -5, yaw: 0, type: 'info', label: 'Baño Principal', description: 'Baño en suite con ducha de cristal, doble lavamanos y acabados premium.' },
              ],
            },
            {
              id: 'bano2-102',
              name: 'Baño Social',
              description: 'Baño de visitas',
              panorama: '/panoramas/bano.png',
              defaultView: { pitch: 0, yaw: 0, hfov: 75 },
              hotspots: [
                { id: 'b2-sala', pitch: 0, yaw: 90, type: 'scene', label: 'Sala', targetSceneId: 'sala-102' },
                { id: 'b2-info', pitch: -5, yaw: -45, type: 'info', label: 'Baño Social', description: 'Baño de visitas con acabados modernos.' },
              ],
            },
          ],
          floorPlan: {
            width: 300,
            height: 280,
            background: 'rgba(0, 0, 0, 0.6)',
            rooms: [
              { id: 'fp-ent-102', sceneId: 'entrada-102', label: 'Entrada', x: 100, y: 120, width: 60, height: 40, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-102'] },
              { id: 'fp-sala-102', sceneId: 'sala-102', label: 'Sala', x: 70, y: 50, width: 100, height: 65, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['entrada-102', 'cocina-102', 'dorm1-102'] },
              { id: 'fp-coc-102', sceneId: 'cocina-102', label: 'Cocina', x: 5, y: 40, width: 60, height: 65, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-102'] },
              { id: 'fp-d1-102', sceneId: 'dorm1-102', label: 'Dorm. 1', x: 70, y: 185, width: 65, height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-102', 'bano1-102'] },
              { id: 'fp-d2-102', sceneId: 'dorm2-102', label: 'Dorm. 2', x: 145, y: 185, width: 55, height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-102'] },
              { id: 'fp-d3-102', sceneId: 'dorm3-102', label: 'Dorm. 3', x: 210, y: 185, width: 55, height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-102'] },
              { id: 'fp-b1-102', sceneId: 'bano1-102', label: 'Baño 1', x: 5, y: 185, width: 55, height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['dorm1-102'] },
              { id: 'fp-b2-102', sceneId: 'bano2-102', label: 'Baño 2', x: 210, y: 50, width: 55, height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-102'] },
            ],
          },
        },

        // ═══════════════════════════════════════════════════════════
        //  APARTAMENTO 201 — Piso 2
        // ═══════════════════════════════════════════════════════════
        {
          id: 'apto-201',
          name: 'Apto 201',
          description: '1 Habitación · 1 Baño · 45m²',
          floor: 1,
          position: 0,
          bedrooms: 1,
          bathrooms: 1,
          area: 45,
          scenes: [
            {
              id: 'entrada-201',
              name: 'Entrada',
              description: 'Hall de acceso',
              panorama: '/panoramas/entrada.png',
              defaultView: { pitch: 0, yaw: 180, hfov: 75 },
              hotspots: [
                { id: 'ent-sala', pitch: 0, yaw: -30, type: 'scene', label: 'Sala', targetSceneId: 'sala-201' },
                { id: 'ent-info', pitch: -5, yaw: 170, type: 'info', label: 'Bienvenido', description: 'Apto 201 — Estudio moderno de 45m², ideal para inversión.' },
              ],
            },
            {
              id: 'sala-201',
              name: 'Sala de Estar',
              description: 'Espacio integrado sala-comedor',
              panorama: '/panoramas/sala.png',
              defaultView: { pitch: 0, yaw: 0, hfov: 75 },
              hotspots: [
                { id: 'sal-coc', pitch: 0, yaw: -60, type: 'scene', label: 'Cocina', targetSceneId: 'cocina-201' },
                { id: 'sal-dor', pitch: 0, yaw: 90, type: 'scene', label: 'Dormitorio', targetSceneId: 'dorm-201' },
                { id: 'sal-ent', pitch: 0, yaw: 160, type: 'scene', label: 'Entrada', targetSceneId: 'entrada-201' },
                { id: 'sal-info', pitch: -10, yaw: -90, type: 'info', label: 'Sobre la Sala', description: 'Espacio abierto de 30m² integrando sala y comedor.' },
              ],
            },
            {
              id: 'cocina-201',
              name: 'Cocina',
              description: 'Cocina compacta moderna',
              panorama: '/panoramas/cocina.png',
              defaultView: { pitch: 0, yaw: 90, hfov: 75 },
              hotspots: [
                { id: 'coc-sal', pitch: 0, yaw: -120, type: 'scene', label: 'Sala', targetSceneId: 'sala-201' },
                { id: 'coc-info', pitch: -5, yaw: 0, type: 'info', label: 'Sobre la Cocina', description: 'Cocina americana compacta con electrodomésticos integrados.' },
              ],
            },
            {
              id: 'dorm-201',
              name: 'Dormitorio',
              description: 'Dormitorio principal',
              panorama: '/panoramas/dormitorio.png',
              defaultView: { pitch: 0, yaw: 0, hfov: 75 },
              hotspots: [
                { id: 'dor-ban', pitch: 0, yaw: -90, type: 'scene', label: 'Baño', targetSceneId: 'bano-201' },
                { id: 'dor-sal', pitch: 0, yaw: 160, type: 'scene', label: 'Sala', targetSceneId: 'sala-201' },
                { id: 'dor-info', pitch: -8, yaw: 45, type: 'info', label: 'Sobre el Dormitorio', description: 'Dormitorio de 12m² con closet de 2.5m lineales.' },
              ],
            },
            {
              id: 'bano-201',
              name: 'Baño',
              description: 'Baño completo',
              panorama: '/panoramas/bano.png',
              defaultView: { pitch: 0, yaw: 90, hfov: 75 },
              hotspots: [
                { id: 'ban-dor', pitch: 0, yaw: 90, type: 'scene', label: 'Dormitorio', targetSceneId: 'dorm-201' },
                { id: 'ban-info', pitch: -5, yaw: -45, type: 'info', label: 'Sobre el Baño', description: 'Baño completo con ducha de cristal y acabados modernos.' },
              ],
            },
          ],
          floorPlan: {
            width: 280,
            height: 220,
            background: 'rgba(0, 0, 0, 0.6)',
            rooms: [
              { id: 'fp-ent-201', sceneId: 'entrada-201', label: 'Entrada', x: 90, y: 85, width: 60, height: 40, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-201', 'dorm-201'] },
              { id: 'fp-sala-201', sceneId: 'sala-201', label: 'Sala', x: 60, y: 20, width: 90, height: 60, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['entrada-201', 'cocina-201'] },
              { id: 'fp-coc-201', sceneId: 'cocina-201', label: 'Cocina', x: 5, y: 15, width: 50, height: 60, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-201'] },
              { id: 'fp-dor-201', sceneId: 'dorm-201', label: 'Dorm.', x: 90, y: 140, width: 80, height: 50, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['entrada-201', 'bano-201'] },
              { id: 'fp-ban-201', sceneId: 'bano-201', label: 'Baño', x: 180, y: 140, width: 60, height: 50, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['dorm-201'] },
            ],
          },
        },

        // ═══════════════════════════════════════════════════════════
        //  APARTAMENTO 202 — Piso 2
        // ═══════════════════════════════════════════════════════════
        {
          id: 'apto-202',
          name: 'Apto 202',
          description: '2 Habitaciones · 2 Baños · 78m²',
          floor: 1,
          position: 1,
          bedrooms: 2,
          bathrooms: 2,
          area: 78,
          scenes: [
            {
              id: 'entrada-202',
              name: 'Entrada',
              description: 'Hall de acceso principal',
              panorama: '/panoramas/entrada.png',
              defaultView: { pitch: 0, yaw: 180, hfov: 75 },
              hotspots: [
                { id: 'ent-sala', pitch: 0, yaw: -30, type: 'scene', label: 'Sala', targetSceneId: 'sala-202' },
                { id: 'ent-info', pitch: -5, yaw: 170, type: 'info', label: 'Bienvenido', description: 'Apto 202 — Amplio apartamento de 2 habitaciones con excelente distribución.' },
              ],
            },
            {
              id: 'sala-202',
              name: 'Sala de Estar',
              description: 'Sala con comedor integrado',
              panorama: '/panoramas/sala.png',
              defaultView: { pitch: 0, yaw: 0, hfov: 75 },
              hotspots: [
                { id: 'sal-coc', pitch: 0, yaw: -60, type: 'scene', label: 'Cocina', targetSceneId: 'cocina-202' },
                { id: 'sal-ent', pitch: 0, yaw: 160, type: 'scene', label: 'Entrada', targetSceneId: 'entrada-202' },
                { id: 'sal-d1', pitch: 5, yaw: 90, type: 'scene', label: 'Dormitorio 1', targetSceneId: 'dorm1-202' },
                { id: 'sal-info', pitch: -10, yaw: -90, type: 'info', label: 'Sobre la Sala', description: 'Sala-comedor de 40m² con balcón lateral.' },
              ],
            },
            {
              id: 'cocina-202',
              name: 'Cocina',
              description: 'Cocina moderna',
              panorama: '/panoramas/cocina.png',
              defaultView: { pitch: 0, yaw: 90, hfov: 75 },
              hotspots: [
                { id: 'coc-sal', pitch: 0, yaw: -120, type: 'scene', label: 'Sala', targetSceneId: 'sala-202' },
                { id: 'coc-info', pitch: -5, yaw: 0, type: 'info', label: 'Sobre la Cocina', description: 'Cocina de 10m² con isla y zona de desayuno.' },
              ],
            },
            {
              id: 'dorm1-202',
              name: 'Dormitorio 1',
              description: 'Suite principal',
              panorama: '/panoramas/dormitorio.png',
              defaultView: { pitch: 0, yaw: 0, hfov: 75 },
              hotspots: [
                { id: 'd1-sala', pitch: 0, yaw: 180, type: 'scene', label: 'Sala', targetSceneId: 'sala-202' },
                { id: 'd1-ban', pitch: 0, yaw: -90, type: 'scene', label: 'Baño Suite', targetSceneId: 'bano1-202' },
                { id: 'd1-info', pitch: -8, yaw: 45, type: 'info', label: 'Suite Principal', description: 'Master suite de 18m² con vestidor y baño en suite.' },
              ],
            },
            {
              id: 'dorm2-202',
              name: 'Dormitorio 2',
              description: 'Segundo dormitorio',
              panorama: '/panoramas/dormitorio.png',
              defaultView: { pitch: 0, yaw: 45, hfov: 75 },
              hotspots: [
                { id: 'd2-sala', pitch: 0, yaw: -90, type: 'scene', label: 'Sala', targetSceneId: 'sala-202' },
                { id: 'd2-ban', pitch: 0, yaw: 90, type: 'scene', label: 'Baño Social', targetSceneId: 'bano2-202' },
                { id: 'd2-info', pitch: -5, yaw: 0, type: 'info', label: 'Dormitorio 2', description: 'Dormitorio de 13m² con closet integrado.' },
              ],
            },
            {
              id: 'bano1-202',
              name: 'Baño Suite',
              description: 'Baño en suite',
              panorama: '/panoramas/bano.png',
              defaultView: { pitch: 0, yaw: 90, hfov: 75 },
              hotspots: [
                { id: 'b1-dor', pitch: 0, yaw: 90, type: 'scene', label: 'Dormitorio 1', targetSceneId: 'dorm1-202' },
                { id: 'b1-info', pitch: -5, yaw: 0, type: 'info', label: 'Baño Suite', description: 'Baño en suite con ducha de cristal y acabados de mármol.' },
              ],
            },
            {
              id: 'bano2-202',
              name: 'Baño Social',
              description: 'Baño de visitas',
              panorama: '/panoramas/bano.png',
              defaultView: { pitch: 0, yaw: 0, hfov: 75 },
              hotspots: [
                { id: 'b2-dor', pitch: 0, yaw: -90, type: 'scene', label: 'Dormitorio 2', targetSceneId: 'dorm2-202' },
                { id: 'b2-info', pitch: -5, yaw: 45, type: 'info', label: 'Baño Social', description: 'Baño social completo con acabados modernos.' },
              ],
            },
          ],
          floorPlan: {
            width: 300,
            height: 260,
            background: 'rgba(0, 0, 0, 0.6)',
            rooms: [
              { id: 'fp-ent-202', sceneId: 'entrada-202', label: 'Entrada', x: 100, y: 100, width: 60, height: 45, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-202', 'dorm1-202'] },
              { id: 'fp-sala-202', sceneId: 'sala-202', label: 'Sala', x: 70, y: 30, width: 100, height: 65, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['entrada-202', 'cocina-202', 'dorm1-202'] },
              { id: 'fp-coc-202', sceneId: 'cocina-202', label: 'Cocina', x: 5, y: 25, width: 60, height: 65, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-202'] },
              { id: 'fp-d1-202', sceneId: 'dorm1-202', label: 'Dorm. 1', x: 70, y: 170, width: 65, height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-202', 'bano1-202'] },
              { id: 'fp-d2-202', sceneId: 'dorm2-202', label: 'Dorm. 2', x: 145, y: 170, width: 65, height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-202', 'bano2-202'] },
              { id: 'fp-b1-202', sceneId: 'bano1-202', label: 'Baño 1', x: 5, y: 170, width: 55, height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['dorm1-202'] },
              { id: 'fp-b2-202', sceneId: 'bano2-202', label: 'Baño 2', x: 220, y: 170, width: 55, height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['dorm2-202'] },
            ],
          },
        },

        // ═══════════════════════════════════════════════════════════
        //  APARTAMENTO 301 — Piso 3 (Penthouse)
        // ═══════════════════════════════════════════════════════════
        {
          id: 'apto-301',
          name: 'Apto 301 — PH',
          description: '3 Habitaciones · 3 Baños · 120m²',
          floor: 2,
          position: 0,
          bedrooms: 3,
          bathrooms: 3,
          area: 120,
          scenes: [
            {
              id: 'entrada-301',
              name: 'Entrada',
              description: 'Hall principal del penthouse',
              panorama: '/panoramas/entrada.png',
              defaultView: { pitch: 0, yaw: 180, hfov: 75 },
              hotspots: [
                { id: 'ent-sala', pitch: 0, yaw: -30, type: 'scene', label: 'Sala', targetSceneId: 'sala-301' },
                { id: 'ent-info', pitch: -5, yaw: 170, type: 'info', label: 'Bienvenido', description: 'Penthouse de 120m² con terraza privada de 40m² y vista panorámica de 360°.' },
              ],
            },
            {
              id: 'sala-301',
              name: 'Sala de Estar',
              description: 'Sala principal del penthouse',
              panorama: '/panoramas/sala.png',
              defaultView: { pitch: 0, yaw: 0, hfov: 75 },
              hotspots: [
                { id: 'sal-coc', pitch: 0, yaw: -60, type: 'scene', label: 'Cocina', targetSceneId: 'cocina-301' },
                { id: 'sal-ter', pitch: 5, yaw: 30, type: 'scene', label: 'Terraza', targetSceneId: 'terraza-301' },
                { id: 'sal-ent', pitch: 0, yaw: 160, type: 'scene', label: 'Entrada', targetSceneId: 'entrada-301' },
                { id: 'sal-info', pitch: -10, yaw: -90, type: 'info', label: 'Sobre la Sala', description: 'Sala de 60m² con doble altura y chimenea.' },
              ],
            },
            {
              id: 'cocina-301',
              name: 'Cocina',
              description: 'Cocina gourmet',
              panorama: '/panoramas/cocina.png',
              defaultView: { pitch: 0, yaw: 90, hfov: 75 },
              hotspots: [
                { id: 'coc-sal', pitch: 0, yaw: -120, type: 'scene', label: 'Sala', targetSceneId: 'sala-301' },
                { id: 'coc-info', pitch: -5, yaw: 0, type: 'info', label: 'Cocina Gourmet', description: 'Cocina gourmet de 15m² con isla de cuarzo y electrodomésticos premium.' },
              ],
            },
            {
              id: 'dorm1-301',
              name: 'Dormitorio 1',
              description: 'Master suite del PH',
              panorama: '/panoramas/dormitorio.png',
              defaultView: { pitch: 0, yaw: 0, hfov: 75 },
              hotspots: [
                { id: 'd1-ban', pitch: 0, yaw: -90, type: 'scene', label: 'Baño Suite', targetSceneId: 'bano1-301' },
                { id: 'd1-sala', pitch: 0, yaw: 160, type: 'scene', label: 'Sala', targetSceneId: 'sala-301' },
                { id: 'd1-info', pitch: -8, yaw: 45, type: 'info', label: 'Master Suite', description: 'Master suite de 25m² con vestidor walk-in de 8m² y baño con bañera.' },
              ],
            },
            {
              id: 'dorm2-301',
              name: 'Dormitorio 2',
              description: 'Segundo dormitorio',
              panorama: '/panoramas/dormitorio.png',
              defaultView: { pitch: 0, yaw: 45, hfov: 75 },
              hotspots: [
                { id: 'd2-ban', pitch: 0, yaw: -90, type: 'scene', label: 'Baño 2', targetSceneId: 'bano2-301' },
                { id: 'd2-sala', pitch: 0, yaw: 160, type: 'scene', label: 'Sala', targetSceneId: 'sala-301' },
                { id: 'd2-info', pitch: -5, yaw: 0, type: 'info', label: 'Dormitorio 2', description: 'Dormitorio de 16m² con closet walk-in.' },
              ],
            },
            {
              id: 'dorm3-301',
              name: 'Dormitorio 3',
              description: 'Tercer dormitorio',
              panorama: '/panoramas/dormitorio.png',
              defaultView: { pitch: 0, yaw: -45, hfov: 75 },
              hotspots: [
                { id: 'd3-sala', pitch: 0, yaw: 90, type: 'scene', label: 'Sala', targetSceneId: 'sala-301' },
                { id: 'd3-info', pitch: -5, yaw: 0, type: 'info', label: 'Dormitorio 3', description: 'Dormitorio de 13m² con closet y baño propio.' },
              ],
            },
            {
              id: 'bano1-301',
              name: 'Baño Suite',
              description: 'Baño principal del PH',
              panorama: '/panoramas/bano.png',
              defaultView: { pitch: 0, yaw: 90, hfov: 75 },
              hotspots: [
                { id: 'b1-dor', pitch: 0, yaw: 90, type: 'scene', label: 'Dormitorio 1', targetSceneId: 'dorm1-301' },
                { id: 'b1-info', pitch: -5, yaw: 0, type: 'info', label: 'Baño Principal', description: 'Baño de 12m² con bañera de diseño, ducha lluvia y doble lavamanos.' },
              ],
            },
            {
              id: 'bano2-301',
              name: 'Baño 2',
              description: 'Segundo baño',
              panorama: '/panoramas/bano.png',
              defaultView: { pitch: 0, yaw: 0, hfov: 75 },
              hotspots: [
                { id: 'b2-dor', pitch: 0, yaw: -90, type: 'scene', label: 'Dormitorio 2', targetSceneId: 'dorm2-301' },
                { id: 'b2-info', pitch: -5, yaw: 45, type: 'info', label: 'Baño 2', description: 'Baño completo con ducha de cristal.' },
              ],
            },
            {
              id: 'terraza-301',
              name: 'Terraza',
              description: 'Terraza privada del PH',
              panorama: '/panoramas/terraza.png',
              defaultView: { pitch: 5, yaw: 0, hfov: 90 },
              hotspots: [
                { id: 'ter-sal', pitch: 0, yaw: 180, type: 'scene', label: 'Sala', targetSceneId: 'sala-301' },
                { id: 'ter-info', pitch: -15, yaw: 0, type: 'info', label: 'Terraza Privada', description: 'Terraza de 40m² con BBQ, jacuzzi y vista panorámica de 360° a la ciudad.' },
              ],
            },
          ],
          floorPlan: {
            width: 340,
            height: 300,
            background: 'rgba(0, 0, 0, 0.6)',
            rooms: [
              { id: 'fp-ent-301', sceneId: 'entrada-301', label: 'Entrada', x: 120, y: 120, width: 70, height: 50, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-301', 'dorm1-301'] },
              { id: 'fp-sala-301', sceneId: 'sala-301', label: 'Sala', x: 90, y: 30, width: 110, height: 75, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['entrada-301', 'cocina-301', 'terraza-301'] },
              { id: 'fp-coc-301', sceneId: 'cocina-301', label: 'Cocina', x: 5, y: 25, width: 80, height: 75, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-301'] },
              { id: 'fp-d1-301', sceneId: 'dorm1-301', label: 'Dorm. 1', x: 90, y: 195, width: 70, height: 60, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['entrada-301', 'bano1-301'] },
              { id: 'fp-d2-301', sceneId: 'dorm2-301', label: 'Dorm. 2', x: 170, y: 195, width: 65, height: 60, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-301', 'bano2-301'] },
              { id: 'fp-d3-301', sceneId: 'dorm3-301', label: 'Dorm. 3', x: 245, y: 195, width: 65, height: 60, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-301'] },
              { id: 'fp-b1-301', sceneId: 'bano1-301', label: 'Baño 1', x: 5, y: 195, width: 70, height: 60, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['dorm1-301'] },
              { id: 'fp-b2-301', sceneId: 'bano2-301', label: 'Baño 2', x: 245, y: 30, width: 65, height: 60, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['dorm2-301'] },
              { id: 'fp-ter-301', sceneId: 'terraza-301', label: 'Terraza', x: 220, y: 30, width: 65, height: 60, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-301'] },
            ],
          },
        },

        // ═══════════════════════════════════════════════════════════
        //  APARTAMENTO 302 — Piso 3
        // ═══════════════════════════════════════════════════════════
        {
          id: 'apto-302',
          name: 'Apto 302',
          description: '2 Habitaciones · 2 Baños · 72m²',
          floor: 2,
          position: 1,
          bedrooms: 2,
          bathrooms: 2,
          area: 72,
          scenes: [
            {
              id: 'entrada-302',
              name: 'Entrada',
              description: 'Hall de acceso',
              panorama: '/panoramas/entrada.png',
              defaultView: { pitch: 0, yaw: 180, hfov: 75 },
              hotspots: [
                { id: 'ent-sala', pitch: 0, yaw: -30, type: 'scene', label: 'Sala', targetSceneId: 'sala-302' },
                { id: 'ent-info', pitch: -5, yaw: 170, type: 'info', label: 'Bienvenido', description: 'Apto 302 — Apartamento de 2 habitaciones con excelente iluminación natural.' },
              ],
            },
            {
              id: 'sala-302',
              name: 'Sala de Estar',
              description: 'Sala con balcón',
              panorama: '/panoramas/sala.png',
              defaultView: { pitch: 0, yaw: 0, hfov: 75 },
              hotspots: [
                { id: 'sal-coc', pitch: 0, yaw: -60, type: 'scene', label: 'Cocina', targetSceneId: 'cocina-302' },
                { id: 'sal-d1', pitch: 0, yaw: 90, type: 'scene', label: 'Dormitorio 1', targetSceneId: 'dorm1-302' },
                { id: 'sal-ent', pitch: 0, yaw: 160, type: 'scene', label: 'Entrada', targetSceneId: 'entrada-302' },
                { id: 'sal-info', pitch: -10, yaw: -90, type: 'info', label: 'Sobre la Sala', description: 'Sala de 35m² con balcón orientado al sur.' },
              ],
            },
            {
              id: 'cocina-302',
              name: 'Cocina',
              description: 'Cocina equipada',
              panorama: '/panoramas/cocina.png',
              defaultView: { pitch: 0, yaw: 90, hfov: 75 },
              hotspots: [
                { id: 'coc-sal', pitch: 0, yaw: -120, type: 'scene', label: 'Sala', targetSceneId: 'sala-302' },
                { id: 'coc-info', pitch: -5, yaw: 0, type: 'info', label: 'Sobre la Cocina', description: 'Cocina americana de 9m² con acabados modernos.' },
              ],
            },
            {
              id: 'dorm1-302',
              name: 'Dormitorio 1',
              description: 'Suite principal',
              panorama: '/panoramas/dormitorio.png',
              defaultView: { pitch: 0, yaw: 0, hfov: 75 },
              hotspots: [
                { id: 'd1-ban', pitch: 0, yaw: -90, type: 'scene', label: 'Baño Suite', targetSceneId: 'bano1-302' },
                { id: 'd1-sala', pitch: 0, yaw: 160, type: 'scene', label: 'Sala', targetSceneId: 'sala-302' },
                { id: 'd1-info', pitch: -8, yaw: 45, type: 'info', label: 'Suite', description: 'Suite de 16m² con vestidor y baño en suite.' },
              ],
            },
            {
              id: 'dorm2-302',
              name: 'Dormitorio 2',
              description: 'Segundo dormitorio',
              panorama: '/panoramas/dormitorio.png',
              defaultView: { pitch: 0, yaw: 45, hfov: 75 },
              hotspots: [
                { id: 'd2-sala', pitch: 0, yaw: -90, type: 'scene', label: 'Sala', targetSceneId: 'sala-302' },
                { id: 'd2-ban', pitch: 0, yaw: 90, type: 'scene', label: 'Baño Social', targetSceneId: 'bano2-302' },
                { id: 'd2-info', pitch: -5, yaw: 0, type: 'info', label: 'Dormitorio 2', description: 'Dormitorio de 13m² con closet de 3m lineales.' },
              ],
            },
            {
              id: 'bano1-302',
              name: 'Baño Suite',
              description: 'Baño en suite',
              panorama: '/panoramas/bano.png',
              defaultView: { pitch: 0, yaw: 90, hfov: 75 },
              hotspots: [
                { id: 'b1-dor', pitch: 0, yaw: 90, type: 'scene', label: 'Dormitorio 1', targetSceneId: 'dorm1-302' },
                { id: 'b1-info', pitch: -5, yaw: 0, type: 'info', label: 'Baño Suite', description: 'Baño en suite con ducha de cristal y acabados premium.' },
              ],
            },
            {
              id: 'bano2-302',
              name: 'Baño Social',
              description: 'Baño de visitas',
              panorama: '/panoramas/bano.png',
              defaultView: { pitch: 0, yaw: 0, hfov: 75 },
              hotspots: [
                { id: 'b2-dor', pitch: 0, yaw: -90, type: 'scene', label: 'Dormitorio 2', targetSceneId: 'dorm2-302' },
                { id: 'b2-info', pitch: -5, yaw: 45, type: 'info', label: 'Baño Social', description: 'Baño social completo con acabados modernos.' },
              ],
            },
          ],
          floorPlan: {
            width: 300,
            height: 260,
            background: 'rgba(0, 0, 0, 0.6)',
            rooms: [
              { id: 'fp-ent-302', sceneId: 'entrada-302', label: 'Entrada', x: 100, y: 100, width: 60, height: 45, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-302', 'dorm1-302'] },
              { id: 'fp-sala-302', sceneId: 'sala-302', label: 'Sala', x: 70, y: 30, width: 100, height: 65, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['entrada-302', 'cocina-302', 'dorm1-302'] },
              { id: 'fp-coc-302', sceneId: 'cocina-302', label: 'Cocina', x: 5, y: 25, width: 60, height: 65, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-302'] },
              { id: 'fp-d1-302', sceneId: 'dorm1-302', label: 'Dorm. 1', x: 70, y: 170, width: 65, height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-302', 'bano1-302'] },
              { id: 'fp-d2-302', sceneId: 'dorm2-302', label: 'Dorm. 2', x: 145, y: 170, width: 65, height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['sala-302', 'bano2-302'] },
              { id: 'fp-b1-302', sceneId: 'bano1-302', label: 'Baño 1', x: 5, y: 170, width: 55, height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['dorm1-302'] },
              { id: 'fp-b2-302', sceneId: 'bano2-302', label: 'Baño 2', x: 220, y: 170, width: 55, height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)', adjacentTo: ['dorm2-302'] },
            ],
          },
        },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────
  //  CONFIGURACIÓN GENERAL
  // ─────────────────────────────────────────────────────────────────
  autoRotateSpeed: -2,
  showFloorPlan: true,
  showWelcome: true,
};

export default tourConfig;
