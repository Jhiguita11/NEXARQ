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
/* ── Glassmorphism bubble base ─────────────────────────────────── */
.pnlm-hotspot-base {
  transition: transform .25s cubic-bezier(.4,0,.2,1),
              box-shadow .25s cubic-bezier(.4,0,.2,1);
  cursor: pointer;
  z-index: 10;
}

/* ── Hotspot icon circles ──────────────────────────────────────── */
.pano-hotspot {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  border: 2px solid rgba(255,255,255,.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  position: relative;
  transition: transform .25s cubic-bezier(.4,0,.2,1),
              box-shadow .25s cubic-bezier(.4,0,.2,1);
}

/* Type: scene – green */
.pano-hotspot--scene {
  background: rgba(34,197,94,.65);
  box-shadow: 0 0 12px rgba(34,197,94,.35);
}
.pano-hotspot--scene:hover {
  transform: scale(1.15);
  box-shadow: 0 0 24px rgba(34,197,94,.55);
}

/* Type: info – blue */
.pano-hotspot--info {
  background: rgba(59,130,246,.65);
  box-shadow: 0 0 12px rgba(59,130,246,.35);
}
.pano-hotspot--info:hover {
  transform: scale(1.15);
  box-shadow: 0 0 24px rgba(59,130,246,.55);
}

/* Type: url – purple */
.pano-hotspot--url {
  background: rgba(168,85,247,.65);
  box-shadow: 0 0 12px rgba(168,85,247,.35);
}
.pano-hotspot--url:hover {
  transform: scale(1.15);
  box-shadow: 0 0 24px rgba(168,85,247,.55);
}

/* ── Pulse ring (scene hotspots only) ──────────────────────────── */
.pano-hotspot--scene::after {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(34,197,94,.6);
  animation: pano-pulse 2s ease-out infinite;
}

@keyframes pano-pulse {
  0%   { transform: scale(1);   opacity: 1; }
  100% { transform: scale(1.6); opacity: 0; }
}

/* ── Tooltip glass bubble ──────────────────────────────────────── */
.pano-tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(6px);
  padding: 6px 14px;
  border-radius: 10px;
  background: rgba(15,15,20,.55);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255,255,255,.15);
  color: #f1f5f9;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity .2s ease, transform .2s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,.25);
}
.pano-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: rgba(15,15,20,.55);
}

.pano-hotspot:hover .pano-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ── Fade overlay for scene transitions ────────────────────────── */
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
/*  SVG icon helpers                                                  */
/* ------------------------------------------------------------------ */

const ICON_ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>`;

const ICON_INFO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;

const ICON_LINK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;

function hotspotIcon(type: HotspotConfig['type']): string {
  switch (type) {
    case 'scene':
      return ICON_ARROW;
    case 'info':
      return ICON_INFO;
    case 'url':
      return ICON_LINK;
    default:
      return ICON_INFO;
  }
}

/* ------------------------------------------------------------------ */
/*  Build hotspot div HTML for Pannellum                              */
/* ------------------------------------------------------------------ */

function buildHotspotDiv(hs: HotspotConfig): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = `pano-hotspot pano-hotspot--${hs.type}`;
  wrapper.style.position = 'relative';

  wrapper.innerHTML = `
    ${hotspotIcon(hs.type)}
    <span class="pano-tooltip">${hs.label ?? hs.type}</span>
  `;

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
    const scenes = useTourStore((s) => s.config.scenes);
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
            autoRotate: autoRotate ? autoRotateSpeed : -1,
            compass: false,
            showZoomCtrl: false,
            showFullscreenCtrl: false,
            mouseZoom: true,
            hfov: scene.defaultView?.hfov ?? 100,
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
