'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import PanoViewer from '@/components/pano-viewer';
import FloorPlan from '@/components/floor-plan';
import TourControls from '@/components/tour-controls';
import InfoPanel from '@/components/info-panel';
import LeftSidebar from '@/components/left-sidebar';
import BuildingSelector from '@/components/building-selector';
import SceneSelector from '@/components/scene-selector';
import SplashScreen from '@/components/splash-screen';
import { useTourStore } from '@/lib/tour-store';
import type { HotspotConfig } from '@/lib/tour-types';
import { assetPath } from '@/lib/asset-path';
import {
  Eye,
  ArrowLeft,
} from 'lucide-react';

interface PanoViewerHandle {
  getViewer: () => any;
  getPitch: () => number;
  getYaw: () => number;
  getHfov: () => number;
  lookAt: (pitch?: number, yaw?: number, hfov?: number) => void;
}

// ═══════════════════════════════════════════════════════════════════
//  Loading Screen
// ═══════════════════════════════════════════════════════════════════
function LoadingScreen() {
  const { config } = useTourStore();
  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black gap-0">
      {/* Logo centrado */}
      <img
        src={assetPath('/logo-transparent.png')}
        alt="NEXARQ 360"
        style={{ width: 200, height: 'auto', filter: 'brightness(0) invert(1)', display: 'block' }}
        draggable={false}
      />

      {/* Spinner */}
      <div className="relative w-10 h-10 mt-8 mb-6">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#D4AF37', animation: 'loading-ring-spin 1.2s linear infinite' }}
        />
        <div
          className="absolute inset-1 rounded-full border-2 border-transparent"
          style={{ borderTopColor: 'rgba(212,175,55,0.3)', animation: 'loading-ring-spin 1.8s linear infinite reverse' }}
        />
      </div>

      {/* Dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: '#D4AF37', animation: `loading-pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Tour Welcome (per apartment)
// ═══════════════════════════════════════════════════════════════════
function TourWelcome({ onStart }: { onStart: () => void }) {
  const { selectedApartment, config } = useTourStore();

  return (
    <div
      className="absolute inset-0 z-[90] flex items-center justify-center cursor-pointer"
      style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.92) 100%)' }}
      onClick={onStart}
    >
      {/* Logo anclado en esquina inferior izquierda */}
      <div
        className="absolute bottom-6 left-6"
        style={{ animation: 'welcome-fade-in 0.6s ease 0.2s both' }}
      >
        <img src={assetPath('/logo-transparent.png')} alt="NEXARQ 360" style={{ height: 56, width: 'auto', filter: 'brightness(0) invert(1)' }} draggable={false} />
      </div>

      <div
        className="text-center max-w-md px-8"
        style={{ animation: 'welcome-scale-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <h1
          className="text-3xl font-extrabold tracking-tight mb-2"
          style={{ color: '#D4AF37', animation: 'welcome-fade-up 0.6s ease 0.3s both' }}
        >
          {selectedApartment?.name ?? ''}
        </h1>

        <p
          className="text-sm mb-10 text-white/50"
          style={{ animation: 'welcome-fade-up 0.6s ease 0.4s both' }}
        >
          {selectedApartment?.description ?? ''}
        </p>

        <button
          onClick={e => { e.stopPropagation(); onStart(); }}
          className="group relative px-10 py-3.5 rounded-2xl text-base font-semibold text-black transition-all duration-300 hover:scale-105 active:scale-95 inline-flex items-center gap-3 cursor-pointer"
          style={{ background: '#D4AF37', animation: 'welcome-fade-up 0.6s ease 0.5s both' }}
        >
          <Eye size={20} />
          Iniciar Recorrido 360°
        </button>

        <p
          className="text-xs mt-6 text-white/20"
          style={{ animation: 'welcome-fade-in 0.6s ease 0.7s both' }}
        >
          Arrastra para explorar · Toca los puntos para navegar
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Brand Badge
// ═══════════════════════════════════════════════════════════════════
function BrandBadge() {
  const { config, selectedApartment, clearApartment, currentSceneId } = useTourStore();
  const isZonaPet = currentSceneId === 'zona-pet-a';

  return (
    <div
      className="fixed top-3 right-3 md:top-4 md:right-4 z-[60] flex items-center gap-2 md:gap-2.5 px-3 md:px-4 py-2 md:py-2.5 rounded-xl backdrop-blur-xl border cursor-default select-none"
      style={{
        background: 'rgba(0,0,0,0.5)',
        borderColor: 'rgba(212,175,55,0.12)',
      }}
    >
      <img
        src={assetPath('/logo-transparent.png')}
        alt="NEXARQ 360"
        style={{ height: 22, width: 'auto', filter: 'brightness(0) invert(1)' }}
        className="md:!h-7"
        draggable={false}
      />
      <div
        className="w-px self-stretch"
        style={{ background: 'rgba(212,175,55,0.2)' }}
      />
      <div>
        <p className="text-xs font-bold tracking-wide" style={{ color: '#D4AF37' }}>
          {isZonaPet ? 'Zona Mascotas' : selectedApartment ? selectedApartment.name : config.brand.name}
        </p>
        <p className="hidden sm:block text-[10px] text-white/30">
          {isZonaPet ? 'Área Común' : selectedApartment ? config.brand.tagline : 'Recorrido Virtual'}
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
      className="fixed bottom-44 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full backdrop-blur-md border text-center pointer-events-none animate-fade-in"
      style={{
        background: 'rgba(0,0,0,0.4)',
        borderColor: 'rgba(212,175,55,0.1)',
      }}
    >
      <p className="text-[11px] whitespace-nowrap" style={{ color: 'rgba(212,175,55,0.45)' }}>
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
    selectedApartment,
    config,
    setCurrentScene,
    currentSceneId,
    showInfo,
    autoRotate,
    isTransitioning,
    setTransitioning,
  } = useTourStore();

  const [showSplash, setShowSplash] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => config.showWelcome);
  const [showHelp, setShowHelp] = useState(true);
  const lastAptIdRef = useRef<string | null>(null);

  // Track apartment changes to reset welcome
  const currentAptId = selectedApartment?.id ?? null;
  useEffect(() => {
    if (currentAptId && lastAptIdRef.current && currentAptId !== lastAptIdRef.current) {
      const t = requestAnimationFrame(() => {
        setShowWelcome(true);
        setShowHelp(true);
      });
      lastAptIdRef.current = currentAptId;
      return () => cancelAnimationFrame(t);
    }
    lastAptIdRef.current = currentAptId;
  }, [currentAptId]);

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

  // Hide help hint after 6s
  useEffect(() => {
    if (!showWelcome && selectedApartment) {
      const t = setTimeout(() => setShowHelp(false), 6000);
      return () => clearTimeout(t);
    }
  }, [showWelcome, selectedApartment]);

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

  const handleStartTour = () => setShowWelcome(false);

  const isReady = scriptLoaded;

  // ── Building Selection Screen ──
  if (!selectedApartment) {
    return (
      <>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        <BuildingSelector />
      </>
    );
  }

  // ── Tour View ──
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Loading */}
      {!isReady && <LoadingScreen />}

      {/* Welcome */}
      {showWelcome && isReady && <TourWelcome onStart={handleStartTour} />}

      {/* Transition overlay */}
      <div
        className="scene-transition-overlay"
        style={{ opacity: isTransitioning ? 1 : 0, pointerEvents: isTransitioning ? 'all' : 'none' }}
      />

      {/* 360 Viewer */}
      <div className="absolute inset-0" style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <PanoViewer ref={viewerRef} onHotspotClick={handleHotspotClick} />
      </div>

      {/* UI Overlays */}
      {!showWelcome && isReady && (
        <>
          <LeftSidebar />
          <SceneSelector />
          <BrandBadge />
          {showHelp && <HelpHint />}
          <div className="hidden md:block">{currentSceneId !== 'zona-pet-a' && <FloorPlan />}</div>
          <InfoPanel />
          <TourControls viewerRef={viewerRef} />
        </>
      )}
    </div>
  );
}
