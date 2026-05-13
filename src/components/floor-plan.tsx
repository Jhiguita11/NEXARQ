'use client';

import { useState, useRef, useEffect } from 'react';
import { useTourStore } from '@/lib/tour-store';
import { FloorPlanRoom } from '@/lib/tour-types';
import {
  MapPin,
  ChevronUp,
  Maximize2,
  Minimize2,
  Eye,
} from 'lucide-react';

export function FloorPlan() {
  const {
    tour,
    currentSceneId,
    setCurrentScene,
    showFloorPlan,
    toggleFloorPlan,
    isEditMode,
    updateFloorPlanRoom,
  } = useTourStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [draggingRoom, setDraggingRoom] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const currentScene = tour.scenes.find(s => s.id === currentSceneId);
  const currentRoom = tour.floorPlan.rooms.find(r => r.sceneId === currentSceneId);

  if (!showFloorPlan) return null;

  const handleRoomClick = (room: FloorPlanRoom) => {
    if (!isEditMode) {
      setCurrentScene(room.sceneId);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, roomId: string) => {
    if (!isEditMode) return;
    e.stopPropagation();
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const room = tour.floorPlan.rooms.find(r => r.id === roomId);
    if (!room) return;

    setDraggingRoom(roomId);
    setDragOffset({
      x: e.clientX - rect.left - room.x,
      y: e.clientY - rect.top - room.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingRoom || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, 280));
    const newY = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, 240));

    updateFloorPlanRoom(draggingRoom, { x: newX, y: newY });

    // Also update scene map position
    const room = tour.floorPlan.rooms.find(r => r.id === draggingRoom);
    if (room) {
      const { tour: currentTour } = useTourStore.getState();
      const updatedScenes = currentTour.scenes.map(scene =>
        scene.id === room.sceneId
          ? { ...scene, mapPosition: { x: newX + room.width / 2, y: newY + room.height / 2 } }
          : scene
      );
      useTourStore.setState({ tour: { ...currentTour, scenes: updatedScenes } });
    }
  };

  const handleMouseUp = () => {
    setDraggingRoom(null);
  };

  const roomColor = (roomId: string) => {
    if (roomId === currentRoom?.id) return 'rgba(16, 185, 129, 0.5)';
    return 'rgba(255, 255, 255, 0.12)';
  };

  const roomStroke = (roomId: string) => {
    if (roomId === currentRoom?.id) return '#10b981';
    return 'rgba(255, 255, 255, 0.35)';
  };

  return (
    <div className={`fixed z-40 transition-all duration-300 ${isExpanded ? 'inset-4 md:inset-8' : 'bottom-20 right-3 md:bottom-24 md:right-4'}`}>
      {/* Toggle Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="absolute -top-10 right-0 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
          title="Expandir plano"
        >
          <Maximize2 size={16} />
        </button>
      )}

      {isExpanded && (
        <button
          onClick={() => setIsExpanded(false)}
          className="absolute -top-10 right-0 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg backdrop-blur-sm transition-colors z-50"
          title="Minimizar plano"
        >
          <Minimize2 size={16} />
        </button>
      )}

      <div
        className={`bg-black/60 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden transition-all duration-300 ${
          isExpanded ? 'w-full h-full' : 'w-64 h-56 md:w-72 md:h-64'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-emerald-400" />
            <span className="text-white/90 text-xs font-medium">Plano Interactivo</span>
          </div>
          {isEditMode && (
            <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
              EDITANDO
            </span>
          )}
        </div>

        {/* SVG Floor Plan */}
        <div className="relative p-2 flex items-center justify-center" style={{ height: isExpanded ? 'calc(100% - 36px)' : 'auto' }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${tour.floorPlan.width} ${tour.floorPlan.height}`}
            className={`w-full h-full ${isEditMode ? 'cursor-grab' : 'cursor-pointer'}`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Background */}
            <rect
              width={tour.floorPlan.width}
              height={tour.floorPlan.height}
              fill={tour.floorPlan.bgColor}
              rx="8"
            />

            {/* Connections */}
            {tour.floorPlan.connections?.map((conn, i) => {
              const fromRoom = tour.floorPlan.rooms.find(r => r.id === conn.from);
              const toRoom = tour.floorPlan.rooms.find(r => r.id === conn.to);
              if (!fromRoom || !toRoom) return null;
              return (
                <line
                  key={i}
                  x1={fromRoom.x + fromRoom.width / 2}
                  y1={fromRoom.y + fromRoom.height / 2}
                  x2={toRoom.x + toRoom.width / 2}
                  y2={toRoom.y + toRoom.height / 2}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />
              );
            })}

            {/* Rooms */}
            {tour.floorPlan.rooms.map(room => (
              <g
                key={room.id}
                onClick={() => handleRoomClick(room)}
                onMouseDown={(e) => handleMouseDown(e, room.id)}
                className="transition-all duration-200"
              >
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.width}
                  height={room.height}
                  fill={roomColor(room.id)}
                  stroke={roomStroke(room.id)}
                  strokeWidth={room.id === currentRoom?.id ? 2 : 1}
                  rx="4"
                  className="transition-all duration-200 hover:fill-white/25"
                />
                <text
                  x={room.x + room.width / 2}
                  y={room.y + room.height / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={room.id === currentRoom?.id ? '#10b981' : 'rgba(255,255,255,0.7)'}
                  fontSize="11"
                  fontWeight={room.id === currentRoom?.id ? 'bold' : 'normal'}
                  className="pointer-events-none select-none"
                  style={{ fontFamily: 'inherit' }}
                >
                  {room.name}
                </text>
              </g>
            ))}

            {/* Current Position Indicator */}
            {currentRoom && (
              <>
                <circle
                  cx={currentRoom.x + currentRoom.width / 2}
                  cy={currentRoom.y + currentRoom.height / 2}
                  r="6"
                  fill="#10b981"
                  className="animate-pulse"
                />
                <circle
                  cx={currentRoom.x + currentRoom.width / 2}
                  cy={currentRoom.y + currentRoom.height / 2}
                  r="10"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  className="animate-ping opacity-50"
                />
              </>
            )}

            {/* Hotspot indicators on floor plan */}
            {currentScene?.hotspots.map((hs, i) => {
              if (hs.type !== 'scene') return null;
              const targetRoom = tour.floorPlan.rooms.find(r => r.sceneId === hs.targetSceneId);
              if (!targetRoom) return null;
              return (
                <circle
                  key={i}
                  cx={targetRoom.x + targetRoom.width / 2}
                  cy={targetRoom.y + targetRoom.height / 2}
                  r="3"
                  fill="#3b82f6"
                  opacity="0.7"
                />
              );
            })}
          </svg>
        </div>

        {/* Room name bar */}
        <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center">
          <span className="text-emerald-400 text-xs font-semibold">
            {currentScene?.name}
          </span>
        </div>
      </div>
    </div>
  );
}
