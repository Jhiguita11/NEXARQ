'use client';

import { useEffect, useRef } from 'react';
import { useTourStore } from './tour-store';

/** Tiempo de inactividad (ms) antes de activar el modo reproducción automáticamente. */
const INACTIVITY_MS = 60000;

/**
 * Activa el modo reproducción automáticamente tras un periodo de inactividad
 * (sin mouse, teclado ni touch) — comportamiento tipo screensaver para stands.
 * Cualquier interacción del usuario sale del modo reproducción y reinicia el contador.
 *
 * @param enabled solo corre cuando el tour está visible (no en splash/welcome)
 */
export function useInactivityPlayback(enabled: boolean) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const scheduleAutoPlay = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const store = useTourStore.getState();
        if (store.selectedApartment && !store.isPlaybackMode) {
          store.startPlayback(true); // auto = true
        }
      }, INACTIVITY_MS);
    };

    const onActivity = () => {
      const store = useTourStore.getState();
      // Solo cierra el playback si se activó automáticamente (screensaver).
      // El playback manual (botón ▶) se mantiene hasta Escape o botón Salir.
      if (store.isPlaybackMode && store.playbackAuto) store.stopPlayback();
      scheduleAutoPlay();
    };

    const events: (keyof WindowEventMap)[] = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'wheel'];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    scheduleAutoPlay();

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled]);
}
