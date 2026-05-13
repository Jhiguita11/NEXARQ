'use client';

import { useState } from 'react';
import { useTourStore } from '@/lib/tour-store';
import { Building2, Bed, Bath, Maximize2, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import type { BuildingConfig, ApartmentConfig } from '@/lib/tour-types';

export default function BuildingSelector() {
  const { config, setApartment } = useTourStore();
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingConfig | null>(config.buildings[0] ?? null);
  const [hoveredApt, setHoveredApt] = useState<string | null>(null);

  const buildings = config.buildings;
  if (!buildings.length) return null;

  const currentBuilding = selectedBuilding ?? buildings[0];

  return (
    <div className="fixed inset-0 z-[200] bg-black overflow-hidden">
      {/* ── Background building image ── */}
      <div className="absolute inset-0">
        <img
          src="/building.png"
          alt="Edificio"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ── Top header bar ── */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/15 flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              {config.brand.name}
            </h1>
            <p className="text-[11px] text-white/50 font-medium">
              {config.brand.tagline}
            </p>
          </div>
        </div>

        {/* Building selector tabs */}
        {buildings.length > 1 && (
          <div className="flex items-center gap-2">
            {buildings.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBuilding(b)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  currentBuilding.id === b.id
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white/70 backdrop-blur-sm border border-white/10 hover:bg-white/20'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Hotspots overlay on building image ── */}
      <div className="absolute inset-0 z-5">
        {currentBuilding.apartments.map((apt) => (
          <BuildingHotspot
            key={apt.id}
            apt={apt}
            building={currentBuilding}
            isHovered={hoveredApt === apt.id}
            onHover={() => setHoveredApt(apt.id)}
            onLeave={() => setHoveredApt(null)}
            onClick={() => setApartment(apt)}
          />
        ))}
      </div>

      {/* ── Bottom panel: apartment list ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="bg-gradient-to-t from-black/80 via-black/60 to-transparent pt-16 pb-6 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section title */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                Apartamentos Disponibles
              </p>
              <p className="text-xs text-white/30">
                {currentBuilding.apartments.length} unidades
              </p>
            </div>

            {/* Apartment cards scroll */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'thin' }}>
              {currentBuilding.apartments.map((apt) => (
                <ApartmentCard
                  key={apt.id}
                  apt={apt}
                  isHovered={hoveredApt === apt.id}
                  onHover={() => setHoveredApt(apt.id)}
                  onLeave={() => setHoveredApt(null)}
                  onSelect={() => setApartment(apt)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Building Hotspot (floating on the building image)
// ═══════════════════════════════════════════════════════════════════
function BuildingHotspot({
  apt,
  building,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: {
  apt: ApartmentConfig;
  building: BuildingConfig;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  // Position hotspots based on floor and position
  // Floor 0 = bottom, higher floors go up
  const floors = building.floors;
  const aptPerFloor = building.apartmentsPerFloor;

  // Horizontal: spread across center (50-90% of width)
  const baseX = aptPerFloor === 1 ? 50 : apt.position === 0 ? 38 : 62;
  // Vertical: bottom floor at 65%, top floor at 30%
  const baseY = 65 - (apt.floor / (floors - 1 || 1)) * 35;

  const isPH = apt.name.toLowerCase().includes('ph');

  return (
    <button
      className="absolute cursor-pointer group"
      style={{
        left: `${baseX}%`,
        top: `${baseY}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Pulse ring */}
      <div
        className="absolute -inset-3 rounded-full border-2 border-white/50"
        style={{
          animation: 'building-pulse 2.5s ease-out infinite',
        }}
      />

      {/* Main circle */}
      <div
        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'scale-125' : ''
        }`}
        style={{
          background: isHovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)',
          boxShadow: isHovered
            ? '0 0 30px rgba(255,255,255,0.5)'
            : '0 0 15px rgba(255,255,255,0.25)',
        }}
      >
        <Eye size={18} className="text-black" />
      </div>

      {/* Label tooltip */}
      <div
        className="absolute left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap transition-all duration-200 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0.7,
          transform: isHovered ? 'translate(-50%, 0)' : 'translate(-50%, 4px)',
        }}
      >
        <div className="bg-black/80 backdrop-blur-xl border border-white/15 rounded-lg px-3 py-1.5">
          <p className="text-xs font-bold text-white">{apt.name}</p>
          {isPH && <p className="text-[9px] text-white/50 font-semibold">PENTHOUSE</p>}
        </div>
      </div>

      {/* Animation style */}
      <style>{`
        @keyframes building-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Apartment Card
// ═══════════════════════════════════════════════════════════════════
function ApartmentCard({
  apt,
  isHovered,
  onHover,
  onLeave,
  onSelect,
}: {
  apt: ApartmentConfig;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
}) {
  const isPH = apt.name.toLowerCase().includes('ph');

  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`relative flex-shrink-0 w-56 bg-white/[0.06] backdrop-blur-xl border rounded-2xl p-4 text-left transition-all duration-300 cursor-pointer ${
        isHovered
          ? 'bg-white/[0.12] border-white/30 -translate-y-1'
          : 'border-white/10 hover:bg-white/[0.08] hover:border-white/15'
      }`}
    >
      {isPH && (
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/15 text-[9px] font-bold text-white/60 uppercase tracking-wider">
          PH
        </div>
      )}

      <h4 className="text-sm font-bold text-white mb-0.5">{apt.name}</h4>
      <p className="text-[11px] text-white/35 mb-3">{apt.description}</p>

      <div className="flex items-center gap-3 text-[11px] text-white/50">
        <span className="flex items-center gap-1">
          <Bed size={12} /> {apt.bedrooms}
        </span>
        <span className="flex items-center gap-1">
          <Bath size={12} /> {apt.bathrooms}
        </span>
        <span className="flex items-center gap-1">
          <Maximize2 size={12} /> {apt.area}m²
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-white group-hover:gap-2.5 transition-all">
        <Eye size={13} />
        Recorrido 360°
        <ArrowRight size={13} className="ml-auto" />
      </div>
    </button>
  );
}
