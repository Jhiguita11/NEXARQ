'use client';

import { useCallback, useEffect, useState } from 'react';
import { MapPin, Maximize2, Minimize2 } from 'lucide-react';
import { useTourStore } from '@/lib/tour-store';
import type { FloorPlanRoomConfig } from '@/lib/tour-types';

export default function FloorPlan() {
  const config = useTourStore((s) => s.config);
  const currentSceneId = useTourStore((s) => s.currentSceneId);
  const showFloorPlan = useTourStore((s) => s.showFloorPlan);
  const toggleFloorPlan = useTourStore((s) => s.toggleFloorPlan);
  const setCurrentScene = useTourStore((s) => s.setCurrentScene);

  const [expanded, setExpanded] = useState(false);

  const primary = config?.theme?.primary ?? '#4f86f7';
  const floorPlan = config?.floorPlan;
  const rooms: FloorPlanRoomConfig[] = floorPlan?.rooms ?? [];

  const currentScene = config?.scenes?.find((s) => s.id === currentSceneId);
  const currentSceneName = currentScene?.name ?? '';

  const handleRoomClick = useCallback(
    (sceneId: string) => {
      setCurrentScene(sceneId);
    },
    [setCurrentScene],
  );

  const toggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expanded) {
        setExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expanded]);

  if (!showFloorPlan) return null;

  const svgWidth = expanded ? 900 : 230;
  const svgHeight = expanded ? 600 : 170;

  // Scale rooms proportionally
  const planW = floorPlan?.width ?? 900;
  const planH = floorPlan?.height ?? 600;
  const scaleX = svgWidth / planW;
  const scaleY = svgHeight / planH;

  // Build a map of sceneId → room for adjacency lookups
  const roomMap = new Map<string, FloorPlanRoomConfig>();
  for (const room of rooms) {
    roomMap.set(room.sceneId, room);
  }

  // Collect unique connection pairs (undirected)
  const connectionPairs = new Set<string>();
  const connections: [FloorPlanRoomConfig, FloorPlanRoomConfig][] = [];

  for (const room of rooms) {
    const adjacent = room.adjacentTo ?? [];
    for (const adjId of adjacent) {
      const key = [room.sceneId, adjId].sort().join('::');
      if (!connectionPairs.has(key)) {
        connectionPairs.add(key);
        const adjRoom = roomMap.get(adjId);
        if (adjRoom) {
          connections.push([room, adjRoom]);
        }
      }
    }
  }

  // Helper: get room center
  const getCenter = (room: FloorPlanRoomConfig) => ({
    cx: room.x * scaleX + (room.width * scaleX) / 2,
    cy: room.y * scaleY + (room.height * scaleY) / 2,
  });

  // Helper: clamp text inside room
  const getFontSize = (room: FloorPlanRoomConfig) => {
    const roomScaledW = room.width * scaleX;
    const roomScaledH = room.height * scaleY;
    const minDim = Math.min(roomScaledW, roomScaledH);
    // Scale font between 8px and 14px
    return Math.max(8, Math.min(14, minDim * 0.18));
  };

  return (
    <>
      {/* Keyframe styles for pulse animation */}
      <style>{`
        @keyframes fp-pulse-ring {
          0% { r: 4; opacity: 1; }
          100% { r: 12; opacity: 0; }
        }
        @keyframes fp-pulse-dot {
          0%, 100% { r: 3.5; opacity: 1; }
          50% { r: 4.5; opacity: 0.85; }
        }
        .fp-pulse-ring {
          animation: fp-pulse-ring 1.8s ease-out infinite;
        }
        .fp-pulse-dot {
          animation: fp-pulse-dot 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* Overlay backdrop when expanded */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] transition-opacity duration-300"
          onClick={toggleExpand}
          aria-hidden
        />
      )}

      {/* Floor plan container */}
      <div
        className="fixed z-[9999] flex flex-col items-center justify-end overflow-hidden rounded-2xl border border-white/20 shadow-2xl backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          background: 'rgba(15, 23, 42, 0.72)',
          ...(expanded
            ? {
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                width: `min(calc(100vw - 48px), 960px)`,
                height: `min(calc(100vh - 48px), 720px)`,
                padding: 20,
              }
            : {
                bottom: 16,
                right: 16,
                width: 260,
                height: 230,
                padding: 14,
              }),
        }}
      >
        {/* Header bar */}
        <div className="flex w-full items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <MapPin size={expanded ? 16 : 13} className="text-white/70" />
            <span
              className="font-semibold tracking-wide text-white/80 select-none"
              style={{ fontSize: expanded ? 13 : 11 }}
            >
              Floor Plan
            </span>
          </div>
          <div className="flex items-center gap-1">
            {/* Close button */}
            <button
              onClick={toggleFloorPlan}
              className="flex items-center justify-center rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white/90"
              aria-label="Close floor plan"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="2" y1="2" x2="12" y2="12" />
                <line x1="12" y1="2" x2="2" y2="12" />
              </svg>
            </button>
            {/* Expand / Collapse */}
            <button
              onClick={toggleExpand}
              className="flex items-center justify-center rounded-lg p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white/90"
              aria-label={expanded ? 'Collapse floor plan' : 'Expand floor plan'}
            >
              {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>

        {/* SVG floor plan */}
        <div className="flex-1 w-full min-h-0">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Defs: glow filter */}
            <defs>
              <filter id="fp-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background fill for the plan area */}
            {(floorPlan?.background ?? '') !== '' && (
              <rect
                x={0}
                y={0}
                width={svgWidth}
                height={svgHeight}
                rx={8}
                fill={floorPlan?.background ?? 'transparent'}
                opacity={0.4}
              />
            )}

            {/* Connection lines (dashed) */}
            {connections.map(([a, b], idx) => {
              const aC = getCenter(a);
              const bC = getCenter(b);
              return (
                <line
                  key={`conn-${idx}`}
                  x1={aC.cx}
                  y1={aC.cy}
                  x2={bC.cx}
                  y2={bC.cy}
                  stroke={primary}
                  strokeWidth={expanded ? 1.5 : 1}
                  strokeDasharray="6 4"
                  opacity={0.35}
                />
              );
            })}

            {/* Rooms */}
            {rooms.map((room) => {
              const isCurrent = room.sceneId === currentSceneId;
              const rx = room.x * scaleX;
              const ry = room.y * scaleY;
              const rw = room.width * scaleX;
              const rh = room.height * scaleY;
              const radius = expanded ? 8 : 5;
              const center = getCenter(room);
              const fontSize = getFontSize(room);

              return (
                <g
                  key={room.sceneId}
                  className="cursor-pointer"
                  onClick={() => handleRoomClick(room.sceneId)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Go to ${room.label}`}
                >
                  {/* Room rectangle */}
                  <rect
                    x={rx}
                    y={ry}
                    width={rw}
                    height={rh}
                    rx={radius}
                    ry={radius}
                    fill={isCurrent ? primary : 'rgba(255,255,255,0.08)'}
                    stroke={isCurrent ? primary : 'rgba(255,255,255,0.18)'}
                    strokeWidth={isCurrent ? 2 : 1}
                    filter={isCurrent ? 'url(#fp-glow)' : undefined}
                    className="transition-all duration-300"
                    style={{ opacity: isCurrent ? 0.9 : 0.7 }}
                  />
                  {/* Hover overlay */}
                  <rect
                    x={rx}
                    y={ry}
                    width={rw}
                    height={rh}
                    rx={radius}
                    ry={radius}
                    fill="rgba(255,255,255,0.06)"
                    className="opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  />
                  {/* Label text */}
                  <text
                    x={center.cx}
                    y={center.cy - (isCurrent ? 10 : 0)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isCurrent ? '#ffffff' : 'rgba(255,255,255,0.6)'}
                    fontSize={fontSize}
                    fontWeight={isCurrent ? 700 : 500}
                    className="pointer-events-none select-none"
                    style={{ letterSpacing: 0.3 }}
                  >
                    {room.label}
                  </text>
                  {/* Pulsing dot for current room */}
                  {isCurrent && (
                    <g className="pointer-events-none">
                      <circle
                        cx={center.cx}
                        cy={center.cy + 10}
                        fill="none"
                        stroke={primary}
                        strokeWidth={1.5}
                        className="fp-pulse-ring"
                      />
                      <circle
                        cx={center.cx}
                        cy={center.cy + 10}
                        fill="#ffffff"
                        className="fp-pulse-dot"
                      />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Current scene name */}
        <div className="mt-2 w-full text-center">
          <span
            className="block truncate font-medium tracking-wide text-white/50 select-none"
            style={{ fontSize: expanded ? 12 : 10 }}
          >
            {currentSceneName}
          </span>
        </div>
      </div>
    </>
  );
}
