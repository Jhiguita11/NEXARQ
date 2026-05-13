'use client';

import { useState } from 'react';
import { useTourStore } from '@/lib/tour-store';
import { Building2, Bed, Bath, Maximize2, Eye, ArrowRight } from 'lucide-react';
import type { BuildingConfig, ApartmentConfig } from '@/lib/tour-types';

const GOLD = '#D4AF37';

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
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* ── Top header bar ── */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl backdrop-blur-xl border flex items-center justify-center"
            style={{ background: `${GOLD}15`, borderColor: `${GOLD}30` }}
          >
            <Building2 size={20} style={{ color: GOLD }} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight" style={{ color: GOLD }}>
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
                    ? 'text-black'
                    : 'text-white/60 backdrop-blur-sm border border-white/10 hover:bg-white/10'
                }`}
                style={{
                  background: currentBuilding.id === b.id ? GOLD : 'rgba(255,255,255,0.06)',
                  borderColor: currentBuilding.id === b.id ? GOLD : 'rgba(255,255,255,0.1)',
                }}
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
        <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-16 pb-6 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section title */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: `${GOLD}99` }}>
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
  const GOLD = '#D4AF37';
  const floors = building.floors;
  const aptPerFloor = building.apartmentsPerFloor;

  const baseX = aptPerFloor === 1 ? 50 : apt.position === 0 ? 38 : 62;
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
        className="absolute -inset-3 rounded-full border-2"
        style={{
          borderColor: `${GOLD}80`,
          animation: 'building-pulse 2.5s ease-out infinite',
        }}
      />

      {/* Main circle */}
      <div
        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'scale-125' : ''
        }`}
        style={{
          background: isHovered ? GOLD : `${GOLD}BB`,
          boxShadow: isHovered
            ? `0 0 30px ${GOLD}80`
            : `0 0 15px ${GOLD}40`,
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
        <div className="bg-black/80 backdrop-blur-xl border rounded-lg px-3 py-1.5" style={{ borderColor: `${GOLD}25` }}>
          <p className="text-xs font-bold text-white">{apt.name}</p>
          {isPH && <p className="text-[9px] font-semibold" style={{ color: `${GOLD}99` }}>PENTHOUSE</p>}
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
  const GOLD = '#D4AF37';
  const isPH = apt.name.toLowerCase().includes('ph');

  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`relative flex-shrink-0 w-56 backdrop-blur-xl border rounded-2xl p-4 text-left transition-all duration-300 cursor-pointer ${
        isHovered
          ? '-translate-y-1'
          : 'hover:-translate-y-0.5'
      }`}
      style={{
        background: isHovered ? `${GOLD}12` : 'rgba(255,255,255,0.04)',
        borderColor: isHovered ? `${GOLD}50` : 'rgba(255,255,255,0.08)',
      }}
    >
      {isPH && (
        <div
          className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
          style={{ background: `${GOLD}20`, color: `${GOLD}CC` }}
        >
          PH
        </div>
      )}

      <h4 className="text-sm font-bold text-white mb-0.5">{apt.name}</h4>
      <p className="text-[11px] text-white/35 mb-3">{apt.description}</p>

      <div className="flex items-center gap-3 text-[11px]" style={{ color: `${GOLD}88` }}>
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

      <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: GOLD }}>
        <Eye size={13} />
        Recorrido 360°
        <ArrowRight size={13} className="ml-auto" />
      </div>
    </button>
  );
}
