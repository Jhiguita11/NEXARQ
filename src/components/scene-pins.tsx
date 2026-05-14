'use client';

import { useTourStore } from '@/lib/tour-store';
import {
  Home,
  Bed,
  Bath,
  Sofa,
  DoorOpen,
  Sun,
  PawPrint,
  MapPin,
} from 'lucide-react';

function getRoomIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('entrada') || n.includes('hall') || n.includes('acceso')) return <DoorOpen size={14} />;
  if (n.includes('sala') || n.includes('estar')) return <Sofa size={14} />;
  if (n.includes('cocina')) return <Sun size={14} />;
  if (n.includes('dorm') || n.includes('alcoba')) return <Bed size={14} />;
  if (n.includes('baño') || n.includes('bath')) return <Bath size={14} />;
  if (n.includes('terraza') || n.includes('balcón') || n.includes('balcon')) return <Sun size={14} />;
  if (n.includes('mascota') || n.includes('pet') || n.includes('zona')) return <PawPrint size={14} />;
  return <Home size={14} />;
}

export default function ScenePins() {
  const { selectedApartment, currentSceneId, setCurrentScene } = useTourStore();

  if (!selectedApartment) return null;

  const pinsToRender = selectedApartment.scenes.filter(s => s.screenPin);
  if (!pinsToRender.length) return null;

  return (
    <>
      {pinsToRender.map(scene => {
        const isActive = scene.id === currentSceneId;
        const { x, y } = scene.screenPin!;

        return (
          <button
            key={scene.id}
            onClick={() => setCurrentScene(scene.id)}
            className="fixed z-[55] flex flex-col items-center gap-1 group cursor-pointer"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -100%)',
            }}
            title={scene.name}
          >
            {/* Pin label */}
            <div
              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide whitespace-nowrap transition-all duration-200"
              style={{
                background: isActive ? '#D4AF37' : 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(10px)',
                color: isActive ? '#000' : 'rgba(255,255,255,0.85)',
                border: isActive
                  ? '1px solid rgba(212,175,55,0.6)'
                  : '1px solid rgba(212,175,55,0.2)',
                boxShadow: isActive
                  ? '0 4px 16px rgba(212,175,55,0.35)'
                  : '0 2px 8px rgba(0,0,0,0.4)',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <span className="flex items-center gap-1.5">
                {getRoomIcon(scene.name)}
                {scene.name}
              </span>
            </div>

            {/* Connector line */}
            <div
              className="w-px transition-all duration-200"
              style={{
                height: isActive ? 14 : 10,
                background: isActive ? '#D4AF37' : 'rgba(212,175,55,0.4)',
              }}
            />

            {/* Pin dot */}
            <div
              className="rounded-full transition-all duration-200"
              style={{
                width: isActive ? 10 : 8,
                height: isActive ? 10 : 8,
                background: isActive ? '#D4AF37' : 'rgba(212,175,55,0.5)',
                boxShadow: isActive
                  ? '0 0 0 3px rgba(212,175,55,0.25), 0 0 12px rgba(212,175,55,0.4)'
                  : '0 0 0 2px rgba(212,175,55,0.15)',
              }}
            />
          </button>
        );
      })}
    </>
  );
}
