'use client';

import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useTourStore } from './tour-store';
import type { PanoViewerHandle } from '@/components/pano-viewer';

/**
 * Keyboard shortcuts for desktop users.
 *
 * ArrowRight / ArrowDown  → next scene
 * ArrowLeft  / ArrowUp    → prev scene
 * 1–9                     → jump to scene by index
 * F                       → toggle fullscreen
 * R                       → toggle auto-rotate
 * M                       → toggle floor plan
 * Home                    → reset view to default
 */
export function useTourKeyboard(viewerRef: RefObject<PanoViewerHandle | null>) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't intercept while user is typing in an input field
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if ((e.target as HTMLElement)?.isContentEditable) return;

      const store = useTourStore.getState();
      const scenes = store.selectedApartment?.scenes ?? [];
      if (!scenes.length) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          store.nextScene();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          store.prevScene();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          store.toggleAutoRotate();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          store.toggleFloorPlan();
          break;
        case 'Home':
          e.preventDefault();
          if (viewerRef.current) {
            const scene = scenes[store.currentSceneIndex];
            if (scene?.defaultView) {
              const { pitch, yaw, hfov } = scene.defaultView;
              viewerRef.current.lookAt(pitch, yaw, hfov);
            }
          }
          break;
        default: {
          const num = parseInt(e.key, 10);
          if (!isNaN(num) && num >= 1 && num <= 9 && scenes[num - 1]) {
            e.preventDefault();
            store.setCurrentScene(scenes[num - 1].id);
          }
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewerRef]); // viewerRef is stable (useRef), effect runs once
}
