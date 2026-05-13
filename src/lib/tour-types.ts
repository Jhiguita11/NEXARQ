// ─── Theme Configuration ──────────────────────────────────────────────
export interface ThemeConfig {
  /** Primary accent color (hex) — used for highlights, buttons, active states */
  primary: string;
  /** Secondary accent color (hex) */
  secondary: string;
  /** Background overlay color for panels */
  panelBg: string;
  /** Text color on panels */
  textPrimary: string;
  /** Muted text color */
  textMuted: string;
  /** Border color for panels */
  borderColor: string;
  /** CSS font family string */
  fontFamily: string;
}

// ─── Hotspot ──────────────────────────────────────────────────────────
export interface HotspotConfig {
  /** Unique ID */
  id: string;
  /** Vertical angle (-90 to 90) */
  pitch: number;
  /** Horizontal angle (-180 to 180) */
  yaw: number;
  /** Hotspot type */
  type: 'scene' | 'info' | 'url';
  /** Display text / tooltip label */
  label: string;
  /** Description (shown in info panel) */
  description?: string;
  /** Target scene ID (for type="scene") */
  targetSceneId?: string;
  /** External URL (for type="url") */
  url?: string;
}

// ─── Scene ────────────────────────────────────────────────────────────
export interface SceneConfig {
  /** Unique scene ID */
  id: string;
  /** Display name */
  name: string;
  /** Path to equirectangular panorama image */
  panorama: string;
  /** Brief description */
  description: string;
  /** Thumbnail image path (optional, falls back to panorama) */
  thumbnail?: string;
  /** Default camera view */
  defaultView: {
    pitch: number;  // -90 to 90
    yaw: number;    // -180 to 180
    hfov: number;   // 30 to 120 (field of view)
  };
  /** Hotspots in this scene */
  hotspots: HotspotConfig[];
}

// ─── Floor Plan Room ─────────────────────────────────────────────────
export interface FloorPlanRoomConfig {
  /** Unique room ID */
  id: string;
  /** Which scene this room maps to */
  sceneId: string;
  /** Label shown on the floor plan */
  label: string;
  /** Room rectangle position/size (in SVG units) */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Room fill color (CSS) */
  fill: string;
  /** Room stroke/border color (CSS) */
  stroke: string;
}

// ─── Floor Plan ───────────────────────────────────────────────────────
export interface FloorPlanConfig {
  /** SVG viewBox width */
  width: number;
  /** SVG viewBox height */
  height: number;
  /** Background color */
  background: string;
  /** Rooms to draw */
  rooms: FloorPlanRoomConfig[];
}

// ─── Brand Config ─────────────────────────────────────────────────────
export interface BrandConfig {
  /** Brand / company name */
  name: string;
  /** Tagline shown on welcome screen */
  tagline: string;
  /** Logo image path (or empty string for none) */
  logo: string;
  /** Primary URL (for links) */
  website?: string;
}

// ─── Tour Config (ROOT) ──────────────────────────────────────────────
export interface TourConfig {
  /** Brand information */
  brand: BrandConfig;
  /** Visual theme */
  theme: ThemeConfig;
  /** Ordered list of scenes */
  scenes: SceneConfig[];
  /** Floor plan configuration */
  floorPlan: FloorPlanConfig;
  /** Auto-rotate speed (0 = off, negative = clockwise) */
  autoRotateSpeed: number;
  /** Show floor plan by default */
  showFloorPlan: boolean;
  /** Show welcome screen on load */
  showWelcome: boolean;
}
