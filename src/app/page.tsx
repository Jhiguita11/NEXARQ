'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import PanoViewer from '@/components/pano-viewer';
import FloorPlan from '@/components/floor-plan';
import TourControls from '@/components/tour-controls';
import SceneSelector from '@/components/scene-selector';
import InfoPanel from '@/components/info-panel';
import { useTourStore } from '@/lib/tour-store';
import type { HotspotConfig } from '@/lib/tour-types';

interface PanoViewerHandle {
  getViewer: () => any;
  getPitch: () => number;
  getYaw: () => number;
  getHfov: () => number;
  lookAt: (pitch?: number, yaw?: number, hfov?: number) => void;
}
import {
  Eye,
  Building2,
  RotateCcw,
  Maximize2,
  MapPin,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
//  Loading Screen
// ═══════════════════════════════════════════════════════════════════
function LoadingScreen() {
  const { config } = useTourStore();
  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black">
      {/* Animated ring */}
      <div className="relative w-20 h-20 mb-10">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: config.theme.primary,
            animation: 'loading-ring-spin 1.2s linear infinite',
          }}
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: config.theme.secondary,
            animation: 'loading-ring-spin 1.8s linear infinite reverse',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Building2 size={24} style={{ color: config.theme.primary }} />
        </div>
      </div>

      {/* Brand */}
      <h1
        className="text-2xl font-bold mb-1 tracking-wider"
        style={{ color: config.theme.primary }}
      >
        {config.brand.name}
      </h1>
      <p
        className="text-sm mb-6"
        style={{ color: 'rgba(255,255,255,0.35)' }}
      >
        {config.brand.tagline}
      </p>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: config.theme.primary,
              animation: `loading-pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Welcome Screen
// ═══════════════════════════════════════════════════════════════════
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const { config } = useTourStore();
  const primary = config.theme.primary;

  return (
    <div
      className="absolute inset-0 z-[90] flex items-center justify-center cursor-pointer"
      style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)' }}
      onClick={onStart}
    >
      <div
        className="text-center max-w-md px-8"
        style={{ animation: 'welcome-scale-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {/* Logo mark */}
        <div
          className="w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${primary} 0%, ${primary}99 100%)`,
            boxShadow: `0 16px 48px ${primary}33`,
            animation: 'welcome-fade-in 0.6s ease 0.2s both',
          }}
        >
          <Building2 size={44} className="text-white" />
        </div>

        {/* Title */}
        <h1
          className="text-white text-4xl font-extrabold tracking-tight mb-2"
          style={{ animation: 'welcome-fade-up 0.6s ease 0.3s both' }}
        >
          {config.brand.name}
        </h1>

        {/* Tagline */}
        <p
          className="text-lg mb-10"
          style={{ color: primary, animation: 'welcome-fade-up 0.6s ease 0.4s both' }}
        >
          {config.brand.tagline}
        </p>

        {/* CTA */}
        <button
          onClick={e => { e.stopPropagation(); onStart(); }}
          className="group relative px-10 py-3.5 rounded-2xl text-base font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 inline-flex items-center gap-3"
          style={{
            background: `linear-gradient(135deg, ${primary} 0%, ${primary}cc 100%)`,
            boxShadow: `0 8px 32px ${primary}44`,
            animation: 'welcome-fade-up 0.6s ease 0.5s both',
          }}
        >
          <Eye size={20} />
          Iniciar Recorrido 360°
          <span
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: `0 0 40px ${primary}33` }}
          />
        </button>

        {/* Subtitle */}
        <p
          className="text-xs mt-6"
          style={{ color: 'rgba(255,255,255,0.25)', animation: 'welcome-fade-in 0.6s ease 0.7s both' }}
        >
          Haz clic para comenzar · Arrastra para explorar
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Compass Indicator
// ═══════════════════════════════════════════════════════════════════
function Compass({ viewerRef }: { viewerRef: React.RefObject<PanoViewerHandle | null> }) {
  const { config } = useTourStore();
  const [yaw, setYaw] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (viewerRef.current) {
        try { setYaw(viewerRef.current.getYaw()); } catch {}
      }
    }, 200);
    return () => clearInterval(interval);
  }, [viewerRef]);

  return (
    <div
      className="fixed top-4 right-4 z-30 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border"
      style={{
        background: 'rgba(0,0,0,0.4)',
        borderColor: 'rgba(255,255,255,0.1)',
      }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" className="transition-transform duration-200" style={{ transform: `rotate(${-yaw}deg)` }}>
        {/* N */}
        <text x="14" y="7" textAnchor="middle" fill={config.theme.primary} fontSize="7" fontWeight="bold">N</text>
        {/* Needle */}
        <polygon points="14,9 12,16 16,16" fill={config.theme.primary} opacity="0.9" />
        <polygon points="14,19 12,16 16,16" fill="rgba(255,255,255,0.25)" />
        {/* S */}
        <text x="14" y="26" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="5">S</text>
        {/* E/W */}
        <text x="24" y="16" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="5">E</text>
        <text x="4" y="16" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="5">O</text>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Brand Badge (top-left)
// ═══════════════════════════════════════════════════════════════════
function BrandBadge() {
  const { config } = useTourStore();
  return (
    <div
      className="fixed top-4 left-4 z-30 flex items-center gap-2.5 px-4 py-2.5 rounded-xl backdrop-blur-md border cursor-default select-none"
      style={{
        background: 'rgba(0,0,0,0.4)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${config.theme.primary} 0%, ${config.theme.primary}88 100%)` }}
      >
        <Building2 size={14} className="text-white" />
      </div>
      <div>
        <p className="text-xs font-bold tracking-wide" style={{ color: config.theme.primary }}>
          {config.brand.name}
        </p>
        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {config.brand.tagline}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Help Hint
// ═══════════════════════════════════════════════════════════════════
function HelpHint() {
  return (
    <div
      className="fixed bottom-28 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full backdrop-blur-md border text-center pointer-events-none animate-fade-in"
      style={{
        background: 'rgba(0,0,0,0.35)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <p className="text-[11px] whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Arrastra para mirar · Scroll para zoom · Toca los puntos para navegar
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════════════
export default function Home() {
  const viewerRef = useRef<PanoViewerHandle>(null);
  const {
    config,
    setCurrentScene,
    showInfo,
    autoRotate,
    isLoading,
    isTransitioning,
    setTransitioning,
  } = useTourStore();

  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(config.showWelcome);
  const [showHelp, setShowHelp] = useState(true);

  // Wait for Pannellum script
  useEffect(() => {
    const interval = setInterval(() => {
      if ((window as any).pannellum) {
        setScriptLoaded(true);
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Hide help hint after 5s
  useEffect(() => {
    if (!showWelcome) {
      const t = setTimeout(() => setShowHelp(false), 6000);
      return () => clearTimeout(t);
    }
  }, [showWelcome]);

  const handleHotspotClick = useCallback(
    (hotspot: HotspotConfig) => {
      switch (hotspot.type) {
        case 'scene':
          if (hotspot.targetSceneId) setCurrentScene(hotspot.targetSceneId);
          break;
        case 'info':
          showInfo(hotspot.label, hotspot.description || '');
          break;
        case 'url':
          if (hotspot.url) window.open(hotspot.url, '_blank');
          break;
      }
    },
    [setCurrentScene, showInfo]
  );

  const handleStart = () => setShowWelcome(false);

  const isReady = scriptLoaded;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* ── Loading ── */}
      {!isReady && <LoadingScreen />}

      {/* ── Welcome ── */}
      {showWelcome && isReady && <WelcomeScreen onStart={handleStart} />}

      {/* ── Transition overlay ── */}
      <div
        className="scene-transition-overlay"
        style={{ opacity: isTransitioning ? 1 : 0, pointerEvents: isTransitioning ? 'all' : 'none' }}
      />

      {/* ── 360 Viewer ── */}
      <div className="absolute inset-0" style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <PanoViewer ref={viewerRef} onHotspotClick={handleHotspotClick} />
      </div>

      {/* ── UI Overlays (hidden behind welcome) ── */}
      {!showWelcome && isReady && (
        <>
          <BrandBadge />
          <Compass viewerRef={viewerRef} />
          {showHelp && <HelpHint />}
          <FloorPlan />
          <InfoPanel />
          <TourControls viewerRef={viewerRef} />
          <SceneSelector />
        </>
      )}
    </div>
  );
}
