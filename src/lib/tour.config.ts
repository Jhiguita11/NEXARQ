import { TourConfig } from './tour-types';

// ╔══════════════════════════════════════════════════════════════════════╗
// ║  MIES 360 — CONFIGURACIÓN DEL RECORRIDO VIRTUAL                    ║
// ║                                                                    ║
// ║  📋 INSTRUCCIONES:                                                 ║
// ║  1. Reemplaza las imágenes de panorama con tus fotos 360°          ║
// ║  2. Edita los nombres y descripciones de cada escena               ║
// ║  3. Configura los hotspots (posición, tipo, destino)               ║
// ║  4. Personaliza colores y tema en la sección "theme"               ║
// ║  5. Ajusta el plano interactivo en la sección "floorPlan"          ║
// ║                                                                    ║
// ║  📁 RUTA DE IMÁGENES: public/panoramas/                            ║
// ║     → Las imágenes deben ser equirectangulares (2:1 ratio)         ║
// ║     → Formatos soportados: JPG, PNG, WebP                          ║
// ║                                                                    ║
// ╚══════════════════════════════════════════════════════════════════════╝

const tourConfig: TourConfig = {
  // ─────────────────────────────────────────────────────────────────
  //  MARCA / BRAND
  //  Cambia el nombre, tagline y logo de tu proyecto
  // ─────────────────────────────────────────────────────────────────
  brand: {
    name: 'MIES 360',
    tagline: 'Recorrido Virtual Arquitectónico',
    logo: '',  // ← Pon aquí la ruta a tu logo, ej: "/logo.svg"
    website: 'https://tu-sitio.com',  // ← Opcional
  },

  // ─────────────────────────────────────────────────────────────────
  //  TEMA VISUAL
  //  Personaliza los colores de la interfaz
  // ─────────────────────────────────────────────────────────────────
  theme: {
    primary: '#10b981',      // ← Color principal (esmeralda)
    secondary: '#f59e0b',    // ← Color secundario (ámbar)
    panelBg: 'rgba(0, 0, 0, 0.65)',   // Fondo de paneles
    textPrimary: '#ffffff',   // Texto principal
    textMuted: 'rgba(255, 255, 255, 0.55)',  // Texto secundario
    borderColor: 'rgba(255, 255, 255, 0.1)',  // Bordes
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },

  // ─────────────────────────────────────────────────────────────────
  //  ESCENAS / ROOMS
  //  Cada escena es un espacio 360° del recorrido.
  //  • panorama: ruta a la imagen equirectangular
  //  • defaultView: ángulo inicial de la cámara
  //  • hotspots: puntos interactivos dentro de la escena
  //
  //  TIPOS DE HOTSPOT:
  //  • "scene"  → Navega a otra escena (requiere targetSceneId)
  //  • "info"   → Muestra información (requiere description)
  //  • "url"    → Abre un enlace externo (requiere url)
  //
  //  POSICIÓN DE HOTSPOTS:
  //  • pitch: -90 (abajo) a 90 (arriba), 0 = horizontal
  //  • yaw: -180 a 180 grados horizontales
  // ─────────────────────────────────────────────────────────────────
  scenes: [
    {
      id: 'entrada',
      name: 'Entrada',
      description: 'Hall de acceso principal del proyecto',
      panorama: '/panoramas/entrada.png',  // ← Reemplaza con tu imagen 360°
      defaultView: { pitch: 0, yaw: 180, hfov: 75 },
      hotspots: [
        {
          id: 'ent-sala',
          pitch: 0, yaw: -30,
          type: 'scene',
          label: 'Sala de Estar',
          description: 'Ir a la sala principal',
          targetSceneId: 'sala',
        },
        {
          id: 'ent-dorm',
          pitch: 0, yaw: 90,
          type: 'scene',
          label: 'Dormitorio',
          description: 'Ir al dormitorio principal',
          targetSceneId: 'dormitorio',
        },
        {
          id: 'ent-info',
          pitch: -5, yaw: 170,
          type: 'info',
          label: 'Bienvenido',
          description: 'Bienvenido a MIES 360. Explore cada espacio usando los puntos de navegación o el plano interactivo.',
        },
      ],
    },
    {
      id: 'sala',
      name: 'Sala de Estar',
      description: 'Amplia sala con iluminación natural',
      panorama: '/panoramas/sala.png',
      defaultView: { pitch: 0, yaw: 0, hfov: 75 },
      hotspots: [
        {
          id: 'sal-coc',
          pitch: 0, yaw: -60,
          type: 'scene',
          label: 'Cocina',
          description: 'Ir a la cocina',
          targetSceneId: 'cocina',
        },
        {
          id: 'sal-ter',
          pitch: 5, yaw: 30,
          type: 'scene',
          label: 'Terraza',
          description: 'Ir a la terraza',
          targetSceneId: 'terraza',
        },
        {
          id: 'sal-ent',
          pitch: 0, yaw: 160,
          type: 'scene',
          label: 'Entrada',
          description: 'Volver a la entrada',
          targetSceneId: 'entrada',
        },
        {
          id: 'sal-info',
          pitch: -10, yaw: -90,
          type: 'info',
          label: 'Sobre la Sala',
          description: 'Espacio principal de 45m² con acabados premium y vistas panorámicas.',
        },
      ],
    },
    {
      id: 'cocina',
      name: 'Cocina',
      description: 'Cocina moderna equipada',
      panorama: '/panoramas/cocina.png',
      defaultView: { pitch: 0, yaw: 90, hfov: 75 },
      hotspots: [
        {
          id: 'coc-sal',
          pitch: 0, yaw: -120,
          type: 'scene',
          label: 'Sala',
          description: 'Volver a la sala',
          targetSceneId: 'sala',
        },
        {
          id: 'coc-info',
          pitch: -5, yaw: 0,
          type: 'info',
          label: 'Sobre la Cocina',
          description: 'Cocina integral con isla central y electrodomésticos de alta gama.',
        },
      ],
    },
    {
      id: 'dormitorio',
      name: 'Dormitorio',
      description: 'Suite principal con vestidor',
      panorama: '/panoramas/dormitorio.png',
      defaultView: { pitch: 0, yaw: 0, hfov: 75 },
      hotspots: [
        {
          id: 'dor-ban',
          pitch: 0, yaw: -90,
          type: 'scene',
          label: 'Baño',
          description: 'Ir al baño principal',
          targetSceneId: 'bano',
        },
        {
          id: 'dor-ent',
          pitch: 0, yaw: 160,
          type: 'scene',
          label: 'Entrada',
          description: 'Volver a la entrada',
          targetSceneId: 'entrada',
        },
        {
          id: 'dor-info',
          pitch: -8, yaw: 45,
          type: 'info',
          label: 'Sobre el Dormitorio',
          description: 'Suite de 35m² con vestidor walk-in, baño en suite y amplios ventanales.',
        },
      ],
    },
    {
      id: 'bano',
      name: 'Baño',
      description: 'Baño principal de lujo',
      panorama: '/panoramas/bano.png',
      defaultView: { pitch: 0, yaw: 90, hfov: 75 },
      hotspots: [
        {
          id: 'ban-dor',
          pitch: 0, yaw: 90,
          type: 'scene',
          label: 'Dormitorio',
          description: 'Volver al dormitorio',
          targetSceneId: 'dormitorio',
        },
        {
          id: 'ban-info',
          pitch: -5, yaw: -45,
          type: 'info',
          label: 'Sobre el Baño',
          description: 'Baño principal con acabados en mármol, bañera de diseño y ducha de cristal.',
        },
      ],
    },
    {
      id: 'terraza',
      name: 'Terraza',
      description: 'Terraza con vista panorámica',
      panorama: '/panoramas/terraza.png',
      defaultView: { pitch: 5, yaw: 0, hfov: 90 },
      hotspots: [
        {
          id: 'ter-sal',
          pitch: 0, yaw: 180,
          type: 'scene',
          label: 'Sala',
          description: 'Volver a la sala',
          targetSceneId: 'sala',
        },
        {
          id: 'ter-info',
          pitch: -15, yaw: 0,
          type: 'info',
          label: 'Sobre la Terraza',
          description: 'Terraza de 30m² con vista panorámica de 270°. Ideal para entretenimiento.',
        },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────
  //  PLANO INTERACTIVO
  //  Configura el mini-mapa que aparece en la esquina inferior.
  //  Las coordenadas son en unidades SVG (ver viewBox width/height).
  // ─────────────────────────────────────────────────────────────────
  floorPlan: {
    width: 300,
    height: 260,
    background: 'rgba(0, 0, 0, 0.6)',
    rooms: [
      { id: 'fp-entrada',   sceneId: 'entrada',   label: 'Entrada',   x: 100, y: 100, width: 70,  height: 50, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)' },
      { id: 'fp-sala',      sceneId: 'sala',      label: 'Sala',      x: 90,  y: 30,  width: 90,  height: 65, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)' },
      { id: 'fp-cocina',    sceneId: 'cocina',    label: 'Cocina',    x: 5,   y: 25,  width: 80,  height: 65, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)' },
      { id: 'fp-dormitorio',sceneId: 'dormitorio',label: 'Dorm.',     x: 90,  y: 165, width: 90,  height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)' },
      { id: 'fp-bano',      sceneId: 'bano',      label: 'Baño',     x: 190, y: 165, width: 70,  height: 55, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)' },
      { id: 'fp-terraza',   sceneId: 'terraza',   label: 'Terraza',  x: 190, y: 30,  width: 75,  height: 65, fill: 'rgba(255,255,255,0.08)', stroke: 'rgba(255,255,255,0.2)' },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  //  CONFIGURACIÓN GENERAL
  // ─────────────────────────────────────────────────────────────────
  autoRotateSpeed: -2,   // ← Velocidad de auto-rotación (0 = desactivado)
  showFloorPlan: true,     // ← Mostrar plano interactivo
  showWelcome: true,       // ← Mostrar pantalla de bienvenida al cargar
};

export default tourConfig;
