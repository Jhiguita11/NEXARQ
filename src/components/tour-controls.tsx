'use client';

import { useTourStore } from '@/lib/tour-store';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Maximize2,
  Minimize2,
  MapPin,
  List,
  Edit3,
  ZoomIn,
  ZoomOut,
  Home,
  Eye,
} from 'lucide-react';
import { PanoViewerHandle } from './pano-viewer';

interface TourControlsProps {
  viewerRef: React.RefObject<PanoViewerHandle | null>;
}

export function TourControls({ viewerRef }: TourControlsProps) {
  const {
    tour,
    currentScene,
    currentSceneIndex,
    nextScene,
    prevScene,
    isFullscreen,
    toggleFullscreen,
    showFloorPlan,
    toggleFloorPlan,
    showSceneList,
    toggleSceneList,
    autoRotate,
    toggleAutoRotate,
    isEditMode,
    toggleEditMode,
  } = useTourStore();

  const scene = tour.scenes[currentSceneIndex];

  const handleZoomIn = () => {
    if (viewerRef.current) {
      const hfov = viewerRef.current.getHfov();
      viewerRef.current.lookAt(
        viewerRef.current.getPitch(),
        viewerRef.current.getYaw(),
        Math.max(30, hfov - 10)
      );
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current) {
      const hfov = viewerRef.current.getHfov();
      viewerRef.current.lookAt(
        viewerRef.current.getPitch(),
        viewerRef.current.getYaw(),
        Math.min(120, hfov + 10)
      );
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
    toggleFullscreen();
  };

  const handleGoHome = () => {
    if (scene && viewerRef.current) {
      viewerRef.current.lookAt(
        scene.defaultView.pitch,
        scene.defaultView.yaw,
        scene.defaultView.hfov
      );
    }
  };

  const totalScenes = tour.scenes.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Scene Name Bar */}
      <div className="flex justify-center mb-3">
        <div className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 flex items-center gap-3">
          {/* Previous */}
          <button
            onClick={prevScene}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all"
            title="Escena anterior"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Scene indicator */}
          <div className="flex items-center gap-2 px-3">
            <div className="flex gap-1">
              {tour.scenes.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => useTourStore.getState().setCurrentScene(s.id)}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentSceneIndex
                      ? 'w-6 h-2 bg-emerald-400'
                      : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                  }`}
                  title={s.name}
                />
              ))}
            </div>
          </div>

          {/* Next */}
          <button
            onClick={nextScene}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all"
            title="Siguiente escena"
          >
            <ChevronRight size={20} />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-white/20" />

          {/* Scene Name */}
          <div className="text-center min-w-[120px]">
            <p className="text-white font-semibold text-sm leading-tight">
              {scene?.name}
            </p>
            <p className="text-white/50 text-[10px] leading-tight">
              {currentSceneIndex + 1} / {totalScenes}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-center pb-4">
        <div className="bg-black/60 backdrop-blur-md rounded-xl px-2 py-1.5 border border-white/10 flex items-center gap-1">
          {/* Home */}
          <ControlButton onClick={handleGoHome} title="Vista inicial">
            <Home size={16} />
          </ControlButton>

          {/* Auto Rotate */}
          <ControlButton
            onClick={toggleAutoRotate}
            title={autoRotate ? 'Detener rotación' : 'Auto rotación'}
            active={autoRotate}
          >
            <RotateCcw size={16} className={autoRotate ? 'animate-spin' : ''} style={autoRotate ? { animationDuration: '3s' } : {}} />
          </ControlButton>

          {/* Zoom */}
          <ControlButton onClick={handleZoomOut} title="Alejar">
            <ZoomOut size={16} />
          </ControlButton>
          <ControlButton onClick={handleZoomIn} title="Acercar">
            <ZoomIn size={16} />
          </ControlButton>

          {/* Divider */}
          <div className="w-px h-6 bg-white/20 mx-1" />

          {/* Floor Plan */}
          <ControlButton
            onClick={toggleFloorPlan}
            title={showFloorPlan ? 'Ocultar plano' : 'Mostrar plano'}
            active={showFloorPlan}
          >
            <MapPin size={16} />
          </ControlButton>

          {/* Scene List */}
          <ControlButton
            onClick={toggleSceneList}
            title="Lista de escenas"
            active={showSceneList}
          >
            <List size={16} />
          </ControlButton>

          {/* Divider */}
          <div className="w-px h-6 bg-white/20 mx-1" />

          {/* Edit Mode */}
          <ControlButton
            onClick={toggleEditMode}
            title={isEditMode ? 'Salir del modo edición' : 'Modo edición'}
            active={isEditMode}
            activeColor="amber"
          >
            <Edit3 size={16} />
          </ControlButton>

          {/* Fullscreen */}
          <ControlButton onClick={handleFullscreen} title="Pantalla completa">
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </ControlButton>
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  children,
  onClick,
  title,
  active = false,
  activeColor = 'emerald',
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  active?: boolean;
  activeColor?: 'emerald' | 'amber';
}) {
  const colorClass = active
    ? activeColor === 'emerald'
      ? 'bg-emerald-500/20 text-emerald-400'
      : 'bg-amber-500/20 text-amber-400'
    : 'text-white/70 hover:text-white hover:bg-white/10';

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 ${colorClass}`}
      title={title}
    >
      {children}
    </button>
  );
}
