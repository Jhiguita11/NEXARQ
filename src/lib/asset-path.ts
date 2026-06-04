// Prefijo base de los assets. Debe coincidir con el basePath de next.config.ts.
// Despliegue en la RAIZ del dominio -> vacio. Si se publica bajo subcarpeta
// (ej. "/valle-alto"), poner ese mismo valor aqui.
const base = '';

export function assetPath(path: string): string {
  return `${base}${path}`;
}
