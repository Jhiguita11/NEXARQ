'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { PanoViewer, PanoViewerHandle } from '@/components/pano-viewer';
import { FloorPlan } from '@/components/floor-plan';
import { TourControls } from '@/components/tour-controls';
import { SceneSelector } from '@/components/scene-selector';
import { HotspotEditor } from '@/components/hotspot-editor';
import { InfoPanel } from '@/components/info-panel';
import { useTourStore } from '@/lib/tour-store';
import { HotspotData } from '@/lib/tour-types';
import { Eye, EyeOff, Building2, Loader2 } from 'lucide-react';

export default function Home() {
  const viewerRef = useRef<PanoViewerHandle>(null);
  const { setCurrentScene, showInfo, nextScene, tour } = useTourStore();
  const isEditMode = useTourStore(s => s.isEditMode);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleHotspotClick = useCallback((hotspot: HotspotData) => {
    switch (hotspot.type) {
      case 'scene':
        if (hotspot.targetSceneId) {
          setCurrentScene(hotspot.targetSceneId);
        }
        break;
      case 'info':
        showInfo(hotspot.text);
        break;
      case 'url':
        if (hotspot.url) {
          window.open(hotspot.url, '_blank');
        }
        break;
    }
  }, [setCurrentScene, showInfo]);

  useEffect(() => {
    // Check if pannellum script is loaded
    const checkLoaded = setInterval(() => {
      if ((window as any).pannellum) {
        setIsLoaded(true);
        clearInterval(checkLoaded);
      }
    }, 200);
    return () => clearInterval(checkLoaded);
  }, []);

  // Hide welcome after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleStartTour = () => {
    setShowWelcome(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-[100]">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin" />
            <Building2 size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">{tour.brandName}</h1>
          <p className="text-white/50 text-sm mb-1">{tour.name}</p>
          <p className="text-white/30 text-xs">Cargando recorrido virtual 360°</p>
        </div>
      )}

      {/* Welcome Overlay */}
      {showWelcome && isLoaded && (
        <div
          className="absolute inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-md cursor-pointer"
          onClick={handleStartTour}
        >
          <div className="text-center max-w-md px-6 animate-in fade-in zoom-in duration-500">
            {/* Logo */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Building2 size={40} className="text-white" />
            </div>

            <h1 className="text-white text-3xl font-bold mb-2">{tour.brandName}</h1>
            <h2 className="text-emerald-400 text-xl font-semibold mb-3">{tour.name}</h2>
            <p className="text-white/50 text-sm mb-8">{tour.description}</p>

            {/* Start Button */}
            <button
              onClick={handleStartTour}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-emerald-500/25 flex items-center gap-3 mx-auto"
            >
              <Eye size={22} />
              Iniciar Recorrido 360°
            </button>

            <p className="text-white/30 text-xs mt-4">Haz clic en cualquier lugar para comenzar</p>
          </div>
        </div>
      )}

      {/* 360 Panoramic Viewer */}
      <div className="absolute inset-0">
        <PanoViewer ref={viewerRef} onHotspotClick={handleHotspotClick} />
      </div>

      {/* Brand Header */}
      <div className={`fixed top-0 left-0 right-0 z-30 p-3 md:p-4 flex items-start pointer-events-none transition-opacity duration-500 ${showWelcome ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 pointer-events-auto">
          <p className="text-emerald-400 text-xs font-bold tracking-wider">{tour.brandName}</p>
          <p className="text-white/60 text-[10px]">{tour.name}</p>
        </div>
      </div>

      {/* Right side info button */}
      <div className={`fixed top-3 right-3 md:top-4 md:right-4 z-30 pointer-events-none transition-opacity duration-500 ${showWelcome ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex gap-2 pointer-events-auto">
          <div className="bg-black/40 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10">
            <p className="text-white/60 text-[10px]">
              <Eye size={10} className="inline mr-1" />
              Arrastra para mirar · Scroll para zoom
            </p>
          </div>
        </div>
      </div>

      {/* Floor Plan */}
      {!showWelcome && <FloorPlan />}

      {/* Info Panel */}
      {!showWelcome && <InfoPanel />}

      {/* Tour Controls */}
      {!showWelcome && <TourControls viewerRef={viewerRef} />}

      {/* Scene Selector */}
      {!showWelcome && <SceneSelector />}

      {/* Hotspot Editor */}
      {!showWelcome && <HotspotEditor />}

      {/* Edit Mode Banner */}
      {isEditMode && !showWelcome && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[60]">
          <div className="bg-amber-500/90 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-2 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-white text-xs font-semibold">MODO EDICIÓN ACTIVO</span>
          </div>
        </div>
      )}
    </div>
  );
}
