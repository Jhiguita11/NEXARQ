'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from 'react';
import type { HotspotConfig } from '@/lib/tour-types';
import { useTourStore } from '@/lib/tour-store';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PanoViewerHandle {
  getViewer: () => unknown | null;
  getPitch: () => number;
  getYaw: () => number;
  getHfov: () => number;
  lookAt: (pitch?: number, yaw?: number, hfov?: number) => void;
}

interface PanoViewerProps {
  /** Optional theme primary colour override (falls back to store) */
  primary?: string;
  /** Called when any hotspot is clicked */
  onHotspotClick?: (hotspot: HotspotConfig) => void;
  /** Extra className for the outer wrapper */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Hotspot CSS (injected once)                                        */
/* ------------------------------------------------------------------ */

const HOTSPOT_CSS = `
.pnlm-hotspot-base { cursor: pointer; z-index: 10; }

/* ── Bubble wrapper ───────────────────────────────────────────── */
.pano-bubble {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  user-select: none;
}

/* ── Icon circle ─────────────────────────────────────────────── */
.pano-bubble-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255,255,255,0.18);
  border: 1.5px solid rgba(255,255,255,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  position: relative;
  animation: bubble-float 3s ease-in-out infinite;
  box-shadow: 0 6px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25);
  transition: transform .2s ease, background .2s ease;
}

.pano-bubble-circle::before {
  content: '';
  position: absolute;
  inset: -9px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.22);
  animation: bubble-pulse 2.6s ease-out infinite;
}

.pano-bubble:hover .pano-bubble-circle {
  transform: scale(1.12) translateY(-2px);
  background: rgba(255,255,255,0.28);
}

/* ── Info variant — gold ─────────────────────────────────────── */
.pano-bubble-info .pano-bubble-circle {
  background: rgba(212,175,55,0.22);
  border-color: rgba(212,175,55,0.7);
  animation-delay: 1.3s;
}
.pano-bubble-info .pano-bubble-circle::before {
  border-color: rgba(212,175,55,0.28);
}

/* ── Room name pill ──────────────────────────────────────────── */
.pano-bubble-label {
  background: rgba(0,0,0,0.62);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 20px;
  padding: 3px 12px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.95);
  white-space: nowrap;
  letter-spacing: 0.04em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

/* ── Animations ──────────────────────────────────────────────── */
@keyframes bubble-float {
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-8px); }
}
@keyframes bubble-pulse {
  0%   { transform: scale(1);   opacity: 0.75; }
  100% { transform: scale(1.75); opacity: 0; }
}

/* ── Fade overlay for scene transitions ──────────────────────── */
.pano-fade-overlay {
  position: absolute;
  inset: 0;
  background: #000;
  z-index: 50;
  pointer-events: none;
  transition: opacity .45s ease;
}
`;

/* ------------------------------------------------------------------ */
/*  Room-aware SVG icons                                              */
/* ------------------------------------------------------------------ */

function roomIcon(label: string, type: HotspotConfig['type']): string {
  const S = 'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  if (type === 'info')
    return `<svg viewBox="0 0 24 24" fill="none" ${S} width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
  if (type === 'url')
    return `<svg viewBox="0 0 24 24" fill="none" ${S} width="20" height="20"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;

  const l = label.toLowerCase();

  // Balcón / Terraza — sun
  if (l.includes('balc') || l.includes('terraz') || l.includes('exterior'))
    return `<svg viewBox="0 0 24 24" fill="none" ${S} width="20" height="20"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;

  // Cocina — chef hat
  if (l.includes('cocina') || l.includes('kitchen'))
    return `<svg viewBox="0 0 24 24" fill="none" ${S} width="20" height="20"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>`;

  // Baño / Bath
  if (l.includes('baño') || l.includes('bano') || l.includes('bath'))
    return `<svg viewBox="0 0 24 24" fill="none" ${S} width="20" height="20"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="7" y1="19" x2="7" y2="21"/><line x1="17" y1="19" x2="17" y2="21"/></svg>`;

  // Alcoba / Dormitorio / Bedroom — bed
  if (l.includes('alcoba') || l.includes('dorm') || l.includes('bedroom') || l.includes('habitac') || l.includes('suite'))
    return `<svg viewBox="0 0 24 24" fill="none" ${S} width="20" height="20"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>`;

  // Sala / Living — sofa
  if (l.includes('sala') || l.includes('estar') || l.includes('living') || l.includes('comedor'))
    return `<svg viewBox="0 0 24 24" fill="none" ${S} width="20" height="20"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z"/><path d="M4 18v2"/><path d="M20 18v2"/><path d="M12 4v9"/></svg>`;

  // Entrada / Hall — door
  if (l.includes('entrada') || l.includes('hall') || l.includes('acceso'))
    return `<svg viewBox="0 0 24 24" fill="none" ${S} width="20" height="20"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.267.962L4 20V5.562a2 2 0 0 1 1.533-1.94l6-1.5a2 2 0 0 1 2.467 1.94Z"/></svg>`;

  // Default — arrow
  return `<svg viewBox="0 0 24 24" fill="none" ${S} width="20" height="20"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>`;
}

/* ------------------------------------------------------------------ */
/*  Build floating bubble for Pannellum                               */
/* ------------------------------------------------------------------ */

function buildHotspotDiv(hs: HotspotConfig): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = `pano-bubble${hs.type === 'info' ? ' pano-bubble-info' : ''}`;

  const circle = document.createElement('div');
  circle.className = 'pano-bubble-circle';
  circle.innerHTML = roomIcon(hs.label ?? '', hs.type);
  wrapper.appendChild(circle);

  // Show room name pill only for navigation hotspots
  if (hs.type === 'scene' && hs.label) {
    const pill = document.createElement('div');
    pill.className = 'pano-bubble-label';
    pill.textContent = hs.label;
    wrapper.appendChild(pill);
  }

  return wrapper;
}

/* ------------------------------------------------------------------ */
/*  Pannellum type declarations                                       */
/* ------------------------------------------------------------------ */

type PannellumViewer = any;

declare global {
  interface Window {
    pannellum: {
      viewer(
        container: string | HTMLElement,
        config: Record<string, unknown>,
      ): PannellumViewer;
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const PanoViewer = forwardRef<PanoViewerHandle, PanoViewerProps>(
  function PanoViewer({ onHotspotClick, className }, ref) {
    /* ── State ─────────────────────────────────────────────────── */
    const [scriptReady, setScriptReady] = useState(false);
    const [fadeOpacity, setFadeOpacity] = useState(0); // 0 = invisible, 1 = fully black

    /* ── Refs ──────────────────────────────────────────────────── */
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<PannellumViewer | null>(null);
    const cssInjected = useRef(false);
    const transitionLock = useRef(false);

    /* ── Store ─────────────────────────────────────────────────── */
    const selectedApartment = useTourStore((s) => s.selectedApartment);
    const scenes = selectedApartment?.scenes ?? [];
    const currentSceneId = useTourStore((s) => s.currentSceneId);
    const autoRotate = useTourStore((s) => s.autoRotate);
    const autoRotateSpeed = useTourStore((s) => s.config.autoRotateSpeed);
    const setTransitioning = useTourStore((s) => s.setTransitioning);
    const themePrimary = useTourStore((s) => s.config.theme.primary);

    /* ── Current scene memo ────────────────────────────────────── */
    const currentScene = scenes.find((s) => s.id === currentSceneId);

    /* ── Inject CSS once ───────────────────────────────────────── */
    useEffect(() => {
      if (cssInjected.current) return;
      cssInjected.current = true;
      const tag = document.createElement('style');
      tag.dataset.panoCss = 'true';
      tag.textContent = HOTSPOT_CSS;
      document.head.appendChild(tag);
    }, []);

    /* ── Load Pannellum from CDN ───────────────────────────────── */
    useEffect(() => {
      if (scriptReady) return;

      // CSS link (idempotent)
      const cssId = 'pannellum-css';
      if (!document.getElementById(cssId)) {
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.href =
          'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
        document.head.appendChild(link);
      }

      // JS script
      const jsId = 'pannellum-js';
      const existing = document.getElementById(jsId) as HTMLScriptElement | null;
      if (existing) {
        // Already in DOM – wait for load if still pending
        if (window.pannellum) {
          requestAnimationFrame(() => setScriptReady(true));
        } else {
          existing.addEventListener('load', () => setScriptReady(true), {
            once: true,
          });
        }
        return;
      }

      const script = document.createElement('script');
      script.id = jsId;
      script.src =
        'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.async = true;
      script.addEventListener('load', () => setScriptReady(true), { once: true });
      document.body.appendChild(script);
    }, [scriptReady]);

    /* ── Build Pannellum config ────────────────────────────────── */
    const buildConfig = useCallback(
      (sceneId: string) => {
        const scene = scenes.find((s) => s.id === sceneId);
        if (!scene) return null;

        const hotspots: Record<string, unknown>[] = (scene.hotspots ?? []).map(
          (hs: HotspotConfig, idx: number) => ({
            id: `hs-${sceneId}-${idx}`,
            pitch: hs.pitch,
            yaw: hs.yaw,
            type: 'custom' as const,
            createTooltipFunc: () => buildHotspotDiv(hs),
            clickHandlerFunc: () => {
              onHotspotClick?.(hs);
            },
          }),
        );

        return {
          type: 'equirectangular',
          panorama: scene.panorama,
          default: {
            ...scene.defaultView,
            autoRotate: autoRotate ? autoRotateSpeed : 0,
            autoRotateInactivityDelay: autoRotate ? 2000 : 0,
            compass: false,
            showZoomCtrl: false,
            showFullscreenCtrl: false,
            mouseZoom: true,
            hfov: scene.defaultView?.hfov ?? 120,
            pitch: scene.defaultView?.pitch ?? 0,
            yaw: scene.defaultView?.yaw ?? 0,
          },
          hotspots,
          autoLoad: true,
          showControls: false,
          draggable: true,
          friction: 0.15,
          minYaw: -180,
          maxYaw: 180,
          minPitch: -85,
          maxPitch: 85,
        };
      },
      [scenes, autoRotate, autoRotateSpeed, onHotspotClick],
    );

    /* ── Initialise / re-init viewer ───────────────────────────── */
    const initViewer = useCallback(
      (sceneId: string) => {
        if (!containerRef.current || !window.pannellum) return;

        // Destroy previous
        if (viewerRef.current) {
          try {
            viewerRef.current.destroy();
          } catch {
            /* ignore */
          }
          viewerRef.current = null;
        }

        // Clear container
        containerRef.current.innerHTML = '';

        const config = buildConfig(sceneId);
        if (!config) return;

        try {
          viewerRef.current = window.pannellum.viewer(
            containerRef.current,
            config,
          );
        } catch (err) {
          console.error('[PanoViewer] Init failed:', err);
        }
      },
      [buildConfig],
    );

    /* ── Scene change with fade ────────────────────────────────── */
    useEffect(() => {
      if (!scriptReady || !currentSceneId) return;
      if (transitionLock.current) return;

      // If no viewer yet, just init directly
      if (!viewerRef.current) {
        initViewer(currentSceneId);
        // Quick fade in
        requestAnimationFrame(() => {
          setFadeOpacity(0);
        });
        return;
      }

      // Fade out → switch → fade in
      transitionLock.current = true;
      setTransitioning(true);
      requestAnimationFrame(() => setFadeOpacity(1));

      const FADE_DURATION = 450; // match CSS transition

      setTimeout(() => {
        initViewer(currentSceneId);

        // Allow render, then fade in
        requestAnimationFrame(() => {
          setFadeOpacity(0);
          setTransitioning(false);
          transitionLock.current = false;
        });
      }, FADE_DURATION);
    }, [scriptReady, currentSceneId, initViewer, setTransitioning]);

    /* ── Fullscreen change handler ─────────────────────────────── */
    useEffect(() => {
      const onFsChange = () => {
        // Force Pannellum to resize after fullscreen toggle
        if (viewerRef.current) {
          setTimeout(() => {
            try {
              viewerRef.current.resize();
            } catch {
              /* ignore */
            }
          }, 100);
        }
      };

      document.addEventListener('fullscreenchange', onFsChange);
      document.addEventListener('webkitfullscreenchange', onFsChange);

      return () => {
        document.removeEventListener('fullscreenchange', onFsChange);
        document.removeEventListener('webkitfullscreenchange', onFsChange);
      };
    }, []);

    /* ── Imperative handle ─────────────────────────────────────── */
    useImperativeHandle(ref, () => ({
      getViewer: () => viewerRef.current,
      getPitch: () =>
        viewerRef.current?.getPitch?.() ?? 0,
      getYaw: () =>
        viewerRef.current?.getYaw?.() ?? 0,
      getHfov: () =>
        viewerRef.current?.getHfov?.() ?? 100,
      lookAt: (pitch?: number, yaw?: number, hfov?: number) => {
        if (!viewerRef.current) return;
        try {
          viewerRef.current.lookAt(pitch, yaw, hfov);
        } catch {
          /* ignore */
        }
      },
    }));

    /* ── Render ────────────────────────────────────────────────── */
    return (
      <div
        className={className}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: 8,
          background: '#0a0a0a',
        }}
      >
        {/* Pannellum container */}
        <div
          ref={containerRef}
          style={{
            width: '100%',
            height: '100%',
            opacity: fadeOpacity < 1 ? 1 : 0,
            transition: 'opacity .3s ease',
          }}
        />

        {/* Fade overlay */}
        <div
          className="pano-fade-overlay"
          style={{ opacity: fadeOpacity }}
          aria-hidden
        />

        {/* Loading state */}
        {!scriptReady && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              zIndex: 100,
              background: '#0a0a0a',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                border: `3px solid rgba(${hexToRgb(themePrimary ?? '#3b82f6')}, .2)`,
                borderTopColor: themePrimary ?? '#3b82f6',
                borderRadius: '50%',
                animation: 'pano-spin 1s linear infinite',
              }}
            />
            <span
              style={{
                color: '#94a3b8',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Loading viewer…
            </span>
            <style>{`@keyframes pano-spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}
      </div>
    );
  },
);

PanoViewer.displayName = 'PanoViewer';

export default PanoViewer;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Convert "#rrggbb" to "r, g, b" for rgba usage */
function hexToRgb(hex: string): string {
  const cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    return [
      parseInt(cleaned[0] + cleaned[0], 16),
      parseInt(cleaned[1] + cleaned[1], 16),
      parseInt(cleaned[2] + cleaned[2], 16),
    ].join(', ');
  }
  const n = parseInt(cleaned, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}
