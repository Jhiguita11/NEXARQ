'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import PanoViewer from '@/components/pano-viewer';
import FloorPlan from '@/components/floor-plan';
import TourControls from '@/components/tour-controls';
import InfoPanel from '@/components/info-panel';
import LeftSidebar from '@/components/left-sidebar';
import BuildingSelector from '@/components/building-selector';
import { useTourStore } from '@/lib/tour-store';
import type { HotspotConfig } from '@/lib/tour-types';
import {
  Eye,
  Building2,
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
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black">
      <div className="relative w-20 h-20 mb-10">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: '#D4AF37',
            animation: 'loading-ring-spin 1.2s linear infinite',
          }}
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: 'rgba(212,175,55,0.3)',
            animation: 'loading-ring-spin 1.8s linear infinite reverse',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Building2 size={24} style={{ color: '#D4AF37' }} />
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-1 tracking-wider" style={{ color: '#D4AF37' }}>
        {config.brand.name}
      </h1>
      <p className="text-sm mb-6 text-white/30">
        {config.brand.tagline}
      </p>
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
      <div
        className="text-center max-w-md px-8"
        style={{ animation: 'welcome-scale-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div
          className="w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center border"
          style={{
            background: 'rgba(212,175,55,0.08)',
            borderColor: 'rgba(212,175,55,0.15)',
            boxShadow: '0 16px 48px rgba(212,175,55,0.1)',
            animation: 'welcome-fade-in 0.6s ease 0.2s both',
          }}
        >
          <Building2 size={44} style={{ color: '#D4AF37' }} />
        </div>

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
  const { config, selectedApartment, clearApartment } = useTourStore();

  return (
    <div
      className="fixed top-4 right-4 z-[60] flex items-center gap-2.5 px-4 py-2.5 rounded-xl backdrop-blur-xl border cursor-default select-none"
      style={{
        background: 'rgba(0,0,0,0.5)',
        borderColor: 'rgba(212,175,55,0.12)',
      }}
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.12)' }}>
        <Building2 size={14} style={{ color: '#D4AF37' }} />
      </div>
      <div>
        <p className="text-xs font-bold tracking-wide" style={{ color: '#D4AF37' }}>
          {selectedApartment ? selectedApartment.name : config.brand.name}
        </p>
        <p className="text-[10px] text-white/30">
          {selectedApartment ? config.brand.tagline : 'Recorrido Virtual'}
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
    showInfo,
    autoRotate,
    isTransitioning,
    setTransitioning,
  } = useTourStore();

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
    return <BuildingSelector />;
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
          <BrandBadge />
          {showHelp && <HelpHint />}
          <FloorPlan />
          <InfoPanel />
          <TourControls viewerRef={viewerRef} />
        </>
      )}
    </div>
  );
}
