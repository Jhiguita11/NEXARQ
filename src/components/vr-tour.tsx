'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Glasses } from 'lucide-react';
import tourConfig from '@/projects/melendez/valle-alto/tour.config';
import type { SceneConfig, ApartmentConfig } from '@/lib/tour-types';

// ── Constantes de calibración (ajustar al probar en el Quest) ──────────
// Si los hotspots aparecen rotados respecto al panorama, ajusta YAW_OFFSET.
// Si el panorama se ve espejado en horizontal, cambia SKY_MIRRORED a true.
const YAW_OFFSET = 0;        // grados
const SKY_MIRRORED = false;  // espejar el cielo horizontalmente
const HOTSPOT_RADIUS = 6;    // distancia de los hotspots a la cámara (metros)

const AFRAME_VERSION = '1.7.0';
const BRAND = '#E8D9B0';

/** Ruta de la versión VR (4096x2048) del panorama: inserta /vr/ antes del archivo. */
function vrPanoUrl(panorama: string) {
  return panorama.replace(/\/([^/]+)$/, '/vr/$1');
}

/** Convierte pitch/yaw (grados, convención Pannellum) a posición XYZ en A-Frame. */
function yawPitchToXYZ(yawDeg: number, pitchDeg: number, r: number) {
  const yaw = ((yawDeg + YAW_OFFSET) * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;
  const sign = SKY_MIRRORED ? -1 : 1;
  const x = sign * r * Math.cos(pitch) * Math.sin(yaw);
  const y = r * Math.sin(pitch);
  const z = -r * Math.cos(pitch) * Math.cos(yaw);
  return { x, y, z };
}

export default function VrTour() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const skyRef = useRef<HTMLElement | null>(null);
  const hotspotsRef = useRef<HTMLElement | null>(null);
  const currentSceneRef = useRef<string>('');

  const [ready, setReady] = useState(false);
  const [sceneName, setSceneName] = useState('');
  const [vrSupported, setVrSupported] = useState(false);
  const [inVr, setInVr] = useState(false);
  const [vrError, setVrError] = useState('');

  // Detectar soporte WebXR inmersivo
  useEffect(() => {
    const xr = (navigator as any).xr;
    if (xr?.isSessionSupported) {
      xr.isSessionSupported('immersive-vr').then((ok: boolean) => setVrSupported(ok)).catch(() => {});
    }
  }, []);

  // Entrar al modo VR llamando directamente a A-Frame (no depende del botón nativo)
  const handleEnterVR = () => {
    const sceneEl = containerRef.current?.querySelector('a-scene') as any;
    if (!sceneEl) { setVrError('La escena aún no está lista, espera un momento.'); return; }
    try {
      const p = sceneEl.enterVR();
      if (p?.then) {
        p.then(() => { setInVr(true); setVrError(''); })
         .catch((e: any) => setVrError('No se pudo entrar a VR: ' + (e?.message || 'revisa permisos del navegador')));
      } else {
        setInVr(true);
      }
    } catch (e: any) {
      setVrError('No se pudo entrar a VR: ' + (e?.message || 'error desconocido'));
    }
  };

  // Apartamento a mostrar: ?apt=<id> o el primero del config
  const apartment: ApartmentConfig | undefined = (() => {
    const all = tourConfig.buildings.flatMap((b) => b.apartments);
    if (typeof window !== 'undefined') {
      const aptParam = new URLSearchParams(window.location.search).get('apt');
      if (aptParam) {
        const found = all.find((a) => a.id.includes(aptParam));
        if (found) return found;
      }
    }
    return all[0];
  })();

  const scenes: SceneConfig[] = apartment?.scenes ?? [];

  // ── Cargar A-Frame desde CDN ──────────────────────────────────────
  useEffect(() => {
    const id = 'aframe-cdn';
    if (document.getElementById(id)) {
      if ((window as any).AFRAME) setReady(true);
      else document.getElementById(id)!.addEventListener('load', () => setReady(true), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = `https://aframe.io/releases/${AFRAME_VERSION}/aframe.min.js`;
    script.async = true;
    script.addEventListener('load', () => setReady(true), { once: true });
    document.body.appendChild(script);
  }, []);

  // ── Construir la escena A-Frame una vez que A-Frame esté listo ─────
  useEffect(() => {
    if (!ready || !containerRef.current || !scenes.length) return;
    const container = containerRef.current;

    const scene = document.createElement('a-scene');
    scene.setAttribute('vr-mode-ui', 'enabled: true');
    scene.setAttribute('renderer', 'colorManagement: true; antialias: true');
    scene.setAttribute('loading-screen', 'dotsColor: #E8D9B0; backgroundColor: #0a0a0a');

    // Assets — precarga de panoramas (versión VR 4096x2048)
    const assets = document.createElement('a-assets');
    scenes.forEach((s) => {
      const img = document.createElement('img');
      img.id = `pano-${s.id}`;
      img.setAttribute('crossorigin', 'anonymous');
      img.src = vrPanoUrl(s.panorama);
      assets.appendChild(img);
    });
    scene.appendChild(assets);

    // Cielo (panorama) — URL directa (no #asset) para que la textura
    // se aplique de forma fiable también en WebXR estéreo (Quest).
    // radius reducido (default 500): en VR el far plane lo controla el runtime
    // del Quest y recorta la esfera grande → se ve negra. Con radius 50 queda
    // siempre dentro del far plane. La cámara está en el centro, así que no
    // cambia la apariencia. Los hotspots están a radius 6 (dentro de la esfera).
    const sky = document.createElement('a-sky');
    sky.setAttribute('radius', '50');
    sky.setAttribute('src', vrPanoUrl(scenes[0].panorama));
    sky.setAttribute('material', `shader: flat; src: ${vrPanoUrl(scenes[0].panorama)}`);
    if (SKY_MIRRORED) sky.setAttribute('scale', '-1 1 1');
    scene.appendChild(sky);
    skyRef.current = sky;

    // Contenedor de hotspots
    const hsContainer = document.createElement('a-entity');
    hsContainer.id = 'vr-hotspots';
    scene.appendChild(hsContainer);
    hotspotsRef.current = hsContainer;

    // Cámara (mirada del usuario)
    const camera = document.createElement('a-camera');
    camera.setAttribute('id', 'vr-camera');
    camera.setAttribute('wasd-controls-enabled', 'false');
    camera.setAttribute('position', '0 1.6 0');
    // Cursor de mirada (fallback sin controles)
    const cursor = document.createElement('a-entity');
    cursor.setAttribute('cursor', 'fuse: false');
    cursor.setAttribute('position', '0 0 -1.5');
    cursor.setAttribute('geometry', 'primitive: ring; radiusInner: 0.012; radiusOuter: 0.02');
    cursor.setAttribute('material', `color: ${BRAND}; shader: flat; opacity: 0.7`);
    cursor.setAttribute('raycaster', 'objects: .clickable');
    camera.appendChild(cursor);
    scene.appendChild(camera);

    // Controles del Quest (ambas manos) con láser apuntador
    (['left', 'right'] as const).forEach((hand) => {
      const ctrl = document.createElement('a-entity');
      ctrl.setAttribute('laser-controls', `hand: ${hand}`);
      ctrl.setAttribute('raycaster', 'objects: .clickable; lineColor: #E8D9B0; lineOpacity: 0.85');
      scene.appendChild(ctrl);
    });

    // Sincronizar estado al entrar/salir del modo VR (botón del Quest, etc.)
    scene.addEventListener('enter-vr', () => setInVr(true));
    scene.addEventListener('exit-vr', () => setInVr(false));

    container.appendChild(scene);

    // Render inicial de la primera escena
    renderScene(scenes[0].id);

    return () => {
      try { scene.parentNode?.removeChild(scene); } catch { /* ignore */ }
      skyRef.current = null;
      hotspotsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // ── Cambiar de escena: actualiza cielo + hotspots (sin remontar) ───
  function renderScene(sceneId: string) {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene || !skyRef.current || !hotspotsRef.current) return;

    currentSceneRef.current = sceneId;
    setSceneName(scene.name);

    // Cambiar panorama — URL directa (fiable en WebXR)
    const url = vrPanoUrl(scene.panorama);
    skyRef.current.setAttribute('src', url);
    skyRef.current.setAttribute('material', `shader: flat; src: ${url}`);

    // Limpiar hotspots anteriores
    const hs = hotspotsRef.current;
    while (hs.firstChild) hs.removeChild(hs.firstChild);

    // Crear hotspots de la escena
    (scene.hotspots ?? []).forEach((h) => {
      const pos = yawPitchToXYZ(h.yaw, h.pitch, HOTSPOT_RADIUS);

      const el = document.createElement('a-entity');
      el.classList.add('clickable');
      el.setAttribute('position', `${pos.x.toFixed(3)} ${pos.y.toFixed(3)} ${pos.z.toFixed(3)}`);
      el.setAttribute('look-at', '#vr-camera');

      // Disco de fondo
      const disc = document.createElement('a-circle');
      disc.setAttribute('radius', '0.42');
      disc.setAttribute('material', 'color: #0a0a0a; shader: flat; opacity: 0.55; side: double');
      el.appendChild(disc);

      // Anillo beige
      const ring = document.createElement('a-ring');
      ring.setAttribute('radius-inner', '0.34');
      ring.setAttribute('radius-outer', '0.42');
      ring.setAttribute('material', `color: ${BRAND}; shader: flat; side: double`);
      el.appendChild(ring);

      // Etiqueta — fondo oscuro + texto (fuente default de A-Frame)
      const labelBg = document.createElement('a-plane');
      labelBg.setAttribute('position', '0 -0.7 0.01');
      labelBg.setAttribute('width', `${Math.max(1, (h.label?.length ?? 4) * 0.16 + 0.4)}`);
      labelBg.setAttribute('height', '0.32');
      labelBg.setAttribute('material', 'color: #0a0a0a; shader: flat; opacity: 0.7; side: double');
      el.appendChild(labelBg);

      const label = document.createElement('a-text');
      label.setAttribute('value', (h.label ?? '').toUpperCase());
      label.setAttribute('align', 'center');
      label.setAttribute('position', '0 -0.7 0.02');
      label.setAttribute('color', '#F5EDD8');
      label.setAttribute('width', '4');
      el.appendChild(label);

      // Animación de hover (escala)
      el.setAttribute('scale', '1 1 1');
      el.addEventListener('mouseenter', () => el.setAttribute('scale', '1.18 1.18 1.18'));
      el.addEventListener('mouseleave', () => el.setAttribute('scale', '1 1 1'));

      // Click → navegar / info / url
      el.addEventListener('click', () => {
        if (h.type === 'scene' && h.targetSceneId) {
          renderScene(h.targetSceneId);
        } else if (h.type === 'url' && h.url) {
          window.open(h.url, '_blank');
        }
      });

      hs.appendChild(el);
    });
  }

  const backUrl = typeof window !== 'undefined'
    ? window.location.pathname.replace(/\/vr\/?$/, '/') || '/'
    : '/';

  return (
    <div className="fixed inset-0 bg-black">
      {/* Contenedor de la escena A-Frame */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Overlay 2D (no se muestra dentro del modo inmersivo VR) */}
      <a
        href={backUrl}
        className="fixed top-4 left-4 z-[100] flex items-center gap-2 rounded-full px-4 py-2"
        style={{
          background: 'rgba(0,0,0,0.55)',
          border: '1px solid rgba(232,217,176,0.25)',
          color: 'rgba(232,217,176,0.9)',
          backdropFilter: 'blur(12px)',
          fontSize: 13,
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        <ArrowLeft size={15} />
        Salir de VR
      </a>

      <div
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] rounded-full px-4 py-2 text-center pointer-events-none"
        style={{
          background: 'rgba(0,0,0,0.45)',
          border: '1px solid rgba(232,217,176,0.18)',
          color: '#F5EDD8',
          backdropFilter: 'blur(12px)',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.04em',
        }}
      >
        {sceneName || apartment?.name || 'Recorrido VR'}
      </div>

      {/* Botón propio "Entrar en Modo VR" — no depende del botón nativo de A-Frame */}
      {ready && !inVr && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2">
          <button
            onClick={handleEnterVR}
            className="flex items-center gap-2.5 rounded-2xl font-bold transition-transform duration-200 hover:scale-105 active:scale-95"
            style={{
              padding: '14px 28px',
              background: '#E8D9B0',
              color: '#1a1512',
              fontSize: 16,
              boxShadow: '0 6px 28px rgba(232,217,176,0.4), 0 2px 10px rgba(0,0,0,0.5)',
              letterSpacing: '0.02em',
            }}
          >
            <Glasses size={20} strokeWidth={2.5} />
            Entrar en Modo VR
          </button>
          <span style={{ fontSize: 11, color: 'rgba(232,217,176,0.55)' }}>
            {vrSupported ? 'Ponte el visor y toca el botón' : 'Abre esta página en el navegador del Meta Quest'}
          </span>
          {vrError && (
            <span style={{ fontSize: 11, color: '#ff9b9b', maxWidth: 320, textAlign: 'center' }}>
              {vrError}
            </span>
          )}
        </div>
      )}

      {!ready && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black">
          <span style={{ color: BRAND, fontSize: 14, letterSpacing: '0.2em' }} className="uppercase">
            Cargando experiencia VR…
          </span>
        </div>
      )}
    </div>
  );
}
