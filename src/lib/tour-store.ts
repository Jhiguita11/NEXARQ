'use client';

import { create } from 'zustand';
import { TourData, SceneData, HotspotData, FloorPlanRoom } from './tour-types';
import { defaultTour } from './tour-data';

interface TourState {
  tour: TourData;
  currentSceneId: string;
  currentSceneIndex: number;
  isFullscreen: boolean;
  showFloorPlan: boolean;
  showSceneList: boolean;
  autoRotate: boolean;
  isEditMode: boolean;
  editingHotspot: HotspotData | null;
  showInfoPanel: boolean;
  infoPanelContent: string;
  isLoading: boolean;

  // Actions
  setCurrentScene: (sceneId: string) => void;
  nextScene: () => void;
  prevScene: () => void;
  toggleFullscreen: () => void;
  toggleFloorPlan: () => void;
  toggleSceneList: () => void;
  toggleAutoRotate: () => void;
  toggleEditMode: () => void;
  setEditingHotspot: (hotspot: HotspotData | null) => void;
  addHotspot: (sceneId: string, hotspot: HotspotData) => void;
  updateHotspot: (sceneId: string, hotspotId: string, updates: Partial<HotspotData>) => void;
  removeHotspot: (sceneId: string, hotspotId: string) => void;
  showInfo: (text: string) => void;
  hideInfo: () => void;
  updateFloorPlanRoom: (roomId: string, updates: Partial<FloorPlanRoom>) => void;
  setTour: (tour: TourData) => void;
  setSceneView: (sceneId: string, pitch: number, yaw: number, hfov: number) => void;
}

export const useTourStore = create<TourState>((set, get) => ({
  tour: defaultTour,
  currentSceneId: 'scene-hallway',
  currentSceneIndex: 0,
  isFullscreen: false,
  showFloorPlan: true,
  showSceneList: false,
  autoRotate: true,
  isEditMode: false,
  editingHotspot: null,
  showInfoPanel: false,
  infoPanelContent: '',
  isLoading: false,

  setCurrentScene: (sceneId: string) => {
    const { tour } = get();
    const index = tour.scenes.findIndex(s => s.id === sceneId);
    if (index !== -1) {
      set({ currentSceneId: sceneId, currentSceneIndex: index, showInfoPanel: false });
    }
  },

  nextScene: () => {
    const { tour, currentSceneIndex } = get();
    const nextIndex = (currentSceneIndex + 1) % tour.scenes.length;
    set({
      currentSceneId: tour.scenes[nextIndex].id,
      currentSceneIndex: nextIndex,
      showInfoPanel: false,
    });
  },

  prevScene: () => {
    const { tour, currentSceneIndex } = get();
    const prevIndex = (currentSceneIndex - 1 + tour.scenes.length) % tour.scenes.length;
    set({
      currentSceneId: tour.scenes[prevIndex].id,
      currentSceneIndex: prevIndex,
      showInfoPanel: false,
    });
  },

  toggleFullscreen: () => set(s => ({ isFullscreen: !s.isFullscreen })),
  toggleFloorPlan: () => set(s => ({ showFloorPlan: !s.showFloorPlan })),
  toggleSceneList: () => set(s => ({ showSceneList: !s.showSceneList })),
  toggleAutoRotate: () => set(s => ({ autoRotate: !s.autoRotate })),
  toggleEditMode: () => set(s => ({ isEditMode: !s.isEditMode, editingHotspot: null })),

  setEditingHotspot: (hotspot) => set({ editingHotspot: hotspot }),

  addHotspot: (sceneId, hotspot) => {
    const { tour } = get();
    const updatedScenes = tour.scenes.map(scene =>
      scene.id === sceneId
        ? { ...scene, hotspots: [...scene.hotspots, hotspot] }
        : scene
    );
    set({ tour: { ...tour, scenes: updatedScenes } });
  },

  updateHotspot: (sceneId, hotspotId, updates) => {
    const { tour } = get();
    const updatedScenes = tour.scenes.map(scene =>
      scene.id === sceneId
        ? {
            ...scene,
            hotspots: scene.hotspots.map(h =>
              h.id === hotspotId ? { ...h, ...updates } : h
            ),
          }
        : scene
    );
    set({ tour: { ...tour, scenes: updatedScenes } });
  },

  removeHotspot: (sceneId, hotspotId) => {
    const { tour } = get();
    const updatedScenes = tour.scenes.map(scene =>
      scene.id === sceneId
        ? { ...scene, hotspots: scene.hotspots.filter(h => h.id !== hotspotId) }
        : scene
    );
    set({ tour: { ...tour, scenes: updatedScenes } });
  },

  showInfo: (text) => set({ showInfoPanel: true, infoPanelContent: text }),
  hideInfo: () => set({ showInfoPanel: false, infoPanelContent: '' }),

  updateFloorPlanRoom: (roomId, updates) => {
    const { tour } = get();
    const updatedRooms = tour.floorPlan.rooms.map(room =>
      room.id === roomId ? { ...room, ...updates } : room
    );
    set({
      tour: { ...tour, floorPlan: { ...tour.floorPlan, rooms: updatedRooms } },
    });
  },

  setTour: (tour) => set({ tour, currentSceneId: tour.scenes[0]?.id || '', currentSceneIndex: 0 }),

  setSceneView: (sceneId, pitch, yaw, hfov) => {
    const { tour } = get();
    const updatedScenes = tour.scenes.map(scene =>
      scene.id === sceneId
        ? { ...scene, defaultView: { pitch, yaw, hfov } }
        : scene
    );
    set({ tour: { ...tour, scenes: updatedScenes } });
  },
}));
