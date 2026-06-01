'use client';

import { useEffect, useRef } from 'react';
import { useTourStore } from './tour-store';

interface SceneViewEvent {
  event: 'scene_view';
  sceneId: string;
  sceneName: string;
  apartmentId: string;
  apartmentName: string;
  durationMs: number;
  durationSec: number;
}

function emit(payload: SceneViewEvent) {
  if (process.env.NODE_ENV === 'production') {
    // Push to Google Tag Manager dataLayer if available
    (window as any).dataLayer = (window as any).dataLayer ?? [];
    (window as any).dataLayer.push(payload);
  } else {
    console.log('[Analytics]', payload);
  }
}

/**
 * Tracks how long the user spends on each scene.
 * Emits a `scene_view` event to GTM dataLayer on every scene change.
 */
export function useSceneAnalytics() {
  const currentSceneId = useTourStore((s) => s.currentSceneId);
  const selectedApartment = useTourStore((s) => s.selectedApartment);

  const startTimeRef = useRef<number>(Date.now());
  const lastSceneRef = useRef<string>('');

  useEffect(() => {
    const now = Date.now();

    if (lastSceneRef.current && lastSceneRef.current !== currentSceneId) {
      const durationMs = now - startTimeRef.current;
      const scene = selectedApartment?.scenes.find((s) => s.id === lastSceneRef.current);

      emit({
        event: 'scene_view',
        sceneId: lastSceneRef.current,
        sceneName: scene?.name ?? lastSceneRef.current,
        apartmentId: selectedApartment?.id ?? '',
        apartmentName: selectedApartment?.name ?? '',
        durationMs,
        durationSec: Math.round(durationMs / 1000),
      });
    }

    startTimeRef.current = now;
    lastSceneRef.current = currentSceneId;
  }, [currentSceneId, selectedApartment]);
}
