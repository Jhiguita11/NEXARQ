'use client'

import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Home,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  MapPin,
  LayoutGrid,
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
  const scenes = useTourStore((s) => s.config.scenes)
  const primary = useTourStore((s) => s.config.theme.primary)
  const secondary = useTourStore((s) => s.config.theme.secondary)
  const currentSceneIndex = useTourStore((s) => s.currentSceneIndex)
  const isFullscreen = useTourStore((s) => s.isFullscreen)
  const showFloorPlan = useTourStore((s) => s.showFloorPlan)
  const showSceneList = useTourStore((s) => s.showSceneList)
  const autoRotate = useTourStore((s) => s.autoRotate)
  const toggleFullscreen = useTourStore((s) => s.toggleFullscreen)
  const toggleFloorPlan = useTourStore((s) => s.toggleFloorPlan)
  const toggleSceneList = useTourStore((s) => s.toggleSceneList)
  const toggleAutoRotate = useTourStore((s) => s.toggleAutoRotate)
  const nextScene = useTourStore((s) => s.nextScene)
  const prevScene = useTourStore((s) => s.prevScene)
  const setCurrentScene = useTourStore((s) => s.setCurrentScene)

  const currentScene = scenes[currentSceneIndex]
  const totalScenes = scenes.length

  // ---------- Handlers ----------

  const handleHome = () => {
    const scene = scenes[currentSceneIndex]
    if (!scene?.defaultView) return
    viewerRef.current?.lookAt(
      scene.defaultView.pitch,
      scene.defaultView.yaw,
      scene.defaultView.hfov,
    )
  }

  const handleZoomIn = () => {
    const hfov = viewerRef.current?.getHfov() ?? 100
    viewerRef.current?.lookAt(undefined, undefined, Math.max(30, hfov - 15))
  }

  const handleZoomOut = () => {
    const hfov = viewerRef.current?.getHfov() ?? 100
    viewerRef.current?.lookAt(undefined, undefined, Math.min(150, hfov + 15))
  }

  const handlePrev = () => prevScene()
  const handleNext = () => nextScene()
  const handleSceneDot = (index: number) => {
    const scene = scenes[index]
    if (scene) setCurrentScene(scene.id)
  }

  // ---------- Shared button class ----------

  const btnBase = `relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 cursor-pointer select-none
    bg-white/10 backdrop-blur-sm border border-white/10
    hover:bg-white/20 hover:border-white/20 hover:scale-105
    active:scale-95 text-white/70 hover:text-white`

  const btnActive = (active: boolean) =>
    active ? `!bg-[var(--tw-primary-opacity,${primary}22)] !text-[${primary}] !border-[${primary}44]` : ''

  const separator = <div className="w-px h-5 bg-white/15 mx-0.5" />

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2.5 w-[calc(100%-2rem)] max-w-lg">
      {/* ─── Scene Navigation Bar ─── */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full justify-between
          bg-black/30 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20"
      >
        {/* Prev */}
        <button
          onClick={handlePrev}
          disabled={currentSceneIndex === 0}
          className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 cursor-pointer select-none
            bg-white/10 border border-white/10 text-white/70 hover:text-white hover:bg-white/20 hover:scale-105 active:scale-95
            disabled:opacity-30 disabled:pointer-events-none`}
          aria-label="Previous scene"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Dots + label */}
        <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {scenes.map((scene, i) => {
              const isActive = i === currentSceneIndex
              return (
                <button
                  key={scene.id}
                  onClick={() => handleSceneDot(i)}
                  className="rounded-full transition-all duration-300 cursor-pointer outline-none border-0 p-0"
                  style={{
                    width: isActive ? 28 : 10,
                    height: 10,
                    backgroundColor: isActive ? primary : 'rgba(255,255,255,0.35)',
                    borderRadius: 9999,
                    boxShadow: isActive ? `0 0 10px ${primary}66` : 'none',
                  }}
                  aria-label={`Go to ${scene.name}`}
                  title={scene.name}
                />
              )
            })}
          </div>
          <span className="text-[11px] text-white/50 font-medium tracking-wide truncate max-w-full">
            {currentScene?.name ?? ''}&nbsp;&middot;&nbsp;{currentSceneIndex + 1}/{totalScenes}
          </span>
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={currentSceneIndex === totalScenes - 1}
          className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 cursor-pointer select-none
            bg-white/10 border border-white/10 text-white/70 hover:text-white hover:bg-white/20 hover:scale-105 active:scale-95
            disabled:opacity-30 disabled:pointer-events-none`}
          aria-label="Next scene"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ─── Controls Bar ─── */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 rounded-2xl
          bg-black/30 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20"
      >
        {/* Home */}
        <button
          onClick={handleHome}
          className={`${btnBase}`}
          aria-label="Reset camera"
          title="Reset view"
        >
          <Home size={18} />
        </button>

        {/* Auto-rotate */}
        <button
          onClick={toggleAutoRotate}
          className={`${btnBase} ${btnActive(autoRotate)}`}
          aria-label="Toggle auto-rotate"
          title="Auto-rotate"
        >
          <RotateCcw
            size={18}
            className={autoRotate ? 'animate-spin' : ''}
            style={autoRotate ? { animationDuration: '3s' } : undefined}
          />
        </button>

        {separator}

        {/* Zoom out */}
        <button
          onClick={handleZoomOut}
          className={`${btnBase}`}
          aria-label="Zoom out"
          title="Zoom out"
        >
          <ZoomOut size={18} />
        </button>

        {/* Zoom in */}
        <button
          onClick={handleZoomIn}
          className={`${btnBase}`}
          aria-label="Zoom in"
          title="Zoom in"
        >
          <ZoomIn size={18} />
        </button>

        {separator}

        {/* Floor plan */}
        <button
          onClick={toggleFloorPlan}
          className={`${btnBase} ${btnActive(showFloorPlan)}`}
          aria-label="Toggle floor plan"
          title="Floor plan"
        >
          <MapPin size={18} />
        </button>

        {/* Scene list */}
        <button
          onClick={toggleSceneList}
          className={`${btnBase} ${btnActive(showSceneList)}`}
          aria-label="Toggle scene list"
          title="Scene list"
        >
          <LayoutGrid size={18} />
        </button>

        {separator}

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className={`${btnBase} ${btnActive(isFullscreen)}`}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {/* ─── Mobile responsive overrides ─── */}

    </div>
  )
}
