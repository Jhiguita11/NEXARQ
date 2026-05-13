'use client';

import { useState } from 'react';
import { useTourStore } from '@/lib/tour-store';
import { HotspotData } from '@/lib/tour-types';
import { X, Trash2, Plus, Move, Info, ExternalLink, ArrowRight } from 'lucide-react';

export function HotspotEditor() {
  const {
    tour,
    currentSceneId,
    isEditMode,
    editingHotspot,
    setEditingHotspot,
    addHotspot,
    updateHotspot,
    removeHotspot,
    toggleEditMode,
  } = useTourStore();

  const [newHotspotType, setNewHotspotType] = useState<'scene' | 'info' | 'url'>('scene');
  const [newHotspotText, setNewHotspotText] = useState('');
  const [newHotspotTarget, setNewHotspotTarget] = useState('');
  const [newHotspotPitch, setNewHotspotPitch] = useState(0);
  const [newHotspotYaw, setNewHotspotYaw] = useState(0);
  const [newHotspotUrl, setNewHotspotUrl] = useState('');

  if (!isEditMode) return null;

  const currentScene = tour.scenes.find(s => s.id === currentSceneId);
  if (!currentScene) return null;

  const handleAddHotspot = () => {
    if (!newHotspotText.trim()) return;

    const hotspot: HotspotData = {
      id: `hs-${Date.now()}`,
      pitch: newHotspotPitch,
      yaw: newHotspotYaw,
      type: newHotspotType,
      text: newHotspotText,
      targetSceneId: newHotspotType === 'scene' ? newHotspotTarget : undefined,
      url: newHotspotType === 'url' ? newHotspotUrl : undefined,
      color: newHotspotType === 'scene' ? '#10b981' : '#3b82f6',
      icon: newHotspotType === 'scene' ? 'arrow-right' : newHotspotType === 'info' ? 'info' : 'external-link',
    };

    addHotspot(currentSceneId, hotspot);
    setNewHotspotText('');
    setNewHotspotTarget('');
    setNewHotspotUrl('');
  };

  const handleRemoveHotspot = (hotspotId: string) => {
    removeHotspot(currentSceneId, hotspotId);
    if (editingHotspot?.id === hotspotId) {
      setEditingHotspot(null);
    }
  };

  const handleUpdateHotspot = (hotspotId: string, updates: Partial<HotspotData>) => {
    updateHotspot(currentSceneId, hotspotId, updates);
  };

  return (
    <div className="fixed top-0 left-0 bottom-0 w-96 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={toggleEditMode} />

      {/* Panel */}
      <div className="bg-gray-950/95 backdrop-blur-xl border-r border-white/10 w-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-amber-500/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-white font-semibold text-sm">Editor de Hotspots</h2>
          </div>
          <button
            onClick={toggleEditMode}
            className="text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Scene */}
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Escena actual</p>
          <p className="text-emerald-400 font-semibold text-sm">{currentScene.name}</p>
        </div>

        {/* Existing Hotspots */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <p className="text-white/40 text-[10px] uppercase tracking-wider">
            Hotspots existentes ({currentScene.hotspots.length})
          </p>

          {currentScene.hotspots.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white/30 text-sm">No hay hotspots en esta escena</p>
              <p className="text-white/20 text-xs mt-1">Agrega uno usando el formulario de abajo</p>
            </div>
          )}

          {currentScene.hotspots.map(hotspot => (
            <div
              key={hotspot.id}
              className={`rounded-lg border p-3 transition-all ${
                editingHotspot?.id === hotspot.id
                  ? 'border-amber-400/50 bg-amber-500/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/8'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center ${
                      hotspot.type === 'scene'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : hotspot.type === 'info'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}
                  >
                    {hotspot.type === 'scene' ? (
                      <ArrowRight size={14} />
                    ) : hotspot.type === 'info' ? (
                      <Info size={14} />
                    ) : (
                      <ExternalLink size={14} />
                    )}
                  </div>
                  <div>
                    <p className="text-white/90 text-xs font-medium">{hotspot.text}</p>
                    <p className="text-white/40 text-[10px]">
                      {hotspot.type === 'scene'
                        ? `→ ${tour.scenes.find(s => s.id === hotspot.targetSceneId)?.name || 'Desconocido'}`
                        : hotspot.type === 'info'
                        ? 'Información'
                        : hotspot.url}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveHotspot(hotspot.id)}
                  className="text-red-400/60 hover:text-red-400 p-1 rounded transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Quick edit fields */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-white/40 text-[9px] uppercase">Pitch</label>
                  <input
                    type="number"
                    value={hotspot.pitch}
                    onChange={e => handleUpdateHotspot(hotspot.id, { pitch: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-emerald-400/50"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-[9px] uppercase">Yaw</label>
                  <input
                    type="number"
                    value={hotspot.yaw}
                    onChange={e => handleUpdateHotspot(hotspot.id, { yaw: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-emerald-400/50"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-[9px] uppercase">Texto</label>
                  <input
                    type="text"
                    value={hotspot.text}
                    onChange={e => handleUpdateHotspot(hotspot.id, { text: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-emerald-400/50"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Hotspot */}
        <div className="border-t border-white/10 p-4 bg-white/3">
          <p className="text-white/40 text-[10px] uppercase tracking-wider mb-3">Agregar nuevo hotspot</p>

          <div className="space-y-2">
            {/* Type selector */}
            <div className="flex gap-2">
              {(['scene', 'info', 'url'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setNewHotspotType(type)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                    newHotspotType === type
                      ? type === 'scene'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30'
                        : type === 'info'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-400/30'
                        : 'bg-purple-500/20 text-purple-400 border border-purple-400/30'
                      : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {type === 'scene' ? 'Navegar' : type === 'info' ? 'Info' : 'URL'}
                </button>
              ))}
            </div>

            {/* Text */}
            <input
              type="text"
              placeholder="Texto del hotspot..."
              value={newHotspotText}
              onChange={e => setNewHotspotText(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50"
            />

            {/* Conditional fields */}
            {newHotspotType === 'scene' && (
              <select
                value={newHotspotTarget}
                onChange={e => setNewHotspotTarget(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-400/50"
              >
                <option value="" className="bg-gray-900">Seleccionar escena destino...</option>
                {tour.scenes
                  .filter(s => s.id !== currentSceneId)
                  .map(s => (
                    <option key={s.id} value={s.id} className="bg-gray-900">
                      {s.name}
                    </option>
                  ))}
              </select>
            )}

            {newHotspotType === 'url' && (
              <input
                type="url"
                placeholder="https://..."
                value={newHotspotUrl}
                onChange={e => setNewHotspotUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50"
              />
            )}

            {/* Position */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-white/40 text-[9px] uppercase">Pitch (vertical)</label>
                <input
                  type="number"
                  value={newHotspotPitch}
                  onChange={e => setNewHotspotPitch(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-400/50"
                  min="-90"
                  max="90"
                />
              </div>
              <div>
                <label className="text-white/40 text-[9px] uppercase">Yaw (horizontal)</label>
                <input
                  type="number"
                  value={newHotspotYaw}
                  onChange={e => setNewHotspotYaw(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-400/50"
                  min="-180"
                  max="180"
                />
              </div>
            </div>

            {/* Add button */}
            <button
              onClick={handleAddHotspot}
              disabled={!newHotspotText.trim() || (newHotspotType === 'scene' && !newHotspotTarget)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-white/10 disabled:text-white/30 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Agregar Hotspot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
