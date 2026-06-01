'use client';

import { useState } from 'react';
import { useTourStore } from '@/lib/tour-store';
import { Bed, Bath, Maximize2, Eye, ArrowRight } from 'lucide-react';
import type { BuildingConfig, ApartmentConfig } from '@/lib/tour-types';
import { assetPath } from '@/lib/asset-path';
import BrandLogo from '@/components/brand-logo';

const BEIGE = '#E8D9B0';

export default function BuildingSelector() {
  const { config, setApartment } = useTourStore();
  const [hoveredApt, setHoveredApt] = useState<string | null>(null);

  const buildings = config.buildings;
  if (!buildings.length) return null;

  const currentBuilding = buildings[0];

  return (
    <div
      className="fixed inset-0 z-[200] bg-black overflow-hidden"
      style={{ animation: 'selectorFadeIn 0.9s cubic-bezier(0.4,0,0.2,1) both' }}
    >
      {/* ── Background image ── */}
      <div className="absolute inset-0">
        <img
          src={assetPath('/building.png')}
          alt="Edificio"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* ── Top header ── */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 md:px-8 py-4 md:py-5">
        <BrandLogo className="h-[58px] md:h-[72px]" />

        {/* Branding Constructora Meléndez */}
        <div className="flex flex-col items-end gap-1.5">
          <span
            className="uppercase"
            style={{
              fontSize: 9,
              letterSpacing: '0.28em',
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 600,
            }}
          >
            Un proyecto de
          </span>
          <img
            src={assetPath('/projects/melendez/branding/LogoMelendezHorizontal.png')}
            alt="Constructora Meléndez"
            className="h-[26px] md:h-[34px]"
            style={{ width: 'auto', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.45))' }}
            draggable={false}
          />
        </div>
      </div>

      {/* ── Hotspots con card en hover ── */}
      <div className="absolute inset-0 z-[5]">
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

      <style>{`
        @keyframes selectorFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Building Hotspot — esfera + card en hover
// ═══════════════════════════════════════════════════════════════════
function BuildingHotspot({
  apt, building, isHovered, onHover, onLeave, onClick,
}: {
  apt: ApartmentConfig;
  building: BuildingConfig;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const floors = building.floors;
  const aptPerFloor = building.apartmentsPerFloor;
  const baseX = apt.hotspotX ?? (aptPerFloor === 1 ? 50 : apt.position === 0 ? 38 : 62);
  const baseY = apt.hotspotY ?? (65 - (apt.floor / (floors - 1 || 1)) * 35);

  // Decide si la card abre hacia la izquierda o derecha según posición horizontal
  const cardAlignRight = baseX > 55;

  return (
    <div
      className="absolute"
      style={{ left: `${baseX}%`, top: `${baseY}%`, transform: 'translate(-50%, -50%)' }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* ── Card flotante — aparece arriba del hotspot ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: 'calc(100% + 18px)',
          left: cardAlignRight ? 'auto' : '50%',
          right: cardAlignRight ? '50%' : 'auto',
          opacity: isHovered ? 1 : 0,
          transform: `translateX(${cardAlignRight ? '50%' : '-50%'}) translateY(${isHovered ? '0px' : '8px'})`,
          transition: 'opacity 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          width: 220,
          zIndex: 20,
          pointerEvents: isHovered ? 'all' : 'none',
        }}
      >
        <div
          className="rounded-2xl border p-4 backdrop-blur-xl"
          style={{
            background: 'rgba(10,14,12,0.88)',
            borderColor: `${BEIGE}30`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${BEIGE}10`,
          }}
        >
          {/* Nombre */}
          <h4 className="text-sm font-bold text-white mb-1">{apt.name}</h4>
          <p className="text-[11px] leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {apt.description}
          </p>

          {/* Specs */}
          <div className="flex items-center gap-3 mb-4 text-[11px]" style={{ color: `${BEIGE}80` }}>
            <span className="flex items-center gap-1"><Bed size={12} /> {apt.bedrooms}</span>
            <span className="flex items-center gap-1"><Bath size={12} /> {apt.bathrooms}</span>
            <span className="flex items-center gap-1"><Maximize2 size={12} /> {apt.area}m²</span>
          </div>

          {/* CTA */}
          <button
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 cursor-pointer hover:brightness-110"
            style={{ background: `${BEIGE}18`, color: BEIGE, border: `1px solid ${BEIGE}30` }}
            onClick={onClick}
          >
            <Eye size={13} />
            Iniciar Recorrido
            <ArrowRight size={13} className="ml-auto" />
          </button>
        </div>

        {/* Conector triangular hacia el hotspot */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: -8,
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: `8px solid rgba(10,14,12,0.88)`,
          }}
        />
      </div>

      {/* ── Esfera principal ── */}
      <button
        className="relative cursor-pointer z-10"
        onClick={onClick}
        tabIndex={-1}
      >
        {/* Pulse ring */}
        <div
          className="absolute -inset-3 rounded-full border-2"
          style={{
            borderColor: `${BEIGE}60`,
            animation: 'building-pulse 2.5s ease-out infinite',
          }}
        />

        {/* Círculo */}
        <div
          className="relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: isHovered ? BEIGE : `${BEIGE}C0`,
            transform: isHovered ? 'scale(1.2)' : 'scale(1)',
            boxShadow: isHovered
              ? `0 0 32px ${BEIGE}80, 0 0 0 3px ${BEIGE}30`
              : `0 0 14px ${BEIGE}40`,
          }}
        >
          <Eye size={18} className="text-black" />
        </div>

        {/* Nombre debajo siempre visible */}
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 96,
            textAlign: 'center',
            opacity: isHovered ? 0 : 0.85,
            transition: 'opacity 0.2s ease',
          }}
        >
          <span
            className="text-[11px] font-semibold px-2 py-1 rounded-xl leading-snug"
            style={{
              display: 'block',
              background: 'rgba(0,0,0,0.65)',
              color: BEIGE,
              backdropFilter: 'blur(8px)',
              border: `1px solid ${BEIGE}18`,
            }}
          >
            {apt.name}
          </span>
        </div>
      </button>

      <style>{`
        @keyframes building-pulse {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(2);   opacity: 0; }
        }
      `}</style>
    </div>
  );
}
