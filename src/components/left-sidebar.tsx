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
  PawPrint,
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
  const isZonaPet = currentSceneId === 'zona-pet-a';

  function getRoomIcon(name: string) {
    const n = name.toLowerCase();
    if (n.includes('entrada') || n.includes('hall') || n.includes('acceso')) return <DoorOpen size={15} />;
    if (n.includes('sala') || n.includes('estar')) return <Sofa size={15} />;
    if (n.includes('cocina')) return <Sun size={15} />;
    if (n.includes('dorm') || n.includes('alcoba')) return <Bed size={15} />;
    if (n.includes('baño') || n.includes('bath')) return <Bath size={15} />;
    if (n.includes('terraza') || n.includes('balcón') || n.includes('balcon')) return <Sun size={15} />;
    if (n.includes('mascota') || n.includes('pet') || n.includes('zona')) return <PawPrint size={15} />;
    return <Home size={15} />;
  }

  return (
    <>
      {/* ── Botón volver — esquina superior izquierda ── */}
      <div className="fixed left-5 top-5 z-[60] group flex items-center">
        <div className="flex items-center px-2 py-2 rounded-full bg-black/40 backdrop-blur-md border border-[rgba(212,175,55,0.1)]">
          <button
            onClick={clearApartment}
            title="Volver al menú"
            className="w-11 h-11 rounded-full flex items-center justify-center
              bg-black/50 border border-[rgba(212,175,55,0.12)] text-[rgba(212,175,55,0.6)] hover:text-[#D4AF37] hover:bg-black/70 hover:border-[rgba(212,175,55,0.25)]
              transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
        </div>
        <span
          className="absolute whitespace-nowrap pointer-events-none
            px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide
            bg-black/75 backdrop-blur-md border border-[rgba(212,175,55,0.2)] text-white/90
            opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0
            transition-all duration-200"
          style={{ left: '3.75rem' }}
        >
          Volver al menú
        </span>
      </div>

      {/* ── Botones de escenas — centro izquierda (oculto en móvil) ── */}
      {!isZonaPet && (
        <div className="hidden md:block fixed left-5 top-1/2 -translate-y-1/2 z-[60]">
          <div className="flex flex-col items-center gap-2 px-2 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-[rgba(212,175,55,0.1)]">
            {scenes.map((scene, i) => {
              const isActive = scene.id === currentSceneId;
              return (
                <div key={scene.id} className="flex flex-col items-center gap-2">
                  {i > 0 && <div className="w-5 h-px bg-[rgba(212,175,55,0.12)]" />}
                  <div className="relative group flex items-center">
                    <button
                      onClick={() => setCurrentScene(scene.id)}
                      title={scene.name}
                      className={`w-11 h-11 rounded-full flex items-center justify-center
                        transition-all duration-200 cursor-pointer
                        ${isActive
                          ? 'bg-[#D4AF37] text-black shadow-lg shadow-[rgba(212,175,55,0.3)]'
                          : 'bg-black/50 border border-[rgba(212,175,55,0.12)] text-[rgba(212,175,55,0.5)] hover:text-[#D4AF37] hover:bg-black/70 hover:border-[rgba(212,175,55,0.25)]'
                        }`}
                    >
                      {getRoomIcon(scene.name)}
                    </button>
                    <span
                      className="absolute whitespace-nowrap pointer-events-none
                        px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide
                        bg-black/75 backdrop-blur-md border border-[rgba(212,175,55,0.2)] text-white/90
                        opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0
                        transition-all duration-200"
                      style={{ left: '3.25rem' }}
                    >
                      {scene.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
