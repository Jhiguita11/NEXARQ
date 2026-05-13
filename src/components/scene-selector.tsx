'use client';

import { useTourStore } from '@/lib/tour-store';
import { X, Eye } from 'lucide-react';

export function SceneSelector() {
  const { tour, currentSceneId, setCurrentScene, showSceneList, toggleSceneList } = useTourStore();

  if (!showSceneList) return null;

  return (
    <div className="fixed top-0 right-0 bottom-0 w-80 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/30 backdrop-blur-sm"
        onClick={toggleSceneList}
      />

      {/* Panel */}
      <div className="bg-black/80 backdrop-blur-xl border-l border-white/10 w-80 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="text-white font-semibold text-sm">Escenas del Recorrido</h2>
          <button
            onClick={toggleSceneList}
            className="text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Brand */}
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-emerald-400 text-sm font-semibold">{tour.brandName}</p>
          <p className="text-white/50 text-xs mt-0.5">{tour.description}</p>
        </div>

        {/* Scene List */}
        <div className="flex-1 overflow-y-auto py-2">
          {tour.scenes.map((scene, index) => (
            <button
              key={scene.id}
              onClick={() => {
                setCurrentScene(scene.id);
                toggleSceneList();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 group ${
                scene.id === currentSceneId
                  ? 'bg-emerald-500/15 border-l-2 border-emerald-400'
                  : 'hover:bg-white/5 border-l-2 border-transparent'
              }`}
            >
              {/* Scene Number */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  scene.id === currentSceneId
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/10 text-white/60 group-hover:bg-white/15'
                }`}
              >
                {index + 1}
              </div>

              {/* Scene Info */}
              <div className="flex-1 text-left">
                <p
                  className={`text-sm font-medium ${
                    scene.id === currentSceneId ? 'text-emerald-400' : 'text-white/90'
                  }`}
                >
                  {scene.name}
                </p>
                <p className="text-white/40 text-xs">{scene.description}</p>
              </div>

              {/* Hotspot count */}
              <div className="flex items-center gap-1 text-white/40 text-xs">
                <Eye size={12} />
                {scene.hotspots.filter(h => h.type === 'scene').length}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/10">
          <p className="text-white/30 text-[10px] text-center">
            {tour.scenes.length} escenas · Haz clic para navegar
          </p>
        </div>
      </div>
    </div>
  );
}
