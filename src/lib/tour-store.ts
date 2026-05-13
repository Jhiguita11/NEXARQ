'use client';

import { create } from 'zustand';
import tourConfig from './tour.config';
import type { SceneConfig, HotspotConfig, FloorPlanRoomConfig } from './tour-types';

interface TourState {
  config: typeof tourConfig;
  currentSceneId: string;
  currentSceneIndex: number;
  isFullscreen: boolean;
  showFloorPlan: boolean;
  showSceneList: boolean;
  autoRotate: boolean;
  isLoading: boolean;
  isTransitioning: boolean;
  showInfoPanel: boolean;
  infoPanelData: { title: string; description: string } | null;

  setCurrentScene: (id: string) => void;
  nextScene: () => void;
  prevScene: () => void;
  toggleFullscreen: () => void;
  toggleFloorPlan: () => void;
  toggleSceneList: () => void;
  toggleAutoRotate: () => void;
  setLoading: (v: boolean) => void;
  setTransitioning: (v: boolean) => void;
  showInfo: (title: string, description: string) => void;
  hideInfo: () => void;
}

export const useTourStore = create<TourState>((set, get) => ({
  config: tourConfig,
  currentSceneId: tourConfig.scenes[0]?.id ?? '',
  currentSceneIndex: 0,
  isFullscreen: false,
  showFloorPlan: tourConfig.showFloorPlan,
  showSceneList: false,
  autoRotate: tourConfig.autoRotateSpeed !== 0,
  isLoading: true,
  isTransitioning: false,
  showInfoPanel: false,
  infoPanelData: null,

  setCurrentScene: (id) => {
    const { config } = get();
    const idx = config.scenes.findIndex(s => s.id === id);
    if (idx !== -1) set({ currentSceneId: id, currentSceneIndex: idx, showInfoPanel: false });
  },

  nextScene: () => {
    const { config, currentSceneIndex } = get();
    const n = (currentSceneIndex + 1) % config.scenes.length;
    set({ currentSceneId: config.scenes[n].id, currentSceneIndex: n, showInfoPanel: false });
  },

  prevScene: () => {
    const { config, currentSceneIndex } = get();
    const n = (currentSceneIndex - 1 + config.scenes.length) % config.scenes.length;
    set({ currentSceneId: config.scenes[n].id, currentSceneIndex: n, showInfoPanel: false });
  },

  toggleFullscreen: () => set(s => ({ isFullscreen: !s.isFullscreen })),
  toggleFloorPlan: () => set(s => ({ showFloorPlan: !s.showFloorPlan })),
  toggleSceneList: () => set(s => ({ showSceneList: !s.showSceneList })),
  toggleAutoRotate: () => set(s => ({ autoRotate: !s.autoRotate })),
  setLoading: (v) => set({ isLoading: v }),
  setTransitioning: (v) => set({ isTransitioning: v }),
  showInfo: (title, description) => set({ showInfoPanel: true, infoPanelData: { title, description } }),
  hideInfo: () => set({ showInfoPanel: false, infoPanelData: null }),
}));
