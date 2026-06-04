// Prefijo base de los assets. DEBE coincidir con el basePath de next.config.ts.
// Se controla con la misma variable de entorno:
//   • GitHub Pages -> NEXT_PUBLIC_BASE_PATH="/NEXARQ"
//   • Raiz dominio -> sin variable (vacio)
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function assetPath(path: string): string {
  return `${base}${path}`;
}
