# Branding — [Constructora]

Logos de la constructora cliente.

## Archivos esperados (minimo requerido)

- logo-constructora-white.png   Logo blanco sobre fondo oscuro (PNG, fondo transparente)
- logo-constructora.svg         Logo vectorial (opcional pero recomendado)

## Archivos opcionales para co-branding MIESGROUP

- logo-miesgroup-white.png      Logo MIESGROUP blanco
- logo-miesgroup.svg            Logo MIESGROUP vectorial

## Especificaciones

- PNG: fondo transparente, minimo 400x200 px
- SVG: vectorial, sin rasterizacion
- Nombres: minusculas, guiones, sin espacios

## Ruta de uso en tour.config.ts

const BRAND = (path: string) => assetPath(`/projects/<constructora>/branding/${path}`);
logo: BRAND('logo-constructora-white.png')
