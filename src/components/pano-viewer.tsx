'use client';

import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useTourStore } from '@/lib/tour-store';
import { HotspotData } from '@/lib/tour-types';

declare global {
  interface Window {
    pannellum: any;
  }
}

export interface PanoViewerHandle {
  getViewer: () => any;
  getPitch: () => number;
  getYaw: () => number;
  getHfov: () => number;
  lookAt: (pitch: number, yaw: number, hfov?: number, callback?: () => void) => void;
}

interface PanoViewerProps {
  onHotspotClick?: (hotspot: HotspotData) => void;
  onHotspotCreate?: (pitch: number, yaw: number) => void;
}

export const PanoViewer = forwardRef<PanoViewerHandle, PanoViewerProps>(
  function PanoViewer({ onHotspotClick, onHotspotCreate }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [cssLoaded, setCssLoaded] = useState(false);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const currentScene = useTourStore(s => s.tour.scenes.find(sc => sc.id === s.currentSceneId));
    const autoRotate = useTourStore(s => s.autoRotate);
    const autoRotateSpeed = useTourStore(s => s.tour.autoRotateSpeed);
    const isEditMode = useTourStore(s => s.isEditMode);
    const setSceneView = useTourStore(s => s.setSceneView);

    useImperativeHandle(ref, () => ({
      getViewer: () => viewerRef.current,
      getPitch: () => viewerRef.current?.getPitch() ?? 0,
      getYaw: () => viewerRef.current?.getYaw() ?? 0,
      getHfov: () => viewerRef.current?.getHfov() ?? 75,
      lookAt: (pitch, yaw, hfov, callback) => {
        viewerRef.current?.lookAt(pitch, yaw, hfov ?? 75, callback);
      },
    }));

    const initViewer = useCallback(() => {
      if (!containerRef.current || !window.pannellum || !currentScene) return;

      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch {
          // ignore
        }
        viewerRef.current = null;
      }

      try {
        const hotSpots = currentScene.hotspots.map((h: HotspotData) => ({
          pitch: h.pitch,
          yaw: h.yaw,
          type: 'custom',
          cssClass: `custom-hotspot hotspot-${h.type}`,
          id: h.id,
          createTooltipFunc: (hotSpotDiv: HTMLDivElement) => {
            const isScene = h.type === 'scene';
            hotSpotDiv.innerHTML = `
              <div class="hotspot-bubble ${isScene ? 'hotspot-bubble-scene' : 'hotspot-bubble-info'}">
                <div class="hotspot-icon">${isScene ? '&#10140;' : 'i'}</div>
                <div class="hotspot-label">${h.text}</div>
                <div class="hotspot-arrow"></div>
              </div>
            `;
            hotSpotDiv.style.cursor = 'pointer';
            hotSpotDiv.onclick = (e: MouseEvent) => {
              e.stopPropagation();
              onHotspotClick?.(h);
            };
          },
        }));

        viewerRef.current = window.pannellum.viewer(containerRef.current, {
          type: 'equirectangular',
          panorama: currentScene.panoramaUrl,
          autoLoad: true,
          autoRotate: autoRotate ? autoRotateSpeed : 0,
          showControls: false,
          mouseZoom: true,
          hfov: currentScene.defaultView.hfov,
          pitch: currentScene.defaultView.pitch,
          yaw: currentScene.defaultView.yaw,
          minHfov: 30,
          maxHfov: 120,
          friction: 0.15,
          yaw: currentScene.defaultView.yaw,
          compass: false,
          preview: currentScene.panoramaUrl,
          hotSpots,
          draggable: true,
        });

        // Handle double click for adding hotspots in edit mode
        containerRef.current.addEventListener('dblclick', (e: MouseEvent) => {
          if (!isEditMode || !viewerRef.current) return;
          const rect = containerRef.current!.getBoundingClientRect();
          // Note: Pannellum doesn't expose click-to-pitch/yaw easily
          // We'll use approximate coordinates
        });

      } catch (err) {
        console.error('Failed to initialize Pannellum viewer:', err);
      }
    }, [currentScene, autoRotate, autoRotateSpeed, isEditMode, onHotspotClick]);

    useEffect(() => {
      if (!scriptLoaded) {
        const checkInterval = setInterval(() => {
          if ((window as any).pannellum) {
            setScriptLoaded(true);
            clearInterval(checkInterval);
          }
        }, 100);
        return () => clearInterval(checkInterval);
      }
    }, [scriptLoaded]);

    useEffect(() => {
      if (scriptLoaded) {
        const timer = setTimeout(() => {
          initViewer();
        }, 100);
        return () => clearTimeout(timer);
      }
    }, [scriptLoaded, initViewer]);

    useEffect(() => {
      if (!scriptLoaded) return;
      const timer = setTimeout(() => {
        if (viewerRef.current) {
          viewerRef.current.setAutoRotate(autoRotate ? autoRotateSpeed : 0);
        }
      }, 200);
      return () => clearTimeout(timer);
    }, [autoRotate, autoRotateSpeed, scriptLoaded]);

    useEffect(() => {
      return () => {
        if (viewerRef.current) {
          try {
            viewerRef.current.destroy();
          } catch {
            // ignore
          }
        }
      };
    }, []);

    return (
      <>
        <script
          src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
          onLoad={() => setScriptLoaded(true)}
          async
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"
        />
        <div
          ref={containerRef}
          className="w-full h-full"
          style={{
            opacity: scriptLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />
        {!scriptLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-white/70 text-sm">Cargando visor 360°...</p>
            </div>
          </div>
        )}
      </>
    );
  }
);
