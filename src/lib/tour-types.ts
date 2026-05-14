// ─── Theme Configuration ──────────────────────────────────────────────
export interface ThemeConfig {
  primary: string;
  secondary: string;
  panelBg: string;
  textPrimary: string;
  textMuted: string;
  borderColor: string;
  fontFamily: string;
}

// ─── Hotspot ──────────────────────────────────────────────────────────
export interface HotspotConfig {
  id: string;
  pitch: number;
  yaw: number;
  type: 'scene' | 'info' | 'url';
  label: string;
  description?: string;
  targetSceneId?: string;
  url?: string;
}

// ─── Scene ────────────────────────────────────────────────────────────
export interface SceneConfig {
  id: string;
  name: string;
  panorama: string;
  description: string;
  thumbnail?: string;
  defaultView: {
    pitch: number;
    yaw: number;
    hfov: number;
  };
  hotspots: HotspotConfig[];
}

// ─── Floor Plan Room ─────────────────────────────────────────────────
export interface FloorPlanRoomConfig {
  id: string;
  sceneId: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  adjacentTo?: string[];
}

// ─── Floor Plan ───────────────────────────────────────────────────────
export interface FloorPlanConfig {
  width: number;
  height: number;
  background: string;
  rooms: FloorPlanRoomConfig[];
}

// ─── Brand Config ─────────────────────────────────────────────────────
export interface BrandConfig {
  name: string;
  tagline: string;
  logo: string;
  website?: string;
}

// ─── Apartment ────────────────────────────────────────────────────────
export interface ApartmentConfig {
  /** Unique apartment ID */
  id: string;
  /** Display name (e.g. "Apto 101") */
  name: string;
  /** Short description */
  description: string;
  /** Floor number (for building visualization) */
  floor: number;
  /** Position index on the floor (0-based, left to right) */
  position: number;
  /** Number of bedrooms */
  bedrooms: number;
  /** Number of bathrooms */
  bathrooms: number;
  /** Area in m² */
  area: number;
  /** Optional hotspot position override (% of building image) */
  hotspotX?: number;
  hotspotY?: number;
  /** Scenes for this apartment */
  scenes: SceneConfig[];
  /** Floor plan for this apartment */
  floorPlan: FloorPlanConfig;
}

// ─── Building ─────────────────────────────────────────────────────────
export interface BuildingConfig {
  /** Unique building ID */
  id: string;
  /** Display name (e.g. "Torre A") */
  name: string;
  /** Number of floors */
  floors: number;
  /** Apartments per floor */
  apartmentsPerFloor: number;
  /** List of apartments */
  apartments: ApartmentConfig[];
}

// ─── Tour Config (ROOT) ──────────────────────────────────────────────
export interface TourConfig {
  brand: BrandConfig;
  theme: ThemeConfig;
  /** Buildings with apartments */
  buildings: BuildingConfig[];
  /** Auto-rotate speed (0 = off, negative = clockwise) */
  autoRotateSpeed: number;
  /** Show floor plan by default */
  showFloorPlan: boolean;
  /** Show welcome screen on load */
  showWelcome: boolean;
}
