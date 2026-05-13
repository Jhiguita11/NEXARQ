export interface HotspotData {
  id: string;
  pitch: number;
  yaw: number;
  type: 'scene' | 'info' | 'url';
  text: string;
  targetSceneId?: string;
  url?: string;
  color?: string;
  icon?: string;
}

export interface SceneData {
  id: string;
  name: string;
  panoramaUrl: string;
  hotspots: HotspotData[];
  mapPosition: { x: number; y: number };
  defaultView: { pitch: number; yaw: number; hfov: number };
  description?: string;
}

export interface FloorPlanRoom {
  id: string;
  sceneId: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  strokeColor: string;
  labelColor?: string;
}

export interface FloorPlanData {
  width: number;
  height: number;
  bgColor: string;
  rooms: FloorPlanRoom[];
  connections?: { from: string; to: string }[];
}

export interface TourData {
  id: string;
  name: string;
  description: string;
  brandLogo?: string;
  brandName?: string;
  scenes: SceneData[];
  floorPlan: FloorPlanData;
  autoRotate: boolean;
  autoRotateSpeed: number;
  showFloorPlan: boolean;
  showControls: boolean;
}
