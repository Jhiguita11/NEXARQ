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
  Building2,
  ArrowLeft,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export default function LeftSidebar() {
  const {
    selectedApartment,
    currentSceneId,
    showLeftSidebar,
    toggleLeftSidebar,
    setCurrentScene,
    clearApartment,
  } = useTourStore();

  if (!selectedApartment) return null;

  const scenes = selectedApartment.scenes;

  // Icon mapping by room name keywords
  function getRoomIcon(name: string) {
    const n = name.toLowerCase();
    if (n.includes('entrada') || n.includes('hall')) return <DoorOpen size={16} />;
    if (n.includes('sala') || n.includes('estar')) return <Sofa size={16} />;
    if (n.includes('cocina')) return <Sun size={16} />;
    if (n.includes('dorm')) return <Bed size={16} />;
    if (n.includes('baño') || n.includes('bath')) return <Bath size={16} />;
    if (n.includes('terraza') || n.includes('balcón')) return <Sun size={16} />;
    return <Home size={16} />;
  }

  return (
    <div
      className={`fixed top-0 left-0 z-[70] h-full flex flex-col
        bg-black/70 backdrop-blur-xl border-r border-white/8
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${showLeftSidebar ? 'w-60' : 'w-14'}`}
    >
      {/* ── Header ── */}
      <div className={`flex items-center border-b border-white/8 min-h-[56px] flex-shrink-0
        ${showLeftSidebar ? 'justify-between px-4' : 'justify-center px-0'}`}>
        {showLeftSidebar ? (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Building2 size={14} className="text-white/70" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {selectedApartment.name}
                </p>
                <p className="text-[10px] text-white/30 truncate">
                  {selectedApartment.bedrooms} hab · {selectedApartment.bathrooms} baños
                </p>
              </div>
            </div>
            <button
              onClick={toggleLeftSidebar}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
              aria-label="Colapsar barra lateral"
            >
              <ChevronsLeft size={14} />
            </button>
          </>
        ) : (
          <button
            onClick={toggleLeftSidebar}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Expandir barra lateral"
          >
            <ChevronsRight size={16} />
          </button>
        )}
      </div>

      {/* ── Back button ── */}
      {showLeftSidebar && (
        <div className="px-3 pt-3 flex-shrink-0">
          <button
            onClick={clearApartment}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            Volver a edificios
          </button>
        </div>
      )}

      {/* ── Room List ── */}
      <div className="flex-1 overflow-y-auto py-2 tour-scrollbar">
        {/* Section label (only when expanded) */}
        {showLeftSidebar && (
          <p className="px-4 mb-2 text-[10px] font-semibold text-white/20 uppercase tracking-widest">
            Espacios
          </p>
        )}

        <div className="flex flex-col gap-0.5 px-1.5">
          {scenes.map((scene, index) => {
            const isActive = scene.id === currentSceneId;

            return (
              <button
                key={scene.id}
                onClick={() => setCurrentScene(scene.id)}
                title={!showLeftSidebar ? scene.name : undefined}
                className={`relative flex items-center transition-all duration-150 cursor-pointer
                  ${showLeftSidebar
                    ? `gap-3 px-3 py-2.5 rounded-xl ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`
                    : `justify-center py-2.5 rounded-lg ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}`}
              >
                {/* Active indicator (expanded) */}
                {isActive && showLeftSidebar && (
                  <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-white" />
                )}

                {/* Active dot (collapsed) */}
                {isActive && !showLeftSidebar && (
                  <div className="absolute right-1 top-1 w-1.5 h-1.5 rounded-full bg-white" />
                )}

                {/* Icon */}
                <div className={`flex-shrink-0 flex items-center justify-center rounded-lg transition-colors
                  ${showLeftSidebar
                    ? `w-8 h-8 ${isActive ? 'bg-white/15' : 'bg-white/5'}`
                    : `w-9 h-9 ${isActive ? 'bg-white/15' : 'bg-transparent'}`}`}>
                  <span className={isActive ? 'text-white' : 'text-white/40'}>
                    {getRoomIcon(scene.name)}
                  </span>
                </div>

                {/* Text (only when expanded) */}
                {showLeftSidebar && (
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug truncate ${
                      isActive ? 'font-bold text-white' : 'font-medium text-white/60'
                    }`}>
                      {scene.name}
                    </p>
                    <p className="text-[10px] text-white/20 truncate mt-0.5">
                      {scene.description}
                    </p>
                  </div>
                )}

                {/* Number (only when expanded) */}
                {showLeftSidebar && (
                  <span className={`text-[10px] font-bold tabular-nums ${
                    isActive ? 'text-white/60' : 'text-white/15'
                  }`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Footer ── */}
      {showLeftSidebar && (
        <div className="px-4 py-3 border-t border-white/8 flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-white/20">
              {scenes.length} espacios
            </p>
            <p className="text-[10px] text-white/20">
              {selectedApartment.area}m²
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
