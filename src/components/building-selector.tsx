'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTourStore } from '@/lib/tour-store';
import { Bed, Bath, Maximize2, Eye, ArrowRight, Clock, Sparkles } from 'lucide-react';
import type { BuildingConfig, ApartmentConfig } from '@/lib/tour-types';
import { assetPath } from '@/lib/asset-path';
import BrandLogo from '@/components/brand-logo';

/**
 * Un apartamento se considera "disponible" si:
 * 1. Su campo `available` es explicitamente true (o no esta definido), Y
 * 2. Tiene al menos una escena cuya ruta de panorama no sea un placeholder.
 *
 * Si `available === false` en el config, siempre se oculta sin importar las escenas.
 * Los apartamentos con panoramas pendientes se muestran como "Proxim." en el selector.
 */
function isApartmentAvailable(apt: ApartmentConfig): boolean {
  // Campo explicit: false siempre oculta
  if (apt.available === false) return false;
  // Campo explicit: true siempre muestra (el dev confirma que tiene panoramas)
  if (apt.available === true) return true;
  // Auto-detect: tiene al menos una escena con ruta de panorama no-placeholder
  return apt.scenes.length > 0 && apt.scenes.some((s) => {
    const pano = s.panorama ?? '';
    return pano.length > 0 && !pano.includes('_placeholder_') && !pano.includes('placeholder.jpg');
  });
}

const BEIGE = '#E8D9B0';

export default function BuildingSelector() {
  const { config, setApartment, setApartmentAtScene } = useTourStore();
  const [hoveredApt, setHoveredApt] = useState<string | null>(null);

  // Amenities (recorrido 360 de zonas comunes). Al hacer click abrimos su
  // recorrido empezando por la escena de Piscina.
  const amenities = config.amenities;
  const amenitiesStart =
    amenities?.scenes.find((s) => s.id === 'va-am-piscina')?.id ?? amenities?.scenes[0]?.id;

  /* ── Modo debug (?debug=1): arrastrar el ojo para recolocarlo ──
     Se resuelve DESPUÉS de montar para no romper la hidratación (el server
     no conoce window.location → debe coincidir con el primer render cliente). */
  const [debugEnabled, setDebugEnabled] = useState(false);
  useEffect(() => {
    setDebugEnabled(window.location.search.includes('debug=1'));
  }, []);
  const [overrides, setOverrides] = useState<Record<string, { x: number; y: number }>>({});
  const [dragId, setDragId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!dragId) return;
    const onMove = (e: MouseEvent) => {
      const x = Math.max(0, Math.min(100, Math.round((e.clientX / window.innerWidth) * 1000) / 10));
      const y = Math.max(0, Math.min(100, Math.round((e.clientY / window.innerHeight) * 1000) / 10));
      setOverrides((prev) => ({ ...prev, [dragId]: { x, y } }));
    };
    const onUp = () => setDragId(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragId]);

  const copyHotspot = useCallback((aptId: string, x: number, y: number) => {
    try {
      navigator.clipboard.writeText(`hotspotX: ${x}, hotspotY: ${y},`);
      setCopied(aptId);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      /* ignore */
    }
  }, []);

  // Reset: descarta el override y vuelve a la posición original del config.
  const resetHotspot = useCallback((aptId: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[aptId];
      return next;
    });
  }, []);

  const buildings = config.buildings;
  if (!buildings.length) return null;

  const currentBuilding = buildings[0];

  return (
    <div
      className="fixed inset-0 z-[200] bg-black overflow-hidden"
      style={{ animation: 'selectorFadeIn 0.9s cubic-bezier(0.4,0,0.2,1) both' }}
    >
      {/* ── Background image ── (movil: versión ligera de 1600px) */}
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 767px)" srcSet={assetPath('/building-mobile.jpg')} />
          <img
            src={assetPath('/building.jpg')}
            alt="Edificio"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* ── Top header ── (pointer-events-none: no debe tapar los ojos) */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 md:px-8 py-4 md:py-5 pointer-events-none">
        <BrandLogo className="h-[76px] md:h-[96px]" />
      </div>

      {/* ── Branding Constructora Meléndez (esquina inferior derecha) ── */}
      <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
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
          className="h-[46px] md:h-[60px]"
          style={{ width: 'auto', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.45))' }}
          draggable={false}
        />
      </div>

      {/* ── Hotspots con card en hover ── */}
      <div className="absolute inset-0 z-[5]">
        {currentBuilding.apartments.map((apt) => {
          const available = isApartmentAvailable(apt);
          return (
            <BuildingHotspot
              key={apt.id}
              apt={apt}
              building={currentBuilding}
              available={available}
              isHovered={hoveredApt === apt.id}
              onHover={() => setHoveredApt(apt.id)}
              onLeave={() => setHoveredApt(null)}
              onClick={() => available && setApartment(apt)}
              debugEnabled={debugEnabled}
              override={overrides[apt.id]}
              isDragging={dragId === apt.id}
              onDragStart={() => setDragId(apt.id)}
              onCopy={(x, y) => copyHotspot(apt.id, x, y)}
              onReset={() => resetHotspot(apt.id)}
              copied={copied === apt.id}
            />
          );
        })}

        {/* ── Hotspot de Amenities (zonas comunes 360) ── */}
        {amenities && (
          <BuildingHotspot
            key={amenities.id}
            apt={amenities}
            building={currentBuilding}
            available={isApartmentAvailable(amenities)}
            isHovered={hoveredApt === amenities.id}
            onHover={() => setHoveredApt(amenities.id)}
            onLeave={() => setHoveredApt(null)}
            onClick={() => amenitiesStart && setApartmentAtScene(amenities, amenitiesStart)}
            isAmenity
            debugEnabled={debugEnabled}
            override={overrides[amenities.id]}
            isDragging={dragId === amenities.id}
            onDragStart={() => setDragId(amenities.id)}
            onCopy={(x, y) => copyHotspot(amenities.id, x, y)}
            onReset={() => resetHotspot(amenities.id)}
            copied={copied === amenities.id}
          />
        )}
      </div>

      {/* ── Hint de debug (solo ?debug=1) ── */}
      {debugEnabled && (
        <div
          className="absolute z-[30] left-4 bottom-4 select-none"
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            fontSize: 11,
            color: '#5DD5F0',
            background: 'rgba(0,0,0,0.8)',
            border: '1px solid rgba(93,213,240,0.5)',
            borderRadius: 8,
            padding: '7px 11px',
            lineHeight: 1.5,
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
          }}
        >
          <b>DEBUG</b> · arrastra el <b>ojo</b> para recolocarlo · luego pulsa{' '}
          <b>copiar</b> y pega <code>hotspotX/hotspotY</code> en tour.config.ts
        </div>
      )}

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
  apt, building, available, isHovered, onHover, onLeave, onClick,
  debugEnabled = false, override, isDragging = false, onDragStart, onCopy, onReset, copied = false,
  isAmenity = false,
}: {
  apt: ApartmentConfig;
  building: BuildingConfig;
  available: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  debugEnabled?: boolean;
  override?: { x: number; y: number };
  isDragging?: boolean;
  onDragStart?: () => void;
  onCopy?: (x: number, y: number) => void;
  onReset?: () => void;
  copied?: boolean;
  isAmenity?: boolean;
}) {
  const floors = building.floors;
  const aptPerFloor = building.apartmentsPerFloor;
  const baseX = override?.x ?? apt.hotspotX ?? (aptPerFloor === 1 ? 50 : apt.position === 0 ? 38 : 62);
  const baseY = override?.y ?? apt.hotspotY ?? (65 - (apt.floor / (floors - 1 || 1)) * 35);

  // Decide si la card abre hacia la izquierda o derecha según posición horizontal
  const cardAlignRight = baseX > 55;

  /* ── Dirección de despliegue de la card (config: apt.cardDir) ──
     'up' (def) · 'down' · 'left' · 'right'. Calcula posición, animación de
     entrada y el triángulo conector hacia el hotspot. */
  const cardBg = 'rgba(10,14,12,0.88)';
  const GAP = 18;
  const dir = apt.cardDir ?? 'up';
  let cardPos: React.CSSProperties;
  let shownTransform: string;
  let hiddenTransform: string;
  let connector: React.CSSProperties;
  switch (dir) {
    case 'down':
      cardPos = { top: `calc(100% + ${GAP}px)`, left: '50%' };
      shownTransform = 'translateX(-50%) translateY(0px)';
      hiddenTransform = 'translateX(-50%) translateY(-8px)';
      connector = { top: -8, left: '50%', transform: 'translateX(-50%)', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: `8px solid ${cardBg}` };
      break;
    case 'left':
      cardPos = { right: `calc(100% + ${GAP}px)`, top: '50%' };
      shownTransform = 'translateY(-50%) translateX(0px)';
      hiddenTransform = 'translateY(-50%) translateX(8px)';
      connector = { right: -8, top: '50%', transform: 'translateY(-50%)', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: `8px solid ${cardBg}` };
      break;
    case 'right':
      cardPos = { left: `calc(100% + ${GAP}px)`, top: '50%' };
      shownTransform = 'translateY(-50%) translateX(0px)';
      hiddenTransform = 'translateY(-50%) translateX(-8px)';
      connector = { left: -8, top: '50%', transform: 'translateY(-50%)', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: `8px solid ${cardBg}` };
      break;
    case 'up':
    default:
      cardPos = { bottom: `calc(100% + ${GAP}px)`, left: cardAlignRight ? 'auto' : '50%', right: cardAlignRight ? '50%' : 'auto' };
      shownTransform = `translateX(${cardAlignRight ? '50%' : '-50%'}) translateY(0px)`;
      hiddenTransform = `translateX(${cardAlignRight ? '50%' : '-50%'}) translateY(8px)`;
      connector = { bottom: -8, left: '50%', transform: 'translateX(-50%)', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: `8px solid ${cardBg}` };
      break;
  }

  return (
    <div
      className="absolute"
      style={{ left: `${baseX}%`, top: `${baseY}%`, transform: 'translate(-50%, -50%)' }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* ── Card flotante — se despliega según apt.cardDir ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          ...cardPos,
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? shownTransform : hiddenTransform,
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
          {isAmenity ? (
            <div className="flex items-center gap-3 mb-4 text-[11px]" style={{ color: `${BEIGE}80` }}>
              <span className="flex items-center gap-1"><Sparkles size={12} /> {apt.scenes.length} espacios 360°</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-4 text-[11px]" style={{ color: `${BEIGE}80` }}>
              <span className="flex items-center gap-1"><Bed size={12} /> {apt.bedrooms}</span>
              <span className="flex items-center gap-1"><Bath size={12} /> {apt.bathrooms}</span>
              <span className="flex items-center gap-1"><Maximize2 size={12} /> {apt.area}m²</span>
            </div>
          )}

          {/* CTA */}
          {available ? (
            <button
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200 cursor-pointer hover:brightness-110"
              style={{ background: `${BEIGE}18`, color: BEIGE, border: `1px solid ${BEIGE}30` }}
              onClick={onClick}
            >
              Iniciar Recorrido
              <ArrowRight size={13} />
            </button>
          ) : (
            <div
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-semibold select-none"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.10)' }}
            >
              <Clock size={13} />
              Próximamente
            </div>
          )}
        </div>

        {/* Conector triangular hacia el hotspot */}
        <div
          className="absolute"
          style={{
            width: 0,
            height: 0,
            ...connector,
          }}
        />
      </div>

      {/* ── Esfera principal ── */}
      <button
        className="relative z-10"
        style={{
          cursor: debugEnabled ? (isDragging ? 'grabbing' : 'grab') : available ? 'pointer' : 'default',
        }}
        onMouseDown={(e) => {
          if (debugEnabled) {
            e.preventDefault();
            onDragStart?.();
          }
        }}
        onClick={() => {
          // En debug NO navegamos: el clic/arrastre solo recoloca el ojo.
          if (!debugEnabled) onClick();
        }}
        tabIndex={-1}
        aria-disabled={!available}
      >
        {/* Pulse ring — solo si disponible */}
        {available && (
          <div
            className="absolute -inset-3 rounded-full border-2"
            style={{
              borderColor: `${BEIGE}60`,
              animation: 'building-pulse 2.5s ease-out infinite',
            }}
          />
        )}

        {/* Círculo */}
        <div
          className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: available
              ? (isHovered
                  ? 'radial-gradient(circle, rgba(48,41,34,0.92) 0%, rgba(30,26,22,0.65) 70%, rgba(30,26,22,0.25) 100%)'
                  : 'radial-gradient(circle, rgba(34,29,24,0.80) 0%, rgba(25,21,18,0.50) 70%, rgba(25,21,18,0.15) 100%)')
              : 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(7px)',
            WebkitBackdropFilter: 'blur(7px)',
            transform: available && isHovered ? 'scale(1.2)' : 'scale(1)',
            border: available ? '3px solid #FFFFFF' : '3px solid rgba(255,255,255,0.35)',
            boxShadow: available && isHovered
              ? `0 0 32px ${BEIGE}80, 0 0 0 3px ${BEIGE}30`
              : available
                ? `0 0 14px ${BEIGE}40`
                : 'none',
          }}
        >
          {available
            ? <Eye size={26} style={{ color: BEIGE }} />
            : <Clock size={22} style={{ color: 'rgba(255,255,255,0.5)' }} />
          }
        </div>

        {/* Nombre debajo siempre visible */}
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 150,
            textAlign: 'center',
            opacity: isHovered ? 0 : 0.85,
            transition: 'opacity 0.2s ease',
          }}
        >
          <span
            className="text-[12.5px] font-semibold px-3 py-1.5 rounded-xl leading-snug"
            style={{
              display: 'block',
              background: 'rgba(0,0,0,0.65)',
              color: available ? BEIGE : 'rgba(255,255,255,0.45)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${available ? `${BEIGE}18` : 'rgba(255,255,255,0.10)'}`,
            }}
          >
            {apt.name}
          </span>
        </div>
      </button>

      {/* ── Lectura de coords + copiar (solo ?debug=1) ── */}
      {debugEnabled && (
        <div
          className="absolute z-[30]"
          style={{
            left: 'calc(100% + 12px)',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            fontSize: 11,
            color: '#5DD5F0',
            background: 'rgba(0,0,0,0.85)',
            border: '1px solid rgba(93,213,240,0.5)',
            borderRadius: 6,
            padding: '4px 8px',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
          }}
        >
          <span>
            x:<b style={{ color: '#FFF' }}>{baseX}</b> y:<b style={{ color: '#FFF' }}>{baseY}</b>
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onCopy?.(baseX, baseY); }}
            style={{
              padding: '2px 8px',
              fontSize: 10,
              fontWeight: 700,
              background: 'rgba(93,213,240,0.18)',
              border: '1px solid rgba(93,213,240,0.5)',
              borderRadius: 4,
              color: '#5DD5F0',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {copied ? '✓' : 'copiar'}
          </button>
          {override && (
            <button
              onClick={(e) => { e.stopPropagation(); onReset?.(); }}
              title="Volver a la posición original del config"
              style={{
                padding: '2px 8px',
                fontSize: 10,
                fontWeight: 700,
                background: 'rgba(255,180,80,0.15)',
                border: '1px solid rgba(255,180,80,0.45)',
                borderRadius: 4,
                color: '#FFC080',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              ↺ reset
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes building-pulse {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(2);   opacity: 0; }
        }
      `}</style>
    </div>
  );
}
