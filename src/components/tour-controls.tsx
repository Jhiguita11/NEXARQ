'use client'

import React, { useCallback } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Home,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  MapPin,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { useTourStore } from '@/lib/tour-store'

interface PanoViewerHandle {
  getViewer: () => any
  getPitch: () => number
  getYaw: () => number
  getHfov: () => number
  lookAt: (pitch?: number, yaw?: number, hfov?: number) => void
}

interface TourControlsProps {
  viewerRef: React.RefObject<PanoViewerHandle | null>
}

export default function TourControls({ viewerRef }: TourControlsProps) {
  const selectedApartment = useTourStore((s) => s.selectedApartment)
  const currentSceneIndex = useTourStore((s) => s.currentSceneIndex)
  const isFullscreen = useTourStore((s) => s.isFullscreen)
  const showFloorPlan = useTourStore((s) => s.showFloorPlan)
  const autoRotate = useTourStore((s) => s.autoRotate)
  const toggleFullscreen = useTourStore((s) => s.toggleFullscreen)
  const toggleFloorPlan = useTourStore((s) => s.toggleFloorPlan)
  const toggleAutoRotate = useTourStore((s) => s.toggleAutoRotate)
  const nextScene = useTourStore((s) => s.nextScene)
  const prevScene = useTourStore((s) => s.prevScene)
  const setCurrentScene = useTourStore((s) => s.setCurrentScene)

  const scenes = selectedApartment?.scenes ?? []
  const currentScene = scenes[currentSceneIndex]
  const totalScenes = scenes.length

  const handlePrev = useCallback(() => prevScene(), [prevScene])
  const handleNext = useCallback(() => nextScene(), [nextScene])

  const handleSceneDot = useCallback(
    (index: number) => {
      const scene = scenes[index]
      if (scene) setCurrentScene(scene.id)
    },
    [scenes, setCurrentScene],
  )

  const btnBase = 'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer select-none'
  const btnDefault = `${btnBase} bg-black/40 backdrop-blur-md border border-white/8 text-white/50 hover:text-white hover:bg-black/60 hover:border-white/15 hover:scale-105 active:scale-95`
  const btnActive = `${btnBase} bg-white text-black`

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
      {/* ─── Scene Dots Strip ─── */}
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full
          bg-black/30 backdrop-blur-md border border-white/8"
      >
        {/* Prev arrow */}
        <button
          onClick={handlePrev}
          disabled={currentSceneIndex === 0}
          className={`${btnDefault} disabled:opacity-25 disabled:pointer-events-none`}
          aria-label="Anterior"
          title="Anterior"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1">
          {scenes.map((scene, i) => {
            const isActive = i === currentSceneIndex
            return (
              <button
                key={scene.id}
                onClick={() => handleSceneDot(i)}
                title={scene.name}
                className="rounded-full transition-all duration-300 cursor-pointer outline-none border-0 p-0"
                style={{
                  width: isActive ? 22 : 7,
                  height: 7,
                  backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.3)',
                }}
              />
            )
          })}
        </div>

        {/* Next arrow */}
        <button
          onClick={handleNext}
          disabled={currentSceneIndex === totalScenes - 1}
          className={`${btnDefault} disabled:opacity-25 disabled:pointer-events-none`}
          aria-label="Siguiente"
          title="Siguiente"
        >
          <ChevronRight size={14} />
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-white/15 mx-0.5" />

        {/* Scene label */}
        <span className="text-[11px] text-white/50 font-medium tracking-wide whitespace-nowrap tabular-nums">
          {currentScene?.name ?? ''}&nbsp;&middot;&nbsp;{currentSceneIndex + 1}/{totalScenes}
        </span>
      </div>

      {/* ─── Controls Strip ─── */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
          bg-black/30 backdrop-blur-md border border-white/8"
      >
        {/* Home */}
        <button
          onClick={() => {
            const scene = scenes[currentSceneIndex]
            if (!scene?.defaultView) return
            viewerRef.current?.lookAt(scene.defaultView.pitch, scene.defaultView.yaw, scene.defaultView.hfov)
          }}
          className={btnDefault}
          title="Restablecer vista"
        >
          <Home size={14} />
        </button>

        {/* Auto-rotate */}
        <button
          onClick={toggleAutoRotate}
          className={autoRotate ? btnActive : btnDefault}
          title="Auto-rotar"
        >
          <RotateCcw
            size={14}
            className={autoRotate ? 'animate-spin' : ''}
            style={autoRotate ? { animationDuration: '3s' } : undefined}
          />
        </button>

        <div className="w-px h-4 bg-white/15" />

        {/* Zoom out */}
        <button
          onClick={() => {
            const hfov = viewerRef.current?.getHfov() ?? 100
            viewerRef.current?.lookAt(undefined, undefined, Math.min(150, hfov + 15))
          }}
          className={btnDefault}
          title="Alejar"
        >
          <ZoomOut size={14} />
        </button>

        {/* Zoom in */}
        <button
          onClick={() => {
            const hfov = viewerRef.current?.getHfov() ?? 100
            viewerRef.current?.lookAt(undefined, undefined, Math.max(30, hfov - 15))
          }}
          className={btnDefault}
          title="Acercar"
        >
          <ZoomIn size={14} />
        </button>

        <div className="w-px h-4 bg-white/15" />

        {/* Floor plan */}
        <button
          onClick={toggleFloorPlan}
          className={showFloorPlan ? btnActive : btnDefault}
          title="Plano"
        >
          <MapPin size={14} />
        </button>

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className={isFullscreen ? btnActive : btnDefault}
          title={isFullscreen ? 'Salir pantalla completa' : 'Pantalla completa'}
        >
          {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
    </div>
  )
}
