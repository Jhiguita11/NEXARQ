// Prefijo base de los assets de la app (panoramas, hero, logos):
//   • GitHub Pages    -> NEXT_PUBLIC_BASE_PATH="/NEXARQ" (rutas absolutas con subpath)
//   • Raíz de dominio  -> sin variable (rutas absolutas desde /)
//   • Entrega PORTABLE -> NEXT_PUBLIC_PORTABLE_BUILD="1" -> base '.' -> rutas
//     RELATIVAS al documento ('./projects/x.jpg'), para servir en CUALQUIER
//     subcarpeta. Va de la mano de assetPrefix "./" en next.config (igual que
//     el proyecto Mirriñao). Requiere trailingSlash:true.
const portable = process.env.NEXT_PUBLIC_PORTABLE_BUILD === '1';
const base = portable ? '.' : process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function assetPath(path: string): string {
  return `${base}${path}`;
}

// Convierte la URL de un panorama a su version movil (3000px), ubicada en
// una subcarpeta `mobile/` junto al original. Ej:
//   .../panoramas/tipo-a/sala.jpg -> .../panoramas/tipo-a/mobile/sala.jpg
// Estas versiones las genera scripts/generate-mobile-panoramas.js y el viewer
// las usa en dispositivos moviles para un recorrido mas fluido.
export function mobilePanorama(url: string): string {
  const i = url.lastIndexOf('/');
  if (i === -1) return url;
  return `${url.slice(0, i)}/mobile${url.slice(i)}`;
}
