// Prefijo base de los assets. DEBE coincidir con el basePath de next.config.ts.
// Se controla con la misma variable de entorno:
//   • GitHub Pages -> NEXT_PUBLIC_BASE_PATH="/NEXARQ"
//   • Raiz dominio -> sin variable (vacio)
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function assetPath(path: string): string {
  return `${base}${path}`;
}

// Convierte la URL de un panorama a su version movil (4000px), ubicada en
// una subcarpeta `mobile/` junto al original. Ej:
//   .../panoramas/tipo-a/sala.jpg -> .../panoramas/tipo-a/mobile/sala.jpg
// Estas versiones las genera scripts/generate-mobile-panoramas.js y el viewer
// las usa en dispositivos moviles para un recorrido mas fluido.
export function mobilePanorama(url: string): string {
  const i = url.lastIndexOf('/');
  if (i === -1) return url;
  return `${url.slice(0, i)}/mobile${url.slice(i)}`;
}
