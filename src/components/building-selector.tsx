'use client';

import { useState } from 'react';
import { useTourStore } from '@/lib/tour-store';
import { Building2, Bed, Bath, Maximize2, ChevronRight, Eye } from 'lucide-react';
import type { BuildingConfig, ApartmentConfig } from '@/lib/tour-types';

export default function BuildingSelector() {
  const { config, setApartment } = useTourStore();
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingConfig | null>(null);

  const buildings = config.buildings;
  if (!buildings.length) return null;

  // If a building is selected, show apartment grid
  if (selectedBuilding) {
    return (
      <div className="fixed inset-0 z-[200] bg-black overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedBuilding(null)}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 border border-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div>
                <h2 className="text-lg font-bold text-white">{selectedBuilding.name}</h2>
                <p className="text-xs text-white/40">{selectedBuilding.apartments.length} apartamentos disponibles</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Building2 size={16} className="text-white/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Building Visual */}
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-4">
          <BuildingVisual building={selectedBuilding} onApartmentClick={(apt) => {
            setApartment(apt);
          }} />
        </div>

        {/* Apartment Cards */}
        <div className="max-w-5xl mx-auto px-6 pb-12">
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
            Todos los apartamentos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedBuilding.apartments.map((apt) => (
              <ApartmentCard key={apt.id} apt={apt} onSelect={() => setApartment(apt)} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Building selection
  return (
    <div className="fixed inset-0 z-[200] bg-black overflow-y-auto">
      {/* Hero */}
      <div className="relative min-h-[50vh] flex flex-col items-center justify-center px-6 text-center">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[120px]" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
            <Building2 size={36} className="text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            {config.brand.name}
          </h1>
          <p className="text-base text-white/40 max-w-md mx-auto mb-10">
            {config.brand.tagline}
          </p>

          <p className="text-xs text-white/25 uppercase tracking-widest mb-8">
            Seleccione un edificio para explorar
          </p>
        </div>
      </div>

      {/* Building Cards */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {buildings.map((building) => (
            <button
              key={building.id}
              onClick={() => setSelectedBuilding(building)}
              className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-left transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 cursor-pointer"
            >
              {/* Building SVG */}
              <div className="mb-5 h-40 flex items-center justify-center">
                <MiniBuildingSvg floors={building.floors} aptPerFloor={building.apartmentsPerFloor} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors">
                    {building.name}
                  </h3>
                  <p className="text-sm text-white/40 mt-1">
                    {building.floors} pisos · {building.apartments.length} apartamentos
                  </p>
                </div>
                <ChevronRight size={20} className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mini Building SVG ──────────────────────────────────────────────
function MiniBuildingSvg({ floors, aptPerFloor }: { floors: number; aptPerFloor: number }) {
  const floorH = 28;
  const floorGap = 4;
  const aptW = 52;
  const aptGap = 6;
  const totalW = aptPerFloor * aptW + (aptPerFloor - 1) * aptGap;
  const totalH = floors * (floorH + floorGap);

  return (
    <svg width={totalW + 20} height={totalH + 20} viewBox={`0 0 ${totalW + 20} ${totalH + 20}`}>
      {/* Ground */}
      <line x1="5" y1={totalH + 15} x2={totalW + 15} y2={totalH + 15} stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      {/* Floors bottom to top */}
      {Array.from({ length: floors }).map((_, fIdx) => {
        const y = totalH - (fIdx + 1) * (floorH + floorGap) + 10;
        return Array.from({ length: aptPerFloor }).map((_, aIdx) => {
          const x = 10 + aIdx * (aptW + aptGap);
          return (
            <rect
              key={`${fIdx}-${aIdx}`}
              x={x}
              y={y}
              width={aptW}
              height={floorH}
              rx={4}
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
          );
        });
      })}
      {/* Roof line */}
      <line x1="10" y1={10 - floorGap + 6} x2={totalW + 10} y2={10 - floorGap + 6} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
    </svg>
  );
}

// ─── Building Visual with clickable floors ─────────────────────────
function BuildingVisual({ building, onApartmentClick }: { building: BuildingConfig; onApartmentClick: (apt: ApartmentConfig) => void }) {
  const floorH = 56;
  const floorGap = 8;
  const aptW = 180;
  const aptGap = 12;
  const totalW = building.apartmentsPerFloor * aptW + (building.apartmentsPerFloor - 1) * aptGap;
  const totalH = building.floors * (floorH + floorGap);

  // Group apartments by floor
  const floorMap = new Map<number, ApartmentConfig[]>();
  for (const apt of building.apartments) {
    const list = floorMap.get(apt.floor) ?? [];
    list.push(apt);
    floorMap.set(apt.floor, list);
  }

  return (
    <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-8 overflow-x-auto">
      <div className="flex justify-center">
        <svg
          width={totalW + 40}
          height={totalH + 60}
          viewBox={`0 0 ${totalW + 40} ${totalH + 60}`}
          className="select-none"
        >
          {/* Ground */}
          <line
            x1="15"
            y1={totalH + 35}
            x2={totalW + 25}
            y2={totalH + 35}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
          />

          {/* Floors */}
          {Array.from({ length: building.floors }).map((_, fIdx) => {
            const y = totalH - (fIdx + 1) * (floorH + floorGap) + 20;
            const floorApts = floorMap.get(fIdx) ?? [];

            return (
              <g key={fIdx}>
                {/* Floor label */}
                <text
                  x={totalW + 32}
                  y={y + floorH / 2 + 4}
                  fill="rgba(255,255,255,0.2)"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="end"
                >
                  P{fIdx + 1}
                </text>

                {/* Apartments on this floor */}
                {Array.from({ length: building.apartmentsPerFloor }).map((_, aIdx) => {
                  const x = 20 + aIdx * (aptW + aptGap);
                  const apt = floorApts.find(a => a.position === aIdx);
                  const isPenthouse = fIdx === building.floors - 1 && aIdx === 0;

                  return (
                    <g
                      key={`${fIdx}-${aIdx}`}
                      className="cursor-pointer"
                      onClick={() => apt && onApartmentClick(apt)}
                    >
                      {/* Apt rect */}
                      <rect
                        x={x}
                        y={y}
                        width={aptW}
                        height={floorH}
                        rx={6}
                        fill={apt ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)"}
                        stroke={apt ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}
                        strokeWidth="1.5"
                        className="transition-all duration-200"
                      />
                      {/* Hover hint */}
                      <rect
                        x={x}
                        y={y}
                        width={aptW}
                        height={floorH}
                        rx={6}
                        fill="rgba(255,255,255,0.06)"
                        className="opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                      />
                      {/* Windows (decorative) */}
                      {[0.25, 0.5, 0.75].map((pct, wIdx) => (
                        <rect
                          key={wIdx}
                          x={x + aptW * pct - 4}
                          y={y + 8}
                          width={8}
                          height={floorH - 16}
                          rx={2}
                          fill={apt ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)"}
                        />
                      ))}
                      {/* Apt label */}
                      {apt && (
                        <text
                          x={x + aptW / 2}
                          y={y + floorH / 2 - 4}
                          fill="rgba(255,255,255,0.7)"
                          fontSize="13"
                          fontWeight="700"
                          textAnchor="middle"
                          className="pointer-events-none select-none"
                        >
                          {apt.name}
                        </text>
                      )}
                      {/* Area */}
                      {apt && (
                        <text
                          x={x + aptW / 2}
                          y={y + floorH / 2 + 12}
                          fill="rgba(255,255,255,0.3)"
                          fontSize="10"
                          textAnchor="middle"
                          className="pointer-events-none select-none"
                        >
                          {apt.area}m²
                        </text>
                      )}
                      {/* PH badge */}
                      {isPenthouse && apt && (
                        <text
                          x={x + aptW / 2}
                          y={y + 12}
                          fill="rgba(255,255,255,0.5)"
                          fontSize="8"
                          fontWeight="700"
                          textAnchor="middle"
                          className="pointer-events-none select-none"
                        >
                          PENTHOUSE
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Roof */}
          <line
            x1="20"
            y1={20 - floorGap + 10}
            x2={totalW + 20}
            y2={20 - floorGap + 10}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}

// ─── Apartment Card ─────────────────────────────────────────────────
function ApartmentCard({ apt, onSelect }: { apt: ApartmentConfig; onSelect: () => void }) {
  const isPH = apt.name.toLowerCase().includes('ph');

  return (
    <button
      onClick={onSelect}
      className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-left transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 cursor-pointer w-full"
    >
      {isPH && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-bold text-white/60 uppercase tracking-wider">
          Penthouse
        </div>
      )}

      <h4 className="text-base font-bold text-white mb-1">{apt.name}</h4>
      <p className="text-xs text-white/35 mb-4">{apt.description}</p>

      <div className="flex items-center gap-4 text-xs text-white/50">
        <span className="flex items-center gap-1.5">
          <Bed size={13} /> {apt.bedrooms}
        </span>
        <span className="flex items-center gap-1.5">
          <Bath size={13} /> {apt.bathrooms}
        </span>
        <span className="flex items-center gap-1.5">
          <Maximize2 size={13} /> {apt.area}m²
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white group-hover:translate-x-1 transition-transform">
        <Eye size={14} />
        Iniciar Recorrido
      </div>
    </button>
  );
}
