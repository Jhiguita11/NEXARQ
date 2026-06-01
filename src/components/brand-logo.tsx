'use client';

import type { CSSProperties } from 'react';
import { assetPath } from '@/lib/asset-path';

const LOGO = assetPath('/projects/melendez/branding/LogoValleAltoSinFondo.png');

interface Props {
  className?: string;
  style?: CSSProperties;
  /** Color de relleno del logo (default: beige de marca). */
  color?: string;
}

/**
 * Logo Valle Alto teñido con un color sólido mediante mask-image.
 * Da el color exacto (#E8D9B0 por defecto) manteniendo la forma y el aspect ratio (469×335).
 * Define solo width o height en `style`/`className`; la otra dimensión se calcula sola.
 */
export default function BrandLogo({ className, style, color = '#E8D9B0' }: Props) {
  return (
    <span
      role="img"
      aria-label="Valle Alto"
      className={className}
      style={{
        display: 'block',
        aspectRatio: '469 / 335',
        backgroundColor: color,
        maskImage: `url("${LOGO}")`,
        WebkitMaskImage: `url("${LOGO}")`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        ...style,
      }}
    />
  );
}
