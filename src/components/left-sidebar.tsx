'use client';

import { useTourStore } from '@/lib/tour-store';
import {
  Home,
  Bed,
  Bath,
  Sofa,
  DoorOpen,
  Sun,
  ArrowLeft,
} from 'lucide-react';

export default function LeftSidebar() {
  const {
    selectedApartment,
    currentSceneId,
    setCurrentScene,
    clearApartment,
  } = useTourStore();

  if (!selectedApartment) return null;

  const scenes = selectedApartment.scenes;

  function getRoomIcon(name: string) {
    const n = name.toLowerCase();
    if (n.includes('entrada') || n.includes('hall')) return <DoorOpen size={15} />;
    if (n.includes('sala') || n.includes('estar')) return <Sofa size={15} />;
    if (n.includes('cocina')) return <Sun size={15} />;
    if (n.includes('dorm')) return <Bed size={15} />;
    if (n.includes('baño') || n.includes('bath')) return <Bath size={15} />;
    if (n.includes('terraza') || n.includes('balcón')) return <Sun size={15} />;
    return <Home size={15} />;
  }

  return (
    <div className="fixed left-3 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center gap-1">
      {/* Back button */}
      <button
        onClick={clearApartment}
        title="Volver a edificios"
        className="w-9 h-9 rounded-full flex items-center justify-center
          bg-black/50 backdrop-blur-md border border-[rgba(212,175,55,0.15)]
          text-[rgba(212,175,55,0.6)] hover:text-[#D4AF37] hover:bg-black/70 hover:border-[rgba(212,175,55,0.3)]
          transition-all duration-200 cursor-pointer"
      >
        <ArrowLeft size={13} />
      </button>

      <div className="w-5 h-px bg-[rgba(212,175,55,0.15)]" />

      {/* Room icons */}
      {scenes.map((scene) => {
        const isActive = scene.id === currentSceneId;
        return (
          <button
            key={scene.id}
            onClick={() => setCurrentScene(scene.id)}
            title={scene.name}
            className={`w-9 h-9 rounded-full flex items-center justify-center
              transition-all duration-200 cursor-pointer
              ${isActive
                ? 'bg-[#D4AF37] text-black scale-110 shadow-lg shadow-[rgba(212,175,55,0.3)]'
                : 'bg-black/50 backdrop-blur-md border border-[rgba(212,175,55,0.12)] text-[rgba(212,175,55,0.5)] hover:text-[#D4AF37] hover:bg-black/70 hover:border-[rgba(212,175,55,0.25)] hover:scale-105'
              }`}
          >
            {getRoomIcon(scene.name)}
          </button>
        );
      })}
    </div>
  );
}
