# Arch360 — Plantilla de Recorridos Virtuales 360°

Plantilla de tours arquitectónicos 360° producida por **MIESGROUP**.
Construida con Next.js (export estático) + TypeScript + Tailwind + Zustand + Pannellum.

El proyecto **Valle Alto (Constructora Meléndez)** queda incluido como **ejemplo de referencia** completo y funcional. Úsalo como guía y, cuando ya no lo necesites, elimínalo.

---

## 🚀 Puesta en marcha

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo en http://localhost:3000
npm run build      # export estático → carpeta out/
npm run preview    # previsualizar el build (out/) localmente
```

> Al **copiar esta carpeta** a otro equipo/Visual Studio, **NO copies** `node_modules/` ni `out/` (se regeneran). Luego corre `npm install`.

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx          # Metadata SEO + Open Graph (PERSONALIZAR por proyecto)
│   ├── page.tsx            # Orquestador principal del tour
│   └── globals.css         # Estilos globales + overrides de Pannellum
│
├── components/             # Componentes de UI del tour
│   ├── pano-viewer.tsx     # Visor 360° (Pannellum) + hotspots + animaciones playback
│   ├── floor-plan.tsx      # Plano interactivo (SVG) con radar de dirección
│   ├── tour-controls.tsx   # Barra inferior: navegación, zoom, fullscreen, play
│   ├── scene-selector.tsx  # Selector de escenas
│   ├── left-sidebar.tsx    # Menú lateral + aviso legal + branding
│   ├── building-selector.tsx # Pantalla de inicio (selección de apartamento)
│   ├── splash-screen.tsx   # Animación de marca al cargar
│   ├── tour-welcome.tsx    # Bienvenida por apartamento
│   ├── brand-badge.tsx     # Badge de marca (esquina superior)
│   ├── brand-logo.tsx      # Logo teñido al color de marca (mask-image)
│   ├── cta-button.tsx      # Botón "Contáctanos"
│   ├── media-gallery.tsx   # Galería de renders / plantas
│   ├── variant-switcher.tsx# Cambio de variante (ej. estudio ↔ alcoba)
│   ├── playback-overlay.tsx# Modo reproducción (auto-tour) + intro
│   ├── debug-panel.tsx     # Calibrador de hotspots (solo en dev / ?debug=1)
│   └── ui/                 # Primitivos shadcn en uso (toast)
│
├── lib/
│   ├── tour-store.ts       # Estado global (Zustand). ⚠ IMPORTA EL CONFIG ACTIVO
│   ├── tour-types.ts       # Tipos TypeScript de toda la configuración
│   ├── asset-path.ts       # Resuelve rutas con basePath (GitHub Pages)
│   ├── use-tour-keyboard.ts# Atajos de teclado (desktop)
│   ├── use-playback.ts     # Motor del modo reproducción
│   ├── use-inactivity-playback.ts # Auto-activación tipo screensaver
│   ├── use-scene-analytics.ts     # Tiempo por escena → dataLayer (GTM)
│   ├── playback-utils.ts   # Cálculos de animación del modo reproducción
│   └── utils.ts            # Utilidades varias (cn, etc.)
│
└── projects/               # ⭐ Configuración POR PROYECTO
    ├── _template/          # Plantilla base — cópiala para cada proyecto nuevo
    │   ├── tour.config.ts  # Estructura del tour (escenas, hotspots, plano)
    │   └── metadata.ts     # Metadata SEO del proyecto
    └── melendez/valle-alto/# Ejemplo de referencia (Constructora Meléndez)
        ├── tour.config.ts
        ├── metadata.ts
        └── README.md

public/
└── projects/               # ⭐ Assets POR PROYECTO (imágenes)
    ├── _template/          # Estructura de carpetas modelo
    └── <constructora>/<proyecto>/
        ├── panoramas/      # Panoramas 360° equirectangulares (.jpg)
        ├── floor-plans/    # Imágenes de planos
        ├── images/         # Renders, exteriores
        └── branding/       # Logos de la constructora
```

---

## 🆕 Crear un proyecto nuevo (paso a paso)

### 1. Duplica la configuración
Copia `src/projects/_template/` a `src/projects/<constructora>/<proyecto>/`
(ej. `src/projects/ospinas/reserva-del-rio/`).

### 2. Duplica los assets
Copia `public/projects/_template/` a `public/projects/<constructora>/<proyecto>/`
y coloca ahí tus panoramas, planos, renders y logos.

### 3. Llena `tour.config.ts`
Edita escenas, hotspots, plano (`floorPlan`), galería y `playbackAnimations`.
La estructura completa está tipada en `src/lib/tour-types.ts`.
Para calibrar los `pitch`/`yaw` de los hotspots, abre el tour con `?debug=1`.

### 4. Activa el proyecto
En **`src/lib/tour-store.ts`** (línea ~4) cambia el import al nuevo config:
```ts
import tourConfig from '@/projects/<constructora>/<proyecto>/tour.config';
```

### 5. Metadata SEO
En **`src/app/layout.tsx`** actualiza `title`, `description`, `keywords` y la
imagen de Open Graph (`openGraph.images` / `twitter.images`).

### 6. Deploy (GitHub Pages)
En **`next.config.ts`** cambia `repoName` por el nombre exacto del repositorio:
```ts
const repoName = "NOMBRE-DEL-REPO";
```
Esto ajusta `basePath` y `assetPrefix` para que los assets carguen bien en producción.

---

## 🎨 Branding (color y logos)

El proyecto de referencia usa el beige **`#E8D9B0`** y el logo de Valle Alto.
Para rebrandear a un proyecto totalmente distinto, cambia:

| Qué | Dónde |
|---|---|
| **Color de marca** | Buscar y reemplazar `#E8D9B0` (y su versión `rgba(232,217,176,…)`) en `src/components/` y `src/app/globals.css` |
| **Logo del proyecto** | `src/components/brand-logo.tsx` (ruta del PNG) + el archivo en `public/projects/.../branding/` |
| **Logo constructora / productor** | `building-selector.tsx`, `left-sidebar.tsx`, `splash-screen.tsx` |
| **Textos de marca** | `layout.tsx`, `splash-screen.tsx`, aviso legal en `left-sidebar.tsx` |

> 💡 El componente `brand-logo.tsx` tiñe cualquier PNG al color de marca con `mask-image`, manteniendo proporciones. Reutilízalo para el logo del nuevo proyecto.

---

## ⌨️ Atajos y modos

- **Flechas ← →** — escena anterior / siguiente · **1–9** — ir a escena · **F** — fullscreen · **R** — auto-rotar · **M** — plano
- **Modo reproducción** — botón ▶ en la barra inferior, o automático tras 60s de inactividad (screensaver). Animaciones definidas en `playbackAnimations` de cada escena.
- **`?debug=1`** — calibrador de hotspots (arrastrar burbujas, copiar coordenadas)
- **`?preview=<apt>&scene=<id>`** — abre directo en una escena (para compartir)

---

## 🥽 Modo Realidad Virtual (Oculus / Meta Quest)

Además del visor Pannellum (desktop/móvil), hay un **modo VR paralelo con A-Frame + WebXR**
que reutiliza el mismo `tour.config` sin tocar el visor principal.

- **Acceso:** botón "Realidad Virtual" en el menú lateral, o la ruta `/vr/`
  (acepta `?apt=<id>` para elegir la tipología; por defecto usa la primera).
- **En el Quest:** abre la URL en el navegador de Meta Quest y pulsa el botón **"Enter VR"**
  (lo añade A-Frame automáticamente). Mira alrededor con la cabeza y usa los **mandos**
  (láser apuntador) para hacer clic en los hotspots y cambiar de escena. También hay
  retícula de mirada como respaldo.
- **Archivos:** `src/components/vr-tour.tsx` (escena A-Frame) y `src/app/vr/page.tsx` (ruta).

> ⚙️ **Calibración:** como la conversión de coordenadas pitch/yaw entre Pannellum y A-Frame
> puede variar, en `vr-tour.tsx` hay constantes para ajustar al probar en el dispositivo:
> `YAW_OFFSET` (rota los hotspots), `SKY_MIRRORED` (espeja el panorama) y `HOTSPOT_RADIUS`.
> A-Frame se carga desde CDN (no pesa en el bundle principal).

---

## 🧱 Stack

Next.js 16 · React 19 · TypeScript · Tailwind 4 · Zustand · Pannellum (CDN, visor 2D) · A-Frame + WebXR (CDN, modo VR) · Framer Motion · lucide-react
