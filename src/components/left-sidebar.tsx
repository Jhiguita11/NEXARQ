'use client';

import { useTourStore } from '@/lib/tour-store';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Home,
  Bed,
  Bath,
  Sofa,
  DoorOpen,
  Sun,
  Maximize2,
  Building2,
  ArrowLeft,
} from 'lucide-react';

export default function LeftSidebar() {
  const {
    selectedApartment,
    config,
    currentSceneId,
    showLeftSidebar,
    toggleLeftSidebar,
    setCurrentScene,
    clearApartment,
  } = useTourStore();

  if (!selectedApartment) return null;

  const scenes = selectedApartment.scenes;
  const floorPlan = selectedApartment.floorPlan;

  // Icon mapping by room name keywords
  function getRoomIcon(name: string) {
    const n = name.toLowerCase();
    if (n.includes('entrada') || n.includes('hall')) return <DoorOpen size={16} />;
    if (n.includes('sala') || n.includes('estar')) return <Sofa size={16} />;
    if (n.includes('cocina')) return <Maximize2 size={16} />;
    if (n.includes('dorm')) return <Bed size={16} />;
    if (n.includes('baño') || n.includes('bath')) return <Bath size={16} />;
    if (n.includes('terraza') || n.includes('balcón')) return <Sun size={16} />;
    return <Home size={16} />;
  }

  return (
    <>
      {/* Toggle button (always visible when sidebar is closed) */}
      {!showLeftSidebar && (
        <button
          onClick={toggleLeftSidebar}
          className="fixed top-4 left-4 z-[60] w-10 h-10 flex items-center justify-center rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 text-white/60 hover:text-white hover:bg-black/80 hover:border-white/20 transition-all duration-200 cursor-pointer"
          aria-label="Abrir barra lateral"
        >
          <PanelLeftOpen size={18} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-[70] h-full flex flex-col bg-black/80 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          showLeftSidebar ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/8 min-h-[65px]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Building2 size={14} className="text-white/70" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {selectedApartment.name}
              </p>
              <p className="text-[10px] text-white/35 truncate">
                {selectedApartment.bedrooms} hab · {selectedApartment.bathrooms} baños · {selectedApartment.area}m²
              </p>
            </div>
          </div>
          <button
            onClick={toggleLeftSidebar}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
            aria-label="Cerrar barra lateral"
          >
            <PanelLeftClose size={16} />
          </button>
        </div>

        {/* Back to building */}
        <div className="px-3 pt-3">
          <button
            onClick={clearApartment}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            Volver a edificios
          </button>
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-y-auto py-3 tour-scrollbar">
          <p className="px-4 mb-2 text-[10px] font-semibold text-white/25 uppercase tracking-widest">
            Espacios
          </p>
          <div className="flex flex-col gap-0.5 px-2">
            {scenes.map((scene, index) => {
              const isActive = scene.id === currentSceneId;

              return (
                <button
                  key={scene.id}
                  onClick={() => setCurrentScene(scene.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left cursor-pointer relative ${
                    isActive
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-white" />
                  )}

                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isActive ? 'bg-white/15' : 'bg-white/5'
                  }`}>
                    <span className={isActive ? 'text-white' : 'text-white/40'}>
                      {getRoomIcon(scene.name)}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug truncate ${
                      isActive ? 'font-bold text-white' : 'font-medium text-white/60'
                    }`}>
                      {scene.name}
                    </p>
                    <p className="text-[10px] text-white/25 truncate mt-0.5">
                      {scene.description}
                    </p>
                  </div>

                  {/* Number */}
                  <span className={`text-[10px] font-bold tabular-nums ${
                    isActive ? 'text-white/60' : 'text-white/20'
                  }`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/8">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-white/25">
              {scenes.length} espacios
            </p>
            <p className="text-[10px] text-white/25">
              {selectedApartment.area}m²
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
