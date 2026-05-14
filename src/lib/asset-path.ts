const base = process.env.NODE_ENV === 'production' ? '/NEXARQ' : '';

export function assetPath(path: string): string {
  return `${base}${path}`;
}
